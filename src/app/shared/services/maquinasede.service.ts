import { Injectable } from '@angular/core';
import { CONFIG } from '../configuracion/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {MaquinaSede, maquinasede} from '../models/maquinasede';
import {catchError, map} from "rxjs/operators";
@Injectable({ providedIn: 'root' })

export class MaquinaSedeService {
    url: string;
    versionapi: string;
    public user: Observable<maquinasede>;
    private headers: HttpHeaders;

    constructor(
        private http: HttpClient
    ){
        this.url = CONFIG.url;
        this.versionapi = CONFIG.versionApi;
        this.headers = new HttpHeaders({
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
        });
    }

    obtener(idEstado: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/maquinasede/listadoGrilla/${idEstado}`, {headers: this.headers});
    }
    obtenerById(id: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/maquinasede/` + id, {headers: this.headers});
    }
    obtenerByNombre(nombre: string): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/maquinasede/nombre/` + nombre, {headers: this.headers});
    }
    obtenerBySede(idSede: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/maquinasede/sede/${idSede}`, {headers: this.headers});
    }
    obtenerByFiltros(nombre: string, idSede: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/maquinasede/${nombre}/${idSede}`, {headers: this.headers});
    }
    guardar(model: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/api/maquinasede`, model, {headers: this.headers});
    }
    actualizar(model: any): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/maquinasede`, model, {headers: this.headers});
    }
    obtenerBySedeByServicio(idUsuario: number, idSede: number, idServicio: number): Observable<MaquinaSede[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/maquinasede/buscar-por-servicio/${idUsuario}/${idSede}/${idServicio}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection:  MaquinaSede[] = [];

          if( res.status === 200 ){
            res.data.forEach(x => {
              const maquina = new MaquinaSede();
              maquina.id = x.id;
              maquina.idEstado = x.idEstado;
              maquina.idFicticio = x.idFicticio;
              maquina.idMaquina = x.idMaquina;
              maquina.maquina = x.maquina;
              maquina.idServicio = x.idServicio;
              maquina.servicio = x.servicio;
              maquina.servicioColor = x.servicioColor;
              maquina.horaInicio = x.horaInicio;
              maquina.horaFin = x.horaFin;
              maquina.descripcion = x.descripcion;
              maquina.idSede = x.idSede;
              maquina.color = x.color;
              maquina.sede = x.sede;
              collection.push(maquina);
            });
          }else{
            throw Error(res.message);
          }

          return collection;
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    obtenerFicticios(idUsuario: number, idSede: number, idServicio: number): Observable<MaquinaSede[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/maquinasede/buscar-ficticios/${idUsuario}/${idSede}/${idServicio}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection:  MaquinaSede[] = [];

          if( res.status === 200 ){
            res.data.forEach(x => {
              const maquina = new MaquinaSede();
              maquina.id = x.id;
              maquina.idEstado = x.idEstado;
              maquina.idFicticio = x.idFicticio;
              maquina.idMaquina = x.idMaquina;
              maquina.maquina = x.maquina;
              maquina.idServicio = x.idServicio;
              maquina.servicio = x.servicio;
              maquina.servicioColor = x.servicioColor;
              maquina.horaInicio = x.horaInicio;
              maquina.horaFin = x.horaFin;
              maquina.descripcion = x.descripcion;
              maquina.idSede = x.idSede;
              maquina.sede = x.sede;
              collection.push(maquina);
            });
          }else{
            throw Error(res.message);
          }

          return collection;
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }
}
