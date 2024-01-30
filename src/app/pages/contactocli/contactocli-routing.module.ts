import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactocliPage } from './contactocli.page';

const routes: Routes = [
  {
    path: '',
    component: ContactocliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactocliPageRoutingModule {}
