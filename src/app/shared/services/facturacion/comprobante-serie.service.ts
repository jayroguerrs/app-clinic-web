import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {ComprobanteSerie} from "../../models/facturacion/comprobante-serie";

@Injectable({ providedIn: 'root' })
export class ComprobanteSerieService {
    public user: Observable<ComprobanteSerie>;
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

    listar(idUsuario: number): Observable<ComprobanteSerie[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/comprobanteSerie/lista/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: ComprobanteSerie[] = [];

            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new ComprobanteSerie();
                model.id = item.id;
                model.idSede = item.idSede;
                model.sede = item.sede;
                model.idTipoComprobante = item.idTipoComprobante;
                model.tipoComprobante = item.tipoComprobante;
                model.serie = item.serie;
                model.numeroActual = item.numeroActual;
                model.descripcion = item.descripcion;
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
              const error = new ErrorSistema();
              error.message = res.message;
              error.status = res.status;
              return error;
            }

            return collection;
          }),catchError((e) => {
            throw Error(e);
          })
        );
    }


    listar2(idUsuario: number): Observable<ComprobanteSerie[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/comprobanteSerie/lista2/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          const collection: ComprobanteSerie[] = [];

          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ComprobanteSerie();
              model.id = item.id;
              model.idSede = item.idSede;
              model.numeroActual = item.numeroActual;
              model.idTipoComprobante = item.idTipoComprobante;
              model.serie = item.serie;
              model.idEstado = item.idEstado;
              collection.push(model);
            });
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

          return collection;
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }

    listarBySedeTipoComprobante(idUsuario: number, idSede: number, idTipoComprobante: number): Observable<ComprobanteSerie[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/comprobanteSerie/listar-sede-tipo/${idUsuario}/${idSede}/${idTipoComprobante}`, {headers: this.headers}).pipe(
        map((res) =>{
          const collection: ComprobanteSerie[] = [];

          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ComprobanteSerie();
              model.id = item.id;
              model.idSede = item.idSede;
              model.sede = item.sede;
              model.idTipoComprobante = item.idTipoComprobante;
              model.tipoComprobante = item.tipoComprobante;
              model.serie = item.serie;
              model.numeroActual = item.numeroActual;
              model.descripcion = item.descripcion;
              model.idUsuarioRegistro = item.idUsuarioRegistro;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
              model.usuarioRegistro = item.usuarioRegistro;
              model.usuarioModifico = item.usuarioModifico;
              model.idEstado = item.idEstado;
              model.estado = item.estado;
              model.numeroComprobante = item.numeroComprobante;
              collection.push(model);
            });
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

          return collection;
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }

    listarToNotaCredito(idUsuario): Observable<ComprobanteSerie[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/comprobanteSerie/listar-nota-credito/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          const collection: ComprobanteSerie[] = [];

          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ComprobanteSerie();
              model.id = item.id;
              model.idSede = item.idSede;
              model.idTipoComprobante = item.idTipoComprobante;
              model.serie = item.serie;
              model.numeroActual = item.numeroActual;
              collection.push(model);
            });
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

          return collection;
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }

      listarByTipoComprobante(idUsuario: number, idTipoComprobante: number): Observable<ComprobanteSerie[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/comprobanteSerie/listar-tipo/${idUsuario}/${idTipoComprobante}`, {headers: this.headers}).pipe(
        map((res) =>{
          const collection: ComprobanteSerie[] = [];

          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ComprobanteSerie();
              model.id = item.id;
              model.idSede = item.idSede;
              model.idTipoComprobante = item.idTipoComprobante;
              model.serie = item.serie;
              model.numeroComprobante = item.numeroComprobante;
              collection.push(model);
            });
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

          return collection;
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }


    buscarById(id: number, idUsuario: number): Observable<ComprobanteSerie | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/comprobanteSerie/${id}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ComprobanteSerie();
              model.id = item.id;
              model.idSede = item.idSede;
              model.idTipoComprobante = item.idTipoComprobante;
              model.serie = item.serie;
              model.descripcion = item.descripcion;
              model.numeroActual = item.numeroActual;
              model.idUsuarioRegistro = item.idUsuarioRegistro;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
              model.usuarioRegistro = item.usuarioRegistro;
              model.usuarioModifico = item.usuarioModifico;
              model.idEstado = item.idEstado;
              model.estado = item.estado;
              return model;
            });
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }

    registrar(model: ComprobanteSerie): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/comprobanteSerie`, model, {headers: this.headers}).pipe(
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

    modificar(model: ComprobanteSerie): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/comprobanteSerie/${model.id}`, model, {headers: this.headers}).pipe(
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
