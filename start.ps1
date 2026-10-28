param(
  [switch]$Local,
  [switch]$NoTunnel
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$bundledNode = Join-Path $PSScriptRoot "runtime\node.exe"
$nodeCommand = if (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { (Get-Command node -ErrorAction SilentlyContinue).Source }
if (-not $nodeCommand) {
  throw "未找到 Node.js。请安装 Node.js 20 或更高版本，或使用包含 runtime\node.exe 的完整安装包。"
}

if ($env:HOME -eq $null -or $env:HOME -eq "") {
  $env:HOME = $env:USERPROFILE
}

if (-not $Local -and -not $NoTunnel) {
  $cloudflared = Join-Path (Get-Location) ".tools\cloudflared.exe"
  if (-not (Test-Path $cloudflared)) {
    Write-Host "首次运行：正在下载 Cloudflare Tunnel 客户端…" -ForegroundColor Cyan
    & (Join-Path $PSScriptRoot "scripts\install-cloudflared.ps1")
  }
}

Write-Host ""
Write-Host "Codex Pocket" -ForegroundColor Green
Write-Host "电脑端服务启动中…" -ForegroundColor DarkGray

$nodeArgs = @("scripts/start.mjs")
if ($Local) { $nodeArgs += "--local" }
if ($NoTunnel) { $nodeArgs += "--no-tunnel" }
& $nodeCommand @nodeArgs
exit $LASTEXITCODE


