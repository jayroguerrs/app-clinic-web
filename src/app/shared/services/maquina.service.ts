import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {MaquinaMinutos} from "../models/maquina";
import {catchError, map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class MaquinaService {
    private headers: HttpHeaders;
    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }

    obtenerMaquina(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/maquina`, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/maquina/search/`+str, {headers: this.headers});
    }
    obtenerById(id): any {
        return this.http.get<any>(`${environment.apiUrl}/api/maquina/` + id, {headers: this.headers});
    }
    guardar(maquina): any {
        return this.http.post(`${environment.apiUrl}/api/maquina`, maquina, {headers: this.headers});
    }
    actualizar(maquina): any {
        return this.http.put(`${environment.apiUrl}/api/maquina/`, maquina, {headers: this.headers});
    }
    obtenerMinutos(idSede: number, fechaCita: string): Observable<MaquinaMinutos[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/maquina/${fechaCita}/${idSede}`, {headers: this.headers}).pipe(
        map( res => {
          const collection: MaquinaMinutos[] = [];

          res.data.forEach( m => {
            const maquina = new MaquinaMinutos();
            maquina.citas = m.citas;
            maquina.idMaquina = m.idMaquina;
            maquina.sede = m.sede;
            maquina.minutos = m.minutos;
            maquina.porcentaje = m.porcentaje;
            collection.push(maquina);
          });

          return collection;

        }),catchError( error => {
          return throwError(error);
        })
      );
    }
}
