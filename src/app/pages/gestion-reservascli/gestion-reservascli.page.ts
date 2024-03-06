import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { MenuService } from 'src/app/services/menu.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-gestion-reservascli',
  templateUrl: './gestion-reservascli.page.html',
  styleUrls: ['./gestion-reservascli.page.scss'],
})
export class GestionReservascliPage implements OnInit {

  coloresFilas = ['#FFECBA', '#FFFFFF'];

  reservas: any;
  reservasFiltradas: any;

  clienteData: any;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private router: Router,
    public authServiceCli: AuthClienteService,
    public clienteService: ClientesService,
    private reservasService: ReservasService,
    public menuService: MenuService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.obtenerDatosUsuario();
  }

  // Obtener datos del usuario desde el almacenamiento local
  obtenerDatosUsuario() {
    const clienteString = localStorage.getItem('cliente');
    if (!clienteString) {
      console.error('Usuario no encontrado en el almacenamiento local');
      return;
    }

    const cliente = JSON.parse(clienteString);
    const email = cliente.email;

    // Obtener datos del usuario del servicio
    this.clienteService.getUserByEmail(email).subscribe(
      (response) => {
        if (response && response.code === 200 && response.data) {
          this.clienteData = response.data;
          const clienteId = response.data.id_cliente;
          this.getReservas(clienteId);
        } else {
          console.error('No se pudieron obtener los datos del usuario:', response.texto);
        }
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  // Obtener reservas del servicio
  getReservas(clienteId: string) {
    this.reservasService.getReservas().subscribe(
      (ans) => {
        this.reservas = ans.filter((reserva: any) => reserva.id_cliente === clienteId.toString());
        this.reservasFiltradas = [...this.reservas];
        // console.log('Reservas obtenidas:', this.reservasFiltradas);
      },
      (error) => {
        console.error('Error al obtener las reservas:', error);
      }
    );
  }

  // Dar formato a fechas y horas
  formatFechaHora(fecha: Date | string | null): string {
    const datePipe = new DatePipe('en-US');
    const isValidDate = fecha && !isNaN(new Date(fecha).getTime());
    return isValidDate ? datePipe.transform(fecha, 'dd/MM/yyyy HH:mm') ?? '' : '';
  }

  // Obtener color según el estado de la reserva
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

  // Obtener el rol del usuario autenticado
  getUserRole() {
    this.rol = this.authServiceCli.getUserRole();
    // console.log(this.rol);

    if (!(this.rol === 'cliente')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authServiceCli.logout().subscribe(
        () => {
          localStorage.removeItem('role');
          localStorage.removeItem('cliente');
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesión:', error);
        }
      )
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
