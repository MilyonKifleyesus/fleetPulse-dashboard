# Dashboard Routes - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/components/dashboard/dashboard.routes.ts`
- **Purpose**: Route configuration for dashboard components
- **Dependencies**: Angular Router
- **Used By**: `app.routes.ts` (main app routing)

## 🎯 Route Configuration

### WHERE
**Location**: `src/app/components/dashboard/dashboard.routes.ts`

### WHY
Defines routes for dashboard-related components. Uses lazy loading for:
- Better performance (code splitting)
- Smaller initial bundle
- On-demand loading

### WHEN
Used when Angular Router resolves dashboard routes

### HOW
Uses `loadComponent` for lazy loading standalone components

### WHICH
**Concepts Used:**
- Angular Router lazy loading
- Standalone component loading
- Route configuration

**Documentation Links:**
- [Angular Router](https://angular.io/guide/router)
- [Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules)

---

## 🛣️ Routes Defined

### `/dashboard`
**WHERE**: Lines 13-18

**WHY**: Main dashboard route

**WHEN**: Navigated to `/dashboard`

**HOW**: Lazy loads `WorkspaceDashboardComponent`

**WHICH**: Lazy loading pattern

```typescript
{
  path: 'dashboard',
  loadComponent: () =>
    import('./workspace-dashboard/workspace-dashboard.component').then(
      (m) => m.WorkspaceDashboardComponent
    ),
}
```

---

## 📚 Documentation Links

- [Angular Router](https://angular.io/guide/router)
- [Lazy Loading Components](https://angular.io/guide/lazy-loading-ngmodules)

---

**Next**: Explore [Concepts Documentation](../Concepts/README.md)
