import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap } from "rxjs";
import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ReservasService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_RESERVAS = "Reservas";

  reservasArray: any[] = [];

  constructor(private http: HttpClient) { }

  // Método para enviar una nueva reserva al servidor
  addReserva(datos: any): Observable<any> {
    console.log(datos);

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    const payload = new HttpParams()
      .set('numPax', datos.numPax)
      .set('fechaHoraReserva', datos.fechaHoraReserva)
      .set('notasEspeciales', datos.notasEspeciales)
      .set('estadoReserva', datos.estadoReserva)
      .set('fechaCreacion', datos.fechaCreacion)
      .set('ic_cliente', datos.ic_cliente)

    console.log(payload);

    this.reservasArray.push(datos);

    return this.http.post(this.BASE_RUTA + this.RUTA_RESERVAS + '/addReserva', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }

  getReservasArray(): any[] {
    return this.reservasArray;
  }

  buscarAutocompletado(termino: string): Observable<any[]> {
    const url = `${this.BASE_RUTA}${this.RUTA_RESERVAS}/verificarCliente?termino=${termino}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(opciones => console.log('Respuesta del servidor:', opciones)),
        catchError(this.handleError)
      );
  }
  
  getReservasPorCliente(id_cliente: string): Observable<any> {
    const url = `${this.BASE_RUTA}${this.RUTA_RESERVAS}/getReservasPorCliente?id_cliente=${id_cliente}`;
    return this.http.get<any>(url)
      .pipe(
        tap(reservas => console.log('Reservas por cliente:', reservas)),
        catchError(error => {
          console.error('Error al obtener reservas por cliente:', error);
          return throwError(error);
        })
      );
  }

  getReservas(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.BASE_RUTA + this.RUTA_RESERVAS + '/getReservas', '', { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(error);
  }
}
