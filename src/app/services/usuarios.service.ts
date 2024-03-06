import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_REGISTRO = "Registro";
  RUTA_LOGIN = "Logueo"; 

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization,Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Credentials': 'true',
      method: 'POST'
    })
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      console.error('An error occurred:', error.error.message);
    } else {

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  // SACA TODOS LOS USUARIOS PASANDO LA API PARA HACER EL LOGIN
  loginUser(datos: any) {
    // console.log(datos);
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    const payload = new HttpParams()
      .set('rol', datos.rol)
      .set('email', datos.email)
      .set('password', datos.password)

    return this.http.post(this.BASE_RUTA + this.RUTA_LOGIN, payload).pipe(
      map((response: any) => {
        // console.log('Respuesta del servidor:', response);

        if (response && response.rol && response.id_user) {
          // Almacena todos los datos del usuario en localStorage
          localStorage.setItem('usuario', JSON.stringify(response));

          // Devuelve la respuesta del servidor
          return response;
        } else {
          // Si no, devolvemos una cadena vacía.
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

  getIdEmpresaPorEmail(email: string): Observable<any> {
    const payload = new HttpParams().set('email', email);
  
    return this.http.post(this.BASE_RUTA + this.RUTA_LOGIN + '/getIdEmpresaPorEmail', payload)
      .pipe(
        map(response => response || {}), // Manejar respuesta undefined
        catchError(error => {
          console.error('Error al obtener id_empresa por email:', error);
          throw error;
        })
      );
  }

  registroUsuario(datos: any) {

    // console.log(datos);

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    const payload = new HttpParams()
      .set('nombre', datos.nombre)
      .set('apellido', datos.apellido)
      .set('email', datos.email)
      .set('empleado', datos.empleado)
      .set('password', datos.password)
      .set('rol', datos.rol)
      .set('id_empresa', datos.id_empresa)

    // console.log(payload);

    return this.http.post(this.BASE_RUTA + this.RUTA_REGISTRO, payload)
      .pipe(
        dat => {
          // console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }  

  getUsuariosPorEmpresa(idEmpresa: number): Observable<any> {
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());
    
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_LOGIN}/getUsuariosPorIdEmpresa`, { params })
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

  getEmpleados() {
    return this.http.get(this.BASE_RUTA + this.RUTA_LOGIN + '/getEmpleados')
      .pipe(
        tap((ans) => {
          console.log('Empleados obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener empleados:', error);
          throw error;
        })
      );
  }

  getUserByEmail(email: string): Observable<any> {
    const payload = new HttpParams().set('email', email);

    return this.http.post(this.BASE_RUTA + this.RUTA_LOGIN + '/getUserByEmail', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }

  getUserAndEmpresaByEmail(email: string): Observable<any> {
    const payload = new HttpParams().set('email', email);

    return this.http.post(this.BASE_RUTA + this.RUTA_LOGIN + '/getUserAndEmpresaByEmail', payload)
      .pipe(
        dat => {
          // console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }

  borrarEmpleado(id_user: any) {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const payload = new HttpParams()
      .set('id_user', id_user);

    return this.http.post(this.BASE_RUTA + this.RUTA_LOGIN + '/borrarEmpleado', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }
}