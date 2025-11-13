import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {ComprobanteUnidadMedida} from "../../models/facturacion/comprobante-unidad-medida";

@Injectable({ providedIn: 'root' })
export class ComprobanteUnidadMedidaService {
    public user: Observable<ComprobanteUnidadMedida>;
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

    listar(idUsuario: number): Observable<ComprobanteUnidadMedida[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/comprobanteUnidadMedida/lista/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: ComprobanteUnidadMedida[] = [];

            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new ComprobanteUnidadMedida();
                model.id = item.id;
                model.nombre = item.nombre;
                model.descripcion = item.descripcion;
                model.idUsuarioRegistro = item.idUsuarioRegistro;
                model.idUsuarioModifico = item.idUsuarioModifico;
                model.fechaRegistro = new Date(item.fechaRegistro);
                model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
                model.usuarioRegistro = item.usuarioRegistro;
                model.usuarioModifico = item.usuarioModifico;
                model.valor = item.valor;
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


  listar2(idUsuario: number): Observable<ComprobanteUnidadMedida[] | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/comprobanteUnidadMedida/lista2/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: ComprobanteUnidadMedida[] = [];

        if(res.status === 200){
          res.data.forEach((item) => {
            const model = new ComprobanteUnidadMedida();
            model.id = item.id;
            model.nombre = item.nombre;
            model.descripcion = item.descripcion;
            model.valor = item.valor;
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


    buscarById(id: number, idUsuario: number): Observable<ComprobanteUnidadMedida | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/comprobanteUnidadMedida/${id}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ComprobanteUnidadMedida();
              model.id = item.id;
              model.nombre = item.nombre;
              model.descripcion = item.descripcion;
              model.idUsuarioRegistro = item.idUsuarioRegistro;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
              model.usuarioRegistro = item.usuarioRegistro;
              model.usuarioModifico = item.usuarioModifico;
              model.valor = item.valor;
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

    registrar(model: ComprobanteUnidadMedida): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/comprobanteUnidadMedida`, model, {headers: this.headers}).pipe(
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

    modificar(model: ComprobanteUnidadMedida): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/comprobanteUnidadMedida/${model.id}`, model, {headers: this.headers}).pipe(
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
