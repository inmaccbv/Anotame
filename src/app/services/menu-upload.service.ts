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

  // Método para subir un archivo de menú
  uploadFile(datos: any, idEmpresa: number, idUsuario: number): Observable<any> {
    // Crear un nuevo objeto FormData y agregar los datos necesarios
    const formData = new FormData();
    formData.append('menu_img', datos.get('menu_img'));  // Asegúrate de que la clave sea correcta
    formData.append('dia', datos.get('dia')); 
    formData.append('id_empresa', idEmpresa.toString());
    formData.append('id_user', idUsuario.toString());
  
    // Configurar encabezados HTTP
    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });
  
    // Realizar la solicitud POST para cargar la imagen del menú
    return this.http.post(this.BASE_RUTA + this.RUTA_IMG, formData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        return throwError(error);
      })
    );
  }

  // Método para obtener menús por empresa
  getMenusByEmpresa(idEmpresa: number): Observable<any> {
    // Configurar parámetros HTTP para la solicitud GET
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_IMG}/getMenusByEmpresa`, { params });
  }

  // Método para obtener todas las imágenes de menú
  getImg(): Observable<any[]> {
    // Construir la URL completa para la solicitud GET
    const url = this.BASE_RUTA + 'menuUpload/getImg';
    console.log('URL de getImg():', url);

    // Realizar la solicitud GET y mapear las imágenes obtenidas
    return this.http.get<any[]>(url).pipe(
      map(images => {
        return images.map(image => {
          return {
            id_menu: image.id_menu,
            menu_img: image.menu_img,
            imageUrl: this.BASE_RUTA + 'uploads/' + image.menu_img,
            dia: image.dia  
          };
        });
      })
    );
  }

  // Método para borrar una imagen de menú
  borrarImg(id_menu: any) {
    // Configurar encabezados HTTP
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    // Configurar el payload (parámetros) para la solicitud POST
    const payload = new HttpParams()
      .set('id_menu', id_menu);

    // Realizar la solicitud POST para borrar la imagen del menú
    return this.http.post(this.BASE_RUTA + this.RUTA_IMG + '/borrarImg', payload)
      .pipe(
        dat => {
          console.log('res ' + JSON.stringify(dat));

          return dat;
        }
      );
  }
}
