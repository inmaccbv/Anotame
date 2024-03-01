import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

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

  // Variable para almacenar horarios de apertura y cierre por día
  horarioApertura: { [key: string]: string } = {};
  horarioCierre: { [key: string]: string } = {};
  horario: any;

  // Conjunto para rastrear los días seleccionados
  diasSeleccionados: Set<string> = new Set<string>();
  dias: any;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

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
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    this.ionicForm = this.formBuilder.group({
      id_empresa: [''],
      id_user: [''],
    });

    this.horariosService.obtenerHorarios().subscribe((nuevosHorarios) => {
      // console.log('Nuevos horarios recibidos en HorariosPage:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios || [];
      // console.log('this.horariosSeleccionados:', this.horariosSeleccionados);
    });
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();

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

    this.horariosService.horarios$.subscribe((nuevosHorarios) => {
      // console.log('Nuevos horarios recibidos en HorariosPage:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios || [];
    });
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

  getDias() {
    this.diasService.getDias().subscribe(async (ans) => {
      this.dias = ans;
      console.log('Clientes datos:', this.dias);
    });
  }

  agregarHorario(dia: string): void {
    // Verificar si dia no es nulo o indefinido
    if (!dia) {
      console.error('El valor del día es nulo o indefinido.');
      return; // Salir de la función si dia es nulo o indefinido
    }
  
    const horaApertura = this.horarioApertura[dia];
    const horaCierre = this.horarioCierre[dia];
  
    console.log('Dia:', dia);
    console.log('Hora de Apertura:', horaApertura);
    console.log('Hora de Cierre:', horaCierre);
  
    // Obtener id_user e id_empresa
    this.obtenerIdUsuario().subscribe(({ idUsuario, idEmpresa }) => {
      if (idUsuario !== null && idEmpresa !== null) {
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;
  
        const nuevoHorario: Horario = {
          dia: dia,
          horaApertura: horaApertura,
          horaCierre: horaCierre,
          id_user: this.id_user,
          id_empresa: this.id_empresa
        };
  
        // Verificar si el día ya fue seleccionado
        if (!this.diasSeleccionados.has(dia)) {
          // Verificar si ya hay un horario para este día
          const indiceExistente = this.horariosSeleccionados.findIndex(horario => horario.dia === dia);
  
          if (indiceExistente !== -1) {
            // Si ya existe, eliminar el horario existente
            this.horariosSeleccionados.splice(indiceExistente, 1);
          }
  
          // Llamar a la función para subir el horario al servidor
          this.horariosService.subirHorario(nuevoHorario, this.id_empresa, this.id_user).subscribe(
            (ans) => {
              console.log('Respuesta del servidor al subir horario:', ans);
  
              // Agregar el nuevo horario y actualizar el conjunto de días seleccionados
              this.horariosSeleccionados.push(nuevoHorario);
              this.diasSeleccionados.add(dia);
  
              // Limpiar los campos de entrada
              this.horarioApertura[dia] = '';
              this.horarioCierre[dia] = '';
  
              // Guardar los horarios en el servicio y en localStorage
              this.horariosService.actualizarHorarios(this.horariosSeleccionados);
              localStorage.setItem('horarios', JSON.stringify(this.horariosSeleccionados));
  
              // Recargar la página
              // window.location.reload();
            },
            (error) => {
              console.error('Error al subir el horario:', error);
            }
          );
        } else {
          console.log('El día ya está seleccionado.');
        }
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
              // Llamada al servicio para borrar el horario
              await this.horariosService.borrarHorario(id_horario);
    
              console.log('Horario borrado correctamente');
    
              this.getHorarios();
              window.location.reload();
    
              // Eliminar el horario del localStorage
              const horariosLocalStorage = JSON.parse(localStorage.getItem('horarios') || '[]');
              const horariosActualizados = horariosLocalStorage.filter((horario: any) => horario.id_horario !== id_horario);
              localStorage.setItem('horarios', JSON.stringify(horariosActualizados));
    
              // Verificar si solo queda un horario en el localStorage y borrarlo también
              if (horariosActualizados.length === 1) {
                localStorage.removeItem('horarios');
              }
    
            } catch (error) {
              console.error('Error al borrar el horario:', error);
            }
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  getHorarios() {
    this.horariosService.getHorarios().subscribe(async (ans) => {
      this.horario = ans;
      console.log('Clientes datos:', this.horario);
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