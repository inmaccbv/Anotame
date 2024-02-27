import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, catchError, map, of } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { MenuService } from 'src/app/services/menu.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {

  ionicForm!: FormGroup;

  id_empresa: number | null = null;
  id_user: number | null = null;

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
    public usuariosService: UsuariosService,
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
      id_empresa: [''],
      id_user: [''],
    });
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    // Llama al nuevo método para obtener datos del usuario y la empresa
    this.obtenerIdUsuario().subscribe(
      ({ idUsuario, idEmpresa }) => {
        console.log('Id de Usuario:', idUsuario);
        console.log('Id de Empresa:', idEmpresa);

        this.id_user = idUsuario;
        this.id_empresa = idEmpresa;
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
    if (this.ionicForm.valid) {
      // Continuar con el código solo si ambos valores no son nulos
      if (this.id_empresa !== null && this.id_user !== null) {
        // Crear un objeto que contenga todas las propiedades necesarias, incluyendo idEmpresa e idUsuario
        const datos = { ...this.ionicForm.value, id_empresa: this.id_empresa, id_user: this.id_user };

        // Enviar el texto con los datos correctos
        this.contactService.subirDatos(datos, this.id_empresa, this.id_user).subscribe(
          (ans) => {
            console.log('Respuesta del servidor:', ans);
            // Limpiar el formulario después de enviarlo
            this.ionicForm.reset();
          },
          (error) => {
            console.error('Error en la solicitud:', error);
          }
        );
      } else {
        console.error('No se pudo obtener el id de la empresa o el id del usuario.');
      }
    }
  

   
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
