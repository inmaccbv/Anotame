import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente, Horario } from 'src/app/interfaces/interfaces';

import { HorariosService } from '../../services/horarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  horariosSeleccionados: Horario[] = [];

  // Variable para almacenar horarios de apertura y cierre por día
  horarioApertura: { [key: string]: string } = {};
  horarioCierre: { [key: string]: string } = {};

  // Conjunto para rastrear los días seleccionados
  diasSeleccionados: Set<string> = new Set<string>();

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public horariosService: HorariosService,
    public authService: AuthService,
    public themeService: ThemeService,
    public menuService: MenuService,
    private router: Router
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    this.horariosService.obtenerHorarios().subscribe((nuevosHorarios) => {
      console.log('Nuevos horarios recibidos en HorariosPage:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios || [];
      console.log('this.horariosSeleccionados:', this.horariosSeleccionados);
    });
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    
    this.horariosService.horarios$.subscribe((nuevosHorarios) => {
      console.log('Nuevos horarios recibidos en HorariosPage:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios || [];
    });
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
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

  agregarHorario(dia: string): void {
    const horaApertura = this.horarioApertura[dia];
    const horaCierre = this.horarioCierre[dia];

    console.log('Dia:', dia);
    console.log('Hora de Apertura:', horaApertura);
    console.log('Hora de Cierre:', horaCierre);

    // Verificar si ambas horas están ingresadas
    if (horaApertura && horaCierre) {
      const nuevoHorario: Horario = {
        dia: dia,
        horaApertura: horaApertura,
        horaCierre: horaCierre,
        id: ''
      };

      // Verificar si el día ya fue seleccionado
      if (!this.diasSeleccionados.has(dia)) {
        // Agregar el nuevo horario y actualizar el conjunto de días seleccionados
        this.horariosSeleccionados.push(nuevoHorario);
        this.diasSeleccionados.add(dia);

        // Limpiar los campos de entrada
        this.horarioApertura[dia] = '';
        this.horarioCierre[dia] = '';

        // Guardar los horarios en el servicio y en localStorage
        this.horariosService.actualizarHorarios(this.horariosSeleccionados);
        localStorage.setItem('horarios', JSON.stringify(this.horariosSeleccionados));
      } else {
        console.log('El día ya está seleccionado.');
      }
    }
  }

  // Borrar un horario existente
  borrarHorario(horario: Horario): void {
    const index = this.horariosSeleccionados.indexOf(horario);
    if (index !== -1) {
      this.horariosSeleccionados.splice(index, 1);
      this.diasSeleccionados.delete(horario.dia);

      // Guardar los horarios en el servicio y en localStorage
      this.horariosService.actualizarHorarios(this.horariosSeleccionados);
      localStorage.setItem('horarios', JSON.stringify(this.horariosSeleccionados));
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
