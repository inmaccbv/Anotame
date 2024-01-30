import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  recordarDatos = false;

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public userLogin: UsuariosService,
    public authService: AuthService,
  ) { 
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
      recordarDatos: [false] // valor por defecto del checkbox
    });
  }

  ngOnInit() {
    // Recupera el ID del usuario almacenado en localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loginForm.patchValue({ userId });
    }

    if (userId) {
      this.loginForm.patchValue({
        userId: userId,
      });
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  // Método para manejar el evento de clic en el botón
  alert(event: any) {
    console.log(event.target);

    // Obtener datos del formulario
    const datos = {
      email: event.target.email,
      password: event.target.password
    }

    // Asignar el valor del checkbox a la propiedad recordarDatos
    this.recordarDatos = this.loginForm.controls['recordarDatos'].value;

    // Validaciones
    this.submitted = true;

    // Detenerse aquí si el formulario no es válido
    if (this.loginForm.invalid) {
      return;
    }

     // En lugar de mostrar la alerta, enviar los datos al servicio
    this.enviarDatos();
  }

  // Método para enviar datos al servicio de inicio de sesión
  enviarDatos() {
    this.userLogin.loginUser(this.loginForm.value).subscribe(
      (rol: any) => {
        // Utiliza el método storeUserRole para almacenar el rol en localStorage
        this.authService.storeUserRole(rol);

        if (this.recordarDatos) {
          localStorage.setItem('usuario', JSON.stringify(this.loginForm.value));
        } else {
          localStorage.setItem('usuario', JSON.stringify(this.loginForm.value));
        }
  
        console.log('Rol almacenado en el localStorage:', localStorage.getItem('role'));
        window.location.href = '/home';
      },
      (error: any) => {
        console.error('Error al obtener el rol del usuario:', error);
        this.presentAlert('Error', 'Usuario o contraseña incorrectos');
      }
    );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}