import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {CronogramaSeguimiento} from "../../models/corporal-360/Cita";
import {Observable} from "rxjs/Observable";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";

@Injectable({ providedIn: 'root' })

export class CronogramaSeguimientoService {

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

    findByCronograma(idCronograma: number): Observable<CronogramaSeguimiento[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/cronogramaSeguimiento/cronograma/${idCronograma}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: CronogramaSeguimiento[] = [];
          if(res.status === 200){
            res.data.forEach(x => {
              const m = new CronogramaSeguimiento();
              m.id = x.id;
              m.idCronograma = x.idCronograma;
              m.idCronogramaSeguimientoConcepto = x.idCronogramaSeguimientoConcepto;
              m.descripcion = x.descripcion;
              m.idUsuarioRegistro = x.idUsuarioRegistro;
              m.fechaRegistro = new Date(x.fechaRegistro);

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
