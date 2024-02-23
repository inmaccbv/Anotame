import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format, parse } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_RESERVAS = "Reservas";

  reservasArray: any[] = [];

  constructor(private http: HttpClient) { }

  // Método para agregar una nueva reserva al servidor
  addReserva(reserva: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload = {
      numPax: reserva.numPax,
      fechaHoraReserva: reserva.fechaHoraReserva,
      notasEspeciales: reserva.notasEspeciales,
      estadoReserva: reserva.estadoReserva,
      fechaCreacion: reserva.fechaCreacion,
      id_cliente: reserva.id_cliente,
    };

    return this.http.post(this.BASE_RUTA + this.RUTA_RESERVAS, payload, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud:', error);
          return throwError(error);
        })
      );
  }

  editarEstadoReserva(id_reserva: number, estadoReserva: string): Observable<any> {
    console.log('Iniciando updateEstadoReserva. ID Reserva:', id_reserva, 'Nuevo Estado:', estadoReserva);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      id_reserva: id_reserva,
      estadoReserva: estadoReserva,
    };
    
    console.log('Cuerpo de la solicitud:', body);

    return this.http.put(`${this.BASE_RUTA}${this.RUTA_RESERVAS}/editarEstadoReserva`, body, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error al actualizar el estado de la reserva:', error);
          return throwError(error);
        })
      );
  }  
  
  getReservas() {
    return this.http.get(this.BASE_RUTA + this.RUTA_RESERVAS + '/getReservas')
      .pipe(
        tap((ans) => {
          console.log('Reservas obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener la reserva:', error);
          throw error;
        })
      );
  }

  // Método para manejar errores
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(error);
  }
}
