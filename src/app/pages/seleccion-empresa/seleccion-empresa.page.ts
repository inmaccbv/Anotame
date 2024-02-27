import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/interfaces';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MenuCliService } from 'src/app/services/menucli.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-seleccion-empresa',
  templateUrl: './seleccion-empresa.page.html',
  styleUrls: ['./seleccion-empresa.page.scss'],
})
export class SeleccionEmpresaPage implements OnInit {

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;
  idEmpresa!: number;
  empresas!: any;

  constructor(
    private router: Router,
    public authServiceCli: AuthClienteService,
    private menuCli: MenuCliService,
    private empresaService: EmpresaService,
    public authService: AuthService,
    public themeService: ThemeService
  ) { 
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    this.getEmpresas();
    this.idEmpresa = this.authService.getIdEmpresa();
  }

  seleccionarEmpresa(event: any) {
    const idEmpresa = event.detail.value;

    if (idEmpresa) {
      const idEmpresaString = idEmpresa.toString();
      this.empresaService.setEmpresaSeleccionada(idEmpresaString).subscribe(
        (response) => {
          this.empresaService.empresaSeleccionada = response;
          this.redirigirYAlmacenarIdEmpresa(idEmpresaString); // Redirige y almacena el id_empresa
        },
        (error) => {
          console.error('Error al seleccionar la empresa:', error);
        }
      );
    } else {
      console.error('ID de empresa no válido');
    }
  }

  redirigirYAlmacenarIdEmpresa(idEmpresa: string) {
    // Redirige a la página de inicio del cliente
    this.router.navigate(['/homecli']);

    // Almacena el id_empresa en el localStorage
    localStorage.setItem('id_empresa', idEmpresa);
  }

  redirigirYAlmacenar() {
    const idEmpresa = this.idEmpresa;

    if (idEmpresa) {
      const idEmpresaString = idEmpresa.toString();
      this.redirigirYAlmacenarIdEmpresa(idEmpresaString); // Redirige y almacena el id_empresa
    } else {
      console.error('ID de empresa no válido');
    }
  }

  


  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (ans) => {
        this.empresas = ans;
        console.log('Empresas obtenidas:', this.empresas);
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
  }
  

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authServiceCli.getUserRole();
    console.log(this.rol);

    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');

      this.authServiceCli.logout().subscribe(
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

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCli.logout().subscribe();
  }

}
