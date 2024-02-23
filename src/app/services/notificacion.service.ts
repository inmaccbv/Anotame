import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private notificacionSubject = new Subject<any>();

  notificacion$ = this.notificacionSubject.asObservable();

  enviarNotificacion(notificacion: any) {
    this.notificacionSubject.next(notificacion);
  }
}
