import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Componente, Horario } from 'src/app/interfaces/interfaces';

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
    // console.log('Rol obtenido:', this.rol);
    this.isDarkMode = this.themeService.isDarkTheme();
  }

  ngOnInit() {
    this.componentes = this.menuCli.getMenuOptsCli();
    this.obtenerDatosUsuario();

    // Recuperar el valor de id_empresa del localStorage
    const idEmpresaString = localStorage.getItem('id_empresa');
    this.idEmpresa = idEmpresaString ? parseInt(idEmpresaString, 10) : null;

    // console.log('ID Empresa:', this.idEmpresa);

    this.getDatos();
    this.getHorarios();
  }

   // Método para obtener los textos del servidor
   getDatos() {
    if (this.idEmpresa !== null) {
      this.contactService.getDatosByEmpresa(this.idEmpresa).subscribe(
        (ans) => {
          // console.log('Respuesta del servidor:', ans);
  
          if (ans.code === 200) {
            this.datos = ans.data;
            this.datosFiltrados = ans.data;
            console.log('Datos obtenidos:', this.datos);
          } else {
            console.error('Error en la respuesta:', ans.texto);
          }
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
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
            this.horariosSeleccionados = ans.data;
            this.marcarDiasCerrados();
          } else {
            console.error('Error en la respuesta:', ans.horas);
          }
        },
        (error) => {
          console.error('Error al obtener los horarios:', error);
        }
      );
    } else {
      console.error('ID de empresa no válido.');
    }
  }
  
  marcarDiasCerrados() {
    // Array con los días de la semana
    const diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
    // Itera sobre los días de la semana y marca como cerrado si no tiene horario
    this.horariosSeleccionados = diasSemana.map(dia => {
      const horarioExistente = this.horariosSeleccionados.find(horario => horario.dia === dia);
  
      if (horarioExistente) {
        return horarioExistente;
      } else {
        return {
          dia: dia,
          hora_apertura: 'cerrado',
          hora_cierre: 'cerrado',
          id_user: 0,  // Modifica según tus requisitos
          id_empresa: 0  // Modifica según tus requisitos
        };
      }
    });
  }

  // Obtener los datos del usuario cliente
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
        // console.log('Respuesta del servidor en obtenerDatosUsuario:', response);
  
        if (response && response.code === 200 && response.data) {
          this.clienteData = response.data;
          const clienteId = response.data.id_cliente.toString();  // Ajusta la propiedad según la respuesta real
          // console.log('Cliente ID:', clienteId);
          // this.getDatos(clienteId);
        } else {
          console.error('No se pudieron obtener los datos del usuario:', response.texto);
        }
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }  

  // Obtener el rol del usuario cliente
  getUserRole() {
    this.rol = this.authServiceCliente.getUserRole();
    // console.log(this.rol);
    
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
