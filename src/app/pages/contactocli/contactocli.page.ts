import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Componente, DatosContacto, Horario } from 'src/app/interfaces/interfaces';

import { AuthService } from 'src/app/services/auth.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { HorariosService } from 'src/app/services/horarios.service';
import { AuthClienteService } from 'src/app/services/auth-cliente.service';
import { MenuCliService } from 'src/app/services/menu-cli.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-contactocli',
  templateUrl: './contactocli.page.html',
  styleUrls: ['./contactocli.page.scss'],
})
export class ContactocliPage implements OnInit {

  horariosSeleccionados: Horario[] = [];

  horas: any;
  horasFiltradas: any;

  datos: any;
  datosFiltrados: any;

  idEmpresa!: number | null;
  clienteData: any;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;
  
  constructor(
    private router: Router,
    public authServiceCliente: AuthClienteService,
    private contactService: ContactoService,
    private horariosService: HorariosService,
    public themeService: ThemeService,
    public clienteService: ClientesService,
    private menuCli: MenuCliService,
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    this.obtenerDatosUsuario();

    // Recuperar el valor de id_empresa del localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

    console.log('ID Empresa:', this.idEmpresa);

    this.getDatos();
    this.getHorarios();
  }

  getDatos() {
    if (this.idEmpresa !== null) {
      this.contactService.obtenerDatosByEmpresa(this.idEmpresa).subscribe(
        (ans) => {
          if (ans.code === 200) {
            // La solicitud fue exitosa, asigna los textos
            this.datos = ans.data;
            this.datosFiltrados = ans.data;
            console.log('Textos obtenidos:', this.datos);
          } else {
            console.error('Error en la respuesta:', ans.datos);
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

  getHorarios() {
    if (this.idEmpresa !== null) {
      this.horariosService.obtenerHorasByEmpresa(this.idEmpresa).subscribe(
        (ans) => {
          if (ans.code === 200) {
            // La solicitud fue exitosa, asigna los textos
            this.horas = ans.data;
            this.horasFiltradas = ans.data;
            console.log('Textos obtenidos:', this.horas);
          } else {
            console.error('Error en la respuesta:', ans.horas);
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

  obtenerDatosUsuario() {
    const clienteString = localStorage.getItem('cliente');
  
    if (!clienteString) {
      console.error('Usuario no encontrado en el almacenamiento local');
      return;
    }
  
    const cliente = JSON.parse(clienteString);
    const email = cliente.email;
  
    this.clienteService.getUserByEmail(email).subscribe(
      (response) => {
        console.log('Respuesta del servidor en obtenerDatosUsuario:', response);
  
        if (response && response.code === 200 && response.data) {
          this.clienteData = response.data;
          const clienteId = response.data.id_cliente.toString();  // Ajusta la propiedad según la respuesta real
          console.log('Cliente ID:', clienteId);
          //this.getDatos(clienteId);
        } else {
          console.error('No se pudieron obtener los datos del usuario:', response.texto);
        }
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }  

  getUserRole() {
    this.rol = this.authServiceCliente.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authServiceCliente.logout().subscribe(
        () => {
          // Elimina cualquier informacion de session almacenada localmente
          localStorage.removeItem('role');
          localStorage.removeItem('usuario');
  
          this.router.navigate(['/inicio']);
        },
        (error) => {
          console.error('Error al cerrar sesion:', error);
        }
      )
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
