import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {RCitaMotivo} from "../interfaces/Response/cita-motivo-estado";

@Injectable({ providedIn: 'root' })

export class CitaMotivoService {

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
    collectionByCitaEstado( idCitaEstado: number ): Observable<RCitaMotivo[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaMotivo/citaEstado/${idCitaEstado}`,{headers: this.headers})
      .pipe(
        map((res: any ) => {
          if(res.status === 200){

            const collection: RCitaMotivo[] = [];
            res.data.forEach((el) => {
              const motivoEstado: RCitaMotivo = {
                id: el.id,
                motivo: el.motivo,
                idCitaEstado: el.idCitaEstado
              }
              collection.push(motivoEstado);
            });

            return collection;
          }else{
            throw throwError(res.status, res.mensaje);
          }

        }),catchError(err => {
          return throwError(err);
        })
      );
    }

  collection(): Observable<RCitaMotivo[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/citaMotivo`,{headers: this.headers})
      .pipe(
        map((res: any ) => {
          if(res.status === 200){

            const collection: RCitaMotivo[] = [];
            res.data.forEach((el) => {
              const motivoEstado: RCitaMotivo = {
                id: el.id,
                motivo: el.motivo,
                idCitaEstado: el.idCitaEstado
              }
              collection.push(motivoEstado);
            });

            return collection;
          }else{
            throw throwError(res.status, res.mensaje);
          }

        }),catchError(err => {
          return throwError(err);
        })
      );
  }

}
