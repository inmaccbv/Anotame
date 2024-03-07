import { Component, OnInit, AfterViewInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Componente } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { HorariosService } from 'src/app/services/horarios.service';

@Component({
  selector: 'app-reservascli',
  templateUrl: './reservascli.page.html',
  styleUrls: ['./reservascli.page.scss'],
})
export class ReservascliPage implements OnInit, AfterViewInit {
  @Output() reservaEnviada = new EventEmitter<any>();

  envioReservaEnProceso = false;

  reservaForm!: FormGroup;
  reservas: any;
  idEmpresa: any;

  esLocale = es;
  horariosRestaurante: any[] = [];

  fechaSeleccionada: any;
  fechaCreacionActual: string = '';
  static ESTADO_PENDIENTE = 'pendiente';
  static ESTADO_CONFIRMADA = 'confirmada';
  static ESTADO_CANCELADA = 'cancelada';

  submitted = false;
  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private menuCli: MenuCliService,
    private reservasService: ReservasService,
    private clienteService: ClientesService,
    public authServiceCli: AuthClienteService,
    public horariosService: HorariosService,
    private notificacionService: NotificacionService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();

    // Inicializa el formulario para las reservas
    this.reservaForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      numPax: ['', Validators.required],
      fechaHoraReserva: ['', Validators.required],
      notasEspeciales: ['', Validators.required],
      id_cliente: [''],
      estadoReserva: ['pendiente', Validators.required],
      fechaCreacion: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    this.obtenerFechaActual();
    this.cargarReservaGuardadas();

    // Recuperar el valor de id_empresa del localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

    console.log('ID Empresa:', this.idEmpresa);

    // Llamada al servicio para obtener los horarios por empresa
    if (this.idEmpresa) {
      this.horariosService.obtenerHorasByEmpresa(this.idEmpresa).subscribe(
        (response) => {
          console.log('Datos de horarios:', response);
          this.horariosRestaurante = response.data; // Guarda los horarios en la variable
  
          // Establece la fecha mínima en la parte de la fecha
          this.reservaForm.get('fechaHoraReserva')?.setValue(new Date().toISOString());
  
        },
        (error) => {
          console.error('Error al obtener horarios:', error);
        }
      );
    }
  }
  
  ngAfterViewInit(): void {
    this.obtenerFechaActual();
    this.changeDetectorRef.detectChanges();
  }

  mostrarFormulario(event: any) {
    const horaSeleccionada = new Date(event.detail.value);
    const diaSeleccionado = format(horaSeleccionada, 'EEEE', { locale: this.esLocale });
    horaSeleccionada.setUTCHours(horaSeleccionada.getHours());
  
    const diaSeleccionadoNormalizado = diaSeleccionado.charAt(0).toUpperCase() + diaSeleccionado.slice(1).toLowerCase();
    const horarioDiaSeleccionado = this.horariosRestaurante.find(horario =>
      horario.dia.toLowerCase() === diaSeleccionadoNormalizado.toLowerCase()
    );
  
    console.log('Hora seleccionada (después del ajuste de zona horaria):', horaSeleccionada);
    console.log('Día seleccionado (después del ajuste de zona horaria):', diaSeleccionado);
    console.log('Horario del día seleccionado:', horarioDiaSeleccionado);
  
    // Verifica si hay horarios para el día seleccionado
    if (horarioDiaSeleccionado) {
      const [aperturaHours, aperturaMinutes] = horarioDiaSeleccionado.hora_apertura.split(':');
      const [cierreHours, cierreMinutes] = horarioDiaSeleccionado.hora_cierre.split(':');
  
      const horaApertura = new Date();
      horaApertura.setUTCHours(Number(aperturaHours), Number(aperturaMinutes), 0);
  
      const horaCierre = new Date();
      horaCierre.setUTCHours(Number(cierreHours), Number(cierreMinutes), 0);
  
      console.log('Hora de apertura:', horaApertura);
      console.log('Hora de cierre:', horaCierre);
  
      console.log('Comparación de horas:');
      console.log('Hora seleccionada:', horaSeleccionada);
      console.log('Hora de apertura:', horaApertura);
      console.log('Hora de cierre:', horaCierre);
  
      if (horaSeleccionada >= horaApertura && horaSeleccionada < horaCierre) {
        console.log('El restaurante está abierto en este momento.');
      } else {
        this.mostrarMensajeError('Lo sentimos, el restaurante se encuentra cerrado en este momento. Disculpen las molestias.');
        this.reservaForm.get('fechaHoraReserva')?.setValue(null);
      }
    } else {
      console.log('No se encontró el horario para el día seleccionado.');
      this.mostrarMensajeError('Lo sentimos, el restaurante se encuentra cerrado en este momento. Disculpen las molestias.');
      this.reservaForm.get('fechaHoraReserva')?.setValue(null);
    }
  }
  

  mostrarMensajeError(mensaje: string) {
    this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  obtenerIdCliente(): Observable<string | null> {
    const clienteString = localStorage.getItem('cliente');

    if (clienteString) {
      const cliente = JSON.parse(clienteString);
      const email = cliente.email;

      return this.clienteService.getUserByEmail(email).pipe(
        map(response => {
          console.log('Respuesta del servidor en obtenerIdCliente:', response);

          if (response && response.code === 200 && response.data) {
            // Puedes acceder a la propiedad id_cliente según la estructura real de tu respuesta
            return response.data.id_cliente ? response.data.id_cliente.toString() : null;
          } else {
            console.error('No se pudieron obtener los datos del usuario:', response.texto);
            return null;
          }
        }),
        catchError(error => {
          console.error('Error al obtener datos del usuario:', error);
          return of(null);
        })
      );
    } else {
      console.error('Usuario no encontrado en el almacenamiento local');
      return of(null);
    }
  }

  enviarReserva() {
    if (this.reservaForm.valid) {
      // Añade una verificación para evitar envíos múltiples
      if (!this.envioReservaEnProceso) {
        this.envioReservaEnProceso = true;

        this.obtenerIdCliente().subscribe(
          (id_cliente) => {
            // Verifica si se obtuvo el id_cliente
            if (id_cliente) {
              // Construcción del Objeto Reserva
              const nuevaReserva = {
                numPax: this.reservaForm.get('numPax')?.value,
                fechaHoraReserva: this.reservaForm.get('fechaHoraReserva')?.value,
                notasEspeciales: this.reservaForm.get('notasEspeciales')?.value,
                estadoReserva: this.reservaForm.get('estadoReserva')?.value,
                fechaCreacion: this.reservaForm.get('fechaCreacion')?.value,
                id_cliente: id_cliente,
                id_empresa: parseInt(localStorage.getItem('id_empresa') || '', 10)
              };
  
              // Envío de Notificación
              this.notificacionService.enviarNotificacion(nuevaReserva);
  
              // Envío de Reserva al Servicio
              this.reservasService.addReserva(nuevaReserva).subscribe(
                () => {
                  // Guardado Local y Actualización de la Vista
                  this.guardarReservaEnLocalStorage(nuevaReserva);
                  this.envioReservaEnProceso = false;
  
                  // Recarga la página después de un breve intervalo
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                },
                (error) => {
                  console.error('Error al agregar reserva:', error);
                  this.envioReservaEnProceso = false;
                }
              );
            } else {
              console.error('Id_cliente no encontrado.');
              this.envioReservaEnProceso = false;
            }
          },
          (error) => {
            console.error('Error al obtener el id_cliente:', error);
            this.envioReservaEnProceso = false;
          }
        );
      }
    } else {
      console.error('El formulario de reseña no es válido.');
    }
  }

  guardarReservaEnLocalStorage(reserva: any) {
    // Obtener las reseñas almacenadas actualmente
    const reservasGuardadas = localStorage.getItem('reservas') || '[]';
    const reservas = JSON.parse(reservasGuardadas);

    // Agregar la nueva reseña al arreglo
    reservas.push(reserva);

    // Guardar el arreglo actualizado en el localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }

  cargarReservaGuardadas() {
    const reservasGuardadas = localStorage.getItem('reservas');
    if (reservasGuardadas) {
      this.reservas = JSON.parse(reservasGuardadas);
    }
  }

  eliminarOpcion(campo: string): void {
    this.reservaForm.get(campo)?.reset();
  }

  obtenerFechaActual(): void {
    const ahora = new Date();
    this.fechaCreacionActual = ahora.toISOString(); // Esto captura la fecha en formato ISO (yyyy-MM-ddTHH:mm:ss.sssZ)
    console.log(this.fechaCreacionActual); // Imprime la fecha en la consola para verificar

    this.reservaForm.get('fechaCreacion')?.setValue(this.fechaCreacionActual);
  }

  getUserRole() {
    this.rol = this.authServiceCli.getUserRole();
    console.log(this.rol);

    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

      this.authServiceCli.logout().subscribe(
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

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCli.logout().subscribe();
  }
}
