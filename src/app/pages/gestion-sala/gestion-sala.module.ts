import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionSalaPageRoutingModule } from './gestion-sala-routing.module';

import { GestionSalaPage } from './gestion-sala.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionSalaPageRoutingModule
  ],
  declarations: [GestionSalaPage]
})
export class GestionSalaPageModule {}
