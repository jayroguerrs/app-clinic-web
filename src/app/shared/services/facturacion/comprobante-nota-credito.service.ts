import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {ComprobanteNotaCredito} from "../../models/facturacion/comprobante-nota-credito";

@Injectable({ providedIn: 'root' })
export class ComprobanteNotaCreditoService {
    public user: Observable<ComprobanteNotaCredito>;
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

    listar(idUsuario: number): Observable<ComprobanteNotaCredito[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/comprobanteNotaCredito/lista/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: ComprobanteNotaCredito[] = [];

            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new ComprobanteNotaCredito();
                model.id = item.id;
                model.serie = item.serie;
                model.numero = item.numero;
                model.observaciones = item.observaciones;
                model.idTipoComprobante = item.idTipoComprobante;
                model.tipoComprobanteValor = item.tipoComprobanteValor;
                model.idComprobante = item.idComprobante;
                model.idTipoNotaCredito = item.idTipoNotaCredito;
                model.idUsuarioRegistro = item.idUsuarioRegistro;
                model.idUsuarioModifico = item.idUsuarioModifico;
                model.fechaRegistro = new Date(item.fechaRegistro);
                model.fechaModifico = item.fechaModifico ? new Date(item.fechaRegistro) : null;

                // secundario
                model.usuarioRegistro = item.usuarioRegistro;
                model.usuarioModifico = item.usuarioModifico;
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


    buscarById(id: number, idUsuario: number): Observable<ComprobanteNotaCredito | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/comprobanteNotaCredito/${id}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ComprobanteNotaCredito();
              model.id = item.id;
              model.serie = item.serie;
              model.numero = item.numero;
              model.observaciones = item.observaciones;
              model.idTipoComprobante = item.idTipoComprobante;
              model.tipoComprobanteValor = item.tipoComprobanteValor;
              model.idComprobante = item.idComprobante;
              model.idTipoNotaCredito = item.idTipoNotaCredito;
              model.idUsuarioRegistro = item.idUsuarioRegistro;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaRegistro) : null;

              // secundario
              model.usuarioRegistro = item.usuarioRegistro;
              model.usuarioModifico = item.usuarioModifico;
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

    registrar(model: ComprobanteNotaCredito): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/comprobanteNotaCredito`, model, {headers: this.headers}).pipe(
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

    modificar(model: ComprobanteNotaCredito): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/comprobanteNotaCredito/${model.id}`, model, {headers: this.headers}).pipe(
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
