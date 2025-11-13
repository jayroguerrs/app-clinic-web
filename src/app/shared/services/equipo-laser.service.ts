import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import {Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado } from 'src/app/componentes/preferente/preferente.models';
import {EquipoLaser} from "../models/equipo-laser";
import {map, catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EquipoLaserService {

  url: string;
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

  collection(): Observable<EquipoLaser[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/equipoLaser`, {headers: this.headers}).pipe(
      map( (res: any[]) => {

        const collection: EquipoLaser[] = [];
        res.forEach((equipo) => {

          const OEquipo = new EquipoLaser();
          OEquipo.id = equipo.id;
          OEquipo.nombre = equipo.nombre;
          OEquipo.descripcion = equipo.descripcion;
          OEquipo.estado = equipo.estado;

          collection.push( OEquipo );
        });

        return collection;

      }),catchError( err => {
        return throwError(err);
      })
    );
  }
}
