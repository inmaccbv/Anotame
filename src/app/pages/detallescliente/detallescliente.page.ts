import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-detallescliente',
  templateUrl: './detallescliente.page.html',
  styleUrls: ['./detallescliente.page.scss'],
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
