import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Componente } from '../interfaces/interfaces';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient,
   
  ) { }

  getMenuOpts() {
    return this.http.get<Componente[]>('/assets/data/menu-opts.json').pipe(
      tap((data) => console.log('Opts menu hamburguesa: ', data))
    );
  }
}