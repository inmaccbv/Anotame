import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservascliPageRoutingModule } from './reservascli-routing.module';

import { ReservascliPage } from './reservascli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ReservascliPageRoutingModule
  ],
  declarations: [ReservascliPage]
})
export class ReservascliPageModule {}
