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

  setIdEmpresa(idEmpresa: number): void {
    this.idEmpresa = idEmpresa;
    console.log('Id de Empresa establecido:', idEmpresa);
  }

  setIdUsuario(idUsuario: number): void {
    this.idUsuario = idUsuario;
    console.log('Id de Usuario establecido:', idUsuario);
  }
  
  getIdEmpresa(): number {
    return this.idEmpresa || 0; // Devuelve 0 si es null
  }

  getIdUsuario(): number {
    return this.idUsuario || 0; // Devuelve 0 si es null
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