import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthEmpresaService {

  userValue: any;

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_EMPRESA= "Empresas";

  constructor( private router: Router ) { }

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
