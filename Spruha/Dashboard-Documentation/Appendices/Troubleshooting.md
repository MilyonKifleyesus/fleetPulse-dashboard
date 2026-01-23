# Troubleshooting - Common Issues

## 🔧 Common Issues and Solutions

### Widgets Not Displaying

**Problem**: Widgets not appearing in workspace

**WHERE**: WorkspaceComponent

**WHY**: Widgets not initialized or state not loaded

**WHEN**: On dashboard load

**HOW TO FIX**:
1. Check `widgets` array is populated
2. Verify `initializeDefaultWidgets()` is called
3. Check localStorage for saved state
4. Ensure `data-widget-id` matches widget ID

**WHICH**: State initialization issue

---

### Drag & Drop Not Working

**Problem**: Can't drag widgets

**WHERE**: WorkspaceComponent

**WHY**: Edit mode not enabled or CDK not imported

**WHEN**: In view mode

**HOW TO FIX**:
1. Press `Ctrl/Cmd + E` to enable edit mode
2. Check `WorkspaceModeService` is working
3. Verify `DragDropModule` is imported
4. Ensure `cdkDrag` directive is on widgets

**WHICH**: Edit mode or CDK import issue

---

### Layout Not Persisting

**Problem**: Widget positions reset after refresh

**WHERE**: WorkspaceStateService

**WHY**: State not saving to localStorage

**WHEN**: After page refresh

**HOW TO FIX**:
1. Check `saveWorkspaceState()` is called
2. Verify localStorage is enabled
3. Check for errors in console
4. Ensure state is valid JSON

**WHICH**: localStorage persistence issue

---

### Grid Not Responsive

**Problem**: Widgets don't wrap on resize

**WHERE**: GridLayoutService

**WHY**: Grid columns not recalculating

**WHEN**: On window resize

**HOW TO FIX**:
1. Check `ResizeObserver` is working
2. Verify `calculateLayout()` is called
3. Check `autoArrangeWidgets()` is working
4. Ensure grid-template-columns is dynamic

**WHICH**: Responsive calculation issue

---

## 📚 Related Documentation

- [Workspace Component](../Components/workspace/README.md)
- [Workspace State Service](../Services/workspace-state.service.md)
- [Grid Layout Service](../Services/grid-layout.service.md)

---

**Next**: Check [Documentation Links](./Links.md)
