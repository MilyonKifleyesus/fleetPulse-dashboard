import { ApexOptions } from 'apexcharts';

export interface FacilityDashData {
  id?: number;
  name?: string;
  value?: number; // utilization percentage or efficiency score
  img?: string;
}

export const facilityDashboard: FacilityDashData[] = [
  {
    id: 1,
    name: 'Manufacturing Plant A',
    value: 87.5,
    img: './assets/images/svgs/crypto-currencies/btc.svg',
  },
  {
    id: 2,
    name: 'Warehouse B',
    value: 92.3,
    img: './assets/images/svgs/crypto-currencies/eth.svg',
  },
  {
    id: 3,
    name: 'Office Complex C',
    value: 78.9,
    img: './assets/images/svgs/crypto-currencies/xrp.svg',
  },
  {
    id: 4,
    name: 'Manufacturing Plant D',
    value: 85.2,
    img: './assets/images/svgs/crypto-currencies/ltc.svg',
  },
  {
    id: 5,
    name: 'Warehouse E',
    value: 90.1,
    img: './assets/images/svgs/crypto-currencies/dash.svg',
  },
  {
    id: 6,
    name: 'Office Complex F',
    value: 82.7,
    img: './assets/images/svgs/crypto-currencies/xmr.svg',
  },
  {
    id: 7,
    name: 'Manufacturing Plant G',
    value: 88.4,
    img: './assets/images/svgs/crypto-currencies/neo.svg',
  },
  {
    id: 8,
    name: 'Warehouse H',
    value: 91.6,
    img: './assets/images/svgs/crypto-currencies/steem.svg',
  },
];

// Facility Performance Chart - Line/Area Chart (replaces candlestick)
export let apexFacilityData: ApexOptions = {
  series: [
    {
      name: 'Utilization',
      data: [
        75, 78, 82, 80, 85, 83, 87, 85, 88, 86, 90, 88, 92, 90, 87, 89, 85, 88,
        90, 88, 87, 89, 85, 88, 90, 88, 87, 89, 85, 88, 90, 88, 87, 89, 85, 88,
        90, 88, 87, 89, 85, 88, 90, 88, 87, 89, 85, 88, 90, 88,
      ],
    },
  ],
  chart: {
    type: 'area',
    height: 360,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: ['#5ad85a'],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100],
      colorStops: [
        {
          offset: 0,
          color: '#5ad85a',
          opacity: 0.7,
        },
        {
          offset: 100,
          color: '#6ee755',
          opacity: 0.3,
        },
      ],
    },
  },
  colors: ['#5ad85a'],
  title: {
    align: 'left',
  },
  xaxis: {
    type: 'category',
    categories: Array.from({ length: 50 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (50 - i));
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }),
  },
  yaxis: {
    min: 0,
    max: 100,
    tooltip: {
      enabled: false,
    },
    labels: {
      formatter: function (val: number) {
        return val.toFixed(0) + '%';
      },
    },
  },
  grid: {
    show: true,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val.toFixed(1) + '%';
      },
    },
  },
};

//Donut Chart - Facility Allocation by Category
export let donutApexData: ApexOptions = {
  series: [45, 30, 25], // Manufacturing, Warehouse, Office percentages
  labels: ['Manufacturing', 'Warehouse', 'Office'],
  chart: {
    height: 192,
    type: 'donut',
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    colors: ['#fff'],
    width: 0,
    dashArray: 0,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: '75%',
        background: 'transparent',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '20px',
            color: '#495057',
            offsetY: -4,
          },
          value: {
            show: true,
            fontSize: '18px',
            color: undefined,
            offsetY: 8,
            formatter: function (val: string) {
              return val + '%';
            },
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total',
            fontSize: '22px',
            fontWeight: 600,
            color: '#495057',
          },
        },
      },
    },
  },
  colors: ['#5ad85a', '#6ee755', 'rgba(110, 231, 85, 0.5)'],
};

//Donut Chart - Facility Status Breakdown
export let donutApexProfile: ApexOptions = {
  series: [60, 25, 10, 5], // Operational, Maintenance, Scheduled Downtime, Critical Issue
  labels: [
    'Operational',
    'Maintenance',
    'Scheduled Downtime',
    'Critical Issue',
  ],
  chart: {
    height: 80,
    width: 50,
    type: 'donut',
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'round',
    colors: ['#fff'],
    width: 0,
    dashArray: 0,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: '80%',
        background: 'transparent',
        labels: {
          show: false,
          name: {
            show: true,
            fontSize: '20px',
            color: '#495057',
            offsetY: -4,
          },
          value: {
            show: true,
            fontSize: '18px',
            color: undefined,
            offsetY: 8,
            formatter: function (val: string) {
              return val + '%';
            },
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total',
            fontSize: '22px',
            fontWeight: 600,
            color: '#495057',
          },
        },
      },
    },
  },
  colors: ['#6ee755', '#eab308', 'rgba(110, 231, 85, 0.3)', '#ef4444'],
};

//Facility Metric Line Chart
export let lineApexChart: ApexOptions = {
  chart: {
    type: 'line',
    height: 115,
    sparkline: {
      enabled: true,
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 0,
      left: 0,
      blur: 3,
      color: '#000',
      opacity: 0.1,
    },
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 3,
    dashArray: 0,
  },
  fill: {
    type: 'solid',
  },
  grid: {
    show: false,
  },
  series: [
    {
      name: 'Utilization',
      data: [83, 86, 85, 82, 85, 87, 86, 88],
    },
  ],
  yaxis: {
    min: 0,
    show: false,
    axisBorder: {
      show: false,
    },
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
  },
  colors: ['#5ad85a'],
};

//Sparkline Charts for Facility Table
export let apexSparkline: ApexOptions = {
  series: [
    {
      data: [
        75, 78, 82, 80, 85, 83, 87, 85, 88, 86, 90, 88, 92, 90, 87, 89, 85, 88,
        90, 88, 87, 89, 85, 88,
      ],
    },
  ],
  chart: {
    type: 'area',
    width: 120,
    height: 30,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#5ad85a'],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  yaxis: {
    min: 0,
  },
  colors: ['#5ad85a'],
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function () {
          return '';
        },
      },
    },
    marker: {
      show: false,
    },
  },
};

export let apexSparkline1: ApexOptions = {
  series: [
    {
      data: [
        72, 75, 78, 76, 80, 78, 82, 80, 83, 81, 85, 83, 87, 85, 82, 84, 80, 83,
        85, 83, 82, 84, 80, 83,
      ],
    },
  ],
  chart: {
    type: 'area',
    width: 120,
    height: 30,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#ef4444'],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  colors: ['#ef4444'],
};

export let apexSparkline2: ApexOptions = {
  series: [
    {
      data: [
        80, 83, 85, 82, 88, 85, 90, 88, 92, 90, 87, 89, 85, 88, 90, 88, 87, 89,
        85, 88, 90, 88, 87, 89,
      ],
    },
  ],
  chart: {
    type: 'area',
    width: 120,
    height: 30,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#5ad85a'],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  colors: ['#5ad85a'],
};

export let apexSparkline3: ApexOptions = {
  series: [
    {
      data: [
        78, 81, 84, 80, 86, 83, 88, 86, 89, 87, 84, 86, 82, 85, 87, 85, 84, 86,
        82, 85, 87, 85, 84, 86,
      ],
    },
  ],
  chart: {
    type: 'area',
    width: 120,
    height: 30,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#eab308'],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  colors: ['#eab308'],
};

export let apexSparkline4: ApexOptions = {
  series: [
    {
      data: [
        85, 88, 86, 90, 87, 91, 89, 93, 91, 88, 90, 87, 93, 90, 88, 90, 87, 93,
        90, 88, 90, 87, 93, 90,
      ],
    },
  ],
  chart: {
    type: 'area',
    width: 120,
    height: 30,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'straight',
    width: 2,
    colors: ['#6ee755'],
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  colors: ['#6ee755'],
};
