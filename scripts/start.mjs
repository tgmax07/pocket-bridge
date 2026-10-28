import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { startServer } from "../server.mjs";

const argumentsSet = new Set(process.argv.slice(2));
const localOnly = argumentsSet.has("--local");
const noTunnel = argumentsSet.has("--no-tunnel");
let instance;
let tunnel;
let shuttingDown = false;

function pairingUrl(baseUrl, token) {
  return `${baseUrl.replace(/\/$/, "")}/#token=${encodeURIComponent(token)}`;
}

function findCloudflared() {
  const executable = process.platform === "win32" ? "cloudflared.exe" : "cloudflared";
  const bundled = path.join(instance.config.rootDir, ".tools", executable);
  if (fs.existsSync(bundled)) return bundled;
  return executable;
}

async function publishPairingLink(baseUrl, label) {
  const link = pairingUrl(baseUrl, instance.token);
  const runtimeFile = path.join(instance.config.runtimeDir, "pairing-url.txt");
  const qrPage = `${instance.localUrl}/pair.html#pair=${encodeURIComponent(link)}`;
  await fsp.writeFile(runtimeFile, `${link}\n`, "utf8");
  console.log("");
  console.log("============================================================");
  console.log(`  ${label}`);
  console.log(`  ${link}`);
  console.log(`  电脑端二维码页面：${qrPage}`);
  console.log("============================================================");
  console.log("  在安卓 Chrome 中打开上面的链接，然后选择“添加到主屏幕”。");
  console.log("  配对链接等同密码，不要发给不可信的人。");
  console.log("");
}

let tunnelAttempts = 0;

async function verifyPublicUrl(publicUrl) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(`${publicUrl}/api/health`, { signal: controller.signal, cache: "no-store" });
      if (response.ok) return true;
    } catch {}
    finally {
      clearTimeout(timer);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return false;
}

function startTunnel() {
  tunnelAttempts += 1;
  const command = findCloudflared();
  tunnel = spawn(command, ["tunnel", "--no-autoupdate", "--protocol", "http2", "--edge-ip-version", "4", "--url", instance.localUrl], {
    cwd: instance.config.rootDir,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let published = false;
  const scan = (chunk) => {
    const text = String(chunk || "");
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (match && !published) {
      published = true;
      const publicUrl = match[0];
      verifyPublicUrl(publicUrl).then((reachable) => {
        if (!reachable || shuttingDown) {
          console.error(`[tunnel] 地址暂时不可达：${publicUrl}`);
          return;
        }
        instance.config.publicUrl = publicUrl;
        return publishPairingLink(publicUrl, "公网配对地址");
      }).catch(console.error);
    }
    if (process.env.CODEX_POCKET_DEBUG_TUNNEL) process.stderr.write(text);
  };
  tunnel.stdout.on("data", scan);
  tunnel.stderr.on("data", scan);
  tunnel.on("error", (error) => {
    console.error(`[tunnel] 无法启动 cloudflared：${error.message}`);
    console.error("[tunnel] 运行 .\\scripts\\install-cloudflared.ps1 后重试，或使用 --local。");
  });
  tunnel.on("exit", (code) => {
    if (shuttingDown) return;
    if (tunnelAttempts < 4) {
      console.error(`\n[tunnel] cloudflared 已退出（代码 ${code}），2 秒后重试…`);
      setTimeout(() => {
        if (!shuttingDown) startTunnel();
      }, 2000).unref();
    } else {
      console.error(`\n[tunnel] cloudflared 连续退出，请稍后重新启动服务。`);
    }
  });
}
async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (tunnel && tunnel.exitCode === null) tunnel.kill();
  if (instance) await instance.close();
  process.exit(exitCode);
}

try {
  instance = await startServer();

  if (localOnly || noTunnel) {
    await publishPairingLink(instance.localUrl, "本机配对地址（仅这台电脑可访问）");
  } else if (instance.config.publicUrl) {
    await publishPairingLink(instance.config.publicUrl, "固定公网配对地址");
  } else {
    await startTunnel();
  }

  console.log(`[server] 按 Ctrl+C 停止 Codex Pocket。`);
} catch (error) {
  console.error(error);
  await shutdown(1);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("uncaughtException", async (error) => {
  console.error(error);
  await shutdown(1);
});






