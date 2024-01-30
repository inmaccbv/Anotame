import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';

import { AuthService } from 'src/app/services/auth.service';
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
  menus: any;
  dias: any[] = [];
  menusArr: any[] = [];

  rol!: any;
  isDarkMode: boolean = false;

  constructor(
    public authServiceCliente: AuthClienteService,
    public authService: AuthService,
    public themeService: ThemeService,
    private menuUploadService: MenuUploadService,
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

    // Obtener información directamente del localStorage
    const storedMenus = localStorage.getItem('menusArr');
    const storedDias = localStorage.getItem('dias');

    if (storedMenus && storedDias) {
      this.menusArr = JSON.parse(storedMenus);
      this.dias = JSON.parse(storedDias);
    }
  }

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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadImage() {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('menu_img', this.selectedFile, this.selectedFile.name);

      this.menuUploadService.uploadFile(formData).subscribe(
        (response: any) => {
          console.log('Respuesta del servidor:', response);

          if (response && response.authorized === 'SI' && response.url) {
            const fileName = response.data.carta_img;

            // Cambia la siguiente línea para construir la URL correctamente
            const imageUrl = this.BASE_RUTA + response.data.carta_img;


            this.uploadedFiles.push({ name: fileName, url: imageUrl });
            console.log('Lista de cartas después de subir:', this.uploadedFiles);
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
    this.menuUploadService.getImg().subscribe((ans: any[]) => {
      console.log('Datos obtenidos:', ans);
      this.menusArr = ans;
    });
  }  

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCliente.logout().subscribe();
  }

}
