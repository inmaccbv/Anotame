import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuUploadService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_IMG = "MenuUpload";

  constructor(private http: HttpClient) { }

  uploadFile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();

    return this.http.post(this.BASE_RUTA + 'MenuUpload/do_uploadMenu', formData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en la carga de archivos:', error);
          return throwError(error);
        })
      );
  }

  getImg(): Observable<any[]> {
    const url = this.BASE_RUTA + 'menuUpload/getImg';
    console.log('URL de getImg():', url);

    return this.http.get<any[]>(url).pipe(
      map(images => {
        return images.map(image => {
          return {
            id_menu: image.id_menu,
            menu_img: image.menu_img,
            imageUrl: this.BASE_RUTA + 'uploads/' + image.menu_img
          };
        });
      })
    );
  }

  borrarImg(id_menu: any) {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const payload = new HttpParams()
      .set('id_menu', id_menu);

    return this.http.post(this.BASE_RUTA + this.RUTA_IMG + '/borrarImg', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }
}