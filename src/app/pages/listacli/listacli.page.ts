import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { ThemeService } from 'src/app/services/theme.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-listacli',
  templateUrl: './listacli.page.html',
  styleUrls: ['./listacli.page.scss'],
})
export class ListacliPage implements OnInit {

  clientes: any;
  clientesFiltrados: any;

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public clienteService: ClientesService,
    private router: Router,
    public authService: AuthService,
    public authCliente: AuthClienteService,
    public menuService: MenuService,
    private alertController: AlertController,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() { 
    this.componentes = this.menuService.getMenuOpts();
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    
    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
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
    } else {
      // Si el usuario es administrador, obtén la lista de clientes
      this.getClientes();
    }
  }

  getClientes() {
    this.clienteService.getClientes().subscribe(async (ans) => {
      this.clientes = ans;
      console.log('Clientes datos:', this.clientes);
    });
  }

  async borrarCliente(id_cliente: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas borrar a este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Borrado cancelado');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            try {
              this.clienteService.borrarCliente(id_cliente).subscribe(async (ans) => {
                console.log(ans);
                this.getClientes();
              });
            } catch (e) {
              console.error(e);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  filtrarClientes(criterio: string, valor: string) {
    if (!valor) {
      valor = '';
    }

    this.clientesFiltrados = this.clientes.filter((cliente: any) => {
      const valorLower = valor.toLowerCase();
      switch (criterio) {
        case 'nombre':
          return cliente.nombre.toLowerCase().includes(valorLower);
        case 'apellido':
          return cliente.apellido.toLowerCase().includes(valorLower);
        case 'email':
          return cliente.email.toLowerCase().includes(valorLower);
          case 'telf':
            return cliente.telf.toLowerCase().includes(valorLower);
        default:
          return false;
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
    const contentElement = document.querySelector('ion-content');
    if (contentElement) {
      contentElement.classList.toggle('dark-mode', this.isDarkMode);
    }
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}