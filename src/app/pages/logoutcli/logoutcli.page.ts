import { Component, OnInit } from '@angular/core';
import { AuthClienteService } from '../../services/auth-cliente.service';

@Component({
  selector: 'app-logoutcli',
  templateUrl: './logoutcli.page.html',
  styleUrls: ['./logoutcli.page.scss'],
})
export class LogoutcliPage {

  constructor(
    private authService: AuthClienteService
  ) { }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Elimina cualquier informacion de session almacenada localmente
        localStorage.removeItem('role');
        localStorage.removeItem('darkMode');
        localStorage.removeItem('cliente');

        // Redirige al usuario a la pagina de inicion de sesion
        window.location.href = '/logincli';
      },
      (error) => {
        console.error('Error al cerrar sesion:', error);
      }
    )
  }
}
