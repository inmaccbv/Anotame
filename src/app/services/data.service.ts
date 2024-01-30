import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Componente } from '../interfaces/interfaces';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userRole: string = localStorage.getItem('userRole') || 'guest';


  constructor( private http: HttpClient ) { }

  getMenuOptsCli() {
    return this.http.get<Componente[]>('/assets/data/menu-opts-cli.json').pipe(
      tap((datacli) => console.log('Opts menu hamburguesa cliente: ', datacli))
    );
  }

  getMenuOpts() {
    return this.http.get<Componente[]>('/assets/data/menu-opts.json').pipe(
      tap((data) => console.log('Opts menu hamburguesa: ', data))
    );
  }
}