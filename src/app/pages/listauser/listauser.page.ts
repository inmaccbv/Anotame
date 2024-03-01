import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-listauser',
  templateUrl: './listauser.page.html',
  styleUrls: ['./listauser.page.scss'],
})
export class ListauserPage implements OnInit {

  empleados: any;
  empresas: any;
  empleado: any;
  rol!: any;

  empleadosFiltrados: any;
  roles: string[] = [];
  provincias: any;
  rolSeleccionado: string = '';
  filtroEmpresa: any;
  filtroProvincia: any;

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  isDarkMode: any;
  componentes!: Observable<Componente[]>;


  constructor(
    public userLogin: UsuariosService,
    public empresaService: EmpresaService,
    public provinciasService: ProvinciasService,
    public authService: AuthService,
    public menuService: MenuService,
    private router: Router,
    private alertController: AlertController,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.getEmpresas();
    this.getEmpleados();
    this.getProvincias();
    this.getUserInfo();
  }

  getUserInfo() {
    // Llama al servicio para obtener la información del usuario
    this.userLogin.getUserInfo().subscribe(
      (response: any) => {
        // Verifica si la respuesta contiene un ID de usuario y empresa
        const idUser = response.id_user;
        const idEmpresa = response.id_empresa;

        // Almacena el ID de usuario y empresa en el localStorage si están presentes
        if (idUser) {
          localStorage.setItem('userId', idUser);
        }
        if (idEmpresa) {
          localStorage.setItem('companyId', idEmpresa);
        }

        // Continúa con el resto de la lógica de tu componente
        this.getEmpleados();
      },
      (error: any) => {
        console.error('Error al obtener información del usuario:', error);
        //this.presentAlert('Error', 'Error al obtener información del usuario');
      }
    );
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
    this.userLogin.getEmpleados().subscribe(
      (ans) => {
        this.empleados = ans;
        this.empleadosFiltrados = ans; // Inicializa empleadosFiltrados
        console.log('Empleados obtenidos:', this.empleados);
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }

  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (ans) => {
        this.empresas = ans;
        console.log('Empresas obtenidas:', this.empresas);
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

  getUsuarioInfo(usuario: any): any {
    const empresa = this.empresas.find((e: any) => e.id_empresa === usuario.id_empresa);
    return empresa ? { empresa: empresa.empresa, provincia: empresa.provincia } : { empresa: '', provincia: '' };
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

  filtrarEmpleados(criterio: string, valor: string) {
    if (!valor) {
      valor = '';
    }

    this.empleadosFiltrados = this.empleados.filter((empleado: any) => {
      const valorLower = valor.toLowerCase();
      switch (criterio) {
        case 'nombre':
          return empleado.nombre.toLowerCase().includes(valorLower);
        case 'apellido':
          return empleado.apellido.toLowerCase().includes(valorLower);
        case 'email':
          return empleado.email.toLowerCase().includes(valorLower);
        default:
          return false;
      }
    });
  }

  filtrarPorRol(rolSeleccionado: string) {
    if (rolSeleccionado === "") {
      // Mostrar todos los empleados
      this.empleadosFiltrados = this.empleados;
    } else {
      // Filtrar por el rol seleccionado
      this.empleadosFiltrados = this.empleados.filter((empleado: any) => {
        return empleado.rol.toLowerCase().includes(rolSeleccionado.toLowerCase());
      });
    }
  }

  // Método para filtrar empleados por empresa y/o provincia
  filtrarPorEmpresaProvincia() {
    // Filtra empleados basados en las selecciones de empresa y provincia
    this.empleadosFiltrados = this.empleados.filter((empleado: any) => {
      const filtroEmpresaCumple = !this.filtroEmpresa || empleado.id_empresa === this.filtroEmpresa;
      const filtroProvinciaCumple = !this.filtroProvincia || this.getUsuarioInfo(empleado).provincia === this.filtroProvincia;
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
    this.authService.logout().subscribe();
  }
}