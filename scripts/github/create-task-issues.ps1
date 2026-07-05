param(
  [string]$TasksPath = "specs/001-linkpulse-url-shortener/tasks.md",
  [string]$Repo = ""
)

$ErrorActionPreference = "Stop"

function Fail($Message) {
  Write-Error $Message
  exit 1
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Fail "GitHub CLI is not installed or not on PATH."
}

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Fail "GitHub CLI is not authenticated. Run: gh auth login -h github.com"
}

if (-not (Test-Path $TasksPath)) {
  Fail "Tasks file not found: $TasksPath"
}

if ([string]::IsNullOrWhiteSpace($Repo)) {
  $remote = git config --get remote.origin.url
  if ([string]::IsNullOrWhiteSpace($remote)) {
    Fail "No git remote.origin.url configured."
  }

  if ($remote -match "github\.com[:/](?<owner>[^/]+)/(?<name>[^/.]+)(\.git)?$") {
    $Repo = "$($Matches.owner)/$($Matches.name)"
  } else {
    Fail "Remote is not a GitHub URL: $remote"
  }
}

Write-Host "Using repository: $Repo"

$taskLines = Get-Content $TasksPath | Where-Object { $_ -match "^- \[ \] T\d{3}" }
$tasks = foreach ($line in $taskLines) {
  if ($line -match "^- \[ \] (?<id>T\d{3})( \[P\])?( \[US\d+\])? (?<desc>.+)$") {
    [pscustomobject]@{
      Id = $Matches.id
      Description = $Matches.desc.Trim()
      Title = "$($Matches.id): $($Matches.desc.Trim())"
      SourceLine = $line
    }
  }
}

if (-not $tasks -or $tasks.Count -eq 0) {
  Fail "No task lines found in $TasksPath"
}

$taskIds = [System.Collections.Generic.HashSet[string]]::new()
foreach ($task in $tasks) {
  [void]$taskIds.Add($task.Id)
}

$existing = [System.Collections.Generic.HashSet[string]]::new()
$issuesJson = gh issue list --repo $Repo --state all --limit 1000 --json title
if ($LASTEXITCODE -ne 0) {
  Fail "Failed to list existing issues for $Repo."
}

if (-not [string]::IsNullOrWhiteSpace($issuesJson)) {
  $issues = $issuesJson | ConvertFrom-Json
  foreach ($issue in $issues) {
    $matches = [regex]::Matches($issue.title, "\bT\d{3}\b")
    foreach ($match in $matches) {
      if ($taskIds.Contains($match.Value)) {
        [void]$existing.Add($match.Value)
      }
    }
  }
}

$created = 0
$skipped = 0

foreach ($task in $tasks) {
  if ($existing.Contains($task.Id)) {
    Write-Host "$($task.Id) already has an issue, skipping"
    $skipped++
    continue
  }

  $body = @"
Source: ``$TasksPath``

Task:

``````text
$($task.SourceLine)
``````

Created from Spec Kit tasks for LinkPulse URL Shortener Platform.
"@

  gh issue create --repo $Repo --title $task.Title --body $body
  if ($LASTEXITCODE -ne 0) {
    Fail "Failed to create issue for $($task.Id)."
  }
  $created++
}

Write-Host "Done. Created: $created. Skipped existing: $skipped. Total tasks: $($tasks.Count)."
