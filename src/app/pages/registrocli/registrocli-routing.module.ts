import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrocliPage } from './registrocli.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrocliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrocliPageRoutingModule {}
