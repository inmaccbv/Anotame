import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaReservascliPage } from './lista-reservascli.page';

const routes: Routes = [
  {
    path: '',
    component: ListaReservascliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaReservascliPageRoutingModule {}
