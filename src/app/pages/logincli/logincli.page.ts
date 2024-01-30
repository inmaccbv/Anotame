import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertController } from '@ionic/angular';

import { ClientesService } from 'src/app/services/clientes.service';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';

@Component({
  selector: 'app-logincli',
  templateUrl: './logincli.page.html',
  styleUrls: ['./logincli.page.scss'],
})
export class LogincliPage implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  recordarDatos = false;
  clientes: any;

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public clienteService: ClientesService,
    public authCliente: AuthClienteService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
      recordarDatos: [false] // valor por defecto del checkbox
    });
  }

  ngOnInit() {
    // Recupera el ID del usuario almacenado en localStorage
    const clienteId = localStorage.getItem('clienteId');
    if (clienteId) {
      this.loginForm.patchValue({ clienteId });
    }

    if (clienteId) {
      this.loginForm.patchValue({
        clienteId: clienteId,
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

    // Mostrar los valores del formulario en caso de éxito
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value, null, 4));
  }

  enviarDatos() {
    this.clienteService.loginCliente(this.loginForm.value).subscribe(
      (rol: any) => {
        // Utilizar el método storeUserRole para almacenar el rol en localStorage
        this.authCliente.storeUserRole(rol);
  
        // Si la propiedad recordarDatos es true, guardar el usuario en el localStorage
        if (this.recordarDatos) {
          localStorage.setItem('cliente', JSON.stringify(this.loginForm.value));
        } else {
          localStorage.setItem('cliente', JSON.stringify(this.loginForm.value));
        }
       
        console.log('Rol almacenado en el localStorage:', localStorage.getItem('role'));
        // Redirigir a la página principal solo si la autenticación es exitosa
        window.location.href = '/homecli';
      },
      (error: any) => {
        console.error('Error al obtener el rol del cliente:', error);
  
        // Mostrar alerta de error
        this.presentAlert('Error', 'Cliente o contraseña incorrectos');
  
      }
    );
  }
  
  async presentAlert(header: string, message: string) {
    console.log('Mostrando alerta:', header, message);
  
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
  
    alert.onDidDismiss().then(() => {
      console.log('Alerta cerrada');
    });
  
    await alert.present();
  }
  
}