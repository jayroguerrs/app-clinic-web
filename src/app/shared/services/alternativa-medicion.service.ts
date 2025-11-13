import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {AlternativaMedicion} from "../models/alternativa-medicion";

@Injectable({
  providedIn: 'root'
})

export class AlternativaMedicionService {

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
    obtenerAlternativasByTipo( tipo: number ): Observable<AlternativaMedicion[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/alternativaMedicion/${tipo}`, {headers: this.headers}).pipe(
          map(response => {

              if(response.status !== 200){
                throw throwError(response.mensaje);
              }

              const alternativas : AlternativaMedicion[] = [];
              response.data.forEach( dt => {

                  const alternativa = new AlternativaMedicion();
                  alternativa.id = dt.id;
                  alternativa.nombre = dt.nombre;
                  alternativa.idTipoMedicion = dt.idTipoMedicion;

                  alternativas.push( alternativa );
              });

              return alternativas;
          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

}
