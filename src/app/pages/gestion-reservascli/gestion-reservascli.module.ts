import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionReservascliPageRoutingModule } from './gestion-reservascli-routing.module';

import { GestionReservascliPage } from './gestion-reservascli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionReservascliPageRoutingModule
  ],
  declarations: [GestionReservascliPage]
})
export class GestionReservascliPageModule {}
