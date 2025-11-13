import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {TipoCita} from "../model/cita";

@Injectable({ providedIn: 'root' })
export class TipoCitaService {
    public user: Observable<TipoCita>;
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

    listar(): Observable<TipoCita[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/c360/tipoCita`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: TipoCita[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new TipoCita();
                model.id = item.id;
                model.nombre = item.nombre;
                model.idUsuarioRegistro = item.idUsuarioRegistro;
                model.idUsuarioModifico = item.idUsuarioModifico;
                model.fechaRegistro = new Date(item.fechaRegistro);
                model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
                model.usuarioRegistro = item.usuarioRegistro;
                model.usuarioModifico = item.usuarioModifico;
                model.idEstado = item.idEstado;
                model.estado = item.estado;
                collection.push(model);
              });
            }else{
              throw new Error(res.message);
            }

            return collection;
          }),catchError((e) => {
            return throwError(e);
          })
        );
    }

  listarByEstado(idEstado: number): Observable<TipoCita[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/c360/tipoCita/estado/${idEstado}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: TipoCita[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const model = new TipoCita();
            model.id = item.id;
            model.nombre = item.nombre;
            model.idUsuarioRegistro = item.idUsuarioRegistro;
            model.idUsuarioModifico = item.idUsuarioModifico;
            model.fechaRegistro = new Date(item.fechaRegistro);
            model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            model.usuarioRegistro = item.usuarioRegistro;
            model.usuarioModifico = item.usuarioModifico;
            model.idEstado = item.idEstado;
            model.estado = item.estado;
            collection.push(model);
          });
        }else{
          throw new Error(res.message);
        }

        return collection;
      }),catchError((e) => {
        return throwError(e);
      })
    );
  }

    registrar(tipoCita: TipoCita): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/c360/tipoCita`, tipoCita, {headers: this.headers}).pipe(
        map((res: any) =>{
          if(res.status === 201 ){
            return true;
          }else{
            const alerta = new ErrorSistema();
            alerta.status = res.status;
            alerta.message = res.message;
            return alerta;
          }
        }), catchError((e) => {
          return throwError(e);
        })
      );
    }

    modificar(tipoCita: TipoCita): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/c360/tipoCita/${tipoCita.id}`, tipoCita, {headers: this.headers}).pipe(
        map((res: any) =>{
          if(res.status === 200 ){
            return true;
          }else{
            const alerta = new ErrorSistema();
            alerta.status = res.status;
            alerta.message = res.message;
            return alerta;
          }
        }), catchError((e) => {
          return throwError(e);
        })
      );
    }

}
