import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionMenuCartaPage } from './gestion-menu-carta.page';

const routes: Routes = [
  {
    path: '',
    component: GestionMenuCartaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionMenuCartaPageRoutingModule {}
