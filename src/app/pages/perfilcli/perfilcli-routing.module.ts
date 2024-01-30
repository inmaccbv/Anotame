import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilcliPage } from './perfilcli.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilcliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilcliPageRoutingModule {}
