import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  rol!: any; 
  isDarkMode: any; 
  componentes!: Observable<Componente[]>;

  // Arreglo de objetos que representan las opciones de tarjetas en la interfaz
  cards = [
    { title: 'Descripción Local', image: './assets/img/ic-descripcion.png', alt: 'Descripción Local', href: '/descripcion-local', role: 'administrador' },
    { title: 'Configuración', image: './assets/img/ic-config-usuarios.png', alt: 'Imagen 2', href: '/config-empleados', role: 'administrador' },
    { title: 'Generar QR', image: './assets/img/ic-qr.png', alt: 'Imagen 4', href: '/codigo-qr', role: 'administrador' },
    
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    public menuService: MenuService,
    public themeService: ThemeService
  ) {
    this.getUserRole(); 
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  navigateToPage(card: any) {
    this.router.navigateByUrl(card.href);
  }

  ngOnInit() { 
    this.componentes = this.menuService.getMenuOpts();
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

      // Cerrar sesión y redirigir al usuario a la página de inicio
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('role'); 
          localStorage.removeItem('usuario');

          this.router.navigate(['/inicio']); 
        },
        (error) => {
          console.error('Error al cerrar sesión:', error);
        }
      );
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}