# FleetPulse Dashboard - Comprehensive Test Plan

## Test Environment

- **URL**: `http://localhost:4200/dashboard`
- **Framework**: Angular 19
- **Testing Tool**: TestSprite
- **Date**: 2026-01-12

## Overview

This document outlines comprehensive test scenarios for the FleetPulse Dashboard workspace functionality, including widget management, drag-and-drop, settings popup, edit mode, persistence, and responsive design.

---

## 1. Dashboard Loading & Initialization

### Test Case 1.1: Dashboard Loads Successfully

- **Objective**: Verify dashboard loads with default widgets
- **Steps**:
  1. Navigate to `http://localhost:4200/dashboard`
  2. Wait for page to fully load
- **Expected**:
  - Dashboard renders without errors
  - Default widgets are displayed (7 widgets expected)
  - No console errors

### Test Case 1.2: Widget Rendering

- **Objective**: Verify all widgets render correctly
- **Steps**:
  1. Check DOM for widget elements
  2. Verify each widget has correct structure
- **Expected**:
  - All widgets have `data-widget-id` attribute
  - Widget headers display correct titles
  - Widget bodies contain content
  - Widget icons are visible

### Test Case 1.3: LocalStorage Persistence on Load

- **Objective**: Verify saved layout loads from localStorage
- **Steps**:
  1. Clear localStorage
  2. Load dashboard (should show default layout)
  3. Customize layout
  4. Refresh page
- **Expected**:
  - Custom layout persists after refresh
  - Widget positions and sizes are maintained

---

## 2. Edit Mode Toggle

### Test Case 2.1: Toggle Edit Mode On

- **Objective**: Verify edit mode activates correctly
- **Steps**:
  1. Click "Edit Mode" toggle button
  2. Verify UI changes
- **Expected**:
  - Toggle switches to "ON"
  - Widget action buttons appear (settings, minimize, maximize, delete)
  - Resize handles appear on widgets
  - Drag handles appear on widgets
  - Grid pattern background becomes visible

### Test Case 2.2: Toggle Edit Mode Off

- **Objective**: Verify view mode restores correctly
- **Steps**:
  1. In edit mode, click toggle to turn off
- **Expected**:
  - Action buttons disappear
  - Resize handles disappear
  - Drag handles disappear
  - Settings popups close automatically
  - Grid pattern background hides

### Test Case 2.3: Settings Popup Closes on Mode Exit

- **Objective**: Verify popup closes when exiting edit mode
- **Steps**:
  1. Enter edit mode
  2. Open settings popup for a widget
  3. Exit edit mode
- **Expected**:
  - Settings popup closes automatically
  - No popup elements remain in DOM

---

## 3. Widget Settings Popup

### Test Case 3.1: Popup Opens on Settings Click

- **Objective**: Verify settings popup appears when button is clicked
- **Steps**:
  1. Enter edit mode
  2. Click settings button on any widget
- **Expected**:
  - Popup appears centered on widget
  - Backdrop is visible
  - Popup contains width/height controls
  - Delete and close buttons are visible
  - Popup has correct z-index (1000)

### Test Case 3.2: Popup Positioning

- **Objective**: Verify popup positions correctly
- **Steps**:
  1. Open settings popup on different widgets
  2. Test widgets at different positions (top, middle, bottom, left, right)
- **Expected**:
  - Popup centers on widget
  - Popup stays within viewport bounds
  - Popup doesn't overflow screen edges

### Test Case 3.3: Width Control (1-4 units)

- **Objective**: Test width adjustment via pill buttons
- **Steps**:
  1. Open settings popup
  2. Click width buttons (1, 2, 3, 4)
  3. Observe widget size changes
- **Expected**:
  - Active button is highlighted
  - Widget width changes immediately
  - Other widgets reflow to accommodate
  - Smooth animation during resize
  - Layout updates correctly

### Test Case 3.4: Height Control (1-4 units)

- **Objective**: Test height adjustment via pill buttons
- **Steps**:
  1. Open settings popup
  2. Click height buttons (1, 2, 3, 4)
  3. Observe widget size changes
- **Expected**:
  - Active button is highlighted
  - Widget height changes immediately
  - Other widgets reflow to accommodate
  - Smooth animation during resize
  - Layout updates correctly

### Test Case 3.5: Delete Widget via Popup

- **Objective**: Test widget deletion from settings popup
- **Steps**:
  1. Open settings popup
  2. Click delete button (trash icon)
- **Expected**:
  - Widget animates out smoothly
  - Widget is removed from layout
  - Other widgets reflow to fill gap
  - Layout saves to localStorage
  - Widget doesn't reappear on refresh

### Test Case 3.6: Close Popup

- **Objective**: Test popup closing mechanisms
- **Steps**:
  1. Open settings popup
  2. Test closing via:
     - Close button (X)
     - Clicking backdrop
     - Pressing Escape key
- **Expected**:
  - Popup closes on all methods
  - Backdrop disappears
  - No popup elements remain in DOM

### Test Case 3.7: Multiple Popups

- **Objective**: Verify only one popup can be open at a time
- **Steps**:
  1. Open settings popup on widget A
  2. Open settings popup on widget B
- **Expected**:
  - First popup closes when second opens
  - Only one popup is visible at a time

---

## 4. Drag and Drop

### Test Case 4.1: Drag Widget to New Position

- **Objective**: Test widget repositioning via drag
- **Steps**:
  1. Enter edit mode
  2. Drag a widget to a new position
  3. Drop the widget
- **Expected**:
  - Widget moves smoothly during drag
  - Widget drops in new position
  - Other widgets reflow to accommodate
  - Layout updates correctly
  - Position saves to localStorage

### Test Case 4.2: Drag Multiple Widgets

- **Objective**: Test dragging multiple widgets in sequence
- **Steps**:
  1. Drag widget A to new position
  2. Drag widget B to new position
  3. Drag widget C to new position
- **Expected**:
  - Each drag operation completes successfully
  - Layout updates after each drag
  - No widgets overlap
  - Final layout is valid

### Test Case 4.3: Drag Constraints

- **Objective**: Verify widgets can't be dragged outside grid
- **Steps**:
  1. Try to drag widget to invalid positions
- **Expected**:
  - Widgets stay within grid bounds
  - No widgets overlap
  - Grid layout remains valid

---

## 5. Widget Resize

### Test Case 5.1: Resize via Settings Popup

- **Objective**: Test discrete size changes (1-4 units)
- **Steps**:
  1. Open settings popup
  2. Change width from 1 to 4
  3. Change height from 1 to 4
  4. Change back to smaller sizes
- **Expected**:
  - Size changes apply immediately
  - Widget animates smoothly
  - Other widgets reflow correctly
  - No layout collisions
  - Size constraints enforced (1-4)

### Test Case 5.2: Resize via Drag Handles

- **Objective**: Test continuous resize via corner/edge handles
- **Steps**:
  1. Enter edit mode
  2. Drag resize handles (corners and edges)
- **Expected**:
  - Widget resizes smoothly
  - Size constrained to 1-4 units
  - Other widgets reflow
  - Layout updates correctly

### Test Case 5.3: Maximum Size (4x4)

- **Objective**: Test widget at maximum size
- **Steps**:
  1. Resize widget to 4x4
- **Expected**:
  - Widget reaches maximum size
  - Cannot exceed 4 units
  - Layout remains valid
  - Other widgets adjust

### Test Case 5.4: Minimum Size (1x1)

- **Objective**: Test widget at minimum size
- **Steps**:
  1. Resize widget to 1x1
- **Expected**:
  - Widget reaches minimum size
  - Cannot go below 1 unit
  - Content remains visible
  - Layout remains valid

---

## 6. Responsive Design

### Test Case 6.1: Mobile View (< 768px)

- **Objective**: Test dashboard on mobile devices
- **Steps**:
  1. Set viewport to 375px width (iPhone)
  2. Test all functionality
- **Expected**:
  - Layout adapts to single column
  - Widgets stack vertically
  - Settings popup is accessible
  - Touch interactions work
  - No horizontal scrolling
  - Text remains readable

### Test Case 6.2: Tablet View (768px - 1024px)

- **Objective**: Test dashboard on tablets
- **Steps**:
  1. Set viewport to 768px width (iPad)
  2. Test all functionality
- **Expected**:
  - Layout uses 2-column grid
  - Widgets arrange appropriately
  - Settings popup positions correctly
  - All interactions work
  - Layout is responsive

### Test Case 6.3: Desktop View (> 1024px)

- **Objective**: Test dashboard on desktop
- **Steps**:
  1. Set viewport to 1920px width
  2. Test all functionality
- **Expected**:
  - Layout uses full grid (12 columns)
  - Widgets arrange in grid
  - All features accessible
  - Optimal use of space

### Test Case 6.4: Large Screen (> 1440px)

- **Objective**: Test dashboard on large monitors
- **Steps**:
  1. Set viewport to 2560px width
  2. Test all functionality
- **Expected**:
  - Layout expands appropriately
  - Widgets don't stretch too wide
  - Content remains centered
  - Optimal viewing experience

### Test Case 6.5: Viewport Resize

- **Objective**: Test dynamic viewport changes
- **Steps**:
  1. Start at desktop size
  2. Resize browser window to mobile
  3. Resize back to desktop
- **Expected**:
  - Layout adapts smoothly
  - Widgets reflow correctly
  - No layout breaks
  - All functionality remains accessible

---

## 7. Persistence & State Management

### Test Case 7.1: Save Layout to localStorage

- **Objective**: Verify layout saves automatically
- **Steps**:
  1. Customize widget layout
  2. Check localStorage
- **Expected**:
  - Layout data saved to localStorage
  - Key format: `workspace-state-{workspaceId}`
  - Data includes widget positions, sizes, order

### Test Case 7.2: Load Layout from localStorage

- **Objective**: Verify saved layout loads on refresh
- **Steps**:
  1. Customize layout
  2. Refresh page
- **Expected**:
  - Custom layout loads
  - Widget positions maintained
  - Widget sizes maintained
  - Widget order maintained

### Test Case 7.3: Multiple Workspaces

- **Objective**: Test multiple workspace states
- **Steps**:
  1. Create custom layout in workspace A
  2. Switch to workspace B
  3. Create different layout
  4. Switch back to workspace A
- **Expected**:
  - Each workspace maintains its own state
  - States don't interfere with each other
  - Correct layout loads for each workspace

---

## 8. Edge Cases & Stress Tests

### Test Case 8.1: Rapid Settings Popup Toggle

- **Objective**: Test rapid open/close of settings popup
- **Steps**:
  1. Rapidly click settings button multiple times
- **Expected**:
  - No errors occur
  - Popup state is correct
  - No memory leaks
  - UI remains responsive

### Test Case 8.2: Resize All Widgets to Maximum

- **Objective**: Test layout with all widgets at max size
- **Steps**:
  1. Resize all widgets to 4x4
- **Expected**:
  - Layout handles maximum sizes
  - Widgets don't overlap
  - Grid remains valid
  - Scroll appears if needed

### Test Case 8.3: Delete All Widgets

- **Objective**: Test deleting all widgets
- **Steps**:
  1. Delete all widgets one by one
- **Expected**:
  - Each deletion works correctly
  - Layout updates after each deletion
  - Empty state handled gracefully
  - Can add widgets back

### Test Case 8.4: Many Widgets (Stress Test)

- **Objective**: Test with maximum number of widgets
- **Steps**:
  1. Add many widgets (if add functionality exists)
- **Expected**:
  - Layout handles many widgets
  - Performance remains acceptable
  - No layout breaks
  - All widgets remain accessible

### Test Case 8.5: Invalid localStorage Data

- **Objective**: Test handling of corrupted localStorage
- **Steps**:
  1. Manually corrupt localStorage data
  2. Load dashboard
- **Expected**:
  - Dashboard loads default layout
  - No errors thrown
  - Invalid data is ignored
  - Fresh layout is created

---

## 9. Animation & Visual Feedback

### Test Case 9.1: Widget Movement Animation

- **Objective**: Verify smooth animations during drag
- **Steps**:
  1. Drag widget to new position
- **Expected**:
  - Smooth transition animation
  - No janky movements
  - FLIP technique working correctly

### Test Case 9.2: Widget Resize Animation

- **Objective**: Verify smooth animations during resize
- **Steps**:
  1. Resize widget via settings popup
- **Expected**:
  - Smooth size transition
  - Other widgets animate smoothly
  - No layout jumps

### Test Case 9.3: Widget Delete Animation

- **Objective**: Verify smooth exit animation
- **Steps**:
  1. Delete a widget
- **Expected**:
  - Widget animates out smoothly
  - Other widgets animate to fill gap
  - No abrupt disappearances

### Test Case 9.4: Popup Animation

- **Objective**: Verify popup appears/disappears smoothly
- **Steps**:
  1. Open and close settings popup
- **Expected**:
  - Popup animates in (popIn)
  - Popup animates out smoothly
  - Backdrop fades in/out

---

## 10. Accessibility & Usability

### Test Case 10.1: Keyboard Navigation

- **Objective**: Test keyboard accessibility
- **Steps**:
  1. Navigate using Tab key
  2. Activate buttons with Enter/Space
- **Expected**:
  - All interactive elements are focusable
  - Focus indicators are visible
  - Keyboard shortcuts work (Escape to close popup)

### Test Case 10.2: Screen Reader Compatibility

- **Objective**: Test with screen readers
- **Steps**:
  1. Use screen reader to navigate
- **Expected**:
  - Widgets have proper labels
  - Buttons have accessible names
  - State changes are announced

### Test Case 10.3: Touch Interactions

- **Objective**: Test on touch devices
- **Steps**:
  1. Test on touch device or emulator
- **Expected**:
  - Touch targets are adequate size (min 44x44px)
  - Drag and drop works with touch
  - Settings popup is accessible

---

## Test Execution Checklist

- [ ] All test cases documented
- [ ] Test environment set up
- [ ] TestSprite configured
- [ ] Baseline screenshots taken
- [ ] Tests executed
- [ ] Results documented
- [ ] Failures investigated
- [ ] Bugs reported
- [ ] Retests performed

---

## Known Issues & Notes

### Current Issues

- Settings popup rendering issue (recently fixed)
- ExpressionChangedAfterItHasBeenCheckedError (may be unrelated)

### Test Data

- Default widgets: 7 widgets expected
- Workspace ID: `fleetpulse-dashboard`
- Grid columns: 12 (desktop)
- Size constraints: 1-4 units for width/height

---

## Test Results Summary

_Results will be populated after test execution_

### Pass Rate

- Total Tests: TBD
- Passed: TBD
- Failed: TBD
- Pass Rate: TBD%

### Critical Issues

- None identified yet

### Minor Issues

- None identified yet

---

## Appendix

### Test Data Setup

```javascript
// Clear localStorage before testing
localStorage.clear();

// Set specific test data
localStorage.setItem('workspace-state-fleetpulse-dashboard', JSON.stringify({
  widgets: [...],
  layout: {...}
}));
```

### Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Device Testing

- iPhone (375px)
- iPad (768px)
- Desktop (1920px)
- Large Monitor (2560px)

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-12  
**Author**: TestSprite Automated Testing
