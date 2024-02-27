import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DatosContacto } from '../interfaces/interfaces';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_DATOS = "SubirDatos";

  private datosSubject = new BehaviorSubject<any[]>([]);
  datos$ = this.datosSubject.asObservable();

  constructor(private http: HttpClient) { }


  subirDatos(datos: any, idEmpresa: number, idUsuario: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const dataToSend = { ...datos, id_empresa: idEmpresa, id_user: idUsuario };

    return this.http.post(this.BASE_RUTA + this.RUTA_DATOS, dataToSend, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }


  obtenerDatosByEmpresa(idEmpresa: number): Observable<any> {
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_DATOS}/obtenerDatosByEmpresa`, { params });
  }
  


  eliminarDato(id_datos: number): Observable<any> {
    const payload = { id_datos: id_datos };

    return this.http.post(this.BASE_RUTA + this.RUTA_DATOS + '/borrarDatos', payload)
      .pipe(
        tap((response: any) => {
          console.log('Response al eliminarDato:', response);

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
