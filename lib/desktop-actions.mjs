import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fsp from "node:fs/promises";
import vm from "node:vm";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

export function normalizeDesktopUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("只允许打开 HTTP 或 HTTPS 地址");
  }
  return parsed.toString();
}

export function browserCandidates(browser = "chrome") {
  const programFiles = process.env.PROGRAMFILES || "C:\\Program Files";
  const programFilesX86 = process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)";
  const localAppData = process.env.LOCALAPPDATA || "";
  const chrome = [
    path.join(programFiles, "Google", "Chrome", "Application", "chrome.exe"),
    localAppData && path.join(localAppData, "Google", "Chrome", "Application", "chrome.exe"),
  ].filter(Boolean);
  const edge = [
    path.join(programFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
    path.join(programFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
  ];
  if (browser === "edge") return [...edge, ...chrome];
  if (browser === "default") return [];
  return [...chrome, ...edge];
}

const execFileAsync = promisify(execFile);
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let jsQrFunction = null;

function getJsQr() {
  if (jsQrFunction) return jsQrFunction;
  const sandbox = {};
  const source = fs.readFileSync(path.join(ROOT_DIR, "public", "vendor", "jsQR.js"), "utf8");
  vm.runInNewContext(source, sandbox, { timeout: 3000 });
  jsQrFunction = sandbox.jsQR;
  if (typeof jsQrFunction !== "function") throw new Error("无法加载本地二维码识别库");
  return jsQrFunction;
}

export async function captureBrowserWindow({
  outFile,
  rawFile = "",
  titlePattern = "淘宝|Taobao|登录|Chrome",
  timeoutMs = 15000,
}) {
  await fsp.mkdir(path.dirname(outFile), { recursive: true });
  if (rawFile) await fsp.mkdir(path.dirname(rawFile), { recursive: true });
  const script = path.join(ROOT_DIR, "scripts", "capture-window.ps1");
  const args = [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    script,
    "-OutFile",
    outFile,
    "-TitlePattern",
    titlePattern,
  ];
  if (rawFile) args.push("-RawFile", rawFile);
  const { stdout } = await execFileAsync("powershell.exe", args, {
    windowsHide: true,
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024,
  });
  return JSON.parse(String(stdout).trim() || "{}");
}

export async function detectQrRegion(rawFile, width, height, stride = width * 4) {
  if (!width || !height) throw new Error("窗口尺寸无效");
  const raw = await fsp.readFile(rawFile);
  if (raw.length < stride * height) throw new Error("窗口像素数据不完整");
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const source = y * stride + x * 4;
      const target = (y * width + x) * 4;
      rgba[target] = raw[source + 2];
      rgba[target + 1] = raw[source + 1];
      rgba[target + 2] = raw[source];
      rgba[target + 3] = raw[source + 3];
    }
  }
  const result = getJsQr()(rgba, width, height, { inversionAttempts: "attemptBoth" });
  if (!result?.location) return null;
  const points = [
    result.location.topLeftCorner,
    result.location.topRightCorner,
    result.location.bottomLeftCorner,
    result.location.bottomRightCorner,
  ];
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxX = Math.max(...points.map((point) => point.x));
  const maxY = Math.max(...points.map((point) => point.y));
  const qrWidth = maxX - minX;
  const qrHeight = maxY - minY;
  const padding = Math.max(16, Math.round(Math.max(qrWidth, qrHeight) * 0.14));
  const x = Math.max(0, Math.floor(minX - padding));
  const y = Math.max(0, Math.floor(minY - padding));
  const right = Math.min(width, Math.ceil(maxX + padding));
  const bottom = Math.min(height, Math.ceil(maxY + padding));
  return { x, y, width: Math.max(1, right - x), height: Math.max(1, bottom - y), data: result.data };
}

export async function cropImage(inputFile, outputFile, crop) {
  await fsp.mkdir(path.dirname(outputFile), { recursive: true });
  const script = path.join(ROOT_DIR, "scripts", "crop-image.ps1");
  await execFileAsync("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    script,
    "-InputFile",
    inputFile,
    "-OutputFile",
    outputFile,
    "-X",
    String(crop.x),
    "-Y",
    String(crop.y),
    "-Width",
    String(crop.width),
    "-Height",
    String(crop.height),
  ], {
    windowsHide: true,
    timeout: 15000,
    maxBuffer: 1024 * 1024,
  });
}

export async function captureQrCode({ outFile, titlePattern }) {
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "codex-pocket-qr-"));
  const fullFile = path.join(tempDir, "window.png");
  const rawFile = path.join(tempDir, "window.raw");
  try {
    const window = await captureBrowserWindow({ outFile: fullFile, rawFile, titlePattern });
    const region = await detectQrRegion(rawFile, Number(window.Width), Number(window.Height), Number(window.Stride));
    if (!region) return { found: false, window };
    await cropImage(fullFile, outFile, region);
    return { found: true, window, region };
  } finally {
    await fsp.rm(tempDir, { recursive: true, force: true });
  }
}

export async function openLocalUrl(rawUrl, options = {}) {
  const url = normalizeDesktopUrl(rawUrl);
  const platform = options.platform || process.platform;
  const exists = options.exists || fs.existsSync;
  const spawnImpl = options.spawnImpl || spawn;
  const candidates = platform === "win32" ? browserCandidates(options.browser).filter(exists) : [];
  const command = candidates[0] || (platform === "win32" ? "explorer.exe" : "xdg-open");
  const args = [url];

  const child = spawnImpl(command, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: false,
  });
  await new Promise((resolve, reject) => {
    child.once("spawn", resolve);
    child.once("error", reject);
  });
  child.unref();
  return { url, browser: candidates[0] ? path.basename(command) : "default browser", pid: child.pid || null };
}
