# Workspace State Service - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/services/workspace-state.service.ts`
- **Purpose**: Manages workspace state persistence with localStorage
- **Dependencies**: `WorkspaceState`, `WidgetFrame`, `WorkspaceLayout` interfaces, RxJS
- **Used By**: `WorkspaceComponent`, `WorkspaceDashboardComponent`

## 🎯 Service Overview

### WHERE
**Location**: `src/app/shared/services/workspace-state.service.ts`

### WHY
Central service for workspace state management. Provides:
- State persistence to localStorage
- State loading from localStorage
- Debounced saves for performance
- User-specific namespacing

### WHEN
Used when:
- Loading saved workspace layout
- Saving workspace state after changes
- Managing widget state
- Exporting/importing workspace state

### HOW
Uses RxJS BehaviorSubject and localStorage with debouncing to optimize saves.

### WHICH
**Concepts Used:**
- RxJS BehaviorSubject
- localStorage API
- Debouncing for performance
- JSON serialization

**Documentation Links:**
- [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## 🔑 Key Methods

### `saveWorkspaceState(state: WorkspaceState): void`
**WHERE**: Lines 33-37

**WHY**: Saves workspace state to localStorage with debouncing

**WHEN**: Called after any widget change (move, resize, add, delete)

**HOW**: Emits to BehaviorSubject, triggers debounced localStorage save

**WHICH**: RxJS debounce pattern (300ms delay)

### `loadWorkspaceState(workspaceId: string, userId?: string): WorkspaceState | null`
**WHERE**: Lines 42-78

**WHY**: Loads saved workspace state from localStorage

**WHEN**: Called when workspace component initializes

**HOW**: 
1. Constructs localStorage key with namespacing
2. Loads JSON data
3. Validates and normalizes widget sizes
4. Returns WorkspaceState object

**WHICH**: localStorage getItem with JSON parsing

---

## 📚 Documentation Links

- [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)
- [RxJS debounceTime](https://rxjs.dev/api/operators/debounceTime)

---

**Next**: Read [Workspace Mode Service](./workspace-mode.service.md)
