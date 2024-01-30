import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuImgPage } from './menu-img.page';

const routes: Routes = [
  {
    path: '',
    component: MenuImgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuImgPageRoutingModule {}
