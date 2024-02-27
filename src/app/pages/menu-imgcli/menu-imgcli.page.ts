
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { DiasService } from 'src/app/services/dias.service';
import { MenuUploadService } from 'src/app/services/menu-upload.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-menu-imgcli',
  templateUrl: './menu-imgcli.page.html',
  styleUrls: ['./menu-imgcli.page.scss'],
})
export class MenuImgcliPage implements OnInit {

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/";
  selectedFile: File | null = null;
  uploadedFiles: any[] = [];
  availableDays: string[] = [];
  menusArr: any[] = [];
  dias: any;
  rol!: any;
  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    public authServiceCliente: AuthClienteService,
    public themeService: ThemeService,
    private diasService: DiasService,
    private menuUploadService: MenuUploadService,
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    // Obtiene el rol del usuario y configura el modo oscuro
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();

    // Llama a getImg para actualizar la lista de imágenes
    this.getImg();

    // Obtiene información del localStorage
    const storedMenus = localStorage.getItem('menusArr');
    const storedDias = localStorage.getItem('dias');

    // Si hay información en el localStorage, la asigna a las variables correspondientes
    if (storedMenus && storedDias) {
      this.menusArr = JSON.parse(storedMenus);
      this.dias = JSON.parse(storedDias);
    }

    // Llama a getDias para obtener los días de la semana
    this.getDias().subscribe(
      (dias) => {
        if (dias) {
          this.getImg();
        }
      }
    );
  }

  // Obtiene los días de la semana
  getDias() {
    return this.diasService.getDias().pipe(
      tap((ans) => {
        this.dias = ans;
        this.availableDays = this.dias.map((dia: any) => dia.dia); // Inicializa los días disponibles
        console.log('Días de la semana: ', this.dias);
      }),
      catchError((error) => {
        console.error('Error al obtener los días:', error);
        return of(null); // Devuelve un observable de null en caso de error
      })
    );
  }

  getUserRole() {
    this.rol = this.authServiceCliente.getUserRole();
    console.log(this.rol);

    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

      this.authServiceCliente.logout().subscribe(
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

  // Maneja la selección de archivos
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadImage() {
    // Verifica si hay un archivo seleccionado
    if (this.selectedFile) {
      // Crea un formulario de datos (FormData) y añade la imagen
      const formData: FormData = new FormData();
      formData.append('menu_img', this.selectedFile, this.selectedFile.name);
  
      // Utiliza el servicio para subir la imagen al servidor
      this.menuUploadService.uploadFile(formData).subscribe(
        // Maneja la respuesta del servidor
        (response: any) => {
          console.log('Respuesta del servidor:', response);
  
          // Verifica si la respuesta es válida y autorizada
          if (response && response.authorized === 'SI' && response.url) {
            // Obtiene el nombre del archivo y construye la URL de la imagen correctamente
            const fileName = response.data.carta_img;
            const imageUrl = this.BASE_RUTA + response.data.carta_img;
  
            // Añade la información de la imagen a la lista uploadedFiles
            this.uploadedFiles.push({ name: fileName, url: imageUrl });
            console.log('Lista de cartas después de subir:', this.uploadedFiles);
          } else {
            // Muestra un mensaje de error en caso de respuesta no válida
            console.error('Error al subir la imagen:', response);
          }
        },
        // Maneja errores de la solicitud y muestra mensajes detallados en la consola
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }
  }

  // Obtiene las imágenes del servidor
  getImg() {
    this.menuUploadService.getImg().subscribe(
      (ans: any[]) => {
        console.log('Datos obtenidos:', ans);
        this.menusArr = ans;
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCliente.logout().subscribe();
  }
}