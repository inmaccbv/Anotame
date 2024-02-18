import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';



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

  getResenas: any;
  resenas: any[] = [];
  resenasFiltrados: any[] = [];

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
    this.getResena();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
  
   this.obtenerDetallesClientes();
  }  

  getResena() {
    this.reviewsService.obtenerResenas().subscribe(
      (ans: any) => {
        this.getResenas = ans;
        this.resenasFiltrados = ans;
        console.log('Reseñas obtenidas:', this.getResenas);
  
        // Llamada a la función que obtiene los detalles del cliente
        this.obtenerDetallesClientes();
      },
      (error) => {
        console.error('Error al obtener reseñas:', error);
      }
    );
  }  
  
  obtenerDetallesClientes() {
    const observables: Observable<any>[] = this.resenasFiltrados.map((resena: any) => {
      const idCliente = resena.id_cliente;
      return this.reviewsService.obtenerDetallesCliente(idCliente);
    });
  
    forkJoin(observables).subscribe(
      (detallesClientes: any[]) => {
        detallesClientes.forEach((detallesCliente: any, index: number) => {
          this.resenasFiltrados[index].nombreCliente = detallesCliente.nombre_cliente;
          console.log('Detalles del cliente:', detallesCliente);
        });
      },
      (error) => {
        console.error('Error al obtener detalles del cliente:', error);
      }
    );
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
