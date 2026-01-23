# Workspace Dashboard Component HTML - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/components/dashboard/workspace-dashboard/workspace-dashboard.component.html`
- **Purpose**: Dashboard template with workspace grid and widgets

## 🎯 Template Overview

### WHERE
**Location**: `src/app/components/dashboard/workspace-dashboard/workspace-dashboard.component.html`

### WHY
Defines dashboard structure:
- Loading/error states
- Workspace grid container
- Widget content projection

### WHEN
Rendered when WorkspaceDashboardComponent is instantiated

### HOW
Uses Angular control flow (`@if`), content projection, workspace component

### WHICH
**Concepts Used:**
- Angular Control Flow (`@if`, `@for`)
- Content Projection
- Component Composition

**Documentation Links:**
- [Angular Control Flow](https://angular.io/guide/control-flow)

---

## 📋 Template Structure

### Loading/Error States
**WHY**: User feedback during data loading

**WHICH**: Conditional rendering pattern

### Workspace Component
**WHY**: Main grid container for widgets

**WHICH**: Component composition pattern

### Widget Content Projection
**WHY**: Projects metric cards, charts, tables via `data-widget-id`

**WHICH**: Content projection pattern

---

**Next**: Read [Styles](./workspace-dashboard.component.scss.md)
