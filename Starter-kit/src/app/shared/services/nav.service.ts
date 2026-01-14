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
  menutype?:string;
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
      selected:false
    },
    { headTitle: 'Other Pages' },
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
            { title: 'Level 2.2', type: 'sub', active: false, children: [
                { title: 'Level 2.2.1', type: 'empty' },
                { title: 'Level 2.2.2', type: 'empty' }
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
        { path: '/custom/error404', title: '404 Error', type: 'link' },
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
              title: 'Color Pickers',
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
          title: 'Select2',
          type: 'link',
        },
      ],
    },
  ];

  //array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
