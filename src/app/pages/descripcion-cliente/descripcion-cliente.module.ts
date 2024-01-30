import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescripcionClientePageRoutingModule } from './descripcion-cliente-routing.module';

import { DescripcionClientePage } from './descripcion-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescripcionClientePageRoutingModule
  ],
  declarations: [DescripcionClientePage]
})
export class DescripcionClientePageModule {}
