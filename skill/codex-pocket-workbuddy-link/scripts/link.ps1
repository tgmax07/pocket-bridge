[CmdletBinding()]
param(
  [string]$SessionId = $env:CODEBUDDY_SESSION_ID,
  [string]$Cwd = (Get-Location).Path,
  [string]$Title = ""
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding

if ([string]::IsNullOrWhiteSpace($SessionId)) {
  throw "WorkBuddy did not provide CODEBUDDY_SESSION_ID for the current conversation."
}

$candidates = @(
  $env:CODEX_POCKET_WORKBUDDY_BRIDGE_CONFIG,
  (Join-Path $env:USERPROFILE ".codex-pocket\workbuddy-bridge.json"),
  (Join-Path $env:LOCALAPPDATA "CodexPocket\workbuddy-bridge.json"),
  (Join-Path $env:APPDATA "CodexPocket\workbuddy-bridge.json")
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

if (-not $candidates) {
  throw "Pocket bridge config was not found. Start 口袋 / Codex Pocket Desktop first."
}

$bridge = Get-Content -LiteralPath (@($candidates)[0]) -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $bridge.baseUrl -or -not $bridge.secret) {
  throw "Pocket bridge config is incomplete. Restart 口袋 / Codex Pocket Desktop."
}

$baseUri = [Uri]$bridge.baseUrl
if ($baseUri.Host -notin @("127.0.0.1", "localhost", "::1")) {
  throw "Refusing to send the local bridge secret to a non-loopback address."
}

$payload = @{
  sessionId = $SessionId
  cwd = $Cwd
  title = $Title
} | ConvertTo-Json -Compress

try {
  $result = Invoke-RestMethod `
    -Method Post `
    -Uri ($bridge.baseUrl.TrimEnd("/") + "/api/workbuddy/link") `
    -Headers @{ "X-Pocket-Bridge-Secret" = [string]$bridge.secret } `
    -ContentType "application/json; charset=utf-8" `
    -Body $payload `
    -TimeoutSec 60
} catch {
  $detail = $_.ErrorDetails.Message
  if (-not $detail) { $detail = $_.Exception.Message }
  throw "Pocket link failed: $detail"
}

[pscustomobject]@{
  ok = $true
  alreadyLinked = [bool]$result.alreadyLinked
  conversationId = $result.conversation.id
  title = $result.conversation.title
  agentId = $result.conversation.agentId
  message = if ($result.alreadyLinked) { "This WorkBuddy conversation is already linked to Pocket." } else { "This WorkBuddy conversation is now linked to Pocket." }
} | ConvertTo-Json -Depth 6
