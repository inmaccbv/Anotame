import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservascliPage } from './reservascli.page';

const routes: Routes = [
  {
    path: '',
    component: ReservascliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservascliPageRoutingModule {}
