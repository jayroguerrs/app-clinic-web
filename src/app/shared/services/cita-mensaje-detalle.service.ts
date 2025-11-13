import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG } from '../configuracion/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { detalle } from '../models/detalle';
import {CitaMensajeAviso, CitaMensajeDetalle} from "../models/corporal-360/Cita";
import {catchError, map} from "rxjs/operators";
@Injectable({ providedIn: 'root' })

export class CitaMensajeDetalleService {
    url: string;
    versionapi: string;
    public user: Observable<detalle>;
    private headers: HttpHeaders;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.url = CONFIG.url;
        this.versionapi = CONFIG.versionApi;
        this.headers = new HttpHeaders({
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
        });
    }

    obtenerDetalle(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/detalle`, {headers: this.headers});
    }
    obtenerByIdNotas(num): any {
        return this.http.get<any>(`${environment.apiUrl}/api/detalle/`+num, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/cita/search/`+str, {headers: this.headers});
    }
    guardar(detalle): any {
        return this.http.post(`${environment.apiUrl}/api/detalle`, detalle, {headers: this.headers});
    }
    actualizar(iddetalle, detalle): any {
        return this.http.put(`${environment.apiUrl}/api/detalle/` + iddetalle, detalle, {headers: this.headers});
    }

    obtenerByIdCita(idCita: number): Observable<CitaMensajeDetalle[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaMensajeDetalle/cita/${idCita}`, {headers: this.headers}).pipe(
        map((res: any) => {
          if(res.status === 200){
            const collection: CitaMensajeDetalle[] = [];
            res.data.forEach(x => {
              const model = new CitaMensajeDetalle();
              model.id = x.id;
              model.idCita = x.idCita;
              model.texto = x.texto;
              model.destacado = x.destacado;
              model.idUsuarioRegistro = x.idUsuarioRegistro;
              model.usuarioRegistro = x.usuarioRegistro;
              model.fechaRegistro = new Date(x.fechaRegistro);
              collection.push(model);
            });
            return collection;
          }else{
            throw  throwError(res.message);
          }
        }),catchError((err) => {
          return throwError(err);
        })
      );
    }
}
