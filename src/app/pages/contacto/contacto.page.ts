import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  
  direccion: string = '';
  telefono1: string = '';
  telefono2: string = '';
  texto!: string;
  datos: any[] = [];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public router: Router,
    public authService: AuthService,
    public contactService: ContactoService,
    public menuService: MenuService,
    public themeService: ThemeService,
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();

    // Obtener datos de localStorage al inicializar
    const datosGuardados = JSON.parse(localStorage.getItem('datos') || '[]');
    this.datos = datosGuardados;
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
  
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      )
    }
  }
  
  // Método para agregar datos al array 'datos'
  agregarDatos() {
    // Verifico si al menos uno de los campos contiene datos
    if (this.texto || this.direccion || this.telefono1 || this.telefono2) {
      const nuevoDato = {
        nombre: this.texto,
        direccion: this.direccion,
        telefono1: this.telefono1,
        telefono2: this.telefono2,
      };
  
      this.datos.push(nuevoDato);
  
      // Guardar en localStorage
      this.guardarEnLocalStorage();
  
      // Reinicio los campos después de agregar datos si es necesario
      this.texto = '';
      this.direccion = '';
      this.telefono1 = '';
      this.telefono2 = '';
    } else {
      // Muestra un mensaje cuando no se ingresan datos
      console.log('Ingresa al menos un dato para guardar.');
    }
    this.contactService.actualizarDatos(this.datos);
  }

  // Método para guardar datos en localStorage
  private guardarEnLocalStorage() {
    // Obtener datos actuales de localStorage (si existen)
    const datosGuardados = JSON.parse(localStorage.getItem('datos') || '[]');

    // Agregar el nuevo dato
    datosGuardados.push({
      nombre: this.texto,
      direccion: this.direccion,
      telefono1: this.telefono1,
      telefono2: this.telefono2,
    });

    // Guardar en localStorage
    localStorage.setItem('datos', JSON.stringify(datosGuardados));
    localStorage.setItem('datos', JSON.stringify(this.datos));
  }

  // Método para eliminar un dato del array 'datos'
  eliminarDato(dato: any): void {
    // Encontrar el índice del dato a eliminar
    const index = this.datos.indexOf(dato);
  
    // Verificar si el índice es válido
    if (index !== -1) {
      // Eliminar el dato del array
      this.datos.splice(index, 1);
  
      // Guardar en localStorage
      this.guardarEnLocalStorage();
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