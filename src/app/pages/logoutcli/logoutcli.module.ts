import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogoutcliPageRoutingModule } from './logoutcli-routing.module';

import { LogoutcliPage } from './logoutcli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogoutcliPageRoutingModule
  ],
  declarations: [LogoutcliPage]
})
export class LogoutcliPageModule {}
