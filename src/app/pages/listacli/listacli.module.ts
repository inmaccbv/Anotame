import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListacliPageRoutingModule } from './listacli-routing.module';

import { ListacliPage } from './listacli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListacliPageRoutingModule
  ],
  declarations: [ListacliPage]
})
export class ListacliPageModule {}
