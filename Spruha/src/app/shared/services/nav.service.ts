import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

//Menu Bar
export interface Menu {
  headTitle?: string;
  title?: string;
  path?: string;
  icon?: string;
  type?: string;
  dirchange?: boolean;
  badgeClass?: string;
  badgeValue?: string;
  active?: boolean;
  children?: Menu[];
  selected?: boolean;
  menutype?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;
  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerwidth < 991) {
          this.collapseSidebar = false;
        }
      });
    if (window.innerWidth < 991) {
      this.router.events.subscribe((event) => {
        this.collapseSidebar = false;
      });
    }
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  ngOnDestroy() {
    this.unsubscriber.next(true);
    this.unsubscriber.complete();
  }

  MENUITEMS: Menu[] = [
    //title
    { headTitle: 'dashboard' },
    {
      title: 'Dashboard',
      path: '/dashboard',
      type: 'link',
      icon: 'ti-home',
      active: false,
      selected: false,
    },
    {
      title: 'Facility Management',
      path: '/facility-dashboard',
      type: 'link',
      icon: 'ti-layout-grid2',
      active: false,
      selected: false,
    },
    {
      title: 'Crypto Currencies',
      icon: 'ti-wallet',
      type: 'sub',
      active: false,
      children: [
        { path: '/crypto/crypto-dashboard', title: 'Dashboard', type: 'link' },
        { path: '/crypto/marketcap', title: 'Marketcap', type: 'link' },
        {
          path: '/crypto/currency-exchange',
          title: 'Currency Exchange',
          type: 'link',
        },
        { path: '/crypto/buy-sell', title: 'Buy & Sell', type: 'link' },
        { path: '/crypto/wallet', title: 'Wallet', type: 'link' },
        { path: '/crypto/transactions', title: 'Transactions', type: 'link' },
      ],
    },
    {
      title: 'ECommerce',
      icon: 'ti-shopping-cart-full',
      type: 'sub',
      active: false,
      children: [
        {
          path: '/ecommerce/ecommerce-dashboard',
          title: 'Dashboard',
          type: 'link',
        },
        { path: '/ecommerce/products', title: 'Products', type: 'link' },
        {
          path: '/ecommerce/product-deatils',
          title: 'Product Details',
          type: 'link',
        },
        { path: '/ecommerce/cart', title: 'Cart', type: 'link' },
        { path: '/ecommerce/wishlist', title: 'Wishlist', type: 'link' },
        { path: '/ecommerce/checkout', title: 'Checkout', type: 'link' },
        { path: '/ecommerce/orders', title: 'Orders', type: 'link' },
        { path: '/ecommerce/add-product', title: 'Add product', type: 'link' },
        { path: '/ecommerce/account', title: 'Account', type: 'link' },
      ],
    },

    { headTitle: 'Vehicle Management' },
    {
      path: '/vehicle-management',
      title: 'Vehicle Management',
      type: 'link',
      icon: 'ti-layout',
      active: false,
    },
    { headTitle: 'applications' },

    {
      title: 'Apps',
      icon: 'ti-write',
      type: 'sub',
      active: false,
      children: [
        {
          path: '/apps/widgets',
          title: 'Widgets',
          type: 'link',
          active: false,
        },
        {
          path: '/apps/sweet-alerts',
          title: 'Sweet Alerts',
          type: 'link',
        },
        {
          title: 'Mail',
          type: 'sub',
          badgeClass: 'bg-warning',
          badgeValue: '2',
          active: false,
          children: [
            {
              path: '/apps/mail/mail-inbox',
              title: 'Mail Inbox',
              type: 'link',
            },
            { path: '/apps/mail/view-mail', title: 'View Mail', type: 'link' },
            {
              path: '/apps/mail/mail-compose',
              title: 'Mail Compose',
              type: 'link',
            },
          ],
        },
        {
          title: 'Maps',
          type: 'sub',
          badgeClass: 'bg-secondary',
          badgeValue: '2',
          active: false,
          children: [
            { path: '/apps/maps/leaflet', title: 'Leaflet Maps', type: 'link' },
          ],
        },
        {
          title: 'Tables',
          type: 'sub',
          active: false,
          children: [
            { path: '/apps/tables/tables', title: 'Tables', type: 'link' },
            {
              path: '/apps/tables/ngx-easy-table',
              title: 'Ngx-Easy-Tables',
              type: 'link',
            },
            {
              path: '/apps/tables/angular-material-table',
              title: 'Angular Material Tables',
              type: 'link',
            },
          ],
        },
        {
          title: 'Blog',
          type: 'sub',
          active: false,
          children: [
            { path: '/apps/blog/blog-page', title: 'Blog Page', type: 'link' },
            {
              path: '/apps/blog/blog-details',
              title: 'Blog details',
              type: 'link',
            },
            { path: '/apps/blog/blog-post', title: 'Blog Post', type: 'link' },
          ],
        },
        {
          title: 'File manager',
          type: 'sub',
          active: false,
          children: [
            {
              path: '/apps/filemanager/filemanager',
              title: 'File Manager',
              type: 'link',
            },
            {
              path: '/apps/filemanager/filemanager-list',
              title: 'File Manager List',
              type: 'link',
            },
            {
              path: '/apps/filemanager/file-details',
              title: 'File Details',
              type: 'link',
            },
          ],
        },
        {
          path: '/apps/icons',
          title: 'Icons',
          type: 'link',
          active: false,
        },
      ],
    },

    { headTitle: 'components' },
    {
      title: 'Elements',
      icon: 'ti-package',
      type: 'sub',
      menutype: 'mega-menu',
      active: false,
      children: [
        {
          path: '/elements/accordion',
          title: 'Accordions & Collapse',
          type: 'link',
        },
        { path: '/elements/alerts', title: 'Alerts', type: 'link' },
        { path: '/elements/avatars', title: 'Avatars', type: 'link' },
        { path: '/elements/breadcrumb', title: 'Breadcrumb', type: 'link' },
        { path: '/elements/buttons', title: 'Buttons', type: 'link' },
        { path: '/elements/button-group', title: 'Button Group', type: 'link' },
        { path: '/elements/badge', title: 'Badge', type: 'link' },
        { path: '/elements/dropdowns', title: 'Dropdowns', type: 'link' },
        {
          path: '/elements/images-figures',
          title: 'Images & Figures',
          type: 'link',
        },
        { path: '/elements/list-group', title: 'List Group', type: 'link' },
        { path: '/elements/navs-tabs', title: 'Navs & Tabs', type: 'link' },
        {
          path: '/elements/object-fit',
          title: 'Object Fit',
          type: 'link',
        },
        { path: '/elements/pagination', title: 'Pagination', type: 'link' },
        { path: '/elements/popover', title: 'Popover', type: 'link' },
        { path: '/elements/progress', title: 'Progress', type: 'link' },
        { path: '/elements/spinners', title: 'Spinners', type: 'link' },
        { path: '/elements/typography', title: 'Typography', type: 'link' },
        { path: '/elements/tooltips', title: 'Tooltips', type: 'link' },
        { path: '/elements/toast', title: 'Toast', type: 'link' },
        { path: '/elements/tags', title: 'Tags', type: 'link' },
      ],
    },
    {
      title: 'Advanced UI',
      icon: 'ti-briefcase',
      type: 'sub',
      active: false,
      children: [
        { path: '/advancedui/carousel', title: 'Carousel', type: 'link' },
        {
          path: '/advancedui/full-calender',
          title: 'Full Calendar',
          type: 'link',
        },
        {
          path: '/advancedui/draggable-cards',
          title: 'Draggable-Cards',
          type: 'link',
        },
        { path: '/advancedui/chat', title: 'Chat', type: 'link' },
        { path: '/advancedui/contacts', title: 'Contacts', type: 'link' },
        { path: '/advancedui/cards', title: 'Cards', type: 'link' },
        { path: '/advancedui/timeline', title: 'Timeline', type: 'link' },

        { path: '/advancedui/search', title: 'Search', type: 'link' },
        { path: '/advancedui/userlist', title: 'Userlist', type: 'link' },
        {
          path: '/advancedui/notification',
          title: 'Notification',
          type: 'link',
        },
        { path: '/advancedui/tree-view', title: 'Treeview', type: 'link' },
        {
          path: '/advancedui/modals-closes',
          title: 'Modals & Closes',
          type: 'link',
        },
        { path: '/advancedui/navbar', title: 'Navbar', type: 'link' },
        { path: '/advancedui/offcanvas', title: 'Offcanvas', type: 'link' },
        {
          path: '/advancedui/placeholders',
          title: 'Placeholders',
          type: 'link',
        },
        { path: '/advancedui/ratings', title: 'Ratings', type: 'link' },
        { path: '/advancedui/scrollspy', title: 'Scrollspy', type: 'link' },
        { path: '/advancedui/swiperjs', title: 'Swiper Js', type: 'link' },
      ],
    },

    { headTitle: 'Other Pages' },
    {
      title: 'Pages',
      icon: 'ti-palette',
      type: 'sub',
      active: false,
      children: [
        { path: '/pages/profile', title: 'Profile', type: 'link' },
        { path: '/pages/aboutus', title: 'About Us', type: 'link' },
        { path: '/pages/settings', title: 'settings', type: 'link' },
        { path: '/pages/invoice', title: 'Invoice', type: 'link' },
        { path: '/pages/pricing', title: 'Pricing', type: 'link' },
        { path: '/pages/gallery', title: 'Gallery', type: 'link' },
        {
          path: '/pages/notifications-list',
          title: 'Notifications list',
          type: 'link',
        },
        { path: '/pages/faqs', title: 'Faqs', type: 'link' },
        {
          path: '/alert-pages/success-message',
          title: 'Success Message',
          type: 'link',
        },
        {
          path: '/alert-pages/danger-message',
          title: 'Danger Message',
          type: 'link',
        },
        {
          path: '/alert-pages/warning-message',
          title: 'Warning Message',
          type: 'link',
        },
        { path: '/pages/empty-page', title: 'Empty Page', type: 'link' },
      ],
    },
    {
      title: 'Utilities',
      icon: 'ti-shield',
      type: 'sub',
      active: false,
      children: [
        { path: '/utilities/breakpoints', title: 'BreakPoints', type: 'link' },
        { path: '/utilities/display', title: 'Display', type: 'link' },
        { path: '/utilities/borders', title: 'Borders', type: 'link' },
        { path: '/utilities/colors', title: 'Colors', type: 'link' },
        { path: '/utilities/flex', title: 'Flex', type: 'link' },
        { path: '/utilities/columns', title: 'Columns', type: 'link' },
        { path: '/utilities/gutters', title: 'Gutters', type: 'link' },
        { path: '/utilities/helpers', title: 'Helpers', type: 'link' },
        { path: '/utilities/position', title: 'Position', type: 'link' },
        { path: '/utilities/more', title: 'More', type: 'link' },
      ],
    },
    {
      title: 'Submenus',
      icon: 'ti-panel',
      type: 'sub',
      active: false,
      children: [
        { title: 'Level 1', type: 'empty' },
        {
          title: 'Level 2',
          type: 'sub',
          children: [
            { title: 'Level 2.0', type: 'empty' },
            { title: 'Level 2.1', type: 'empty' },
            {
              title: 'Level 2.2',
              type: 'sub',
              active: false,
              children: [
                { title: 'Level 2.2.1', type: 'empty' },
                { title: 'Level 2.2.2', type: 'empty' },
              ],
            },
          ],
        },
        { title: 'Level 3', type: 'empty' },
      ],
    },
    {
      title: 'Authentication',
      icon: 'ti-lock',
      type: 'sub',
      active: false,
      children: [
        { path: '/custom/sign-in', title: 'Sign In', type: 'link' },
        { path: '/custom/sign-up', title: 'Sign Up', type: 'link' },
        {
          path: '/custom/forget-password',
          title: 'Forgot Password',
          type: 'link',
        },
        {
          path: '/custom/reset-password',
          title: 'Reset Password',
          type: 'link',
        },
        { path: '/custom/lockscreen', title: 'Lock Screen', type: 'link' },
        {
          path: '/custom/under-construction',
          title: 'Under Construction',
          type: 'link',
        },
        { path: '/custom/error404', title: '404 Error', type: 'link' },
        { path: '/custom/error500', title: '500 Error', type: 'link' },
      ],
    },

    { headTitle: 'Forms & Charts' },
    {
      title: 'Forms',
      type: 'sub',
      icon: 'ti-receipt',
      active: false,
      children: [
        {
          title: 'Form Elements',
          type: 'sub',
          active: false,
          children: [
            {
              path: '/forms/forms-elements/inputs',
              title: 'Inputs',
              type: 'link',
            },
            {
              path: '/forms/forms-elements/checks-radios',
              title: 'Check & Radios',
              type: 'link',
            },
            {
              path: '/forms/forms-elements/input-group',
              title: 'Input Group',
              type: 'link',
            },
            {
              path: '/forms/forms-elements/form-select',
              title: 'Form Select',
              type: 'link',
            },
            {
              path: '/forms/forms-elements/range-slider',
              title: 'Range Slider',
              type: 'link',
            },
            {
              path: '/forms/forms-elements/input-masks',
              title: 'Input Masks',
              type: 'link',
            },

            {
              path: '/forms/forms-elements/file-uploads',
              title: 'File Uploads',
              type: 'link',
            },
            {
              path: '/forms/forms-elements/date-time-picker',
              title: 'Date Time Picker',
              type: 'link',
            },
            {
              path: '/forms/forms-elements/color-picker',
              title: 'Color pickers',
              type: 'link',
            },
          ],
        },
        {
          path: '/forms/floating-labels',
          title: 'Floating Labels',
          type: 'link',
        },
        {
          path: '/forms/form-layouts',
          title: 'Form Layouts',
          type: 'link',
        },
        {
          title: 'Form Editors',
          type: 'sub',
          active: false,
          children: [
            {
              path: '/forms/form-editor/quill-editor',
              title: 'Quill Editor',
              type: 'link',
            },
          ],
        },
        {
          path: '/forms/validation',
          title: 'Validation',
          type: 'link',
        },
        {
          path: '/forms/select2',
          title: 'select2',
          type: 'link',
        },
      ],
    },

    {
      title: 'Charts',
      type: 'sub',
      icon: 'ti-bar-chart-alt',
      active: false,
      children: [
        {
          path: '/charts/chartjs-charts',
          title: 'ChartJS',
          type: 'link',
        },
        {
          path: '/charts/echart-charts',
          title: 'Echart',
          type: 'link',
        },
        {
          title: 'Apex Charts',
          type: 'sub',
          active: false,
          children: [
            {
              path: '/charts/apex-charts/line-charts',
              title: 'Line Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/area-charts',
              title: 'Area Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/column-charts',
              title: 'Column-Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/bar-charts',
              title: 'Bar Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/mixed-charts',
              title: 'Mixed charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/range-area-charts',
              title: 'Range Area Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/timeline-charts',
              title: 'TimeLine Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/candlestick-charts',
              title: 'CandleStick Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/boxplot-charts',
              title: 'BoxPlot Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/bubble-charts',
              title: 'Bubble charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/scatter-charts',
              title: 'Scatter Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/heatmap-charts',
              title: 'Heatmap Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/treemap-charts',
              title: 'TreeMap Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/pie-charts',
              title: 'Pie Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/radialbar-charts',
              title: 'Radialbar Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/radar-charts',
              title: 'Radar Charts',
              type: 'link',
            },
            {
              path: '/charts/apex-charts/polararea-charts',
              title: 'Polararea Charts',
              type: 'link',
            },
          ],
        },
      ],
    },
  ];

  //array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
