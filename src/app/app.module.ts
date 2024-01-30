import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeService } from './services/theme.service';
import { HttpClientModule } from '@angular/common/http';

import { NgxPrintModule } from 'ngx-print';
import { QRCodeModule } from 'angularx-qrcode';
import { ContactoService } from './services/contacto.service';
import { HorariosService } from './services/horarios.service';
import { DiasService } from './services/dias.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    HttpClientModule,
    NgxPrintModule,
    QRCodeModule,
    AppRoutingModule,
    IonicModule.forRoot({}),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }, 
    ContactoService,
    HorariosService,
    DiasService,
    ThemeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}