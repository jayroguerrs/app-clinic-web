import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {RAlternativaMedicion} from "../interfaces/Response/medicion/alternativa-medicion";

@Injectable({
  providedIn: 'root'
})

export class VariableMedicionService {

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
    obtenerAlternativasByTipo( tipo: string ): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/alternativaMedicion/${tipo}`, {headers: this.headers}).pipe(
          map(response => {

              if(response.status != 200){
                return throwError(response.mensaje);
              }

              const alternativas : RAlternativaMedicion[] = [];
              response.data.forEach( dt => {

                  const alternativa: RAlternativaMedicion = {
                    id: dt.id,
                    nombre: dt.nombre,
                    tipo: dt.tipo
                  };
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
