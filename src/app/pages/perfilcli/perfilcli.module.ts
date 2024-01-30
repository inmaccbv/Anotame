import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilcliPageRoutingModule } from './perfilcli-routing.module';

import { PerfilcliPage } from './perfilcli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilcliPageRoutingModule
  ],
  declarations: [PerfilcliPage]
})
export class PerfilcliPageModule {}
