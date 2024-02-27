// carta.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CartaPageRoutingModule } from './carta-routing.module';
import { CartaPage } from './carta.page';
import { UsuariosService } from 'src/app/services/usuarios.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CartaPageRoutingModule
  ],
  declarations: [CartaPage],
  providers: [
    UsuariosService,  // Asegúrate de agregar el servicio en el array de providers si se usa en este módulo
  ],
})
export class CartaPageModule {}
