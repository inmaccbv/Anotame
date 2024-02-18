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
export class HomePage  {

  cards = [
    { title: 'Reservas',                    image: './assets/img/ic_reservas2.png',       alt: 'Imagen 1', href: '/gestion-reservas',  roles: ['administrador', 'encargado', 'camarero'] },
    { title: 'Reseñas',                     image: './assets/img/ic-reviews.png',         alt: 'Imagen 2', href: '/reviews',           roles: ['administrador', 'encargado', 'camarero'] },
    { title: 'Gestión carta/menú',          image: './assets/img/ic-carta.png',           alt: 'Imagen 3', href: 'gestion-menu-carta', roles: ['administrador', 'encargado'] },
    { title: 'Descripción Local',           image: './assets/img/ic-descripcion.png',     alt: 'Imagen 4', href: '/descripcion-local', roles: ['administrador', 'encargado'] },
    { title: 'Contacto',                    image: './assets/img/ic-contacto.png',        alt: 'Imagen 5', href: '/contacto',          roles: ['administrador', 'encargado'] },
    { title: 'Generar QR',                  image: './assets/img/ic-qr.png',              alt: 'Imagen 6', href: '/codigo-qr',         roles: ['administrador', 'encargado'] },
    { title: 'Horarios',                    image: './assets/img/ic-horario.png',         alt: 'Imagen 8', href: '/horarios',          roles: ['administrador', 'encargado'] },
    { title: 'Configuración Usuarios',      image: './assets/img/ic-config-usuarios.png', alt: 'Imagen 7', href: '/config-empleados',  roles: ['administrador'] },
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
    //this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  navigateToPage(card: any) {
    this.router.navigateByUrl(card.href);
  }

  showCard(card: { title: string, roles: string[] }): boolean {
    const userRole = this.authService.getUserRole();
  
    // Verifica si userRole es una cadena no nula o no indefinida
    if (typeof userRole === 'string') {
      return card.roles.includes(userRole);
    }
  
    // Si userRole no es una cadena, devuelve false (o ajusta según tus necesidades)
    return false;
  }

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
          console.error('Error al cerrar sesion:', error);
        }
      )
    }
  }

  async mostrarPopover(usuarioData: any) {
    const popover = await this.popoverController.create({
      component: PerfilPage,
      componentProps: {
        usuarioData: usuarioData, // Pasa los datos del usuario al componente del popover
      },
      translucent: true,
      cssClass: 'my-custom-popover'
    });

    await popover.present();
  }

  
  mostrarMenu() {
    this.menu.open('first');
  }

  closeMenu() {
    this.menu.close('first'); // Cierra el menú con el identificador 'first'
  }

  // cerrarSesion(): void {
  //   this.authService.logout().subscribe();
  // }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }
}
