import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeleccionEmpresaPage } from './seleccion-empresa.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionEmpresaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeleccionEmpresaPageRoutingModule {}
