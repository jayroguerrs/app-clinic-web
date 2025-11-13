import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {CitaDetalle, CT_Zona} from "../models/cita";

@Injectable({ providedIn: 'root' })

export class CitaDetalleService {

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

    obtenerDetalleByCita( idCita: number ): Observable<CitaDetalle[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/citaDetalle/cita/${idCita}`, {headers: this.headers}).pipe(
          map((res: any[]) => {

            // console.log('api detalle', res);

            const collection: CitaDetalle[] = [];
            res.forEach((el) => {

              const OCitaDetalle = new CitaDetalle();
              OCitaDetalle.id = el.id;
              OCitaDetalle.idCita = el.idCita;
              OCitaDetalle.sesion = el.sesion;
              OCitaDetalle.precio = el.precio;
              OCitaDetalle.pagoWeb = el.pagoWeb;
              OCitaDetalle.zona = new CT_Zona();
              OCitaDetalle.zona.id = el.zona.id;
              OCitaDetalle.zona.nombre = el.zona.nombre;

              collection.push( OCitaDetalle );

            });

            return collection;
          }),catchError( err => {
            return throwError(err);
          })
        );
    }
}
