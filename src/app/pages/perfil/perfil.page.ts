import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuarioData: any;
  mostrarItem: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
  ) { }

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    const usuarioString = localStorage.getItem('usuario');
  
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const email = usuario.email;
  
      this.usuariosService.getUserByEmail(email).subscribe(
        (response) => {
          console.log('Respuesta del servidor en obtenerDatosUsuario:', response);
  
          if (response && response.code === 200 && response.data) {
            this.usuarioData = response.data;
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