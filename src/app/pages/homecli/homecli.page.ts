import { Component, OnInit } from '@angular/core';
import { MenuController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Componente } from 'src/app/interfaces/interfaces';

import { DataService } from '../../services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { PerfilcliPage } from '../perfilcli/perfilcli.page';

@Component({
  selector: 'app-homecli',
  templateUrl: './homecli.page.html',
  styleUrls: ['./homecli.page.scss'],
})
export class HomecliPage implements OnInit {

  cards = [
    { title: 'Carta', image: './assets/img/ic-carta2.png', alt: 'Imagen 1', href: '/cartacli' },
    { title: 'Menú', image: './assets/img/ic-menuImg.png', alt: 'Imagen 2', href: '/menu-imgcli' },
    { title: 'Contacto', image: './assets/img/ic-local.png', alt: 'Imagen 2', href: '/contactocli' },
    { title: 'Reservas', image: './assets/img/ic_reservar.png', alt: 'Imagen 3', href: '/gestion-reservascli' },
    { title: 'Descripción Local', image: './assets/img/ic-descripcion.png', alt: 'Descripción Local', href: '/descripcion-cliente' },
    { title: 'Reseñas', image: './assets/img/ic-reviews.png', alt: 'Reseñas', href: '/reviewscli' },
  ];

  texto!: string;

  rol!: any;
  isDarkMode: any;
  componentes: Componente[] = [];

  constructor(
    private menu: MenuController,
    public menuService: DataService,
    public menuCli: MenuCliService,
    public authService: AuthService,
    public authServiceCli: AuthClienteService,
    private router: Router,
    private popoverController: PopoverController,
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
    console.log('Componente HomecliPage inicializado.');
    if (this.rol === 'cliente') {
      this.menuCli.getMenuOptsCli().subscribe(menu => {
        console.log('Menú para cliente:', menu);
        this.componentes = menu;
      });
    }
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);

    if (!(this.rol === 'cliente')) {
      console.log('Usuario no es un cliente, cerrando sesión...');
      this.authService.logout().subscribe(
        () => {

          localStorage.removeItem('role');
          localStorage.removeItem('cliente');

          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      )
    }
  }

  async mostrarPopover(clienteData: any) {
    const popover = await this.popoverController.create({
      component: PerfilcliPage,
      componentProps: {
        clienteData: clienteData, // Pasa los datos del usuario al componente del popover
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

  cerrarSesion(): void {
    this.authServiceCli.logout().subscribe();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }
}