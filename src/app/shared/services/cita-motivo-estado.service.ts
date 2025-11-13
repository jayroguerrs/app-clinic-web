import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {RCitaMotivoEstado, RCitaMotivoGeneral} from "../interfaces/Response/cita-motivo-estado";
import {CitaMotivoEstado} from "../models/cita-motivo-estado";

@Injectable({ providedIn: 'root' })

export class CitaMotivoEstadoService {

    headers: HttpHeaders;
    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
        'Content-Type': 'application/json'
      });
    }



    collection(): Observable<RCitaMotivoEstado[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/citaEstadoMotivo`,{headers: this.headers})
          .pipe(
            map((res: any ) => {
              if(res.status === 200){
                const collection: RCitaMotivoEstado[] = [];
                res.forEach((el) => {
                  const motivoEstado: RCitaMotivoEstado = {
                    id: el.id,
                    idCita: el.idCita,
                    idMotivo: el.idMotivo,
                    fechaRegistro: el.fechaRegistro ? new Date(el.fechaRegistro) : null,
                    usuarioRegistro: el.usuarioRegistro,
                    fechaModifico: el.fechaModifico ? new Date(el.fechaModifico) : null,
                    usuarioModifico: el.usuarioModifico ? el.usuarioModifico : null
                  }
                  collection.push(motivoEstado);
                });

                return collection;
              }else{
                throw throwError(res.status, res.mensaje);
              }

            }),catchError(err => {
              return throwError(err);
            })
          );
    }

    create( citaMotivoEstado: CitaMotivoEstado ): Observable<RCitaMotivoEstado> {
      return this.http.post<any>(`${environment.apiUrl}/api/citaEstadoMotivo`, citaMotivoEstado ,{headers: this.headers})
        .pipe(
          map((res) => {
            if(res.status == 200){
                const el = res.data;
                const motivoEstado: RCitaMotivoEstado = {
                  id: el.id,
                  idCita: el.idCita,
                  idMotivo: el.idMotivo,
                  fechaRegistro: el.fechaRegistro ? new Date(el.fechaRegistro) : null,
                  usuarioRegistro: el.usuarioRegistro,
                  fechaModifico: el.fechaModifico ? new Date(el.fechaModifico) : null,
                  usuarioModifico: el.usuarioModifico ? el.usuarioModifico : null
                }
                return motivoEstado;
            }else{
              throw throwError(res.status, res.mensaje);
            }
          }),catchError(err => {
            return throwError(err);
          })
        );
    }

    reporteGeneral( idSede: number, fechaDesde: Date, fechaHasta: Date, idCitaEstado: number ): Observable<RCitaMotivoGeneral[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaEstadoMotivo/reporteGeneral/${idSede}/${fechaDesde}/${fechaHasta}/${idCitaEstado}`,{headers: this.headers})
        .pipe(
          map((res: any ) => {
            if(res.status === 200){
              const collection: RCitaMotivoGeneral[] = [];
              res.data.forEach((el) => {
                const output: RCitaMotivoGeneral = {
                  idCita: el.idCita,
                  cliente: el.cliente,
                  idCliente: el.idCliente,
                  //sede: el.sede,
                  idSede: el.idSede,
                  genero: el.genero,
                  estado: el.estado,
                  idEstado: el.idEstado,
                  estadoColor: el.estadoColor,
                  motivo: el.motivo,
                  fechaRegistro: el.fechaRegistro ? new Date(el.fechaRegistro) : null,
                  usuarioRegistro: el.usuarioRegistro
                }
                collection.push(output);
              });

              return collection;
            }else{
              throw throwError(res.status, res.mensaje);
            }

          }),catchError(err => {
            return throwError(err);
          })
        );
    }
}
