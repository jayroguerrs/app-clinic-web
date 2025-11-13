import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {TipoMedicion} from "../models/tipo-medicion";


@Injectable({
  providedIn: 'root'
})

export class TipoMedicionService {

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

    collection(): Observable<TipoMedicion[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/tipoMedicion`, {headers: this.headers}).pipe(
          map(response => {

              if(response.status != 200){
                throw throwError(response.mensaje);
              }

              const tipos : TipoMedicion[] = [];
              response.data.forEach( dt => {
                  const tipo = new TipoMedicion();
                  tipo.id = dt.id;
                  tipo.nombre = dt.nombre;
                  tipos.push( tipo );
              });

              return tipos;
          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

}
