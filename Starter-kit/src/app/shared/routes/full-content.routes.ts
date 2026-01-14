import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { admin, adminuiRoutingModule } from '../../components/adminui/adminui.routes';
// import { chartsRoutingModule } from '../../components/charts/charts.routes';
// import { dashboardRoutingModule } from '../../components/dashboard/dashboard.routes';
// import { ecommerceRoutingModule } from '../../components/pages/ecommerce/ecommerce.routes';
// import { extensionRoutingModule } from '../../components/pages/extension/extension.routes';
// import { filemanagerRoutingModule } from '../../components/pages/file-manager/filemanager.routes';
// import { pagesRoutingModule } from '../../components/pages/pages.routes';
// import { widgetsRoutingModule } from '../../components/widgets/widgets.routes';
// import { uikitRoutingModule } from '../../components/uikit/uikit.routes';
// import { formsmoduleRoutingModule } from '../../components/formsmodule/formsmodule.routes';
// import { mapsRoutingModule } from '../../components/maps/maps.routes';
// import { tablesRoutingModule } from '../../components/tables/tables.routes';

export const content: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../../app/components/dashboard/dashboard.routes').then(
            (r) => r.dashboardRoutingModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('../../../app/components/forms/forms.routes').then(
            (r) => r.formsRoutingModule
          ),
      },
    ],
  },

];
@NgModule({
  imports: [RouterModule],
  exports: [RouterModule],
})
export class SaredRoutingModule {}
