import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  BASE_RUTA ="http://localhost/anotame/APIANOTAME/public/";

  RUTA_EMPRESA= "Empresas";


  constructor(

    private http: HttpClient

  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      // 'Content-Type': 'application/json',
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

  registroEmpresa( datos : any) {
    console.log(datos)
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    const payload = new HttpParams()
      .set('cif', datos.cif)
      .set('empresa', datos.empresa)
      .set('direccion', datos.direccion)
      .set('provincia', datos.provincia)
      .set('ciudad', datos.ciudad)
      .set('cPostal', datos.cPostal);

    // console.log(payload);

    return this.http.post(this.BASE_RUTA + this.RUTA_EMPRESA, payload)
      .pipe(map(
        dat => {
          console.log('res ' + JSON.stringify(dat));
          return dat;
        },
        (err: any) =>
          console.log(err)
      ));
  }


  getEmpresas() {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    return this.http.post(this.BASE_RUTA + this.RUTA_EMPRESA + '/getEmpresas', '')
    .pipe(
      dat => {
        console.log('res ' + JSON.stringify(dat));
        return dat;
      }
    );
  }

  borrarEmpresa(id_empresa: any) {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const payload = new HttpParams()
      .set('id_empresa', id_empresa);

    return this.http.post(this.BASE_RUTA + this.RUTA_EMPRESA + '/borrarEmpresa', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }

  getProvincias() {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    return this.http.post(this.BASE_RUTA + this.RUTA_EMPRESA + '/getProvincias', '')
    .pipe(
      dat => {
        console.log('res ' + JSON.stringify(dat));
        return dat;
      }
    );
  }
}