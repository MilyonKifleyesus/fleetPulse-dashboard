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
   * Animate layout shift when widgets are added/removed
   */
  animateLayoutShift(container: HTMLElement): void {
    if (!container) return;

    const widgets = container.querySelectorAll('[data-widget-id]');
    
    widgets.forEach((widget, index) => {
      const element = widget as HTMLElement;
      element.style.transition = `transform ${this.animationDuration}ms ${this.easingFunction}`;
      
      // Trigger reflow
      element.offsetHeight;
      
      // The actual position will be set by CSS Grid
      // This ensures smooth transition
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
