import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Componente, Empresa } from 'src/app/interfaces/interfaces';

import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MenuCliService } from 'src/app/services/menucli.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ProvinciasService } from 'src/app/services/provincias.service';

@Component({
  selector: 'app-seleccion-empresa',
  templateUrl: './seleccion-empresa.page.html',
  styleUrls: ['./seleccion-empresa.page.scss'],
})
export class SeleccionEmpresaPage implements OnInit {

  idEmpresa!: number;
  empresas!: any;

  provincias: any[] = [];
  empresasFiltradas: Empresa[] = [];

  filtroTipoLocal: string = '';
  filtroProvincia: string = '';
  filtroCodigoPostal: string = '';
  filtroNombreRestaurante: string = '';

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  constructor(
    private router: Router,
    public authServiceCli: AuthClienteService,
    private menuCli: MenuCliService,
    private empresaService: EmpresaService,
    public authService: AuthService,
    public themeService: ThemeService,
    private provinciasService: ProvinciasService
  ) { 
    this.getUserRole();
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    this.getEmpresas();
    this.getProvincias();
    this.aplicarFiltros(); 
    this.idEmpresa = this.authService.getIdEmpresa();
  }

  // Método para seleccionar una empresa
  seleccionarEmpresa(event: any) {
    const idEmpresa = event.detail.value;

    if (idEmpresa) {
      const idEmpresaString = idEmpresa.toString();
      this.empresaService.setEmpresaSeleccionada(idEmpresaString).subscribe(
        (response) => {
          this.empresaService.empresaSeleccionada = response;
          this.redirigirYAlmacenarIdEmpresa(idEmpresaString);
        },
        (error) => {
          console.error('Error al seleccionar la empresa:', error);
        }
      );
    } else {
      console.error('ID de empresa no válido');
    }
  }

  // Método para redirigir y almacenar el ID de la empresa seleccionada
  redirigirYAlmacenarIdEmpresa(idEmpresa: string) {
    this.router.navigate(['/homecli']);
    localStorage.setItem('id_empresa', idEmpresa);
  }

  // Método para redirigir y almacenar la empresa actual
  redirigirYAlmacenar() {
    const idEmpresa = this.idEmpresa;

    if (idEmpresa) {
      const idEmpresaString = idEmpresa.toString();
      this.redirigirYAlmacenarIdEmpresa(idEmpresaString);
    } else {
      console.error('ID de empresa no válido');
    }
  }

  // Método para obtener la lista de empresas
  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (ans) => {
        console.log('Empresas recibidas:', ans);
        // Convertir el objeto a un array de empresas
        this.empresas = Object.values(ans) as any[];
        // Inicializar empresasFiltradas con todas las empresas
        this.empresasFiltradas = this.empresas;
      },
      (error) => {
        console.error('Error al obtener empresas:', error);
      }
    );
  }
  
  // Método para obtener la lista de provincias
  getProvincias() {
    this.provinciasService.getProvincias().subscribe(
      (ans: any) => {
        this.provincias = Object.values(ans); // Convertir a un array
      },
      (error) => {
        console.error('Error al obtener provincias:', error);
      }
    );
  }

  // Método para aplicar los filtros de búsqueda
  aplicarFiltros() {
    if (this.empresas) {
      this.empresasFiltradas = this.empresas.filter((empresa: Empresa) => 
        (this.filtroTipoLocal === '' || this.pasaFiltroTipoLocal(empresa)) &&
        (this.filtroProvincia === '' || this.pasaFiltroProvincia(empresa)) &&
        (this.filtroCodigoPostal === '' || this.pasaFiltroCodigoPostal(empresa)) &&
        (this.filtroNombreRestaurante === '' || this.pasaFiltroNombreRestaurante(empresa))
      );
    }    
  }
  
  // Métodos para comprobar si una empresa pasa los filtros individuales
  pasaFiltroTipoLocal(empresa: Empresa): boolean {
    return empresa.tipoLocal === this.filtroTipoLocal;
  }
  
  pasaFiltroProvincia(empresa: Empresa): boolean {
    return empresa.provincia === this.filtroProvincia;
  }
  
  pasaFiltroCodigoPostal(empresa: Empresa): boolean {
    return empresa.cPostal.includes(this.filtroCodigoPostal);
  }
  
  pasaFiltroNombreRestaurante(empresa: Empresa): boolean {
    return empresa.empresa.includes(this.filtroNombreRestaurante);
  }

  // Método para obtener empresas filtradas (por definir)
  filtrarEmpresas() {
    // Aplica lógica para filtrar empresas según los criterios definidos
    return this.empresas;
  }
  
  // Método para borrar los filtros de búsqueda
  borrarFiltro() {
    this.filtroTipoLocal = '';
    this.filtroProvincia = '';
    // Restablecer otros filtros si es necesario
    this.aplicarFiltros(); // Aplicar los filtros después de restablecer
  }

  // Método para obtener el rol del usuario
  getUserRole() {
    this.rol = this.authServiceCli.getUserRole();

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

  // Método para alternar el modo oscuro
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authServiceCli.logout().subscribe();
  }
}
