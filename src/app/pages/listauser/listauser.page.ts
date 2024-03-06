import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Componente, Usuario } from 'src/app/interfaces/interfaces';

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

  idEmpresa!: number | null;
  empleados: Usuario[] = [];
  empleadosFiltrados: any;

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private router: Router,
    private alertController: AlertController,
    public userLogin: UsuariosService,
    public authService: AuthService,
    public menuService: MenuService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    // Inicializo el modo oscuro
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();

    this.getEmpleados();
  }

  // Obtengo el rol del usuario actual
  getUserRole() {
    this.rol = this.authService.getUserRole();

    // Verifico si el rol no es 'administrador' y cierro sesión si es necesario
    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {
          // Elimino datos del usuario del almacenamiento local
          localStorage.removeItem('role');
          localStorage.removeItem('usuario');

          // Redirijo al usuario a la página de inicio
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      );
    }
  }

  // Obtengo la lista de empleados asociados a la empresa del usuario
  getEmpleados() {
    // Verifico si el rol del usuario es 'administrador', 'encargado' o 'camarero'
    if (this.rol === 'administrador' || this.rol === 'encargado' || this.rol === 'camarero') {
      // Obtengo el email del usuario
      const email = this.authService.getUserEmail();

      // Verifico si el email no es nulo antes de llamar a la función
      if (email !== null) {
        this.userLogin.getIdEmpresaPorEmail(email).subscribe(
          (response) => {
            // Verifico si la respuesta tiene el código 200 y contiene el id_empresa
            if (response.code === 200 && response.data && response.data.id_empresa) {
              this.idEmpresa = response.data.id_empresa;
              // Ahora que tengo el idEmpresa, obtengo la lista de empleados
              const idEmpresaAsNumber = this.idEmpresa as number; // Convierto a número
              if (!isNaN(idEmpresaAsNumber)) {
                this.userLogin.getUsuariosPorEmpresa(idEmpresaAsNumber).subscribe(
                  (empleadosResponse: any) => {
                    // Verifico si la respuesta tiene el código 200 y data es un array
                    if (empleadosResponse.code === 200 && Array.isArray(empleadosResponse.data)) {
                      // Almaceno la lista de empleados y la utilizo para filtrar
                      this.empleados = empleadosResponse.data;
                      this.empleadosFiltrados = empleadosResponse.data; // Inicializo empleadosFiltrados
                      console.log('Empleados obtenidos:', this.empleados);
                    } else {
                      console.error('La respuesta del servicio de empleados no es válida:', empleadosResponse);
                    }
                  },
                  (errorEmpleados) => {
                    console.error('Error al obtener los empleados:', errorEmpleados);
                  }
                );
              } else {
                console.error('ID de empresa no es un número válido:', idEmpresaAsNumber);
              }
            } else {
              console.error('No se pudo obtener el id_empresa del usuario:', response);
            }
          },
          (error) => {
            console.error('Error al obtener el id_empresa del usuario:', error);
          }
        );
      } else {
        console.error('El email del usuario es nulo.');
      }
    } else {
      console.error('No tiene permiso para acceder a esta opción.');
    }
  }

  // Muestra una alerta para confirmar el borrado de un empleado
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
              // Llamo al servicio para borrar el empleado y recargo la página después de borrar
              this.userLogin.borrarEmpleado(id_user).subscribe(async (ans) => {
                console.log(ans);
                window.location.reload();
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

  // Filtra la lista de empleados según el criterio y el valor proporcionados
  filtrarEmpleados(criterio: string, valor: string) {
    if (!valor) {
      valor = '';
    }

    this.empleadosFiltrados = this.empleados.filter((empleado: any) => {
      const valorLower = valor.toLowerCase();
      switch (criterio) {
        case 'nombre':
          return empleado.nombre.toLowerCase().includes(valorLower);
        case 'email':
          return empleado.email.toLowerCase().includes(valorLower);
        default:
          return false;
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
