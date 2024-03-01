import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';

import { Router } from '@angular/router';
import { Componente } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {

  ionicForm!: FormGroup;

  id_empresa: number | null = null;
  id_user: number | null = null;
  
  datos: any[] = [];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public contactService: ContactoService,
    public usuariosService: UsuariosService,
    public menuService: MenuService,
    public themeService: ThemeService,
  ) {
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();

    this.ionicForm = this.formBuilder.group({
      nomLocal: ['', [Validators.required]],
      direccion: [''],
      telf1: [''],
      telf2: [''],
      id_empresa: [''],
      id_user: [''],
    });
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();

    // Recuperar datos del almacenamiento local
    this.recuperarDatosLocalStorage();

    // Llamar al nuevo método para obtener el ID de usuario y empresa
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        // console.log('Id de Usuario:', idUsuario);
        // console.log('Id de Empresa:', idEmpresa);

        // Asignar los IDs obtenidos a las variables correspondientes
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;
      },
      (error) => {
        console.error('Error al obtener el ID del usuario y la empresa:', error);
      }
    );
  }

  // Método para obtener el ID de usuario y empresa desde el servidor
  obtenerIdUsuario(): Observable<{ idUsuario: number | null, idEmpresa: number | null }> {
    // Obtener el usuario del almacenamiento local
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      // Parsear el usuario obtenido del almacenamiento local
      const usuario = JSON.parse(usuarioString);
      const email = usuario.email;

      // Llamar al servicio para obtener el ID de usuario y empresa
      return this.usuariosService.getUserAndEmpresaByEmail(email).pipe(
        map(response => {
          // console.log('Respuesta del servidor en obtenerIdUsuario:', response);

          // Verificar la respuesta del servidor
          if (response && response.code === 200 && response.data) {
            // Acceder a las propiedades id_user e id_empresa según la estructura real de la respuesta
            const idUsuario = response.data.id_user ? response.data.id_user : null;
            const idEmpresa = response.data.id_empresa ? response.data.id_empresa : null;

            // Devolver los IDs obtenidos
            return { idUsuario, idEmpresa };
          } else {
            console.error('No se pudieron obtener los datos del usuario:', response.texto);
            // Devolver IDs nulos en caso de error
            return { idUsuario: null, idEmpresa: null };
          }
        }),
        catchError(error => {
          console.error('Error al obtener datos del usuario:', error);
          // Devolver IDs nulos en caso de error
          return of({ idUsuario: null, idEmpresa: null });
        })
      );
    } else {
      console.error('Usuario no encontrado en el almacenamiento local');
      // Devolver IDs nulos en caso de que no se encuentre el usuario
      return of({ idUsuario: null, idEmpresa: null });
    }
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();

    // Verificar si el usuario tiene permisos
    if (!(this.rol === 'administrador' || this.rol === 'encargado')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

      // Cerrar sesión en caso de no tener permisos
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

  // Método para enviar datos al servidor
  enviarDatos() {
    if (this.ionicForm.valid) {
      // Continuar solo si ambos valores no son nulos
      if (this.id_empresa !== null && this.id_user !== null) {
        // Crear un objeto con todas las propiedades necesarias, incluyendo idEmpresa e idUsuario
        const datos = { ...this.ionicForm.value, id_empresa: this.id_empresa, id_user: this.id_user };

        // Enviar los datos con los valores correctos
        this.contactService.subirDatos(datos, this.id_empresa, this.id_user).subscribe(
          (ans) => {
            console.log('Respuesta del servidor:', ans);

            // Limpiar el formulario después de enviarlo
            this.ionicForm.reset();

            // Obtener los datos guardados del localStorage
            const datosGuardadosString = localStorage.getItem('datos');
            const datosGuardados = datosGuardadosString ? JSON.parse(datosGuardadosString) : [];

            // Almacenar el nuevo dato en el localStorage y eliminar el anterior
            localStorage.setItem('datos', JSON.stringify([ans.data]));
            localStorage.removeItem('datosAnteriores');

            // Actualizar la lista de datos en la variable datos para que muestre el último
            this.recuperarDatosLocalStorage();
          },
          (error) => {
            console.error('Error en la solicitud:', error);
          }
        );
      } else {
        console.error('No se pudo obtener el id de la empresa o el id del usuario.');
      }
    }
  }

  // Método para recuperar datos del localStorage
  recuperarDatosLocalStorage() {
    const datosGuardadosString = localStorage.getItem('datos');
    this.datos = datosGuardadosString ? JSON.parse(datosGuardadosString) : [];
  }

  // Método para cambiar entre modos oscuro y claro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
