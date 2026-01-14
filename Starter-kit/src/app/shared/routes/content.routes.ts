import { Routes } from '@angular/router';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...
export const Authen_Routes: Routes = [
    {path:'', loadChildren : () => import('../../../app/components/authentication/authentication.routes').then(r => r.authenticationRoutingModule)},

]


