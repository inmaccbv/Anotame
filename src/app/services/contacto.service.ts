import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatosContacto } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private datos: DatosContacto[] = [];
  private datosSubject = new BehaviorSubject<any[]>([]);
  datos$ = new BehaviorSubject<DatosContacto[]>([]); // Asegúrate de inicializarlo con un valor inicial si es necesario


  actualizarDatos(nuevosDatos: any[]) {
    this.datosSubject.next(nuevosDatos);
  }

  constructor() { }

  agregarDato(dato: any): void {
    // Agregamos la propiedad 'dia' con un valor predeterminado (puedes ajustarlo según tus necesidades)
    dato.dia = 'Lunes'; // Por ejemplo, establecemos 'Lunes' por defecto
    this.datos.push(dato);
    this.datosSubject.next(this.datos);
  }

  obtenerDatos(): BehaviorSubject<any[]> {
    return this.datosSubject;
  }

  limpiarDatos(): void {
    this.datos = [];
    this.datosSubject.next(this.datos);
  }
}
