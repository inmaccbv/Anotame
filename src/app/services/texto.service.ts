import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextoService {
  textoGuardado: string = '';

  constructor() { }

  setTextoGuardado(texto: string) {
    this.textoGuardado = texto;
  }

  getTextoGuardado(): string {
    return this.textoGuardado;
  }
}
