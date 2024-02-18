import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthClienteService {

  userValue: any;
  private usuario: any;

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_REGISTRO = 'RegistroCliente';


  constructor(
    private http: HttpClient,
  ) { }

  // Metodo para cerrar sesión
  logout(): Observable<boolean> {
    // Elimina cualquier información de sesión almacenada localmente
    localStorage.removeItem('role');
    localStorage.removeItem('darkMode');
    localStorage.removeItem('cliente');

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

  isAuthenticated(): boolean {
    return !!localStorage.getItem('role');
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

  getUsuario(): Observable<any> {
    // Si ya tienes la información del usuario almacenada, devuélvela directamente
    if (this.usuario) {
      return of(this.usuario);
    } else {
      // Si no tienes la información del usuario, intenta obtenerla desde el servidor
      return this.fetchUsuarioFromServer();
    }
  }


  obtenerUsuarioDesdeServidor(): Observable<any> {
    const url = 'http://localhost/anotame/APIANOTAME/public/RegistroCliente/getClienteIdByEmail/';

    return this.getClienteId().pipe(
      take(1),
      switchMap(idCliente => {
        if (idCliente) {
          // Si se obtiene el ID del cliente, realiza la solicitud para obtener la información completa
          return this.http.get<any>(`${url}${idCliente}`).pipe(
            catchError(error => {
              console.error('Error al obtener la información del usuario:', error);
              return throwError(error);
            })
          );
        } else {
          // Si no se obtiene el ID del cliente, devuelve un objeto vacío
          return of({});
        }
      }),
      switchMap(usuario => {
        // Actualiza this.usuario con la información del usuario obtenida
        this.usuario = usuario;
        return of(usuario);
      })
    );
  }

  private fetchUsuarioFromServer(): Observable<any> {
    const url = 'http://localhost/anotame/APIANOTAME/public/RegistroCliente/getClienteIdByEmail/';
  
    return this.getClienteId().pipe(
      take(1),
      switchMap(idCliente => {
        if (idCliente) {
          return this.http.get<any>(`${url}${idCliente}`);
        } else {
          return of({}); // Devuelve un objeto vacío si no hay ID de cliente
        }
      }),
      catchError(error => {
        console.error('Error al obtener la información del usuario:', error);
        return throwError(error);
      })
    );
  }


}