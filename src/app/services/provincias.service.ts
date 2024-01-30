import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {
  
  BASE_RUTA ="http://localhost/anotame/APIANOTAME/public/";
  
  RUTA_PROVINCIA = "Provincias";

  constructor(
    public http: HttpClient
  ) { }

  
  getProvincias() {

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    return this.http.post(this.BASE_RUTA + this.RUTA_PROVINCIA + '/getProvincias', '')
    .pipe(
      dat => {
        console.log('res ' + JSON.stringify(dat));
        return dat;
      }
    );
  }
}