import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-reviewscli',
  templateUrl: './reviewscli.page.html',
  styleUrls: ['./reviewscli.page.scss'],
})
export class ReviewscliPage implements OnInit {

  nombre: string = '';
  comentario: string = '';
  rating: number = 0;
  stars: { icon: string, color: string }[] = [];
  resenas: { nombre: string, calificacion: number, comentario: string }[] = [];

  rol!: any; 
  isDarkMode: any; 
  componentes!: Observable<Componente[]>;

  constructor( 
    private reviewsService: ReviewsService,
    public authService: AuthService,
    public authServiceCli: AuthClienteService,
    private router: Router,
    private menuCli: MenuCliService,
    public themeService: ThemeService 
  ) {
    this.getUserRole(); 
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
    this.inicializarEstrellas();
    this.cargarResenasGuardadas();
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
  }

  inicializarEstrellas() {
    this.stars = Array(5).fill({ icon: 'star-outline', valor: 0, color: 'medium' });
  }

  calificar(index: number) {
    console.log('Valor de la calificación:', index );

    // Cambia el color de la estrella clicada y las anteriores
    this.stars = this.stars.map((star, i) => ({
      icon: i < index ? 'star' : 'star-outline',
      color: i < index ? 'warning' : 'medium',
    }));

      // Actualiza el valor de la calificación
      this.rating = index;
  }

  enviarResena() {
    const nombreResena = this.nombre.trim() !== '' ? this.nombre : 'Anónimo';
    const nuevaResena = { nombre: nombreResena, calificacion: this.rating, comentario: this.comentario };

    this.resenas.unshift(nuevaResena);
    localStorage.setItem('resenas', JSON.stringify(this.resenas));

    this.nombre = '';
    this.comentario = '';

    this.reviewsService.actualizarResenas(this.resenas);
  }

  cargarResenasGuardadas() {
    const resenasGuardadas = localStorage.getItem('resenas');
    if (resenasGuardadas) {
      this.resenas = JSON.parse(resenasGuardadas);
    }
  }

  eliminarResena(index: number) {
    this.resenas.splice(index, 1);
    localStorage.setItem('resenas', JSON.stringify(this.resenas));
  }

   // Método para obtener el rol del usuario
   getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

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
    this.authServiceCli.logout().subscribe();
  }
}