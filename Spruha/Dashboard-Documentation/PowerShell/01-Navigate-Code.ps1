# FleetPulse Dashboard - Code Navigation Script
# Interactive menu to navigate and explore the documentation

param(
    [string]$SearchTerm = ""
)

$script:docRoot = Split-Path -Parent $PSScriptRoot
$script:basePath = Join-Path $script:docRoot "..\.."

function Show-Menu {
    Clear-Host
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  FleetPulse Dashboard - Code Navigation" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Select a category to explore:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1] Models (Data Structures)" -ForegroundColor Green
    Write-Host "  [2] Services (Business Logic)" -ForegroundColor Green
    Write-Host "  [3] Components (User Interface)" -ForegroundColor Green
    Write-Host "  [4] Data & Configuration" -ForegroundColor Green
    Write-Host "  [5] Routing" -ForegroundColor Green
    Write-Host "  [6] Concepts (Core Concepts)" -ForegroundColor Green
    Write-Host "  [7] Appendices (Reference)" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [S] Search Documentation" -ForegroundColor Magenta
    Write-Host "  [Q] Quit" -ForegroundColor Red
    Write-Host ""
}

function Show-Models-Menu {
    Clear-Host
    Write-Host "Models (Data Structures):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1] Vehicle Interface" -ForegroundColor Green
    Write-Host "  [2] Dashboard Stats Interface" -ForegroundColor Green
    Write-Host "  [3] Workspace Interface" -ForegroundColor Green
    Write-Host "  [4] Activity Interface" -ForegroundColor Green
    Write-Host "  [5] Models Overview" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [B] Back to Main Menu" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Services-Menu {
    Clear-Host
    Write-Host "Services (Business Logic):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1] Fleet Service" -ForegroundColor Green
    Write-Host "  [2] Workspace State Service" -ForegroundColor Green
    Write-Host "  [3] Workspace Mode Service" -ForegroundColor Green
    Write-Host "  [4] Grid Layout Service" -ForegroundColor Green
    Write-Host "  [5] Workspace Animation Service" -ForegroundColor Green
    Write-Host "  [6] Widget Registry Service" -ForegroundColor Green
    Write-Host "  [7] Services Overview" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [B] Back to Main Menu" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Components-Menu {
    Clear-Host
    Write-Host "Components (User Interface):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1] Workspace Component" -ForegroundColor Green
    Write-Host "  [2] Widget Frame Component" -ForegroundColor Green
    Write-Host "  [3] Workspace Dashboard Component" -ForegroundColor Green
    Write-Host "  [4] Components Overview" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [B] Back to Main Menu" -ForegroundColor Cyan
    Write-Host ""
}

function Open-File {
    param([string]$FilePath)
    
    $fullPath = Join-Path $script:docRoot $FilePath
    
    if (Test-Path $fullPath) {
        if ($IsWindows -or $PSVersionTable.PSVersion.Major -ge 6) {
            code $fullPath
        } else {
            notepad $fullPath
        }
        Write-Host "Opened: $FilePath" -ForegroundColor Green
    } else {
        Write-Host "File not found: $fullPath" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Press any key to continue..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Search-Documentation {
    param([string]$SearchTerm)
    
    if ([string]::IsNullOrEmpty($SearchTerm)) {
        $SearchTerm = Read-Host "Enter search term"
    }
    
    Write-Host ""
    Write-Host "Searching for: $SearchTerm" -ForegroundColor Yellow
    Write-Host ""
    
    $files = Get-ChildItem -Path $script:docRoot -Recurse -Filter "*.md" | Where-Object {
        $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $content -match $SearchTerm
        }
    }
    
    if ($files.Count -gt 0) {
        Write-Host "Found $($files.Count) file(s):" -ForegroundColor Green
        Write-Host ""
        $index = 1
        $files | ForEach-Object {
            $relativePath = $_.FullName.Replace($script:docRoot, "").TrimStart("\")
            Write-Host "  [$index] $relativePath" -ForegroundColor Cyan
            $script:searchResults += @{
                Index = $index
                Path = $relativePath
                FullPath = $_.FullName
            }
            $index++
        }
        Write-Host ""
        $choice = Read-Host "Enter file number to open (or 'B' to go back)"
        if ($choice -ne 'B' -and $choice -match '^\d+$') {
            $selected = $script:searchResults | Where-Object { $_.Index -eq [int]$choice }
            if ($selected) {
                Open-File $selected.Path
            }
        }
    } else {
        Write-Host "No files found matching '$SearchTerm'" -ForegroundColor Red
        Write-Host ""
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Main loop
$running = $true
$script:searchResults = @()

while ($running) {
    if (-not $SearchTerm) {
        Show-Menu
        $choice = Read-Host "Enter your choice"
    } else {
        Search-Documentation -SearchTerm $SearchTerm
        $SearchTerm = ""
        continue
    }
    
    switch ($choice.ToUpper()) {
        '1' {
            # Models
            $modelsRunning = $true
            while ($modelsRunning) {
                Show-Models-Menu
                $modelsChoice = Read-Host "Enter your choice"
                switch ($modelsChoice.ToUpper()) {
                    '1' { Open-File "Models\vehicle.interface.md" }
                    '2' { Open-File "Models\dashboard-stats.interface.md" }
                    '3' { Open-File "Models\workspace.interface.md" }
                    '4' { Open-File "Models\activity.interface.md" }
                    '5' { Open-File "Models\README.md" }
                    'B' { $modelsRunning = $false }
                }
            }
        }
        '2' {
            # Services
            $servicesRunning = $true
            while ($servicesRunning) {
                Show-Services-Menu
                $servicesChoice = Read-Host "Enter your choice"
                switch ($servicesChoice.ToUpper()) {
                    '1' { Open-File "Services\fleet.service.md" }
                    '2' { Open-File "Services\workspace-state.service.md" }
                    '3' { Open-File "Services\workspace-mode.service.md" }
                    '4' { Open-File "Services\grid-layout.service.md" }
                    '5' { Open-File "Services\workspace-animation.service.md" }
                    '6' { Open-File "Services\widget-registry.service.md" }
                    '7' { Open-File "Services\README.md" }
                    'B' { $servicesRunning = $false }
                }
            }
        }
        '3' {
            # Components
            $componentsRunning = $true
            while ($componentsRunning) {
                Show-Components-Menu
                $componentsChoice = Read-Host "Enter your choice"
                switch ($componentsChoice.ToUpper()) {
                    '1' { Open-File "Components\workspace\README.md" }
                    '2' { Open-File "Components\widget-frame\README.md" }
                    '3' { Open-File "Components\workspace-dashboard\README.md" }
                    '4' { Open-File "Components\README.md" }
                    'B' { $componentsRunning = $false }
                }
            }
        }
        '4' {
            # Data
            Open-File "Data\dashboard.ts.md"
        }
        '5' {
            # Routing
            Open-File "Routing\dashboard.routes.md"
        }
        '6' {
            # Concepts
            Write-Host "Concepts available:" -ForegroundColor Yellow
            Write-Host "  - Angular-Basics.md"
            Write-Host "  - RxJS-Patterns.md"
            Write-Host "  - CSS-Grid-Layout.md"
            Write-Host "  - State-Management.md"
            Write-Host "  - Drag-Drop-System.md"
            Write-Host "  - Widget-System.md"
            Write-Host ""
            $concept = Read-Host "Enter concept name (without .md extension)"
            if ($concept) {
                Open-File "Concepts\$concept.md"
            }
        }
        '7' {
            # Appendices
            Write-Host "Appendices available:" -ForegroundColor Yellow
            Write-Host "  - Glossary.md"
            Write-Host "  - Quick-Reference.md"
            Write-Host "  - Troubleshooting.md"
            Write-Host "  - Links.md"
            Write-Host ""
            $appendix = Read-Host "Enter appendix name (without .md extension)"
            if ($appendix) {
                Open-File "Appendices\$appendix.md"
            }
        }
        'S' {
            Search-Documentation
        }
        'Q' {
            $running = $false
            Write-Host "Goodbye!" -ForegroundColor Green
        }
        default {
            Write-Host "Invalid choice. Press any key to continue..." -ForegroundColor Red
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    }
}
