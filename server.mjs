import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { buildCodexEnvironment, getConfig, ensureDataDirs, getPairingToken } from "./lib/config.mjs";
import { ConversationStore } from "./lib/store.mjs";
import { CodexSessionLibrary } from "./lib/codex-import.mjs";
import { normalizeCodexEvent, startCodexTurn, stopProcessTree } from "./lib/codex-runner.mjs";
import { AppServerClient, normalizeAppServerNotification } from "./lib/app-server-client.mjs";
import { captureQrCode, openLocalUrl } from "./lib/desktop-actions.mjs";
import { writeQrPngFile } from "./lib/qr-code.mjs";
import { ensureComputerIdentity, setComputerName } from "./lib/computer-identity.mjs";

const DESKTOP_INSTRUCTIONS = [
  "You are controlling a real Windows desktop through Codex Pocket.",
  "When the user asks to open a website, call the open_local_url tool. Do not use exec_command or Start-Process to launch GUI applications.",
  "For Taobao requests, call open_local_url with https://www.taobao.com and browser chrome.",
  "Never claim that browser permission is unavailable when open_local_url is available.",
  "Never enter passwords, SMS codes, or payment information. Open the login page and ask the user to complete login or scan the QR code manually.",
].join("\n");

const DESKTOP_DYNAMIC_TOOLS = [{
  type: "function",
  name: "open_local_url",
  description: "Open an HTTP or HTTPS URL in a real local browser on the user's Windows desktop.",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "HTTP or HTTPS URL to open." },
      browser: { type: "string", enum: ["chrome", "edge", "default"], description: "Preferred local browser." },
    },
    required: ["url"],
    additionalProperties: false,
  },
}];
const MIME_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".heic", "image/heic"],
  [".heif", "image/heif"],
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".mp4", "video/mp4"],
  [".mov", "video/quicktime"],
  [".m4v", "video/x-m4v"],
  [".webm", "video/webm"],
  [".mkv", "video/x-matroska"],
  [".mp3", "audio/mpeg"],
  [".m4a", "audio/mp4"],
  [".wav", "audio/wav"],
  [".ogg", "audio/ogg"],
  [".opus", "audio/ogg"],
  [".flac", "audio/flac"],
  [".aac", "audio/aac"],
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  [".xls", "application/vnd.ms-excel"],
  [".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  [".ppt", "application/vnd.ms-powerpoint"],
  [".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  [".apk", "application/vnd.android.package-archive"],
  [".zip", "application/zip"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
]);

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(self)",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob:",
    "style-src 'self'",
    "script-src 'self'",
    "connect-src 'self'",
    "media-src 'self' blob:",
    "manifest-src 'self'",
    "worker-src 'self'",
  ].join("; "),
};

function sendJson(response, statusCode, value) {
  const body = JSON.stringify(value);
  response.writeHead(statusCode, {
    ...SECURITY_HEADERS,
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  response.end(body);
}

async function readJson(request, maxBytes = 70_000) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error("Request body too large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON");
    error.statusCode = 400;
    throw error;
  }
}

async function readBodyBuffer(request, maxBytes = 25 * 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error("录音文件过大");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function hasValidToken(request, token) {
  const authorization = request.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) return false;
  return safeEqual(authorization.slice(7), token);
}

const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

function encodeWebSocketFrame(payload, opcode = 0x1) {
  const body = Buffer.isBuffer(payload) ? payload : Buffer.from(String(payload), "utf8");
  let header;
  if (body.length < 126) {
    header = Buffer.from([0x80 | opcode, body.length]);
  } else if (body.length < 65_536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(body.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(body.length), 2);
  }
  return Buffer.concat([header, body]);
}

function consumeWebSocketFrames(session, chunk, onControl) {
  session.buffer = Buffer.concat([session.buffer, chunk]);
  while (session.buffer.length >= 2) {
    const first = session.buffer[0];
    const second = session.buffer[1];
    const masked = Boolean(second & 0x80);
    let length = second & 0x7f;
    let offset = 2;
    if (length === 126) {
      if (session.buffer.length < 4) return;
      length = session.buffer.readUInt16BE(2);
      offset = 4;
    } else if (length === 127) {
      if (session.buffer.length < 10) return;
      const largeLength = session.buffer.readBigUInt64BE(2);
      if (largeLength > BigInt(Number.MAX_SAFE_INTEGER)) {
        session.socket.destroy();
        return;
      }
      length = Number(largeLength);
      offset = 10;
    }
    const maskOffset = offset;
    if (masked) offset += 4;
    if (session.buffer.length < offset + length) return;
    const mask = masked ? session.buffer.subarray(maskOffset, maskOffset + 4) : null;
    const payload = Buffer.from(session.buffer.subarray(offset, offset + length));
    if (mask) {
      for (let index = 0; index < payload.length; index += 1) payload[index] ^= mask[index % 4];
    }
    session.buffer = session.buffer.subarray(offset + length);
    const opcode = first & 0x0f;
    if (opcode === 0x8) {
      try { session.socket.write(encodeWebSocketFrame(payload, 0x8)); } catch {}
      session.socket.end();
      return;
    }
    if (opcode === 0x9) {
      try { session.socket.write(encodeWebSocketFrame(payload, 0xA)); } catch {}
    }
    onControl?.(opcode, payload);
  }
}

function acceptWebSocketUpgrade(request, socket, head, token, onOpen) {
  const protocols = String(request.headers["sec-websocket-protocol"] || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const key = String(request.headers["sec-websocket-key"] || "");
  if (protocols[0] !== "codex-pocket-v1" || !safeEqual(protocols[1] || "", token) || !key) {
    socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\nContent-Length: 0\r\n\r\n");
    socket.destroy();
    return null;
  }
  const accept = crypto.createHash("sha1").update(`${key}${WS_GUID}`).digest("base64");
  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "Sec-WebSocket-Protocol: codex-pocket-v1",
    "",
    "",
  ].join("\r\n"));
  socket.setNoDelay?.(true);
  const session = { socket, buffer: Buffer.alloc(0) };
  socket.on("data", (chunk) => consumeWebSocketFrames(session, chunk));
  socket.on("close", () => onOpen.close?.(session));
  socket.on("error", () => onOpen.close?.(session));
  if (head?.length) consumeWebSocketFrames(session, head);
  onOpen.open?.(session);
  return session;
}

function attachmentSignature(conversationId, filename, token) {
  return crypto.createHmac("sha256", token).update(`${conversationId}/${filename}`).digest("hex");
}

function attachmentUrl(conversationId, filename, token) {
  return `/api/attachments/${conversationId}/${filename}?sig=${attachmentSignature(conversationId, filename, token)}`;
}
const LOCAL_FILE_EXTENSIONS = [
  ".mp4", ".mov", ".m4v", ".webm", ".mkv",
  ".mp3", ".m4a", ".wav", ".ogg", ".opus", ".flac", ".aac",
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".heic", ".heif", ".avif",
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const LOCAL_FILE_EXT_PATTERN = LOCAL_FILE_EXTENSIONS.map((extension) => escapeRegex(extension.slice(1))).join("|");

function normalizeDetectedLocalPath(rawPath, workdir) {
  let candidate = String(rawPath || "").trim().replace(/^<|>$/g, "");
  if (!candidate) return "";
  if (/^file:\/\//i.test(candidate)) {
    try {
      const fileUrl = new URL(candidate);
      candidate = decodeURIComponent(fileUrl.pathname);
      if (/^\/[A-Za-z]:[\\/]/.test(candidate)) candidate = candidate.slice(1);
    } catch {
      return "";
    }
  } else {
    try {
      candidate = decodeURIComponent(candidate);
    } catch {}
  }
  candidate = candidate.replace(/^["']|["']$/g, "").trim();
  if (!candidate) return "";
  const extension = path.extname(candidate).toLowerCase();
  if (!LOCAL_FILE_EXTENSIONS.includes(extension)) return "";
  const absolute = path.isAbsolute(candidate) || /^[A-Za-z]:[\\/]/.test(candidate) || candidate.startsWith("\\\\");
  return path.normalize(absolute ? candidate : path.resolve(workdir || process.cwd(), candidate));
}

function extractLocalMediaReferences(text, workdir) {
  const source = String(text || "");
  const references = [];
  const seen = new Set();
  const add = (rawPath, caption = "") => {
    const filePath = normalizeDetectedLocalPath(rawPath, workdir);
    if (!filePath) return;
    const key = filePath.toLocaleLowerCase("en-US");
    if (seen.has(key)) return;
    seen.add(key);
    references.push({ path: filePath, caption: String(caption || "").trim() });
  };

  const markdownPattern = new RegExp(
    `!?\\[([^\\]\\n]*)\\]\\(([^)\\n]+?\\.(?:${LOCAL_FILE_EXT_PATTERN}))\\)`,
    "gi",
  );
  for (const match of source.matchAll(markdownPattern)) add(match[2], match[1]);

  const fileUriPattern = new RegExp(
    `file:\\/\\/[^\\s)<>\`]+?\\.(?:${LOCAL_FILE_EXT_PATTERN})`,
    "gi",
  );
  for (const match of source.matchAll(fileUriPattern)) add(match[0]);

  const codePattern = new RegExp(
    `\`([^\`\\r\\n]+?\\.(?:${LOCAL_FILE_EXT_PATTERN}))\``,
    "gi",
  );
  for (const match of source.matchAll(codePattern)) add(match[1]);

  const absolutePathPattern = new RegExp(
    `(?:^|[\\s(])((?:[A-Za-z]:[\\\\/]|\\\\\\\\)[^\\r\\n<>\"|?*]+?\\.(?:${LOCAL_FILE_EXT_PATTERN}))(?=$|[\\s)\`,])`,
    "gim",
  );
  for (const match of source.matchAll(absolutePathPattern)) add(match[1]);
  return references;
}

function mediaKindForMimeType(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return "file";
}

async function serveLocalFile(request, response, filePath, mimeType, fileName) {
  let stat;
  try {
    stat = await fsp.stat(filePath);
  } catch {
    return sendJson(response, 404, { error: "文件不存在或已被移动" });
  }
  if (!stat.isFile()) return sendJson(response, 404, { error: "文件不存在" });

  const headers = {
    ...SECURITY_HEADERS,
    "Content-Type": mimeType || "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
    "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(fileName || path.basename(filePath))}`,
  };
  const range = String(request.headers.range || "");
  let start = 0;
  let end = stat.size - 1;
  let partial = false;
  if (range) {
    const match = range.match(/^bytes=(\d*)-(\d*)$/i);
    if (!match) {
      response.writeHead(416, { ...headers, "Content-Range": `bytes */${stat.size}` });
      response.end();
      return;
    }
    if (!match[1] && match[2]) {
      const suffixLength = Number(match[2]);
      start = Math.max(0, stat.size - suffixLength);
    } else {
      start = Number(match[1]);
      if (match[2]) end = Math.min(Number(match[2]), stat.size - 1);
    }
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= stat.size) {
      response.writeHead(416, { ...headers, "Content-Range": `bytes */${stat.size}` });
      response.end();
      return;
    }
    partial = true;
  }
  const length = Math.max(0, end - start + 1);
  const statusCode = partial ? 206 : 200;
  if (partial) headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
  headers["Content-Length"] = length;
  response.writeHead(statusCode, headers);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  const stream = fs.createReadStream(filePath, { start, end });
  stream.on("error", () => {
    if (!response.headersSent) sendJson(response, 500, { error: "读取文件失败" });
    else response.destroy();
  });
  stream.pipe(response);
}
function conversationSummary(conversation) {
  return {
    id: conversation.id,
    title: conversation.title,
    status: conversation.status,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    lastSeq: conversation.lastSeq,
    unreadCount: conversation.unreadCount || 0,
    archivedAt: conversation.archivedAt || null,
    workdir: conversation.workdir || null,
    sourceCodexSessionId: conversation.sourceCodexSessionId || null,
    importedAt: conversation.importedAt || null,
  };
}

function isAutomationControlText(text) {
  const value = String(text || "").replace(/^[\uFEFF\u200B-\u200D\u2060\s]+/, "");
  return /<heartbeat\b/i.test(value)
    || /<automation\s+id=/i.test(value)
    || (/<automation\b/i.test(value) && /<instructions>/i.test(value));
}

function sanitizeAutomationResultText(text) {
  const value = String(text || "");
  if (!/<heartbeat\b/i.test(value) || !/<(?:decision|automation_id|message)\b/i.test(value)) return value;
  const stripped = value.replace(/<heartbeat\b[\s\S]*?(?:<\/heartbeat>|$)/gi, "").trim();
  const decision = value.match(/<decision>\s*([^<]+?)\s*<\/decision>/i)?.[1]?.trim() || "";
  const message = value.match(/<message>\s*([\s\S]*?)\s*<\/message>/i)?.[1]?.trim() || "";
  if (/DONT_NOTIFY/i.test(decision)) return stripped;
  return stripped || message;
}

function isAutomationControlEvent(event) {
  if (!event) return false;
  if (event.automationControl === true) return true;
  if (!["user_message", "status"].includes(event.type)) return false;
  return isAutomationControlText(event.text);
}

function publicConversation(conversation, after = 0, limit = 0) {
  let events = conversation.events
    .filter((event) => event.seq > after && !event.hidden && !isAutomationControlEvent(event))
    .map((event) => {
      if (event.type !== "assistant_message") return event;
      const text = sanitizeAutomationResultText(event.text);
      return text ? { ...event, text } : null;
    })
    .filter(Boolean);
  if (limit > 0) events = events.slice(-limit);
  return {
    ...conversationSummary(conversation),
    threadId: conversation.threadId,
    events,
  };
}

function stderrSummary(stderr) {
  return String(stderr || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.includes("WARN ") && !line.startsWith("Reading additional input"))
    .slice(-8)
    .join("\n")
    .slice(0, 4000);
}

function packageVersion() {
  try {
    const packagePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "package.json");
    return JSON.parse(fs.readFileSync(packagePath, "utf8")).version;
  } catch {
    return "0.1.0";
  }
}

async function serveStatic(config, request, response, pathname) {
  let relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  try {
    relativePath = decodeURIComponent(relativePath);
  } catch {
    return sendJson(response, 400, { error: "Bad path" });
  }

  const target = path.resolve(config.publicDir, relativePath);
  const publicRoot = path.resolve(config.publicDir);
  if (target !== publicRoot && !target.startsWith(`${publicRoot}${path.sep}`)) {
    return sendJson(response, 404, { error: "Not found" });
  }

  let stat;
  try {
    stat = await fsp.stat(target);
  } catch {
    return sendJson(response, 404, { error: "Not found" });
  }
  if (!stat.isFile()) return sendJson(response, 404, { error: "Not found" });

  const extension = path.extname(target).toLowerCase();
  const headers = {
    ...SECURITY_HEADERS,
    "Content-Type": MIME_TYPES.get(extension) || "application/octet-stream",
    "Content-Length": stat.size,
    "Cache-Control": extension === ".html" || relativePath === "sw.js" ? "no-cache" : "public, max-age=3600",
  };
  if (extension === ".webmanifest") headers["Cache-Control"] = "no-cache";
  if (extension === ".apk" || extension === ".zip") {
    headers["Content-Disposition"] = `attachment; filename="${path.basename(target)}"`;
    headers["Cache-Control"] = "public, max-age=60";
  }
  response.writeHead(200, headers);
  fs.createReadStream(target).pipe(response);
}

export async function startServer(overrides = {}) {
  const config = getConfig(overrides);
  ensureDataDirs(config);
  const computer = ensureComputerIdentity(config);
  const token = getPairingToken(config);
  const sseClients = new Set();
  const wsClients = new Set();
  let globalUnreadCount = 0;
  let globalUnreadUpdatedAt = null;
  function broadcastPayload(payload) {
    const data = JSON.stringify(payload);
    for (const client of sseClients) {
      try {
        client.write(`event: ${payload.type || "message"}\ndata: ${data}\n\n`);
      } catch {
        sseClients.delete(client);
      }
    }
    const frame = encodeWebSocketFrame(data);
    for (const session of wsClients) {
      try {
        session.socket.write(frame);
      } catch {
        wsClients.delete(session);
      }
    }
  }
  function broadcastConversation(update) {
    broadcastPayload({ type: "conversation", ...update });
  }

  const store = new ConversationStore(config.conversationsDir, {
    onChange: (update) => {
      broadcastConversation(update);
      publishGlobalUnread();
    },
  });
  await store.init();
  for (const conversation of store.conversations.values()) {
    if (conversation.sourceCodexSessionId && conversation.threadId !== conversation.sourceCodexSessionId) {
      store.setThreadId(conversation, conversation.sourceCodexSessionId);
    }
  }
  function mediaSignature(conversationId, mediaId) {
    return crypto.createHmac("sha256", token).update(`${conversationId}/${mediaId}`).digest("hex");
  }

  function mediaUrl(conversationId, mediaId) {
    return `/api/media/${conversationId}/${mediaId}?sig=${mediaSignature(conversationId, mediaId)}`;
  }

  async function createMediaEvents(conversation, text, sourceItemId = null, options = {}) {
    const references = extractLocalMediaReferences(text, conversation.workdir || config.workdir);
    if (!references.length) return [];
    const existingPaths = new Set(
      conversation.events
        .filter((event) => event.type === "media" && event.path)
        .map((event) => path.normalize(event.path).toLocaleLowerCase("en-US")),
    );
    const events = [];
    for (const reference of references) {
      const normalizedPath = path.normalize(reference.path);
      const key = normalizedPath.toLocaleLowerCase("en-US");
      if (existingPaths.has(key)) continue;
      let stat;
      try {
        stat = await fsp.stat(normalizedPath);
      } catch {
        continue;
      }
      if (!stat.isFile()) continue;
      const extension = path.extname(normalizedPath).toLowerCase();
      const mimeType = MIME_TYPES.get(extension);
      if (!mimeType) continue;
      const mediaId = crypto.randomUUID();
      const kind = mediaKindForMimeType(mimeType);
      events.push({
        type: "media",
        mediaId,
        role: "assistant",
        path: normalizedPath,
        fileName: path.basename(normalizedPath),
        mimeType,
        size: stat.size,
        kind,
        inline: kind !== "file",
        caption: reference.caption || path.basename(normalizedPath),
        url: mediaUrl(conversation.id, mediaId),
        sourceItemId: `${sourceItemId || "message"}:media:${mediaId}`,
        countUnread: Boolean(options.countUnread),
      });
      existingPaths.add(key);
    }
    return events;
  }

  async function appendMediaForMessage(conversation, event, options = {}) {
    if (event?.type !== "assistant_message" || !event.text) return [];
    const mediaEvents = await createMediaEvents(conversation, event.text, event.sourceItemId, options);
    if (mediaEvents.length) store.appendMany(conversation, mediaEvents);
    return mediaEvents;
  }

  function appendNormalizedEvent(conversation, normalized) {
    const { type, ...data } = normalized;
    const event = store.append(conversation, type, data);
    if (type === "assistant_message") {
      void appendMediaForMessage(conversation, event, { countUnread: false }).catch((error) => {
        console.warn(`[media] ${conversation.id}: ${error.message}`);
      });
    }
    return event;
  }

  async function buildSessionMessageEvents(conversation, messages, options = {}) {
    const entries = [];
    for (const message of messages) {
      const automationControl = message.role === "user" && isAutomationControlText(message.text);
      const quietAutomationResult = message.role !== "user"
        && /<decision>\s*DONT_NOTIFY\s*<\/decision>/i.test(String(message.text || ""));
      const event = {
        type: message.role === "user" ? "user_message" : "assistant_message",
        text: message.text,
        sourceItemId: message.id || null,
        countUnread: automationControl || quietAutomationResult ? false : options.countUnread !== false,
        ...(automationControl ? { hidden: true, automationControl: true } : {}),
        ...(options.syncedFromCodex ? { syncedFromCodex: true } : {}),
      };
      entries.push(event);
      if (message.role !== "user") {
        entries.push(...await createMediaEvents(
          conversation,
          message.text,
          message.id || null,
          { countUnread: false },
        ));
      }
    }
    return entries;
  }

  async function backfillLatestMediaEvent() {
    for (const conversation of store.conversations.values()) {
      const assistantEvents = [...conversation.events]
        .reverse()
        .filter((event) => event.type === "assistant_message" && event.text);
      for (const assistantEvent of assistantEvents) {
        const mediaEvents = await createMediaEvents(
          conversation,
          assistantEvent.text,
          assistantEvent.sourceItemId,
          { countUnread: true },
        );
        if (mediaEvents.length) {
          store.appendMany(conversation, mediaEvents);
          break;
        }
      }
    }
  }

  await backfillLatestMediaEvent();
  const codexLibrary = new CodexSessionLibrary(config.codexHome);
  const activeJobs = new Map();
  const pendingMessages = new Map();
  const pendingApprovals = new Map();
  const approvalTimeoutMs = 5 * 60_000;
  const startedAt = new Date().toISOString();
  let appServerClient = null;
  let appServerStartPromise = null;
  const threadLinkTickets = new Map();
  const threadLinkTtlMs = 5 * 60_000;

  async function linkDesktopThread(threadId) {
    if (!config.codexHome) {
      const error = new Error("没有找到 CODEX_HOME");
      error.statusCode = 503;
      throw error;
    }
    if (!/^[0-9a-f-]{36}$/i.test(threadId)) {
      const error = new Error("无效的线程 ID");
      error.statusCode = 400;
      throw error;
    }

    const existing = [...store.conversations.values()].find(
      (conversation) => conversation.sourceCodexSessionId === threadId,
    );
    if (existing) {
      return { conversation: store.get(existing.id), alreadyImported: true };
    }

    const session = await codexLibrary.read(threadId);
    if (!session.messages.length) {
      const error = new Error("这个会话没有可关联的消息");
      error.statusCode = 400;
      throw error;
    }
    const targetWorkdir = session.cwd && fs.existsSync(session.cwd)
      ? session.cwd
      : config.projects[0]?.path || config.workdir;
    const conversation = store.create({
      title: session.title,
      threadId: session.id,
      workdir: targetWorkdir,
      sourceCodexSessionId: session.id,
      sourceCodexSessionPath: session.filePath,
      sourceOffset: session.byteSize,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      importedAt: new Date().toISOString(),
    });
    const importedEvents = await buildSessionMessageEvents(conversation, session.messages, { countUnread: false });
    store.appendMany(conversation, [
      { type: "status", status: "idle", text: "当前 Desktop 对话已接入 Codex Pocket" },
      ...importedEvents,
    ]);
    store.markRead(conversation);
    return { conversation, alreadyImported: false };
  }

  function pruneThreadLinkTickets() {
    const now = Date.now();
    for (const [ticket, entry] of threadLinkTickets) {
      if (entry.expiresAtMs <= now) threadLinkTickets.delete(ticket);
    }
  }

  async function createThreadLinkQr(conversation) {
    if (!config.publicUrl) {
      const error = new Error("公网隧道尚未就绪，无法生成手机可用的二维码");
      error.statusCode = 503;
      throw error;
    }
    pruneThreadLinkTickets();
    const ticket = crypto.randomBytes(24).toString("base64url");
    const expiresAtMs = Date.now() + threadLinkTtlMs;
    threadLinkTickets.set(ticket, {
      threadId: conversation.sourceCodexSessionId || conversation.threadId,
      conversationId: conversation.id,
      expiresAtMs,
    });
    const linkUrl = config.publicUrl.replace(/\/$/, "") + "/#thread=" + ticket + "&computer=" + encodeURIComponent(computer.id);
    const qrPath = path.join(config.runtimeDir, "link-qr", "thread-" + ticket + ".png");
    writeQrPngFile(linkUrl, qrPath, { scale: 10, margin: 4 });
    return {
      linkUrl,
      qrPath,
      markdownImagePath: "/" + qrPath.replace(/\\/g, "/"),
      computer,
      expiresAt: new Date(expiresAtMs).toISOString(),
      expiresInSeconds: Math.floor(threadLinkTtlMs / 1000),
    };
  }

  async function captureOpenedPage(threadId, openedUrl) {
    const conversation = [...store.conversations.values()].find((item) => item.threadId === threadId);
    if (!conversation) return null;
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const directory = path.join(config.attachmentsDir, conversation.id);
    await fsp.mkdir(directory, { recursive: true });
    const filename = `qr-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.png`;
    const outFile = path.join(directory, filename);
    let result = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        result = await captureQrCode({ outFile });
        if (result.found) break;
      } catch {
        result = null;
      }
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 2500));
    }
    if (!result?.found) return { found: false };
    const isTaobao = (() => {
      try { return new URL(openedUrl).hostname.includes("taobao.com"); } catch { return false; }
    })();
    const expiresAt = isTaobao ? new Date(Date.now() + 5 * 60_000).toISOString() : null;
    store.append(conversation, "image", {
      url: attachmentUrl(conversation.id, filename, token),
      caption: isTaobao ? "淘宝登录二维码" : "登录二维码",
      expiresAt,
    });
    return { found: true, expiresAt, isTaobao };
  }
  function findAppServerJob(threadId) {
    for (const job of activeJobs.values()) {
      if (job.kind === "app-server" && (!threadId || job.threadId === threadId)) return job;
    }
    return null;
  }

  function findConversationForThread(threadId) {
    if (!threadId) return null;
    return [...store.conversations.values()].find(
      (conversation) => conversation.threadId === threadId || conversation.sourceCodexSessionId === threadId,
    ) || null;
  }

  function requestApproval(message) {
    const params = message.params || {};
    const job = findAppServerJob(params.threadId || "");
    const conversation = job?.conversation || findConversationForThread(params.threadId || "");
    if (!conversation) return Promise.resolve({ decision: "decline" });
    const approvalId = crypto.randomUUID();
    const isFileChange = message.method === "item/fileChange/requestApproval";
    const command = String(params.command || "").trim();
    const grantRoot = String(params.grantRoot || "").trim();
    const reason = String(params.reason || "").trim();
    const detail = command || grantRoot;
    const title = isFileChange ? "Codex 请求修改文件" : "Codex 请求执行命令";
    const fallbackText = isFileChange
      ? "Codex 需要额外文件写入权限，请确认是否继续。"
      : "Codex 需要执行受限命令，请确认是否继续。";

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        const pending = pendingApprovals.get(approvalId);
        if (!pending) return;
        pendingApprovals.delete(approvalId);
        pending.resolve({ decision: "decline" });
        store.append(conversation, "approval_result", {
          approvalId,
          decision: "expired",
          text: "权限审核已超时，已自动拒绝",
        });
        store.setStatus(conversation, "running");
      }, approvalTimeoutMs);
      pendingApprovals.set(approvalId, {
        approvalId,
        conversationId: conversation.id,
        method: message.method,
        resolve,
        timer,
      });
      store.append(conversation, "approval", {
        approvalId,
        approvalType: isFileChange ? "file" : "command",
        title,
        text: reason || fallbackText,
        detail,
        cwd: params.cwd || "",
        status: "pending",
      });
      store.setStatus(conversation, "waiting_approval");
      broadcastPayload({
        type: "approval",
        conversationId: conversation.id,
        approvalId,
        title,
        text: reason || fallbackText,
      });
    });
  }

  function resolveApproval(conversationId, approvalId, approved) {
    const pending = pendingApprovals.get(approvalId);
    if (!pending || pending.conversationId !== conversationId) return false;
    clearTimeout(pending.timer);
    pendingApprovals.delete(approvalId);
    const decision = approved ? "accept" : "decline";
    pending.resolve({ decision });
    const conversation = store.get(conversationId);
    if (conversation) {
      store.append(conversation, "approval_result", {
        approvalId,
        decision,
        text: approved ? "已允许本次操作" : "已拒绝本次操作",
      });
      store.setStatus(conversation, "running");
    }
    return true;
  }

  function handleAppServerNotification(message) {
    const threadId = message.params?.threadId || "";
    const job = findAppServerJob(threadId);
    if (!job) return;
    const conversation = job.conversation;
    const normalizedEvents = normalizeAppServerNotification(message);
    for (const normalized of normalizedEvents) {
      appendNormalizedEvent(conversation, normalized);
    }
    if (message.method === "turn/completed") {
      const turn = message.params?.turn || {};
      activeJobs.delete(conversation.id);
      if (turn.status === "failed") store.append(conversation, "status", { status: "idle", text: "处理失败" });
      store.setStatus(conversation, "idle");
      void startNextQueuedMessage(conversation);
    }
  }

  async function ensureAppServer() {
    if (config.transport === "exec") throw new Error("CODEX_TRANSPORT=exec");
    if (appServerClient?.ready) return appServerClient;
    if (!appServerStartPromise) {
      appServerStartPromise = (async () => {
        const client = new AppServerClient({
          codexBin: config.codexBin,
          codexBinArgs: config.codexBinArgs,
          cwd: config.workdir,
          version: packageVersion(),
          stderr: (line) => {
            if (!line.includes("WARN ") && !line.includes("ERROR ")) console.error(`[app-server] ${line}`);
          },
          onServerRequest: async (message) => {
            if (message.method === "item/tool/call" && message.params?.tool === "open_local_url") {
              try {
                const opened = await openLocalUrl(message.params.arguments?.url, {
                  browser: message.params.arguments?.browser || "chrome",
                });
                const capture = await captureOpenedPage(message.params.threadId, opened.url).catch(() => null);
                const captureText = capture?.isTaobao
                  ? "已识别并裁剪二维码，截图已发送到对话。请在 5 分钟内完成扫码登录；过期后需重新打开登录页。"
                  : capture?.found
                    ? "已识别并裁剪二维码，截图已发送到对话。"
                    : "未检测到二维码，因此没有发送全屏截图。请确认登录二维码已在电脑浏览器中显示。";
                return {
                  success: true,
                  contentItems: [{ type: "inputText", text: `已在电脑本地使用 ${opened.browser} 打开 ${opened.url}。${captureText}` }],
                };
              } catch (error) {
                return {
                  success: false,
                  contentItems: [{ type: "inputText", text: `无法打开本地浏览器：${error.message}` }],
                };
              }
            }
            if (message.method === "item/commandExecution/requestApproval" || message.method === "item/fileChange/requestApproval") {
              return requestApproval(message);
            }
            if (message.method === "mcpServer/elicitation/request") return { action: "decline" };
            return null;
          },
        });
        client.on("notification", handleAppServerNotification);
        client.on("exit", () => {
          appServerClient = null;
          for (const [conversationId, job] of activeJobs) {
            if (job.kind !== "app-server") continue;
            store.append(job.conversation, "error", { text: "共享 app-server 连接已中断" });
            store.append(job.conversation, "status", { status: "idle", text: "连接已中断" });
            store.setStatus(job.conversation, "idle");
            activeJobs.delete(conversationId);
            pendingMessages.delete(conversationId);
            for (const [approvalId, approval] of pendingApprovals) {
              if (approval.conversationId !== conversationId) continue;
              clearTimeout(approval.timer);
              approval.resolve({ decision: "decline" });
              pendingApprovals.delete(approvalId);
            }
          }
        });
        await client.start();
        appServerClient = client;
        if (!readStateTimer) {
          readStateTimer = setInterval(() => {
            syncReadStatesFromAppServer().catch(() => {});
          }, 4000);
          readStateTimer.unref();
        }
        return client;
      })().finally(() => {
        appServerStartPromise = null;
      });
    }
    return appServerStartPromise;
  }

  let modelCache = null;
  let readStateTimer = null;

  async function transcribeAudio(audio, mimeType = "") {
    const extension = /mp4|m4a/i.test(mimeType)
      ? ".m4a"
      : /ogg/i.test(mimeType)
        ? ".ogg"
        : /wav/i.test(mimeType)
          ? ".wav"
          : ".webm";
    const target = path.join(config.audioDir, `${crypto.randomUUID()}${extension}`);
    await fsp.writeFile(target, audio);
    try {
      const { stdout } = await execFileAsync(config.transcribePython, [
        config.transcribeScript,
        target,
        "--model",
        config.whisperModel,
        "--language",
        "zh",
        "--ffmpeg",
        config.ffmpegBin,
      ], {
        cwd: config.rootDir,
        env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
        windowsHide: true,
        timeout: 180_000,
        maxBuffer: 2 * 1024 * 1024,
      });
      const lines = String(stdout || "").trim().split(/\r?\n/).filter(Boolean);
      const result = JSON.parse(lines.at(-1) || "{}");
      return { ...result, text: String(result.text || "").trim() };
    } finally {
      await fsp.rm(target, { force: true }).catch(() => {});
    }
  }

  async function getAvailableModels({ refresh = false } = {}) {
    if (config.transport === "exec") return [];
    if (!refresh && modelCache && Date.now() - modelCache.loadedAt < 60_000) return modelCache.items;
    const client = await ensureAppServer();
    const response = await client.listModels({ limit: 100, includeHidden: false });
    const items = (response.data || [])
      .filter((model) => model && !model.hidden)
      .map((model) => ({
        id: model.model || model.id,
        displayName: model.displayName || model.model || model.id,
        description: model.description || "",
        isDefault: Boolean(model.isDefault),
        defaultReasoningEffort: model.defaultReasoningEffort || "",
        supportedReasoningEfforts: model.supportedReasoningEfforts || [],
      }))
      .filter((model) => model.id);
    modelCache = { loadedAt: Date.now(), items };
    return items;
  }

  function publishGlobalUnread() {
    const count = [...store.conversations.values()]
      .filter((conversation) => !conversation.archivedAt)
      .reduce((sum, conversation) => sum + Math.max(0, Number(conversation.unreadCount) || 0), 0);
    if (count === globalUnreadCount && globalUnreadUpdatedAt) return count;
    globalUnreadCount = count;
    globalUnreadUpdatedAt = new Date().toISOString();
    broadcastPayload({
      type: "unread",
      count: globalUnreadCount,
      updatedAt: globalUnreadUpdatedAt,
    });
    return count;
  }

  async function refreshGlobalUnread() {
    return publishGlobalUnread();
  }

  async function markConversationRead(conversation) {
    store.markRead(conversation);
    const threadId = conversation.sourceCodexSessionId || conversation.threadId;
    if (!threadId || config.transport === "exec") return;
    try {
      const client = await ensureAppServer();
      const details = await client.readThread(threadId, false);
      const readState = details.readState;
      if (readState?.firstUnread && readState.revision) {
        await client.updateThreadReadState(threadId, readState.revision, "read");
      }
      await refreshGlobalUnread();
    } catch (error) {
      console.warn(`[read-state] ${error.message}`);
    }
  }

  async function syncReadStatesFromAppServer() {
    if (config.transport === "exec" || !appServerClient?.ready) return;
    const tracked = [...store.conversations.values()].filter((conversation) =>
      conversation.sourceCodexSessionId && conversation.unreadCount > 0
    );
    try {
      const response = await appServerClient.listThreads({ limit: 200 });
      const readStates = response.readStates || {};
      for (const conversation of tracked) {
        const state = readStates[conversation.sourceCodexSessionId];
        if (state && state.firstUnread == null && conversation.unreadCount > 0) {
          store.markRead(conversation);
        }
      }
      publishGlobalUnread();
    } catch (error) {
      console.warn(`[read-state] sync failed: ${error.message}`);
    }
  }

  function resolveApprovalPolicy(value) {
    const requested = typeof value === "string" ? value.trim() : "";
    return new Set(["on-request", "untrusted", "never"]).has(requested) ? requested : "on-request";
  }

  async function resolveRequestedModel(value) {
    const requested = typeof value === "string" ? value.trim() : "";
    if (!requested) return "";
    if (!/^[A-Za-z0-9._:/-]{1,120}$/.test(requested)) {
      const error = new Error("模型标识无效");
      error.statusCode = 400;
      throw error;
    }
    const models = await getAvailableModels();
    if (models.length && !models.some((model) => model.id === requested)) {
      const error = new Error("所选模型当前不可用，请重新选择");
      error.statusCode = 400;
      throw error;
    }
    return requested;
  }

  const execFileAsync = promisify(execFile);

  async function queueDesktopMessage(threadId, text) {
    const args = [
      ...(config.codexBinArgs || []),
      "queue",
      "--thread",
      threadId,
      "--message",
      text,
    ];
    const { stdout } = await execFileAsync(config.codexBin, args, {
      cwd: conversationWorkdir(threadId),
      env: buildCodexEnvironment(),
      windowsHide: true,
      timeout: 20_000,
      maxBuffer: 1024 * 1024,
    });
    return String(stdout || "").trim();
  }

  async function clickDesktopQueueAction(conversation, text, action = "guide") {
    if (process.platform !== "win32") return false;
    const script = path.join(config.rootDir, "scripts", "steer-codex-desktop.ps1");
    if (!fs.existsSync(script)) return false;
    const encode = (value) => Buffer.from(String(value), "utf8").toString("base64");
    try {
      const { stdout } = await execFileAsync("powershell.exe", [
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", script,
        "-MessageBase64", encode(text),
        "-ThreadTitleBase64", encode(conversation.title || ""),
        "-TimeoutSeconds", "12",
        "-Action", action,
      ], {
        cwd: config.rootDir,
        windowsHide: true,
        timeout: 20_000,
        maxBuffer: 1024 * 1024,
      });
      const lines = String(stdout || "").trim().split(/\r?\n/).filter(Boolean);
      const result = JSON.parse(lines.at(-1) || "{}");
      return result.ok === true;
    } catch (error) {
      console.warn(`[desktop-queue] ${error.message}`);
      return false;
    }
  }

  function steerDesktopQueuedMessage(conversation, text) {
    return clickDesktopQueueAction(conversation, text, "guide");
  }

  function deleteDesktopQueuedMessage(conversation, text) {
    return clickDesktopQueueAction(conversation, text, "delete");
  }

  async function latestTurnId(conversation) {
    const filePath = conversation.sourceCodexSessionPath;
    if (!filePath) return null;
    try {
      const stat = await fsp.stat(filePath);
      const length = Math.min(stat.size, 512 * 1024);
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
        try {
          const entry = JSON.parse(lines[index]);
          const turnId = entry.turn_id || entry.turnId || entry.payload?.turn_id || entry.payload?.turnId;
          if (turnId && /^[0-9a-f-]{36}$/i.test(turnId)) return turnId;
        } catch {}
      }
    } catch {}
    return null;
  }

  function conversationWorkdir(threadId) {
    const conversation = [...store.conversations.values()].find((item) => item.threadId === threadId);
    return conversation?.workdir || config.workdir;
  }
  async function sendViaAppServer(conversation, text, model = "", approvalPolicy = "on-request") {
    const client = await ensureAppServer();
    const selectedModel = model || config.model;
    const cwd = conversation.workdir || config.workdir;
    let threadId = conversation.threadId;
    const turnState = { stoppedByUser: false };
    const job = { kind: "app-server", threadId, turnId: null, conversation, turnState };
    activeJobs.set(conversation.id, job);

    try {
      if (threadId) {
        let resumed = false;
        for (let attempt = 0; attempt < 90; attempt += 1) {
          if (turnState.stoppedByUser) throw new Error("任务已取消");
          try {
            await client.resumeThread(threadId, {
              cwd,
              model: selectedModel,
              sandbox: config.sandbox,
              developerInstructions: DESKTOP_INSTRUCTIONS,
              approvalPolicy,
            });
            resumed = true;
            break;
          } catch (error) {
            if (!/active writer|already has an active/i.test(error.message)) throw error;
            try {
              await queueDesktopMessage(threadId, text);
              if (await steerDesktopQueuedMessage(conversation, text)) {
                store.append(conversation, "status", {
                  status: "running",
                  text: "已引导电脑端当前任务",
                });
                store.setStatus(conversation, "running");
                activeJobs.delete(conversation.id);
                return { threadId, steered: true, turnId: await latestTurnId(conversation) };
              }
              store.append(conversation, "status", {
                status: "queued",
                text: "已加入电脑端 Desktop 对话队列",
              });
              store.setStatus(conversation, "idle");
              activeJobs.delete(conversation.id);
              return { threadId, queued: true };
            } catch {
              if (attempt === 0) {
                store.append(conversation, "status", {
                  status: "running",
                  text: "电脑端正在使用这个对话，已排队等待当前回复结束",
                });
              }
              if (attempt === 89) {
                throw new Error("电脑端对话持续运行，等待超时。请等 Desktop 当前任务结束后重试");
              }
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          }
        }
        if (!resumed) throw new Error("无法续接电脑端线程");
      } else {
        const started = await client.startThread({
          cwd,
          model: selectedModel,
          sandbox: config.sandbox,
          developerInstructions: DESKTOP_INSTRUCTIONS,
          dynamicTools: DESKTOP_DYNAMIC_TOOLS,
          approvalPolicy,
        });
        threadId = started.thread.id;
        job.threadId = threadId;
        store.setThreadId(conversation, threadId);
      }

      const startedTurn = await client.startTurn({
        threadId,
        text,
        cwd,
        model: selectedModel,
        approvalPolicy,
      });
      job.turnId = startedTurn.turn.id;
      return { threadId, turnId: job.turnId };
    } catch (error) {
      activeJobs.delete(conversation.id);
      throw error;
    }
  }

  async function startExecTurn(conversation, text, model = "") {
    const turnConfig = model ? { ...config, model } : config;
    const turnState = { stoppedByUser: false };
    let sawTerminalStatus = false;
    const turn = startCodexTurn({
      config: turnConfig,
      conversation,
      prompt: text,
      onJson: (event) => {
        for (const normalized of normalizeCodexEvent(event)) {
          if (normalized.type === "thread" && normalized.threadId) {
            store.setThreadId(conversation, normalized.threadId);
            continue;
          }
          if (normalized.type === "status" && normalized.status === "idle") sawTerminalStatus = true;
          appendNormalizedEvent(conversation, normalized);
        }
      },
      onStderr: (line) => {
        if (!line.includes("WARN ")) console.error(`[codex] ${line}`);
      },
      onExit: (result) => {
        activeJobs.delete(conversation.id);
        if (turnState.stoppedByUser) {
          store.append(conversation, "status", { status: "idle", text: "任务已停止" });
        } else if (result.spawnError) {
          store.append(conversation, "error", { text: `无法启动 Codex：${result.spawnError.message}` });
          store.append(conversation, "status", { status: "idle", text: "启动失败" });
        } else if (result.code !== 0) {
          const details = stderrSummary(result.stderr);
          store.append(conversation, "error", {
            text: details ? `Codex 异常退出：\n${details}` : `Codex 异常退出（代码 ${result.code}）`,
          });
          store.append(conversation, "status", { status: "idle", text: "处理失败" });
        } else if (!sawTerminalStatus) {
          store.append(conversation, "status", { status: "idle", text: "处理完成" });
        }
        store.setStatus(conversation, "idle");
        void startNextQueuedMessage(conversation);
      },
    });
    activeJobs.set(conversation.id, { child: turn.child, conversation, turnState });
    return { started: true };
  }

  function queuedMessagesFor(conversationId) {
    return (pendingMessages.get(conversationId) || []).map((item) => ({
      id: item.id,
      text: item.text,
      displayText: item.displayText || item.text,
      createdAt: item.createdAt,
    }));
  }

  function broadcastQueue(conversationId) {
    broadcastPayload({
      type: "queue",
      conversationId,
      queuedMessages: queuedMessagesFor(conversationId),
    });
  }

  function enqueuePendingMessage(conversation, text, model = "", approvalPolicy = "on-request", queueId = "", displayText = "") {
    const queue = pendingMessages.get(conversation.id) || [];
    const item = {
      id: queueId || crypto.randomUUID(),
      text,
      displayText: displayText || text,
      model,
      approvalPolicy,
      createdAt: new Date().toISOString(),
    };
    queue.push(item);
    pendingMessages.set(conversation.id, queue);
    broadcastQueue(conversation.id);
    return item;
  }

  async function startNextQueuedMessage(conversation) {
    if (!conversation || activeJobs.has(conversation.id)) return;
    const queue = pendingMessages.get(conversation.id);
    if (!queue?.length) return;
    const next = queue.shift();
    if (!queue.length) pendingMessages.delete(conversation.id);
    broadcastQueue(conversation.id);
    store.append(conversation, "status", { status: "running", text: "正在处理排队消息" });
    store.setStatus(conversation, "running");
    try {
      if (config.transport === "exec") {
        await startExecTurn(conversation, next.text, next.model);
      } else {
        const result = await sendViaAppServer(conversation, next.text, next.model, next.approvalPolicy);
        const queuedEvent = conversation.events.find((event) => event.queueId === next.id);
        if (queuedEvent) {
          store.updateEvent(conversation, queuedEvent.seq, {
            delivery: result.steered ? "desktop-steered" : result.queued ? "desktop-queued" : "sent",
            turnId: result.turnId || null,
            threadId: result.threadId || conversation.threadId || null,
          });
        }
      }
    } catch (error) {
      store.append(conversation, "error", { text: `排队消息执行失败：${error.message}` });
      store.append(conversation, "status", { status: "idle", text: "处理失败" });
      store.setStatus(conversation, "idle");
    }
  }

  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");
      const pathname = url.pathname;

      if (request.method === "GET" && pathname === "/api/health") {
        return sendJson(response, 200, { ok: true, startedAt });
      }

      const mediaMatch = pathname.match(/^\/api\/media\/([0-9a-f-]{36})\/([0-9a-f-]{36})$/i);
      if ((request.method === "GET" || request.method === "HEAD") && mediaMatch) {
        const conversationId = mediaMatch[1];
        const mediaId = mediaMatch[2];
        const signature = url.searchParams.get("sig") || "";
        const expected = mediaSignature(conversationId, mediaId);
        if (!safeEqual(signature, expected)) return sendJson(response, 401, { error: "文件访问签名无效" });
        const conversation = store.get(conversationId);
        const mediaEvent = conversation?.events.find(
          (event) => event.type === "media" && event.mediaId === mediaId,
        );
        if (!mediaEvent?.path) return sendJson(response, 404, { error: "文件记录不存在" });
        return await serveLocalFile(
          request,
          response,
          mediaEvent.path,
          mediaEvent.mimeType,
          mediaEvent.fileName,
        );
      }
      const attachmentMatch = pathname.match(/^\/api\/attachments\/([0-9a-f-]{36})\/([a-z0-9._-]+\.(?:png|jpe?g|webp|gif|heic|heif|avif))$/i);
      if (request.method === "GET" && attachmentMatch) {
        const conversationId = attachmentMatch[1];
        const filename = attachmentMatch[2];
        const signature = url.searchParams.get("sig") || "";
        const expected = attachmentSignature(conversationId, filename, token);
        if (!safeEqual(signature, expected)) return sendJson(response, 401, { error: "图片访问签名无效" });
        const filePath = path.join(config.attachmentsDir, conversationId, filename);
        try {
          const stat = await fsp.stat(filePath);
          response.writeHead(200, {
            ...SECURITY_HEADERS,
            "Content-Type": MIME_TYPES.get(path.extname(filename).toLowerCase()) || "application/octet-stream",
            "Content-Length": stat.size,
            "Cache-Control": "private, max-age=86400",
          });
          fs.createReadStream(filePath).pipe(response);
        } catch {
          sendJson(response, 404, { error: "图片不存在" });
        }
        return;
      }
      if (pathname.startsWith("/api/")) {
        if (!hasValidToken(request, token)) {
          return sendJson(response, 401, { error: "未配对或配对令牌已失效" });
        }

        if (request.method === "GET" && pathname === "/api/events") {
          response.writeHead(200, {
            ...SECURITY_HEADERS,
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
            "Content-Encoding": "identity",
          });
          response.flushHeaders();
          response.socket?.setNoDelay?.(true);
          response.write(": connected\n\n");
          response.write("retry: 1500\n\n");
          for (const item of store.list()) {
            response.write(`event: conversation\ndata: ${JSON.stringify({ type: "conversation", ...item })}\n\n`);
          }
          sseClients.add(response);
          request.on("close", () => sseClients.delete(response));
          return;
        }
        if (request.method === "POST" && pathname === "/api/transcribe") {
          const mimeType = String(request.headers["content-type"] || "").split(";")[0].trim();
          if (!mimeType.startsWith("audio/") && mimeType !== "application/octet-stream") {
            return sendJson(response, 415, { error: "不支持的录音格式" });
          }
          const audio = await readBodyBuffer(request);
          if (audio.length < 800) return sendJson(response, 400, { error: "录音太短，请重新录制" });
          try {
            const result = await transcribeAudio(audio, mimeType);
            if (!result.text) return sendJson(response, 422, { error: "没有识别到语音，请重新录制" });
            return sendJson(response, 200, result);
          } catch (error) {
            console.warn(`[transcribe] ${error.message}`);
            return sendJson(response, 503, { error: `电脑端语音识别失败：${error.message}` });
          }
        }

        if (request.method === "GET" && pathname === "/api/bootstrap") {
          try {
            await refreshGlobalUnread();
          } catch {}
          return sendJson(response, 200, {
            version: packageVersion(),
            computer,
            publicUrl: config.publicUrl,
            workdir: config.workdir,
            workdirName: path.basename(config.workdir),
            transport: config.transport,
            appServerReady: Boolean(appServerClient?.ready),
              projects: config.projects,
              defaultProjectPath: config.projects[0]?.path || config.workdir,
            sandbox: config.sandbox,
            startedAt,
            conversations: store.list(),
            globalUnread: globalUnreadCount,
            globalUnreadUpdatedAt,
          });
        }

        if (request.method === "GET" && pathname === "/api/global-unread") {
          try {
            await refreshGlobalUnread();
          } catch {}
          return sendJson(response, 200, {
            count: globalUnreadCount,
            updatedAt: globalUnreadUpdatedAt,
          });
        }

        if (request.method === "GET" && pathname === "/api/models") {
          const models = await getAvailableModels({ refresh: url.searchParams.get("refresh") === "1" });
          return sendJson(response, 200, {
            models,
            selectedDefault: models.find((model) => model.isDefault)?.id || "",
          });
        }

        if (request.method === "PATCH" && pathname === "/api/computer") {
          const body = await readJson(request);
          const requestedName = typeof body.name === "string" ? body.name : "";
          if (requestedName.length > 48) return sendJson(response, 400, { error: "电脑名称不能超过 48 个字符" });
          const updated = setComputerName(config, requestedName);
          Object.assign(computer, updated);
          return sendJson(response, 200, { computer });
        }

        if (request.method === "GET" && pathname === "/api/conversations") {
          return sendJson(response, 200, { conversations: store.list() });
        }

        if (request.method === "POST" && pathname === "/api/conversations") {
          const body = await readJson(request);
          const requestedPath = typeof body.projectPath === "string" ? path.resolve(body.projectPath) : "";
          const project = requestedPath
            ? config.projects.find((item) => {
                const left = process.platform === "win32" ? item.path.toLowerCase() : item.path;
                const right = process.platform === "win32" ? requestedPath.toLowerCase() : requestedPath;
                return left === right;
              })
            : config.projects[0];
          if (!project) return sendJson(response, 403, { error: "这个项目没有配置到 Codex Pocket" });
          if (!fs.existsSync(project.path)) return sendJson(response, 400, { error: "项目目录不存在" });
          const conversation = store.create({ workdir: project.path });
          store.append(conversation, "status", { status: "idle", text: `新对话已创建：${project.name}` });
          return sendJson(response, 201, { conversation: publicConversation(conversation) });
        }

        if (request.method === "GET" && pathname === "/api/codex-sessions") {
          if (!config.codexHome) return sendJson(response, 503, { error: "没有找到 CODEX_HOME" });
          const importedBySessionId = new Map(
            [...store.conversations.values()]
              .filter((conversation) => conversation.sourceCodexSessionId)
              .map((conversation) => [conversation.sourceCodexSessionId, conversation.id]),
          );
          const requestedLimit = Number.parseInt(url.searchParams.get("limit") || "30", 10);
          const limit = Math.max(1, Math.min(Number.isFinite(requestedLimit) ? requestedLimit : 30, 100));
          const sessions = await codexLibrary.list({ limit, importedBySessionId });
          return sendJson(response, 200, { sessions });
        }

        if (request.method === "POST" && pathname === "/api/codex-sessions/import") {
          if (!config.codexHome) return sendJson(response, 503, { error: "没有找到 CODEX_HOME" });
          const body = await readJson(request);
          const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
          if (!/^[0-9a-f-]{36}$/i.test(sessionId)) return sendJson(response, 400, { error: "无效的会话 ID" });

          const existing = [...store.conversations.values()].find((conversation) => conversation.sourceCodexSessionId === sessionId);
          if (existing) {
            const conversation = store.get(existing.id);
            return sendJson(response, 200, {
              alreadyImported: true,
              conversation: publicConversation(conversation),
            });
          }

          const session = await codexLibrary.read(sessionId);
          if (!session.messages.length) return sendJson(response, 400, { error: "这个会话没有可导入的消息" });
          const targetWorkdir = session.cwd && fs.existsSync(session.cwd) ? session.cwd : config.projects[0].path;
          const conversation = store.create({
            title: session.title,
            threadId: session.id,
            workdir: targetWorkdir,
            sourceCodexSessionId: session.id,
            sourceCodexSessionPath: session.filePath,
            sourceOffset: session.byteSize,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            importedAt: new Date().toISOString(),
          });
          const importedEvents = await buildSessionMessageEvents(conversation, session.messages, { countUnread: false });
          const entries = [
            { type: "status", status: "idle", text: `已从 Codex 导入 ${session.messages.length} 条消息` },
            ...importedEvents,
          ];
          store.appendMany(conversation, entries);
          store.markRead(conversation);
          return sendJson(response, 201, { conversation: publicConversation(conversation) });
        }

        if (request.method === "POST" && pathname === "/api/desktop/link-thread") {
          const body = await readJson(request);
          const threadId = typeof body.threadId === "string" ? body.threadId.trim() : "";
          const result = await linkDesktopThread(threadId);
          return sendJson(response, result.alreadyImported ? 200 : 201, {
            linked: true,
            alreadyImported: result.alreadyImported,
            conversation: publicConversation(result.conversation),
          });
        }

        if (request.method === "POST" && pathname === "/api/desktop/link-thread/qr") {
          const body = await readJson(request);
          const threadId = typeof body.threadId === "string" ? body.threadId.trim() : "";
          const result = await linkDesktopThread(threadId);
          const qr = await createThreadLinkQr(result.conversation);
          return sendJson(response, 201, {
            linked: true,
            alreadyImported: result.alreadyImported,
            conversation: publicConversation(result.conversation),
            ...qr,
          });
        }

        const threadLinkClaimMatch = pathname.match(/^\/api\/thread-links\/([A-Za-z0-9_-]{32,64})\/claim$/);
        if (request.method === "POST" && threadLinkClaimMatch) {
          pruneThreadLinkTickets();
          const ticket = threadLinkClaimMatch[1];
          const entry = threadLinkTickets.get(ticket);
          if (!entry) return sendJson(response, 410, { error: "关联二维码已失效，请在电脑端重新生成" });
          const conversation = store.get(entry.conversationId);
          if (!conversation) {
            threadLinkTickets.delete(ticket);
            return sendJson(response, 404, { error: "要关联的对话已不存在" });
          }
          threadLinkTickets.delete(ticket);
          return sendJson(response, 200, {
            linked: true,
            conversation: publicConversation(conversation),
          });
        }
        const photoMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/photos$/i);
        if (request.method === "POST" && photoMatch) {
          const conversation = store.get(photoMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const requestedMimeType = String(request.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
          const mimeType = requestedMimeType === "image/jpg"
            ? "image/jpeg"
            : requestedMimeType === "image/x-png"
              ? "image/png"
              : requestedMimeType;
          const extensions = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
            "image/heic": ".heic",
            "image/heif": ".heif",
            "image/avif": ".avif",
          };
          const extension = extensions[mimeType];
          if (!extension) return sendJson(response, 415, { error: "请选择 JPEG、PNG、WebP、GIF、HEIC 或 AVIF 图片" });
          const image = await readBodyBuffer(request, 20 * 1024 * 1024);
          if (!image.length) return sendJson(response, 400, { error: "图片为空" });
          const originalName = String(url.searchParams.get("name") || "phone-image").trim();
          const baseName = path.basename(originalName).replace(/[\\/:*?"<>|]/g, "_").slice(0, 120) || "phone-image";
          const safeStem = path.basename(baseName, path.extname(baseName))
            .normalize("NFKD")
            .replace(/[^a-z0-9_-]+/gi, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 48);
          const fileName = `${crypto.randomUUID()}${safeStem ? `-${safeStem}` : ""}${extension}`;
          const projectRoot = conversation.workdir || config.workdir;
          const projectImageDir = path.join(projectRoot, ".codex-pocket", "phone-images", conversation.id);
          await fsp.mkdir(projectImageDir, { recursive: true });
          const localPath = path.join(projectImageDir, fileName);
          await fsp.writeFile(localPath, image);
          const mediaId = crypto.randomUUID();
          const mediaUrlValue = mediaUrl(conversation.id, mediaId);
          const event = store.append(conversation, "media", {
            mediaId,
            role: "user",
            kind: "image",
            inline: true,
            userMedia: true,
            source: "phone",
            url: mediaUrlValue,
            path: localPath,
            fileName: baseName,
            mimeType,
            size: image.length,
            caption: "手机图片",
            countUnread: false,
          });
          return sendJson(response, 201, {
            ok: true,
            url: mediaUrlValue,
            path: localPath,
            fileName: baseName,
            mimeType,
            size: image.length,
            event,
          });
        }

        const videoMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/videos$/i);
        if (request.method === "POST" && videoMatch) {
          const conversation = store.get(videoMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const mimeType = String(request.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
          const extensions = {
            "video/mp4": ".mp4",
            "video/quicktime": ".mov",
            "video/webm": ".webm",
            "video/x-m4v": ".m4v",
            "video/3gpp": ".3gp",
          };
          const extension = extensions[mimeType];
          if (!extension) return sendJson(response, 415, { error: "请选择 MP4、MOV、WebM、M4V 或 3GP 视频" });
          const video = await readBodyBuffer(request, 150 * 1024 * 1024);
          if (!video.length) return sendJson(response, 400, { error: "视频为空" });
          const originalName = String(url.searchParams.get("name") || "phone-video").trim();
          const baseName = path.basename(originalName).replace(/[\\/:*?"<>|]/g, "_").slice(0, 120) || "phone-video";
          const safeStem = path.basename(baseName, path.extname(baseName))
            .normalize("NFKD")
            .replace(/[^a-z0-9_-]+/gi, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 48);
          const fileName = `${crypto.randomUUID()}${safeStem ? `-${safeStem}` : ""}${extension}`;
          const projectRoot = conversation.workdir || config.workdir;
          const projectVideoDir = path.join(projectRoot, ".codex-pocket", "phone-videos", conversation.id);
          await fsp.mkdir(projectVideoDir, { recursive: true });
          const localPath = path.join(projectVideoDir, fileName);
          await fsp.writeFile(localPath, video);
          const mediaId = crypto.randomUUID();
          const mediaUrlValue = mediaUrl(conversation.id, mediaId);
          const event = store.append(conversation, "media", {
            mediaId,
            role: "user",
            kind: "video",
            inline: true,
            userMedia: true,
            source: "phone",
            url: mediaUrlValue,
            path: localPath,
            fileName: baseName,
            mimeType,
            size: video.length,
            caption: "手机视频",
            countUnread: false,
          });
          return sendJson(response, 201, {
            ok: true,
            url: mediaUrlValue,
            path: localPath,
            fileName: baseName,
            mimeType,
            size: video.length,
            event,
          });
        }

        const fileUploadMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/files$/i);
        if (request.method === "POST" && fileUploadMatch) {
          const conversation = store.get(fileUploadMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const mimeType = String(request.headers["content-type"] || "").split(";")[0].trim().toLowerCase() || "application/octet-stream";
          const body = await readBodyBuffer(request, 200 * 1024 * 1024);
          if (!body.length) return sendJson(response, 400, { error: "文件为空" });
          const originalName = String(url.searchParams.get("name") || "phone-file").trim();
          const baseName = path.basename(originalName).replace(/[\\/:*?"<>|]/g, "_").slice(0, 160) || "phone-file";
          const originalExtension = path.extname(baseName).toLowerCase();
          const extension = /^\.[a-z0-9]{1,12}$/i.test(originalExtension) ? originalExtension : ".bin";
          const safeStem = path.basename(baseName, path.extname(baseName))
            .normalize("NFKD")
            .replace(/[^a-z0-9_-]+/gi, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 64);
          const fileName = `${crypto.randomUUID()}${safeStem ? `-${safeStem}` : ""}${extension}`;
          const projectRoot = conversation.workdir || config.workdir;
          const projectFileDir = path.join(projectRoot, ".codex-pocket", "phone-files", conversation.id);
          await fsp.mkdir(projectFileDir, { recursive: true });
          const localPath = path.join(projectFileDir, fileName);
          await fsp.writeFile(localPath, body);
          const mediaId = crypto.randomUUID();
          const mediaUrlValue = mediaUrl(conversation.id, mediaId);
          const event = store.append(conversation, "media", {
            mediaId,
            role: "user",
            kind: "file",
            inline: false,
            userMedia: true,
            source: "phone",
            url: mediaUrlValue,
            path: localPath,
            fileName: baseName,
            mimeType,
            size: body.length,
            caption: "手机文件",
            countUnread: false,
          });
          return sendJson(response, 201, {
            ok: true,
            url: mediaUrlValue,
            path: localPath,
            fileName: baseName,
            mimeType,
            size: body.length,
            event,
          });
        }

        const voiceMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/voice$/i);
        if (request.method === "POST" && voiceMatch) {
          const conversation = store.get(voiceMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const mimeType = String(request.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
          if (!mimeType.startsWith("audio/") && mimeType !== "application/octet-stream") {
            return sendJson(response, 415, { error: "只能上传语音文件" });
          }
          const audio = await readBodyBuffer(request, 20 * 1024 * 1024);
          if (!audio.length) return sendJson(response, 400, { error: "语音为空" });
          const extensions = {
            "audio/mp4": ".m4a",
            "audio/m4a": ".m4a",
            "audio/aac": ".aac",
            "audio/webm": ".webm",
            "audio/ogg": ".ogg",
            "audio/wav": ".wav",
            "audio/mpeg": ".mp3",
          };
          const extension = extensions[mimeType] || ".m4a";
          const durationMs = Math.max(0, Math.min(60_000, Number(url.searchParams.get("durationMs")) || 0));
          const fileName = `voice-${Date.now()}${extension}`;
          const projectRoot = conversation.workdir || config.workdir;
          const projectVoiceDir = path.join(projectRoot, ".codex-pocket", "phone-voice", conversation.id);
          const attachmentDir = path.join(config.attachmentsDir, conversation.id);
          await fsp.mkdir(projectVoiceDir, { recursive: true });
          await fsp.mkdir(attachmentDir, { recursive: true });
          const localPath = path.join(projectVoiceDir, fileName);
          const attachmentPath = path.join(attachmentDir, fileName);
          await fsp.writeFile(localPath, audio);
          await fsp.copyFile(localPath, attachmentPath);
          const mediaId = crypto.randomUUID();
          const resolvedMimeType = mimeType === "application/octet-stream" ? "audio/mp4" : mimeType;
          const event = store.append(conversation, "media", {
            mediaId,
            role: "user",
            kind: "audio",
            inline: true,
            voiceMessage: true,
            durationMs,
            path: localPath,
            fileName,
            mimeType: resolvedMimeType,
            size: audio.length,
            caption: "语音消息",
            url: mediaUrl(conversation.id, mediaId),
            countUnread: false,
          });
          return sendJson(response, 201, {
            ok: true,
            path: localPath,
            fileName,
            mimeType: resolvedMimeType,
            size: audio.length,
            durationMs,
            event,
          });
        }
        const messageMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/messages$/i);
        if (request.method === "POST" && messageMatch) {
          const conversation = store.get(messageMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });

          const body = await readJson(request);
          const text = typeof body.text === "string" ? body.text.trim() : "";
          const displayText = typeof body.displayText === "string" ? body.displayText.trim().slice(0, 160) : "";
          const hidden = body.hidden === true;
          if (!text) return sendJson(response, 400, { error: "消息不能为空" });
          if (text.length > config.maxMessageChars) {
            return sendJson(response, 413, { error: `消息不能超过 ${config.maxMessageChars} 个字符` });
          }
          const requestedModel = await resolveRequestedModel(body.model);

          const requestedApprovalPolicy = resolveApprovalPolicy(body.approvalPolicy);
          if (activeJobs.has(conversation.id)) {
            const userEvent = store.append(conversation, "user_message", { text, displayText: displayText || undefined, hidden });
            const job = activeJobs.get(conversation.id);
            if (job.kind === "app-server" && job.turnId && appServerClient?.ready) {
              try {
                await appServerClient.steerTurn(job.threadId, job.turnId, text, 10_000);
                store.updateEvent(conversation, userEvent.seq, {
                  delivery: "steered",
                  turnId: job.turnId,
                  threadId: job.threadId,
                });
                store.append(conversation, "status", {
                  status: "running",
                  text: "已将新消息引导到当前任务",
                });
                return sendJson(response, 202, {
                  ok: true,
                  steered: true,
                  queued: false,
                  conversationId: conversation.id,
                  turnId: job.turnId,
                });
              } catch (error) {
                store.append(conversation, "status", {
                  status: "running",
                  text: "当前回合不支持引导，消息已改为排队",
                });
              }
            }
            store.append(conversation, "status", {
              status: "queued",
              text: "消息已加入队列，将在当前任务结束后发送",
            });
            const queueId = crypto.randomUUID();
            const queuedMessage = enqueuePendingMessage(conversation, text, requestedModel, requestedApprovalPolicy, queueId, displayText);
            store.updateEvent(conversation, userEvent.seq, {
              delivery: "queued",
              queueId,
            });
            return sendJson(response, 202, {
              ok: true,
              queued: true,
              conversationId: conversation.id,
              queuedMessage,
              queuedMessages: queuedMessagesFor(conversation.id),
            });
          }

          const directUserEvent = store.append(conversation, "user_message", { text, displayText: displayText || undefined, hidden });
          store.setStatus(conversation, "running");
          store.append(conversation, "status", { status: "running", text: "已发送给 Codex" });
            if (config.transport !== "exec") {
              try {
                const result = await sendViaAppServer(conversation, text, requestedModel, requestedApprovalPolicy);
                store.updateEvent(conversation, directUserEvent.seq, {
                  delivery: result.steered ? "desktop-steered" : result.queued ? "desktop-queued" : "sent",
                  turnId: result.turnId || null,
                  threadId: result.threadId || conversation.threadId || null,
                });
                return sendJson(response, 202, { ok: true, steered: Boolean(result.steered), queued: Boolean(result.queued), conversationId: conversation.id, transport: "app-server" });
              } catch (error) {
                console.error(`[app-server] failed: ${error.message}`);
                store.append(conversation, "error", { text: `共享 app-server 执行失败：${error.message}` });
                store.append(conversation, "status", { status: "idle", text: "共享 app-server 执行失败" });
                store.setStatus(conversation, "idle");
                return sendJson(response, 503, { error: "共享 app-server 执行失败，请检查电脑端 Codex" });
              }
            }

          store.updateEvent(conversation, directUserEvent.seq, { delivery: "sent" });
          await startExecTurn(conversation, text, requestedModel);
          return sendJson(response, 202, { ok: true, conversationId: conversation.id });
        }

        const recallMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/messages\/(\d+)\/recall$/i);
        if (request.method === "POST" && recallMatch) {
          const conversation = store.get(recallMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const seq = Number(recallMatch[2]);
          const event = conversation.events.find((item) => item.seq === seq);
          if (!event || event.type !== "user_message") return sendJson(response, 404, { error: "找不到这条消息" });
          if (event.recalled) return sendJson(response, 409, { error: "这条消息已经撤回" });
          const ageMs = Date.now() - new Date(event.ts).getTime();
          if (!Number.isFinite(ageMs) || ageMs > 2 * 60_000) {
            return sendJson(response, 409, { error: "消息发送超过 2 分钟，不能撤回" });
          }

          let reverted = false;
          if (event.delivery === "queued" && event.queueId) {
            const queue = pendingMessages.get(conversation.id) || [];
            const next = queue.filter((item) => item.id !== event.queueId);
            if (next.length) pendingMessages.set(conversation.id, next);
            else pendingMessages.delete(conversation.id);
            broadcastQueue(conversation.id);
          } else if (event.delivery === "desktop-queued") {
            if (!await deleteDesktopQueuedMessage(conversation, event.text)) {
              return sendJson(response, 409, { error: "未能从电脑端队列撤回这条消息" });
            }
          } else {
            const threadId = event.threadId || conversation.sourceCodexSessionId || conversation.threadId;
            if (!threadId || !event.turnId) {
              return sendJson(response, 409, { error: "这条消息缺少可回退的回合记录" });
            }
            if (config.transport === "exec") {
              return sendJson(response, 409, { error: "当前执行通道不支持历史回退" });
            }
            const active = activeJobs.get(conversation.id);
            if (active && active.turnId !== event.turnId) {
              return sendJson(response, 409, { error: "当前有另一个任务正在运行，请结束后再撤回" });
            }
            try {
              const client = await ensureAppServer();
              if (active?.turnId === event.turnId) {
                active.turnState.stoppedByUser = true;
                await client.interruptTurn(active.threadId, active.turnId);
                for (let attempt = 0; attempt < 50 && activeJobs.has(conversation.id); attempt += 1) {
                  await new Promise((resolve) => setTimeout(resolve, 200));
                }
              }
              await client.revertThread(threadId, event.turnId);
              reverted = true;
            } catch (error) {
              return sendJson(response, 409, { error: `回退失败：${error.message}` });
            }
          }

          let auditStored = false;
          const threadId = conversation.sourceCodexSessionId || conversation.threadId;
          if (threadId && config.transport !== "exec") {
            try {
              const client = await ensureAppServer();
              await client.injectThreadItems(threadId, [{
                type: "message",
                role: "user",
                content: [{
                  type: "input_text",
                  text: `[Codex Pocket 撤回记录] 用户撤回了一条消息，并回退到该消息发送前。撤回时间：${new Date().toISOString()}`,
                }],
              }]);
              auditStored = true;
            } catch (error) {
              console.warn(`[recall] audit injection failed: ${error.message}`);
            }
          }
          store.recallAndTruncate(conversation, seq);
          if (activeJobs.has(conversation.id)) activeJobs.delete(conversation.id);
          store.setStatus(conversation, "idle");
          return sendJson(response, 200, {
            ok: true,
            recalled: true,
            reverted,
            auditStored,
            queuedMessages: queuedMessagesFor(conversation.id),
            conversation: publicConversation(conversation),
          });
        }

        const approvalMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/approvals\/([0-9a-f-]{36})$/i);
        if (request.method === "POST" && approvalMatch) {
          const conversation = store.get(approvalMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const body = await readJson(request);
          const approved = body.decision === "accept";
          if (!resolveApproval(conversation.id, approvalMatch[2], approved)) {
            return sendJson(response, 409, { error: "这条权限审核已失效" });
          }
          return sendJson(response, 202, { ok: true, decision: approved ? "accept" : "decline" });
        }

        const steerMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/steer$/i);
        if (request.method === "POST" && steerMatch) {
          const conversation = store.get(steerMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const body = await readJson(request);
          const queueId = typeof body.queueId === "string" ? body.queueId : "";
          const queue = pendingMessages.get(conversation.id) || [];
          const index = queue.findIndex((item) => item.id === queueId);
          if (index < 0) return sendJson(response, 409, { error: "这条排队消息已经发送或不存在" });
          const queued = queue[index];
          const job = activeJobs.get(conversation.id);
          if (!job) {
            const remaining = queue.filter((item) => item.id !== queueId);
            pendingMessages.set(conversation.id, [queued, ...remaining]);
            broadcastQueue(conversation.id);
            void startNextQueuedMessage(conversation);
            return sendJson(response, 202, {
              ok: true,
              started: true,
              queuedMessages: remaining,
            });
          }
          if (job.kind !== "app-server" || !job.turnId) {
            return sendJson(response, 409, { error: "当前任务尚不能引导" });
          }
          try {
            await appServerClient.steerTurn(job.threadId, job.turnId, queued.text, 10_000);
            queue.splice(index, 1);
            if (!queue.length) pendingMessages.delete(conversation.id);
            else pendingMessages.set(conversation.id, queue);
            const queuedEvent = conversation.events.find(
              (event) => event.type === "user_message" && event.queueId === queueId,
            );
            if (queuedEvent) {
              store.updateEvent(conversation, queuedEvent.seq, {
                delivery: "steered",
                turnId: job.turnId,
                threadId: job.threadId,
              });
            }
            store.append(conversation, "status", {
              status: "running",
              text: "已将排队消息引导到当前任务",
            });
            broadcastQueue(conversation.id);
            return sendJson(response, 202, {
              ok: true,
              steered: true,
              queuedMessages: queuedMessagesFor(conversation.id),
            });
          } catch (error) {
            return sendJson(response, 409, { error: `引导失败：${error.message}` });
          }
        }

        const cancelAllQueueMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/queue\/cancel-all$/i);
        if (request.method === "POST" && cancelAllQueueMatch) {
          const conversation = store.get(cancelAllQueueMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const queue = pendingMessages.get(conversation.id) || [];
          if (queue.length) {
            for (const item of queue) {
              const queuedEvent = conversation.events.find(
                (event) => event.type === "user_message" && event.queueId === item.id,
              );
              if (queuedEvent) store.updateEvent(conversation, queuedEvent.seq, { delivery: "queue-cancelled" });
            }
          }
          pendingMessages.delete(conversation.id);
          broadcastQueue(conversation.id);
          return sendJson(response, 200, {
            ok: true,
            cancelled: true,
            queuedMessages: [],
          });
        }

        const cancelQueueMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/queue\/([0-9a-f-]{36})\/cancel$/i);
        if (request.method === "POST" && cancelQueueMatch) {
          const conversation = store.get(cancelQueueMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const queueId = cancelQueueMatch[2];
          const queue = pendingMessages.get(conversation.id) || [];
          const index = queue.findIndex((item) => item.id === queueId);
          if (index < 0) return sendJson(response, 409, { error: "这条消息已经开始发送或已不在队列中" });
          queue.splice(index, 1);
          if (queue.length) pendingMessages.set(conversation.id, queue);
          else pendingMessages.delete(conversation.id);
          const queuedEvent = conversation.events.find(
            (event) => event.type === "user_message" && event.queueId === queueId,
          );
          if (queuedEvent) store.updateEvent(conversation, queuedEvent.seq, { delivery: "queue-cancelled" });
          broadcastQueue(conversation.id);
          return sendJson(response, 200, {
            ok: true,
            cancelled: true,
            queuedMessages: queuedMessagesFor(conversation.id),
          });
        }

        const stopMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/stop$/i);
        if (request.method === "POST" && stopMatch) {
          const conversation = store.get(stopMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const job = activeJobs.get(conversation.id);
          if (!job) return sendJson(response, 409, { error: "当前没有运行中的任务" });
          job.turnState.stoppedByUser = true;
          pendingMessages.delete(conversation.id);
          broadcastQueue(conversation.id);
          for (const [approvalId, approval] of pendingApprovals) {
            if (approval.conversationId !== conversation.id) continue;
            clearTimeout(approval.timer);
            approval.resolve({ decision: "cancel" });
            pendingApprovals.delete(approvalId);
          }
          store.append(conversation, "status", { status: "stopping", text: "正在停止任务" });
          if (job.kind === "app-server") {
            if (!job.turnId) return sendJson(response, 409, { error: "任务仍在启动，请稍后再试" });
            await appServerClient.interruptTurn(job.threadId, job.turnId);
          } else {
            stopProcessTree(job.child);
          }
          return sendJson(response, 202, { ok: true });
        }

        const readMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/read$/i);
        if (request.method === "POST" && readMatch) {
          const conversation = store.get(readMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          await markConversationRead(conversation);
          return sendJson(response, 200, {
            ok: true,
            conversation: publicConversation(conversation, conversation.lastSeq),
          });
        }

        const conversationMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})$/i);
        if (request.method === "GET" && conversationMatch) {
          const conversation = store.get(conversationMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const after = Number.parseInt(url.searchParams.get("after") || "0", 10) || 0;
          const limit = Math.max(0, Math.min(1000, Number.parseInt(url.searchParams.get("limit") || "0", 10) || 0));
          return sendJson(response, 200, {
            conversation: publicConversation(conversation, after, limit),
            running: activeJobs.has(conversation.id),
            queuedMessages: queuedMessagesFor(conversation.id),
          });
        }

        const archiveMatch = pathname.match(/^\/api\/conversations\/([0-9a-f-]{36})\/(archive|unarchive)$/i);
        if (request.method === "POST" && archiveMatch) {
          const conversation = store.get(archiveMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const archive = archiveMatch[2].toLowerCase() === "archive";
          if (archive && (activeJobs.has(conversation.id) || conversation.status === "running")) {
            return sendJson(response, 409, { error: "任务运行中，结束后再归档" });
          }
          let shared = false;
          const threadId = conversation.sourceCodexSessionId || conversation.threadId;
          if (threadId && config.transport !== "exec") {
            try {
              const client = await ensureAppServer();
              if (archive) await client.archiveThread(threadId);
              else await client.unarchiveThread(threadId);
              shared = true;
            } catch (error) {
              console.warn(`[archive] shared thread sync failed: ${error.message}`);
            }
          }
          if (archive) store.archive(conversation);
          else store.unarchive(conversation);
          return sendJson(response, 200, { ok: true, archived: archive, shared });
        }

        if (request.method === "DELETE" && conversationMatch) {
          const conversation = store.get(conversationMatch[1]);
          if (!conversation) return sendJson(response, 404, { error: "对话不存在" });
          const job = activeJobs.get(conversation.id);
          if (job) {
            job.turnState.stoppedByUser = true;
            if (job.kind === "app-server" && job.turnId) {
              try { await appServerClient.interruptTurn(job.threadId, job.turnId); } catch {}
            } else {
              stopProcessTree(job.child);
            }
            activeJobs.delete(conversation.id);
          }
          await store.delete(conversation.id);
          return sendJson(response, 200, { ok: true });
        }

        return sendJson(response, 404, { error: "API 不存在" });
      }

      if (request.method !== "GET" && request.method !== "HEAD") {
        return sendJson(response, 405, { error: "Method not allowed" });
      }
      return await serveStatic(config, request, response, pathname);
    } catch (error) {
      console.error(error);
      return sendJson(response, error.statusCode || 500, { error: error.statusCode ? error.message : "服务器内部错误" });
    }
  });
  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    if (pathname !== "/api/ws") {
      socket.write("HTTP/1.1 404 Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n");
      socket.destroy();
      return;
    }
    acceptWebSocketUpgrade(request, socket, head, token, {
      open(session) {
        wsClients.add(session);
        for (const item of store.list()) {
          session.socket.write(encodeWebSocketFrame(JSON.stringify({ type: "conversation", ...item })));
        }
      },
      close(session) {
        wsClients.delete(session);
      },
    });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(config.port, config.host, resolve);
  });

  if (config.transport !== "exec") {
    ensureAppServer().catch((error) => {
      console.warn(`[app-server] proactive connection failed: ${error.message}`);
    });
  }

  const address = server.address();
  const localUrl = `http://${config.host}:${address.port}`;
  console.log(`[server] Codex Pocket listening at ${localUrl}`);
  console.log(`[server] Computer: ${computer.name} (${computer.id})`);
  console.log(`[server] Workdir: ${config.workdir}`);

  let syncingSessions = false;
  async function syncImportedConversations() {
    if (syncingSessions) return;
    syncingSessions = true;
    try {
      for (const conversation of store.conversations.values()) {
        if (!conversation.sourceCodexSessionId || activeJobs.has(conversation.id)) continue;
        try {
          if (!conversation.sourceCodexSessionPath) {
            const session = await codexLibrary.read(conversation.sourceCodexSessionId);
            store.updateSourceCursor(conversation, session.filePath, session.byteSize);
            continue;
          }
          const knownIds = new Set(
            conversation.events.map((event) => event.sourceItemId).filter(Boolean),
          );
          const knownContent = new Set(
            conversation.events
              .filter((event) => event.type === "user_message" || event.type === "assistant_message")
              .map((event) => `${event.type === "user_message" ? "user" : "assistant"}\u0000${event.text}`),
          );
          const syncOffset = knownIds.size ? (conversation.sourceOffset || 0) : 0;
          const update = await codexLibrary.readNewMessages(
            conversation.sourceCodexSessionPath,
            syncOffset,
            knownIds,
          );
          if (update.missing) continue;
          const hadNewBytes = update.size > syncOffset;
          const latestTurn = hadNewBytes || conversation.status === "running"
            ? await codexLibrary.readLatestTurnState(conversation.sourceCodexSessionPath)
            : null;
          const newMessages = update.messages.filter((message) => !knownContent.has(`${message.role}\u0000${message.text}`));
          if (latestTurn?.state === "running" || update.lastTurnEvent === "started" || (!update.lastTurnEvent && newMessages.some((message) => message.role === "user"))) {
            if (conversation.status !== "running") store.setStatus(conversation, "running");
          }
          if (newMessages.length) {
            const syncedEvents = await buildSessionMessageEvents(conversation, newMessages, {
              countUnread: true,
              syncedFromCodex: true,
            });
            store.appendMany(conversation, syncedEvents);
            const syncedUserTexts = new Set(newMessages.filter((message) => message.role === "user").map((message) => message.text.trim()));
            const queue = pendingMessages.get(conversation.id);
            if (queue?.length && syncedUserTexts.size) {
              const remaining = queue.filter((item) => !syncedUserTexts.has(item.text.trim()));
              if (remaining.length !== queue.length) {
                if (remaining.length) pendingMessages.set(conversation.id, remaining);
                else pendingMessages.delete(conversation.id);
                broadcastQueue(conversation.id);
              }
            }
          }
          if (latestTurn?.state === "idle" || (!latestTurn && update.lastTurnEvent === "completed")) {
            if (conversation.status !== "idle") store.setStatus(conversation, "idle");
            void startNextQueuedMessage(conversation);
          }
          if (update.newOffset !== conversation.sourceOffset) {
            store.updateSourceCursor(conversation, conversation.sourceCodexSessionPath, update.newOffset);
          }
        } catch (error) {
          console.warn(`[sync] ${conversation.id}: ${error.message}`);
        }
      }
    } finally {
      syncingSessions = false;
    }
  }

  const sessionSyncTimer = setInterval(syncImportedConversations, 1200);
  sessionSyncTimer.unref();
  const realtimeHeartbeatTimer = setInterval(() => {
    for (const client of sseClients) {
      try {
        client.write(": heartbeat\n\n");
        client.flush?.();
      } catch {
        sseClients.delete(client);
      }
    }
    const frame = encodeWebSocketFrame(JSON.stringify({ type: "heartbeat", ts: Date.now() }));
    for (const session of wsClients) {
      try {
        session.socket.write(frame);
      } catch {
        wsClients.delete(session);
      }
    }
  }, 10_000);
  realtimeHeartbeatTimer.unref();
  async function close() {
    clearInterval(sessionSyncTimer);
    clearInterval(realtimeHeartbeatTimer);
    if (readStateTimer) clearInterval(readStateTimer);
    for (const client of sseClients) {
      try { client.end(); } catch {}
    }
    sseClients.clear();
    for (const session of wsClients) {
      try { session.socket.destroy(); } catch {}
    }
    wsClients.clear();
    await Promise.all([...activeJobs.values()].map(async (job) => {
      if (job.kind === "app-server" && job.turnId && appServerClient) {
        try { await appServerClient.interruptTurn(job.threadId, job.turnId); } catch {}
      } else {
        stopProcessTree(job.child);
      }
    }));
    if (appServerClient) await appServerClient.stop();
    await store.waitForWrites();
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeIdleConnections?.();
    setTimeout(() => server.closeAllConnections?.(), 800).unref();
    await closed;
  }

  return { server, config, token, store, localUrl, close };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const instance = await startServer();
  const shutdown = async () => {
    console.log("\n[server] Shutting down…");
    await instance.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}




















































