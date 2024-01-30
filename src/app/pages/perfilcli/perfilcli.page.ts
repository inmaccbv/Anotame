import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-perfilcli',
  templateUrl: './perfilcli.page.html',
  styleUrls: ['./perfilcli.page.scss'],
})
export class PerfilcliPage implements OnInit {

  clienteData: any;
  mostrarItem: boolean = false;

  constructor(
    private clienteService: ClientesService
  ) { }

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    const clienteString = localStorage.getItem('cliente');
  
    if (clienteString) {
      const cliente = JSON.parse(clienteString);
      const email = cliente.email;
  
      this.clienteService.getUserByEmail(email).subscribe(
        (response) => {
          console.log('Respuesta del servidor en obtenerDatosUsuario:', response);
  
          if (response && response.code === 200 && response.data) {
            this.clienteData = response.data;
          } else {
            console.error('No se pudieron obtener los datos del usuario:', response.texto);
          }
        },
        (error) => {
          console.error('Error al obtener datos del usuario:', error);
        }
      );
    } else {
      console.error('Usuario no encontrado en el almacenamiento local');
    }
  }
  
  toggleMostrarItem() {
    this.mostrarItem = !this.mostrarItem;
  }
}