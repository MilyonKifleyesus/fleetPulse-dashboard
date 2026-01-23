# Workspace Component Styles - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/components/workspace/workspace.component.scss`
- **Purpose**: CSS Grid styles for workspace container
- **Dependencies**: None (pure SCSS/CSS)

## 🎯 Styles Overview

### WHERE
**Location**: `src/app/shared/components/workspace/workspace.component.scss`

### WHY
Defines CSS Grid layout styles for:
- Grid container
- Drag & drop visual feedback
- Edit mode overlay
- Responsive breakpoints

### WHEN
Applied when WorkspaceComponent is rendered

### HOW
Uses CSS Grid with dynamic properties, CDK drag classes

### WHICH
**Concepts Used:**
- CSS Grid Layout
- SCSS Variables
- CSS Transitions
- Media Queries

**Documentation Links:**
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

---

## 📋 Key Styles

### `.workspace-grid`
**WHERE**: Lines 1-62

**WHY**: Main grid container with dynamic columns

**WHICH**: CSS Grid with `display: grid`

### `.edit-mode` Grid Overlay
**WHERE**: Lines 44-61

**WHY**: Shows grid overlay in edit mode for visual guidance

**WHICH**: CSS background-image pattern

### CDK Drag Styles
**WHERE**: Lines 65-108

**WHY**: Visual feedback during drag operations

**WHICH**: Angular CDK CSS classes

---

## 📚 Documentation Links

- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

**Next**: Explore [Widget Frame Component](../widget-frame/README.md)
