import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Metodo para obtener rol del usuario
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
  
  // Metodo para obtener el rol del usuario actual
  storeUserRole(role: any) {
    // Guarda solo el valor de la propiedad 'rol'
    localStorage.setItem('role', role.data[0].rol);
  }

  // Metodo para cerrar sesión
  logout(): Observable<boolean> {
    // Elimina cualquier información de sesión almacenada localmente
    localStorage.removeItem('role');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('usuario');

    // Redirige al usuario a la página de inicio de sesión
    window.location.href = '/login';

    // Retorna un observable con el valor booleano true
    return of(true);
  }
}
