import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddempresaPageRoutingModule } from './addempresa-routing.module';

import { AddempresaPage } from './addempresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddempresaPageRoutingModule
  ],
  declarations: [AddempresaPage]
})
export class AddempresaPageModule {}
