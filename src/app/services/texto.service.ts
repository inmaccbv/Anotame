import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TextoService {
  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_TEXTO = "SubirTexto";
  RUTA_USER = 'Logueo';
  RUTA_EMPRESA = 'Empresas';

  constructor(private http: HttpClient) {}

  getTexto(): Observable<any> {
    return this.http.get(this.BASE_RUTA + this.RUTA_TEXTO + '/getTexto');
  }

  subirTexto(datos: any, idEmpresa: number, idUsuario: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const dataToSend = { ...datos, id_empresa: idEmpresa, id_user: idUsuario };

    return this.http.post(this.BASE_RUTA + this.RUTA_TEXTO, dataToSend, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }

  getTextosByEmpresa(idEmpresa: number): Observable<any> {
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_TEXTO}/getTextosByEmpresa`, { params });
  }
  
  
  
}
