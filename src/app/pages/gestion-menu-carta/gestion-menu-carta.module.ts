import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionMenuCartaPageRoutingModule } from './gestion-menu-carta-routing.module';

import { GestionMenuCartaPage } from './gestion-menu-carta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionMenuCartaPageRoutingModule
  ],
  declarations: [GestionMenuCartaPage]
})
export class GestionMenuCartaPageModule {}
