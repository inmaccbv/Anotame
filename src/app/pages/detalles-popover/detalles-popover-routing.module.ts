import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesPopoverPage } from './detalles-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesPopoverPageRoutingModule {}
