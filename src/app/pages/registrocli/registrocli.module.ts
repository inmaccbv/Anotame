import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegistrocliPageRoutingModule } from './registrocli-routing.module';
import { RegistrocliPage } from './registrocli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegistrocliPageRoutingModule
  ],
  declarations: [RegistrocliPage],
  exports: [RegistrocliPage]  // Agrega esta línea si necesitas exportar el componente
})
export class RegistrocliPageModule {}
