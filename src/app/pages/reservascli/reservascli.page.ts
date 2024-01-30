import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { format } from 'date-fns';
import { Componente } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ThemeService } from 'src/app/services/theme.service';

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


  mostrarAutocompletadoCampo: string | null = null;
  opcionesAutocompletado: any[] = [];

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
    private router: Router,
    private menuCli: MenuCliService,
    public authServiceCli: AuthClienteService,
    public authService: AuthService,
    public themeService: ThemeService
  ) {
    // Inicialización del formulario
    this.reservaForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      telf: ['', Validators.required],
      numPax: ['', Validators.required],
      fechaHoraReserva: ['', Validators.required],
      notasEspeciales: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      estadoReserva: [ReservascliPage.ESTADO_PENDIENTE, Validators.required],
    });

    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();

    // Obtener la fecha actual
    this.obtenerFechaActual();
  }

  ngAfterViewInit(): void {
    // Inicialización de la vista después de cargarla
    this.mostrarAutocompletado('nombre');
    this.obtenerFechaActual();
    this.changeDetectorRef.detectChanges();
  }

  // Método para enviar una reserva al servidor
  enviarReserva() {
    this.submitted = true;

    if (this.reservaForm.invalid) {
      return;
    }

    this.reservasService.addReserva(this.reservaForm.value).subscribe(
      (ans) => {
        this.reservas = ans;

        if (this.reservas['authorized'] === 'NO') {

          this.mostrarAlertaNO('Error', 'Error en realizar la reserva');

        } else {

          const nuevaReserva = this.reservaForm.value;
          this.reservasArray.push(nuevaReserva);

          this.reservaEnviada.emit(this.reservasArray);
          this.mostrarAlertaOK('Enhorabuena', 'Reserva creada correctamente');
        }
      },
      (error) => {
        this.mostrarAlertaNO('Error', 'Error en realizar la reserva');
      }
    );
  }

  // Métodos para mostrar alertas
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

  // Buscar autocompletado
  buscarAutocompletado(event: Event): void {
    if ('detail' in event) {
      const termino = (event as CustomEvent<any>).detail.value;
      this.reservasService.buscarAutocompletado(termino).subscribe(
        (opciones) => {
          this.opcionesAutocompletado = opciones;
          this.mostrarAutocompletado('nombre');
        },
        (error) => {
          console.error('Error al buscar autocompletado:', error);
        }
      );
    }
  }

  // Mostrar autocompletado
  mostrarAutocompletado(campo: string): void {
    this.mostrarAutocompletadoCampo = campo;
  }

  // Seleccionar opción de autocompletado
  seleccionarOpcionAutocompletado(opcion: any) {
    this.reservaForm.patchValue({
      id_cliente: opcion.id_cliente,
      nombre: opcion.nombre,
      email: opcion.email,
      telf: opcion.telf,
    });

    this.mostrarAutocompletadoCampo = '';
  }

  // Eliminar opción de autocompletado
  eliminarOpcion(campo: string): void {
    this.reservaForm.get(campo)?.reset();
  }

  // Obtener fecha actual
  obtenerFechaActual(): void {
    const ahora = new Date();
    this.fechaCreacionActual = format(ahora, 'dd/MM/yyyy HH:mm:ss');
    this.reservaForm.get('fechaCreacion')?.setValue(this.fechaCreacionActual);
  }

  // Obtener el rol del usuario
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

  // Cambiar el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Cerrar sesión
  cerrarSesion(): void {
    this.authServiceCli.logout().subscribe();
  }
}