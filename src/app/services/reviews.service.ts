import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";
  RUTA_REVIEWS = "SubirResena";

  constructor(
    private http: HttpClient,
    private alertController: AlertController) { }

  // Método para subir una reseña
  subirResena(resena: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const calificacion = typeof resena.calificacion === 'number' ? resena.calificacion : 0;
    const comentario = typeof resena.comentario === 'string' ? resena.comentario : '';

    const datos = {
      calificacion: calificacion,
      comentario: comentario,
      id_cliente: resena.id_cliente,
      id_empresa: resena.id_empresa
    };

    return this.http.post(this.BASE_RUTA + this.RUTA_REVIEWS, datos, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener reseñas filtradas por empresa
  getReviewsByEmpresa(idEmpresa: number) {
    const params = new HttpParams().set('id_empresa', idEmpresa.toString());
    return this.http.get(`${this.BASE_RUTA}${this.RUTA_REVIEWS}/getResenasPorEmpresa`, { params });
  }

  // Método para obtener todas las reseñas
  getReviews(): Observable<any> {
    return this.http.get(this.BASE_RUTA + this.RUTA_REVIEWS + '/getReviews')
      .pipe(
        tap((ans) => {
          console.log('Reservas obtenidas:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener las reservas:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener reseñas (para el administrador)
  obtenerResenas() {
    return this.http.get(this.BASE_RUTA + this.RUTA_REVIEWS + '/obtenerResenas')
      .pipe(
        tap((ans) => {
          // console.log('Reseñas obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener empleados:', error);
          throw error;
        })
      );
  }

  // Método para obtener detalles del cliente por ID
  obtenerDetallesCliente(idCliente: number): Observable<any> {
    return this.http.get(this.BASE_RUTA + this.RUTA_REVIEWS + '/obtenerDetallesCliente')
      .pipe(
        tap((ans) => {
          // console.log('Reseñas obtenidos:', ans);
          return ans;
        }),
        catchError(error => {
          console.error('Error al obtener empleados:', error);
          throw error;
        })
      );
  }

  // Método para mostrar un cuadro de diálogo para responder a una reseña
  async mostrarCuadroDialogoParaRespuesta(resena: any): Promise<string | null> {
    const alert = await this.alertController.create({
      header: 'Responder Reseña',
      inputs: [
        {
          name: 'respuesta',
          type: 'textarea',
          placeholder: 'Escribe tu respuesta aquí...',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Responder Reseña cancelado');
          },
        },
        {
          text: 'Enviar',
          handler: (data) => {
            // console.log('Respuesta enviada:', data.respuesta);
            // Asignamos la respuesta a la propiedad respuesta de la reseña
            resena.respuesta = data.respuesta;

            // Actualizamos la respuesta en la base de datos
            this.agregarRespuestaEnBD(resena.id_reviews, data.respuesta).subscribe(
              (respuesta) => {
                // console.log('Respuesta agregada a la base de datos:', respuesta);
              },
              (error) => {
                console.error('Error al agregar respuesta a la base de datos:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();

    return alert.onDidDismiss().then(() => resena.respuesta || null);
  }

  // Método privado para agregar una respuesta en la base de datos
  private agregarRespuestaEnBD(id_reviews: number, respuesta: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const datos = {
      id_reviews: id_reviews,
      respuesta: respuesta,
    };

    return this.http.post(`${this.BASE_RUTA}${this.RUTA_REVIEWS}/agregarRespuesta`, datos, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud de agregar respuesta:', error);
          return throwError(error);
        })
      );
  }
}