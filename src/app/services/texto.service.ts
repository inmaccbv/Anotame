import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TextoService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_TEXTO = "SubirTexto";

  constructor(private http: HttpClient) {}

  // Método para subir un nuevo texto al servidor
  subirTexto(datos: any, idEmpresa: number, idUsuario: number): Observable<any> {
    // Configuración de cabeceras HTTP
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Agregar idEmpresa e idUsuario al objeto de datos
    const dataToSend = { ...datos, id_empresa: idEmpresa, id_user: idUsuario };

    // Realizar la solicitud POST al servidor y manejar errores con RxJS catchError
    return this.http.post(this.BASE_RUTA + this.RUTA_TEXTO, dataToSend, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  } 

  // Método para obtener textos filtrados por empresa
  getTextosByEmpresa(idEmpresa: number): Observable<any> {
    // Configuración de parámetros en la URL
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());

    // Realizar la solicitud GET con parámetros y manejar errores con RxJS catchError
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_TEXTO}/getTextosByEmpresa`, { params });
  }
}
