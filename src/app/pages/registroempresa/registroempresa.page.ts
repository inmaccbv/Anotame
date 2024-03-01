import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProvinciasService } from 'src/app/services/provincias.service';

@Component({
  selector: 'app-registroempresa',
  templateUrl: './registroempresa.page.html',
  styleUrls: ['./registroempresa.page.scss'],
})
export class RegistroempresaPage implements OnInit {

  empresaForm!: FormGroup;
  submitted = false;
  empresas: any;
  provincias: any;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    public empresaRegis: EmpresaService,
    public provinciasService: ProvinciasService,
    public authService: AuthService,
  ) {
    this.empresaForm = this.formBuilder.group({
      cif: new FormControl("", Validators.compose([Validators.required, Validators.pattern("[A-Za-z]{1}[0-9]{8}")])),
      empresa: new FormControl("", Validators.compose([Validators.required])),
      direccion: new FormControl("", Validators.compose([Validators.required])),
      provincia: new FormControl("", Validators.compose([Validators.required])),
      ciudad: new FormControl("", Validators.compose([Validators.required])),
      cPostal: new FormControl("", Validators.compose([Validators.required])),
      tipoLocal: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
    this.getProvincias();
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.empresaForm.controls;
  }

  // Obtener la lista de provincias al iniciar la página
  getProvincias() {
    this.provinciasService.getProvincias().subscribe(async (ans) => {
      this.provincias = ans;
    });
  }

  // Método para enviar los datos del formulario al servidor
  async enviarDatos() {
    this.submitted = true;

    // Verificar si el formulario es válido
    if (this.empresaForm.invalid) {
      return;
    }

    try {
      // Realizar la solicitud al servicio de registro de empresa
      const ans = await this.empresaRegis.registroEmpresa(this.empresaForm.value).toPromise();

      console.log('Respuesta del servidor:', ans);

      // Almacenar la respuesta del servidor en la variable 'empresas'
      this.empresas = ans;

      // Verificar la respuesta del servidor
      if (this.empresas['authorized'] === 'NO') {
        this.mostrarAlertaNO('Error', 'CIF ya registrado');
      } else {
        // Mostrar alerta de éxito y redirigir a la página de registro
        const empresa = this.empresas['data']['empresa'];
        localStorage.setItem('empresa', empresa);
        this.mostrarAlertaOK('Enhorabuena', 'Empresa registrada correctamente');
        this.router.navigate(['/registro']);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Mostrar alerta en caso de error en la solicitud
      this.mostrarAlertaNO('Error', 'Error al registrar empresa');
    }
  }

  // Método para mostrar alerta de éxito
  async mostrarAlertaOK(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [{
        text: 'OK',
        handler: () => {
          const empresa = localStorage.getItem('empresa');
          console.log('Nombre de la empresa en localStorage:', empresa);
          window.location.href = '/registro';
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