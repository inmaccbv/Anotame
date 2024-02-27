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
  datosServer: any;

  datos: any;
  datosFiltrados: any;

  
  idEmpresa!: number | null;
  clienteData: any;

  rol!: any;
  isDarkMode: any;
  componentes!: Observable<Componente[]>;

  @ViewChild('idEmpresaInput') idEmpresaInput!: ElementRef;
  
  constructor(
    public authService: AuthService,
    public authServiceCliente: AuthClienteService,
    private contactService: ContactoService,
    private horariosService: HorariosService,
    public themeService: ThemeService,
    public clienteService: ClientesService,
    private menuCli: MenuCliService,
    private router: Router,
  ) {
    this.getUserRole();
    console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();

    // Suscribirse a futuros cambios en los horarios
    this.horariosService.obtenerHorarios().subscribe((nuevosHorarios) => {
      console.log('Nuevos horarios recibidos en ContactocliPage:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios;
    });

  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    this.obtenerDatosUsuario();

    // Obtener datos de localStorage al inicializar
    const datosGuardados = JSON.parse(localStorage.getItem('datos') || '[]') as DatosContacto[];
    const horarioGuardados = JSON.parse(localStorage.getItem('horarios') || '[]') as Horario[];

    // Después de recuperar datos de localStorage
    console.log('Datos recuperados del localStorage:', datosGuardados);
    console.log('Horarios recuperados del localStorage:', horarioGuardados);

    this.datos = datosGuardados;

    // Actualizar los horarios en el servicio con los recuperados del localStorage
    this.horariosService.actualizarHorarios(horarioGuardados);

    this.horariosService.horarios$.subscribe((nuevosHorarios) => {
      console.log('Nuevos horarios recibidos:', nuevosHorarios);
      this.horariosSeleccionados = nuevosHorarios;
    });

     // Recuperar el valor de id_empresa del localStorage
     const idEmpresaString = localStorage.getItem('id_empresa');
     this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;
 
     console.log('ID Empresa:', this.idEmpresa);
 
     this.getDatos();
   
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
    this.rol = this.authService.getUserRole();
    console.log(this.rol);
    
    if (!(this.rol === 'cliente')) {
      console.error('Cliente con rol', this.rol, 'no tiene permiso para acceder a esta opción.');
      this.authService.logout().subscribe(
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

  // getDatos(clienteId: string) {
  //   this.contactService.obtenerDatos().subscribe(
  //     (ans) => {
  //       // Asegúrate de que ans sea un array antes de filtrar
  //       if (Array.isArray(ans)) {
  //         this.datosServer = ans.filter((dato: any) => dato.id_cliente === clienteId.toString());
  //         this.datosFiltrados = [...this.datosServer]; // Hacer una copia de las reservas para evitar mutar el array original
  //         console.log('Datos obtenidos:', this.datosFiltrados);
  //       } else {
  //         console.error('La respuesta del servidor no es un array:', ans);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error al obtener datos:', error);
  //     }
  //   );
  // }
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkTheme(this.isDarkMode);
  }

  cerrarSesion(): void {
    this.authServiceCliente.logout().subscribe();
  }
}
