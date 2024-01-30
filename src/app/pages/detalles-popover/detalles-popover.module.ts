import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesPopoverPageRoutingModule } from './detalles-popover-routing.module';

import { DetallesPopoverPage } from './detalles-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesPopoverPageRoutingModule
  ],
  declarations: [DetallesPopoverPage]
})
export class DetallesPopoverPageModule {}
