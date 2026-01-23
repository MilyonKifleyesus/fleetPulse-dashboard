# Workspace Animation Service - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/services/workspace-animation.service.ts`
- **Purpose**: Handles smooth animations for widget movement and resizing
- **Dependencies**: `Position`, `Size` interfaces
- **Used By**: `WorkspaceComponent`, `WidgetFrameComponent`

## 🎯 Service Overview

### WHERE
**Location**: `src/app/shared/services/workspace-animation.service.ts`

### WHY
Provides smooth animations for widget interactions. Uses FLIP technique for performant animations.

### WHEN
Used when:
- Widgets are moved (drag & drop)
- Widgets are resized
- Layout shifts occur
- Widgets are added/removed

### HOW
Uses FLIP (First, Last, Invert, Play) technique with CSS transforms for smooth animations.

### WHICH
**Concepts Used:**
- FLIP animation technique
- CSS transforms
- requestAnimationFrame API

**Documentation Links:**
- [FLIP Technique](https://aerotwist.com/blog/flip-your-animations/)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

---

## 🔑 Key Methods

### `animateLayoutShift(container: HTMLElement): void`
**WHERE**: Lines 77-141

**WHY**: Animates layout shifts when widgets move/resize using FLIP technique

**WHEN**: Called after widget position changes

**HOW**: 
1. Records initial positions (First)
2. Gets new positions (Last)
3. Calculates differences (Invert)
4. Animates with CSS transforms (Play)

**WHICH**: FLIP animation pattern

---

## 📚 Documentation Links

- [FLIP Animation](https://aerotwist.com/blog/flip-your-animations/)
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

---

**Next**: Read [Widget Registry Service](./widget-registry.service.md)
