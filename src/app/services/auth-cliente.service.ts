import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthClienteService {

  userValue: any;

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

  getClienteId(): string | null {
    const cliente = localStorage.getItem('clienteId'); // <-- aquí estaba 'clienteId'
    console.log('Objeto de usuario en localStorage:', cliente);
    if (cliente) {
      const usuarioObj = JSON.parse(cliente);
      const id_cliente = usuarioObj.id_cliente || null;
      console.log('ID del cliente:', id_cliente);
      return id_cliente;
    }
    console.log('ID del cliente no encontrado.');
    return null;
  }  

  // Almacena el ID del usuario en localStorage después del registro o inicio de sesión.
  storeUserId(id_cliente: number): void {
    if (id_cliente !== null && id_cliente !== undefined) {
      const cliente = { id_cliente: id_cliente };
      localStorage.setItem('clienteId', JSON.stringify(cliente));
    }
  }  

  // Metodo para obtener el rol del usuario actual
  storeUserRole(role: any) {
    // Guarda solo el valor de la propiedad 'rol'
    localStorage.setItem('role', role.data[0].rol);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
}