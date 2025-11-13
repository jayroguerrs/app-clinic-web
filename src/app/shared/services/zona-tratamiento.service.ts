import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {ZonaTratamiento} from "../models/zonas";

@Injectable({ providedIn: 'root' })
export class ZonaTratamientoService {
    public user: Observable<ZonaTratamiento>;
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

    collection(idUsuario: number): Observable<ZonaTratamiento[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/zona-tratamiento/collection/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: ZonaTratamiento[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new ZonaTratamiento();
                model.id = item.id;
                model.idServicio = item.idServicio;
                model.servicio = item.servicio;
                model.servicioColor = item.servicioColor;
                model.nombre = item.nombre;
                model.descripcion = item.descripcion;
                model.idUsuarioRegistro = item.idUsuarioRegistro;
                model.idUsuarioModifico = item.idUsuarioModifico;
                model.fechaRegistro = new Date(item.fechaRegistro);
                model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
                model.usuarioRegistro = item.usuarioRegistro;
                model.usuarioModifico = item.usuarioModifico;
                model.idEstado = item.idEstado;
                collection.push(model);
              });
            }else{
              const error = new ErrorSistema();
              error.message = res.error;
              error.status = res.status;

              return error;
            }

            return collection;
          }),catchError((e) => {
            throw Error(e);
          })
        );
    }


    listarByServicio(idServicio: number, idUsuario: number): Observable<ZonaTratamiento[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/zona-tratamiento/list/${idServicio}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{

          const collection: ZonaTratamiento[] = [];
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ZonaTratamiento();
              model.id = item.id;
              model.nombre = item.nombre;
              model.idEstado = item.idEstado;
              model.idServicio = item.idServicio;
              collection.push(model);
            });
          }else{
            const error = new ErrorSistema();
            error.message = res.error;
            error.status = res.status;

            return error;
          }

          return collection;
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }

    registrar(model: ZonaTratamiento): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/zona-tratamiento`, model, {headers: this.headers}).pipe(
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
          throw Error(e);
        })
      );
    }


  modificar(model: ZonaTratamiento): Observable<boolean | ErrorSistema >{
    return this.http.put(`${environment.apiUrl}/api/zona-tratamiento`, model, {headers: this.headers}).pipe(
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
        throw Error(e);
      })
    );
  }


}
