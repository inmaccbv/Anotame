import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';


import { Componente } from 'src/app/interfaces/interfaces';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-gestion-reservas',
  templateUrl: './gestion-reservas.page.html',
  styleUrls: ['./gestion-reservas.page.scss'],
})
export class GestionReservasPage implements OnInit {

  reservasFiltradas: any;
  reservas: any;

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    public authServiceCli: AuthClienteService,
    private router: Router,
    public menuService: MenuService,
    public alertController: AlertController,
    private reservasService: ReservasService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();

    this.getReservas();
  }

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
  
    const alert = await this.alertController.create({
      header: 'Cambiar Estado',
      buttons: buttons
    });
  
    await alert.present();
  }
  
  
  
 
  private obtenerEstadoColor(reserva: any, opcionesEstado: any[]): any {
    const estadoReserva = reserva.estadoReserva.toLowerCase();
    const color = this.getEstadoColor(estadoReserva);
  
    return { estado: estadoReserva, color: color };
  }
  
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
  

  private actualizarReservaLocalStorage(reserva: any): void {
    const reservasLocalStorage: any[] = JSON.parse(localStorage.getItem('reservas') || '[]');
    const index = reservasLocalStorage.findIndex(r => r.id_reserva && r.id_reserva === reserva.id_reserva);

    if (index !== -1) {
      reservasLocalStorage[index].estadoReserva = reserva.estadoReserva;
      reservasLocalStorage[index].estadoColor = reserva.estadoColor;

      // Actualiza toda la lista de reservas en el localStorage
      localStorage.setItem('reservas', JSON.stringify(reservasLocalStorage));
    }
  }

  getReservas() {
    this.reservasService.getReservas().subscribe(
      (ans) => {
        this.reservas = ans;
        this.reservasFiltradas = ans; // Inicializa empleadosFiltrados
        console.log('Reservas obtenidas:', this.reservas);
      },
      (error) => {
        console.error('Error al obtener las reservas:', error);
      }
    );
  }


  getUserRole() {
    this.rol = this.authService.getUserRole();

    if (!(this.rol === 'administrador' || this.rol === 'encargado')) {
      this.authService.logout().subscribe(
        () => {

          localStorage.removeItem('role');
          localStorage.removeItem('usuario');

          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      )
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
