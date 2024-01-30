import { Component, OnInit } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componente } from './interfaces/interfaces';

import { ThemeService } from './services/theme.service';
import { MenuService } from './services/menu.service';
import { MenuCliService } from './services/menucli.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  componentes!: Observable<Componente[]>;
  isDarkMode: any;


  constructor(
    private menu: MenuController,
    private menuService: MenuService,
    private menuCliService: MenuCliService,
    public themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.componentes = this.menuCliService.getMenuOptsCli();
  }

  mostrarMenu() {
    this.menu.open('first');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }
}