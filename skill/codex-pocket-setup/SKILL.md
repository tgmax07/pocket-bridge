---
name: codex-pocket-setup
description: Install Codex Pocket Desktop and immediately link the current Codex conversation to the phone with a scannable QR code. Use when the user asks to set up a new computer, install Pocket from GitHub, or connect this conversation to their phone for the first time.
---

# Codex Pocket Setup

Install the desktop package from GitHub and produce a phone QR without asking for passwords, OTPs, or broad shell approval.

## Install

Run this from the current project directory:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/tgmax07/pocket-bridge/main/install.ps1 | iex"
```

The installer:

- downloads the repository from GitHub;
- installs portable Node.js when required;
- installs `cloudflared`;
- copies the Pocket server and Codex skills;
- registers a per-user Windows logon task;
- starts Pocket and generates a five-minute QR code.

## Reply

Parse the installer output for `QR_PATH`, `QR_TITLE`, and `QR_EXPIRES_AT`.

If `QR_PATH` exists, send the QR inline using its absolute path and tell the user:

1. QR is valid for five minutes.
2. Open Codex Pocket on Android.
3. Tap “扫码关联电脑对话” and scan it.

Do not print or transmit the pairing token or the QR's underlying URL.

## Safety

- Do not use `danger-full-access`.
- Do not auto-approve unrelated commands.
- Keep the Codex transport as `app-server`.
- Never enter account passwords, SMS codes, or OTPs.
