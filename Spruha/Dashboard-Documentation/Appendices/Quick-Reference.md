# Quick Reference - Cheat Sheet

## 🚀 Quick Commands

### PowerShell Scripts
```powershell
# Navigate documentation
.\Dashboard-Documentation\PowerShell\01-Navigate-Code.ps1

# Show file structure
.\Dashboard-Documentation\PowerShell\02-Show-File-Structure.ps1

# Open documentation links
.\Dashboard-Documentation\PowerShell\03-Open-Documentation.ps1
```

## 📁 Key File Locations

### Components
- Workspace Dashboard: `src/app/components/dashboard/workspace-dashboard/`
- Workspace: `src/app/shared/components/workspace/`
- Widget Frame: `src/app/shared/components/widget-frame/`

### Services
- Fleet Service: `src/app/shared/services/fleet.service.ts`
- Workspace State: `src/app/shared/services/workspace-state.service.ts`
- Workspace Mode: `src/app/shared/services/workspace-mode.service.ts`

### Models
- Vehicle: `src/app/shared/models/vehicle.interface.ts`
- Dashboard Stats: `src/app/shared/models/dashboard-stats.interface.ts`
- Workspace: `src/app/shared/models/workspace.interface.ts`

## 🔑 Key Concepts

### RxJS Patterns
- `Observable<T>` - Async data stream
- `BehaviorSubject<T>` - Observable with current value
- `forkJoin({ ... })` - Parallel async operations
- `takeUntil(this.destroy$)` - Cleanup subscriptions

### Angular Patterns
- `@Component({ standalone: true })` - Standalone component
- `<ng-content>` - Content projection
- `@if (condition)` - Conditional rendering
- `@for (item of items; track item.id)` - Looping

### CSS Grid
- `display: grid` - Grid container
- `grid-template-columns: repeat(12, 1fr)` - 12 columns
- `grid-area: row / col / row-end / col-end` - Widget position

## 📚 Documentation Links

- [Angular Docs](https://angular.io/docs)
- [RxJS Docs](https://rxjs.dev/)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

**Next**: Check [Troubleshooting](./Troubleshooting.md)
