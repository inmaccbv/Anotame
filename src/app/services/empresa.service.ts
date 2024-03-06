import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_EMPRESA = "Empresas";

  public empresaSeleccionada: any;

  constructor(private http: HttpClient) {}

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

  // Manejar errores HTTP
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(`El servidor devolvió un código ${error.status}, body: ${error.error}`);
    }
    return throwError('Algo salió mal; por favor, inténtalo de nuevo más tarde.');
  }

  // Método para realizar el registro de una empresa
  registroEmpresa(datos: any): Observable<any> {
    const payload = new HttpParams()
      .set('cif', datos.cif)
      .set('empresa', datos.empresa)
      .set('direccion', datos.direccion)
      .set('provincia', datos.provincia)
      .set('ciudad', datos.ciudad)
      .set('cPostal', datos.cPostal)
      .set('tipoLocal', datos.tipoLocal);

    return this.http.post(this.BASE_RUTA + this.RUTA_EMPRESA, payload)
      .pipe(map(
        dat => {
          return dat;
        },
        (err: any) =>
          console.log(err)
      ));
  }

  
  getUltimaEmpresa(): Observable<any> {
    return this.http.get(this.BASE_RUTA + this.RUTA_EMPRESA + '/obtenerUltimaEmpresa')
      .pipe(
        catchError(error => {
          console.error('Error al obtener la última empresa:', error);
          throw error;
        })
      );
  }

  // Método para obtener la lista de empresas
  getEmpresas(): Observable<any> {
    return this.http.get(this.BASE_RUTA + this.RUTA_EMPRESA + '/getEmpresas')
      .pipe(
        tap((ans) => {
          // console.log('Empresas obtenidas:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener las empresas:', error);
          throw error;
        })
      );
  }

  // Método para borrar una empresa
  borrarEmpresa(id_empresa: any): Observable<any> {
    const payload = new HttpParams().set('id_empresa', id_empresa);

    return this.http.post(this.BASE_RUTA + this.RUTA_EMPRESA + '/borrarEmpresa', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));
          return dat;
        }
      );
  }

  // Método para establecer la empresa seleccionada
  setEmpresaSeleccionada(id_empresa: string): Observable<any> {
    const payload = new HttpParams().set('id_empresa', id_empresa);
    return this.http.post(this.BASE_RUTA + this.RUTA_EMPRESA + '/setEmpresaSeleccionada', payload)
      .pipe(
        map(dat => {
          // console.log('Respuesta: ' + JSON.stringify(dat));
          return dat;
        }),
        catchError(error => {
          console.error('Error:', error);
          let errorMessage = 'Algo salió mal; por favor, inténtalo de nuevo más tarde.';

          // Puedes personalizar el mensaje de error según la respuesta del servidor
          if (error && error.error && error.error.text) {
            errorMessage = error.error.text;
          }

          return throwError(errorMessage);
        })
      );
  }
  getEmpleadosPorEmpresa(idUsuario: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_RUTA}${this.RUTA_EMPRESA}/getEmpleadosPorEmpresa/${idUsuario}`);
  }
}