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
  selectedFile: File | null = null;
  uploadedFiles: any[] = [];

  cartas: any;
  cartasFiltradas: any;

  id_empresa: number | null = null;
  id_user: number | null = null;

  rol!: any;
  isDarkMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cartaUploadService: CartaUploadService,
    public authService: AuthService,
    public themeService: ThemeService,
    public usuariosService: UsuariosService,
    private router: Router,
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
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    // Llama a getImg para actualizar la lista de imágenes
    this.getImg();
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        console.log('Id de Usuario:', idUsuario);
        console.log('Id de Empresa:', idEmpresa);
    
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

  obtenerIdUsuario(): Observable<{ idUsuario: number | null, idEmpresa: number | null }> {
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const email = usuario.email;

      return this.usuariosService.getUserAndEmpresaByEmail(email).pipe(
        map(response => {
          console.log('Respuesta del servidor en obtenerIdUsuario:', response);

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
          console.error('Error al cerrar sesión:', error);
        }
      )
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadImage() {
    if (this.selectedFile) {
      this.obtenerIdUsuario().subscribe(
        ({ idUsuario, idEmpresa }) => {
          console.log('Id de Usuario:', idUsuario);
          console.log('Id de Empresa:', idEmpresa);

          this.id_user = idUsuario;
          this.id_empresa = idEmpresa;

          const formData: FormData = new FormData();

          if (this.selectedFile && this.id_empresa !== null && this.id_user !== null) {
            formData.append('carta_img', this.selectedFile, this.selectedFile.name);

            this.cartaUploadService.uploadFile(formData, this.id_empresa, this.id_user).subscribe(
              (response: any) => {
                console.log('Respuesta del servidor:', response);

                if (response && response.authorized === 'SI' && response.url) {
                  const fileName = response.data.carta_img;
                  const imageUrl = this.BASE_RUTA + response.data.carta_img;

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

  // getImg() {
  //   this.cartaUploadService.getImg().subscribe(
  //     (ans: any[]) => {
  //       this.cartas = ans;
  //       console.log('Imágenes del usuario actual:', this.cartas);
  //     },
  //     (error) => {
  //       console.error('Error al obtener imágenes:', error);
  //     }
  //   );
  // }

  getImg() {
    if (this.id_empresa !== null) {
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

  borrarImg(id_carta: any) {
    try {
      this.cartaUploadService.borrarImg(id_carta).subscribe(async (ans) => {
        console.log(ans);
        // Actualiza lista de las imágenes de cartas
        this.getImg();
      });
    } catch (e) {
      console.error(e);
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
