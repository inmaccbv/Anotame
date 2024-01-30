import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Componente, DatosContacto, Horario } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { HorariosService } from 'src/app/services/horarios.service';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';

@Component({
  selector: 'app-contactocli',
  templateUrl: './contactocli.page.html',
  styleUrls: ['./contactocli.page.scss'],
})
export class ContactocliPage implements OnInit {

  datos: DatosContacto[] = [];
  horariosSeleccionados: Horario[] = [];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public authService: AuthService,
    public authServiceCliente: AuthClienteService,
    private contactService: ContactoService,
    private horariosService: HorariosService,
    public themeService: ThemeService,
    private menuCli: MenuCliService,
    private router: Router,
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    this.contactService.datos$.subscribe((nuevosDatos: DatosContacto[]) => {
      this.datos = nuevosDatos;
    });

    // Suscribirse a futuros cambios en los horarios
    this.horariosService.obtenerHorarios().subscribe((nuevosHorarios) => {
      console.log('Nuevos horarios recibidos en ContactocliPage:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios;
    });

  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();

    // Obtener datos de localStorage al inicializar
    const datosGuardados = JSON.parse(localStorage.getItem('datos') || '[]') as DatosContacto[];
    const horarioGuardados = JSON.parse(localStorage.getItem('horarios') || '[]') as Horario[];

    // Después de recuperar datos de localStorage
    console.log('Datos recuperados del localStorage:', datosGuardados);
    console.log('Horarios recuperados del localStorage:', horarioGuardados);

    this.datos = datosGuardados;

    // Actualizar los horarios en el servicio con los recuperados del localStorage
    this.horariosService.actualizarHorarios(horarioGuardados);

    this.horariosService.horarios$.subscribe((nuevosHorarios) => {
      console.log('Nuevos horarios recibidos:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios;
    });
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {
          // Elimina cualquier informacion de session almacenada localmente
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
    this.authServiceCliente.logout().subscribe();
  }
}
