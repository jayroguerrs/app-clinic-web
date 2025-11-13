import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {PromocionCategoria} from "../models/promocion";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
@Injectable({ providedIn: 'root' })

export class PromocionCategoriaService {

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


    listar(): Observable<PromocionCategoria[]>
    {
      return this.http.get<any>(`${environment.apiUrl}/api/promocionCategoria`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: PromocionCategoria[] = [];
          if(res.status === 200){
            res.data.forEach( d => {
              const model = new PromocionCategoria();
              model.id = d.id;
              model.nombre = d.nombre;
              model.idUsuarioRegistro = d.idUsuarioRegistro;
              model.idUsuarioModifico = d.idUsuarioModifico;
              model.usuarioRegistro = d.usuarioRegistro;
              model.usuarioModifico = d.usuarioModifico;
              model.fechaRegistro = d.fechaRegistro;
              model.fechaModifico = d.fechaModifico;
              model.idEstado = d.idEstado;
              collection.push( model );
            });
          }
          return collection;
        }), catchError((e) => {
          return throwError(e.message, e.code);
        })
      );
    }


    registrar(model: PromocionCategoria): Observable<boolean | ErrorSistema>
    {
      return this.http.post<any>(`${environment.apiUrl}/api/promocionCategoria`, model,{headers: this.headers}).pipe(
        map((res) => {
          if(res.status === 201){
            return true;
          }
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;

          return error;
        }), catchError((e) => {
          return throwError(e.message, e.code);
        })
      );
    }

    modificar(model: PromocionCategoria): Observable<boolean | ErrorSistema>
    {
      return this.http.put<any>(`${environment.apiUrl}/api/promocionCategoria/${model.id}`, model,{headers: this.headers}).pipe(
        map((res) => {
          if(res.status === 200){
            return true;
          }
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;

          return error;
        }), catchError((e) => {
          return throwError(e.message, e.code);
        })
      );
    }

}
