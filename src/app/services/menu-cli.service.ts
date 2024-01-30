import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Componente } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MenuCliService {

  constructor(
    private http: HttpClient,
   
  ) { }

  getMenuOptsCli() {
    return this.http.get<Componente[]>('/assets/data/menu-opts-cli.json').pipe(
      tap((data) => console.log('Opts menu hamburguesa: ', data))
    );
  }
}