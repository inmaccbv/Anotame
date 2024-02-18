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

  subirDatos(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    // Verifica si nomLocal es nulo o una cadena vacía
    if (!datos.nomLocal || datos.nomLocal.trim() === '') {
      console.error('El valor de nomLocal no puede ser nulo o una cadena vacía.');
      return throwError('El valor de nomLocal no puede ser nulo o una cadena vacía.');
    }
  
    return this.http.post(this.BASE_RUTA + this.RUTA_DATOS, datos, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud:', error);
          return throwError(error);
        })
      );
  }  

  obtenerDatos(): Observable<any[]> {
    // Simulando una llamada a la API o cualquier lógica de obtención de datos
    // En tu caso, podrías hacer una solicitud HTTP GET para obtener los datos del servidor.
    const datosGuardados = JSON.parse(localStorage.getItem('datos') || '[]');
    this.datosSubject.next(datosGuardados);
    return this.datos$;
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
