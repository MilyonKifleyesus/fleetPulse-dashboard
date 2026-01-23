# FleetPulse Dashboard - File Structure Display Script
# Shows the complete file structure and dependencies

$script:docRoot = Split-Path -Parent $PSScriptRoot
$script:basePath = Join-Path $script:docRoot "..\.."

function Show-FileStructure {
    Clear-Host
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  FleetPulse Dashboard - File Structure" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Show documentation structure
    Write-Host "Documentation Structure:" -ForegroundColor Yellow
    Write-Host ""
    Show-Directory-Tree -Path $script:docRoot -Level 0 -MaxDepth 3
    Write-Host ""
    
    # Show actual code structure
    Write-Host "Code Structure (Related Files):" -ForegroundColor Yellow
    Write-Host ""
    $codePaths = @(
        "src\app\components\dashboard\workspace-dashboard",
        "src\app\shared\components\workspace",
        "src\app\shared\components\widget-frame",
        "src\app\shared\services",
        "src\app\shared\models",
        "src\app\shared\data"
    )
    
    foreach ($path in $codePaths) {
        $fullPath = Join-Path $script:basePath $path
        if (Test-Path $fullPath) {
            Write-Host "  $path" -ForegroundColor Green
            Get-ChildItem -Path $fullPath -File -Recurse -Depth 1 | ForEach-Object {
                $relative = $_.FullName.Replace($fullPath, "").TrimStart("\")
                Write-Host "    └── $relative" -ForegroundColor Gray
            }
            Write-Host ""
        }
    }
}

function Show-Directory-Tree {
    param(
        [string]$Path,
        [int]$Level = 0,
        [int]$MaxDepth = 5
    )
    
    if ($Level -gt $MaxDepth) { return }
    
    $items = Get-ChildItem -Path $Path -Directory | Sort-Object Name
    $files = Get-ChildItem -Path $Path -File -Filter "*.md" | Sort-Object Name
    
    $count = 0
    foreach ($item in $items) {
        $count++
        $isLast = $count -eq $items.Count -and $files.Count -eq 0
        $prefix = if ($Level -eq 0) { "" } else { "  " * $Level + (if ($isLast) { "└── " } else { "├── " }) }
        Write-Host "$prefix$($item.Name)/" -ForegroundColor Cyan
        Show-Directory-Tree -Path $item.FullName -Level ($Level + 1) -MaxDepth $MaxDepth
    }
    
    $fileCount = 0
    foreach ($file in $files) {
        $fileCount++
        $isLast = $fileCount -eq $files.Count
        $prefix = if ($Level -eq 0 -and $count -eq 0) { "" } else { "  " * $Level + (if ($isLast) { "└── " } else { "├── " }) }
        Write-Host "$prefix$($file.Name)" -ForegroundColor White
    }
}

function Show-Dependencies {
    Clear-Host
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  FleetPulse Dashboard - Dependencies" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Component Dependencies:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  WorkspaceDashboardComponent" -ForegroundColor Green
    Write-Host "    ├── WorkspaceComponent" -ForegroundColor Gray
    Write-Host "    ├── WidgetFrameComponent" -ForegroundColor Gray
    Write-Host "    ├── FleetService" -ForegroundColor Gray
    Write-Host "    ├── WorkspaceStateService" -ForegroundColor Gray
    Write-Host "    ├── WorkspaceModeService" -ForegroundColor Gray
    Write-Host "    └── WidgetRegistryService" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  WorkspaceComponent" -ForegroundColor Green
    Write-Host "    ├── WidgetFrameComponent" -ForegroundColor Gray
    Write-Host "    ├── WorkspaceStateService" -ForegroundColor Gray
    Write-Host "    ├── GridLayoutService" -ForegroundColor Gray
    Write-Host "    ├── WorkspaceModeService" -ForegroundColor Gray
    Write-Host "    ├── WorkspaceAnimationService" -ForegroundColor Gray
    Write-Host "    └── WidgetRegistryService" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  WidgetFrameComponent" -ForegroundColor Green
    Write-Host "    ├── WorkspaceModeService" -ForegroundColor Gray
    Write-Host "    └── WorkspaceAnimationService" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Service Dependencies:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  FleetService" -ForegroundColor Green
    Write-Host "    └── Uses: localStorage, RxJS" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  WorkspaceStateService" -ForegroundColor Green
    Write-Host "    └── Uses: localStorage, RxJS BehaviorSubject" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "  GridLayoutService" -ForegroundColor Green
    Write-Host "    └── Uses: Workspace interfaces" -ForegroundColor Gray
    Write-Host ""
}

function Show-Menu {
    Clear-Host
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  FleetPulse Dashboard - File Structure Menu" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  [1] Show Documentation Structure" -ForegroundColor Green
    Write-Host "  [2] Show Code Structure" -ForegroundColor Green
    Write-Host "  [3] Show Dependencies" -ForegroundColor Green
    Write-Host "  [4] Show All" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [Q] Quit" -ForegroundColor Red
    Write-Host ""
}

# Main menu
$running = $true
while ($running) {
    Show-Menu
    $choice = Read-Host "Enter your choice"
    
    switch ($choice.ToUpper()) {
        '1' {
            Show-FileStructure
            Write-Host ""
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        '2' {
            Show-CodeStructure
            Write-Host ""
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        '3' {
            Show-Dependencies
            Write-Host ""
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        '4' {
            Show-FileStructure
            Write-Host ""
            Show-Dependencies
            Write-Host ""
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        'Q' {
            $running = $false
        }
        default {
            Write-Host "Invalid choice. Press any key to continue..." -ForegroundColor Red
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    }
}

function Show-CodeStructure {
    Clear-Host
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  FleetPulse Dashboard - Code File Structure" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host ""
    
    $componentsPath = Join-Path $script:basePath "src\app\components\dashboard\workspace-dashboard"
    $sharedComponentsPath = Join-Path $script:basePath "src\app\shared\components"
    $servicesPath = Join-Path $script:basePath "src\app\shared\services"
    $modelsPath = Join-Path $script:basePath "src\app\shared\models"
    $dataPath = Join-Path $script:basePath "src\app\shared\data"
    
    if (Test-Path $componentsPath) {
        Write-Host "Components:" -ForegroundColor Yellow
        Get-ChildItem -Path $componentsPath -File | ForEach-Object {
            Write-Host "  workspace-dashboard/$($_.Name)" -ForegroundColor Green
        }
        Write-Host ""
    }
    
    if (Test-Path $sharedComponentsPath) {
        Write-Host "Shared Components:" -ForegroundColor Yellow
        Get-ChildItem -Path $sharedComponentsPath -Directory | ForEach-Object {
            $componentName = $_.Name
            Write-Host "  $componentName/" -ForegroundColor Cyan
            Get-ChildItem -Path $_.FullName -File | ForEach-Object {
                Write-Host "    └── $($_.Name)" -ForegroundColor Gray
            }
        }
        Write-Host ""
    }
    
    if (Test-Path $servicesPath) {
        Write-Host "Services:" -ForegroundColor Yellow
        Get-ChildItem -Path $servicesPath -File -Filter "*service.ts" | ForEach-Object {
            Write-Host "  $($_.Name)" -ForegroundColor Green
        }
        Write-Host ""
    }
    
    if (Test-Path $modelsPath) {
        Write-Host "Models:" -ForegroundColor Yellow
        Get-ChildItem -Path $modelsPath -File -Filter "*interface.ts" | ForEach-Object {
            Write-Host "  $($_.Name)" -ForegroundColor Green
        }
        Write-Host ""
    }
}
