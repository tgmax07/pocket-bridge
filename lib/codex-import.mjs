import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";

function cleanUserText(text) {
  let value = String(text || "").trim();
  const embedded = value.match(/<current_user_message>\s*([\s\S]*?)\s*<\/current_user_message>/i);
  if (embedded) value = embedded[1].trim();
  const ambient = value.match(/<in-app-browser-context[\s\S]*?<\/in-app-browser-context>\s*(?:##\s*My request:\s*)?([\s\S]*)/i);
  if (ambient) value = ambient[1].trim();
  if (/^<(environment_context|skills_instructions|permissions instructions|app-context|system-reminder)>/i.test(value)) return "";
  return value;
}

function messageText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => part?.text || part?.content || "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function itemMessage(item) {
  if (!item || typeof item !== "object") return null;
  if (item.type === "UserMessage") {
    const text = messageText(item.content);
    return text ? { id: item.id || null, role: "user", text: cleanUserText(text) } : null;
  }
  if (item.type === "AgentMessage") {
    const text = messageText(item.content);
    return text ? { id: item.id || null, role: "assistant", text } : null;
  }
  return null;
}

function responseItemMessage(payload) {
  if (!payload || payload.type !== "message") return null;
  const text = messageText(payload.content);
  if (!text) return null;
  if (payload.role === "user") return { id: payload.id || null, role: "user", text: cleanUserText(text) };
  if (payload.role === "assistant") return { id: payload.id || null, role: "assistant", text };
  return null;
}

async function walkJsonlFiles(root) {
  const files = [];
  async function walk(directory) {
    let entries;
    try {
      entries = await fsp.readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(fullPath);
    }
  }
  await walk(root);
  return files;
}

async function readSessionIndex(codexHome) {
  const result = new Map();
  const filePath = path.join(codexHome, "session_index.jsonl");
  try {
    const source = await fsp.readFile(filePath, "utf8");
    for (const line of source.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line);
        if (entry.id) result.set(entry.id, entry);
      } catch {}
    }
  } catch {}
  return result;
}

function internalSessionKind(meta) {
  const threadSource = String(meta?.thread_source || "").trim().toLowerCase();
  const nestedSubagent = meta?.source && typeof meta.source === "object" ? meta.source.subagent : null;
  const subagent = nestedSubagent && typeof nestedSubagent === "object" ? nestedSubagent.other : nestedSubagent;
  if (threadSource === "guardian_review" || String(subagent || "").trim().toLowerCase() === "guardian") {
    return "guardian_review";
  }
  return "";
}

async function readSummary(filePath, indexEntry) {
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let meta = null;
  let preview = "";
  let scanned = 0;
  try {
    for await (const line of lines) {
      scanned += 1;
      if (!line.trim()) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      if (entry.type === "session_meta") meta = entry.payload || null;
      if (!preview) {
        if (entry.type === "event_msg" && entry.payload?.type === "item_completed") {
          const message = itemMessage(entry.payload.item);
          if (message?.role === "user") preview = message.text;
        } else if (entry.type === "response_item") {
          const message = responseItemMessage(entry.payload);
          if (message?.role === "user") preview = message.text;
        }
      }
      if (meta && preview) break;
      if (scanned >= 120) break;
    }
  } finally {
    lines.close();
    stream.destroy();
  }

  const id = meta?.id || meta?.session_id || path.basename(filePath).match(/([0-9a-f]{8}-[0-9a-f-]{27,})\.jsonl$/i)?.[1];
  if (!id) return null;
  const stat = await fsp.stat(filePath);
  const title = (indexEntry?.thread_name || preview || "Codex 对话").replace(/\s+/g, " ").trim().slice(0, 80);
  return {
    id,
    title,
    preview: preview.slice(0, 240),
    cwd: meta?.cwd || "",
    source: meta?.source || "",
    originator: meta?.originator || "",
    modelProvider: meta?.model_provider || "",
    internalKind: internalSessionKind(meta),
    createdAt: meta?.timestamp || stat.birthtime.toISOString(),
    updatedAt: indexEntry?.updated_at || stat.mtime.toISOString(),
    filePath,
    size: stat.size,
  };
}

export class CodexSessionLibrary {
  constructor(codexHome) {
    this.codexHome = codexHome;
    this.sessionsDir = codexHome ? path.join(codexHome, "sessions") : "";
    this.entries = [];
    this.index = new Map();
    this.loadedAt = 0;
  }

  async refresh() {
    if (!this.sessionsDir) return;
    this.index = await readSessionIndex(this.codexHome);
    const paths = await walkJsonlFiles(this.sessionsDir);
    const stats = await Promise.all(paths.map(async (filePath) => {
      try {
        const stat = await fsp.stat(filePath);
        return { filePath, mtimeMs: stat.mtimeMs };
      } catch {
        return null;
      }
    }));
    stats.sort((a, b) => (b?.mtimeMs || 0) - (a?.mtimeMs || 0));
    this.entries = stats.filter(Boolean).slice(0, 300);
    this.loadedAt = Date.now();
  }

  async list({ limit = 30, importedBySessionId = new Map() } = {}) {
    if (!this.loadedAt || Date.now() - this.loadedAt > 30_000) await this.refresh();
    const result = [];
    const seen = new Set();
    for (const entry of this.entries) {
      const idHint = path.basename(entry.filePath).match(/([0-9a-f]{8}-[0-9a-f-]{27,})\.jsonl$/i)?.[1];
      if (idHint && seen.has(idHint)) continue;
      const summary = await readSummary(entry.filePath, idHint ? this.index.get(idHint) : null);
      if (!summary || summary.internalKind || seen.has(summary.id)) continue;
      seen.add(summary.id);
      result.push({
        ...summary,
        filePath: undefined,
        importedConversationId: importedBySessionId.get(summary.id) || null,
      });
      if (result.length >= limit) break;
    }
    return result;
  }

  async read(sessionId) {
    if (!this.loadedAt) await this.refresh();
    let item = this.entries.find((entry) => path.basename(entry.filePath).includes(sessionId));
    if (!item) {
      await this.refresh();
      item = this.entries.find((entry) => path.basename(entry.filePath).includes(sessionId));
    }
    if (!item) throw new Error("没有找到这个 Codex 会话");

    const eventMessages = [];
    const responseMessages = [];
    let meta = null;
    let createdAt = "";
    const stream = fs.createReadStream(item.filePath, { encoding: "utf8" });
    const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
    try {
      for await (const line of lines) {
        if (!line.trim()) continue;
        let entry;
        try {
          entry = JSON.parse(line);
        } catch {
          continue;
        }
        if (entry.type === "session_meta") {
          meta = entry.payload || null;
          createdAt ||= meta?.timestamp || entry.timestamp || "";
        }
        if (entry.type === "event_msg" && entry.payload?.type === "item_completed") {
          const message = itemMessage(entry.payload.item);
          if (message) eventMessages.push(message);
        } else if (entry.type === "response_item") {
          const message = responseItemMessage(entry.payload);
          if (message) responseMessages.push(message);
        }
      }
    } finally {
      lines.close();
      stream.destroy();
    }

    const messages = eventMessages.length ? eventMessages : responseMessages;
    const id = meta?.id || meta?.session_id || sessionId;
    const stat = await fsp.stat(item.filePath);
    const firstUser = messages.find((message) => message.role === "user")?.text || "Codex 对话";
    const indexEntry = this.index.get(id);
    return {
      id,
      title: (indexEntry?.thread_name || firstUser).replace(/\s+/g, " ").trim().slice(0, 80),
      cwd: meta?.cwd || "",
      modelProvider: meta?.model_provider || "",
      source: meta?.source || "",
      internalKind: internalSessionKind(meta),
      originator: meta?.originator || "",
      createdAt: createdAt || stat.birthtime.toISOString(),
      updatedAt: indexEntry?.updated_at || stat.mtime.toISOString(),
      filePath: item.filePath,
      byteSize: stat.size,
      messages,
    };
  }
  async readLatestTurnState(filePath) {
    let stat;
    try {
      stat = await fsp.stat(filePath);
    } catch {
      return { state: "", turnId: null };
    }
    const length = Math.min(stat.size, 2 * 1024 * 1024);
    const buffer = Buffer.alloc(length);
    const handle = await fsp.open(filePath, "r");
    try {
      await handle.read(buffer, 0, length, stat.size - length);
    } finally {
      await handle.close();
    }
    const lines = buffer.toString("utf8").split(/\r?\n/);
    for (let index = lines.length - 1; index >= 0; index -= 1) {
      if (!lines[index].trim()) continue;
      let entry;
      try {
        entry = JSON.parse(lines[index]);
      } catch {
        continue;
      }
      if (entry.type !== "event_msg") continue;
      const eventType = entry.payload?.type || "";
      if (eventType === "task_started" || eventType === "turn_started") {
        return {
          state: "running",
          turnId: entry.payload?.turn_id || entry.payload?.turnId || null,
        };
      }
      if (["task_complete", "turn_completed", "task_failed", "turn_aborted"].includes(eventType)) {
        return {
          state: "idle",
          turnId: entry.payload?.turn_id || entry.payload?.turnId || null,
        };
      }
    }
    return { state: "", turnId: null };
  }

  async readNewMessages(filePath, offset = 0, knownIds = new Set()) {
    let stat;
    try {
      stat = await fsp.stat(filePath);
    } catch {
      return { messages: [], newOffset: offset, size: 0, missing: true };
    }

    let start = Number.isFinite(offset) && offset > 0 ? offset : 0;
    if (stat.size < start) start = 0;
    if (stat.size <= start) return { messages: [], newOffset: start, size: stat.size };

    const length = stat.size - start;
    const buffer = Buffer.alloc(length);
    const handle = await fsp.open(filePath, "r");
    try {
      await handle.read(buffer, 0, length, start);
    } finally {
      await handle.close();
    }

    let lastNewline = -1;
    for (let index = buffer.length - 1; index >= 0; index -= 1) {
      if (buffer[index] === 10) {
        lastNewline = index;
        break;
      }
    }
    if (lastNewline < 0) return { messages: [], newOffset: start, size: stat.size };

    const completeBuffer = buffer.subarray(0, lastNewline + 1);
    const eventMessages = [];
    const responseMessages = [];
    let turnStarted = false;
    let lastTurnEvent = "";
    let turnCompleted = false;
    for (const line of completeBuffer.toString("utf8").split(/\r?\n/)) {
      if (!line.trim()) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      if (entry.type === "event_msg") {
        const eventType = entry.payload?.type || "";
        if (eventType === "task_started" || eventType === "turn_started") {
          turnStarted = true;
          lastTurnEvent = "started";
        }
        if (["task_complete", "turn_completed", "task_failed", "turn_aborted"].includes(eventType)) {
          turnCompleted = true;
          lastTurnEvent = "completed";
        }
        if (eventType === "item_completed") {
          const message = itemMessage(entry.payload.item);
          if (message) eventMessages.push(message);
        }
      } else if (entry.type === "response_item") {
        const message = responseItemMessage(entry.payload);
        if (message) responseMessages.push(message);
      }
    }

    const seenIds = new Set(knownIds);
    const seenText = new Set();
    const messages = [];
    for (const message of [...eventMessages, ...responseMessages]) {
      if (!message.text) continue;
      if (message.id && seenIds.has(message.id)) continue;
      const contentKey = `${message.role}\u0000${message.text}`;
      if (seenText.has(contentKey)) continue;
      if (message.id) seenIds.add(message.id);
      seenText.add(contentKey);
      messages.push(message);
    }
    return {
      messages,
      newOffset: start + completeBuffer.length,
      size: stat.size,
      reset: start === 0 && offset > 0,
      turnStarted,
      turnCompleted,
      lastTurnEvent,
    };
  }
}


