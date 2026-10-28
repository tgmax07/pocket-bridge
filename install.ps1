[CmdletBinding()]
param(
  [string]$InstallDir = "$env:LOCALAPPDATA\CodexPocket",
  [string]$WorkDir = "",
  [string]$ThreadId = "$env:CODEX_THREAD_ID",
  [string]$PackageRoot = "",
  [int]$Port = 8787,
  [switch]$NoScheduledTask,
  [switch]$SkipStart
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$repo = "tgmax07/pocket-bridge"
$branch = "main"
$taskName = "CodexPocket"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tempRoot = Join-Path $env:TEMP "codex-pocket-install-$stamp-$([guid]::NewGuid().ToString('N').Substring(0,8))"
$installFull = [IO.Path]::GetFullPath($InstallDir)
$localRoot = [IO.Path]::GetFullPath($env:LOCALAPPDATA)
if (-not $installFull.StartsWith($localRoot, [StringComparison]::OrdinalIgnoreCase) -and -not $PackageRoot) {
  throw "安装目录必须位于 LOCALAPPDATA 下：$installFull"
}

function Write-Step([string]$Text) {
  Write-Host "==> $Text" -ForegroundColor Cyan
}

function Invoke-Download([string]$Uri, [string]$OutFile) {
  $lastError = $null
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    try {
      Invoke-WebRequest -UseBasicParsing -Uri $Uri -OutFile $OutFile -TimeoutSec 180
      if (Test-Path -LiteralPath $OutFile) { return }
    } catch {
      $lastError = $_
      if (Test-Path -LiteralPath $OutFile) { Remove-Item -LiteralPath $OutFile -Force -ErrorAction SilentlyContinue }
      Start-Sleep -Seconds (2 * $attempt)
    }
  }
  throw "下载失败：$Uri`n$($lastError.Exception.Message)"
}

function Get-NodeVersion([string]$NodeExe) {
  try {
    $raw = (& $NodeExe --version 2>$null).Trim().TrimStart("v")
    return [version]$raw
  } catch {
    return $null
  }
}

function Ensure-NodeRuntime([string]$TargetRoot) {
  $runtimeDir = Join-Path $TargetRoot "runtime"
  $localNode = Join-Path $runtimeDir "node.exe"
  if (Test-Path -LiteralPath $localNode) {
    $version = Get-NodeVersion $localNode
    if ($version -and $version.Major -ge 20) { return $localNode }
  }
  Write-Step "安装便携版 Node.js"
  $index = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json" -TimeoutSec 60
  $release = $index | Where-Object { $_.lts } | Select-Object -First 1
  if (-not $release) { throw "无法读取 Node.js LTS 版本信息" }
  $versionText = [string]$release.version
  $archive = Join-Path $tempRoot "node.zip"
  Invoke-Download "https://nodejs.org/dist/$versionText/node-$versionText-win-x64.zip" $archive
  $extract = Join-Path $tempRoot "node-runtime"
  Expand-Archive -LiteralPath $archive -DestinationPath $extract -Force
  $nodeSource = Get-ChildItem -LiteralPath $extract -Directory | Select-Object -First 1
  if (-not $nodeSource) { throw "Node.js 压缩包结构异常" }
  New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null
  Get-ChildItem -LiteralPath $nodeSource.FullName -Force | Copy-Item -Destination $runtimeDir -Recurse -Force
  $version = Get-NodeVersion $localNode
  if (-not $version -or $version.Major -lt 20) { throw "Node.js 安装失败" }
  return $localNode
}

function Ensure-Command([string]$Name) {
  $command = Get-Command $Name -ErrorAction SilentlyContinue
  if ($command) { return $command.Source }
  return ""
}

try {
  New-Item -ItemType Directory -Force -Path $tempRoot, $installFull | Out-Null
  $sourceDir = $null
  if ($PackageRoot) {
    $sourceDir = [IO.Path]::GetFullPath($PackageRoot)
    if (-not (Test-Path -LiteralPath (Join-Path $sourceDir "server.mjs"))) {
      throw "本地安装包不完整：$sourceDir"
    }
  } else {
    Write-Step "从 GitHub 下载 Codex Pocket"
    $archive = Join-Path $tempRoot "source.zip"
    Invoke-Download "https://github.com/$repo/archive/refs/heads/$branch.zip" $archive
    $extract = Join-Path $tempRoot "source"
    Expand-Archive -LiteralPath $archive -DestinationPath $extract -Force
    $sourceDir = Get-ChildItem -LiteralPath $extract -Directory | Select-Object -First 1
    if (-not $sourceDir) { throw "GitHub 源码包结构异常" }
    $sourceDir = $sourceDir.FullName
  }

  $codex = Ensure-Command "codex"
  if (-not $codex) { throw "未找到 Codex。请先安装并登录 Codex Desktop/CLI。" }
  if (-not $WorkDir) {
    $cwd = (Get-Location).Path
    if ((Test-Path -LiteralPath (Join-Path $cwd ".git")) -or (Test-Path -LiteralPath (Join-Path $cwd "package.json"))) {
      $WorkDir = $cwd
    } else {
      $WorkDir = Join-Path $installFull "workspace"
    }
  }
  $WorkDir = [IO.Path]::GetFullPath($WorkDir)
  New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null

  Write-Step "安装桌面端程序"
  $exclude = @(".git", ".env", "data", ".tools", ".runtime", ".android-build", ".codex-pocket-build", "dist", "workspace")
  Get-ChildItem -LiteralPath $sourceDir -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $installFull -Recurse -Force
  }

  $nodeExe = Ensure-NodeRuntime $installFull
  $cloudflared = Join-Path $installFull ".tools\cloudflared.exe"
  if (-not (Test-Path -LiteralPath $cloudflared)) {
    Write-Step "安装 cloudflared"
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $cloudflared) | Out-Null
    Invoke-Download "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" $cloudflared
    if (-not (Test-Path -LiteralPath $cloudflared) -or (Get-Item -LiteralPath $cloudflared).Length -lt 1000000) {
      throw "cloudflared 安装失败"
    }
  }

  $envPath = Join-Path $installFull ".env"
  if (-not (Test-Path -LiteralPath $envPath)) {
    @(
      "# Codex Pocket local configuration",
      "CODEX_POCKET_PORT=$Port",
      "CODEX_WORKDIR=$WorkDir",
      "CODEX_SANDBOX=workspace-write",
      "CODEX_TRANSPORT=app-server"
    ) | Set-Content -Encoding utf8 -LiteralPath $envPath
  }

  Write-Step "安装 Codex Skills"
  $skillsRoot = Join-Path $env:USERPROFILE ".codex\skills"
  New-Item -ItemType Directory -Force -Path $skillsRoot | Out-Null
  foreach ($skillName in @("codex-pocket-auto-link", "codex-pocket-installer", "codex-pocket-setup")) {
    $sourceSkill = Join-Path $installFull "skill\$skillName"
    if (Test-Path -LiteralPath $sourceSkill) {
      Copy-Item -LiteralPath $sourceSkill -Destination $skillsRoot -Recurse -Force
    }
  }

  if (-not $SkipStart) {
    if (-not $NoScheduledTask) {
      Write-Step "配置 Windows 登录自启动"
      $startScript = Join-Path $installFull "start.ps1"
      $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$startScript`""
      $trigger = New-ScheduledTaskTrigger -AtLogOn
      $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero)
      $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent().Name
      Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -User $currentUser -RunLevel Limited -Force | Out-Null
    }
    $pairingFile = Join-Path $installFull ".runtime\pairing-url.txt"
    Remove-Item -LiteralPath $pairingFile -Force -ErrorAction SilentlyContinue
    if (-not $NoScheduledTask) {
      Start-ScheduledTask -TaskName $taskName
    } else {
      Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", (Join-Path $installFull "start.ps1")) -WorkingDirectory $installFull -WindowStyle Hidden
    }
    Write-Step "等待公网地址"
    $healthy = $false
    for ($attempt = 0; $attempt -lt 90; $attempt++) {
      try {
        $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 3
        if ($health.ok -and (Test-Path -LiteralPath $pairingFile)) { $healthy = $true; break }
      } catch {}
      Start-Sleep -Seconds 1
    }
    if (-not $healthy) { throw "Codex Pocket 服务或公网隧道未能启动，请运行 start.cmd 检查日志。" }
  }

  if (-not $SkipStart) {
    $qrOutput = Join-Path $installFull "data\setup-qr.png"
    $env:CODEX_POCKET_LOCAL_URL = "http://127.0.0.1:$Port"
    $qrArgs = @((Join-Path $installFull "scripts\create-setup-qr.mjs"), "--output", $qrOutput)
    if ($ThreadId) { $qrArgs += @("--thread-id", $ThreadId) } else { $qrArgs += "--pairing" }
    try {
      $qrJson = & $nodeExe @qrArgs | Select-Object -Last 1 | ConvertFrom-Json
      Start-Process -FilePath $qrJson.qrPath
      Write-Host "QR_PATH=$($qrJson.qrPath)" -ForegroundColor Green
      Write-Host "QR_TITLE=$($qrJson.title)" -ForegroundColor Green
      if ($qrJson.expiresAt) { Write-Host "QR_EXPIRES_AT=$($qrJson.expiresAt)" -ForegroundColor Green }
    } catch {
      Write-Warning "二维码生成失败：$($_.Exception.Message)"
      $pairing = (Get-Content -Raw -LiteralPath $pairingFile).Trim()
      $pairPage = "http://127.0.0.1:$Port/pair.html#pair=$([uri]::EscapeDataString($pairing))"
      Start-Process $pairPage
      Write-Host "PAIRING_QR_PAGE=$pairPage" -ForegroundColor Yellow
    }
  }

  Write-Host ""
  Write-Host "Codex Pocket 安装完成" -ForegroundColor Green
  Write-Host "安装目录：$installFull"
  Write-Host "默认项目：$WorkDir"
  Write-Host "Skills：$skillsRoot"
  Write-Host "以后登录 Windows 会自动启动 Pocket。"
  Write-Host "手机扫码后即可连接；如果当前在 Codex 对话中安装，二维码会关联当前对话。"
} finally {
  if (Test-Path -LiteralPath $tempRoot) {
    $resolvedTemp = [IO.Path]::GetFullPath($tempRoot)
    if ($resolvedTemp.StartsWith([IO.Path]::GetFullPath($env:TEMP), [StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedTemp -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
}
