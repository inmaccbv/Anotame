import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { Horario } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private horarios: Horario[] = [];

  private horariosSubject = new BehaviorSubject<Horario[]>([]);
  horarios$ = this.horariosSubject.asObservable();

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  RUTA_HORARIO = "Horarios";

  constructor(private http: HttpClient) {
    // Recuperar horarios almacenados en localStorage al inicializar el servicio
    const horariosGuardados = JSON.parse(localStorage.getItem('horarios') || '[]') as Horario[];
    this.actualizarHorarios(horariosGuardados);
  }

  agregarHorario(horario: Horario): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  
    const payload = new HttpParams()
      .set('dia', horario.dia)
      .set('horaApertura', horario.horaApertura)
      .set('horaCierre', horario.horaCierre);
  
      return this.http.post(this.BASE_RUTA + this.RUTA_HORARIO, payload.toString(), { headers })
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud:', error);
          throw error; // Propagar el error para que se maneje en el componente
        })
      );
  }

  borrarHorario(horario: Horario): void {
    const index = this.horarios.findIndex(h => h.dia === horario.dia);
    if (index !== -1) {
      this.horarios.splice(index, 1);
      this.horariosSubject.next(this.horarios);
      console.log('Horarios actualizados:', this.horarios);
    }
  }

  limpiarHorarios(): void {
    this.horarios = [];
    this.horariosSubject.next([...this.horarios]);
  }

  actualizarHorarios(nuevosHorarios: Horario[]): void {
    this.horariosSubject.next(nuevosHorarios);
  }

  obtenerHorarios(): Observable<Horario[]> {
    return this.horariosSubject.asObservable();
  }

}
