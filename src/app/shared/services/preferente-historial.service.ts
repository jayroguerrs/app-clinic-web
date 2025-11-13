import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import {catchError, map} from "rxjs/operators";
import {PreferenteHistorial} from "../models/preferente.model";

@Injectable({
  providedIn: 'root'
})
export class PreferenteHistorialService {
  url: string;
  versionapi: string;
  private headers: HttpHeaders;


  constructor(
    private http: HttpClient
  ) {
    this.url = CONFIG.url;
    this.versionapi = CONFIG.versionApi;
    this.headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    });
  }


  obtenerHistorial(idPreferenteHistorial: number): Observable<PreferenteHistorial[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/preferente-historial/${idPreferenteHistorial}`, {headers: this.headers}).
    pipe(
      map((res) => {
        if(res.status === 200){
          const collection:  PreferenteHistorial[] = [];

          res.data.forEach(d => {
            const model = new PreferenteHistorial();
            model.id = d.id;
            model.idPreferente = d.idPreferente;
            model.idEstado = d.idEstado;
            model.idUsuarioRegistro = d.idUsuarioRegistro;
            model.idTeleoperador = d.idTeleoperador;
            model.fechaRegistro = new Date(d.fechaRegistro);
            model.observacion = d.observacion;

            //
            model.estado = d.estado;
            model.estadoAtencion = d.estadoAtencion;
            model.comentarioAtencion = d.comentarioAtencion;
            model.usuarioRegistro = d.usuarioRegistro;
            model.teleoperador = d.teleoperador;
            model.datosModificados = d.datosModificados;


            collection.push(model);
          });

          return collection;
        }else{
          throw  Error("Ocurrio un error");
        }
      }),catchError((res) => {
        throw Error(res);
      })
    );
  }

}
