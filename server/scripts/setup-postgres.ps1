param(
  [string]$DatabaseName = "jadeshopping",
  [int]$Port = 5432,
  [switch]$CheckOnly
)

Write-Host "== Jadeshopping Postgres helper =="

function Test-Port {
  param([int]$Port)
  $res = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
  return $res.TcpTestSucceeded
}

if ($CheckOnly) {
  $ok = Test-Port -Port $Port
  $status = if ($ok) { "YES" } else { "NO" }
  Write-Host ("Postgres listening on port {0}: {1}" -f $Port, $status)
  exit 0
}

# Try Docker first
$docker = Get-Command docker -ErrorAction SilentlyContinue
if ($docker) {
  Write-Host "Docker detected. Starting Postgres container..."
  $exists = docker ps -a --filter "name=jadeshopping-pg" --format "{{.Names}}"
  if ($exists -eq "jadeshopping-pg") {
    docker start jadeshopping-pg | Out-Null
  } else {
    docker run --name jadeshopping-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=$DatabaseName -p "$Port:5432" -d postgres:15 | Out-Null
  }
  Start-Sleep -Seconds 3
  $ok = Test-Port -Port $Port
  if (-not $ok) { Write-Warning "Postgres is not yet listening on $Port. Give it a few seconds." }
} else {
  # Fallback: winget install PostgreSQL
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if ($winget) {
    Write-Host "Docker not found. Installing PostgreSQL via winget..."
    winget install -e --id PostgreSQL.PostgreSQL --accept-package-agreements --accept-source-agreements
    Write-Host "Please start the PostgreSQL service and ensure it listens on port $Port."
  } else {
    Write-Warning "Neither Docker nor winget available. Please install Postgres manually."
  }
}

# Write .env if not present
$envPath = Join-Path $PSScriptRoot "..\\.env"
if (-not (Test-Path $envPath)) {
  $conn = "postgresql://postgres:postgres@localhost:$Port/$DatabaseName?schema=public"
  @"
PORT=8080
JWT_SECRET=dev-secret-change-me
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=123456
DATABASE_URL=$conn
"@ | Set-Content -Encoding UTF8 $envPath
  Write-Host "Created server/.env with DATABASE_URL."
} else {
  Write-Host "server/.env already exists. Ensure DATABASE_URL is configured."
}

# Final status
$finalOk = Test-Port -Port $Port
$finalStatus = if ($finalOk) { "YES" } else { "NO" }
Write-Host ("Postgres listening on port {0}: {1}" -f $Port, $finalStatus)