import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {ZonaSesionTratamiento, ZonaTratamiento} from "../models/zonas";

@Injectable({ providedIn: 'root' })
export class ZonaSesionTratamientoService {

    public user: Observable<ZonaSesionTratamiento>;
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

    collectionByZona(idZona: number, idUsuario: number): Observable<ZonaSesionTratamiento[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/zona-sesion-tratamiento/collection/${idUsuario}/${idZona}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: ZonaSesionTratamiento[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new ZonaSesionTratamiento();
                model.id = item.id;
                model.idZona = item.idZona;
                model.sesion = item.sesion;
                model.idTratamientos = item.idTratamientos;
                model.idUsuarioRegistro = item.idUsuarioRegistro;
                model.usuarioRegistro = item.usuarioRegistro;
                model.fechaRegistro = new Date(item.fechaRegistro);

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

    tratamientosByZonaSesion(idUsuario: number, idZona: number, sesion: number): Observable<ZonaTratamiento[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/zona-sesion-tratamiento/list/${idUsuario}/${idZona}/${sesion}`, {headers: this.headers}).pipe(
        map((res) =>{
          const collection: ZonaTratamiento[] = [];
          if(res.status === 200){
            res.data.forEach((item) => {
              const model = new ZonaTratamiento();
              model.id = item.id;
              model.nombre = item.nombre;

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

    registrar(model: any): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/zona-sesion-tratamiento`, model, {headers: this.headers}).pipe(
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


}
