import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CodigoQrPageRoutingModule } from './codigo-qr-routing.module';
import { CodigoQrPage } from './codigo-qr.page';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoQrPageRoutingModule,
    QRCodeModule,
    NgxPrintModule, // Agrega NgxPrintModule aquí
  ],
  declarations: [CodigoQrPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CodigoQrPageModule {}