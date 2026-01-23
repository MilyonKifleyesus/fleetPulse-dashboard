# Grid Layout Service - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/services/grid-layout.service.ts`
- **Purpose**: Handles CSS Grid calculations and widget auto-arrangement
- **Dependencies**: `WorkspaceLayout`, `GridPosition` interfaces
- **Used By**: `WorkspaceComponent`

## 🎯 Service Overview

### WHERE
**Location**: `src/app/shared/services/grid-layout.service.ts`

### WHY
Calculates responsive grid layout and widget positions. Ensures:
- Responsive column calculations
- Widget auto-arrangement (fills gaps)
- Collision detection
- Grid position validation

### WHEN
Used when:
- Calculating grid columns from container width
- Auto-arranging widgets after changes
- Finding available positions for new widgets
- Validating widget positions

### HOW
Uses mathematical calculations to determine grid layout based on container width and minimum widget size.

### WHICH
**Concepts Used:**
- CSS Grid calculations
- Collision detection algorithms
- Auto-arrangement algorithms

**Documentation Links:**
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

## 🔑 Key Methods

### `calculateLayout(containerWidth: number, minWidgetWidth?: number): WorkspaceLayout`
**WHERE**: Lines 61-75

**WHY**: Calculates optimal grid layout for container width

**WHEN**: Called on container resize or initialization

**HOW**: 
1. Determines breakpoint from width
2. Calculates column count
3. Returns layout configuration

**WHICH**: Responsive design calculation pattern

### `autoArrangeWidgets(widgets: Array<...>, totalColumns: number): Map<string, GridPosition>`
**WHERE**: Lines 164-190

**WHY**: Auto-arranges widgets to fill gaps and wrap to new rows

**WHEN**: Called when widgets are resized, moved, or deleted

**HOW**: Iterates through widgets, finds next available position for each

**WHICH**: Compact layout algorithm pattern

---

## 📚 Documentation Links

- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

**Next**: Read [Workspace Animation Service](./workspace-animation.service.md)
