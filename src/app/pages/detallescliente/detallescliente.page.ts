import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-detallescliente',
  styleUrls: ['./detallescliente.page.scss'],
  template: `
    <ion-content class="ion-padding" *ngIf="cliente && cliente.cliente">
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button (click)="cerrarPopover()">
            <ion-icon name="close" style="font-size: 25px;"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <h2>{{ cliente.cliente.nombre }}</h2>
      <div class="detalle-info">
        <div><p class="pe">Teléfono:</p> <p>{{ cliente.cliente.telf }}</p></div>
      </div>
    </ion-content>
  `,
})
export class DetallesclientePage implements OnInit {
  @Input() cliente: any;
  isDarkMode: any;

  constructor(
    public popoverController: PopoverController,
    public themeService: ThemeService,
  ) { }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkTheme();
    console.log('DetallesclientePage - Cliente:', this.cliente);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarPopover() {
    this.popoverController.dismiss();
  }
}
