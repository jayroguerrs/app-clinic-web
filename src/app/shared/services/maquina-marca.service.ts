import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {MaquinaMarca} from "../models/maquina-marca";
import {Servicio} from "../models/servicio";

@Injectable({ providedIn: 'root' })
export class MaquinaMarcaService {


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

    listar(): Observable<MaquinaMarca[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/maquinaMarca/lista`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: MaquinaMarca[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new MaquinaMarca();
                model.id = item.id;
                model.nombre = item.nombre;
                model.nombreCorto = item.nombreCorto;
                model.estado = item.estado;
                collection.push(model);
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

    listarByServicio(idServicio: number ): Observable<MaquinaMarca[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/maquinaMarca/lista/servicio/${idServicio}`, {headers: this.headers}).pipe(
        map((res) =>{
          const collection: MaquinaMarca[] = [];
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new MaquinaMarca();
              model.id = item.id;
              model.nombre = item.nombre;
              model.nombreCorto = item.nombreCorto;
              model.estado = item.estado;
              collection.push(model);
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

  collection(): Observable<MaquinaMarca[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/maquinaMarca`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: MaquinaMarca[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const model = new MaquinaMarca();
            model.id = item.id;
            model.nombre = item.nombre;
            model.nombreCorto = item.nombreCorto;
            model.idUsuarioRegistro = item.idUsuarioRegistro;
            model.idUsuarioModifico = item.idUsuarioModifico;
            model.fechaRegistro = new Date(item.fechaRegistro);
            model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            model.usuarioRegistro = item.usuarioRegistro;
            model.usuarioModifico = item.usuarioModifico;
            model.idEstado = item.idEstado;
            model.estado = item.estado;
            model.idServicios = item.idServicios;

            item.servicios.forEach(s => {
              const servicio = new Servicio();
              servicio.id = s.id;
              servicio.nombre = s.nombre;
              servicio.color = s.color;
              model.servicios.push(servicio);
            });

            collection.push(model);
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


    registrar(MaquinaMarca: MaquinaMarca): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/maquinaMarca`, MaquinaMarca, {headers: this.headers}).pipe(
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

    modificar(MaquinaMarca: MaquinaMarca): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/maquinaMarca/${MaquinaMarca.id}`, MaquinaMarca, {headers: this.headers}).pipe(
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
