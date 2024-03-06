import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { Observable, tap } from 'rxjs';
import { Componente } from './interfaces/interfaces';

import { ThemeService } from './services/theme.service';
import { MenuService } from './services/menu.service';

import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  componentes: Observable<Componente[]> | null = null;
  isDarkMode: any;

  constructor(
    private menu: MenuController,
    private router: Router,
    private el: ElementRef, 
    private renderer: Renderer2,
    private menuService: MenuService,
    private authService: AuthService,
    public themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts().pipe(
        tap(data => console.log('Componentes:', data))
    );
  }

  mostrarMenu() {
    this.menu.open('first');
  }

  showMenuItem(item: Componente): boolean {
    if (!item.roles || item.roles.length === 0) {
        // Si no hay roles definidos, siempre mostramos el elemento
        return true;
    }

    const userRole = this.authService.getUserRole();

    if (!userRole) {
        // Si no hay un rol definido, no mostramos el elemento
        return false;
    }

    return item.roles.includes(userRole);
  }

  navigateAndCloseMenu(component: Componente): void {
    this.menu.close('first');  // Cierra el menú
    
    if (component.redirectTo) {
      this.router.navigate([component.redirectTo]);  // Navega a la ruta especificada
    }
  
    // Verifica si el nombre es "Cerrar Sesión" y ejecuta la función de cierre de sesión
    if (component.name === 'Cerrar Sesión') {
      this.logout();  // Llama a la función de cierre de sesión
    }
  }  
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Aplicar o quitar la clase 'dark-theme' según el modo
    if (this.isDarkMode) {
      this.renderer.addClass(this.el.nativeElement.querySelector('ion-menu'), 'dark-theme');
    } else {
      this.renderer.removeClass(this.el.nativeElement.querySelector('ion-menu'), 'dark-theme');
    }
  }

  showLogoutItem(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole !== null;
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.menu.close('first');  // Cierra el menú
        this.router.navigate(['/login']);  // Redirige a la página de inicio de sesión
      },
      (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }
}