import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesclientePage } from './detallescliente.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesclientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesclientePageRoutingModule {}
