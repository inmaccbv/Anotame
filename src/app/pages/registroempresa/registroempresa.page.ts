// RegistroempresaPage
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
    });
  }

  ngOnInit() {
    this.getProvincias();
  }

  get f() {
    return this.empresaForm.controls;
  }

  async enviarDatos() {
    this.submitted = true;
  
    if (this.empresaForm.invalid) {
      return;
    }
  
    try {
      const ans = await this.empresaRegis.registroEmpresa(this.empresaForm.value).toPromise();
  
      console.log('Respuesta del servidor:', ans);
  
      this.empresas = ans;
  
      if (this.empresas['authorized'] === 'NO') {
        this.mostrarAlertaNO('Error', 'CIF ya registrado');
      } else {
        const empresa = this.empresas['data']['empresa'];
        console.log('Nombre de la empresa antes de almacenar en localStorage:', empresa);
        localStorage.setItem('empresa', empresa);
        console.log('Nombre de la empresa almacenado en localStorage:', localStorage.getItem('empresa'));
        this.mostrarAlertaOK('Enhorabuena', 'Empresa creada correctamente');
        // this.router.navigate(['/registro']);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      this.mostrarAlertaNO('Error', 'Error al registrar empresa');
    }
  }

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

  async mostrarAlertaNO(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert-header'
    });

    await alert.present();
  }

  getProvincias() {
    this.provinciasService.getProvincias().subscribe(async (ans) => {
      this.provincias = ans;
    });
  }
}
