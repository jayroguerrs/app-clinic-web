import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {HistorialEnvioMasivoMensajeCita} from "../models/historial-operaciones";

@Injectable({ providedIn: 'root' })
export class HistorialOperacionesService {
    public user: Observable<HistorialEnvioMasivoMensajeCita>;
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

    listarHistorialEnvioMasivoMensaje(): Observable<HistorialEnvioMasivoMensajeCita[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/historialOperaciones/envio-masivo-mensaje`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: HistorialEnvioMasivoMensajeCita[] = [];
            if(res.status === 200){
              res.data.forEach((item) => {
                const servicio = new HistorialEnvioMasivoMensajeCita();
                servicio.id = item.id;
                servicio.nombreArchivo = item.nombreArchivo;
                servicio.numeroRegistros = item.numeroRegistros;
                servicio.idUsuarioRegistro = item.idUsuarioRegistro;
                servicio.fechaRegistro = new Date(item.fechaRegistro);
                servicio.usuarioRegistro = item.usuarioRegistro;
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

}
