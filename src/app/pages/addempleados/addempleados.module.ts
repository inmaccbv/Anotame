import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddempleadosPageRoutingModule } from './addempleados-routing.module';
import { AddempleadosPage } from './addempleados.page';

// Importa el servicio ThemeService
import { ThemeService } from 'src/app/services/theme.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddempleadosPageRoutingModule
  ],
  declarations: [AddempleadosPage],
  
  providers: [
    ThemeService,
  ]
})
export class AddempleadosPageModule {}
