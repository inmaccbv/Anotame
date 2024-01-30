import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddempleadosPage } from './addempleados.page';

const routes: Routes = [
  {
    path: '',
    component: AddempleadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddempleadosPageRoutingModule {}
