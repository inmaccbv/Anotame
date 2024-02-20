import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format } from 'date-fns';

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
      fechaHoraReserva: this.formatDate(reserva.fechaHoraReserva),
      notasEspeciales: reserva.notasEspeciales,
      estadoReserva: reserva.estadoReserva,
      fechaCreacion: this.formatDate(reserva.fechaCreacion),
      id_cliente: reserva.id_cliente,
    };

    this.reservasArray.push(reserva);

    return this.http.post(this.BASE_RUTA + this.RUTA_RESERVAS + '/addReserva', payload, { headers })
    .pipe(
      tap(response => {
        console.log('Reserva añadida:', response);
      }),
      catchError(error => {
        console.error('Error al añadir reserva:', error);
        return throwError(error);
      })
    );
  }


  // Método para obtener todas las reservas de un cliente
  getReservasPorCliente(id_cliente: string): Observable<any> {
    const url = `${this.BASE_RUTA}${this.RUTA_RESERVAS}/getReservasPorCliente?id_cliente=${id_cliente}`;
    
    return this.http.get<any>(url)
      .pipe(
        tap(reservas => console.log('Reservas por cliente:', reservas)),
        catchError(this.handleError)
      );
  }

  // Método para obtener todas las reservas
  getReservas(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.BASE_RUTA + this.RUTA_RESERVAS + '/getReservas', '', { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  // Método para manejar errores
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(error);
  }
}
