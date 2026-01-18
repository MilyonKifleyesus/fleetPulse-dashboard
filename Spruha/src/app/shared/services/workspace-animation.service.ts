import { Injectable, ElementRef } from '@angular/core';
import { Position, Size } from '../models/workspace.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAnimationService {
  private readonly animationDuration = 300; // ms
  private readonly easingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';

  /**
   * Animate widget movement using FLIP technique
   * FLIP: First, Last, Invert, Play
   */
  animateWidgetMove(
    element: HTMLElement,
    from: Position,
    to: Position
  ): void {
    if (!element) return;

    // Get initial position
    const first = element.getBoundingClientRect();

    // Apply final position (this will be done by CSS Grid, but we need to measure)
    // For now, we'll use transform-based animation
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    // Set initial transform
    element.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
    element.style.transition = 'none';

    // Force reflow
    element.offsetHeight;

    // Animate to final position
    requestAnimationFrame(() => {
      element.style.transition = `transform ${this.animationDuration}ms ${this.easingFunction}`;
      element.style.transform = 'translate(0, 0)';

      // Clean up after animation
      setTimeout(() => {
        element.style.transform = '';
        element.style.transition = '';
      }, this.animationDuration);
    });
  }

  /**
   * Animate widget resize
   */
  animateResize(
    element: HTMLElement,
    from: Size,
    to: Size
  ): void {
    if (!element) return;

    // Use CSS transitions for smooth resize
    element.style.transition = `width ${this.animationDuration}ms ${this.easingFunction}, height ${this.animationDuration}ms ${this.easingFunction}`;
    
    // The actual size change will be handled by CSS Grid
    // This just ensures smooth transition
    requestAnimationFrame(() => {
      // Clean up after animation
      setTimeout(() => {
        element.style.transition = '';
      }, this.animationDuration);
    });
  }

  /**
   * Animate layout shift when widgets are added/removed/resized using FLIP technique
   * FLIP: First, Last, Invert, Play
   */
  animateLayoutShift(container: HTMLElement): void {
    if (!container) return;

    const widgets = container.querySelectorAll('[data-widget-id]');
    const firstPositions = new Map<string, DOMRect>();
    
    // FIRST: Record initial positions
    widgets.forEach((widget) => {
      const element = widget as HTMLElement;
      const widgetId = element.getAttribute('data-widget-id');
      if (widgetId) {
        firstPositions.set(widgetId, element.getBoundingClientRect());
      }
    });

    // Force reflow to ensure positions are recorded
    container.offsetHeight;

    // LAST: Let CSS Grid apply new positions (happens automatically)
    // We need to wait for the next frame to measure new positions
    
    requestAnimationFrame(() => {
      widgets.forEach((widget) => {
        const element = widget as HTMLElement;
        const widgetId = element.getAttribute('data-widget-id');
        if (!widgetId) return;

        const first = firstPositions.get(widgetId);
        if (!first) return;

        // LAST: Get new position
        const last = element.getBoundingClientRect();

        // INVERT: Calculate the difference
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;

        // Only animate if there's actual movement
        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
          return;
        }

        // INVERT: Apply transform to move element back to first position
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        element.style.transition = 'none';
        element.style.willChange = 'transform';

        // Force reflow
        element.offsetHeight;

        // PLAY: Animate to final position (0,0)
        requestAnimationFrame(() => {
          element.style.transition = `transform ${this.animationDuration}ms ${this.easingFunction}`;
          element.style.transform = 'translate(0, 0)';

          // Clean up after animation
          setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
            element.style.willChange = '';
          }, this.animationDuration);
        });
      });
    });
  }

  /**
   * Animate size change for a specific widget
   */
  animateSizeChange(element: HTMLElement): void {
    if (!element) return;

    // Record initial size
    const first = element.getBoundingClientRect();

    // Force reflow
    element.offsetHeight;

    // Let CSS Grid apply new size
    requestAnimationFrame(() => {
      const last = element.getBoundingClientRect();
      const deltaWidth = first.width - last.width;
      const deltaHeight = first.height - last.height;

      // Only animate if there's actual size change
      if (Math.abs(deltaWidth) < 1 && Math.abs(deltaHeight) < 1) {
        return;
      }

      // Safety check: avoid division by zero or invalid dimensions
      const safeWidth = last.width > 0 && isFinite(last.width) ? last.width : first.width || 1;
      const safeHeight = last.height > 0 && isFinite(last.height) ? last.height : first.height || 1;

      // If both dimensions are zero, skip animation
      if (safeWidth === 0 && safeHeight === 0) {
        return;
      }

      // INVERT: Scale element back to first size
      const scaleX = safeWidth > 0 && isFinite(safeWidth) ? first.width / safeWidth : 1;
      const scaleY = safeHeight > 0 && isFinite(safeHeight) ? first.height / safeHeight : 1;
      
      element.style.transformOrigin = 'top left';
      element.style.transform = `scale(${scaleX}, ${scaleY})`;
      element.style.transition = 'none';
      element.style.willChange = 'transform';

      // Force reflow
      element.offsetHeight;

      // PLAY: Animate to final size
      requestAnimationFrame(() => {
        element.style.transition = `transform ${this.animationDuration}ms ${this.easingFunction}`;
        element.style.transform = 'scale(1, 1)';

        // Clean up after animation
        setTimeout(() => {
          element.style.transform = '';
          element.style.transition = '';
          element.style.willChange = '';
          element.style.transformOrigin = '';
        }, this.animationDuration);
      });
    });
  }

  /**
   * Add drag preview styling
   */
  addDragPreview(element: HTMLElement): void {
    if (!element) return;
    element.style.opacity = '0.5';
    element.style.transform = 'scale(1.05)';
    element.style.transition = 'opacity 150ms ease, transform 150ms ease';
    element.style.zIndex = '1000';
  }

  /**
   * Remove drag preview styling
   */
  removeDragPreview(element: HTMLElement): void {
    if (!element) return;
    element.style.opacity = '';
    element.style.transform = '';
    element.style.transition = '';
    element.style.zIndex = '';
  }

  /**
   * Animate widget appearance (when added)
   */
  animateWidgetIn(element: HTMLElement): void {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9)';
    element.style.transition = `opacity ${this.animationDuration}ms ${this.easingFunction}, transform ${this.animationDuration}ms ${this.easingFunction}`;

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';

      setTimeout(() => {
        element.style.transition = '';
      }, this.animationDuration);
    });
  }

  /**
   * Animate widget removal
   */
  animateWidgetOut(element: HTMLElement, callback: () => void): void {
    if (!element) {
      callback();
      return;
    }

    element.style.transition = `opacity ${this.animationDuration}ms ${this.easingFunction}, transform ${this.animationDuration}ms ${this.easingFunction}`;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9)';

    setTimeout(() => {
      callback();
    }, this.animationDuration);
  }
}
