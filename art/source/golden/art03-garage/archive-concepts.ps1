$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '../../../..')).Path
$concept = (Resolve-Path (Join-Path $repo 'art/source/golden/art03-garage-concept')).Path
$archive = [IO.Path]::GetFullPath((Join-Path $concept 'archive'))
if (!$archive.StartsWith($concept + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Archive escaped concept root' }
$manifest = Join-Path $concept 'production-preparation/cleanup-manifest.json'
if (Test-Path -LiteralPath $manifest) { throw 'Already archived; consult manifest instead of rerunning' }
$moveNames = @('direction-a.png','direction-b.png','direction-c.png','prompts.json','validation.json','review-history.html','b-refinement','final-composition','composition-correction')
$snapNames = @('README.md','production-preparation/PLAN.md','production-preparation/PRODUCTION-BLOCKER.md')
$entries = @(Get-ChildItem -LiteralPath $concept -File -Recurse | ForEach-Object {
  $rel = $_.FullName.Substring($concept.Length + 1).Replace('\','/')
  $top = $rel.Split('/')[0]
  $move = $moveNames -contains $top
  $snapshot = $snapNames -contains $rel
  [pscustomobject]@{
    original = 'art/source/golden/art03-garage-concept/' + $rel
    classification = $(if ($move) { 'B' } else { 'A' })
    disposition = $(if ($move) { 'archived' } elseif ($snapshot) { 'kept current; original archived as snapshot before update' } else { 'kept' })
    retained = 'art/source/golden/art03-garage-concept/' + $(if ($move) { 'archive/' + $rel } elseif ($snapshot) { 'archive/snapshots/' + $rel } else { $rel })
    sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLower()
    reason = $(if ($move) { 'Superseded exploration and its historical provenance; retain bytes together.' } else { 'Selected reference, current review entry point or preparation/acceptance evidence.' })
  }
})
# Validate every source and destination BEFORE any recursive move.
foreach ($name in $moveNames) {
  $src = (Resolve-Path -LiteralPath (Join-Path $concept $name)).Path
  $dst = [IO.Path]::GetFullPath((Join-Path $archive $name))
  if (!$src.StartsWith($concept+'\',[StringComparison]::OrdinalIgnoreCase) -or !$dst.StartsWith($archive+'\',[StringComparison]::OrdinalIgnoreCase)) { throw 'Move escaped intended roots' }
  if (Test-Path -LiteralPath $dst) { throw "Destination already exists: $dst" }
}
New-Item -ItemType Directory -Path $archive -Force | Out-Null
foreach ($name in $snapNames) {
  $dst = Join-Path $archive ('snapshots/' + $name)
  New-Item -ItemType Directory -Path (Split-Path $dst) -Force | Out-Null
  Copy-Item -LiteralPath (Join-Path $concept $name) -Destination $dst
}
foreach ($name in $moveNames) { Move-Item -LiteralPath (Join-Path $concept $name) -Destination (Join-Path $archive $name) }
foreach ($e in $entries) {
  if ((Get-FileHash -LiteralPath (Join-Path $repo $e.retained) -Algorithm SHA256).Hash.ToLower() -ne $e.sha256) { throw "Archive hash mismatch: $($e.original)" }
}
[pscustomobject]@{ date='2026-10-08'; classifications=@{A='Required current source/evidence';B='Historical reference worth archiving';C='Superseded disposable';D='Uncertain - preserve'}; deleted=@(); uncertain=@(); files=$entries } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifest -Encoding utf8
Write-Output "Classified $($entries.Count) files; archived $(@($entries | Where-Object disposition -eq 'archived').Count); deleted 0; archive bytes verified."
