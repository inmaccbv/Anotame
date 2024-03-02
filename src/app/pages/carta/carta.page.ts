import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { CartaUploadService } from 'src/app/services/carta-upload.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.page.html',
  styleUrls: ['./carta.page.scss'],
})
export class CartaPage implements OnInit {

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/uploads";

  formCarta: FormGroup;
  
  // Archivo seleccionado
  selectedFile: File | null = null;
  
  // Lista de archivos subidos
  uploadedFiles: any[] = [];

  cartas: any;
  cartasFiltradas: any;

  id_empresa: number | null = null;
  id_user: number | null = null;


  rol!: any;
  isDarkMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cartaUploadService: CartaUploadService,
    public authService: AuthService,
    public themeService: ThemeService,
    public usuariosService: UsuariosService,
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();

    this.formCarta = this.formBuilder.group({
      carta_img: [''],
      id_empresa: [''],
      id_user: [''],
    });
  }

  ngOnInit() {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    this.getImg();

    // Obtiene el ID del usuario y de la empresa
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        // console.log('Id de Usuario:', idUsuario);
        // console.log('Id de Empresa:', idEmpresa);

        // Asigna los valores obtenidos
        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;

        // Asegúrate de que id_empresa se haya establecido antes de llamar a getImg()
        if (this.id_empresa !== null) {
          this.getImg();
        } else {
          console.error('ID de empresa no válido.'); // Esta es la línea 214
        }
      },
      (error) => {
        console.error('Error al obtener el id del usuario y la empresa:', error);
      }
    );
  }

  // Método para obtener el ID del usuario desde el almacenamiento local
  obtenerIdUsuario(): Observable<{ idUsuario: number | null, idEmpresa: number | null }> {
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const email = usuario.email;

      return this.usuariosService.getUserAndEmpresaByEmail(email).pipe(
        map(response => {
          // console.log('Respuesta del servidor en obtenerIdUsuario:', response);

          if (response && response.code === 200 && response.data) {
            // Puedes acceder a las propiedades id_user e id_empresa según la estructura real de tu respuesta
            const idUsuario = response.data.id_user ? response.data.id_user : null;
            const idEmpresa = response.data.id_empresa ? response.data.id_empresa : null;

            return { idUsuario, idEmpresa };
          } else {
            console.error('No se pudieron obtener los datos del usuario:', response.texto);
            return { idUsuario: null, idEmpresa: null };
          }
        }),
        catchError(error => {
          console.error('Error al obtener datos del usuario:', error);
          return of({ idUsuario: null, idEmpresa: null });
        })
      );
    } else {
      console.error('Usuario no encontrado en el almacenamiento local');
      return of({ idUsuario: null, idEmpresa: null });
    }
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    // Obtiene el rol desde el servicio de autenticación
    this.rol = this.authService.getUserRole();
    // console.log(this.rol);

    // Verifica si el usuario tiene los permisos adecuados
    if (!(this.rol === 'administrador' || this.rol === 'encargado')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      // Cierra sesión y redirige al inicio
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('role');
          localStorage.removeItem('usuario');
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesión:', error);
        }
      )
    }
  }

  // Método que se ejecuta al seleccionar un archivo
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  // Método para subir una imagen
  uploadImage() {
    // Verifica si se ha seleccionado un archivo
    if (this.selectedFile) {
      // Obtiene el ID del usuario y de la empresa
      this.obtenerIdUsuario().subscribe(
        ({ idUsuario, idEmpresa }) => {
          console.log('Id de Usuario:', idUsuario);
          console.log('Id de Empresa:', idEmpresa);

          // Asigna los valores obtenidos
          this.id_user = idUsuario;
          this.id_empresa = idEmpresa;

          // Crea un formulario para enviar el archivo
          const formData: FormData = new FormData();

          // Verifica si el archivo y los IDs son válidos
          if (this.selectedFile && this.id_empresa !== null && this.id_user !== null) {
            formData.append('carta_img', this.selectedFile, this.selectedFile.name);

            // Realiza la solicitud para subir la imagen
            this.cartaUploadService.uploadFile(formData, this.id_empresa, this.id_user).subscribe(
              (response: any) => {
                console.log('Respuesta del servidor:', response);

                // Verifica si la respuesta es exitosa y contiene la URL de la imagen
                if (response && response.authorized === 'SI' && response.url) {
                  const fileName = response.data.carta_img;
                  const imageUrl = this.BASE_RUTA + response.data.carta_img;

                  // Agrega la imagen a la lista de archivos subidos
                  this.uploadedFiles.push({ name: fileName, url: imageUrl });
                  console.log('Lista de cartas después de subir:', this.uploadedFiles);
                  // this.getImg();
                } else {
                  console.error('Error al subir la imagen:', response);
                }
              },
              (error: any) => {
                console.error('Error en la solicitud:', error);
              }
            );
          } else {
            console.error('El archivo seleccionado es nulo o faltan IDs.');
          }
        },
        (error) => {
          console.error('Error al obtener el id del usuario y la empresa:', error);
        }
      );
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }

  // Método para obtener la lista de imágenes de cartas
  getImg() {
    // Verifica si el ID de la empresa es válido
    if (this.id_empresa !== null) {
      // Realiza la solicitud para obtener las imágenes de cartas por empresa
      this.cartaUploadService.getCartasByEmpresa(this.id_empresa).subscribe(
        (ans: any) => {
          // Comprueba si 'ans' tiene la propiedad 'code'
          if ('code' in ans) {
            if (ans.code === 200) {
              // La solicitud fue exitosa, asigna los textos
              // Comprueba si 'ans' tiene la propiedad 'data'
              if ('data' in ans) {
                this.cartas = ans.data;
                this.cartasFiltradas = ans.data;
                console.log('Cartas obtenidas:', this.cartas);
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
    }
  }

  // Método para borrar una imagen de carta
  borrarImg(id_carta: any) {
    try {
      // Realiza la solicitud para borrar la imagen por ID de carta
      this.cartaUploadService.borrarImg(id_carta).subscribe(async (ans) => {
        console.log(ans);
        // Actualiza lista de las imágenes de cartas
        this.getImg();
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Método para obtener la URL de una imagen de carta
  obtenerUrlImg(carta: any): string {
    return `${this.BASE_RUTA}/${carta.carta_img}`;
  }

  // Método para cambiar el estado del modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
