import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Componente, Horario } from 'src/app/interfaces/interfaces';
import { HorariosService } from '../../services/horarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiasService } from 'src/app/services/dias.service';
import { AlertController } from '@ionic/angular';

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
  horariosSeleccionados: Horario[] = [];

  horarioApertura: { [key: string]: string } = {};
  horarioCierre: { [key: string]: string } = {};
  diasSeleccionados: Set<string> = new Set<string>();
  dias: any;
  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  private actualizarDatosSubject = new Subject<void>();
  actualizarDatos$ = this.actualizarDatosSubject.asObservable();

  constructor(
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public horariosService: HorariosService,
    public authService: AuthService,
    public themeService: ThemeService,
    public usuariosService: UsuariosService,
    public diasService: DiasService,
    public menuService: MenuService,
    private router: Router
  ) {
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();
    this.ionicForm = this.formBuilder.group({
      id_empresa: [''],
      id_user: [''],
    });
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();

    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;

        if (this.id_empresa !== null) {
          this.getHorarios(); // Obtener los horarios al cargar la página
        } else {
          console.error('ID de empresa no válido.');
        }
      },
      (error) => {
        console.error('Error al obtener el id del usuario y la empresa:', error);
      }
    );

    this.actualizarDatosSubject.subscribe(() => {
      this.getHorarios(); // Actualizar los horarios al recibir un evento
    });
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    // console.log(this.rol);

    if (!(this.rol === 'administrador' || this.rol === 'encargado')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {

          localStorage.removeItem('role');
          localStorage.removeItem('usuario');

          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
          // Manejo de errores
        }
      )
    }
  }

  getHorarios() {
    // Verificar si el rol del usuario es 'administrador' o 'encargado'
    if (this.rol === 'administrador' || this.rol === 'encargado') {
      // Obtener el email del usuario
      const email = this.authService.getUserEmail();
  
      // Verificar si el email no es nulo antes de llamar a la función
      if (email !== null) {
        this.usuariosService.getIdEmpresaPorEmail(email).subscribe(
          (response) => {
            if (response.code === 200 && response.data && response.data.id_empresa) {
              this.id_empresa = response.data.id_empresa;
  
              // Ahora que tenemos el id_empresa, podemos obtener los horarios
              const idEmpresaAsNumber = this.id_empresa as number; // Convertir a número
              if (!isNaN(idEmpresaAsNumber)) {
                this.horariosService.obtenerHorasByEmpresa(idEmpresaAsNumber).subscribe(
                  (horariosResponse) => {
                    if (horariosResponse.code === 200 && Array.isArray(horariosResponse.data)) {
                      this.horariosSeleccionados = horariosResponse.data.map((horario: Horario) => {
                        const { hora_apertura, hora_cierre, ...resto } = horario;
                        return { hora_apertura: hora_apertura, hora_cierre: hora_cierre, ...resto };
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
  
  formatHora(hora: string | undefined): string {
    // Verificar si la hora es nula o indefinida antes de manipular la cadena
    if (hora) {
      // Convertir a un objeto Date para asegurar la correcta manipulación de la hora
      const timeDate = new Date(`1970-01-01T${hora}`);
      // Formatear la hora como HH:mm
      const formattedTime = timeDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return formattedTime;
    } else {
      return ''; // Otra alternativa si la hora es nula o indefinida
    }
  }
  
  
  private formatearHora(hora: string | undefined): string {
    if (hora) {
      const timeDate = new Date(`1970-01-01T${hora}`);
      const formattedTime = timeDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return formattedTime || 'No disponible';
    } else {
      return 'No disponible';
    }
  }
  
  
  

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

  agregarHorario(dia: string): void {
    if (!dia) {
      console.error('El valor del día es nulo o indefinido.');
      return;
    }

    const hora_apertura = this.horarioApertura[dia];
    const hora_cierre = this.horarioCierre[dia];

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
            this.horarioApertura[dia] = '';
            this.horarioCierre[dia] = '';
            this.actualizarDatosSubject.next(); // Emitir evento para actualizar datos
          },
          (error) => {
            console.error('Error al subir el horario:', error);
          }
        );
      } else {
        console.error('No se pudo obtener el id de la empresa o el id del usuario.');
      }
    });
  }

  async borrarHorario(id_horario: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas borrar este horario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Borrado de horario cancelado');
          }
        },
        {
          text: 'Borrar',
          handler: async () => {
            try {
              await this.horariosService.borrarHorario(id_horario);
              console.log('Horario borrado correctamente');
              this.actualizarDatosSubject.next(); // Emitir evento para actualizar datos
            } catch (error) {
              console.error('Error al borrar el horario:', error);
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
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
