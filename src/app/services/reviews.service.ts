import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_REVIEWS = "SubirResena";

  resenasFiltrados: any[] = [];

  private resenasSubject = new BehaviorSubject<any[]>([]);

  resenas$ = this.resenasSubject.asObservable();

  constructor(private http: HttpClient) { }

  subirResena(resena: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const calificacion = typeof resena.calificacion === 'number' ? resena.calificacion : 0;
    const comentario = typeof resena.comentario === 'string' ? resena.comentario : '';

    const datos = {
      calificacion: calificacion,
      comentario: comentario,
      id_cliente: resena.id_cliente
    };


    return this.http.post(this.BASE_RUTA + this.RUTA_REVIEWS, datos, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud:', error);
          return throwError(error);
        })
      );
  }

  obtenerResenas() {
    return this.http.get(this.BASE_RUTA + this.RUTA_REVIEWS + '/obtenerResenas')
      .pipe(
        tap((ans) => {
          console.log('Reseñas obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener empleados:', error);
          throw error;
        })
      );
  }

  obtenerDetallesCliente(idCliente: number): Observable<any> {
     return this.http.get(this.BASE_RUTA + this.RUTA_REVIEWS + '/obtenerDetallesCliente')
      .pipe(
        tap((ans) => {
          console.log('Reseñas obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener empleados:', error);
          throw error;
        })
      );
  }

  actualizarResenas(resenas: any[]) {
    this.resenasFiltrados = resenas || [];
    this.resenasSubject.next(this.resenasFiltrados);
  }
}
