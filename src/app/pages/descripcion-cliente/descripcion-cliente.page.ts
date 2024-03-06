import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Componente, Texto } from 'src/app/interfaces/interfaces';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { TextoService } from 'src/app/services/texto.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-descripcion-cliente',
  templateUrl: './descripcion-cliente.page.html',
  styleUrls: ['./descripcion-cliente.page.scss'],
})
export class DescripcionClientePage implements OnInit {

  textos: any;
  textosFiltrados: any;

  idEmpresa!: number | null;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  @ViewChild('idEmpresaInput') idEmpresaInput!: ElementRef;

  constructor(
    public router: Router, 
    public authService: AuthService,
    private menuCli: MenuCliService,
    private textoService: TextoService,
    public authServiceCliente: AuthClienteService,
    public themeService: ThemeService
  ) {
    this.getUserRole();
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    
    // Recuperar el valor de id_empresa del localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

    // console.log('ID Empresa:', this.idEmpresa);

    this.getTexto();
  }

  getTexto() {
    if (this.idEmpresa !== null) {
      this.textoService.getTextosByEmpresa(this.idEmpresa).subscribe(
        (ans) => {
          if (ans.code === 200) {
            // La solicitud fue exitosa, asigna los textos
            this.textos = ans.data;
            this.textosFiltrados = ans.data;
            console.log('Textos obtenidos:', this.textos);
          } else {
            console.error('Error en la respuesta:', ans.texto);
          }
        },
        (error) => {
          console.error('Error al obtener los textos:', error);
        }
      );
    } else {
      console.error('ID de empresa no válido.');
    }
  }

  getUserRole() {
    this.rol = this.authService.getUserRole();
    // console.log(this.rol);
    
    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
        () => {
          localStorage.removeItem('role');
          localStorage.removeItem('cliente');
          this.router.navigate(['/logincli']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      );
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCliente.logout().subscribe();
  }
}
