import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigEmpleadosPage } from './config-empleados.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigEmpleadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigEmpleadosPageRoutingModule {}
