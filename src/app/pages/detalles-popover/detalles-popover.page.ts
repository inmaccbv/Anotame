import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-detalles-popover',
  styleUrls: ['./detalles-popover.page.scss'],
  template: `
<ion-content class="ion-padding" [ngClass]="{'dark-theme': isDarkMode}">
  <h2>{{ empresa.empresa }}</h2>
  <div class="detalle-info">
    <div><p class="pe">ID:</p> <p>{{ empresa.id_empresa }}</p></div>
    <div><p class="pe">CIF:</p> <p>{{ empresa.cif }}</p></div>
    <div><p class="pe">DIRECCIÓN:</p> <p>{{ empresa.direccion }}</p></div>
    <div><p class="pe">PROVINCIA:</p> <p>{{ empresa.provincia }}</p></div>
    <div><p class="pe">CIUDAD:</p> <p>{{ empresa.ciudad }}</p></div>
    <div><p class="pe">C.POSTAL:</p> <p>{{ empresa.cPostal }}</p></div>
  </div>
</ion-content>

`,
})

export class DetallesPopoverPage implements OnInit {

  empresa: any;
  isDarkMode: any;

  constructor(
    public popoverController: PopoverController, 
    public themeService: ThemeService,
  ) { }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }
}