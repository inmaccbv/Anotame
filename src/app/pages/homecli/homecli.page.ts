import { Component } from '@angular/core';
import { MenuController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ThemeService } from 'src/app/services/theme.service';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { PerfilcliPage } from '../perfilcli/perfilcli.page';

@Component({
  selector: 'app-homecli',
  templateUrl: './homecli.page.html',
  styleUrls: ['./homecli.page.scss'],
})
export class HomecliPage {

  cards = [
    { title: 'Carta', image: './assets/img/ic-carta2.png', alt: 'Imagen 1', href: '/cartacli', roles: ['cliente'] },
    { title: 'Menú', image: './assets/img/ic-menuImg.png', alt: 'Imagen 2', href: '/menu-imgcli', roles: ['cliente'] },
    { title: 'Contacto', image: './assets/img/ic-local.png', alt: 'Imagen 2', href: '/contactocli', roles: ['cliente'] },
    { title: 'Reservas', image: './assets/img/ic_reservar.png', alt: 'Imagen 3', href: '/gestion-reservascli', roles: ['cliente'] },
    { title: 'Descrip. Local', image: './assets/img/ic-descripcion.png', alt: 'Local', href: '/descripcion-cliente', roles: ['cliente'] },
    { title: 'Reseñas', image: './assets/img/ic-reviews.png', alt: 'Reseñas', href: '/reviewscli', roles: ['cliente'] },
  ];

  rol!: any;
  isDarkMode: any;

  constructor(
    private menu: MenuController,
    private router: Router,
    private popoverController: PopoverController,
    public authServiceCli: AuthClienteService,
    public themeService: ThemeService
  ) {
    this.initializeUser();
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  // Inicializa el componente obteniendo el rol del usuario
  private initializeUser() {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
  }

  // Navega a la página correspondiente cuando se hace clic en una tarjeta
  navigateToPage(card: any) {
    this.router.navigateByUrl(card.href);
  }

  // Verifica si se debe mostrar una tarjeta en función del rol del usuario
  showCard(card: { title: string, roles: string[] }): boolean {
    const userRole = this.authServiceCli.getUserRole();
    return typeof userRole === 'string' && card.roles.includes(userRole);
  }

  // Obtiene el rol del usuario y realiza acciones según el resultado
  private getUserRole() {
    this.rol = this.authServiceCli.getUserRole();
    // console.log(this.rol);

    // Si el usuario no tiene el rol correcto, realiza el cierre de sesión
    if (!(this.rol === 'cliente')) {
      this.logoutUser();
    }
  }

  // Abre un popover con el perfil del usuario
  async mostrarPopover(clienteData: any) {
    const popover = await this.popoverController.create({
      component: PerfilcliPage,
      componentProps: {
        clienteData: clienteData,
      },
      translucent: true,
      cssClass: 'my-custom-popover'
    });

    await popover.present();
  }

  // Muestra el menú lateral
  mostrarMenu() {
    console.log('Mostrar menú');
    this.menu.open('first');
  }
  
  // Cierra el menú lateral
  closeMenu() {
    this.menu.close('first');
  }

  cerrarSesion(): void {
    this.logoutUser();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  private logoutUser() {
    this.authServiceCli.logout().subscribe(
      () => {
        localStorage.removeItem('role');
        localStorage.removeItem('cliente');
        this.router.navigate(['/inicio']);
      },
      (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }
}
