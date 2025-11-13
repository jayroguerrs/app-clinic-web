import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {CitaSeguimiento} from "../../models/corporal-360/Cita";
import {Observable} from "rxjs/Observable";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";

@Injectable({ providedIn: 'root' })

export class CitaSeguimiento360Service {

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

    findByCita(idCita: number): Observable<CitaSeguimiento[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaSeguimiento360/cita/${idCita}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: CitaSeguimiento[] = [];
          if(res.status === 200){
            res.data.forEach(x => {
              const m = new CitaSeguimiento();
              m.id = x.id;
              m.idCita = x.idCita;
              m.idCitaSeguimientoConcepto = x.idCitaSeguimientoConcepto;
              m.descripcion = x.descripcion;
              m.idUsuarioRegistro = x.idUsuarioRegistro;
              m.fechaRegistro = new Date(x.fechaRegistro);
              m.fechaCita = new Date(x.fechaCita);

              //secondary
              m.usuarioRegistro = x.usuarioRegistro;
              m.detalle = x.detalle;
              collection.push(m);
            });
          }
          return collection;
        }),catchError((err)=> {
          return throwError(err);
        })
      );
    }


}
