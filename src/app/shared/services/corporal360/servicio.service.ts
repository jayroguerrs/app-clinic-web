import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Servicio} from "../../models/corporal-360/servicio";
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../../models/error-sistema";

@Injectable({ providedIn: 'root' })
export class ServicioService {
    public user: Observable<Servicio>;
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

    listar(): Observable<Servicio[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/c360/servicio`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: Servicio[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const servicio = new Servicio();
                servicio.id = item.id;
                servicio.nombre = item.nombre;
                servicio.nombreCorto = item.nombreCorto;
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

  listarByEstado(idEstado: number): Observable<Servicio[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/c360/servicio/estado/${idEstado}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: Servicio[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const servicio = new Servicio();
            servicio.id = item.id;
            servicio.nombre = item.nombre;
            servicio.nombreCorto = item.nombreCorto;
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

  buscarById(idServicio: number): Observable<Servicio | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/c360/servicio/${idServicio}`, {headers: this.headers}).pipe(
      map((res) =>{
        if(res.status === 200){
           const item = res.data;
            const servicio = new Servicio();
            servicio.id = item.id;
            servicio.nombre = item.nombre;
            servicio.nombreCorto = item.nombreCorto;
            servicio.idUsuarioRegistro = item.idUsuarioRegistro;
            servicio.idUsuarioModifico = item.idUsuarioModifico;
            servicio.fechaRegistro = new Date(item.fechaRegistro);
            servicio.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            servicio.usuarioRegistro = item.usuarioRegistro;
            servicio.usuarioModifico = item.usuarioModifico;
            servicio.idEstado = item.idEstado;
            servicio.estado = item.estado;
            return servicio;
        }else{
          const e = new ErrorSistema();
          e.status = res.status;
          e.message = res.message;
          return e;
        }
      }),catchError((e) => {
        throw Error(e);
      })
    );
  }

    registrar(servicio: Servicio): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/c360/servicio`, servicio, {headers: this.headers}).pipe(
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

    modificar(servicio: Servicio): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/c360/servicio/${servicio.id}`, servicio, {headers: this.headers}).pipe(
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
