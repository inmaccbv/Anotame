import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiasService {
  private dias: any[] = [];

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_DIAS = "Dias";

  constructor(private http: HttpClient) { }

  getDias(): Observable<any[]> {
    // Si ya se obtuvieron los días, devolverlos directamente
    if (this.dias.length > 0) {
      return new Observable(observer => observer.next(this.dias));
    }

    // Si no se han obtenido, realizar la solicitud HTTP
    return this.http.post<any[]>(this.BASE_RUTA + this.RUTA_DIAS + '/getDias', '')
      .pipe(
        // Al recibir la respuesta, almacenar los días y devolverlos
        tap(dias => this.dias = dias)
      );
  }
  
}
