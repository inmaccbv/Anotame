import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutcliPage } from './logoutcli.page';

const routes: Routes = [
  {
    path: '',
    component: LogoutcliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogoutcliPageRoutingModule {}
