import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthEmpresaService } from 'src/app/services/auth-empresa.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuService } from 'src/app/services/menu.service';
import { DetallesPopoverPage } from '../detalles-popover/detalles-popover.page';
import { Componente } from 'src/app/interfaces/interfaces';
import { ProvinciasService } from 'src/app/services/provincias.service';

@Component({
  selector: 'app-listaempr',
  templateUrl: './listaempr.page.html',
  styleUrls: ['./listaempr.page.scss'],
})
export class ListaemprPage implements OnInit {

  empresas: any;
  provincias: any;
  empresasFiltrados: any;
  filtroEmpresa: any;
  filtroProvincia: any;

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private empresaService: EmpresaService,
    public provinciasService: ProvinciasService,
    public authService: AuthService,
    public authEmpresa: AuthEmpresaService,
    public themeService: ThemeService,
    public menuService: MenuService,
    private router: Router,
    private alertController: AlertController,
    public popoverController: PopoverController
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.getEmpresas();
    this.getProvincias();
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
          console.error('Error al cerrar sesión:', error);
        }
      );
    } else {
      this.getEmpresas();
    }
  }

  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (ans) => {
        this.empresas = ans;
        console.log('Empresas obtenidas:', this.empresas);
        this.empresasFiltrados = this.empresas; // Inicializar con todas las empresas al principio
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
  }

  getProvincias() {
    this.provinciasService.getProvincias().subscribe(async (ans) => {
      this.provincias = ans;
    });
  }

  async borrarEmpresa(id_empresa: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas borrar este empleado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Borrado cancelado');
          },
        },
        {
          text: 'Borrar',
          handler: () => {
            try {
              this.empresaService.borrarEmpresa(id_empresa).subscribe(async (ans) => {
                console.log(ans);
                // Actualizar lista de empleados después de borrar el empleado
                this.getEmpresas();
              });
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarDetallesPopover(event: any, empresa: any) {
    const popover = await this.popoverController.create({
      component: DetallesPopoverPage,
      event: event,
      translucent: true,
      cssClass: 'popover-custom-class',
      componentProps: {
        empresa: empresa,
      },
    });

    return await popover.present();
  }

  getUsuarioInfo(usuario: any): any {
    const empresa = this.empresasFiltrados.find((e: any) => e.id_empresa === usuario.id_empresa);
    return empresa ? { empresa: empresa.empresa, provincia: empresa.provincia } : { empresa: '', provincia: '' };
  }

  filtrarEmpresa(criterio: string, event: any) {
    const valor = event.target.value || '';
  
    this.empresasFiltrados = this.empresas.filter((empresa: any) => {
      const valorLower = valor.toLowerCase();
  
      switch (criterio) {
        case 'cif':
          return empresa.cif.toLowerCase().includes(valorLower);
        case 'direccion':
          return empresa.direccion.toLowerCase().includes(valorLower);
        case 'ciudad':
          return empresa.ciudad.toLowerCase().includes(valorLower);
        case 'cPostal':
          return empresa.cPostal.toLowerCase().includes(valorLower);
        default:
          // Búsqueda en todos los campos
          return (
            empresa.cif.toLowerCase().includes(valorLower) ||
            empresa.direccion.toLowerCase().includes(valorLower) ||
            empresa.ciudad.toLowerCase().includes(valorLower) ||
            empresa.cPostal.toLowerCase().includes(valorLower)
          );
      }
    });
  }

  // Método para filtrar empleados por empresa y/o provincia
  filtrarPorEmpresaProvincia() {
    // Filtra empleados basados en las selecciones de empresa y provincia
    this.empresasFiltrados = this.empresas.filter((empresa: any) => {
      const filtroEmpresaCumple = !this.filtroEmpresa || empresa.id_empresa === this.filtroEmpresa;
      const filtroProvinciaCumple =
        !this.filtroProvincia || this.getUsuarioInfo(empresa).provincia === this.filtroProvincia;
      return filtroEmpresaCumple && filtroProvinciaCumple;
    });
  }

  // Método para manejar el evento de cambio en el desplegable de empresa
  onEmpresaChange(event: any) {
    this.filtroEmpresa = event.detail.value;
    this.filtrarPorEmpresaProvincia();
  }

  // Método para manejar el evento de cambio en el desplegable de provincia
  onProvinciaChange(event: any) {
    this.filtroProvincia = event.detail.value;
    this.filtrarPorEmpresaProvincia();
  }

  // Método para manejar el evento de cambio en la opción "Mostrar Todos" del desplegable de empresa
  onMostrarTodosEmpresas() {
    this.filtroEmpresa = null;
    this.filtrarPorEmpresaProvincia();
  }

  // Método para manejar el evento de cambio en la opción "Mostrar Todos" del desplegable de provincia
  onMostrarTodosProvincias() {
    this.filtroProvincia = null;
    this.filtrarPorEmpresaProvincia();
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
    this.authEmpresa.logout().subscribe();
  }
}
