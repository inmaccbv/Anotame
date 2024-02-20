import { Component, OnInit, AfterViewInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { format } from 'date-fns';
import { Componente } from 'src/app/interfaces/interfaces';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-reservascli',
  templateUrl: './reservascli.page.html',
  styleUrls: ['./reservascli.page.scss'],
})
export class ReservascliPage implements OnInit, AfterViewInit {
  @Output() reservaEnviada = new EventEmitter<any>();

  reservaForm!: FormGroup;
  reservas: any;
  reservasArray: any[] = [];

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
    private reservasService: ReservasService,
    private clienteService: ClientesService,
    private router: Router,
    private menuCli: MenuCliService,
    public authServiceCli: AuthClienteService,
    public authService: AuthService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();

    // Inicializa el formulario para las reservas
    this.reservaForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      telf: ['', Validators.required],
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

   
  }

  ngAfterViewInit(): void {
    this.obtenerFechaActual();
    this.changeDetectorRef.detectChanges();
  }

  mostrarFormulario(event: any) {
    this.fechaSeleccionada = event.detail.value;
  }

  esClienteActual(resena: any): boolean {
    const clienteString = localStorage.getItem('cliente');
    if (clienteString) {
      const cliente = JSON.parse(clienteString);
      console.log('Cliente actual:', cliente);
      console.log('id_cliente de la reseña:', resena.id_cliente);
      console.log('Email del cliente actual:', cliente.email);
      
      // Verificar si el email del cliente actual coincide con el id_cliente de la reseña
      const resultado = resena.id_cliente === cliente.email;
      console.log('Resultado de la comparación:', resultado);
      
      return resultado;
    }
    console.error('No se pudo obtener el cliente actual desde el almacenamiento local.');
    return false;
  }  
  

  obtenerIdCliente(): Observable<string | null> {
    const clienteString = localStorage.getItem('cliente');
  
    if (clienteString) {
      const cliente = JSON.parse(clienteString);
      const email = cliente.email;
  
      return this.clienteService.getUserByEmail(email).pipe(
        tap(response => {
          console.log('Respuesta del servidor en obtenerIdCliente:', response);
        }),
        map(response => {
          if (response && response.code === 200 && response.data && response.data.id_cliente) {
            return response.data.id_cliente.toString();
          } else {
            console.error('No se pudo obtener el id_cliente del usuario:', response);
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
      this.obtenerIdCliente().subscribe(
        (id_cliente) => {
          if (id_cliente) {

            const nombre = this.reservaForm.get('nombre')?.value;
            const telf = this.reservaForm.get('telf')?.value;
            const numPax = this.reservaForm.get('numPax')?.value;
            const fechaHoraReserva = this.reservaForm.get('fechaHoraReserva')?.value;
            const notasEspeciales = this.reservaForm.get('notasEspeciales')?.value;
            const estadoReserva = this.reservaForm.get('estadoReserva')?.value;
            const fechaCreacion = this.reservaForm.get('fechaCreacion')?.value;

            const nuevaReserva = {
              nombre: nombre,
              telf: telf,
              numPax: numPax,
              fechaHoraReserva: fechaHoraReserva,
              notasEspeciales: notasEspeciales,
              id_cliente: id_cliente,
              estadoReserva: estadoReserva,
              fechaCreacion: fechaCreacion,
            };

            this.reservasService.addReserva(nuevaReserva).subscribe(
              (response) => {
                // Luego de enviar la reseña, guardarla en el localStorage
                this.guardarReservaEnLocalStorage(nuevaReserva);

                setTimeout(() => {
                  window.location.reload();
                }, 500);
              },
            );
          } else {
            console.error('Id_cliente no encontrado.');
          }
        },
        (error) => {
          console.error('Error al obtener el id_cliente:', error);
        }
      );
    } else {
      console.error('El formulario de reseña no es válido.');
    }
  }
  
  guardarReservaEnLocalStorage(reserva: any) {
    // Obtener las reservas almacenadas actualmente
    const reservasGuardadas = localStorage.getItem('reservas') || '[]';
    const reservas = JSON.parse(reservasGuardadas);
  
    // Agregar la nueva reserva al arreglo
    reservas.push(reserva);
  
    // Guardar el arreglo actualizado en el localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }
  
  
  

  async mostrarAlertaOK(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert-header',
    });

    await alert.present();
  }

  async mostrarAlertaNO(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert-header',
    });

    await alert.present();
  }

  eliminarOpcion(campo: string): void {
    this.reservaForm.get(campo)?.reset();
  }

  obtenerFechaActual(): void {
    const ahora = new Date();
    this.fechaCreacionActual = format(ahora, 'dd/MM/yyyy HH:mm:ss');
    this.reservaForm.get('fechaCreacion')?.setValue(this.fechaCreacionActual);
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();

    if (!(this.rol === 'cliente')) {
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

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCli.logout().subscribe();
  }
}
