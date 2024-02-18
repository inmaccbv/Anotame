import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TextoService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_TEXTO = "SubirTexto";

  textoGuardado: string = '';

  constructor(private http: HttpClient) { }

  setTextoGuardado(texto: string) {
    this.textoGuardado = texto;
  }

  getTextoGuardado(): string {
    return this.textoGuardado;
  }

  subirTexto(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Asegúrate de que datos.nomLocal tenga un valor antes de enviar la solicitud
    if (!datos.nomLocal) {
      console.error('El valor de nomLocal no puede ser nulo.');
      return throwError('El valor de nomLocal no puede ser nulo.');
    }

    return this.http.post(this.BASE_RUTA + this.RUTA_TEXTO, datos, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud:', error);
          return throwError(error); // Puedes manejar el error aquí o simplemente relanzarlo
        })
      );
  }
}
