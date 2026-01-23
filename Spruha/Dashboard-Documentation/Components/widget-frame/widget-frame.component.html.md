# Widget Frame Component HTML - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/components/widget-frame/widget-frame.component.html`
- **Purpose**: Widget frame template with header and controls

## 🎯 Template Overview

### WHERE
**Location**: `src/app/shared/components/widget-frame/widget-frame.component.html`

### WHY
Defines widget frame structure with:
- Header with icon/title
- Action buttons (settings/minimize/maximize/delete)
- Content projection area
- Resize handles
- Drag handle

### WHEN
Rendered for each widget in workspace

### HOW
Uses Angular template syntax, conditional rendering, content projection

### WHICH
**Concepts Used:**
- Content Projection (`<ng-content>`)
- Angular Directives (`*ngIf`)
- Conditional CSS Classes

**Documentation Links:**
- [Angular Templates](https://angular.io/guide/template-syntax)

---

## 📋 Template Structure

### Widget Header
**WHY**: Displays widget title and action buttons

**WHEN**: Always visible (unless minimized)

**WHICH**: Header pattern with action buttons

### Widget Body
**WHY**: Content projection area for widget content

**WHEN**: Visible when not minimized

**WHICH**: Angular content projection pattern

### Resize Handles
**WHY**: 8-directional resize handles (corners + edges)

**WHEN**: Visible in edit mode

**WHICH**: Resize handle pattern

---

## 📚 Documentation Links

- [Angular Content Projection](https://angular.io/guide/content-projection)

---

**Next**: Read [Styles](./widget-frame.component.scss.md)
