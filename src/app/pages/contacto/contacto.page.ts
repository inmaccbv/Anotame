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

  id_empresa: number | null = null;
  id_user: number | null = null;
  idEmpresa!: number | null;

  datos: any;
  datosFiltrados: any;

  ionicForm!: FormGroup;
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

    // Llamar al método para obtener datos del usuario y la empresa
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        // Asignar los valores obtenidos
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;

        // Obtener los textos después de obtener los datos del usuario
        this.getDatos();
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

    if (!(this.rol === 'administrador' || this.rol === 'encargado')) {
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
    }
  }

  // Método para enviar datos al servidor
  enviarDatos() {
    if (this.ionicForm.valid) {
      if (this.id_empresa !== null && this.id_user !== null) {
        const datos = { ...this.ionicForm.value, id_empresa: this.id_empresa, id_user: this.id_user };

        this.contactService.subirDatos(datos, this.id_empresa, this.id_user).subscribe(
          (ans) => {
            // console.log('Respuesta del servidor:', ans);

            this.ionicForm.reset();

            this.getDatos();
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
   getDatos() {
    if (this.idEmpresa !== null) {
      this.contactService.getDatosByEmpresa(this.idEmpresa).subscribe(
        (ans) => {
          // console.log('Respuesta del servidor:', ans);
  
          if (ans.code === 200) {
            this.datos = ans.data;
            this.datosFiltrados = ans.data;
            console.log('Datos obtenidos:', this.datos);
          } else {
            console.error('Error en la respuesta:', ans.texto);
          }
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
    } else {
      console.error('ID de empresa no válido.');
    }
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
