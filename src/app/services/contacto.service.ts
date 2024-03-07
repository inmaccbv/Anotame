import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_DATOS = "SubirDatos";

  constructor(private http: HttpClient) { }

  // Método para subir datos al servidor
  subirDatos(datos: any, idEmpresa: number, idUsuario: number): Observable<any> {
    // Establecer encabezados para la solicitud HTTP
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Combinar los datos con los identificadores de empresa y usuario
    const dataToSend = { ...datos, id_empresa: idEmpresa, id_user: idUsuario };

    // Realizar una solicitud POST al servidor
    return this.http.post(this.BASE_RUTA + this.RUTA_DATOS, dataToSend, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }

  // Método para obtener textos filtrados por empresa
  getDatosByEmpresa(idEmpresa: number): Observable<any> {
    // Configuración de parámetros en la URL
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());

    // Realizar la solicitud GET con parámetros y manejar errores con RxJS catchError
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_DATOS}/getDatosByEmpresa`, { params });
  }

}
