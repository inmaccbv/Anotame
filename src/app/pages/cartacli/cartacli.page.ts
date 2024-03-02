import { Component, OnInit } from '@angular/core';
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

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/uploads";

  selectedFile: File | null = null;

  // Arreglos para almacenar las cartas y las cartas filtradas
  cartas: any;
  cartasFiltradas: any;

  // Variable para almacenar el ID de la empresa
  idEmpresa: any;

  rol!: any;
  isDarkMode: boolean = false;

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
    this.isDarkMode = this.themeService.isDarkTheme();

    // Asignar el valor de id_empresa desde localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

    // Llamar a getImg solo si el idEmpresa está presente
    if (this.idEmpresa) {
      this.getImg();
    }
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authServiceCliente.getUserRole();

    // Verificar el rol y manejar el acceso no autorizado
    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

      // Cerrar sesión y redirigir al inicio
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
    if (this.idEmpresa !== null) {
      this.cartaUploadService.getCartasByEmpresa(this.idEmpresa).subscribe(
        (ans: any) => {
          // Comprobar si 'ans' tiene la propiedad 'code'
          if ('code' in ans) {
            if (ans.code === 200) {
              // La solicitud fue exitosa, asignar las cartas
              // Comprobar si 'ans' tiene la propiedad 'data'
              if ('data' in ans) {
                this.cartas = ans.data;
                this.cartasFiltradas = ans.data;

                console.log('Cartas obtenidas:', this.cartas);
              } else {
                console.error('Error en la respuesta: Propiedad "data" no encontrada.');
              }
            } else {
              console.error('Error en la respuesta:', ans.cartas);
            }
          } else {
            console.error('Error en la respuesta: Propiedad "code" no encontrada.');
          }
        },
        (error) => {
          console.error('Error al obtener las cartas:', error);
        }
      );
    }
  }

  // Método para obtener la URL de la imagen
  obtenerUrlImg(carta: any): string {
    if (carta && carta.carta_img) {
      return `${this.BASE_RUTA}/${carta.carta_img}`;
    } else {
      // Manejar el caso en que carta o carta.carta_img sea undefined
      console.error('La propiedad carta_img es undefined en la carta:', carta);
      return ''; // O proporcionar una URL predeterminada o manejar según sea necesario
    }
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
