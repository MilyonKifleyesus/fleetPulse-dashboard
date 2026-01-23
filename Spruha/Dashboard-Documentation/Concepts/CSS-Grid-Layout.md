# CSS Grid Layout - Grid System

## 🎯 Overview

This document explains CSS Grid concepts used in the workspace system.

## 📋 CSS Grid Concepts

### CSS Grid Container
**WHERE**: `.workspace-grid` class

**WHY**: Creates grid layout for widgets

**WHEN**: Always active for workspace

**HOW**: `display: grid; grid-template-columns: repeat(12, 1fr);`

**WHICH**: CSS Grid container pattern

**Documentation**: [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

### grid-area
**WHERE**: Widget positioning

**WHY**: Places widget in specific grid area

**WHEN**: For each widget

**HOW**: `grid-area: row / column / row-end / column-end;`

**WHICH**: CSS Grid area pattern

**Documentation**: [CSS grid-area](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area)

### Responsive Grid
**WHERE**: GridLayoutService calculates columns

**WHY**: Adapts columns to container width

**WHEN**: On container resize

**HOW**: Calculates columns from width / min-width

**WHICH**: Responsive grid pattern

**Documentation**: [Responsive Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Grid_Template_Areas)

---

## 📚 Documentation Links

- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Grid Complete Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

**Next**: Read [State Management](./State-Management.md)
