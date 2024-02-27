import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionEmpresaPageRoutingModule } from './seleccion-empresa-routing.module';

import { SeleccionEmpresaPage } from './seleccion-empresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionEmpresaPageRoutingModule
  ],
  declarations: [SeleccionEmpresaPage]
})
export class SeleccionEmpresaPageModule {}
