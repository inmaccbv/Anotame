import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_REGISTRO = 'Registro';

  private idEmpresa: number | null = null;
  private idUsuario: number | null = null;

  constructor(
    private http: HttpClient,
  ) { }

  // Método para cerrar sesión
  logout(): Observable<boolean> {
    // Elimina cualquier información de sesión almacenada localmente
    localStorage.removeItem('role');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('usuario');
    localStorage.removeItem('cliente');
    localStorage.removeItem('id_empresa');
    localStorage.removeItem('empresa');
    this.idEmpresa = null;
    this.idUsuario = null;

    window.location.href = '/login';

    // Retorna un observable con el valor booleano true
    return of(true);
  }

  getUserEmail(): string | null {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      return usuario.email || null;
    }
    return null;
  }

  // Método para obtener el rol del usuario actual
  storeUserRole(role: any) {
    // Guarda solo el valor de la propiedad 'rol'
    localStorage.setItem('role', role.data[0].rol);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getIdEmpresa(): number {
    return this.idEmpresa || 0; // Devuelve 0 si es null
  }
}
