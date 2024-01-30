import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListauserPageRoutingModule } from './listauser-routing.module';

import { ListauserPage } from './listauser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListauserPageRoutingModule
  ],
  declarations: [ListauserPage]
})
export class ListauserPageModule {}
