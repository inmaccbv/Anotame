import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  private refreshSubject = new BehaviorSubject<boolean>(false);

  // Método para iniciar el refresco
  startRefresh(): void {
    this.refreshSubject.next(true);
  }

  // Método para detener el refresco
  stopRefresh(): void {
    this.refreshSubject.next(false);
  }

  // Observable para suscribirse a eventos de refresco
  getRefreshObservable() {
    return this.refreshSubject.asObservable();
  }
}