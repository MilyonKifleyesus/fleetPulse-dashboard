# Workspace Component TypeScript - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/components/workspace/workspace.component.ts`
- **Purpose**: Manages CSS Grid container for widgets with drag & drop
- **Dependencies**: 
  - Angular CDK DragDrop
  - WorkspaceStateService
  - GridLayoutService
  - WorkspaceModeService
  - WorkspaceAnimationService

## 🎯 Component Overview

### WHERE
**Location**: `src/app/shared/components/workspace/workspace.component.ts`

### WHY
Provides CSS Grid container that:
- Manages widget positions
- Handles drag & drop
- Auto-arranges widgets
- Responds to resize
- Persists layout

### WHEN
Used when:
- Initializing workspace
- Dragging widgets
- Resizing widgets
- Container resizing
- Loading saved state

### HOW
Uses Angular CDK DragDrop, CSS Grid, and services for state management.

### WHICH
**Concepts Used:**
- Angular Standalone Component
- Angular CDK DragDrop
- CSS Grid Layout
- RxJS Observables
- ResizeObserver API

**Documentation Links:**
- [Angular Standalone Components](https://angular.io/guide/standalone-components)
- [Angular CDK DragDrop](https://material.angular.io/cdk/drag-drop/overview)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

## 🔑 Key Methods

### `ngOnInit(): void`
**WHERE**: Lines 105-125

**WHY**: Initializes component, subscribes to mode changes, loads workspace state

**WHEN**: Called by Angular during component initialization

**HOW**: 
1. Subscribes to mode changes
2. Loads workspace state
3. Initializes widgets
4. Sets initial layout

### `onWidgetDrop(event: CdkDragDrop<WidgetFrame[]>): void`
**WHERE**: Lines 233-260

**WHY**: Handles widget drag & drop, updates positions, saves state

**WHEN**: Called when widget is dropped after dragging

**HOW**: 
1. Reorders widget array
2. Updates widget positions
3. Animates layout shift
4. Saves state

### `calculateLayout(): void`
**WHERE**: Lines 173-199

**WHY**: Calculates grid layout based on container width, updates columns

**WHEN**: Called on container resize or initialization

**HOW**: 
1. Gets container width
2. Calculates columns from width
3. Updates grid template
4. Re-arranges widgets if columns changed

---

## 📚 Documentation Links

- [Angular Component Lifecycle](https://angular.io/guide/lifecycle-hooks)
- [Angular CDK DragDrop](https://material.angular.io/cdk/drag-drop/overview)

---

**Next**: Read [HTML Template](./workspace.component.html.md)
