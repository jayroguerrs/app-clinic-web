import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {FacturaDatosCliente} from "../../models/facturacion/factura-datos-cliente";

@Injectable({ providedIn: 'root' })
export class FacturaDatosClienteService {
    public user: Observable<FacturaDatosCliente>;
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

    obtenerListadoPorCliente(idCliente: number, idUsuario: number): Observable<FacturaDatosCliente[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/facturaDatosCliente/lista/${idUsuario}/${idCliente}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            const collection : FacturaDatosCliente[] = [];
            res.data.forEach(item => {
              const model = new FacturaDatosCliente();
              model.idCliente = item.idCliente;
              model.idTipoDocumentoCliente = item.idTipoDocumento;
              model.tipoDocumentoCliente = item.tipoDocumento;
              model.numeroDocumentoCliente = item.numeroDocumento;
              model.nombreCliente = item.denominacion;
              model.direccion = item.direccion;
              model.idEstado = item.idEstado;
              model.idUsuarioRegistro = item.idUsuarioRegistro;
              model.usuarioRegistro = item.usuarioRegistro;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.usuarioModifico = item.usuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
              collection.push(model);
            });

            return collection;
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


    obtenerListadoPorCliente2(idCliente: number, idUsuario: number): Observable<FacturaDatosCliente[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/facturaDatosCliente/lista2/${idUsuario}/${idCliente}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            const collection : FacturaDatosCliente[] = [];
            res.data.forEach(item => {
              const model = new FacturaDatosCliente();
              model.idCliente = item.idCliente;
              model.idTipoDocumentoCliente = item.idTipoDocumento;
              model.tipoDocumentoCliente = item.tipoDocumento;
              model.numeroDocumentoCliente = item.numeroDocumento;
              model.nombreCliente = item.denominacion;
              model.direccion = item.direccion;
              model.idEstado = item.idEstado;
              model.predeterminado = item.predeterminado;
              model.idUsuarioRegistro = item.idUsuarioRegistro;
              model.usuarioRegistro = item.usuarioRegistro;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.usuarioModifico = item.usuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
              collection.push(model);
            });

            return collection;
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

    buscarById(id: number, idUsuario: number): Observable<FacturaDatosCliente | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/facturaDatosCliente/${id}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new FacturaDatosCliente();
              model.id = item.id;
              model.idCliente = item.idCliente;
              model.idTipoDocumentoCliente = item.idTipoDocumento;
              model.tipoDocumentoCliente = item.tipoDocumento;
              model.numeroDocumentoCliente = item.numeroDocumento;
              model.nombreCliente = item.denominacion;
              model.direccion = item.direccion;
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

    buscarByNumeroDocumento(numeroDocumento: string, idUsuario: number): Observable<FacturaDatosCliente | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/facturaDatosCliente/buscar/${numeroDocumento}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            const item = res.data;

              const model = new FacturaDatosCliente();
              model.id = item.id;
              model.idCliente = item.idCliente;
              model.idTipoDocumentoCliente = item.idTipoDocumento;
              model.tipoDocumentoCliente = item.tipoDocumento;
              model.tipoDocumentoClienteValor = item.tipoDocumentoValor;
              model.numeroDocumentoCliente = item.numeroDocumento;
              model.nombreCliente = item.denominacion;
              model.direccion = item.direccion;
              model.idUsuarioModifico = item.idUsuarioModifico;
              model.fechaRegistro = new Date(item.fechaRegistro);
              model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
              model.usuarioRegistro = item.usuarioRegistro;
              model.usuarioModifico = item.usuarioModifico;
              model.idEstado = item.idEstado;
              model.estado = item.estado;
              return model;
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

    buscarPredeterminadoByCliente(idCliente: number, idTipoComprobante: number, idUsuario: number): Observable<FacturaDatosCliente | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/facturaDatosCliente/predeterminado/${idCliente}/${idTipoComprobante}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            const item = res.data;
            const model = new FacturaDatosCliente();
            model.id = item.id;
            model.idCliente = item.idCliente;
            model.idTipoDocumentoCliente = item.idTipoDocumento;
            model.tipoDocumentoCliente = item.tipoDocumento;
            model.tipoDocumentoClienteValor = item.tipoDocumentoValor;
            model.numeroDocumentoCliente = item.numeroDocumento;
            model.nombreCliente = item.denominacion;
            model.direccion = item.direccion;
            model.predeterminado = item.predeterminado;
            model.idUsuarioModifico = item.idUsuarioModifico;
            model.fechaRegistro = new Date(item.fechaRegistro);
            model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            model.usuarioRegistro = item.usuarioRegistro;
            model.usuarioModifico = item.usuarioModifico;
            model.idEstado = item.idEstado;
            model.estado = item.estado;
            return model;
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

    registrar(model: FacturaDatosCliente): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/facturaDatosCliente`, model, {headers: this.headers}).pipe(
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

    modificar(model: FacturaDatosCliente): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/facturaDatosCliente/${model.id}`, model, {headers: this.headers}).pipe(
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
