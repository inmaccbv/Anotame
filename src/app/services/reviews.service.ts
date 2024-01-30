import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private resenasSubject = new BehaviorSubject<any[]>([]);

  resenas$ = this.resenasSubject.asObservable();

  constructor() {}

  actualizarResenas(resenas: any[]) {
    this.resenasSubject.next(resenas);
  }
}
