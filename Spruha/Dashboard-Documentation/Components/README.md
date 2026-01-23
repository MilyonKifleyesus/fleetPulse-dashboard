# Components Overview

This directory contains all Angular component documentation for the FleetPulse Dashboard.

## 📋 Available Components

| Component | Location | Documentation |
|-----------|----------|---------------|
| **Workspace** | `src/app/shared/components/workspace/` | [Documentation](./workspace/README.md) |
| **Widget Frame** | `src/app/shared/components/widget-frame/` | [Documentation](./widget-frame/README.md) |
| **Workspace Dashboard** | `src/app/components/dashboard/workspace-dashboard/` | [Documentation](./workspace-dashboard/README.md) |

## 🎯 Component Architecture

```
WorkspaceDashboardComponent (Main Dashboard)
    ├── WorkspaceComponent (Grid Container)
    │   └── WidgetFrameComponent (Widget Wrapper)
    │       └── Widget Content (Projected via <ng-content>)
```

## 📚 Documentation Structure

Each component has documentation for:
- TypeScript (`.ts`) - Logic and behavior
- HTML Template (`.html`) - Structure and layout
- Styles (`.scss`) - Visual appearance

## 🔗 How Components Connect

- **WorkspaceDashboardComponent**: Main dashboard container, orchestrates data loading and widget initialization
- **WorkspaceComponent**: CSS Grid container that manages widget positions and layout
- **WidgetFrameComponent**: Wrapper around widget content with drag/resize/edit controls

## 🎓 Next Steps

1. Read individual component documentation
2. Understand component interactions
3. See how data flows through components
4. Explore the [Concepts Documentation](../Concepts/README.md)

---

**Ready to dive in? Start with [Workspace Component](./workspace/README.md)!**
