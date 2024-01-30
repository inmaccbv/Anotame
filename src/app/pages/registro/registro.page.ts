// RegistroPage
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EmpresaService } from 'src/app/services/empresa.service';
import { RefreshService } from 'src/app/services/refresh.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  ionicForm: FormGroup;
  submitted = false;
  registros: any;
  empresa: any;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    public userRegis: UsuariosService,
    public empresaRegis: EmpresaService,
    private refreshService: RefreshService
  ) {
    this.ionicForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['administrador', Validators.required],
      empresa: [this.empresa, Validators.required], 
    }, {
      validators: this.MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit() {
    this.empresa = localStorage.getItem('empresa');
  
    // Asegurémonos de que la propiedad 'empresa' exista en el formulario antes de establecer su valor
    const empresaControl = this.ionicForm.get('empresa');
    if (empresaControl) {
      empresaControl.setValue(this.empresa || '');  // Asegúrate de que empresa no sea nulo
    } else {
      console.error('El formulario no contiene una propiedad llamada "empresa". Verifica la estructura del formulario.');
    }
  }
  
  

  get f() {
    return this.ionicForm.controls;
  }

  MustMatch(password: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['MustMatch']) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ MustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  initiateRefresh(): void {
    this.refreshService.startRefresh();
  }

  enviarDatos() {
  
    console.log('Enviando datos:', this.ionicForm.value);
    console.log('Valor de empresa antes de enviar datos:', this.empresa);
  
    this.submitted = true;
  
    if (this.ionicForm.invalid) {
      console.log('Formulario no válido. Deteniendo envío de datos.');
      return;
    }
  
    this.userRegis.registroUsuario(this.ionicForm.value).subscribe(
      (ans) => {
        console.log('Respuesta del servidor:', ans);
  
        this.registros = ans;
  
        console.log('Datos de registros:', this.registros['data']);
        console.log('Texto de registros:', this.registros['texto']);
        console.log('Authorized de registros:', this.registros['authorized']);
  
        if (this.registros['authorized'] === 'NO') {
          console.log('Mostrando alerta de error...');
          // Llama al método mostrarAlertaNO con el mensaje específico
          this.mostrarAlertaNO('Error', this.registros['texto']);
        } else {
          console.log('Mostrando alerta de éxito...');
          // Llama al método mostrarAlertaOK con el mensaje específico
          this.mostrarAlertaOK('Enhorabuena', this.registros['texto']);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
        console.log('Mostrando alerta de error en la solicitud...');
        // En caso de un error en la solicitud, muestra una alerta de error genérica
        this.mostrarAlertaNO('Error', 'Error en la solicitud. Por favor, inténtalo de nuevo.');
      }
    );
  }
  

  async mostrarAlertaOK(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [{
        text: 'OK',
        handler: () => {
          window.location.href = '/login';
        }
      }],
      cssClass: 'custom-alert-header'
    });

    await alert.present();
  }

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

     
