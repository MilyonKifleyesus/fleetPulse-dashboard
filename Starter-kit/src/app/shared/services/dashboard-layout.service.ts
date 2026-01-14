import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  DashboardLayout,
  WidgetConfig,
} from '../models/dashboard-widget.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardLayoutService {
  private readonly localStorageKey = 'dashboard-layout';
  private layoutSubject = new BehaviorSubject<DashboardLayout | null>(null);
  public layout$: Observable<DashboardLayout | null> =
    this.layoutSubject.asObservable();

  constructor() {
    const savedLayout = this.loadLayout();
    if (savedLayout) {
      this.layoutSubject.next(savedLayout);
    } else {
      const defaultLayout = this.getDefaultLayout();
      this.layoutSubject.next(defaultLayout);
      this.saveLayout(defaultLayout);
    }
  }

  getLayout(): DashboardLayout {
    const current = this.layoutSubject.getValue();
    return current || this.getDefaultLayout();
  }

  saveLayout(layout: DashboardLayout): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(layout));
      this.layoutSubject.next(layout);
    } catch (error) {
      console.error('Error saving dashboard layout to local storage:', error);
    }
  }

  loadLayout(): DashboardLayout | null {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(
        'Error loading dashboard layout from local storage:',
        error
      );
    }
    return null;
  }

  resetLayout(): void {
    const defaultLayout = this.getDefaultLayout();
    this.saveLayout(defaultLayout);
  }

  updateWidgetPosition(
    widgetId: string,
    gridColumnStart: number,
    gridColumnEnd: number,
    gridRowStart: number,
    gridRowEnd: number
  ): void {
    const layout = this.getLayout();
    const widget = layout.widgets.find((w) => w.id === widgetId);
    if (widget) {
      widget.gridColumnStart = gridColumnStart;
      widget.gridColumnEnd = gridColumnEnd;
      widget.gridRowStart = gridRowStart;
      widget.gridRowEnd = gridRowEnd;
      this.saveLayout(layout);
    }
  }

  updateWidgetSize(
    widgetId: string,
    gridColumnStart: number,
    gridColumnEnd: number,
    gridRowStart: number,
    gridRowEnd: number
  ): void {
    this.updateWidgetPosition(
      widgetId,
      gridColumnStart,
      gridColumnEnd,
      gridRowStart,
      gridRowEnd
    );
  }

  reorderWidgets(widgetIds: string[]): void {
    const layout = this.getLayout();
    const widgetsMap = new Map(layout.widgets.map((w) => [w.id, w]));
    const reorderedWidgets = widgetIds
      .map((id) => widgetsMap.get(id))
      .filter((w) => w !== undefined) as WidgetConfig[];

    reorderedWidgets.forEach((widget, index) => {
      widget.order = index;
    });

    layout.widgets = reorderedWidgets;
    this.saveLayout(layout);
  }

  getDefaultLayout(): DashboardLayout {
    return {
      version: '1.0',
      widgets: [
        {
          id: 'banner',
          type: 'banner',
          gridColumnStart: 1,
          gridColumnEnd: 13,
          gridRowStart: 1,
          gridRowEnd: 2,
          order: 0,
          visible: true,
        },
        {
          id: 'metric-revenue',
          type: 'metric',
          gridColumnStart: 1,
          gridColumnEnd: 5,
          gridRowStart: 2,
          gridRowEnd: 3,
          order: 1,
          visible: true,
        },
        {
          id: 'metric-employees',
          type: 'metric',
          gridColumnStart: 5,
          gridColumnEnd: 9,
          gridRowStart: 2,
          gridRowEnd: 3,
          order: 2,
          visible: true,
        },
        {
          id: 'metric-expenses',
          type: 'metric',
          gridColumnStart: 9,
          gridColumnEnd: 13,
          gridRowStart: 2,
          gridRowEnd: 3,
          order: 3,
          visible: true,
        },
        {
          id: 'project-budget-chart',
          type: 'chart',
          gridColumnStart: 1,
          gridColumnEnd: 13,
          gridRowStart: 3,
          gridRowEnd: 4,
          order: 4,
          visible: true,
        },
        {
          id: 'today-tasks-chart',
          type: 'chart',
          gridColumnStart: 1,
          gridColumnEnd: 7,
          gridRowStart: 4,
          gridRowEnd: 5,
          order: 5,
          visible: true,
        },
        {
          id: 'top-inquiries',
          type: 'card',
          gridColumnStart: 7,
          gridColumnEnd: 13,
          gridRowStart: 4,
          gridRowEnd: 5,
          order: 6,
          visible: true,
        },
        {
          id: 'tasks-table',
          type: 'table',
          gridColumnStart: 1,
          gridColumnEnd: 13,
          gridRowStart: 5,
          gridRowEnd: 6,
          order: 7,
          visible: true,
        },
        {
          id: 'recent-transactions',
          type: 'table',
          gridColumnStart: 1,
          gridColumnEnd: 13,
          gridRowStart: 6,
          gridRowEnd: 7,
          order: 8,
          visible: true,
        },
        {
          id: 'project-launch',
          type: 'card',
          gridColumnStart: 1,
          gridColumnEnd: 13,
          gridRowStart: 7,
          gridRowEnd: 8,
          order: 9,
          visible: true,
        },
        {
          id: 'ongoing-projects-1',
          type: 'chart',
          gridColumnStart: 1,
          gridColumnEnd: 7,
          gridRowStart: 8,
          gridRowEnd: 9,
          order: 10,
          visible: true,
        },
        {
          id: 'ongoing-projects-2',
          type: 'chart',
          gridColumnStart: 7,
          gridColumnEnd: 13,
          gridRowStart: 8,
          gridRowEnd: 9,
          order: 11,
          visible: true,
        },
        {
          id: 'website-design',
          type: 'chart',
          gridColumnStart: 1,
          gridColumnEnd: 13,
          gridRowStart: 9,
          gridRowEnd: 10,
          order: 12,
          visible: true,
        },
      ],
    };
  }

  // Future API sync methods (stubbed for later implementation)
  async syncWithServer(layout: DashboardLayout): Promise<void> {
    // TODO: Implement API call to save layout to backend
    // Example:
    // return this.http.post('/api/dashboard/layout', layout).toPromise();
    console.log('syncWithServer: Not yet implemented', layout);
  }

  async loadFromServer(): Promise<DashboardLayout | null> {
    // TODO: Implement API call to load layout from backend
    // Example:
    // return this.http.get<DashboardLayout>('/api/dashboard/layout').toPromise();
    console.log('loadFromServer: Not yet implemented');
    return null;
  }
}
