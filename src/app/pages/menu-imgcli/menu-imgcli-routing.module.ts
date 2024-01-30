import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuImgcliPage } from './menu-imgcli.page';

const routes: Routes = [
  {
    path: '',
    component: MenuImgcliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuImgcliPageRoutingModule {}
