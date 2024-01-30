import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { CartaUploadService } from 'src/app/services/carta-upload.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.page.html',
  styleUrls: ['./carta.page.scss'],
})
export class CartaPage implements OnInit {

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/";

  selectedFile: File | null = null;
  uploadedFiles: any[] = [];
  cartas: any;

  rol!: any;
  isDarkMode: boolean = false;

  constructor(
    private cartaUploadService: CartaUploadService,
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router,
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    // Llama a getImg para actualizar la lista de imágenes
    this.getImg();
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
          console.error('Error al cerrar sesion:', error);
        }
      )
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadImage() {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('carta_img', this.selectedFile, this.selectedFile.name);

      this.cartaUploadService.uploadFile(formData).subscribe(
        (response: any) => {
          console.log('Respuesta del servidor:', response);

          if (response && response.authorized === 'SI' && response.url) {
            const fileName = response.data.carta_img;

            // Cambia la siguiente línea para construir la URL correctamente
            const imageUrl = this.BASE_RUTA + response.data.carta_img;


            this.uploadedFiles.push({ name: fileName, url: imageUrl });
            console.log('Lista de cartas después de subir:', this.uploadedFiles);
            this.getImg();
          } else {
            console.error('Error al subir la imagen:', response);
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
        }
      );
    }
  }

  getImg() {
    this.cartaUploadService.getImg().subscribe((ans: any[]) => {
      this.cartas = ans;
      console.log(this.cartas);
    });
  }

  borrarImg(id_carta: any) {
    try {
      this.cartaUploadService.borrarImg(id_carta).subscribe(async (ans) => {
        console.log(ans);
        // Actualiza lista de las imagenes de cartas
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