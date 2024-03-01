import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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

  // Método para obtener datos por empresa desde el servidor
  obtenerDatosByEmpresa(idEmpresa: number): Observable<any> {
    // Configurar parámetros de la solicitud HTTP
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());

    // Realizar una solicitud GET al servidor
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_DATOS}/obtenerDatosByEmpresa`, { params });
  }
  
  // Método para eliminar un dato por su ID desde el servidor
  eliminarDato(id_datos: number): Observable<any> {
    // Configurar el payload con el ID del dato a eliminar
    const payload = { id_datos: id_datos };

    // Realizar una solicitud POST al servidor para eliminar el dato
    return this.http.post(this.BASE_RUTA + this.RUTA_DATOS + '/borrarDatos', payload)
      .pipe(
        tap((response: any) => {
          console.log('Response al eliminarDato:', response);

          // Manejar la respuesta del servidor después de intentar eliminar el dato
          if (response && response.code === 200) {
            console.log('Datos eliminados con éxito.');
          } else {
            console.error('Error al eliminar datos:', response);
          }
        }),
        catchError((error) => {
          console.error('Error en la solicitud al eliminarDato:', error);
          return throwError(error);
        })
      );
  }
}
