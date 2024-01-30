import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigEmpleadosPageRoutingModule } from './config-empleados-routing.module';

import { ConfigEmpleadosPage } from './config-empleados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigEmpleadosPageRoutingModule
  ],
  declarations: [ConfigEmpleadosPage]
})
export class ConfigEmpleadosPageModule {}
