import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {FacturaSerie} from "../models/factura-serie";

@Injectable({ providedIn: 'root' })
export class FacturaSerieService {
    public user: Observable<FacturaSerie>;
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

    listar(): Observable<FacturaSerie[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/facturaSerie`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: FacturaSerie[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const servicio = new FacturaSerie();
                servicio.id = item.id;
                servicio.serie = item.serie;
                servicio.idSede = item.idSede;
                servicio.sede = item.sede;
                servicio.idUsuarioRegistro = item.idUsuarioRegistro;
                servicio.idUsuarioModifico = item.idUsuarioModifico;
                servicio.fechaRegistro = new Date(item.fechaRegistro);
                servicio.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
                servicio.usuarioRegistro = item.usuarioRegistro;
                servicio.usuarioModifico = item.usuarioModifico;
                servicio.idEstado = item.idEstado;
                servicio.estado = item.estado;
                collection.push(servicio);
              });
            }else{
              throw new Error(res.message);
            }

            return collection;
          }),catchError((e) => {
            throw Error(e);
          })
        );
    }

  listarByEstado(idEstado: number): Observable<FacturaSerie[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/facturaSerie/estado/${idEstado}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: FacturaSerie[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const servicio = new FacturaSerie();
            servicio.id = item.id;
            servicio.serie = item.serie;
            servicio.idSede = item.idSede;
            servicio.sede = item.sede;
            servicio.idUsuarioRegistro = item.idUsuarioRegistro;
            servicio.idUsuarioModifico = item.idUsuarioModifico;
            servicio.fechaRegistro = new Date(item.fechaRegistro);
            servicio.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            servicio.usuarioRegistro = item.usuarioRegistro;
            servicio.usuarioModifico = item.usuarioModifico;
            servicio.idEstado = item.idEstado;
            servicio.estado = item.estado;
            collection.push(servicio);
          });
        }else{
          throw new Error(res.message);
        }

        return collection;
      }),catchError((e) => {
        throw Error(e);
      })
    );
  }

    registrar(servicio: FacturaSerie): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/facturaSerie`, servicio, {headers: this.headers}).pipe(
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
          throw e;
        })
      );
    }

    modificar(servicio: FacturaSerie): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/facturaSerie/${servicio.id}`, servicio, {headers: this.headers}).pipe(
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
          throw e;
        })
      );
    }

}
