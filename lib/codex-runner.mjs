import { spawn, spawnSync } from "node:child_process";
import readline from "node:readline";
import { buildCodexEnvironment } from "./config.mjs";

const CONFIG_WARNING = /unrecognized configuration setting|deprecated settings|ignoring .* configuration/i;

export function isGitRepository(workdir) {
  try {
    const result = spawnSync("git", ["-C", workdir, "rev-parse", "--is-inside-work-tree"], {
      encoding: "utf8",
      windowsHide: true,
      timeout: 5000,
    });
    return result.status === 0 && result.stdout.trim() === "true";
  } catch {
    return false;
  }
}

function compactCommand(command, max = 280) {
  const value = String(command || "").replace(/\s+/g, " ").trim();
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export function normalizeCodexEvent(event) {
  if (!event || typeof event !== "object") return [];
  if (event.type === "thread.started") {
    return [{ type: "thread", threadId: event.thread_id }];
  }
  if (event.type === "turn.started") {
    return [{ type: "status", status: "running", text: "Codex 正在处理" }];
  }
  if (event.type === "turn.completed") {
    return [{ type: "status", status: "idle", text: "处理完成", usage: event.usage || null }];
  }
  if (event.type === "turn.failed") {
    return [{ type: "error", text: event.error?.message || event.message || "Codex 处理失败" }];
  }

  if (event.type === "item.started" || event.type === "item.completed" || event.type === "item.updated") {
    const item = event.item || {};
    const completed = event.type === "item.completed";

    if (item.type === "agent_message" && completed) {
      return [{ type: "assistant_message", text: String(item.text || "") }];
    }

    if (item.type === "error" && completed) {
      const text = String(item.message || "Codex 返回错误");
      return CONFIG_WARNING.test(text) ? [] : [{ type: "error", text }];
    }

    if (item.type === "command_execution") {
      const command = compactCommand(item.command);
      const output = String(item.aggregated_output || "").trim();
      if (!completed) {
        return [{ type: "progress", kind: "command", itemId: item.id || null, text: "正在执行命令", detail: command }];
      }
      return [{
        type: "progress",
        kind: "command",
        itemId: item.id || null,
        text: item.exit_code === 0 ? "命令执行完成" : `命令失败（退出码 ${item.exit_code ?? "未知"}）`,
        detail: command,
        output: output.length > 2500 ? `${output.slice(0, 2500)}…` : output,
        ok: item.exit_code === 0,
      }];
    }

    if (item.type === "file_change" && completed) {
      const files = Array.isArray(item.changes)
        ? item.changes.map((change) => change.path || change.file || "").filter(Boolean)
        : [];
      return [{ type: "progress", kind: "file", text: "文件已更新", detail: files.join("\n"), ok: item.status !== "failed" }];
    }

    if (item.type === "mcp_tool_call") {
      return [{
        type: "progress",
        kind: "tool",
        text: completed ? "工具调用完成" : "正在调用工具",
        detail: [item.server, item.tool].filter(Boolean).join(" / "),
        ok: completed ? item.status !== "failed" : undefined,
      }];
    }

    if (item.type === "web_search" && completed) {
      return [{ type: "progress", kind: "web", text: "已搜索网络", detail: item.query || "" }];
    }
  }

  return [];
}

export function buildContinuationPrompt(events, prompt, maxChars) {
  const lines = [];
  for (const event of events) {
    if (event.type === "user_message") lines.push(`用户：${event.text}`);
    if (event.type === "assistant_message") lines.push(`Codex：${event.text}`);
  }

  let context = "";
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const next = `${lines[index]}\n${context}`;
    if (next.length > maxChars) break;
    context = next;
  }

  return [
    "你正在通过 Codex Pocket 与用户进行跨轮次对话。",
    "下面是此前对话的必要上下文。请延续上下文，但不要把这段说明原样复述给用户。",
    "<conversation_context>",
    context.trim() || "（无）",
    "</conversation_context>",
    "<current_user_message>",
    prompt,
    "</current_user_message>",
  ].join("\n");
}

export function startCodexTurn({ config, conversation, prompt, onJson, onStderr, onExit }) {
  const workdir = conversation.workdir || config.workdir;
  const canResume = Boolean(conversation.threadId && isGitRepository(workdir));
  const args = [
    ...(config.codexBinArgs || []),
    ...(canResume
      ? ["exec", "resume", conversation.threadId, "--json"]
      : ["exec", "--json", "--skip-git-repo-check", "-s", config.sandbox, "-C", workdir]),
  ];

  if (config.model) args.push("-m", config.model);
  args.push("-");

  const child = spawn(config.codexBin, args, {
    cwd: workdir,
    env: buildCodexEnvironment(),
    shell: false,
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  const contextEvents = [...conversation.events];
  const lastEvent = contextEvents[contextEvents.length - 1];
  if (lastEvent?.type === "user_message" && lastEvent.text === prompt) contextEvents.pop();
  const effectivePrompt = canResume
    ? prompt
    : buildContinuationPrompt(contextEvents, prompt, config.maxContextChars);

  let stderr = "";
  const stderrInterface = readline.createInterface({ input: child.stderr });
  stderrInterface.on("line", (line) => {
    stderr = `${stderr}\n${line}`.slice(-20_000);
    onStderr?.(line);
  });

  const stdoutInterface = readline.createInterface({ input: child.stdout });
  stdoutInterface.on("line", (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("{")) return;
    try {
      onJson?.(JSON.parse(trimmed));
    } catch {
      // Codex can emit a non-JSON line while starting. Ignore it.
    }
  });

  child.stdin.end(effectivePrompt);

  const promise = new Promise((resolve) => {
    child.once("error", (error) => {
      resolve({ code: -1, signal: null, stderr, spawnError: error });
    });
    child.once("close", (code, signal) => {
      resolve({ code, signal, stderr });
    });
  });

  promise.then((result) => onExit?.(result));
  return { child, promise, canResume };
}

export function stopProcessTree(child) {
  if (!child || child.killed) return;
  try {
    child.kill();
  } catch {}

  if (process.platform === "win32" && child.pid) {
    setTimeout(() => {
      if (child.exitCode !== null) return;
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
        windowsHide: true,
        stdio: "ignore",
      });
      killer.unref();
    }, 1500).unref();
  }
}






