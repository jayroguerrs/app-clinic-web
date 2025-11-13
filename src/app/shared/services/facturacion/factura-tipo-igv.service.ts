import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {FacturaTipoIgv} from "../../models/facturacion/factura-tipo-igv";

@Injectable({ providedIn: 'root' })
export class FacturaTipoIgvService {
    public user: Observable<FacturaTipoIgv>;
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

    listar(idUsuario: number): Observable<FacturaTipoIgv[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/facturaTipoIgv/lista/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: FacturaTipoIgv[] = [];

            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new FacturaTipoIgv();
                model.id = item.id;
                model.nombre = item.nombre;
                model.descripcion = item.descripcion;
                model.valor = item.valor;
                model.idUsuarioRegistro = item.idUsuarioRegistro;
                model.idUsuarioModifico = item.idUsuarioModifico;
                model.fechaRegistro = new Date(item.fechaRegistro);
                model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
                model.usuarioRegistro = item.usuarioRegistro;
                model.usuarioModifico = item.usuarioModifico;
                model.idEstado = item.idEstado;
                model.aplicaIgv = item.aplicaIgv;
                model.gratuita = item.gratuita;
                model.inafecta = item.inafecta;
                model.exonerada = item.exonerada;
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


  listar2(idUsuario: number): Observable<FacturaTipoIgv[] | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/facturaTipoIgv/lista2/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: FacturaTipoIgv[] = [];

        if(res.status === 200){
          res.data.forEach((item) => {
            const model = new FacturaTipoIgv();
            model.id = item.id;
            model.nombre = item.nombre;
            model.descripcion = item.descripcion;
            model.valor = item.valor;
            model.idEstado = item.idEstado;
            model.aplicaIgv = item.aplicaIgv;
            model.gratuita = item.gratuita;
            model.inafecta = item.inafecta;
            model.exonerada = item.exonerada;

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


    buscarById(id: number, idUsuario: number): Observable<FacturaTipoIgv | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/facturaTipoIgv/${id}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new FacturaTipoIgv();
              model.id = item.id;
              model.nombre = item.nombre;
              model.descripcion = item.descripcion;
              model.valor = item.valor;
              model.idUsuarioRegistro = item.idUsuarioRegistro;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
              model.usuarioRegistro = item.usuarioRegistro;
              model.usuarioModifico = item.usuarioModifico;
              model.idEstado = item.idEstado;
              model.aplicaIgv = item.aplicaIgv;
              model.gratuita = item.gratuita;
              model.inafecta = item.inafecta;
              model.exonerada = item.exonerada;

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

    registrar(model: FacturaTipoIgv): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/facturaTipoIgv`, model, {headers: this.headers}).pipe(
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

    modificar(model: FacturaTipoIgv): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/facturaTipoIgv/${model.id}`, model, {headers: this.headers}).pipe(
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
