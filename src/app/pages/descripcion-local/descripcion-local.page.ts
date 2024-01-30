import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TextoService } from '../../services/texto.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuService } from 'src/app/services/menu.service';

import { Componente } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-descripcion-local',
  templateUrl: './descripcion-local.page.html',
  styleUrls: ['./descripcion-local.page.scss'],
})
export class DescripcionLocalPage implements OnInit {
       
  nomLocal: string = '';    
  texto: string = ''; 

  rol!: any;
  isDarkMode: any; 
  componentes!: Observable<Componente[]>;  

  constructor(
    public router: Router, 
    public textoService: TextoService,
    public authService: AuthService,
    public menuService: MenuService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() { 
    this.componentes = this.menuService.getMenuOpts();
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {

          localStorage.removeItem('role');
          localStorage.removeItem('usuario');

          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      )
    }
  }

  // Método para enviar el texto introducido
  enviarTexto() {
    localStorage.setItem('tituloGuardado', this.nomLocal);
    localStorage.setItem('textoGuardado', this.texto);
    // Limpiar el contenido del texto después de guardarlo
    this.nomLocal = '';
    this.texto = '';
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}