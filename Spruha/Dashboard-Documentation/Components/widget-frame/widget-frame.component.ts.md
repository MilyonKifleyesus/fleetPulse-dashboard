# Widget Frame Component TypeScript - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/components/widget-frame/widget-frame.component.ts`
- **Purpose**: Widget wrapper with drag/resize/edit controls
- **Dependencies**: WorkspaceModeService, WorkspaceAnimationService

## 🎯 Component Overview

### WHERE
**Location**: `src/app/shared/components/widget-frame/widget-frame.component.ts`

### WHY
Universal widget wrapper that provides:
- Consistent widget appearance
- Edit mode controls
- Drag & resize handles
- Minimize/maximize functionality

### WHEN
Used for every widget in the workspace

### HOW
Wraps widget content via `<ng-content>`, provides control UI

### WHICH
**Concepts Used:**
- Angular Content Projection
- Host Binding for CSS Grid
- Mouse event handling

**Documentation Links:**
- [Angular Content Projection](https://angular.io/guide/content-projection)
- [Host Binding](https://angular.io/api/core/HostBinding)

---

## 🔑 Key Methods

### `onResizeStart(event: MouseEvent, direction: string): void`
**WHERE**: Lines 158-221

**WHY**: Handles widget resize by mouse dragging

**WHEN**: Called when user drags resize handle

**HOW**: Tracks mouse movement, calculates new size, emits resize event

### `getIconName(): string`
**WHERE**: Lines 239-275

**WHY**: Maps widget icons to Material Symbols

**WHEN**: Called during template rendering

**HOW**: Maps icon classes to Material Symbols names

---

## 📚 Documentation Links

- [Angular Host Binding](https://angular.io/api/core/HostBinding)

---

**Next**: Read [HTML Template](./widget-frame.component.html.md)
