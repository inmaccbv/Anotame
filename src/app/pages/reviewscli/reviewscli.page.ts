import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { Componente } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
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
  stars: { icon: string, color: string }[] = [];
  resenas: { nombre: string, calificacion: number, comentario: string }[] = [];

  reviewForm!: FormGroup;
  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private reviewsService: ReviewsService,
    public authService: AuthService,
    private clienteService: ClientesService,
    public authServiceCli: AuthClienteService,
    private menuCli: MenuCliService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
    this.inicializarEstrellas();
    this.cargarResenasGuardadas();

    this.reviewForm = this.formBuilder.group({
      id_cliente: [''],
      calificacion: [0, Validators.required],
      comentario: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
  }

  esClienteActual(resena: any): boolean {
    const clienteString = localStorage.getItem('cliente');
    if (clienteString) {
      const cliente = JSON.parse(clienteString);
      console.log('Cliente actual:', cliente);
      console.log('id_cliente de la reseña:', resena.id_cliente);
      // Verificar si el email del cliente actual coincide con el id_cliente de la reseña
      return resena.id_cliente === cliente.email;
    }
    return false;
  }
  
  inicializarEstrellas() {
    this.stars = Array(5).fill({ icon: 'star-outline', color: 'medium' });
  }

  calificar(index: number) {
    console.log('Valor de la calificación:', index);

    // Actualiza el valor de la calificación en el formulario
    this.reviewForm.get('calificacion')?.setValue(index);

    // Cambia el color de las estrellas
    this.stars = this.stars.map((star, i) => ({
      icon: i < index ? 'star' : 'star-outline',
      color: i < index ? 'warning' : 'medium',
    }));
  }


  obtenerIdCliente(): Observable<string | null> {
    const clienteString = localStorage.getItem('cliente');

    if (clienteString) {
      const cliente = JSON.parse(clienteString);
      const email = cliente.email;

      return this.clienteService.getUserByEmail(email).pipe(
        map(response => {
          console.log('Respuesta del servidor en obtenerIdCliente:', response);

          if (response && response.code === 200 && response.data) {
            // Puedes acceder a la propiedad id_cliente según la estructura real de tu respuesta
            return response.data.id_cliente ? response.data.id_cliente.toString() : null;
          } else {
            console.error('No se pudieron obtener los datos del usuario:', response.texto);
            return null;
          }
        }),
        catchError(error => {
          console.error('Error al obtener datos del usuario:', error);
          return of(null);
        })
      );
    } else {
      console.error('Usuario no encontrado en el almacenamiento local');
      return of(null);
    }
  }

  enviarResena() {
    if (this.reviewForm.valid) {
      this.obtenerIdCliente().subscribe(
        (id_cliente) => {
          if (id_cliente) {
            const calificacion = this.reviewForm.get('calificacion')?.value; // Obtener directamente del formulario

            // No necesitas verificar si es un número, ya que lo estás obteniendo del formulario
            console.log('Valor de calificación:', calificacion);

            const nuevaResena = {
              id_cliente: id_cliente,
              calificacion: calificacion,
              comentario: this.reviewForm.get('comentario')?.value,
            };

            this.reviewsService.subirResena(nuevaResena).subscribe(
              (response) => {
                // Luego de enviar la reseña, guardarla en el localStorage
                this.guardarResenaEnLocalStorage(nuevaResena);

                setTimeout(() => {
                  window.location.reload();
                }, 500);
              },
            );
          } else {
            console.error('Id_cliente no encontrado.');
          }
        },
        (error) => {
          console.error('Error al obtener el id_cliente:', error);
        }
      );
    } else {
      console.error('El formulario de reseña no es válido.');
    }
  }

  guardarResenaEnLocalStorage(resena: any) {
    // Obtener las reseñas almacenadas actualmente
    const reseñasGuardadas = localStorage.getItem('resenas') || '[]';
    const reseñas = JSON.parse(reseñasGuardadas);

    // Agregar la nueva reseña al arreglo
    reseñas.push(resena);

    // Guardar el arreglo actualizado en el localStorage
    localStorage.setItem('resenas', JSON.stringify(reseñas));
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
    this.rol = this.authServiceCli.getUserRole();
    console.log(this.rol);

    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

      this.authServiceCli.logout().subscribe(
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
