import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewscliPageRoutingModule } from './reviewscli-routing.module';

import { ReviewscliPage } from './reviewscli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewscliPageRoutingModule
  ],
  declarations: [ReviewscliPage]
})
export class ReviewscliPageModule {}
