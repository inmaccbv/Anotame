import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  LOGIN_CLIENTE = "LogueoCliente";
  REGISTRO_CLIENTE = "RegistroCliente";

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization,Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Credentials': 'true',
    })
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  loginCliente(datos: any) {
    console.log(datos);
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    const payload = new HttpParams()
      .set('rol', datos.rol)
      .set('email', datos.email)
      .set('password', datos.password);

    return this.http.post(this.BASE_RUTA + this.LOGIN_CLIENTE, payload).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', response);
        // Si el servidor devuelve un objeto con la propiedad "rol", entonces lo devolvemos.
        if (response && response.rol) {
          // Primero se establece el valor del rol en el localStorage
          localStorage.setItem('rol', response.rol);
          // Luego se devuelve el valor del rol de la respuesta del servidor
          return response;
        } else {
          // Si no, devolvemos una cadena vacía.
          //console.log('No se encontró el rol del usuario en la respuesta del servicio');
          return response;
        }
      }),
      catchError((error: any) => {
        console.error('Error al obtener el rol del usuario:', error);
        // Devolvemos una cadena vacía.
        return of('');
      })
    );
  }

  registroCliente(datos: any) {

    // console.log(datos);

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    const payload = new HttpParams()
      .set('nombre', datos.nombre)
      .set('apellido', datos.apellido)
      .set('email', datos.email)
      .set('telf', datos.telf)
      .set('password', datos.password)
      .set('rol', datos.rol)

    // console.log(payload);

    return this.http.post(this.BASE_RUTA + this.REGISTRO_CLIENTE, payload)
      .pipe(
        dat => {
          // console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }

  getClientes() {
    return this.http.get(this.BASE_RUTA + this.LOGIN_CLIENTE + '/getClientes')
      .pipe(
        tap((ans) => {
          console.log('Clientes obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener a los clientes:', error);
          throw error;
        })
      );
  }

  getClientePorId(id_cliente: number): Observable<any> {
    const payload = new HttpParams().set('id_cliente', id_cliente.toString());
  
    return this.http.post(this.BASE_RUTA + this.REGISTRO_CLIENTE + '/obtenerDetallesCliente', payload)
      .pipe(
        map(response => response || {}), // Manejar respuesta undefined
        catchError(error => {
          console.error('Error al obtener detalles del cliente:', error);
          throw error;
        })
      );
  }

  getUserByEmail(email: string): Observable<any> {
    const payload = new HttpParams().set('email', email);

    return this.http.post(this.BASE_RUTA + this.LOGIN_CLIENTE + '/getUserByEmail', payload)
      .pipe(
        dat => {
          // console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }

  borrarCliente(id_cliente: any) {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const payload = new HttpParams()
      .set('id_cliente', id_cliente);

    return this.http.post(this.BASE_RUTA + this.LOGIN_CLIENTE + '/borrarCliente', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }
}