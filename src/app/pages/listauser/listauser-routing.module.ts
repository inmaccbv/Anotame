import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListauserPage } from './listauser.page';

const routes: Routes = [
  {
    path: '',
    component: ListauserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListauserPageRoutingModule {}
