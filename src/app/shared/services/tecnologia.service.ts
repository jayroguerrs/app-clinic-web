import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Tecnologia} from "../models/tecnologia";
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";

@Injectable({ providedIn: 'root' })
export class TecnologiaService {
    public user: Observable<Tecnologia>;
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

    listar(): Observable<Tecnologia[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/tecnologia`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: Tecnologia[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const tecnologia = new Tecnologia();
                tecnologia.id = item.id;
                tecnologia.nombre = item.nombre;
                tecnologia.nombreCorto = item.nombreCorto;
                tecnologia.descripcion = item.descripcion;
                tecnologia.idUsuarioRegistro = item.idUsuarioRegistro;
                tecnologia.idUsuarioModifico = item.idUsuarioModifico;
                tecnologia.fechaRegistro = new Date(item.fechaRegistro);
                tecnologia.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
                tecnologia.usuarioRegistro = item.usuarioRegistro;
                tecnologia.usuarioModifico = item.usuarioModifico;
                tecnologia.idEstado = item.idEstado;
                // tecnologia.estado = item.estado;
                tecnologia.idServicio = item.idServicio;
                tecnologia.servicio = item.servicio;
                tecnologia.servicioColor = item.servicioColor;
                collection.push(tecnologia);
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

  listarByEstado(idEstado: number): Observable<Tecnologia[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/tecnologia/estado/${idEstado}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: Tecnologia[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const tecnologia = new Tecnologia();
            tecnologia.id = item.id;
            tecnologia.nombre = item.nombre;
            tecnologia.nombreCorto = item.nombreCorto;
            tecnologia.idUsuarioRegistro = item.idUsuarioRegistro;
            tecnologia.idUsuarioModifico = item.idUsuarioModifico;
            tecnologia.fechaRegistro = new Date(item.fechaRegistro);
            tecnologia.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            tecnologia.usuarioRegistro = item.usuarioRegistro;
            tecnologia.usuarioModifico = item.usuarioModifico;
            tecnologia.idEstado = item.idEstado;
            tecnologia.estado = item.estado;
            tecnologia.servicio = item.servicio;
            tecnologia.idServicio = item.idServicio;
            collection.push(tecnologia);
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

  listarByServicio(idServicio: number): Observable<Tecnologia[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/tecnologia/servicio/${idServicio}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: Tecnologia[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const tecnologia = new Tecnologia();
            tecnologia.id = item.id;
            tecnologia.nombre = item.nombre;
            tecnologia.nombreCorto = item.nombreCorto;
            tecnologia.idUsuarioRegistro = item.idUsuarioRegistro;
            tecnologia.idUsuarioModifico = item.idUsuarioModifico;
            tecnologia.fechaRegistro = new Date(item.fechaRegistro);
            tecnologia.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            tecnologia.usuarioRegistro = item.usuarioRegistro;
            tecnologia.usuarioModifico = item.usuarioModifico;
            tecnologia.idEstado = item.idEstado;
            tecnologia.estado = item.estado;
            tecnologia.servicio = item.servicio;
            tecnologia.idServicio = item.idServicio;
            collection.push(tecnologia);
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

    registrar(tecnologia: Tecnologia): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/tecnologia`, tecnologia, {headers: this.headers}).pipe(
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

    modificar(tecnologia: Tecnologia): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/tecnologia/${tecnologia.id}`, tecnologia, {headers: this.headers}).pipe(
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
