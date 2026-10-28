$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$toolsDir = Join-Path $root ".tools"
$target = Join-Path $toolsDir "cloudflared.exe"
$url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"

New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
Write-Host "下载 cloudflared…" -ForegroundColor Cyan
$oldProtocol = [Net.ServicePointManager]::SecurityProtocol
try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $target -TimeoutSec 120
} finally {
  [Net.ServicePointManager]::SecurityProtocol = $oldProtocol
}
if (-not (Test-Path $target) -or (Get-Item $target).Length -lt 1000000) {
  throw "cloudflared 下载失败，请检查网络后重试。"
}
Write-Host "已安装：$target" -ForegroundColor Green
