import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  expandido: boolean = false;

  stars: { icon: string, color: string }[] = [];
  resenas: { nombre: string, calificacion: number, comentario: string }[] = [];

  clienteData: any;
  idEmpresa: any;

  reviews: any;
  reviewsFiltrados: any;

  reviewForm!: FormGroup;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  @ViewChild('idEmpresaInput') idEmpresaInput!: ElementRef;

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
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
    this.inicializarEstrellas();
    this.obtenerDatosUsuario();

    // Crear el formulario con controles iniciales
    this.reviewForm = this.formBuilder.group({
      id_cliente: [''],
      id_empresa: [''],
      calificacion: [0, Validators.required],
      comentario: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();

    // Recuperar el valor de id_empresa del localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;  // Asignar a this.idEmpresa

    // console.log('ID Empresa:', this.idEmpresa);

    // Llama a getReservas con el idEmpresa actual
    if (this.idEmpresa) {
      this.getReviews(this.idEmpresa);
    }
  }

  // Método para inicializar las estrellas
  inicializarEstrellas() {
    this.stars = Array(5).fill({ icon: 'star-outline', color: 'medium' });
  }

  // Método para manejar la calificación
  calificar(index: number) {
    // console.log('Valor de la calificación:', index);

    // Actualiza el valor de la calificación en el formulario
    this.reviewForm.get('calificacion')?.setValue(index);

    // Cambia el color de las estrellas
    this.stars = this.stars.map((star, i) => ({
      icon: i < index ? 'star' : 'star-outline',
      color: i < index ? 'warning' : 'medium',
    }));
  }

  // Método para obtener el id del cliente desde el servidor
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

  // Método para enviar la reseña
  enviarResena() {
    if (this.reviewForm.valid) {
      // Obtener el id_cliente y id_empresa antes de enviar la reseña
      this.obtenerIdCliente().subscribe(
        (id_cliente) => {
          if (id_cliente) {

            // Recuperar el valor de id_empresa del localStorage
            const idEmpresaString = localStorage.getItem('id_empresa');
            const id_empresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

            const calificacion = this.reviewForm.get('calificacion')?.value;

            const nuevaResena = {
              id_cliente: id_cliente,
              id_empresa: id_empresa,
              calificacion: calificacion,
              comentario: this.reviewForm.get('comentario')?.value,
            };

            // Enviar la reseña al servicio
            this.reviewsService.subirResena(nuevaResena).subscribe(
              (response) => {
                // Recargar la página para mostrar la nueva reseña
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              },
              (error) => {
                console.error('Error al enviar la reseña:', error);
              }
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

  // Método para obtener datos del usuario
  obtenerDatosUsuario() {
    const clienteString = localStorage.getItem('cliente');
    if (!clienteString) {
      console.error('Usuario no encontrado en el almacenamiento local');
      return;
    }

    const cliente = JSON.parse(clienteString);
    const email = cliente.email;

    // Obtener datos del usuario del servicio
    this.clienteService.getUserByEmail(email).subscribe(
      (response) => {
        if (response && response.code === 200 && response.data) {
          this.clienteData = response.data;
          const clienteId = response.data.id_cliente;
          this.getReviews(clienteId);
        } else {
          console.error('No se pudieron obtener los datos del usuario:', response.texto);
        }
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }

  // Método para obtener reseñas
  getReviews(id_empresa: number) {
    if (this.idEmpresa !== null) {
      this.reviewsService.getReviewsByEmpresa(this.idEmpresa).subscribe(
        (ans: any) => {
          // Comprueba si 'ans' tiene la propiedad 'code'
          if ('code' in ans) {
            if (ans.code === 200) {
              // La solicitud fue exitosa, asigna los textos
              // Comprueba si 'ans' tiene la propiedad 'data'
              if ('data' in ans) {
                this.reviews = ans.data;
                this.reviewsFiltrados = ans.data;
                // console.log('Textos obtenidos:', this.reviews);
              } else {
                console.error('Error en la respuesta: Propiedad "data" no encontrada.');
              }
            } else {
              console.error('Error en la respuesta:', ans.reviews);
            }
          } else {
            console.error('Error en la respuesta: Propiedad "code" no encontrada.');
          }
        },
        (error) => {
          console.error('Error al obtener los textos:', error);
        }
      );
    } else {
      console.error('ID de empresa no válido.');
    }
  }

  // Método para eliminar reseñas
  eliminarResena(index: number) {
    this.resenas.splice(index, 1);
    localStorage.setItem('resenas', JSON.stringify(this.resenas));
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authServiceCli.getUserRole();
    // console.log(this.rol);

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

  // Función para alternar la expansión
  toggleExpansion() {
    this.expandido = !this.expandido;
  }

  // Método para cambiar el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authServiceCli.logout().subscribe();
  }
}
