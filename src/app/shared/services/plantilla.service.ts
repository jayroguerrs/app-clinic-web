import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {Plantilla} from "../models/plantilla";

@Injectable({ providedIn: 'root' })
export class PlantillaService {
    public user: Observable<Plantilla>;
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

    listar(): Observable<Plantilla[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/plantilla`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: Plantilla[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const plantilla = new Plantilla();
                plantilla.id = item.id;
                plantilla.nombre = item.nombre;
                plantilla.plantilla = item.plantilla;
                plantilla.idUsuarioRegistro = item.idUsuarioRegistro;
                plantilla.idUsuarioModifico = item.idUsuarioModifico;
                plantilla.fechaRegistro = new Date(item.fechaRegistro);
                plantilla.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
                plantilla.usuarioRegistro = item.usuarioRegistro;
                plantilla.usuarioModifico = item.usuarioModifico;
                plantilla.idEstado = item.idEstado;
                plantilla.estado = item.estado;
                collection.push(plantilla);
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

  listarActivos(): Observable<Plantilla[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/plantilla/activos`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: Plantilla[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const plantilla = new Plantilla();
            plantilla.id = item.id;
            plantilla.nombre = item.nombre;
            plantilla.plantilla = item.plantilla;
            plantilla.idUsuarioRegistro = item.idUsuarioRegistro;
            plantilla.idUsuarioModifico = item.idUsuarioModifico;
            plantilla.fechaRegistro = new Date(item.fechaRegistro);
            plantilla.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            plantilla.usuarioRegistro = item.usuarioRegistro;
            plantilla.usuarioModifico = item.usuarioModifico;
            plantilla.idEstado = item.idEstado;
            plantilla.estado = item.estado;
            collection.push(plantilla);
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

  listarByEstado(idEstado: number): Observable<Plantilla[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/plantilla/estado/${idEstado}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: Plantilla[] = [];
        if(res.status === 200){
          res.data.forEach((item) => {
            const plantilla = new Plantilla();
            plantilla.id = item.id;
            plantilla.nombre = item.nombre;
            plantilla.plantilla = item.plantilla;
            plantilla.idUsuarioRegistro = item.idUsuarioRegistro;
            plantilla.idUsuarioModifico = item.idUsuarioModifico;
            plantilla.fechaRegistro = new Date(item.fechaRegistro);
            plantilla.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;
            plantilla.usuarioRegistro = item.usuarioRegistro;
            plantilla.usuarioModifico = item.usuarioModifico;
            plantilla.idEstado = item.idEstado;
            plantilla.estado = item.estado;
            collection.push(plantilla);
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

    registrar(plantilla: Plantilla): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/plantilla`, plantilla, {headers: this.headers}).pipe(
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

    modificar(plantilla: Plantilla): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/plantilla/${plantilla.id}`, plantilla, {headers: this.headers}).pipe(
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
