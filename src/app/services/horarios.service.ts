import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Horario } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_HORARIO = "Horarios";

  constructor(private http: HttpClient) { }

  // Método para subir un nuevo horario al servidor
  subirHorario(horario: Horario, idEmpresa: number, idUsuario: number): Observable<any> {
    // Configuración de cabeceras HTTP
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Agregar idEmpresa e idUsuario al objeto de datos
    const dataToSend = { ...horario, id_empresa: idEmpresa, id_user: idUsuario };

    // Realizar la solicitud POST al servidor y manejar errores con RxJS catchError
    return this.http.post(this.BASE_RUTA + this.RUTA_HORARIO, dataToSend, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }

  // Método para obtener datos por empresa desde el servidor
  obtenerHorasByEmpresa(idEmpresa: number): Observable<any> {
    // Configurar parámetros de la solicitud HTTP
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());

    // Realizar una solicitud GET al servidor
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_HORARIO}/obtenerHorasByEmpresa`, { params });
  }
}