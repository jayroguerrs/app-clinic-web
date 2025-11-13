import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { CONFIG } from '../configuracion/config';
import {catchError, map} from "rxjs/operators";
import {ClienteAsignadoEstado} from "../models/cliente";
import {ErrorSistema} from "../models/error-sistema";

@Injectable({
  providedIn: 'root'
})

export class ClienteAsignadoEstadoService {
  url: string;
  versionapi: string;
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

  obtenerListado(): Observable<ClienteAsignadoEstado[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cliente-asignado-estado/listado`, {headers: this.headers}).pipe(
      map((res) => {
        const collection : ClienteAsignadoEstado[] = [];

        if(res.status === 200){
          res.data.forEach((x) => {
            const item = new ClienteAsignadoEstado();
            item.id = x.id;
            item.estado = x.estado;
            item.color = x.color;

            collection.push(item);
          });
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;

          return error;
        }

        return collection;
      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }

}
