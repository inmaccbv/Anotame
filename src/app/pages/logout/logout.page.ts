import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage {


  constructor(
    private authService: AuthService
  ) { }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Elimina cualquier informacion de session almacenada localmente
        localStorage.removeItem('role');
        localStorage.removeItem('darkMode');
        localStorage.removeItem('usuario');

        window.location.href = '/login';
      },
      (error) => {
        console.error('Error al cerrar sesion:', error);
      }
    )
  }
}
