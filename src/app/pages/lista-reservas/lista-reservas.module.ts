import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaReservasPageRoutingModule } from './lista-reservas-routing.module';

import { ListaReservasPage } from './lista-reservas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaReservasPageRoutingModule
  ],
  declarations: [ListaReservasPage]
})
export class ListaReservasPageModule {}
