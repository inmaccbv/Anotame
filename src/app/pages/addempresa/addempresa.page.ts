import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-addempresa',
  templateUrl: './addempresa.page.html',
  styleUrls: ['./addempresa.page.scss'],
})
export class AddempresaPage  {

  empresas: any;
  empresaForm!: FormGroup;
  provincias: any;
  submitted = false;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private router: Router,
    public empresaRegis: EmpresaService,
    public provinciasService: ProvinciasService,
    public authService: AuthService,
    public themeService: ThemeService,
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
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  // ngOnInit() {
  //   this.getProvincias();
  // }

  // Obtener el rol del usuario
  getUserRole() {
    this.rol = this.authService.getUserRole();
    // console.log(this.rol);

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

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.empresaForm.controls;
  }

  // Obtener la lista de provincias al iniciar la página
  // getProvincias() {
  //   this.provinciasService.getProvincias().subscribe(async (ans) => {
  //     this.provincias = ans;
  //   });
  // }

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
          window.location.href = '/config-empleados';
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

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe();
  }
}
