# Workspace Mode Service - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/services/workspace-mode.service.ts`
- **Purpose**: Manages edit/view mode toggling with keyboard shortcuts
- **Dependencies**: RxJS BehaviorSubject
- **Used By**: `WorkspaceComponent`, `WidgetFrameComponent`, `WorkspaceDashboardComponent`

## 🎯 Service Overview

### WHERE
**Location**: `src/app/shared/services/workspace-mode.service.ts`

### WHY
Centralized mode management. Provides:
- Edit/View mode state
- Keyboard shortcut handling (Ctrl/Cmd + E)
- Observable mode changes
- Mode persistence

### WHEN
Used when:
- Toggling between edit and view mode
- Reacting to mode changes in components
- Showing/hiding edit controls

### HOW
Uses RxJS BehaviorSubject to emit mode changes, listens for keyboard events.

### WHICH
**Concepts Used:**
- RxJS BehaviorSubject
- Keyboard event listeners
- Observable pattern

**Documentation Links:**
- [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)
- [DOM Event Listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

---

## 🔑 Key Methods

### `toggleMode(): void`
**WHERE**: Lines 42-45

**WHY**: Toggles between 'view' and 'edit' mode

**WHEN**: Called by keyboard shortcut or UI button

**HOW**: Gets current mode, switches to opposite, emits new mode

**WHICH**: Simple state toggle pattern

### Keyboard Shortcut Listener
**WHERE**: Lines 15-22

**WHY**: Listens for Ctrl/Cmd + E to toggle mode

**WHEN**: Always active in window

**HOW**: Adds keyboard event listener in constructor

**WHICH**: DOM event handling

---

## 📚 Documentation Links

- [RxJS BehaviorSubject](https://rxjs.dev/guide/subject#behaviorsubject)

---

**Next**: Read [Grid Layout Service](./grid-layout.service.md)
