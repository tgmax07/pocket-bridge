import { EventEmitter } from "node:events";

function parseSseBlock(block) {
  const data = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function readSse(stream, onMessage) {
  if (!stream) return;
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) >= 0) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const message = parseSseBlock(block);
        if (message) await onMessage(message);
      }
    }
    buffer += decoder.decode();
    if (buffer.trim()) {
      const message = parseSseBlock(buffer);
      if (message) await onMessage(message);
    }
  } finally {
    reader.releaseLock();
  }
}

export class WorkBuddyAcpClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.endpoint = options.endpoint || "http://127.0.0.1:11616/api/v1/acp";
    this.clientInfo = options.clientInfo || {
      name: "codex-pocket",
      title: "Codex Pocket",
      version: "0.6.75",
    };
    this.onServerRequest = options.onServerRequest || null;
    this.connectionId = "";
    this.sessionToken = "";
    this.getController = null;
    this.getResponse = null;
    this.connected = false;
    this.closedByUser = false;
    this.connectPromise = null;
    this.nextId = 1;
    this.pending = new Map();
    this.serverRequests = new Set();
    this.handledServerRequests = new Set();
  }

  get headers() {
    return {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      "acp-connection-id": this.connectionId,
      Authorization: `Bearer ${this.sessionToken}`,
    };
  }

  async connect() {
    if (this.connected) return this;
    if (this.connectPromise) return this.connectPromise;
    this.closedByUser = false;
    this.connectPromise = (async () => {
      this.getController = new AbortController();
      const response = await fetch(this.endpoint, {
        method: "GET",
        headers: { Accept: "application/json, text/event-stream" },
        signal: this.getController.signal,
        cache: "no-store",
      });
      if (!response.ok || !response.body) {
        const error = new Error(`WorkBuddy ACP connection failed (${response.status})`);
        error.statusCode = 503;
        throw error;
      }
      this.connectionId = response.headers.get("acp-connection-id") || "";
      this.sessionToken = response.headers.get("acp-session-token") || "";
      if (!this.connectionId || !this.sessionToken) {
        throw new Error("WorkBuddy ACP did not return connection credentials");
      }
      this.getResponse = response;
      this.connected = true;
      readSse(response.body, (message) => this.handleMessage(message)).catch((error) => {
        if (!this.closedByUser) this.emit("stream-error", error);
      });
      const init = await this.sendRequest("initialize", {
        protocolVersion: 1,
        clientCapabilities: {
          fs: { readTextFile: false, writeTextFile: false },
          terminal: false,
        },
        clientInfo: this.clientInfo,
      });
      this.capabilities = init || {};
      return this;
    })();
    try {
      return await this.connectPromise;
    } catch (error) {
      this.handleDisconnect(error);
      throw error;
    } finally {
      this.connectPromise = null;
    }
  }

  async handleMessage(message) {
    if (!message || typeof message !== "object") return;
    if (message.id !== undefined && message.method) {
      if (this.serverRequests.has(message.id) || this.handledServerRequests.has(message.id)) return;
      this.serverRequests.add(message.id);
      try {
        const result = await this.onServerRequest?.(message);
        await this.respond(message.id, result === undefined ? null : result);
      } catch (error) {
        await this.respondError(message.id, error.message || "WorkBuddy client error");
      } finally {
        this.serverRequests.delete(message.id);
        this.handledServerRequests.add(message.id);
      }
      return;
    }
    if (message.id !== undefined) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      else pending.resolve(message.result);
      return;
    }
    if (message.method) this.emit("notification", message);
  }

  async request(method, params, onUpdate = null, timeoutMs = 120_000) {
    await this.connect();
    return this.sendRequest(method, params, onUpdate, timeoutMs);
  }

  async sendRequest(method, params, onUpdate = null, timeoutMs = 120_000) {
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => {
      const timer = timeoutMs > 0
        ? setTimeout(() => {
            this.pending.delete(id);
            reject(new Error(`WorkBuddy ACP request timed out: ${method}`));
          }, timeoutMs)
        : null;
      this.pending.set(id, { resolve, reject, timer });
    });
    let response;
    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
        cache: "no-store",
      });
    } catch (error) {
      this.handleDisconnect(error);
      return promise;
    }
    if (!response.ok || !response.body) {
      const pending = this.pending.get(id);
      if (pending) {
        if (pending.timer) clearTimeout(pending.timer);
        this.pending.delete(id);
        pending.reject(new Error(`WorkBuddy ACP ${method} failed (${response.status})`));
      }
    } else {
      const consume = async (message) => {
        if (message.method) {
          if (message.id === undefined) onUpdate?.(message);
          await this.handleMessage(message);
          return;
        }
        await this.handleMessage(message);
      };
      const contentType = response.headers.get("content-type") || "";
      const streamDone = contentType.includes("application/json")
        ? response.json().then((message) => consume(message)).catch((error) => {
          const pending = this.pending.get(id);
          if (pending) {
            if (pending.timer) clearTimeout(pending.timer);
            this.pending.delete(id);
            pending.reject(error);
          }
        })
        : readSse(response.body, consume);
      streamDone.then(() => {
        const pending = this.pending.get(id);
        if (!pending) return;
        if (pending.timer) clearTimeout(pending.timer);
        this.pending.delete(id);
        pending.reject(new Error(`WorkBuddy ACP ${method} ended before a response`));
      }).catch((error) => {
        this.handleDisconnect(error);
      });
    }
    return promise;
  }

  async respond(id, result) {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ jsonrpc: "2.0", id, result }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`WorkBuddy ACP response failed (${response.status})`);
    if (!response.body) return;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      await this.handleMessage(await response.json());
      return;
    }
    void readSse(response.body, (message) => this.handleMessage(message)).catch((error) => {
      if (!this.closedByUser) this.emit("stream-error", error);
    });
  }

  async respondError(id, message) {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message } }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`WorkBuddy ACP error response failed (${response.status})`);
    if (!response.body) return;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      await this.handleMessage(await response.json());
      return;
    }
    void readSse(response.body, (item) => this.handleMessage(item)).catch((error) => {
      if (!this.closedByUser) this.emit("stream-error", error);
    });
  }

  async newSession({ cwd, mcpServers = [] }) {
    return this.request("session/new", { cwd, mcpServers }, null, 60_000);
  }

  async loadSession({ sessionId, cwd, mcpServers = [] }, onUpdate = null) {
    return this.request("session/load", { sessionId, cwd, mcpServers }, onUpdate, 120_000);
  }

  async setConfigOption(sessionId, configId, value) {
    return this.request("session/set_config_option", { sessionId, configId, value }, null, 30_000);
  }

  async setMode(sessionId, modeId) {
    return this.request("session/set_mode", { sessionId, modeId }, null, 30_000);
  }
  async prompt({ sessionId, text }, onUpdate = null) {
    return this.request("session/prompt", {
      sessionId,
      prompt: [{ type: "text", text }],
    }, onUpdate, 0);
  }

  async cancel(sessionId) {
    return this.request("session/cancel", { sessionId }, null, 30_000);
  }

  handleDisconnect(error) {
    if (!this.connected && !this.connectPromise) return;
    this.connected = false;
    this.getController?.abort();
    this.getController = null;
    this.getResponse = null;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
    this.emit("disconnect", error);
  }

  async close() {
    if (!this.connected) return;
    this.closedByUser = true;
    this.connected = false;
    this.getController?.abort();
    this.getController = null;
    this.getResponse = null;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new Error("WorkBuddy ACP connection closed"));
    }
    this.pending.clear();
  }
}
