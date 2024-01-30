import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescripcionLocalPage } from './descripcion-local.page';

const routes: Routes = [
  {
    path: '',
    component: DescripcionLocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescripcionLocalPageRoutingModule {}
