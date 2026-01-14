import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const loadFormsPlaceholder = () =>
  import('./forms-placeholder/forms-placeholder.component').then(
    (m) => m.FormsPlaceholderComponent
  );

export const formsRoutes: Routes = [
  {
    path: 'forms',
    children: [
      {
        path: 'forms-elements',
        children: [
          {
            path: 'inputs',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Inputs',
              title1: ['Form Elements'],
              activeitem: 'Inputs',
            },
          },
          {
            path: 'checks-radios',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Check & Radios',
              title1: ['Form Elements'],
              activeitem: 'Check & Radios',
            },
          },
          {
            path: 'input-group',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Input Group',
              title1: ['Form Elements'],
              activeitem: 'Input Group',
            },
          },
          {
            path: 'form-select',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Form Select',
              title1: ['Form Elements'],
              activeitem: 'Form Select',
            },
          },
          {
            path: 'range-slider',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Range Slider',
              title1: ['Form Elements'],
              activeitem: 'Range Slider',
            },
          },
          {
            path: 'input-masks',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Input Masks',
              title1: ['Form Elements'],
              activeitem: 'Input Masks',
            },
          },
          {
            path: 'file-uploads',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'File Uploads',
              title1: ['Form Elements'],
              activeitem: 'File Uploads',
            },
          },
          {
            path: 'date-time-picker',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Date Time Picker',
              title1: ['Form Elements'],
              activeitem: 'Date Time Picker',
            },
          },
          {
            path: 'color-picker',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Color Pickers',
              title1: ['Form Elements'],
              activeitem: 'Color Pickers',
            },
          },
        ],
      },
      {
        path: 'floating-labels',
        loadComponent: loadFormsPlaceholder,
        data: {
          title: 'Floating Labels',
          title1: ['Forms'],
          activeitem: 'Floating Labels',
        },
      },
      {
        path: 'form-layouts',
        loadComponent: loadFormsPlaceholder,
        data: {
          title: 'Form Layouts',
          title1: ['Forms'],
          activeitem: 'Form Layouts',
        },
      },
      {
        path: 'form-editor',
        children: [
          {
            path: 'quill-editor',
            loadComponent: loadFormsPlaceholder,
            data: {
              title: 'Quill Editor',
              title1: ['Form Editor'],
              activeitem: 'Quill Editor',
            },
          },
        ],
      },
      {
        path: 'validation',
        loadComponent: loadFormsPlaceholder,
        data: {
          title: 'Validation',
          title1: ['Forms'],
          activeitem: 'Validation',
        },
      },
      {
        path: 'select2',
        loadComponent: loadFormsPlaceholder,
        data: {
          title: 'Select2',
          title1: ['Forms'],
          activeitem: 'Select2',
        },
      },
      { path: '', redirectTo: 'form-layouts', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formsRoutes)],
  exports: [RouterModule],
})
export class formsRoutingModule {
  static routes = formsRoutes;
}
