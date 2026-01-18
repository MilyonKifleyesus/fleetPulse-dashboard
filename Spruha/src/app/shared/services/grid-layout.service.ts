import { Injectable } from '@angular/core';
import { WorkspaceLayout, GridPosition } from '../models/workspace.interface';

@Injectable({
  providedIn: 'root',
})
export class GridLayoutService {
  private readonly defaultMinWidgetWidth = 200; // Based on minmax rule: each column is at least 200 pixels wide
  private readonly defaultGap = 16;

  /**
   * Calculate number of grid columns based on container width and minimum widget width
   */
  calculateGridColumns(
    containerWidth: number,
    minWidgetWidth: number = this.defaultMinWidgetWidth
  ): number {
    const gap = this.defaultGap;
    const padding = gap * 2; // Left and right padding
    const availableWidth = containerWidth - padding;
    const columns = Math.floor(availableWidth / (minWidgetWidth + gap));
    return Math.max(1, columns); // At least 1 column
  }

  /**
   * Calculate responsive breakpoint based on container width
   */
  getBreakpoint(containerWidth: number): string {
    if (containerWidth < 768) {
      return 'mobile';
    } else if (containerWidth < 1024) {
      return 'tablet';
    } else if (containerWidth < 1440) {
      return 'desktop';
    } else {
      return 'large-desktop';
    }
  }

  /**
   * Calculate optimal grid columns for breakpoint
   */
  getOptimalColumns(breakpoint: string): number {
    switch (breakpoint) {
      case 'mobile':
        return 1;
      case 'tablet':
        return 2;
      case 'desktop':
        return 4;
      case 'large-desktop':
        return 6;
      default:
        return 4;
    }
  }

  /**
   * Calculate grid layout configuration
   */
  calculateLayout(
    containerWidth: number,
    minWidgetWidth?: number
  ): WorkspaceLayout {
    const actualMinWidth = minWidgetWidth || this.defaultMinWidgetWidth;
    const breakpoint = this.getBreakpoint(containerWidth);
    const columns = this.calculateGridColumns(containerWidth, actualMinWidth);

    return {
      columns,
      gap: this.defaultGap,
      breakpoint,
      minWidgetWidth: actualMinWidth,
    };
  }

  /**
   * Check if a position is valid (within grid bounds)
   */
  isValidPosition(
    position: GridPosition,
    totalColumns: number,
    totalRows: number = 100
  ): boolean {
    return (
      position.column >= 1 &&
      position.column <= totalColumns &&
      position.column + position.columnSpan - 1 <= totalColumns &&
      position.row >= 1 &&
      position.row <= totalRows &&
      position.columnSpan >= 1 &&
      position.columnSpan <= 12 &&
      position.rowSpan >= 1 &&
      position.rowSpan <= 8
    );
  }

  /**
   * Find next available position for a widget
   * This ensures widgets wrap to new rows when they don't fit in current row
   *
   * Automatic Row Wrapping: If widget width increased so it no longer fits in current row,
   * the grid logic automatically wraps the widget to the next row.
   * Based on "minmax" rule: each column is at least 200 pixels wide (defaultMinWidgetWidth).
   */
  findNextAvailablePosition(
    existingPositions: GridPosition[],
    widgetSize: { columnSpan: number; rowSpan: number },
    totalColumns: number
  ): GridPosition | null {
    // Start from top-left, row by row
    // This ensures widgets wrap to new rows when screen gets narrow or widget doesn't fit
    // Automatic row wrapping happens here - if widget doesn't fit in current row, continue to next row
    for (let row = 1; row <= 50; row++) {
      for (
        let col = 1;
        col <= totalColumns - widgetSize.columnSpan + 1;
        col++
      ) {
        const candidate: GridPosition = {
          column: col,
          row: row,
          columnSpan: widgetSize.columnSpan,
          rowSpan: widgetSize.rowSpan,
        };

        // Check if this position is available (no collision)
        if (!this.hasCollision(candidate, existingPositions)) {
          return candidate;
        }
      }
      // If no position found in this row, continue to next row (auto-wrap)
    }
    return null;
  }

  /**
   * Check if a position collides with existing positions
   */
  hasCollision(
    position: GridPosition,
    existingPositions: GridPosition[]
  ): boolean {
    return existingPositions.some((existing) => {
      const posEndCol = position.column + position.columnSpan - 1;
      const posEndRow = position.row + position.rowSpan - 1;
      const existingEndCol = existing.column + existing.columnSpan - 1;
      const existingEndRow = existing.row + existing.rowSpan - 1;

      return !(
        position.column > existingEndCol ||
        posEndCol < existing.column ||
        position.row > existingEndRow ||
        posEndRow < existing.row
      );
    });
  }

  /**
   * Auto-arrange widgets in grid (compact layout)
   * This fills gaps and ensures widgets wrap to new rows when they don't fit
   * Used when screen gets narrow or when widgets are resized/deleted
   */
  autoArrangeWidgets(
    widgets: Array<{
      id: string;
      size: { columnSpan: number; rowSpan: number };
    }>,
    totalColumns: number
  ): Map<string, GridPosition> {
    const positions = new Map<string, GridPosition>();
    const existingPositions: GridPosition[] = [];

    // Process widgets in order, finding next available position
    // This automatically wraps widgets to new rows when they don't fit
    for (const widget of widgets) {
      const position = this.findNextAvailablePosition(
        existingPositions,
        widget.size,
        totalColumns
      );

      if (position) {
        positions.set(widget.id, position);
        existingPositions.push(position);
      }
    }

    return positions;
  }

  /**
   * Convert grid position to CSS grid-area value
   */
  toGridArea(position: GridPosition): string {
    return `${position.row} / ${position.column} / ${
      position.row + position.rowSpan
    } / ${position.column + position.columnSpan}`;
  }

  /**
   * Generate CSS grid template columns
   */
  generateGridTemplateColumns(columns: number, gap: number): string {
    return `repeat(${columns}, 1fr)`;
  }
}
