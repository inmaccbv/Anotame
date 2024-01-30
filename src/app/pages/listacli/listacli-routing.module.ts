import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListacliPage } from './listacli.page';

const routes: Routes = [
  {
    path: '',
    component: ListacliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListacliPageRoutingModule {}
