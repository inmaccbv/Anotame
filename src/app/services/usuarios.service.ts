import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // BASE_RUTA ="https://www.jm2informatica.es/APISATCONTROL/public/";

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  BASE_RUTA2 = "http://192.168.0.19/anotame/APIANOTAME/public/";


  RUTA_REGISTRO = "Registro";
  RUTA_LOGIN = "Logueo";
  RUTA_EMPLEADO = 'Empleado';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'x-www-form-urlencoded',
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
    console.log(datos);
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    const payload = new HttpParams()
      .set('rol', datos.rol)
      .set('email', datos.email)
      .set('password', datos.password)

    return this.http.post(this.BASE_RUTA + this.RUTA_LOGIN, payload).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', response);

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

  registroUsuario(datos: any) {
    // Obtén el campo de empresa almacenado en localStorage
    const empresa = localStorage.getItem('empresa');
    // Agrega el campo de empresa a los datos
    datos.empresa = empresa;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(this.BASE_RUTA + this.RUTA_REGISTRO, datos, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud:', error);
          return throwError('Error en la solicitud. Por favor, inténtalo de nuevo.');
        })
      );
  }

  getEmpleados() {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    return this.http.post(this.BASE_RUTA + this.RUTA_LOGIN + '/getEmpleados', '').pipe(
      map(dat => {
        console.log('res ' + JSON.stringify(dat));
        return dat;
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


  actualizarRol(id_user: any, nuevoRol: string): Observable<any> {
    const payload = new HttpParams()
      .set('id_user', id_user)
      .set('nuevoRol', nuevoRol);

    return this.http.put(this.BASE_RUTA + this.RUTA_EMPLEADO + '/actualizarRol', payload)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar el rol:', error);
          return throwError(error);
        })
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

  // UsuariosService
  editarEmpleado(id_user: string, datos: any): Observable<any> {
    const url = `${this.BASE_RUTA}/editar-empleado/${id_user}`;
    return this.http.put(url, datos);
  }

  //   getUserId(email: string): Observable<any> {
  //   const payload = { email };  // Crear un objeto con el correo electrónico

  //   return this.http.post(`${this.BASE_RUTA}Logueo/getUserId`, payload).pipe(
  //     catchError(error => {
  //       console.error('Error al obtener información del usuario por correo electrónico:', error);
  //       return throwError(error);
  //     })
  //   );
  // }



  getEmpresas() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.BASE_RUTA + this.RUTA_REGISTRO + '/getEmpresas', '', { headers });
  }
}