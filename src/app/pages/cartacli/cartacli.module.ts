import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartacliPageRoutingModule } from './cartacli-routing.module';

import { CartacliPage } from './cartacli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartacliPageRoutingModule
  ],
  declarations: [CartacliPage]
})
export class CartacliPageModule {}
