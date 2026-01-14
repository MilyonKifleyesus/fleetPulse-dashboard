import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
 {path:'custom',children:[
  
  {
    path: 'error404',
    loadComponent: () =>
      import('./error404/error404.component').then((m) => m.Error404Component),
  },
 

]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class authenticationRoutingModule {
  static routes = admin;
}