import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewscliPage } from './reviewscli.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewscliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewscliPageRoutingModule {}
