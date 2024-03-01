import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Componente } from 'src/app/interfaces/interfaces';

import { TextoService } from '../../services/texto.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuService } from 'src/app/services/menu.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-descripcion-local',
  templateUrl: './descripcion-local.page.html',
  styleUrls: ['./descripcion-local.page.scss'],
})
export class DescripcionLocalPage implements OnInit {

  id_empresa: number | null = null;
  id_user: number | null = null;

  ionicForm!: FormGroup;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public textoService: TextoService,
    public authService: AuthService,
    public usuariosService: UsuariosService,
    public menuService: MenuService,
    public themeService: ThemeService,
  ) {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    this.ionicForm = this.formBuilder.group({
      nomLocal: ['', [Validators.required]],
      texto: [''],
      id_empresa: [''],
      id_user: [''],
    });
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.recuperarTextoLocalStorage();

    // Llamar al nuevo método para obtener datos del usuario y la empresa
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        // console.log('Id de Usuario:', idUsuario);
        // console.log('Id de Empresa:', idEmpresa);

        // Asignar los valores obtenidos a las variables del componente
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;
      },
      (error) => {
        console.error('Error al obtener el id del usuario y la empresa:', error);
      }
    );
  }

  // Método para obtener el id del usuario y la empresa
  obtenerIdUsuario(): Observable<{ idUsuario: number | null, idEmpresa: number | null }> {
    // Obtener el usuario del localStorage
    const usuarioString = localStorage.getItem('usuario');

    // Verificar si el usuario existe en el localStorage
    if (usuarioString) {
      // Parsear el usuario
      const usuario = JSON.parse(usuarioString);
      const email = usuario.email;

      // Llamar al servicio para obtener el usuario y la empresa por el correo electrónico
      return this.usuariosService.getUserAndEmpresaByEmail(email).pipe(
        map(response => {
          // console.log('Respuesta del servidor en obtenerIdUsuario:', response);

          // Verificar si la respuesta es válida y tiene datos
          if (response && response.code === 200 && response.data) {
            // Acceder a las propiedades id_user e id_empresa según la estructura real de la respuesta
            const idUsuario = response.data.id_user ? response.data.id_user : null;
            const idEmpresa = response.data.id_empresa ? response.data.id_empresa : null;

            // Devolver los valores obtenidos
            return { idUsuario, idEmpresa };
          } else {
            console.error('No se pudieron obtener los datos del usuario:', response.texto);
            return { idUsuario: null, idEmpresa: null };
          }
        }),
        catchError(error => {
          console.error('Error al obtener datos del usuario:', error);
          return of({ idUsuario: null, idEmpresa: null });
        })
      );
    } else {
      // Mostrar un error si el usuario no se encuentra en el localStorage
      console.error('Usuario no encontrado en el almacenamiento local');
      return of({ idUsuario: null, idEmpresa: null });
    }
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    // Obtener el rol del usuario del servicio de autenticación
    this.rol = this.authService.getUserRole();
    // console.log(this.rol);

    // Verificar si el usuario no tiene el rol de administrador
    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      
      // Cerrar sesión y redirigir al inicio de sesión
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('role');
          localStorage.removeItem('usuario');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      );
    }
  }

  // Método para enviar el texto introducido
  enviarTexto() {
    // Verificar si el formulario es válido
    if (this.ionicForm.valid) {
      // Continuar solo si los valores no son nulos
      if (this.id_empresa !== null && this.id_user !== null) {
        // Crear un objeto que contenga todas las propiedades necesarias, incluyendo idEmpresa e idUsuario
        const datos = { ...this.ionicForm.value, id_empresa: this.id_empresa, id_user: this.id_user };

        // Enviar el texto con los datos correctos
        this.textoService.subirTexto(datos, this.id_empresa, this.id_user).subscribe(
          (ans) => {
            console.log('Respuesta del servidor:', ans);
            // Limpiar el formulario después de enviarlo
            this.ionicForm.reset();

            // Obtener los textos guardados del localStorage
            const textosGuardadosString = localStorage.getItem('textos');
            const textosGuardados = textosGuardadosString ? JSON.parse(textosGuardadosString) : [];

            // Agregar el nuevo texto al array
            textosGuardados.push(ans.data);

            // Almacenar el texto actualizado en el localStorage
            localStorage.setItem('textos', JSON.stringify(textosGuardados));

            window.location.reload();
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

  // Método para recuperar el texto del localStorage y mostrarlo en el formulario
  recuperarTextoLocalStorage() {
    // Obtener los textos guardados del localStorage
    const textosGuardadosString = localStorage.getItem('textos');
    const textosGuardados = textosGuardadosString ? JSON.parse(textosGuardadosString) : [];
    
    // Asumo que quieres mostrar el último texto guardado
    const ultimoTextoGuardado = textosGuardados.length > 0 ? textosGuardados[textosGuardados.length - 1] : null;
  
    // Actualizar los valores en el formulario si hay un texto guardado
    if (ultimoTextoGuardado) {
      this.ionicForm.patchValue({
        nomLocal: ultimoTextoGuardado.nomLocal,
        texto: ultimoTextoGuardado.texto,
      });
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
