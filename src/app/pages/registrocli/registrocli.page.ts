import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-registrocli',
  templateUrl: './registrocli.page.html',
  styleUrls: ['./registrocli.page.scss'],
})
export class RegistrocliPage {

  ionicForm!: FormGroup;
  submitted = false;
  registros: any;
  rol!: any;

  constructor(
    public formBuilder: FormBuilder,
    public clienteLogin: ClientesService,
    public alertController: AlertController
  ) { 
    // Inicialización del formulario con validadores
    this.ionicForm = this.formBuilder.group({
      nombre: new FormControl("", Validators.compose([ Validators.required ])),
      apellido: new FormControl("", Validators.compose([ Validators.required ])),
      email: new FormControl("", Validators.compose([ Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      password: new FormControl("", Validators.compose([ Validators.required, Validators.minLength(6) ])),
      telf: new FormControl("", Validators.compose([ Validators.required ])),
      confirmPassword: new FormControl("", Validators.compose([ Validators.required, Validators.minLength(6) ])),
      rol: new FormControl("cliente", Validators.compose([Validators.required])),
    },{
      // Validador personalizado para comparar contraseñas
      validators: this.MustMatch('password', 'confirmPassword')
    });
  }

  // Método getter para acceder a los controles del formulario
  get f() { 
    return this.ionicForm.controls; 
  }

  // Validador personalizado para comparar contraseñas
  MustMatch(password:any, confirmPassword:any) {
    return (formGroup:FormGroup) => {
      const passwordcontrol = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if(confirmPasswordControl.errors && !confirmPasswordControl.errors['MustMatch']) {
        return;
      }

      if(passwordcontrol.value !== confirmPasswordControl.value) {
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

  // Manejar eventos de alerta
  alert(event: any) {
    console.log(event.target);

    const datos = {
      nombre: event.target.nombre,
      apellido: event.target.apellido,
      email: event.target.email,
      telf: event.target.telf,
      password: event.target.password,
      rol: event.target.rol,
    }

    console.log(datos);

    this.submitted = true;

    if (this.ionicForm.invalid) {
      return;
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.ionicForm.value, null, 4));
  }

  // Enviar datos del formulario al servidor
  enviarDatos() {
    // console.log('Enviando datos:', this.ionicForm.value);
    
    this.submitted = true;
  
    if (this.ionicForm.invalid) {
      // console.log('Formulario no válido. Deteniendo envío de datos.');
      return;
    }
  
    // Llamar al servicio de registro del cliente
    this.clienteLogin.registroCliente(this.ionicForm.value).subscribe(
      (ans) => {
        // console.log('Respuesta del servidor:', ans);
  
        this.registros = ans;
  
        // console.log('Datos de registros:', this.registros['data']);
        // console.log('Texto de registros:', this.registros['texto']);
        // console.log('Authorized de registros:', this.registros['authorized']);
  
        // Verificar el estado de la autorización
        if (this.registros['authorized'] === 'NO') {
          console.log('Mostrando alerta de error...');
          // Llama al método mostrarAlertaNO con el mensaje específico
          this.mostrarAlertaNO('Error', 'Email ya registrado');
        } else {
          // console.log('Mostrando alerta de éxito...');
          // Llama al método mostrarAlertaOK con el mensaje específico
          this.mostrarAlertaOK('Enhorabuena', 'Cliente creado correctamente');
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
        console.log('Mostrando alerta de error en la solicitud...');
        // En caso de un error en la solicitud, muestra una alerta de error genérica
        this.mostrarAlertaNO('Error', 'Email ya registrado');
      }
    );
  }

  // Método para mostrar alerta de éxito
  async mostrarAlertaOK(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [{
        text: 'OK',
        handler: () => {
          window.location.href = '/logincli';
        }
      }],
      cssClass: 'custom-alert-header'
    });

    await alert.present();
  }

  // Método para mostrar alerta de error
  async mostrarAlertaNO(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert-header'
    });

    await alert.present();
  }
}
