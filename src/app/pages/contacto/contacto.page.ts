import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {

  ionicForm!: FormGroup;
  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;
  datos: any[] = [];

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    public authService: AuthService,
    public contactService: ContactoService,
    public menuService: MenuService,
    public themeService: ThemeService,
  ) {
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();

    this.ionicForm = this.formBuilder.group({
      nomLocal: ['', [Validators.required]],
      direccion: [''],
      telf1: [''],
      telf2: [''],
    });
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.getStoredData(); // Cargar datos almacenados al inicializar
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();

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
      );
    }
  }

  enviarDatos() {
    console.log('Datos a enviar:', this.ionicForm.value);

    if (this.ionicForm.valid) {
      this.contactService.subirDatos(this.ionicForm.value).subscribe(
        (ans) => {
          console.log('Respuesta del servidor:', ans);

          if (ans && ans.code === 200) {
            console.log('Datos subidos con éxito.');
            this.ionicForm.reset();
            this.getStoredData(); // Actualizar datos locales

            // Agregar la lógica para guardar en localStorage
            const storedData = JSON.parse(localStorage.getItem('datos') || '[]');
            storedData.push(ans.data); // asumiendo que ans.data contiene los nuevos datos
            localStorage.setItem('datos', JSON.stringify(storedData));

            window.location.reload();
          } else {
            console.error('Error en la respuesta del servidor:', ans);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
        }
      );
    } else {
      console.error('El formulario no es válido.');
    }
  }

  private getStoredData() {
    this.contactService.obtenerDatos().subscribe(
      (nuevosDatos) => {
        console.log('Datos locales actualizados:', nuevosDatos);
        this.datos = nuevosDatos;
      },
      (error) => {
        console.error('Error al obtener datos locales:', error);
      }
    );
  }

  async eliminarDato(id_datos: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este dato?',
      cssClass: 'alert-orange-text', 
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              console.log(`Intentando eliminar dato con id: ${id_datos}`);
  
              // Lógica para eliminar el dato localmente sin llamar al servicio
              const updatedDatos = this.datos.filter(dato => dato.id_datos !== id_datos);
              this.datos = updatedDatos;
              localStorage.setItem('datos', JSON.stringify(updatedDatos));
  
              console.log('Dato eliminado con éxito.');
            } catch (error) {
              console.error('Error al eliminar dato:', error);
            }
          }
        }
      ]
    });
  
    console.log(`Intentando eliminar dato con id: ${id_datos}`);
    await alert.present();
  }
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
