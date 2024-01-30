import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionSalaPage } from './gestion-sala.page';

const routes: Routes = [
  {
    path: '',
    component: GestionSalaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionSalaPageRoutingModule {}
