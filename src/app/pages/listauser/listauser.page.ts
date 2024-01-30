import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-listauser',
  templateUrl: './listauser.page.html',
  styleUrls: ['./listauser.page.scss'],
})
export class ListauserPage implements OnInit {

  empleados: any;
  coloresFilas = ['#FFECBA', '#FFFFFF'];
  editForm: any;
  empleadoSeleccionado: any;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;
  empleado: any;

  constructor(
    public userLogin: UsuariosService,
    private router: Router,
    public authService: AuthService,
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
    this.getEmpleados();
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
    }
  }

  // Método para obtener la lista de empleados desde el servicio
  getEmpleados() {
    this.userLogin.getEmpleados().subscribe(async (ans) => {
      this.empleados = ans;
      console.log(this.empleados);
    });
  }

  actualizarRol(id_user: any) {
    const nuevoRol = this.empleado.rol;
    this.userLogin.actualizarRol(id_user, nuevoRol).subscribe(
      (respuesta) => {
        console.log('Rol actualizado correctamente:', respuesta);

      },
      (error) => {
        console.error('Error al actualizar el rol:', error);
      }
    );
  }

  async borrarEmpleado(id_user: any) {
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
              this.userLogin.borrarEmpleado(id_user).subscribe(async (ans) => {
                console.log(ans);
                // Actualizar lista de empleados después de borrar el empleado
                this.getEmpleados();
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