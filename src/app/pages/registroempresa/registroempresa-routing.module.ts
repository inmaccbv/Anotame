import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroempresaPage } from './registroempresa.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroempresaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroempresaPageRoutingModule {}
