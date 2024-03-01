import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {

  getResenas: any;
  resenasFiltrados: any[] = [];

  rol!: any; 
  isDarkMode: any; 
  componentes!: Observable<Componente[]>;

  constructor( 
    private reviewsService: ReviewsService,
    public authService: AuthService,
    public usuariosService: UsuariosService,
    public menuService: MenuService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.getUserRole(); 
    this.getResena();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.obtenerDetallesClientes();
  }  

  // Método para obtener reseñas
  getResena() {
    if (this.rol === 'administrador' || this.rol === 'encargado' || this.rol === 'camarero') {
      const email = this.authService.getUserEmail();
  
      if (email !== null) {
        this.usuariosService.getIdEmpresaPorEmail(email).subscribe(
          (response) => {
            if (response.code === 200 && response.data && response.data.id_empresa) {
              const idEmpresaUsuario = response.data.id_empresa;
  
              this.reviewsService.obtenerResenas().subscribe(
                (resenasResponse) => {
                  if (Array.isArray(resenasResponse)) {
                    this.getResenas = resenasResponse.filter(resena => resena.id_empresa === idEmpresaUsuario);
                    this.resenasFiltrados = this.getResenas; // Inicializar resenasFiltrados
                    // console.log('Reseñas obtenidas:', this.getResenas);
  
                    // Llamada a la función que obtiene los detalles del cliente
                    this.obtenerDetallesClientes();
                  } else {
                    console.error('La respuesta del servicio de reseñas no es válida:', resenasResponse);
                  }
                },
                (errorResenas) => {
                  console.error('Error al obtener reseñas:', errorResenas);
                }
              );
            } else {
              console.error('No se pudo obtener el id_empresa del usuario:', response);
            }
          },
          (error) => {
            console.error('Error al obtener el id_empresa del usuario:', error);
          }
        );
      } else {
        console.error('El email del usuario es nulo.');
      }
    } else {
      console.error('No tiene permiso para acceder a esta opción.');
    }
  }
  
  // Método para obtener detalles del cliente
  obtenerDetallesClientes() {
    const observables: Observable<any>[] = this.resenasFiltrados.map((resena: any) => {
      const idCliente = resena.id_cliente;
      return this.reviewsService.obtenerDetallesCliente(idCliente);
    });
  
    forkJoin(observables).subscribe(
      (detallesClientes: any[]) => {
        detallesClientes.forEach((detallesCliente: any, index: number) => {
          this.resenasFiltrados[index].nombreCliente = detallesCliente.nombre_cliente;
          // console.log('Detalles del cliente:', detallesCliente);
        });
      },
      (error) => {
        console.error('Error al obtener detalles del cliente:', error);
      }
    );
  }

  // Método para responder a una reseña
  async responderResena(resena: any) {
    const respuesta = await this.reviewsService.mostrarCuadroDialogoParaRespuesta(resena);
    if (respuesta !== null) {
      console.log('Respuesta recibida:', respuesta);
      // Lógica adicional si es necesario
    } else {
      console.log('La respuesta está vacía o se canceló.');
    }
  }

  // Método para abrir un cuadro de diálogo o componente modal
  abrirCuadroDialogo(resena: any) {
    return this.reviewsService.mostrarCuadroDialogoParaRespuesta(resena)
      .then((respuesta) => {
        console.log('Respuesta enviada:', respuesta);
        return respuesta;
      })
      .catch(() => null);
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    // console.log(this.rol);
    
    if (!(this.rol === 'administrador' || this.rol === 'encargado')) {
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

  // Método para cambiar entre modos oscuro y claro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
