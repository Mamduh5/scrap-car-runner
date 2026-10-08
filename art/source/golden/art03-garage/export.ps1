param([string]$Aseprite = 'D:\Mamduh\Program Files\Stearm\steamapps\common\Aseprite\aseprite.exe')
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '../../../..')).Path
# Process-local profile isolation; never change the user's Aseprite installation/settings.
$previousProfile = $env:ASEPRITE_USER_FOLDER
try {
  $env:ASEPRITE_USER_FOLDER = Join-Path $env:TEMP 'scrap-garage-aseprite-recovery/profile'
  New-Item -ItemType Directory -Force -Path $env:ASEPRITE_USER_FOLDER | Out-Null
  foreach ($id in @('env_garage_wall','env_garage_lift')) {
    $master = Join-Path $PSScriptRoot ($id + '.aseprite')
    if (!(Test-Path -LiteralPath $master)) { throw "Master missing: $master" }
    $destination = Join-Path $repo ('public/assets/environments/' + $id + '.png')
    & $Aseprite --batch $master --save-as $destination | Out-String | Write-Output
    if ($LASTEXITCODE -ne 0 -or !(Test-Path -LiteralPath $destination)) { throw "Export failed: $id" }
  }
} finally { $env:ASEPRITE_USER_FOLDER = $previousProfile }
