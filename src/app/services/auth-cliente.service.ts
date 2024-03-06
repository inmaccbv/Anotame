import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthClienteService {

  private usuario: any;

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_REGISTRO = 'RegistroCliente';

  private idEmpresa: number | null = null;
  private idUsuario: number | null = null;

  constructor(
    private http: HttpClient,
  ) { }

  // Metodo para cerrar sesión
  logout(): Observable<boolean> {
    // Elimina cualquier información de sesión almacenada localmente
    localStorage.removeItem('role');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('cliente');
    localStorage.removeItem('resena');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id_empresa');
    localStorage.removeItem('empresa');


    // Redirige al usuario a la página de inicio de sesión
    window.location.href = '/logincli';

    // Retorna un observable con el valor booleano true
    return of(true);
  }

  // Metodo para obtener el rol del usuario actual
  storeUserRole(role: any) {
    // Guarda solo el valor de la propiedad 'rol'
    localStorage.setItem('role', role.data[0].rol);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // REVIEWS
  getClienteId(): Observable<string | null> {
    const cliente = localStorage.getItem('clienteId');
    if (cliente) {
      const usuarioObj = JSON.parse(cliente);
      const id_cliente = usuarioObj.id_cliente || null;
      return of(id_cliente);
    }
    return of(null);
  }
}