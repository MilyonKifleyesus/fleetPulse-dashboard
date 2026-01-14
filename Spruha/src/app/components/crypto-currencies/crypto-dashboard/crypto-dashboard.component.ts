import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import * as chartData from "../../../shared/data/facilities-dash";
import { facilityDashboard } from '../../../shared/data/facilities-dash';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SharedModule } from '../../../shared/shared.module';
import { fromEvent } from 'rxjs';
import { SpkApexChartsComponent } from "../../../@spk/reusable-charts/spk-apex-charts/spk-apex-charts.component";
import { SpkReusableTablesComponent } from '../../../@spk/reusable-tables/spk-reusable-tables/spk-reusable-tables.component';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element';
register();

interface FacilityPriceItem {
  name: string;
  utilization: string;
  capacity: string;
  change: string;
  changeClass: string;
  arrowClass: string;
}

interface FacilityDataItem {
  id: number;
  name: string;
  type: string;
  utilization: string;
  change: string;
  changeClass: string;
  action: string;
  actionClass: string;
  chartId: string;
  icon: string;
}

interface FacilityActivity {
  icon: string;
  title: string;
  description: string;
  amount: string;
  amountClass: string;
  arrowClass: string;
  liClass: string;
}

interface CarouselItem {
  id: number;
  src: string;
  name: string;
  value: number;
}

@Component({
  selector: 'app-crypto-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, CarouselModule, SharedModule, SpkApexChartsComponent,SpkReusableTablesComponent,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './crypto-dashboard.component.html',
  styleUrl: './crypto-dashboard.component.scss'
})
export class CryptoDashboardComponent {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  facilityDashdata = facilityDashboard;
  
  facilityPrices: FacilityPriceItem[] = [
    {
      name: 'Manufacturing Plant A',
      utilization: '87.5%',
      capacity: '95,000 sq ft',
      change: '+2.3%',
      changeClass: 'text-success',
      arrowClass: 'fa-arrow-up',
    },
    {
      name: 'Warehouse B',
      utilization: '92.3%',
      capacity: '120,000 sq ft',
      change: '+1.5%',
      changeClass: 'text-success',
      arrowClass: 'fa-arrow-up',
    },
    {
      name: 'Office Complex C',
      utilization: '78.9%',
      capacity: '45,000 sq ft',
      change: '-1.2%',
      changeClass: 'text-danger',
      arrowClass: 'fa-arrow-down',
    },
  ];
  
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    navSpeed: 700,
    autoplayHoverPause: true,
    center: true,
    margin: 20,
    responsive: {
      0: {
        items: 1,
        nav: false
      },
      320: {
        items: 1,
        nav: false
      },
      500: {
        items: 2,
        nav: false
      },
      700: {
        items: 3,
        nav: false
      },
      1400: {
        items: 5,
        nav: false
      },
    }
  }
  
  constructor(private elementRef :ElementRef) {
  }
  
  ngAfterViewInit() {
    const swiperEl = this.swiperContainer.nativeElement;

    Object.assign(swiperEl, {
      slidesPerView: 5,
      spaceBetween: 10,
      loop: true,
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        500: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        700: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1400: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
    }
    );
  }

  ngOnInit(): void {
    const ltr = this.elementRef.nativeElement.querySelectorAll('#switcher-ltr');
    const rtl = this.elementRef.nativeElement.querySelectorAll('#switcher-rtl');

    fromEvent(ltr, 'click').subscribe(() => {
      this.customOptions = { ...this.customOptions, rtl: false };
    });

    fromEvent(rtl, 'click').subscribe(() => {
      this.customOptions = { ...this.customOptions, rtl: true, autoplay: true };
    });
  }

  //DonutChart using Apex
  public donutApexData = chartData.donutApexData;
  //DonutChartProfile using Apex
  public donutApexProfile = chartData.donutApexProfile;

  //Apex Chart - Facility Performance
  public apexData = chartData.apexFacilityData

  //Facility metric line using ApexCharts
  public lineApexChart = chartData.lineApexChart

  //Sparkline using ApexCharts
  public apexSparkline = chartData.apexSparkline;
  public apexSparkline1 = chartData.apexSparkline1;
  public apexSparkline2 = chartData.apexSparkline2;
  public apexSparkline3 = chartData.apexSparkline3;
  public apexSparkline4 = chartData.apexSparkline4;

  owlCarouselData: CarouselItem[] = [
    { id: 1, src: './assets/images/svgs/crypto-currencies/btc.svg', name: 'Manufacturing Plant A', value: 87.5 },
    { id: 2, src: './assets/images/svgs/crypto-currencies/eth.svg', name: 'Warehouse B', value: 92.3 },
    { id: 3, src: './assets/images/svgs/crypto-currencies/xrp.svg', name: 'Office Complex C', value: 78.9 },
    { id: 4, src: './assets/images/svgs/crypto-currencies/ltc.svg', name: 'Manufacturing Plant D', value: 85.2 },
    { id: 5, src: './assets/images/svgs/crypto-currencies/dash.svg', name: 'Warehouse E', value: 90.1 },
    { id: 6, src: './assets/images/svgs/crypto-currencies/xmr.svg', name: 'Office Complex F', value: 82.7 },
    { id: 7, src: './assets/images/svgs/crypto-currencies/neo.svg', name: 'Manufacturing Plant G', value: 88.4 },
    { id: 8, src: './assets/images/svgs/crypto-currencies/steem.svg', name: 'Warehouse H', value: 91.6 },
  ]
  
  activityColumns = [
    {header:'#',field:'#',tableHeadColumn:'wd-lg-20p'},
    {header:'FACILITY',field:'FACILITY',tableHeadColumn:'wd-lg-20p'},
    {header:'UTILIZATION',field:'UTILIZATION',tableHeadColumn:'wd-lg-20p'},
    {header:'CHANGE',field:'CHANGE',tableHeadColumn:'wd-lg-20p'},
    {header:'TREND',field:'TREND',tableHeadColumn:'wd-lg-20p'},
    {header:'STATUS',field:'STATUS',tableHeadColumn:'wd-lg-20p'},
  ]
  
  facilityData: FacilityDataItem[] = [
    {
      id: 1,
      name: 'Manufacturing Plant A',
      type: 'MFG',
      utilization: '87.5%',
      change: '+2.3%',
      changeClass: 'text-fleet-primary',
      action: 'OPERATIONAL',
      actionClass: 'text-fleet-primary',
      chartId: 'sparkline11',
      icon: 'cf-btc'
    },
    {
      id: 2,
      name: 'Warehouse B',
      type: 'WH',
      utilization: '92.3%',
      change: '-1.1%',
      changeClass: 'text-fleet-warning',
      action: 'MAINTENANCE',
      actionClass: 'text-fleet-warning',
      chartId: 'sparkline12',
      icon: 'cf-eth'
    },
    {
      id: 3,
      name: 'Office Complex C',
      type: 'OF',
      utilization: '78.9%',
      change: '+0.5%',
      changeClass: 'text-fleet-primary',
      action: 'OPERATIONAL',
      actionClass: 'text-fleet-primary',
      chartId: 'sparkline13',
      icon: 'cf-xrp'
    },
    {
      id: 4,
      name: 'Manufacturing Plant D',
      type: 'MFG',
      utilization: '85.2%',
      change: '-3.2%',
      changeClass: 'text-fleet-critical',
      action: 'CRITICAL ISSUE',
      actionClass: 'text-fleet-critical',
      chartId: 'sparkline14',
      icon: 'cf-ltc'
    }
  ];
  
  facilityActivities: FacilityActivity[] = [
    {
      icon: 'cf-btc',
      title: 'Maintenance Completed',
      description: 'Manufacturing Plant A - Routine inspection',
      amount: '+ 87.5%',
      amountClass: 'text-success',
      arrowClass: 'fe fe-arrow-up',
      liClass:'mt-0 mb-0'
    },
    {
      icon: 'cf-ltc',
      title: 'Status Changed',
      description: 'Warehouse B - Entered maintenance mode',
      amount: '- 8.2%',
      amountClass: 'text-warning',
      arrowClass: 'fe fe-arrow-down',
      liClass:'mb-0'
    },
    {
      icon: 'cf-dash',
      title: 'Capacity Alert',
      description: 'Office Complex C - High utilization warning',
      amount: '- 5.1%',
      amountClass: 'text-warning',
      arrowClass: 'fe fe-arrow-down',
      liClass:'mb-0'
    },
    {
      icon: 'cf-xrp',
      title: 'Maintenance Scheduled',
      description: 'Manufacturing Plant D - Scheduled downtime',
      amount: '+ 15.3%',
      amountClass: 'text-success',
      arrowClass: 'fe fe-arrow-up',
      liClass:'mb-0'
    },
    {
      icon: 'cf-bsd',
      title: 'Status Updated',
      description: 'Warehouse E - Returned to operational',
      amount: '+ 10.2%',
      amountClass: 'text-success',
      arrowClass: 'fe fe-arrow-up',
      liClass:'mb-0'
    }
  ];
}
