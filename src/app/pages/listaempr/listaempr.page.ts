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

@Component({
  selector: 'app-listaempr',
  templateUrl: './listaempr.page.html',
  styleUrls: ['./listaempr.page.scss'],
})
export class ListaemprPage implements OnInit {

  empresas: any;

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    public authService: AuthService,
    public authEmpresa: AuthEmpresaService,
    public themeService: ThemeService,
    public menuService: MenuService,
    private alertController: AlertController,
    public popoverController: PopoverController
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
      this.getEmpresas();
    }
  }

  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(async (ans) => {
      console.log(ans);
      this.empresas = ans;
      console.log(this.empresas);
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
          }
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
          }
        }
      ]
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
        empresa: empresa
      }
    });
  
    return await popover.present();
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
