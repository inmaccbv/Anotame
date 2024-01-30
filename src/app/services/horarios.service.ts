import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Horario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private horarios: Horario[] = [];

  private horariosSubject = new BehaviorSubject<Horario[]>([]);
  horarios$ = this.horariosSubject.asObservable();

  // horarios.service.ts
  constructor() {
    // Recuperar horarios almacenados en localStorage al inicializar el servicio
    const horariosGuardados = JSON.parse(localStorage.getItem('horarios') || '[]') as Horario[];
    this.actualizarHorarios(horariosGuardados);
  }


  agregarHorario(horario: Horario): void {
    const horarios = this.horariosSubject.getValue();
    horarios.push(horario);
    this.horariosSubject.next(horarios);
    console.log('Horarios actualizados:', horarios);
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
