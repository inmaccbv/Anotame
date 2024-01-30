import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuService } from 'src/app/services/menu.service';

import { Componente } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-addempleados',
  templateUrl: './addempleados.page.html',
  styleUrls: ['./addempleados.page.scss'],
})
export class AddempleadosPage implements OnInit {

  ionicForm!: FormGroup;
  submitted = false;

  regisEmpleado: any;
  empresas: any[] = [];

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public userRegis: UsuariosService,
    public authService: AuthService,
    public menuService: MenuService,
    public themeService: ThemeService,
    private router: Router
  ) {
    this.ionicForm = this.formBuilder.group({
      nombre: new FormControl("", Validators.compose([Validators.required])),
      apellido: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmPassword: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
      empresa: new FormControl("", Validators.compose([Validators.required])),
      rol: new FormControl("", Validators.compose([Validators.required])),
    }, {
      validators: this.MustMatch('password', 'confirmPassword')
    });
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuService.getMenuOpts();
    this.cargarEmpresas(); // Carga la lista de empresas al iniciar
  }

  // Obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    console.log(this.rol);

    // Verificar si el rol no es "administrador" 
    if (!(this.rol === 'administrador')) {
      console.error('Usuario con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {
          // Elimina cualquier informacion de session almacenada localmente
          localStorage.removeItem('role');
          localStorage.removeItem('usuario');

          // Redirigir al usuario a la pagina de inicion de sesion
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      )
    }
  }

  // Método getter para acceder a los controles del formulario
  get f() {
    return this.ionicForm.controls;
  }

  // Validador personalizado para comprobar si dos campos son iguales (en este caso, para las contraseñas)
  MustMatch(password: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const passwordcontrol = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['MustMatch']) {
        return;
      }

      if (passwordcontrol.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ MustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  // Getter para acceder a los controles del formulario
  get errorControl() {
    return this.ionicForm.controls;
  }

  // Método para manejar eventos de clic en el botón
  alert(event: any) {
    console.log(event.target);

    // Creación de un objeto con los datos del formulario
    const datos = {
      nombre: event.target.nombre,
      apellido: event.target.apellido,
      email: event.target.email,
      empresa: event.target.empresa,
      password: event.target.password,
      rol: event.target.rol,
    }

    this.submitted = true;

    // Validación del formulario antes de enviar
    if (this.ionicForm.invalid) {
      return;
    }

    // Muestra los datos del formulario en caso de éxito
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.ionicForm.value, null, 4));
  }

  // Método para cargar la lista de empresas
  cargarEmpresas() {
    this.userRegis.getEmpresas().subscribe((empresas: any) => {
      console.log('Empresas:', empresas);
      this.empresas = empresas;
    });
  }

  // Método para enviar datos del formulario al servicio de registro de usuarios
  enviarDatos() {
    console.log(this.ionicForm.value);

    this.userRegis.registroUsuario(this.ionicForm.value).subscribe(
      async (ans) => {
        console.log(ans);
        this.regisEmpleado = ans;
        console.log(this.regisEmpleado['data']);
        console.log(this.regisEmpleado['texto']);
        console.log(this.regisEmpleado['authorized']);

        // Verificar la respuesta y mostrar la alerta correspondiente
        if (this.regisEmpleado['authorized'] === 'SI') {
          this.mostrarAlertaOK('Registro exitoso', this.regisEmpleado['texto']);
          window.location.href = '/config-empleados';
        } else if (this.regisEmpleado['authorized'] === 'NO') {
          this.mostrarAlertaNO('Error de registro', this.regisEmpleado['texto']);
          // Puedes redirigir a la página de configuración de empleados aquí si es necesario
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Métodos para mostrar una alerta
  async mostrarAlertaOK(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Empleado creado correctamente',
      message: 'Se ha enviado email ha empleado',
      buttons: ['OK'],
      cssClass: 'custom-alert-header'
    });

    await alert.present();
  }

  async mostrarAlertaNO(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Empleado ya existe',
      buttons: ['OK'],
      cssClass: 'custom-alert-header'
    });

    await alert.present();
  }

  // Método para cambiar el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}