import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { RefreshService } from 'src/app/services/refresh.service';

import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  ionicForm!: FormGroup;
  submitted = false;
  registros: any;
  rol!: any;
  empresas: any;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public userRegis: UsuariosService,
    private refreshService: RefreshService
  ) {
    this.ionicForm = this.formBuilder.group({
      nombre: new FormControl("", Validators.compose([Validators.required])),
      apellido: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmPassword: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
      rol: new FormControl("administrador", Validators.compose([Validators.required])),
      id_empresa: new FormControl("", Validators.compose([Validators.required])),

    }, {
      validators: this.MustMatch('password', 'confirmPassword') // Validador personalizado para comparar contraseñas
    });
  }

  ngOnInit() {
    // Llama al método getEmpresas al iniciar el componente para cargar las opciones del ion-select
    this.userRegis.getEmpresas().subscribe(
      (response: any) => {
        if (response && response.code === 200) {
          this.empresas = response.data || [];
        } else {
          console.error('Error al obtener empresas:', response ? response.error : 'Respuesta no válida');
        }
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
  }

  // Método que inicia el refresco desde este componente
  initiateRefresh(): void {
    this.refreshService.startRefresh();
  }

  get f() {
    return this.ionicForm.controls;
  }

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

  get errorControl() {
    return this.ionicForm.controls;
  }

  alert(event: any) {
    console.log(event.target);

    const datos = {
      nombre: event.target.nombre,
      apellido: event.target.apellido,
      email: event.target.email,
      password: event.target.password,
      rol: event.target.rol,
    }

    console.log(datos);

    this.submitted = true;

    // Detenerse aquí si el formulario no es válido
    if (this.ionicForm.invalid) {
      return;
    }
    // Mostrar los valores del formulario en caso de éxito
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.ionicForm.value, null, 4));
  }

  enviarDatos() {
    console.log('Enviando datos:', this.ionicForm.value);

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
          this.mostrarAlertaNO('Error', 'Email ya registrado');
        } else {
          console.log('Mostrando alerta de éxito...');
          // Llama al método mostrarAlertaOK con el mensaje específico
          this.mostrarAlertaOK('Enhorabuena', 'Usuario creado correctamente');
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

  async mostrarAlertaOK(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [{
        text: 'OK',
        handler: () => {
          window.location.href = '/registro-empresa';
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