---
name: codex-pocket-auto-link
description: Generate a short-lived QR code that links the current Codex Desktop thread into Codex Pocket for real-time phone interaction. Use when the user asks in Chinese or English to sync/connect/link this conversation to Codex, Codex Pocket, their phone, or the Pocket app.
---

# Codex Pocket Auto Link

Create a QR code for the **current Desktop thread**, then tell the user to scan it from Codex Pocket. Do not create a different thread or modify conversation contents.

## Requirements

- Codex Pocket Desktop must be running locally.
- `CODEX_THREAD_ID` identifies the current thread.
- The pairing token is stored at `<CODEX_POCKET_HOME>\data\pairing-token`.

## Locate Codex Pocket

Try these locations in order:

1. `$env:CODEX_POCKET_HOME`
2. `$env:LOCALAPPDATA\CodexPocket`
3. The package/project directory containing `server.mjs`

## Generate the QR

Run this in PowerShell:

```powershell
$pocketHome = if ($env:CODEX_POCKET_HOME) { $env:CODEX_POCKET_HOME } else { Join-Path $env:LOCALAPPDATA "CodexPocket" }
$token = (Get-Content -Raw (Join-Path $pocketHome "data\pairing-token")).Trim()
$body = @{ threadId = $env:CODEX_THREAD_ID } | ConvertTo-Json
$response = Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/desktop/link-thread/qr" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body
$response | Select-Object linkUrl, qrPath, markdownImagePath, expiresAt, expiresInSeconds
$response.conversation | Select-Object id, title, status, sourceCodexSessionId
```

## Reply

If generation succeeds, reply with:

1. `已将当前对话生成扫码关联二维码，二维码 5 分钟内有效。`
2. The conversation title.
3. An inline image using **exactly** `$response.markdownImagePath`, for example:

```markdown
![扫码关联当前 Codex 对话](/C:/absolute/path/to/thread-ticket.png)
```

4. `请在手机 Codex Pocket 左侧“对话”页点击“扫码”，扫描上方二维码。`

Do not expose the pairing token or print the QR's underlying link. The QR is single-use and expires after five minutes; if it expires, generate a new one.

## If Pocket is not running

Ask the user to start Codex Pocket from the desktop shortcut or `start.cmd`. Do not replace Pocket with a separate `codex exec` session.

## Safety

- Use only the current `CODEX_THREAD_ID`.
- Do not open, print, or transmit the pairing token.
- Do not set `danger-full-access`.
- Do not auto-approve broad shell commands.
