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
  throw "InstallDir must be under LOCALAPPDATA: $installFull"
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
  throw "Download failed: $Uri`n$($lastError.Exception.Message)"
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
  Write-Step "Installing portable Node.js"
  $index = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json" -TimeoutSec 60
  $release = $index | Where-Object { $_.lts } | Select-Object -First 1
  if (-not $release) { throw "Unable to read Node.js LTS release metadata" }
  $versionText = [string]$release.version
  $archive = Join-Path $tempRoot "node.zip"
  Invoke-Download "https://nodejs.org/dist/$versionText/node-$versionText-win-x64.zip" $archive
  $extract = Join-Path $tempRoot "node-runtime"
  Expand-Archive -LiteralPath $archive -DestinationPath $extract -Force
  $nodeSource = Get-ChildItem -LiteralPath $extract -Directory | Select-Object -First 1
  if (-not $nodeSource) { throw "Unexpected Node.js archive layout" }
  New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null
  Get-ChildItem -LiteralPath $nodeSource.FullName -Force | Copy-Item -Destination $runtimeDir -Recurse -Force
  $version = Get-NodeVersion $localNode
  if (-not $version -or $version.Major -lt 20) { throw "Node.js installation failed" }
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
      throw "Local package is incomplete: $sourceDir"
    }
  } else {
    Write-Step "Downloading desktop bridge from GitHub"
    $archive = Join-Path $tempRoot "source.zip"
    Invoke-Download "https://github.com/$repo/archive/refs/heads/$branch.zip" $archive
    $extract = Join-Path $tempRoot "source"
    Expand-Archive -LiteralPath $archive -DestinationPath $extract -Force
    $sourceDir = Get-ChildItem -LiteralPath $extract -Directory | Select-Object -First 1
    if (-not $sourceDir) { throw "Unexpected GitHub source archive layout" }
    $sourceDir = $sourceDir.FullName
  }

  $codex = Ensure-Command "codex"
  if (-not $codex) { throw "Codex was not found. Install and sign in to Codex Desktop/CLI first." }
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

  Write-Step "Installing desktop bridge"
  $exclude = @(".git", ".env", "data", ".tools", ".runtime", ".android-build", ".codex-pocket-build", "dist", "workspace")
  Get-ChildItem -LiteralPath $sourceDir -Force | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $installFull -Recurse -Force
  }

  $nodeExe = Ensure-NodeRuntime $installFull
  $cloudflared = Join-Path $installFull ".tools\cloudflared.exe"
  if (-not (Test-Path -LiteralPath $cloudflared)) {
    Write-Step "Installing cloudflared"
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $cloudflared) | Out-Null
    Invoke-Download "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" $cloudflared
    if (-not (Test-Path -LiteralPath $cloudflared) -or (Get-Item -LiteralPath $cloudflared).Length -lt 1000000) {
      throw "cloudflared installation failed"
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

  Write-Step "Installing Codex Skills"
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
      Write-Step "Configuring Windows logon startup"
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
    Write-Step "Waiting for public endpoint"
    $healthy = $false
    for ($attempt = 0; $attempt -lt 90; $attempt++) {
      try {
        $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 3
        if ($health.ok -and (Test-Path -LiteralPath $pairingFile)) { $healthy = $true; break }
      } catch {}
      Start-Sleep -Seconds 1
    }
    if (-not $healthy) { throw "The service or public tunnel did not start. Run start.cmd and inspect the logs." }
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
      Write-Warning "QR generation failed: $($_.Exception.Message)"
      $pairing = (Get-Content -Raw -LiteralPath $pairingFile).Trim()
      $pairPage = "http://127.0.0.1:$Port/pair.html#pair=$([uri]::EscapeDataString($pairing))"
      Start-Process $pairPage
      Write-Host "PAIRING_QR_PAGE=$pairPage" -ForegroundColor Yellow
    }
  }

  Write-Host ""
  Write-Host "Desktop bridge installation complete" -ForegroundColor Green
  Write-Host "InstallDir: $installFull"
  Write-Host "WorkDir: $WorkDir"
  Write-Host "Skills: $skillsRoot"
  Write-Host "The bridge starts automatically after Windows sign-in."
  Write-Host "Scan the QR code on the phone. When run from a Codex thread, the QR links that thread."
} finally {
  if (Test-Path -LiteralPath $tempRoot) {
    $resolvedTemp = [IO.Path]::GetFullPath($tempRoot)
    if ($resolvedTemp.StartsWith([IO.Path]::GetFullPath($env:TEMP), [StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedTemp -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
}
