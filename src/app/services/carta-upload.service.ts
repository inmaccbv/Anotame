import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartaUploadService {
 
  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_IMG = "CartaUpload";

  constructor(private http: HttpClient) { }
  
  uploadFile(datos: any, idEmpresa: number, idUsuario: number): Observable<any> {
    const formData = new FormData();
    formData.append('carta_img', datos.get('carta_img'));  // Asegúrate de que la clave sea correcta
    formData.append('id_empresa', idEmpresa.toString());
    formData.append('id_user', idUsuario.toString());
  
    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });
  
    return this.http.post(this.BASE_RUTA + this.RUTA_IMG, formData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }
  

  getCartasByEmpresa(idEmpresa: number): Observable<any> {
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_IMG}/getTextosByEmpresa`, { params });
  }

  getImg(): Observable<any[]> {
    const url = this.BASE_RUTA + 'cartaUpload/getImg';
    // console.log('URL de getImg():', url);

    return this.http.get<any[]>(url).pipe(
      map(images => {
        return images.map(image => {
          return {
            id_carta: image.id_carta,
            carta_img: image.carta_img,
            imageUrl: this.BASE_RUTA + 'uploads/' + image.carta_img
          };
        });
      })
    );
  }

  borrarImg(id_carta: any) {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const payload = new HttpParams()
      .set('id_carta', id_carta);

    return this.http.post(this.BASE_RUTA + this.RUTA_IMG + '/borrarImg', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }
}