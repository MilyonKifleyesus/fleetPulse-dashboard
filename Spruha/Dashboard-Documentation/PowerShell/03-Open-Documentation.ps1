# FleetPulse Dashboard - Documentation Links Script
# Opens official documentation links and related resources

function Show-DocumentationMenu {
    Clear-Host
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  FleetPulse Dashboard - Documentation Links" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Select a category:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1] Angular Documentation" -ForegroundColor Green
    Write-Host "  [2] TypeScript Documentation" -ForegroundColor Green
    Write-Host "  [3] RxJS Documentation" -ForegroundColor Green
    Write-Host "  [4] CSS Grid Documentation" -ForegroundColor Green
    Write-Host "  [5] All Links" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [Q] Quit" -ForegroundColor Red
    Write-Host ""
}

function Open-URL {
    param([string]$URL)
    
    try {
        if ($IsWindows -or $PSVersionTable.PSVersion.Major -lt 6) {
            Start-Process $URL
        } else {
            if (Get-Command "xdg-open" -ErrorAction SilentlyContinue) {
                & xdg-open $URL
            } elseif (Get-Command "open" -ErrorAction SilentlyContinue) {
                & open $URL
            } else {
                Write-Host "Cannot open URL automatically. Please visit: $URL" -ForegroundColor Yellow
            }
        }
        Write-Host "Opened: $URL" -ForegroundColor Green
    } catch {
        Write-Host "Error opening URL: $_" -ForegroundColor Red
        Write-Host "Please visit manually: $URL" -ForegroundColor Yellow
    }
}

function Show-AngularLinks {
    Clear-Host
    Write-Host "Angular Documentation Links:" -ForegroundColor Yellow
    Write-Host ""
    
    $links = @{
        "1" = @{ Name = "Angular Official Docs"; URL = "https://angular.io/docs" }
        "2" = @{ Name = "Standalone Components"; URL = "https://angular.io/guide/standalone-components" }
        "3" = @{ Name = "Signals"; URL = "https://angular.io/guide/signals" }
        "4" = @{ Name = "Dependency Injection"; URL = "https://angular.io/guide/dependency-injection" }
        "5" = @{ Name = "Component Lifecycle"; URL = "https://angular.io/guide/lifecycle-hooks" }
        "6" = @{ Name = "Routing"; URL = "https://angular.io/guide/router" }
        "7" = @{ Name = "HTTP Client"; URL = "https://angular.io/guide/http" }
    }
    
    foreach ($key in $links.Keys | Sort-Object) {
        $link = $links[$key]
        Write-Host "  [$key] $($link.Name)" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "  [B] Back to Main Menu" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Enter your choice"
    if ($links.ContainsKey($choice)) {
        Open-URL -URL $links[$choice].URL
        Write-Host ""
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

function Show-TypeScriptLinks {
    Clear-Host
    Write-Host "TypeScript Documentation Links:" -ForegroundColor Yellow
    Write-Host ""
    
    $links = @{
        "1" = @{ Name = "TypeScript Official Docs"; URL = "https://www.typescriptlang.org/docs/" }
        "2" = @{ Name = "Interfaces"; URL = "https://www.typescriptlang.org/docs/handbook/2/objects.html" }
        "3" = @{ Name = "Types"; URL = "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" }
        "4" = @{ Name = "Generics"; URL = "https://www.typescriptlang.org/docs/handbook/2/generics.html" }
        "5" = @{ Name = "Type Guards"; URL = "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" }
    }
    
    foreach ($key in $links.Keys | Sort-Object) {
        $link = $links[$key]
        Write-Host "  [$key] $($link.Name)" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "  [B] Back to Main Menu" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Enter your choice"
    if ($links.ContainsKey($choice)) {
        Open-URL -URL $links[$choice].URL
        Write-Host ""
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

function Show-RxJSLinks {
    Clear-Host
    Write-Host "RxJS Documentation Links:" -ForegroundColor Yellow
    Write-Host ""
    
    $links = @{
        "1" = @{ Name = "RxJS Official Docs"; URL = "https://rxjs.dev/" }
        "2" = @{ Name = "Observable Guide"; URL = "https://rxjs.dev/guide/overview" }
        "3" = @{ Name = "Operators"; URL = "https://rxjs.dev/guide/operators" }
        "4" = @{ Name = "Subject"; URL = "https://rxjs.dev/guide/subject" }
        "5" = @{ Name = "BehaviorSubject"; URL = "https://rxjs.dev/guide/subject#behaviorsubject" }
        "6" = @{ Name = "forkJoin"; URL = "https://rxjs.dev/api/index/function/forkJoin" }
        "7" = @{ Name = "takeUntil"; URL = "https://rxjs.dev/api/operators/takeUntil" }
    }
    
    foreach ($key in $links.Keys | Sort-Object) {
        $link = $links[$key]
        Write-Host "  [$key] $($link.Name)" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "  [B] Back to Main Menu" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Enter your choice"
    if ($links.ContainsKey($choice)) {
        Open-URL -URL $links[$choice].URL
        Write-Host ""
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

function Show-CSSGridLinks {
    Clear-Host
    Write-Host "CSS Grid Documentation Links:" -ForegroundColor Yellow
    Write-Host ""
    
    $links = @{
        "1" = @{ Name = "MDN CSS Grid Guide"; URL = "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout" }
        "2" = @{ Name = "CSS Grid Basics"; URL = "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout" }
        "3" = @{ Name = "Grid Template Columns"; URL = "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns" }
        "4" = @{ Name = "Grid Area"; URL = "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area" }
        "5" = @{ Name = "CSS-Tricks Grid Guide"; URL = "https://css-tricks.com/snippets/css/complete-guide-grid/" }
    }
    
    foreach ($key in $links.Keys | Sort-Object) {
        $link = $links[$key]
        Write-Host "  [$key] $($link.Name)" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "  [B] Back to Main Menu" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Enter your choice"
    if ($links.ContainsKey($choice)) {
        Open-URL -URL $links[$choice].URL
        Write-Host ""
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

function Show-AllLinks {
    Clear-Host
    Write-Host "All Documentation Links:" -ForegroundColor Yellow
    Write-Host ""
    
    $allLinks = @(
        @{ Category = "Angular"; Name = "Official Docs"; URL = "https://angular.io/docs" }
        @{ Category = "Angular"; Name = "Standalone Components"; URL = "https://angular.io/guide/standalone-components" }
        @{ Category = "Angular"; Name = "Signals"; URL = "https://angular.io/guide/signals" }
        @{ Category = "TypeScript"; Name = "Official Docs"; URL = "https://www.typescriptlang.org/docs/" }
        @{ Category = "TypeScript"; Name = "Interfaces"; URL = "https://www.typescriptlang.org/docs/handbook/2/objects.html" }
        @{ Category = "RxJS"; Name = "Official Docs"; URL = "https://rxjs.dev/" }
        @{ Category = "RxJS"; Name = "Observable Guide"; URL = "https://rxjs.dev/guide/overview" }
        @{ Category = "CSS"; Name = "CSS Grid Guide"; URL = "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout" }
        @{ Category = "CSS"; Name = "CSS Grid Complete Guide"; URL = "https://css-tricks.com/snippets/css/complete-guide-grid/" }
    )
    
    $currentCategory = ""
    foreach ($link in $allLinks) {
        if ($currentCategory -ne $link.Category) {
            if ($currentCategory -ne "") { Write-Host "" }
            Write-Host "$($link.Category):" -ForegroundColor Cyan
            $currentCategory = $link.Category
        }
        Write-Host "  - $($link.Name): $($link.URL)" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "Press any key to continue..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Main menu
$running = $true
while ($running) {
    Show-DocumentationMenu
    $choice = Read-Host "Enter your choice"
    
    switch ($choice.ToUpper()) {
        '1' {
            $angularRunning = $true
            while ($angularRunning) {
                Show-AngularLinks
                if ($LASTEXITCODE -eq 0) { $angularRunning = $false }
            }
        }
        '2' {
            $tsRunning = $true
            while ($tsRunning) {
                Show-TypeScriptLinks
                if ($LASTEXITCODE -eq 0) { $tsRunning = $false }
            }
        }
        '3' {
            $rxjsRunning = $true
            while ($rxjsRunning) {
                Show-RxJSLinks
                if ($LASTEXITCODE -eq 0) { $rxjsRunning = $false }
            }
        }
        '4' {
            $cssRunning = $true
            while ($cssRunning) {
                Show-CSSGridLinks
                if ($LASTEXITCODE -eq 0) { $cssRunning = $false }
            }
        }
        '5' {
            Show-AllLinks
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
