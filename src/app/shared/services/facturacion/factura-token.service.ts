import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {FacturaToken} from "../../models/facturacion/factura-token";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";

@Injectable({ providedIn: 'root' })
export class FacturaTokenService {
    public user: Observable<FacturaToken>;
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

    listar(idUsuario: number): Observable<FacturaToken[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/facturaToken/lista/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: FacturaToken[] = [];

            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new FacturaToken();
                model.id = item.id;
                model.ruta = item.ruta;
                model.token = item.token;
                model.idSede = item.idSede;
                model.sede = item.sede;
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

  buscarById(id: number, idUsuario: number): Observable<FacturaToken | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/facturaToken/${id}/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) =>{
        if(res.status === 200){
          res.data.forEach((item) => {
            const model = new FacturaToken();
            model.id = item.id;
            model.ruta = item.ruta;
            model.token = item.token;
            model.idSede = item.idSede;
            model.sede = item.sede;
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

    registrar(model: FacturaToken): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/facturaToken`, model, {headers: this.headers}).pipe(
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

    modificar(model: FacturaToken): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/facturaToken/${model.id}`, model, {headers: this.headers}).pipe(
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
