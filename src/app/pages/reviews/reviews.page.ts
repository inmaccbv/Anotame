import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {

  resenas!: any[];

  rol!: any; 
  isDarkMode: any; 
  componentes!: Observable<Componente[]>;

  constructor( 
    private reviewsService: ReviewsService,
    public authService: AuthService,
    public menuService: MenuService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.getUserRole(); 
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    
    this.reviewsService.resenas$.subscribe((resenas) => {

      this.resenas = resenas;
    });
  
    // Cargar reseñas guardadas al inicializar el componente
    this.cargarResenasGuardadas();
  }
  
  cargarResenasGuardadas() {
    const resenasGuardadas = localStorage.getItem('resenas');
    if (resenasGuardadas) {
      this.reviewsService.actualizarResenas(JSON.parse(resenasGuardadas));
    }
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'administrador' || this.rol === 'encargado' || this.rol === 'camarero')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

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
