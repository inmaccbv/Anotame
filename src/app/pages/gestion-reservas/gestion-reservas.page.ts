import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { Observable, interval } from 'rxjs';

import { DatePipe } from '@angular/common';
import { Componente } from 'src/app/interfaces/interfaces';
import { DetallesclientePage } from '../detallescliente/detallescliente.page';

import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-gestion-reservas',
  templateUrl: './gestion-reservas.page.html',
  styleUrls: ['./gestion-reservas.page.scss'],
})
export class GestionReservasPage implements OnInit {

  @Input() cliente: any;

  reservasFiltradas: any;
  reservas: any;

  filtroMes: string | null = null;
  filtroAnio: string | null = null;

  idEmpresa!: number | null;

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  @ViewChild('idEmpresaInput') idEmpresaInput!: ElementRef;

  constructor(
    public alertController: AlertController,
    private popoverController: PopoverController,
    private router: Router,
    public authService: AuthService,
    public usuariosService: UsuariosService,
    public menuService: MenuService,
    private clientesService: ClientesService,
    private reservasService: ReservasService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    // Programar la ejecución periódica para verificar y eliminar reservas expiradas
    // const intervaloEjecucion = 60 * 60 * 1000; // Cada hora en milisegundos
    // interval(intervaloEjecucion).subscribe(() => {
    //   this.verificarYEliminarReservasExpiradas();
    // });

    const intervaloEjecucion = 5 * 60 * 1000; // Cada 5 minutos en milisegundos
    interval(intervaloEjecucion).subscribe(() => {
      this.verificarYEliminarReservasExpiradas();
    });

    this.getReservas();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();

    // Programar la ejecución periódica para verificar y eliminar reservas expiradas cada minuto
    setInterval(() => {
      this.verificarYEliminarReservasExpiradas();
    }, 60000);
  }

  // Funciones relacionadas con la obtención y gestión de reservas
  getReservas() {
    // Verificar si el rol del usuario es 'administrador', 'encargado' o 'camarero'
    if (this.rol === 'administrador' || this.rol === 'encargado' || this.rol === 'camarero') {
      // Obtener el email del usuario
      const email = this.authService.getUserEmail();

      // Verificar si el email no es nulo antes de llamar a la función
      if (email !== null) {
        this.usuariosService.getIdEmpresaPorEmail(email).subscribe(
          (response) => {
            if (response.code === 200 && response.data && response.data.id_empresa) {
              this.idEmpresa = response.data.id_empresa;
              // console.log('ID Empresa del usuario:', this.idEmpresa);

              // Ahora que tenemos el idEmpresa, podemos obtener las reservas
              const idEmpresaAsNumber = this.idEmpresa as number; // Convertir a número
              if (!isNaN(idEmpresaAsNumber)) {
                this.reservasService.getReservasPorEmpresa(idEmpresaAsNumber).subscribe(
                  (reservasResponse) => {
                    if (reservasResponse.code === 200 && Array.isArray(reservasResponse.data)) {
                      // Verificar si la respuesta tiene el código 200 y data es un array
                      this.reservas = reservasResponse.data;
                      this.reservasFiltradas = reservasResponse.data; 
                      console.log('Reservas obtenidas:', this.reservas);
                    } else {
                      console.error('La respuesta del servicio de reservas no es válida:', reservasResponse);
                    }
                  },
                  (errorReservas) => {
                    console.error('Error al obtener las reservas:', errorReservas);
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

  aplicarFiltros() {
    // console.log('Filtros aplicados:', this.filtroMes, this.filtroAnio);

    this.reservasFiltradas = this.reservas.filter((reserva: any) => {
      const fechaReserva = new Date(reserva.fechaHoraReserva);
      const mesReserva = (fechaReserva.getMonth() + 1).toString().padStart(2, '0');
      const anioReserva = fechaReserva.getFullYear().toString();

      // Formatear el filtroMes y filtroAnio al formato de fecha de las reservas
      const filtroMesFormato = this.filtroMes ? this.filtroMes.padStart(2, '0') : null;
      const filtroAnioFormato = this.filtroAnio ? this.filtroAnio : null;

      // console.log('Fecha de la reserva:', fechaReserva);
      // console.log('Mes y año de la reserva:', mesReserva, anioReserva);
      // console.log('Filtros formateados:', filtroMesFormato, filtroAnioFormato);

      // Verificar si los filtros están definidos y coinciden con el mes y año de la reserva
      const resultadoFiltro = (!filtroMesFormato || mesReserva === filtroMesFormato) &&
        (!filtroAnioFormato || anioReserva === filtroAnioFormato);

      // console.log('Resultado del filtro:', resultadoFiltro);

      return resultadoFiltro;
    });

    console.log('Reservas filtradas:', this.reservasFiltradas);
  }

  borrarFiltro() {
    this.filtroAnio = '';
    this.filtroMes = '';
    // Restablecer otros filtros si es necesario
    this.aplicarFiltros(); // Aplicar los filtros después de restablecer
  }

  // Función para dar formato a fechas y horas
  formatFechaHora(fecha: Date | string | null): string {
    const datePipe = new DatePipe('en-US');
    // Validar si la fecha es válida
    const isValidDate = fecha && !isNaN(new Date(fecha).getTime());
    // Utilizar el operador ternario para proporcionar un valor predeterminado si la fecha no es válida
    return isValidDate ? datePipe.transform(fecha, 'dd/MM/yyyy HH:mm') ?? '' : '';
  }

  // Función para cambiar el estado de una reserva
  async cambiarEstadoReserva(reserva: any): Promise<void> {
    console.log('Cambiando estado de reserva:', reserva);
    const opcionesEstado = [
      { estado: 'pendiente', color: '#ff830f' },
      { estado: 'aceptada', color: '#008000' },
      { estado: 'cancelada', color: '#FF0000' }
    ];
    const buttons = opcionesEstado.map(opcion => ({
      text: opcion.estado.charAt(0).toUpperCase() + opcion.estado.slice(1),
      handler: () => {
        console.log('Cambiando estado:', opcion.estado);
        const body = {
          id_reserva: reserva.id_reserva,
          estadoReserva: opcion.estado,
        };
        this.reservasService.editarEstadoReserva(reserva.id_reserva, opcion.estado)
          .subscribe(
            (response) => {
              console.log('Actualizada estado de reserva:', response);
              // Filtrar la reserva actual y agregarla con el nuevo estado y color
              this.reservas = this.reservas.filter((r: any) => r.id_reserva !== reserva.id_reserva);
              this.reservas.push({
                ...reserva,
                estadoReserva: response.nuevoEstado,
                estadoColor: opcion.color // Utiliza el color de la opción
              });
              this.actualizarReservaLocalStorage(reserva);
              window.location.reload();
            },
            (error) => {
              console.error('Error al actualizar reserva en la base de datos:', error);
            }
          );
      }
    }));
    // Mostrar un cuadro de diálogo con botones para cambiar el estado
    const alert = await this.alertController.create({
      header: 'Cambiar Estado',
      buttons: buttons
    });
    await alert.present();
  }

  // Función para mostrar detalles del cliente en un popover
  async mostrarDetallesCliente(event: any, reserva: any) {
    try {
      const idCliente = reserva?.id_cliente;
      if (idCliente) {
        // Agregar un retraso de 1000 milisegundos
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Obtener detalles del cliente por ID
        const detallesCliente = await this.clientesService.getClientePorId(idCliente).toPromise();
        if (detallesCliente) {
          // Mostrar popover con detalles del cliente
          const popover = await this.popoverController.create({
            component: DetallesclientePage,
            event: event,
            componentProps: { cliente: detallesCliente },
            translucent: true,
            backdropDismiss: false,
          });
          await popover.present();
        } else {
          console.error('No se pudieron obtener los detalles del cliente para la reserva:', reserva);
        }
      } else {
        console.error('ID del cliente no definido en la reserva:', reserva);
      }
    } catch (error) {
      console.error('Error al obtener detalles del cliente:', error);
    }
  }

  // Funciones auxiliares relacionadas con la gestión de reservas
  private obtenerEstadoColor(reserva: any, opcionesEstado: any[]): any {
    const estadoReserva = reserva.estadoReserva.toLowerCase();
    const color = this.getEstadoColor(estadoReserva);
    return { estado: estadoReserva, color: color };
  }

  // Función para obtener el color asociado a un estado de reserva
  public getEstadoColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'color-naranja';
      case 'aceptada':
        return 'color-verde';
      case 'cancelada':
        return 'color-rojo';
      default:
        return 'color-naranja';
    }
  }

  // Función para actualizar el estado de una reserva en el almacenamiento local
  private actualizarReservaLocalStorage(reserva: any): void {
    const reservasLocalStorage: any[] = JSON.parse(localStorage.getItem('reservas') || '[]');
    const index = reservasLocalStorage.findIndex(r => r.id_reserva && r.id_reserva === reserva.id_reserva);
    if (index !== -1) {
      // Actualizar estado y color de la reserva en el almacenamiento local
      reservasLocalStorage[index].estadoReserva = reserva.estadoReserva;
      reservasLocalStorage[index].estadoColor = reserva.estadoColor;
      // Actualizar toda la lista de reservas en el almacenamiento local
      localStorage.setItem('reservas', JSON.stringify(reservasLocalStorage));
    }
  }

  // Función para verificar y eliminar reservas expiradas
  verificarYEliminarReservasExpiradas(): void {
    const tiempoExpiracion = 60000; // 1 minuto en milisegundos
    this.reservas.forEach(async (reserva: any) => {
      const fechaHoraReserva = new Date(reserva.fechaHoraReserva).getTime();
      const tiempoActual = new Date().getTime();
      if (tiempoActual - fechaHoraReserva > tiempoExpiracion) {
        // Borrar reserva expirada de la base de datos
        await this.reservasService.borrarReserva(reserva.id_reserva);
        console.log(`Eliminando reserva expirada de la base de datos: ${reserva.id_reserva}`);
        window.location.reload();
      }
    });
  }

  // Funciones relacionadas con la autenticación del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    if (!(this.rol === 'administrador' || this.rol === 'encargado' || this.rol === 'camarero')) {
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
    this.authService.logout().subscribe();
  }
}
