import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartaUploadService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_IMG = "CartaUpload";

  constructor(private http: HttpClient) { }

  uploadFile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();

    return this.http.post(this.BASE_RUTA + 'CartaUpload/do_upload', formData, { headers });
  }

  getImg(): Observable<any[]> {
    const url = this.BASE_RUTA + 'cartaUpload/getImg';
    console.log('URL de getImg():', url);

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