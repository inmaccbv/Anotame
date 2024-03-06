import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { ThemeService } from 'src/app/services/theme.service';
import { MenuUploadService } from 'src/app/services/menu-upload.service';
import { DiasService } from 'src/app/services/dias.service';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu-img',
  templateUrl: './menu-img.page.html',
  styleUrls: ['./menu-img.page.scss'],
})
export class MenuImgPage implements OnInit {

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/uploads";

  // Archivo seleccionado para cargar
  selectedFile: File | null = null;

  // Identificadores de empresa y usuario
  id_empresa: number | null = null;
  id_user: number | null = null;

  // Arreglos para almacenar menús y días disponibles
  menus: any;
  menusFiltrados: any;
  arrImgAndDay: any;
  availableDays: string[] = [];

  // Variable para almacenar información sobre los días
  dias: any;

  // Formulario Reactivo Angular
  form: FormGroup;

  rol!: any;
  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private menuUploadService: MenuUploadService,
    public usuariosService: UsuariosService,
    private diasService: DiasService,
    public authService: AuthService,
    public themeService: ThemeService,
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();

    this.form = this.formBuilder.group({
      dia: new FormControl('', { updateOn: 'blur' }),
      id_empresa: [''],
      id_user: [''],
    });

    this.arrImgAndDay = [];
  }

  ngOnInit() {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);

    this.isDarkMode = this.themeService.isDarkTheme();

    // Llama a getDias para obtener los días de la semana
    this.getDias().subscribe(
      (dias) => {
        if (dias) {
          this.getImg();
        }
      }
    );

    // Obtiene el ID del usuario y de la empresa
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        // console.log('Id de Usuario:', idUsuario);
        // console.log('Id de Empresa:', idEmpresa);

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

  // Método para obtener el ID del usuario desde el servicio
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

  // Método para obtener los días de la semana desde el servicio
  getDias() {
    return this.diasService.getDias().pipe(
      tap((ans) => {
        this.dias = ans;
        this.availableDays = this.dias.map((dia: any) => dia.dia); // Inicializa los días disponibles
        // console.log('Días de la semana: ', this.dias);
      }),
      catchError((error) => {
        console.error('Error al obtener los días:', error);
        return of(null); // Devuelve un observable de null en caso de error
      })
    );
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    // console.log(this.rol);

    // Verifica si el usuario tiene permisos para acceder a esta opción
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

  // Método ejecutado al seleccionar un archivo
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  // Método para cargar una imagen
  uploadImage() {
    if (this.selectedFile) {
      this.obtenerIdUsuario().subscribe(
        ({ idUsuario, idEmpresa }) => {
          // console.log('Id de Usuario:', idUsuario);
          // console.log('Id de Empresa:', idEmpresa);

          const selectedDay = this.form.get('dia')?.value;

          this.id_user = idUsuario;
          this.id_empresa = idEmpresa;

          const formData: FormData = new FormData();

          if (this.selectedFile && this.id_empresa !== null && this.id_user !== null) {
            formData.append('menu_img', this.selectedFile, this.selectedFile.name);
            formData.append('dia', selectedDay);

            this.menuUploadService.uploadFile(formData, this.id_empresa, this.id_user).subscribe(
              (response: any) => {
                // console.log('Respuesta del servidor:', response);

                if (response && response.authorized === 'SI' && response.url) {
                  const nomImg = response.data.menu_img;
                  const imgUrl = this.BASE_RUTA + response.data.menu_img;

                  // Almacena los datos en el localStorage
                  const imageData = { fileName: nomImg, imageUrl: imgUrl, selectedDay };

                  // Actualiza la lista de cartas después de subir la imagen
                  window.location.reload();

                  // Desactiva la opción del día seleccionado en el formulario
                  const diaControl = this.form.get('dia');
                  diaControl?.disable({ emitEvent: false }); // Desactiva el control del día sin emitir el evento

                  // console.log('Después de desactivar:', this.form.value);
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

  // Método para obtener las imágenes desde el servicio
  getImg() {
    if (this.id_empresa !== null) {
      this.menuUploadService.getMenusByEmpresa(this.id_empresa).subscribe(
        (ans: any) => {
          if ('code' in ans) {
            if (ans.code === 200) {
              if ('data' in ans) {
                this.menus = ans.data;

                // Ordena los menús por el día de la semana
                this.menus.sort((a: any, b: any) => {
                  const diaA = this.availableDays.indexOf(a.dia);
                  const diaB = this.availableDays.indexOf(b.dia);
                  return diaA - diaB;
                });

                console.log('Menús obtenidos:', this.menus);
              } else {
                console.error('Error en la respuesta: Propiedad "data" no encontrada.');
              }
            } else {
              console.error('Error en la respuesta:', ans.menus);
            }
          } else {
            console.error('Error en la respuesta: Propiedad "code" no encontrada.');
          }
        },
        (error) => {
          console.error('Error al obtener los menús:', error);
        }
      );
    }
  }


  // Método para borrar una imagen
  async borrarImg(id_menu: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas borrar este menú?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Borrado de menu cancelado');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            try {
              this.menuUploadService.borrarImg(id_menu).subscribe(async (ans) => {
                // console.log(ans);

                // Actualiza lista de las imágenes de cartas
                this.getImg();

                // Desactiva el día seleccionado en el formulario
                const diaControl = this.form.get('dia');
                diaControl?.enable(); // Habilita el control del día antes de desactivarlo
                diaControl?.disable({ emitEvent: false }); // Desactiva el control del día sin emitir el evento
                diaControl?.setValue(''); // Opcional: restablece el valor a vacío

                // Activa el día nuevamente en la lista de días
                const selectedDay = diaControl?.value;
                this.dias.push({ dia: selectedDay, disponible: true });
                window.location.reload();
              });
            } catch (e) {
              console.error(e);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para obtener la URL de la imagen
  obtenerUrlImg(menu: any): string {
    if (menu && menu.menu_img) {
      return `${this.BASE_RUTA}/${menu.menu_img}`;
    } else {
      // Manejar el caso en que menu o menu.menu_img sea undefined
      console.error('La propiedad menu_img es undefined en el menú:', menu);
      return ''; // O proporcionar una URL predeterminada o manejar según sea necesario
    }
  }

  // Método para alternar el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
