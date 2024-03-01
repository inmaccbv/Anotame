import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { PerfilPage } from '../perfil/perfil.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  cards = [
    { title: 'Reservas', image: './assets/img/ic_reservar.png', alt: 'Imagen 1', href: '/gestion-reservas', roles: ['administrador', 'encargado', 'camarero'] },
    { title: 'Reseñas', image: './assets/img/ic-reviews.png', alt: 'Imagen 2', href: '/reviews', roles: ['administrador', 'encargado'] },
    { title: 'Gestión carta/menú', image: './assets/img/ic-carta.png', alt: 'Imagen 3', href: '/gestion-menu-carta', roles: ['administrador', 'encargado'] },
    { title: 'Descripción Local', image: './assets/img/ic-descripcion.png', alt: 'Imagen 4', href: '/descripcion-local', roles: ['administrador', 'encargado'] },
    { title: 'Contacto', image: './assets/img/ic-contacto.png', alt: 'Imagen 5', href: '/contacto', roles: ['administrador', 'encargado'] },
    { title: 'Generar QR', image: './assets/img/ic-qr.png', alt: 'Imagen 6', href: '/codigo-qr', roles: ['administrador', 'encargado'] },
    { title: 'Horarios', image: './assets/img/ic-horario.png', alt: 'Imagen 8', href: '/horarios', roles: ['administrador', 'encargado'] },
    { title: 'Empleados', image: './assets/img/ic-config-usuarios.png', alt: 'Imagen 7', href: '/config-empleados', roles: ['administrador'] },
  ];

  rol!: any;
  isDarkMode: any;

  constructor(
    private menu: MenuController,
    private popoverController: PopoverController,
    private router: Router,
    public authService: AuthService,
    public themeService: ThemeService,
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  // Navega a la página correspondiente al hacer clic en una tarjeta
  navigateToPage(card: any) {
    this.router.navigateByUrl(card.href);
  }

  // Muestra una tarjeta según el rol del usuario
  showCard(card: { title: string, roles: string[] }): boolean {
    const userRole = this.authService.getUserRole();

    if (typeof userRole === 'string') {
      return card.roles.includes(userRole);
    }

    return false;
  }

  // Obtiene el rol del usuario y realiza acciones en consecuencia
  getUserRole() {
    this.rol = this.authService.getUserRole();

    if (!(this.rol === 'administrador' || this.rol === 'encargado' || this.rol === 'camarero')) {
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('role');
          localStorage.removeItem('usuario');
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesión:', error);
        }
      )
    }
  }

  // Muestra un popover con información del usuario
  async mostrarPopover(usuarioData: any) {
    const popover = await this.popoverController.create({
      component: PerfilPage,
      componentProps: {
        usuarioData: usuarioData,
      },
      translucent: true,
      cssClass: 'my-custom-popover'
    });

    await popover.present();
  }

  // Abre el menú lateral
  mostrarMenu() {
    this.menu.open('first');
  }

  // Cierra el menú lateral
  closeMenu() {
    this.menu.close('first');
  }

  // Cambia entre los modos claro y oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }
}