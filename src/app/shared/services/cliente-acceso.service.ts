import { Injectable } from '@angular/core';
import { CONFIG } from '../configuracion/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {ClienteAcceso, ClienteClass} from '../models/cliente';
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";

@Injectable({ providedIn: 'root' })
export class ClienteAccesoService {
    url: string;
    versionapi: string;
    public user: Observable<ClienteClass>;
    headers: HttpHeaders;

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

    changeEmail(model: ClienteAcceso): Observable<boolean | ErrorSistema> {
      return this.http.put<any>(`${environment.apiUrl}/api/clienteAcceso/${model.idCliente}/correo`, model,{headers: this.headers}).pipe(
        map((res) => {

          if(res.status !== 200){
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

          return true;
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    changePassword(model: ClienteAcceso): Observable<boolean | ErrorSistema> {
      return this.http.put<any>(`${environment.apiUrl}/api/clienteAcceso/${model.idCliente}/clave`, model,{headers: this.headers}).pipe(
        map((res) => {

          if(res.status !== 200){
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

          return true;
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    getCredentials(idCliente: number): Observable<ClienteAcceso | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/clienteAcceso/${idCliente}/credenciales`, {headers: this.headers}).pipe(
        map((res) => {

          if(res.status !== 200){
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }else{
            const credenciales = new ClienteAcceso();
            credenciales.registrado = res.data.registrado;
            credenciales.correo = res.data.correo;
            credenciales.clave = res.data.clave;
            return credenciales;
          }
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

}
