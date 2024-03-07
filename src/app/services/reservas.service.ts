import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_RESERVAS = "Reservas";

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
      id_empresa: reserva.id_empresa,
    };

    return this.http.post(this.BASE_RUTA + this.RUTA_RESERVAS, payload, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud al agregar reserva:', error);
          return throwError(error);
        })
      );
  }

  // Método para editar el estado de una reserva
  editarEstadoReserva(id_reserva: number, estadoReserva: string): Observable<any> {
    console.log('ID Reserva:', id_reserva, 'Nuevo Estado:', estadoReserva);
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

  // Método para obtener reservas desde el servidor
  getReservas(): Observable<any> {
    return this.http.get(this.BASE_RUTA + this.RUTA_RESERVAS + '/getReservas')
      .pipe(
        tap((ans) => {
          // console.log('Reservas obtenidas:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener las reservas:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener reservas por empresa desde el servidor
  getReservasPorEmpresa(idEmpresa: number): Observable<any> {
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());
    
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_RESERVAS}/getReservasPorEmpresa`, { params })
      .pipe(
        tap((ans) => {
          // console.log('Reservas obtenidas:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener las reservas por empresa:', error);
          return throwError(error);
        })
      );
  }

  // Método para borrar una reserva desde el servidor
  borrarReserva(idReserva: any): Promise<void> {
    const payload = new HttpParams().set('id_reserva', idReserva);
    return this.http.post<void>(this.BASE_RUTA + this.RUTA_RESERVAS + '/borrarReserva', payload).toPromise();
  }

  // Método para manejar errores
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(error);
  }
}
