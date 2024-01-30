import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { ThemeService } from 'src/app/services/theme.service';
import { MenuUploadService } from 'src/app/services/menu-upload.service';
import { DiasService } from 'src/app/services/dias.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-menu-img',
  templateUrl: './menu-img.page.html',
  styleUrls: ['./menu-img.page.scss'],
})
export class MenuImgPage implements OnInit {

  BASE_RUTA: string = "http://localhost/anotame/APIANOTAME/public/";

  selectedFile: File | null = null;

  menus: any;
  arrImgAndDay: any;
  combinedMenus: any[] = [];
  availableDays: string[] = [];

  dias: any;
  form: FormGroup;

  rol!: any;
  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private menuUploadService: MenuUploadService,
    private diasService: DiasService,
    public authService: AuthService,
    public themeService: ThemeService,
  ) {
    this.isDarkMode = this.themeService.isDarkTheme();

    // Inicializa el formulario en el constructor
    this.form = this.formBuilder.group({
      dia: new FormControl('', { updateOn: 'blur' }),
    });

    this.arrImgAndDay = [];
  }

  ngOnInit() {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  
    // Llama a getDias para obtener los días de la semana
    this.getDias().subscribe(
      (dias) => {
        if (dias) {
          this.getImg();
        }
      }
    );
  }
  
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
      const selectedDay = this.form.get('dia')?.value;
  
      console.log('Antes de desactivar:', this.form.value);
  
      const formData: FormData = new FormData();
      formData.append('menu_img', this.selectedFile, this.selectedFile.name);
      formData.append('dia', selectedDay);
  
      this.menuUploadService.uploadFile(formData).subscribe(
        (response: any) => {
          console.log('Respuesta del servidor:', response);
  
          if (response && response.authorized === 'SI' && response.url) {
            const nomImg = response.data.menu_img;
            const imgUrl = this.BASE_RUTA + response.data.menu_img;
  
            // Almacena los datos en el localStorage
            const imageData = { fileName: nomImg, imageUrl: imgUrl, selectedDay };
            this.storeImageDataInLocalStorage(imageData);
  
            // Actualiza la lista de cartas después de subir la imagen
            this.getImg();
  
            // Desactivar la opción del día seleccionado en el formulario
            const diaControl = this.form.get('dia');
            diaControl?.disable({ emitEvent: false }); // Desactiva el control del día sin emitir el evento
  
            console.log('Después de desactivar:', this.form.value);
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
  
  
  storeImageDataInLocalStorage(imageData: any) {
    const localStorageKey = 'arrImg&Day';
    let storedImages = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  
    // Verifica si ya hay 7 elementos en el array
    if (storedImages.length >= 7) {
      // Elimina el primer elemento del array para mantener un límite de 7 elementos
      storedImages.shift();
    }
  
    storedImages.push({
      id_menu: imageData.id_menu,  // Añade el ID de la imagen al array
      fileName: imageData.fileName,
      selectedDay: imageData.selectedDay
    });
  
    localStorage.setItem(localStorageKey, JSON.stringify(storedImages));
  }
  

  getImageDataFromLocalStorage(fileName: string): { selectedDay?: string } {
    const localStorageKey = 'arrImg&Day'; 
    const storedImages = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    const imageData = storedImages.find((image: any) => image.fileName === fileName) || {}; 
    return { selectedDay: imageData.selectedDay };
  }
  
  getImg() {
    this.menuUploadService.getImg().subscribe((ans: any[]) => {
      this.menus = ans.map(menu => {
        const imageData = this.getImageDataFromLocalStorage(menu.menu_img);
        return { ...menu, ...imageData };
      });
      
      // Combine menus and arrImgAndDay into combinedMenus
      this.combinedMenus = [...this.menus, ...this.arrImgAndDay];
  
      // Desactivar el día en el formulario si ya existe en la lista de menús
      const diaControl = this.form.get('dia');
      if (diaControl?.value && this.combinedMenus.some(menu => menu.selectedDay === diaControl.value)) {
        diaControl?.disable({ emitEvent: false }); // Desactiva el control del día sin emitir el evento
      } else {
        diaControl?.enable(); // Habilita el control del día si no existe en la lista de menús
      }
    });
  }
  
  borrarImg(id_menu: any) {
    try {
      this.menuUploadService.borrarImg(id_menu).subscribe(async (ans: any) => {
        console.log(ans);
  
        // Actualiza lista de las imágenes de cartas
        this.getImg();
  
        // Desactivar el día seleccionado en el formulario
        const diaControl = this.form.get('dia');
        diaControl?.enable(); // Habilita el control del día antes de desactivarlo
        diaControl?.disable({ emitEvent: false }); // Desactiva el control del día sin emitir el evento
        diaControl?.setValue(''); // Opcional: restablece el valor a vacío
  
        // Activar el día nuevamente en la lista de días
        const selectedDay = diaControl?.value;
        this.dias.push({ dia: selectedDay, disponible: true });
  
        // Eliminar la imagen del Local Storage
        const localStorageKey = 'arrImg&Day';
        const fileNameToDelete = ans as string; // Convertir ans a cadena
  
        // Encuentra el índice de la imagen a eliminar por fileName
        let storedImages = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        const index = storedImages.findIndex((image: any) => image.fileName === fileNameToDelete);
  
        if (index !== -1) {
          storedImages.splice(index, 1); // Elimina el elemento del array
          localStorage.setItem(localStorageKey, JSON.stringify(storedImages));
          console.log('Imagen eliminada del localStorage');
        } else {
          console.log('La imagen no se encontró en el localStorage');
        }
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
