import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionReservascliPage } from './gestion-reservascli.page';

const routes: Routes = [
  {
    path: '',
    component: GestionReservascliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionReservascliPageRoutingModule {}
