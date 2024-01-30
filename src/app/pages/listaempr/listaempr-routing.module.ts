import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaemprPage } from './listaempr.page';

const routes: Routes = [
  {
    path: '',
    component: ListaemprPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaemprPageRoutingModule {}
