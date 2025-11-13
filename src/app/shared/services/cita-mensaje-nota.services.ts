import { Injectable } from '@angular/core';
import { CONFIG } from '../configuracion/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { notas } from '../models/notas';
import {CitaMensajeAviso, CitaMensajeNota} from "../models/corporal-360/Cita";
import {catchError, map} from "rxjs/operators";
@Injectable({ providedIn: 'root' })

export class CitaMensajeNotaService {
    url: string;
    versionapi: string;
    public user: Observable<notas>;
    private headers: HttpHeaders;

    constructor(
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

    obtenerNotas(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/notas`, {headers: this.headers});
    }
    obtenerByIdNotas(num): any {
        return this.http.get<any>(`${environment.apiUrl}/api/notas/`+num, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/cita/search/`+str, {headers: this.headers});
    }
    guardar(notas): any {
        return this.http.post(`${environment.apiUrl}/api/notas`, notas, {headers: this.headers});
    }
    actualizar(idnotas, notas): any {
        return this.http.put(`${environment.apiUrl}/api/notas/` + idnotas, notas, {headers: this.headers});
    }

    obtenerByIdCita(idCita: number): Observable<CitaMensajeNota[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaMensajeNota/cita/${idCita}`, {headers: this.headers}).pipe(
        map((res: any) => {
          if(res.status === 200){
            const collection: CitaMensajeNota[] = [];
            res.data.forEach(x => {
              const model = new CitaMensajeNota();
              model.id = x.id;
              model.idCita = x.idCita;
              model.idCliente = x.idCliente;
              model.texto = x.texto;
              model.destacado = x.destacado;
              model.idUsuarioRegistro = x.idUsuario;
              model.usuarioRegistro = x.usuarioRegistro;
              model.fechaRegistro = new Date(x.fechaRegistro);
              collection.push(model);
            });
            return collection;
          }else{
            throw throwError(res.message);
          }

        }),catchError((err) => {
          return throwError(err);
        })
      );
    }
}
