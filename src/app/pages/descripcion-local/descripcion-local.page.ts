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

  // Variables para almacenar datos del usuario y la empresa
  id_empresa: number | null = null;
  id_user: number | null = null;
  idEmpresa!: number | null;

  // Variables para almacenar los textos obtenidos
  textos: any;
  textosFiltrados: any;

  // Formulario reactivo para la entrada de texto
  ionicForm!: FormGroup;

  // Variables para el rol del usuario y el modo oscuro
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
    // Obtener el rol del usuario y configurar el modo oscuro
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();

    // Configurar el formulario reactivo
    this.ionicForm = this.formBuilder.group({
      nomLocal: ['', [Validators.required]],
      texto: [''],
      id_empresa: [''],
      id_user: [''],
    });
  }

  ngOnInit() {
    // Obtener los componentes del menú
    this.componentes = this.menuService.getMenuOpts();

    // Llamar al nuevo método para obtener datos del usuario y la empresa
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        // Asignar los valores obtenidos
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;

        // Obtener los textos después de obtener los datos del usuario
        this.getTexto();
      },
      (error) => {
        console.error('Error al obtener el id del usuario y la empresa:', error);
      }
    );    
  }

  // Método para obtener el id del usuario y la empresa
  obtenerIdUsuario(): Observable<{ idUsuario: number | null, idEmpresa: number | null }> {
    const usuarioString = localStorage.getItem('usuario');
  
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const email = usuario.email;
  
      return this.usuariosService.getUserAndEmpresaByEmail(email).pipe(
        map(response => {
          if (response && response.code === 200 && response.data) {
            const idUsuario = response.data.id_user ? response.data.id_user : null;
            const idEmpresa = response.data.id_empresa ? response.data.id_empresa : null;
  
            // Asegúrate de asignar idEmpresa
            this.idEmpresa = idEmpresa;
  
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
      console.error('Usuario no encontrado en el almacenamiento local');
      return of({ idUsuario: null, idEmpresa: null });
    }
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();

    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      
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

  // Método para enviar un nuevo texto al servidor
  enviarTexto() {
    if (this.ionicForm.valid) {
      if (this.id_empresa !== null && this.id_user !== null) {
        const datos = { ...this.ionicForm.value, id_empresa: this.id_empresa, id_user: this.id_user };

        this.textoService.subirTexto(datos, this.id_empresa, this.id_user).subscribe(
          (ans) => {
            // console.log('Respuesta del servidor:', ans);
            this.ionicForm.reset();
            // Actualizar la lista de textos después de enviar uno nuevo
            this.getTexto();
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

  // Método para obtener los textos del servidor
  getTexto() {
    if (this.idEmpresa !== null) {
      this.textoService.getTextosByEmpresa(this.idEmpresa).subscribe(
        (ans) => {
          // console.log('Respuesta del servidor:', ans);
  
          if (ans.code === 200) {
            this.textos = ans.data;
            this.textosFiltrados = ans.data;
            console.log('Textos obtenidos:', this.textos);
          } else {
            console.error('Error en la respuesta:', ans.texto);
          }
        },
        (error) => {
          console.error('Error al obtener los textos:', error);
        }
      );
    } else {
      console.error('ID de empresa no válido.');
    }
  }

  // Método para cambiar el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}