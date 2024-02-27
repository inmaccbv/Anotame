import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { CartaUploadService } from 'src/app/services/carta-upload.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-cartacli',
  templateUrl: './cartacli.page.html',
  styleUrls: ['./cartacli.page.scss'],
})
export class CartacliPage implements OnInit {

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/";

  selectedFile: File | null = null;
  uploadedFiles: any[] = [];
  cartas: any;
  idEmpresa!: number | null;

  rol!: any;
  isDarkMode: boolean = false;

  @ViewChild('idEmpresaInput') idEmpresaInput!: ElementRef;

  constructor(
    private router: Router,
    private cartaUploadService: CartaUploadService,
    public authServiceCliente: AuthClienteService,
    public themeService: ThemeService,
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    // Recuperar el valor de id_empresa del localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

    console.log('ID Empresa:', this.idEmpresa);

    // Llama a getImg para actualizar la lista de imágenes
    this.getImg();
  }

  getUserRole() {
    this.rol = this.authServiceCliente.getUserRole();
    // console.log(this.rol);

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

  // Método que se ejecuta al seleccionar un archivo para cargar
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  

  // Método para obtener la lista de imágenes desde el servidor
  getImg() {
    this.cartaUploadService.getImg().subscribe(
      (ans: any[]) => {
        this.cartas = ans;
        // console.log(this.cartas);
      },
      (error) => {
        console.error('Error al obtener imágenes:', error);
      }
    );
  }

  // Método para cambiar el modo visual del tema
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar la sesión del usuario
  cerrarSesion(): void {
    this.authServiceCliente.logout().subscribe();
  }
}
