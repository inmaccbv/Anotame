import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiasService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_DIAS = "Dias";

  constructor(private http: HttpClient) { }

  getDias() {
    return this.http.get(this.BASE_RUTA + this.RUTA_DIAS + '/getDias')
      .pipe(
        tap((ans) => {
          console.log('Dias obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener a los Dias:', error);
          throw error;
        })
      );
  }

}
