import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescripcionLocalPageRoutingModule } from './descripcion-local-routing.module';

import { DescripcionLocalPage } from './descripcion-local.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DescripcionLocalPageRoutingModule
  ],
  declarations: [DescripcionLocalPage]
})
export class DescripcionLocalPageModule {}
