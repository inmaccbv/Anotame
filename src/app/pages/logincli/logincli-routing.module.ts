import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogincliPage } from './logincli.page';

const routes: Routes = [
  {
    path: '',
    component: LogincliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogincliPageRoutingModule {}
