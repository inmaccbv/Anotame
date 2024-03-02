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

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/uploads";

  selectedFile: File | null = null;

  availableDays: string[] = [];
  dias: any;

  menus: any;
  menusFiltrados: any;

  idEmpresa: any;

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
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();

    // Llamo a getDias para obtener los días de la semana
    this.getDias().subscribe(
      (dias) => {
        if (dias) {
          this.getImg();
        }
      }
    );

    // Asigno el valor de id_empresa desde localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

    // Llamo a getImg solo si el idEmpresa está presente
    if (this.idEmpresa) {
      this.getImg();
    }
  }

  // Obtengo los días de la semana
  getDias() {
    return this.diasService.getDias().pipe(
      tap((ans) => {
        this.dias = ans;
        this.availableDays = this.dias.map((dia: any) => dia.dia); // Inicializo los días disponibles
        // console.log('Días de la semana: ', this.dias);
      }),
      catchError((error) => {
        console.error('Error al obtener los días:', error);
        return of(null); // Devuelvo un observable de null en caso de error
      })
    );
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

  // Manejo la selección de archivos
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  // Obtengo las imágenes del servidor
  getImg() {
    if (this.idEmpresa !== null) {
      this.menuUploadService.getMenusByEmpresa(this.idEmpresa).subscribe(
        (ans: any) => {
          // Compruebo si 'ans' tiene la propiedad 'code'
          if ('code' in ans) {
            if (ans.code === 200) {
              // La solicitud fue exitosa, asigno los menús
              // Compruebo si 'ans' tiene la propiedad 'data'
              if ('data' in ans) {
                this.menus = ans.data;
                this.menusFiltrados = ans.data;

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

  // Método para obtener la URL de la imagen
  obtenerUrlImg(menu: any): string {
    if (menu && menu.menu_img) {
      return `${this.BASE_RUTA}/${menu.menu_img}`;
    } else {
      // Manejo el caso en que menu o menu.menu_img sea undefined
      console.error('La propiedad menu_img es undefined en el menú:', menu);
      return ''; // O proporciono una URL predeterminada o manejo según sea necesario
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCliente.logout().subscribe();
  }
}
