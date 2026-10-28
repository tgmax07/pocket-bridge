---
name: codex-pocket-installer
description: Install, configure, start, diagnose, or upgrade Codex Pocket Desktop on a Windows computer so an Android Codex Pocket APK can connect over the internet. Use when the user asks to install Codex Pocket on another PC, configure its project folder, start the public tunnel, or pair the Android app.
---

# Codex Pocket Installer

Codex Pocket is a phone interaction layer. All task execution must remain on the desktop through the shared Codex app-server.

## Install

1. Confirm `codex` exists and is logged in.
2. From the project directory, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/tgmax07/pocket-bridge/main/install.ps1 | iex"
```

3. If the package is already present, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -PackageRoot (Get-Location).Path -WorkDir "E:\path\to\project"
```

4. Verify `.env` contains:

```dotenv
CODEX_TRANSPORT=app-server
CODEX_SANDBOX=workspace-write
```

Do not set `danger-full-access` and do not auto-approve shell commands.

## Start

Launch the desktop shortcut or run `start.cmd`. The terminal prints a public pairing URL.

The public URL uses Cloudflare Tunnel, so the phone does not need to share the computer's LAN. If the quick-tunnel URL changes, update the pairing link from the Android app's overflow menu.

## Pair Android

Open the universal APK on the Android phone and paste the current public pairing URL. The APK does not need to be rebuilt for each computer.

## Diagnose

- `拒绝访问` under `.codex`: start Pocket from a normal desktop PowerShell, not from inside a restricted Codex task.
- App-server unavailable: run `codex --version`, verify login, and restart Pocket.
- Thread split: verify `CODEX_TRANSPORT=app-server`; do not fall back to `codex exec`.
- Desktop sidebar not updated: refresh or reopen Codex Desktop.
- Browser tasks: Codex must call the scoped `open_local_url` tool; do not grant unrestricted shell access.
- QR login: the desktop tool captures the Chrome window and sends the screenshot into Pocket. Never enter passwords or OTPs for the user.
