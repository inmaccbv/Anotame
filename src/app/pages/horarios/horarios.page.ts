import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Componente, Horario } from 'src/app/interfaces/interfaces';
import { HorariosService } from '../../services/horarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  ionicForm: FormGroup;

  id_empresa: number | null = null;
  id_user: number | null = null;

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  diasSeleccionados: Set<string> = new Set<string>();

  cerradoMostrado: { [key: string]: boolean } = {};

  horariosSeleccionados: Horario[] = [];
  hora_apertura: { [key: string]: string } = {};
  hora_cierre: { [key: string]: string } = {};

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public horariosService: HorariosService,
    public authService: AuthService,
    public themeService: ThemeService,
    public usuariosService: UsuariosService,
    public menuService: MenuService,
  ) {
    // Inicialización del formulario y obtención del rol del usuario
    this.ionicForm = this.formBuilder.group({
      id_empresa: [''],
      id_user: [''],
    });
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    // Obtener la lista de componentes del menú
    this.componentes = this.menuService.getMenuOpts();

    // Obtener el id del usuario y de la empresa al inicializar la página
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;

        // Verificar si el id de la empresa no es nulo antes de continuar
        if (this.id_empresa !== null) {

          this.initHorariosPredeterminados();
          this.getHorarios(); // Obtener los horarios al cargar la página
        } else {
          console.error('ID de empresa no válido.');
        }
      },
      (error) => {
        console.error('Error al obtener el id del usuario y la empresa:', error);
      }
    );
  }

  // Obtener el id del usuario y de la empresa
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


  // Obtener el rol del usuario y verificar permisos
  getUserRole() {
    this.rol = this.authService.getUserRole();

    if (!(this.rol === 'administrador' || this.rol === 'encargado')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('role');
          localStorage.removeItem('usuario');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error al cerrar sesión:', error);
          // Manejo de errores
        }
      )
    }
  }

  // Agregar un nuevo horario
  agregarHorario(dia: string): void {
    if (!dia) {
      console.error('El valor del día es nulo o indefinido.');
      return;
    }

    const hora_apertura = this.hora_apertura[dia];
    const hora_cierre = this.hora_cierre[dia];

    this.obtenerIdUsuario().subscribe(({ idUsuario, idEmpresa }) => {
      if (idUsuario !== null && idEmpresa !== null) {
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;

        const nuevoHorario: Horario = {
          dia: dia,
          hora_apertura: hora_apertura,
          hora_cierre: hora_cierre,
          id_user: this.id_user,
          id_empresa: this.id_empresa
        };

        const indiceExistente = this.horariosSeleccionados.findIndex(horario => horario.dia === dia);

        if (indiceExistente !== -1) {
          this.horariosSeleccionados.splice(indiceExistente, 1);
        }

        this.horariosService.subirHorario(nuevoHorario, this.id_empresa, this.id_user).subscribe(
          (ans) => {
            console.log('Respuesta del servidor al subir horario:', ans);
            this.horariosSeleccionados.push(nuevoHorario);
            this.diasSeleccionados.add(dia);
            this.hora_apertura[dia] = '';
            this.hora_cierre[dia] = '';

            this.getHorarios();
          },
          (error) => {
            console.error('Error al subir el horario:', error);
            console.log('Respuesta completa del servidor:', error);
          }
        );
      } else {
        console.error('No se pudo obtener el id de la empresa o el id del usuario.');
      }
    });
  }

  // Obtener los horarios del usuario actual
  getHorarios() {
    if (this.rol === 'administrador' || this.rol === 'encargado') {
      const email = this.authService.getUserEmail();

      if (email !== null) {
        this.usuariosService.getIdEmpresaPorEmail(email).subscribe(
          (response) => {
            if (response.code === 200 && response.data && response.data.id_empresa) {
              this.id_empresa = response.data.id_empresa;

              const idEmpresaAsNumber = this.id_empresa as number;
              if (!isNaN(idEmpresaAsNumber)) {
                this.horariosService.obtenerHorasByEmpresa(idEmpresaAsNumber).subscribe(
                  (horariosResponse) => {
                    if (horariosResponse.code === 200 && Array.isArray(horariosResponse.data)) {
                      this.horariosSeleccionados = this.horariosSeleccionados.map((horario: Horario) => {
                        const { dia, hora_apertura, hora_cierre } = horario;
                        const indiceExistente = horariosResponse.data.findIndex((h: { dia: string; }) => h.dia === dia);

                        if (indiceExistente !== -1) {
                          return {
                            dia,
                            hora_apertura: horariosResponse.data[indiceExistente].hora_apertura,
                            hora_cierre: horariosResponse.data[indiceExistente].hora_cierre,
                            id_user: horariosResponse.data[indiceExistente].id_user,
                            id_empresa: horariosResponse.data[indiceExistente].id_empresa
                          };
                        } else {
                          return {
                            dia,
                            hora_apertura: 'cerrado',
                            hora_cierre: 'cerrado',
                            id_user: this.id_user as number,
                            id_empresa: this.id_empresa as number
                          };
                        }
                      });

                      // Ordenar los horarios según los días de la semana
                      this.horariosSeleccionados = this.horariosSeleccionados.sort((a, b) => {
                        const indexA = this.diasSemana.indexOf(a.dia);
                        const indexB = this.diasSemana.indexOf(b.dia);
                        return indexA - indexB;
                      });

                      console.log('Horarios obtenidos:', this.horariosSeleccionados);
                    } else {
                      console.error('La respuesta del servicio de horarios no es válida:', horariosResponse);
                    }
                  },
                  (errorHorarios) => {
                    console.error('Error al obtener los horarios:', errorHorarios);
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

  // Inicializar horarios predeterminados
  initHorariosPredeterminados() {
    this.horariosSeleccionados = this.diasSemana.map(dia => ({
      dia: dia,
      hora_apertura: '00:00',
      hora_cierre: '00:00',
      id_user: this.id_user !== null ? this.id_user : 0,
      id_empresa: this.id_empresa !== null ? this.id_empresa : 0
    }));

    this.cerradoMostrado = {};
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
