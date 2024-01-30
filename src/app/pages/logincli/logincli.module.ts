import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogincliPageRoutingModule } from './logincli-routing.module';

import { LogincliPage } from './logincli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LogincliPageRoutingModule
  ],
  declarations: [LogincliPage]
})
export class LogincliPageModule {}
