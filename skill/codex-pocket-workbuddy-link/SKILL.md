---
name: codex-pocket-workbuddy-link
description: Link the current WorkBuddy conversation to the paired 口袋 / Codex Pocket app for real-time phone interaction. Use when the user asks to sync, connect, link, or add this WorkBuddy conversation to 口袋, Codex Pocket, or their phone.
---

# Link WorkBuddy to 口袋

When the user asks to sync or link the current WorkBuddy conversation to 口袋 / Codex Pocket, run this one command:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\.workbuddy\skills\codex-pocket-workbuddy-link\scripts\link.ps1"
```

The script uses `CODEBUDDY_SESSION_ID` supplied by WorkBuddy and the local-only bridge file written by the Pocket desktop service. It links the existing conversation and imports its text history.

After success, report:

- the Pocket conversation title
- whether it was newly linked or was already linked
- that subsequent messages can be sent from the phone and will continue in this WorkBuddy conversation

Do not ask the user to operate a browser, copy a session ID, or run additional commands. If the script reports that Pocket is not running, ask the user to start 口袋 / Codex Pocket Desktop once, then run the same command again.

