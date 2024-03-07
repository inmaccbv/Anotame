import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { AuthEmpresaService } from 'src/app/services/auth-empresa.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuService } from 'src/app/services/menu.service';
import { DetallesPopoverPage } from '../detalles-popover/detalles-popover.page';
import { Componente, Empresa, Usuario } from 'src/app/interfaces/interfaces';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

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
  filtroTipoLocal: string = '';
  usuarios: any[] = []; 
  usuariosFiltrados: any[] = [];

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  idEmpresa: any;
  empleados: any[] = [];
  empleados2: any;
  empleadosFiltrados: any;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  @ViewChildren('empresaRow') empresaRows!: QueryList<ElementRef>;

  constructor(
    private empresaService: EmpresaService,
    public userLogin: UsuariosService,
    public provinciasService: ProvinciasService,
    public authService: AuthService,
    public authEmpresa: AuthEmpresaService,
    public themeService: ThemeService,
    public menuService: MenuService,
    private router: Router,
    private alertController: AlertController,
    public popoverController: PopoverController
  ) {
    // Inicializar y obtener el rol del usuario al cargar la página
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    // Obtener el menú y la lista de empresas al iniciar la página
    this.componentes = this.menuService.getMenuOpts();
    // this.getProvincias();
    // Llamar a getEmpleados y obtener el id_user
    
    // Obtener el correo del localStorage
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const email = usuario.email;
  
      // Llamada a la función para obtener el id_empresa
      this.obtenerIdEmpresaPorEmail(email);
      
      // Obtener la lista de usuarios
      this.userLogin.getEmpleados().subscribe(
        (usuarios: any) => {
          this.usuarios = usuarios;
          console.log('Usuarios obtenidos:', this.usuarios);
          
          // Verificar si this.idEmpresa no es null antes de llamar a la función
          if (this.idEmpresa !== null) {
            this.filtrarUsuariosPorIdEmpresa(this.idEmpresa);
          }
        },
        (error) => {
          console.error('Error al obtener usuarios:', error);
        }
      );
    } else {
      console.error('Usuario no encontrado en el localStorage');
    }
  }

  obtenerIdEmpresaPorEmail(email: string): void {
    this.userLogin.getIdEmpresaPorEmail(email).subscribe(
      (idEmpresa: any) => {
        if (idEmpresa !== null) {
          // Almacenar el id_empresa obtenido en la propiedad del componente
          this.idEmpresa = idEmpresa;
          console.log('ID de Empresa:', idEmpresa);
          
          // Filtrar la lista de usuarios basándote en el id_empresa
          this.filtrarUsuariosPorIdEmpresa(idEmpresa);
        } else {
          console.error('No se pudo obtener el ID de Empresa.');
        }
      },
      error => {
        console.error('Error al obtener el ID de Empresa:', error);
      }
    );
  }

  filtrarUsuariosPorIdEmpresa(idEmpresa: number): void {
    console.log('Filtrando usuarios por id_empresa:', idEmpresa);
    console.log('Usuarios antes de filtrar:', this.usuarios);
    
    // Filtra la lista de usuarios basándote en el id_empresa
    this.usuariosFiltrados = this.usuarios.filter(usuario => usuario.id_empresa === idEmpresa);
  
    console.log('Usuarios filtrados:', this.usuariosFiltrados);
  }

  // Obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);

    // Verificar si el usuario tiene permisos de administrador
    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      // Cerrar sesión si no es administrador y redirigir al inicio
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
    }
  }




  getEmpleados() {
    this.userLogin.getEmpleados().subscribe(
      (ans) => {
        this.empleados2 = ans;
        this.empleadosFiltrados = ans; // Inicializa empleadosFiltrados
        console.log('Empleados obtenidos:', this.empleados2);
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }


  // Función para obtener empleados y filtrar por ID_EMPRESA
  getEmpleadosPorEmpresa(idUsuario: any): Observable<any[]> {
    return this.empresaService.getEmpleadosPorEmpresa(idUsuario).pipe(
      tap((empleados) => {
        this.empleados = empleados;
        this.empleadosFiltrados = empleados; // Inicializa empleadosFiltrados
        console.log('Empleados obtenidos:', this.empleados);
      }),
      catchError((error) => {
        console.error('Error al obtener empleados:', error);
        return EMPTY; // O manejar el error según tus necesidades
      })
    );
  }











  // Función para obtener la lista completa de empresas
  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (ans) => {
        this.empresas = ans;
        console.log('Empresas obtenidas:', this.empresas);
        // Inicializar la lista filtrada con todas las empresas al principio
        this.empresasFiltrados = this.empresas;
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
  }


  // // Obtener la lista de provincias
  // getProvincias() {
  //   this.provinciasService.getProvincias().subscribe(async (ans) => {
  //     this.provincias = ans;
  //   });
  // }

  // Mostrar alerta de confirmación antes de borrar una empresa
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
              // Llamar al servicio para borrar la empresa y actualizar la lista
              this.empresaService.borrarEmpresa(id_empresa).subscribe(async (ans) => {
                console.log(ans);
                window.location.reload();
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

  // Obtener información sobre la empresa de un usuario
  getUsuarioInfo(usuario: any): any {
    const empresa = this.empresasFiltrados.find((e: any) => e.id_empresa === usuario.id_empresa);
    return empresa ? { empresa: empresa.empresa, provincia: empresa.provincia } : { empresa: '', provincia: '' };
  }

  // Filtrar la lista de empresas por nombre, ciudad y tipo de local
  filtrarEmpresa(criterio: string, event: any) {
    const valor = event.target.value || '';

    // Filtrar por nombre, ciudad y tipo de local
    this.empresasFiltrados = this.empresas.filter((empresa: any) => {
      const valorLower = valor.toLowerCase();

      switch (criterio) {
        case 'empresa':
          return empresa.empresa.toLowerCase().includes(valorLower);
        case 'ciudad':
          return empresa.ciudad.toLowerCase().includes(valorLower);
        case 'tipoLocal':
          return empresa.tipoLocal.toLowerCase().includes(valorLower);
        default:
          return (
            empresa.empresa.toLowerCase().includes(valorLower) ||
            empresa.ciudad.toLowerCase().includes(valorLower) ||
            empresa.tipoLocal.toLowerCase().includes(valorLower)
          );
      }
    });

    // Aplicar filtro adicional por tipo de local
    if (this.filtroTipoLocal) {
      this.empresasFiltrados = this.empresasFiltrados.filter((empresa: any) =>
        empresa.tipoLocal.toLowerCase().includes(this.filtroTipoLocal.toLowerCase())
      );
    }
  }

  // Filtrar la lista de empresas por empresa y/o provincia
  filtrarPorEmpresaProvincia() {
    // Filtrar por empresa y provincia
    this.empresasFiltrados = this.empresas.filter((empresa: any) => {
      const filtroEmpresaCumple = !this.filtroEmpresa || empresa.id_empresa === this.filtroEmpresa;
      const filtroProvinciaCumple =
        !this.filtroProvincia || this.getUsuarioInfo(empresa).provincia === this.filtroProvincia;
      return filtroEmpresaCumple && filtroProvinciaCumple;
    });
  }

  // Manejar el cambio en el desplegable de empresa
  onEmpresaChange(event: any) {
    this.filtroEmpresa = event.detail.value;
    this.filtrarPorEmpresaProvincia();
  }

  // Manejar el cambio en el desplegable de provincia
  onProvinciaChange(event: any) {
    this.filtroProvincia = event.detail.value;
    this.filtrarPorEmpresaProvincia();
  }

  // Mostrar todas las empresas al seleccionar "Mostrar Todos" en el desplegable de empresa
  onMostrarTodosEmpresas() {
    this.filtroEmpresa = null;
    this.filtrarPorEmpresaProvincia();
  }

  // Mostrar todas las provincias al seleccionar "Mostrar Todos" en el desplegable de provincia
  onMostrarTodosProvincias() {
    this.filtroProvincia = null;
    this.filtrarPorEmpresaProvincia();
  }

  // Manejar el cambio en el desplegable de tipo de local
  onTipoLocalChange(event: any) {
    this.filtroTipoLocal = event.detail.value;
    this.aplicarFiltros();
  }

  // Aplicar todos los filtros (empresa, provincia, tipo de local) a la lista de empresas
  aplicarFiltros() {
    this.empresasFiltrados = this.empresas.filter((empresa: any) => {
      const filtroEmpresaCumple = !this.filtroEmpresa || empresa.id_empresa === this.filtroEmpresa;
      const filtroProvinciaCumple =
        !this.filtroProvincia || this.getUsuarioInfo(empresa).provincia === this.filtroProvincia;
      const filtroTipoLocalCumple =
        !this.filtroTipoLocal || empresa.tipoLocal.toLowerCase().includes(this.filtroTipoLocal.toLowerCase());

      return filtroEmpresaCumple && filtroProvinciaCumple && filtroTipoLocalCumple;
    });
  }

  // Alternar entre modos oscuro y claro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
    const contentElement = document.querySelector('ion-content');
    if (contentElement) {
      contentElement.classList.toggle('dark-mode', this.isDarkMode);
    }
  }

  // Cerrar sesión del usuario
  cerrarSesion(): void {
    this.authEmpresa.logout().subscribe();
  }
}
