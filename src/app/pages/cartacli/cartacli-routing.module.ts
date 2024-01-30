import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartacliPage } from './cartacli.page';

const routes: Routes = [
  {
    path: '',
    component: CartacliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartacliPageRoutingModule {}
