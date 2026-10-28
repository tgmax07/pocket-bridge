import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const source = fs.readFileSync(filePath, "utf8");
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv(path.join(ROOT_DIR, ".env"));

function integerEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(value) ? value : fallback;
}

function resolveFromRoot(value, fallback) {
  return path.resolve(ROOT_DIR, value || fallback);
}

function prefixArgsFromEnv() {
  const raw = process.env.CODEX_BIN_ARGS_JSON;
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
    throw new Error("CODEX_BIN_ARGS_JSON must be a JSON string array.");
  }
  return parsed;
}

function resolveWhisperModel(home) {
  const configured = (process.env.CODEX_POCKET_WHISPER_MODEL || "").trim();
  if (configured) return configured;
  if (!home) return "base";
  const snapshotsDir = path.join(
    home,
    ".cache",
    "huggingface",
    "hub",
    "models--Systran--faster-whisper-base",
    "snapshots",
  );
  try {
    const candidates = fs.readdirSync(snapshotsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(snapshotsDir, entry.name, "model.bin"));
    return candidates.find((candidate) => fs.existsSync(candidate))
      ? path.dirname(candidates.find((candidate) => fs.existsSync(candidate)))
      : "base";
  } catch {
    return "base";
  }
}

function projectList(defaultWorkdir) {
  const configured = (process.env.CODEX_PROJECTS || "")
    .split(path.delimiter)
    .map((item) => item.trim())
    .filter(Boolean);

  const seen = new Set();
  return [defaultWorkdir, ...configured]
    .map((item) => path.resolve(item))
    .filter((item) => {
      const key = process.platform === "win32" ? item.toLowerCase() : item;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((projectPath) => ({
      name: path.basename(projectPath) || projectPath,
      path: projectPath,
      exists: fs.existsSync(projectPath),
    }));
}

export function getConfig(overrides = {}) {
  const dataDir = path.resolve(overrides.dataDir || process.env.CODEX_POCKET_DATA_DIR || path.join(ROOT_DIR, "data"));
  const workdir = path.resolve(overrides.workdir || resolveFromRoot(process.env.CODEX_WORKDIR, "workspace"));
  const sandbox = overrides.sandbox || process.env.CODEX_SANDBOX || "workspace-write";
  const allowedSandboxes = new Set(["read-only", "workspace-write", "danger-full-access"]);
  if (!allowedSandboxes.has(sandbox)) {
    throw new Error(`Invalid CODEX_SANDBOX: ${sandbox}`);
  }
  const home = process.env.HOME || process.env.USERPROFILE || "";

  return {
    rootDir: ROOT_DIR,
    publicDir: path.join(ROOT_DIR, "public"),
    dataDir,
    conversationsDir: path.join(dataDir, "conversations"),
    attachmentsDir: path.join(dataDir, "attachments"),
    runtimeDir: path.join(ROOT_DIR, ".runtime"),
    audioDir: path.join(ROOT_DIR, ".runtime", "audio"),
    workdir,
    projects: overrides.projects || projectList(workdir),
    codexHome: overrides.codexHome || process.env.CODEX_HOME || (home ? path.join(home, ".codex") : ""),
    host: overrides.host || "127.0.0.1",
    port: overrides.port ?? integerEnv("CODEX_POCKET_PORT", 8787),
    sandbox,
    model: overrides.model || process.env.CODEX_MODEL || "",
    codexBin: overrides.codexBin || process.env.CODEX_BIN || "codex",
    codexBinArgs: overrides.codexBinArgs || prefixArgsFromEnv(),
    transport: overrides.transport || process.env.CODEX_TRANSPORT || "app-server",
    transcribePython: overrides.transcribePython || process.env.CODEX_POCKET_TRANSCRIBE_PYTHON || (home
      ? path.join(home, ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "python", "python.exe")
      : "python"),
    transcribeScript: overrides.transcribeScript || path.join(ROOT_DIR, "scripts", "transcribe-audio.py"),
    whisperModel: overrides.whisperModel || resolveWhisperModel(home),
    ffmpegBin: overrides.ffmpegBin || process.env.CODEX_POCKET_FFMPEG || "ffmpeg",
    publicUrl: (overrides.publicUrl || process.env.CODEX_POCKET_PUBLIC_URL || "").replace(/\/$/, ""),
    maxMessageChars: integerEnv("CODEX_POCKET_MAX_MESSAGE_CHARS", 60_000),
    maxContextChars: integerEnv("CODEX_POCKET_MAX_CONTEXT_CHARS", 30_000),
  };
}

export function ensureDataDirs(config) {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.mkdirSync(config.conversationsDir, { recursive: true });
  fs.mkdirSync(config.attachmentsDir, { recursive: true });
  fs.mkdirSync(config.runtimeDir, { recursive: true });
  fs.mkdirSync(config.audioDir, { recursive: true });
  fs.mkdirSync(config.workdir, { recursive: true });
}

export function getPairingToken(config) {
  const envToken = (process.env.CODEX_POCKET_TOKEN || "").trim();
  if (envToken) {
    if (envToken.length < 24) throw new Error("CODEX_POCKET_TOKEN must contain at least 24 characters.");
    return envToken;
  }

  const tokenPath = path.join(config.dataDir, "pairing-token");
  if (fs.existsSync(tokenPath)) {
    const existing = fs.readFileSync(tokenPath, "utf8").trim();
    if (existing.length >= 24) return existing;
  }
  const token = crypto.randomBytes(32).toString("base64url");
  fs.writeFileSync(tokenPath, `${token}\n`, { encoding: "utf8", mode: 0o600 });
  return token;
}

export function rotatePairingToken(config) {
  const token = crypto.randomBytes(32).toString("base64url");
  fs.writeFileSync(path.join(config.dataDir, "pairing-token"), `${token}\n`, { encoding: "utf8", mode: 0o600 });
  return token;
}

const PRESERVED_ENV_KEYS = new Set([
  "ALL_PROXY",
  "APPDATA",
  "COMSPEC",
  "COMMONPROGRAMFILES",
  "COMMONPROGRAMFILES(X86)",
  "HOMEDRIVE",
  "HOMEPATH",
  "HOME",
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "LANG",
  "LC_ALL",
  "LOCALAPPDATA",
  "NO_PROXY",
  "NUMBER_OF_PROCESSORS",
  "OS",
  "PATH",
  "PATHEXT",
  "PROCESSOR_ARCHITECTURE",
  "PROGRAMDATA",
  "PROGRAMFILES",
  "PROGRAMFILES(X86)",
  "PSMODULEPATH",
  "SHELL",
  "SSH_AUTH_SOCK",
  "SYSTEMDRIVE",
  "SYSTEMROOT",
  "TEMP",
  "TERM",
  "TMP",
  "TMPDIR",
  "USER",
  "USERDOMAIN",
  "USERNAME",
  "USERPROFILE",
  "WINDIR",
]);

export function buildCodexEnvironment() {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value === undefined) continue;
    const normalized = key.toUpperCase();
    if (PRESERVED_ENV_KEYS.has(normalized) || normalized.startsWith("LC_")) {
      env[key] = value;
    }
  }
  const home = env.HOME || env.USERPROFILE || (env.HOMEDRIVE && env.HOMEPATH ? `${env.HOMEDRIVE}${env.HOMEPATH}` : "");
  if (home) {
    env.HOME = home;
    env.CODEX_HOME = process.env.CODEX_HOME || path.join(home, ".codex");
  }
  return env;
}




