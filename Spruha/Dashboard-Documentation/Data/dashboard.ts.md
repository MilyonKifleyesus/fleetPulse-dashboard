# Dashboard Chart Data - Complete Documentation

## 📄 File Information

- **File Path**: `src/app/shared/data/dashboard.ts`
- **Purpose**: Chart configuration data for ApexCharts
- **Dependencies**: ApexCharts types
- **Used By**: `WorkspaceDashboardComponent`, `DashboardComponent`

## 🎯 Chart Options

### WHERE
**Location**: `src/app/shared/data/dashboard.ts`

### WHY
Central configuration file for chart options. Ensures:
- Consistent chart appearance
- Reusable chart configurations
- Easy customization

### WHEN
Used when initializing charts in dashboard components

### HOW
Exports chart configuration objects used by ApexCharts

### WHICH
**Concepts Used:**
- ApexCharts configuration objects
- TypeScript exports

**Documentation Links:**
- [ApexCharts Documentation](https://apexcharts.com/docs/)

---

## 📊 Chart Options Explained

### `ChartOptions` (Line Chart)
**WHERE**: Lines 4-108

**WHY**: Line chart configuration for Fleet Utilization

**WHEN**: Used in Fleet Utilization widget

**WHICH**: ApexCharts line chart configuration

### `ChartOptions1` (Radial Bar)
**WHERE**: Lines 109-175

**WHY**: Radial bar chart configuration for status indicators

**WHEN**: Used for status distribution display

**WHICH**: ApexCharts radial bar configuration

---

## 📚 Documentation Links

- [ApexCharts Documentation](https://apexcharts.com/docs/)
- [ApexCharts Angular](https://apexcharts.com/docs/angular-charts/)

---

**Next**: Explore [Routing Documentation](../Routing/README.md)
