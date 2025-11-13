import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {Caso} from "../model/caso";

@Injectable({ providedIn: 'root' })
export class CasoService {
    public user: Observable<Caso>;
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

    listar(): Observable<Caso[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/c360/caso`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: Caso[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new Caso();
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

  listarByEstado(idEstado: number): Observable<Caso[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/c360/caso/estado/${idEstado}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: Caso[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const model = new Caso();
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

    registrar(caso: Caso): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/c360/caso`, caso, {headers: this.headers}).pipe(
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

    modificar(caso: Caso): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/c360/caso/${caso.id}`, caso, {headers: this.headers}).pipe(
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
