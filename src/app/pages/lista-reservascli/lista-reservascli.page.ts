import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { ReservasService } from 'src/app/services/reservas.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-lista-reservascli',
  templateUrl: './lista-reservascli.page.html',
  styleUrls: ['./lista-reservascli.page.scss'],
})
export class ListaReservascliPage implements OnInit {

  reservas: any[] = [];
  
  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private router: Router,
    private reservasService: ReservasService,
    private menuCli: MenuCliService,
    public authServiceCli: AuthClienteService,
    public authService: AuthService,
    public themeService: ThemeService
  ) { 
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    console.log('Página Lista reservas cargada.');
    this.componentes = this.menuCli.getMenuOptsCli();
    //this.obtenerReservasCliente();
  }

  // obtenerReservasCliente() {
  //   const idCliente = this.authServiceCli.getClienteId();
    
  //   if (idCliente) {
  //     this.reservasService.getReservasPorCliente(idCliente).subscribe(

  //       (reservas) => {

  //         this.reservas = this.reservasService.getReservasArray();
  //         console.log('Reservas del cliente:', this.reservas);
  //       },
  //       (error) => {
  //         console.error('Error al obtener reservas del cliente:', error);
  //       }
  //     );
  //   } else {
  //     console.log('ID del cliente no válido.');
  //   }
  // }  
  
  getUserRole() {
    this.rol = this.authService.getUserRole();

    if (!(this.rol === 'cliente')) {
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('role');
          localStorage.removeItem('cliente');
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
