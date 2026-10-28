import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ID_PATTERN = /^[0-9a-f-]{36}$/i;

export class ConversationStore {
  constructor(conversationsDir, options = {}) {
    this.dir = conversationsDir;
    this.onChange = options.onChange || null;
    this.conversations = new Map();
    this.writeQueues = new Map();
  }

  async init() {
    await fsp.mkdir(this.dir, { recursive: true });
    const entries = await fsp.readdir(this.dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      const filePath = path.join(this.dir, entry.name);
      try {
        const conversation = JSON.parse(await fsp.readFile(filePath, "utf8"));
        if (!conversation.id || !Array.isArray(conversation.events)) continue;
        if (["running", "stopping", "waiting_approval"].includes(conversation.status)) conversation.status = "idle";
        conversation.archivedAt = conversation.archivedAt || null;
        conversation.unreadCount = Math.max(0, Number(conversation.unreadCount) || 0);
        conversation.lastReadSeq = Math.max(0, Number(conversation.lastReadSeq) || 0);
        this.conversations.set(conversation.id, conversation);
      } catch (error) {
        console.warn(`[store] Ignoring unreadable conversation ${filePath}: ${error.message}`);
      }
    }
  }

  create(options = {}) {
    const now = new Date().toISOString();
    const conversation = {
      version: 1,
      id: crypto.randomUUID(),
      title: options.title || "新对话",
      createdAt: options.createdAt || now,
      updatedAt: options.updatedAt || now,
      status: "idle",
      threadId: options.threadId || null,
      codexStarted: Boolean(options.threadId),
      workdir: options.workdir || null,
      sourceCodexSessionId: options.sourceCodexSessionId || null,
      sourceCodexSessionPath: options.sourceCodexSessionPath || null,
      sourceOffset: Number.isFinite(options.sourceOffset) ? options.sourceOffset : 0,
      importedAt: options.importedAt || null,
      archivedAt: null,
      unreadCount: 0,
      lastReadSeq: 0,
      lastSeq: 0,
      events: [],
    };
    this.conversations.set(conversation.id, conversation);
    this.save(conversation);
    return conversation;
  }

  get(id) {
    if (!ID_PATTERN.test(id || "")) return null;
    return this.conversations.get(id) || null;
  }

  list() {
    return [...this.conversations.values()]
      .filter((conversation) => !conversation.archivedAt)
      .map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        status: conversation.status,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        lastSeq: conversation.lastSeq,
        unreadCount: conversation.unreadCount || 0,
        archivedAt: conversation.archivedAt || null,
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  append(conversation, type, data = {}) {
    const { countUnread = true, ...eventData } = data;
    conversation.lastSeq += 1;
    const event = {
      seq: conversation.lastSeq,
      ts: new Date().toISOString(),
      type,
      ...eventData,
    };
    conversation.events.push(event);
    conversation.updatedAt = event.ts;
    if ((type === "assistant_message" || type === "media") && countUnread) conversation.unreadCount = (conversation.unreadCount || 0) + 1;

    if (type === "user_message" && !event.hidden && conversation.title === "新对话") {
      const compact = String(data.text || "").replace(/\s+/g, " ").trim();
      conversation.title = compact.slice(0, 34) || "新对话";
    }

    if (conversation.events.length > 3000) {
      conversation.events.splice(0, conversation.events.length - 3000);
    }
    this.save(conversation);
    return event;
  }

  appendMany(conversation, entries) {
    const now = new Date().toISOString();
    const created = [];
    for (const data of entries) {
      const { countUnread = true, ...eventData } = data;
      conversation.lastSeq += 1;
      const event = { seq: conversation.lastSeq, ts: now, ...eventData };
      conversation.events.push(event);
      created.push(event);
      if ((event.type === "assistant_message" || event.type === "media") && countUnread) conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      if (event.type === "user_message" && !event.hidden && conversation.title === "新对话") {
        const compact = String(event.text || "").replace(/\s+/g, " ").trim();
        conversation.title = compact.slice(0, 34) || "新对话";
      }
    }
    conversation.updatedAt = now;
    if (conversation.events.length > 3000) {
      conversation.events.splice(0, conversation.events.length - 3000);
    }
    this.save(conversation);
    return created;
  }
  updateSourceCursor(conversation, sourceCodexSessionPath, sourceOffset) {
    const changed = conversation.sourceCodexSessionPath !== sourceCodexSessionPath || conversation.sourceOffset !== sourceOffset;
    conversation.sourceCodexSessionPath = sourceCodexSessionPath || null;
    conversation.sourceOffset = Number.isFinite(sourceOffset) ? sourceOffset : 0;
    if (changed) this.save(conversation);
  }
  setStatus(conversation, status) {
    conversation.status = status;
    conversation.updatedAt = new Date().toISOString();
    this.save(conversation);
  }

  markRead(conversation) {
    conversation.unreadCount = 0;
    conversation.lastReadSeq = conversation.lastSeq;
    conversation.updatedAt = new Date().toISOString();
    this.save(conversation);
  }

  setThreadId(conversation, threadId) {
    conversation.threadId = threadId || null;
    conversation.codexStarted = Boolean(threadId);
    conversation.updatedAt = new Date().toISOString();
    this.save(conversation);
  }

  archive(conversation) {
    conversation.archivedAt = new Date().toISOString();
    conversation.updatedAt = conversation.archivedAt;
    this.save(conversation);
  }

  unarchive(conversation) {
    conversation.archivedAt = null;
    conversation.updatedAt = new Date().toISOString();
    this.save(conversation);
  }

  updateEvent(conversation, seq, patch = {}) {
    const event = conversation.events.find((item) => item.seq === Number(seq));
    if (!event) return null;
    Object.assign(event, patch);
    conversation.updatedAt = new Date().toISOString();
    this.save(conversation);
    return event;
  }

  recallAndTruncate(conversation, seq) {
    const index = conversation.events.findIndex((item) => item.seq === Number(seq));
    if (index < 0) return null;
    const recalledAt = new Date().toISOString();
    const recalled = {
      ...conversation.events[index],
      type: "recall",
      text: "你撤回了一条消息",
      recalled: true,
      recalledAt,
      delivery: undefined,
      queueId: undefined,
      turnId: undefined,
    };
    conversation.events = [...conversation.events.slice(0, index), recalled];
    conversation.updatedAt = recalledAt;
    conversation.unreadCount = 0;
    this.save(conversation);
    return recalled;
  }

  recallEvent(conversation, seq) {
    return this.updateEvent(conversation, seq, {
      recalled: true,
      recalledAt: new Date().toISOString(),
    });
  }

  async delete(id) {
    const conversation = this.get(id);
    if (!conversation) return false;
    const pending = this.writeQueues.get(id);
    if (pending) await pending.catch(() => {});
    this.conversations.delete(id);
    this.writeQueues.delete(id);
    await fsp.rm(path.join(this.dir, `${id}.json`), { force: true });
    return true;
  }

  async waitForWrites() {
    await Promise.all([...this.writeQueues.values()]);
  }

  notify(conversation) {
    if (!this.onChange) return;
    try {
      this.onChange({
        id: conversation.id,
        status: conversation.status,
        updatedAt: conversation.updatedAt,
        lastSeq: conversation.lastSeq,
        unreadCount: conversation.unreadCount || 0,
        archivedAt: conversation.archivedAt || null,
      });
    } catch {}
  }
  save(conversation) {
    const previous = this.writeQueues.get(conversation.id) || Promise.resolve();
    const next = previous
      .catch(() => {})
      .then(() => this.writeSnapshot(conversation));
    this.writeQueues.set(conversation.id, next);
    this.notify(conversation);
    next.finally(() => {
      if (this.writeQueues.get(conversation.id) === next) this.writeQueues.delete(conversation.id);
    });
    return next;
  }

  async writeSnapshot(conversation) {
    const target = path.join(this.dir, `${conversation.id}.json`);
    const temp = `${target}.${process.pid}.tmp`;
    const json = JSON.stringify(conversation, null, 2);
    await fsp.writeFile(temp, json, "utf8");
    await fsp.rename(temp, target);
  }
}






