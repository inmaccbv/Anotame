import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Componente } from 'src/app/interfaces/interfaces';
import { HorariosService } from '../../services/horarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuService } from 'src/app/services/menu.service';

interface Horario {
  dia: string;
  horaApertura: string;
  horaCierre: string;
  id: string;
}

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  horariosSeleccionados: Horario[] = [];
  horarioApertura: { [key: string]: string } = {};
  horarioCierre: { [key: string]: string } = {};
  diasSeleccionados: Set<string> = new Set<string>();

  horarioControls: FormArray;
  horarioForm: FormGroup;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public horariosService: HorariosService,
    public authService: AuthService,
    public themeService: ThemeService,
    public menuService: MenuService,
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    this.horariosService.obtenerHorarios().subscribe((nuevosHorarios) => {
      console.log('Nuevos horarios recibidos en HorariosPage:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios || [];
      console.log('this.horariosSeleccionados:', this.horariosSeleccionados);
    });

    this.horarioControls = this.formBuilder.array([]);  // Inicializado como FormArray

    this.horarioForm = this.formBuilder.group({
      horarios: this.horarioControls,
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
          console.error('Error al cerrar sesión:', error);
        }
      )
    }
  }
  

  getHorarioValue(index: number, controlName: string): string {
    const horariosArray = this.horarioForm.get('horarios') as FormArray;
    const horarioGroup = horariosArray.at(index) as FormGroup;
  
    const control = horarioGroup.get(controlName);
  
    return (control?.value || '') as string;
  }
  
  setHorarioValue(index: number, controlName: string, value: string): void {
    const horariosArray = this.horarioForm.get('horarios') as FormArray;
    const horarioGroup = horariosArray.at(index) as FormGroup;
  
    if (horarioGroup.get(controlName)) {
      horarioGroup.get(controlName)!.setValue(value || '');
    }
  }
  
  agregarHorario(index: number): void {
    const horariosArray = this.horarioForm.get('horarios') as FormArray;
    const horarioForm = horariosArray.at(index) as FormGroup;
  
    const formData: Horario = {
      dia: this.diasSemana[index],
      horaApertura: horarioForm.get('horaApertura')?.value || '',
      horaCierre: horarioForm.get('horaCierre')?.value || '',
      id: '',
    };
  
    if (horarioForm.valid) {
      this.horariosService.agregarHorario(formData).subscribe(
        (respuesta: any) => {
          console.log('Respuesta del servidor:', respuesta);
  
          horarioForm.reset();
  
          this.horariosService.obtenerHorarios().subscribe((nuevosHorarios) => {
            console.log('Nuevos horarios recibidos en HorariosPage:', nuevosHorarios);
            this.horariosSeleccionados = nuevosHorarios || [];
            console.log('this.horariosSeleccionados:', this.horariosSeleccionados);
          });
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      console.log('El formulario no es válido. Realiza la validación necesaria.');
    }
  }
  
  

  agregarHorarioLocalStorage(dia: string): void {
    const horaApertura = this.horarioApertura[dia];
    const horaCierre = this.horarioCierre[dia];

    if (horaApertura && horaCierre) {
      const nuevoHorario: Horario = {
        dia: dia,
        horaApertura: horaApertura,
        horaCierre: horaCierre,
        id: ''
      };

      if (!this.diasSeleccionados.has(dia)) {
        this.horariosSeleccionados.push(nuevoHorario);
        this.diasSeleccionados.add(dia);

        this.horarioApertura[dia] = '';
        this.horarioCierre[dia] = '';

        this.horariosService.actualizarHorarios(this.horariosSeleccionados);
        localStorage.setItem('horarios', JSON.stringify(this.horariosSeleccionados));
      } else {
        console.log('El día ya está seleccionado.');
      }
    }
  }

  borrarHorario(horario: Horario): void {
    const index = this.horariosSeleccionados.indexOf(horario);
    if (index !== -1) {
      this.horariosSeleccionados.splice(index, 1);
      this.diasSeleccionados.delete(horario.dia);

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
