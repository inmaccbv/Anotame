import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaReservascliPageRoutingModule } from './lista-reservascli-routing.module';

import { ListaReservascliPage } from './lista-reservascli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaReservascliPageRoutingModule
  ],
  declarations: [ListaReservascliPage]
})
export class ListaReservascliPageModule {}
