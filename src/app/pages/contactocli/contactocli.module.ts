import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactocliPageRoutingModule } from './contactocli-routing.module';

import { ContactocliPage } from './contactocli.page';
import { HorariosService } from 'src/app/services/horarios.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactocliPageRoutingModule
  ],
  declarations: [ContactocliPage],
  providers: [HorariosService] 
})
export class ContactocliPageModule {}
