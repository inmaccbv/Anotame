import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuImgcliPageRoutingModule } from './menu-imgcli-routing.module';

import { MenuImgcliPage } from './menu-imgcli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuImgcliPageRoutingModule
  ],
  declarations: [MenuImgcliPage]
})
export class MenuImgcliPageModule {}
