export interface WidgetConfig {
  id: string;
  type: string;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  order: number;
  visible: boolean;
}

export interface DashboardLayout {
  version: string;
  widgets: WidgetConfig[];
}
