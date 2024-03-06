import { Component, OnInit } from '@angular/core';
import { AuthClienteService } from '../../services/auth-cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logoutcli',
  templateUrl: './logoutcli.page.html',
  styleUrls: ['./logoutcli.page.scss'],
})
export class LogoutcliPage {

  constructor(
    private authServicecli: AuthClienteService,
    private router: Router
  ) { }

  logout(): void {
    this.authServicecli.logout().subscribe(
      () => {
        // Elimina cualquier informacion de session almacenada localmente
        localStorage.removeItem('role');
        localStorage.removeItem('darkMode');
        localStorage.removeItem('usuario');
        localStorage.removeItem('cliente');
        localStorage.removeItem('id_empresa');
        localStorage.removeItem('empresa');


        // Redirige al usuario a la pagina de inicion de sesion
        window.location.href = '/logincli';
      },
      (error) => {
        console.error('Error al cerrar sesion:', error);
      }
    )
  }

}
