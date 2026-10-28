import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import readline from "node:readline";
import { buildCodexEnvironment } from "./config.mjs";

function sandboxPolicy(name, cwd) {
  if (name === "read-only") return { type: "readOnly" };
  if (name === "danger-full-access") return { type: "dangerFullAccess" };
  return { type: "workspaceWrite", writableRoots: [cwd], networkAccess: false };
}

export function normalizeAppServerNotification(message) {
  if (!message || typeof message !== "object") return [];
  const params = message.params || {};
  if (message.method === "turn/started") {
    return [{ type: "status", status: "running", text: "Codex 正在处理" }];
  }
  if (message.method === "turn/completed") {
    const turn = params.turn || {};
    if (turn.status === "failed") {
      return [{ type: "error", text: turn.error?.message || "Codex 处理失败" }];
    }
    return [{ type: "status", status: "idle", text: turn.status === "interrupted" ? "任务已停止" : "处理完成" }];
  }
  if (message.method === "error") {
    return [{ type: "error", text: params.message || params.error || "Codex app-server 返回错误" }];
  }
  if (message.method !== "item/completed") return [];

  const item = params.item || {};
  if (item.type === "agentMessage" && item.text) {
    return [{ type: "assistant_message", text: item.text, sourceItemId: item.id || null }];
  }
  if (item.type === "fileChange") {
    const files = Array.isArray(item.changes)
      ? item.changes.map((change) => change.path || change.file || "").filter(Boolean)
      : [];
    return [{ type: "progress", kind: "file", text: "文件已更新", detail: files.join("\n"), ok: item.status !== "failed" }];
  }
  if (item.type === "mcpToolCall" || item.type === "dynamicToolCall") {
    return [{
      type: "progress",
      kind: "tool",
      text: item.status === "failed" ? "工具调用失败" : "工具调用完成",
      detail: [item.server, item.tool].filter(Boolean).join(" / "),
      ok: item.status !== "failed",
    }];
  }
  return [];
}
export class AppServerClient extends EventEmitter {
  constructor({ codexBin, codexBinArgs = [], cwd, version = "0.4.3", stderr = null, onServerRequest = null }) {
    super();
    this.codexBin = codexBin;
    this.codexBinArgs = codexBinArgs;
    this.cwd = cwd;
    this.version = version;
    this.stderr = stderr;
    this.onServerRequest = onServerRequest;
    this.child = null;
    this.nextId = 1;
    this.pending = new Map();
    this.ready = false;
  }

  async start() {
    if (this.child) return;
    this.child = spawn(this.codexBin, [...this.codexBinArgs, "app-server", "--listen", "stdio://"], {
      cwd: this.cwd,
      env: buildCodexEnvironment(),
      windowsHide: true,
      shell: false,
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.child.once("error", (error) => this.failAll(error));
    this.child.once("exit", (code, signal) => {
      this.ready = false;
      this.failAll(new Error(`app-server exited (${code ?? signal})`));
      this.emit("exit", { code, signal });
    });

    const lines = readline.createInterface({ input: this.child.stdout });
    lines.on("line", (line) => this.handleLine(line));
    const errorLines = readline.createInterface({ input: this.child.stderr });
    errorLines.on("line", (line) => {
      if (this.stderr) this.stderr(line);
    });

    await this.request("initialize", {
      clientInfo: { name: "codex-pocket", title: "Codex Pocket", version: this.version },
      capabilities: { experimentalApi: true },
    }, 60_000);
    this.notify("initialized");
    this.ready = true;
  }

  handleLine(line) {
    const text = String(line || "").trim();
    if (!text.startsWith("{")) return;
    let message;
    try {
      message = JSON.parse(text);
    } catch {
      return;
    }

    if (message.id !== undefined && message.method) {
      Promise.resolve(this.onServerRequest?.(message))
        .then((result) => {
          if (result === undefined || result === null) {
            this.send({ id: message.id, error: { code: -32601, message: `Codex Pocket does not handle ${message.method}` } });
          } else {
            this.send({ id: message.id, result });
          }
        })
        .catch((error) => {
          this.send({ id: message.id, error: { code: -32603, message: error.message } });
        });
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

  send(message) {
    if (!this.child?.stdin?.writable) throw new Error("app-server is not running");
    this.child.stdin.write(`${JSON.stringify(message)}\n`);
  }

  notify(method, params) {
    this.send(params === undefined ? { method } : { method, params });
  }

  request(method, params, timeoutMs = 60_000) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`app-server request timed out: ${method}`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      try {
        this.send({ id, method, params });
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  async startThread({ cwd, model, sandbox, developerInstructions, dynamicTools, approvalPolicy = "on-request" }) {
    return this.request("thread/start", {
      cwd,
      model: model || null,
      sandbox: sandbox || null,
      approvalPolicy,
      developerInstructions: developerInstructions || null,
      dynamicTools: dynamicTools || null,
    }, 120_000);
  }

  async resumeThread(threadId, { cwd, model, sandbox, developerInstructions, approvalPolicy = "on-request" } = {}) {
    const params = { threadId, approvalPolicy };
    if (cwd) params.cwd = cwd;
    if (model) params.model = model;
    if (sandbox) params.sandbox = sandbox;
    if (developerInstructions) params.developerInstructions = developerInstructions;
    return this.request("thread/resume", params, 120_000);
  }

  async startTurn({ threadId, text, cwd, model, approvalPolicy = "on-request" }) {
    return this.request("turn/start", {
      threadId,
      input: [{ type: "text", text }],
      cwd: cwd || null,
      model: model || null,
      approvalPolicy,
    }, 120_000);
  }

  async steerTurn(threadId, expectedTurnId, text, timeoutMs = 10_000) {
    return this.request("turn/steer", {
      threadId,
      expectedTurnId,
      input: [{ type: "text", text }],
    }, timeoutMs);
  }

  async interruptTurn(threadId, turnId) {
    return this.request("turn/interrupt", { threadId, turnId }, 30_000);
  }

  async listModels(params = {}) {
    return this.request("model/list", params, 60_000);
  }

  async listThreads(params = {}) {
    return this.request("thread/list", params, 60_000);
  }

  async revertThread(threadId, beforeTurnId) {
    return this.request("thread/revert", { threadId, beforeTurnId }, 120_000);
  }

  async injectThreadItems(threadId, items) {
    return this.request("thread/inject_items", { threadId, items }, 30_000);
  }

  async archiveThread(threadId) {
    return this.request("thread/archive", { threadId }, 30_000);
  }

  async unarchiveThread(threadId) {
    return this.request("thread/unarchive", { threadId }, 30_000);
  }

  async updateThreadReadState(threadId, expectedRevision, operation = "read") {
    return this.request("thread/readState/update", {
      threadId,
      expectedRevision,
      operation: { type: operation },
    }, 30_000);
  }

  async readThread(threadId, includeTurns = true) {
    return this.request("thread/read", { threadId, includeTurns }, 60_000);
  }

  failAll(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }

  async stop() {
    if (!this.child) return;
    const child = this.child;
    this.child = null;
    try {
      child.kill();
    } catch {}
    await new Promise((resolve) => {
      if (child.exitCode !== null) return resolve();
      const timer = setTimeout(resolve, 2000);
      child.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }
}









