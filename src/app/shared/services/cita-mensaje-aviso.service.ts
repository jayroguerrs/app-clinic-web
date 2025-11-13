import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG } from '../configuracion/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {CitaMensajeAviso} from "../models/corporal-360/Cita";
import {catchError, map} from "rxjs/operators";
@Injectable({ providedIn: 'root' })

export class CitaMensajeAvisoService {
    url: string;
    versionapi: string;
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

    obtenerAvisos(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/avisos`, {headers: this.headers});
    }
    obtenerByIdNotas(num): any {
        return this.http.get<any>(`${environment.apiUrl}/api/avisos/`+num, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/cita/search/`+str, {headers: this.headers});
    }
    guardar(avisos): any {
        return this.http.post(`${environment.apiUrl}/api/avisos`, avisos, {headers: this.headers});
    }
    actualizar(idavisos, avisos): any {
        return this.http.put(`${environment.apiUrl}/api/avisos/` + idavisos, avisos, {headers: this.headers});
    }
    obtenerByIdCita(idCita: number): Observable<CitaMensajeAviso[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaMensajeAviso/cita/${idCita}`, {headers: this.headers}).pipe(
        map((res: any) => {
          if(res.status === 200){
            const collection: CitaMensajeAviso[] = [];
            res.data.forEach(x => {
              const model = new CitaMensajeAviso();
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
