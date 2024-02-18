import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  userValue: any;
  getCurrentUser: any;

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_REGISTRO = 'Registro';

  constructor(
    private http: HttpClient,
    private router: Router 
  ) { }
  
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

  // Almacena el ID del usuario en localStorage después del registro o inicio de sesión.
  storeUserId(id: number): void {
    localStorage.setItem('userId', id.toString());
  }  

  // Metodo para obtener el rol del usuario actual
  storeUserRole(role: any) {
    // Guarda solo el valor de la propiedad 'rol'
    localStorage.setItem('role', role.data[0].rol);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // Método para realizar la autenticación
  private realizarAutenticacion(username: string, password: string): boolean {
    // Aquí se realiza la lógica de autenticación
    // Devuelve true si la autenticación es exitosa, false si falla
    return (username === 'user' && password === 'password') ||
      (username === 'administrador' && password === 'password');
  }

  private obtenerRolDesdeServidor(userId: number): Observable<string> {
    // Realiza una solicitud HTTP al servidor para obtener el rol
    const url = `${this.BASE_RUTA}${this.RUTA_REGISTRO}/${userId}`;
    return this.http.get<string>(url);
  }

  // Metodo para comprobar si el usario esta autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('role');
  }
}
