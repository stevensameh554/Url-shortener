docker compose up -d --build
Start-Sleep -Seconds 10
$health = Invoke-RestMethod http://localhost:4000/api/health
if ($health.status -ne "ok") { throw "API health check failed" }
docker compose ps
