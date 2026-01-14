Set-Location $PSScriptRoot
Write-Host "Starting Angular development server..."
Write-Host "This may take a minute to compile..."
Write-Host "Server will be available at http://localhost:4200"
ng serve --host 0.0.0.0 --port 4200
