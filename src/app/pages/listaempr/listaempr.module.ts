import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaemprPageRoutingModule } from './listaempr-routing.module';

import { ListaemprPage } from './listaempr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaemprPageRoutingModule
  ],
  declarations: [ListaemprPage]
})
export class ListaemprPageModule {}
