import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorariosPageRoutingModule } from './horarios-routing.module';

import { HorariosPage } from './horarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HorariosPageRoutingModule
  ],
  declarations: [HorariosPage]
})
export class HorariosPageModule {}
