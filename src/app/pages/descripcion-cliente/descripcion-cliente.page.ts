import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-descripcion-cliente',
  templateUrl: './descripcion-cliente.page.html',
  styleUrls: ['./descripcion-cliente.page.scss'],
})
export class DescripcionClientePage implements OnInit {

  texto: string = '';
  titulo: string = '';

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public router: Router, 
    public authService: AuthService,
    private menuCli: MenuCliService,
    public authServiceCliente: AuthClienteService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    this.texto = localStorage.getItem('textoGuardado') || '';
    this.titulo = localStorage.getItem('tituloGuardado') || '';
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {

          localStorage.removeItem('role');
          localStorage.removeItem('cliente');

          this.router.navigate(['/logincli']);
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