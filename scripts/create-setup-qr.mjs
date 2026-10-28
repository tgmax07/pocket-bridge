import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeQrPngFile } from "../lib/qr-code.mjs";

const args = process.argv.slice(2);
const option = (name, fallback = "") => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const token = (await fs.readFile(path.join(root, "data", "pairing-token"), "utf8")).trim();
const threadId = option("--thread-id", process.env.CODEX_THREAD_ID || "");
const output = path.resolve(option("--output", path.join(root, "data", "setup-qr.png")));
await fs.mkdir(path.dirname(output), { recursive: true });

let target = "";
let title = "连接电脑";
let expiresAt = "";
if (threadId) {
  const response = await fetch(`${process.env.CODEX_POCKET_LOCAL_URL || "http://127.0.0.1:8787"}/api/desktop/link-thread/qr`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ threadId }),
  });
  if (!response.ok) throw new Error(`无法生成对话关联二维码：${response.status}`);
  const data = await response.json();
  const link = new URL(data.linkUrl);
  const params = new URLSearchParams(link.hash.replace(/^#/, ""));
  params.set("token", token);
  link.hash = params.toString();
  target = link.href;
  title = data.conversation?.title || title;
  expiresAt = data.expiresAt || "";
} else {
  target = (await fs.readFile(path.join(root, ".runtime", "pairing-url.txt"), "utf8")).trim();
  expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
}
if (!target) throw new Error("没有可用的二维码目标地址");
writeQrPngFile(target, output, { scale: 10, margin: 4 });
console.log(JSON.stringify({ qrPath: output, title, expiresAt }));
