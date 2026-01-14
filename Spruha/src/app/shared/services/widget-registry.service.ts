import { Injectable } from '@angular/core';
import { WidgetType } from '../models/workspace.interface';

export interface WidgetConfig {
  type: WidgetType;
  name: string;
  description: string;
  icon?: string;
  defaultSize: {
    columnSpan: number;
    rowSpan: number;
  };
  minSize: {
    columnSpan: number;
    rowSpan: number;
  };
  maxSize: {
    columnSpan: number;
    rowSpan: number;
  };
  component?: any; // Component class reference
}

@Injectable({
  providedIn: 'root'
})
export class WidgetRegistryService {
  private widgets = new Map<WidgetType, WidgetConfig>();

  constructor() {
    this.registerDefaultWidgets();
  }

  /**
   * Register a widget type
   */
  registerWidget(config: WidgetConfig): void {
    this.widgets.set(config.type, config);
  }

  /**
   * Get widget configuration by type
   */
  getWidgetConfig(type: WidgetType): WidgetConfig | undefined {
    return this.widgets.get(type);
  }

  /**
   * Get all registered widget types
   */
  getAllWidgetTypes(): WidgetType[] {
    return Array.from(this.widgets.keys());
  }

  /**
   * Get all widget configurations
   */
  getAllWidgetConfigs(): WidgetConfig[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Check if widget type is registered
   */
  isRegistered(type: WidgetType): boolean {
    return this.widgets.has(type);
  }

  /**
   * Register default widget types
   */
  private registerDefaultWidgets(): void {
    // Metric Card Widget
    this.registerWidget({
      type: 'metric-card',
      name: 'Metric Card',
      description: 'Display a single metric with value and trend',
      icon: 'fe fe-bar-chart-2',
      defaultSize: { columnSpan: 3, rowSpan: 2 },
      minSize: { columnSpan: 2, rowSpan: 2 },
      maxSize: { columnSpan: 6, rowSpan: 3 }
    });

    // Chart Widget
    this.registerWidget({
      type: 'chart-widget',
      name: 'Chart',
      description: 'Display data visualization charts',
      icon: 'fe fe-trending-up',
      defaultSize: { columnSpan: 6, rowSpan: 4 },
      minSize: { columnSpan: 4, rowSpan: 3 },
      maxSize: { columnSpan: 12, rowSpan: 6 }
    });

    // Table Widget
    this.registerWidget({
      type: 'table-widget',
      name: 'Data Table',
      description: 'Display tabular data',
      icon: 'fe fe-grid',
      defaultSize: { columnSpan: 6, rowSpan: 5 },
      minSize: { columnSpan: 4, rowSpan: 4 },
      maxSize: { columnSpan: 12, rowSpan: 8 }
    });

    // Activity Feed Widget
    this.registerWidget({
      type: 'activity-feed',
      name: 'Activity Feed',
      description: 'Display recent activities and events',
      icon: 'fe fe-activity',
      defaultSize: { columnSpan: 4, rowSpan: 5 },
      minSize: { columnSpan: 3, rowSpan: 4 },
      maxSize: { columnSpan: 6, rowSpan: 8 }
    });

    // Status Indicator Widget
    this.registerWidget({
      type: 'status-indicator',
      name: 'Status Indicator',
      description: 'Display status information with visual indicators',
      icon: 'fe fe-check-circle',
      defaultSize: { columnSpan: 3, rowSpan: 3 },
      minSize: { columnSpan: 2, rowSpan: 2 },
      maxSize: { columnSpan: 6, rowSpan: 4 }
    });
  }
}
