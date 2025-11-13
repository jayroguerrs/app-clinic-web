import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CitaTipo } from '../models/cita';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CitaTipoService {

    headers: HttpHeaders;

    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });

    }

    collection(): Observable<CitaTipo[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaTipo/`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: CitaTipo[] = [];
          res.forEach( d => {
            const model = new CitaTipo();
            model.id = d.idTipoCita;
            model.nombre = d.nombre;
            collection.push(model);
          });
          return collection;
        }),
        catchError(err => {
          return throwError(err.message, err.code);
        })
      );
    }


}
