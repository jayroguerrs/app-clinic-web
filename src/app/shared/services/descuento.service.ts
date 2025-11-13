import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map} from "rxjs/operators";
import {Descuento} from "../models/descuento";

@Injectable({ providedIn: 'root' })
export class DescuentoService {
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

    obtenerListado(): Observable<Descuento[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/descuento`, {headers: this.headers}).pipe(
          map( (res) => {
            const collection: Descuento[] = [];
            if(res.status === 200){
              res.data.forEach( x => {
                const descuento = new Descuento();
                descuento.id = x.id;
                descuento.idEstado = x.idEstado;
                descuento.nombre = x.nombre;
                descuento.porcentaje = x.porcentaje;
                descuento.usuarioRegistro = x.usuarioRegistro;
                descuento.usuarioModifico = x.usuarioModifico;
                collection.push(descuento);
              });
            }
            return collection;
          })
        )
    }

}
