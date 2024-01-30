import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuImgPageRoutingModule } from './menu-img-routing.module';

import { MenuImgPage } from './menu-img.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MenuImgPageRoutingModule
  ],
  declarations: [MenuImgPage]
})
export class MenuImgPageModule {}
