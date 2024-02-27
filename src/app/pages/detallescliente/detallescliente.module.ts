import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesclientePageRoutingModule } from './detallescliente-routing.module';

import { DetallesclientePage } from './detallescliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesclientePageRoutingModule
  ],
  declarations: [DetallesclientePage]
})
export class DetallesclientePageModule {}
