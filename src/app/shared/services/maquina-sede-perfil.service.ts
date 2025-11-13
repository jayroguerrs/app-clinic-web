import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {catchError, map} from "rxjs/operators";
import {MaquinaSedePerfil} from "../models/maquina";
import {ErrorSistema} from "../models/error-sistema";
@Injectable({ providedIn: 'root' })

export class MaquinaSedePerfilService {

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

    listarByIdMaquinaSede(idUsuario: number, idMaquinaSede: number): Observable<MaquinaSedePerfil[] | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/maquinaSedePerfil/maquina-sede/${idUsuario}/${idMaquinaSede}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res instanceof ErrorSistema){
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }else{
            const collection: MaquinaSedePerfil[] = [];

            res.data.forEach(x => {
              const model = new MaquinaSedePerfil();
              model.id = x.id;
              model.idMaquinaSede = x.idMaquinaSede;
              model.idPerfil = x.idPerfil;
              model.perfil = x.perfil;
              model.maquina = x.maquina;
              collection.push(model);
            });

            return collection;
          }
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }


    registrar(model: MaquinaSedePerfil): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/maquinaSedePerfil`, model, {headers: this.headers}).pipe(
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
}
