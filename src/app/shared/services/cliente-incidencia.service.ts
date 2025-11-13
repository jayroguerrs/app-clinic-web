import { Injectable } from '@angular/core';
import { CONFIG } from '../configuracion/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClienteClass } from '../models/cliente';
import {ClienteIncidencia} from "../models/cliente-incidencia";
import {catchError, map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class ClienteIncidenciaService {
    url: string;
    versionapi: string;
    public user: Observable<ClienteClass>;
    headers: HttpHeaders;

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

    collection(idSede: number, fechaDesde: string, fechaHasta: string): Observable<ClienteIncidencia[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/clienteIncidencia/${idSede}/${fechaDesde}/${fechaHasta}`,{headers:this.headers}).pipe(
          map((res) => {
            const collection: ClienteIncidencia[] = [];

            if(res.status === 200){

              res.data.forEach(res => {
                const item = new ClienteIncidencia();
                item.id = res.id;
                item.idCliente = res.idCliente;
                item.cliente = res.cliente;
                item.idCita = res.idCita;
                item.sede = res.sede;
                item.descripcion = res.descripcion;
                item.idUsuarioRegistro = res.idUsuarioRegistro;
                item.idUsuarioModifico = res.idUsuarioModifico;
                item.usuarioRegistro = res.usuarioRegistro;
                item.usuarioModifico = res.usuarioModifico;
                item.fechaRegistro = new Date(res.fechaRegistro);
                item.fechaModifico = res.fechaModifico ? new Date(res.fechaModifico) : null;
                collection.push(item);
              });

            }

            return collection;
          }),catchError((err) => {
            return throwError(err);
          })
        )
    }

  collectionByClient(idCliente: number): Observable<ClienteIncidencia[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/clienteIncidencia/cliente/${idCliente}`,{headers:this.headers}).pipe(
      map((res) => {
        const collection: ClienteIncidencia[] = [];

        if(res.status === 200){

          res.data.forEach(res => {
            const item = new ClienteIncidencia();
            item.id = res.id;
            item.idCliente = res.idCliente;
            item.cliente = res.cliente;
            item.idCita = res.idCita;
            item.sede = res.sede;
            item.descripcion = res.descripcion;
            item.idUsuarioRegistro = res.idUsuarioRegistro;
            item.idUsuarioModifico = res.idUsuarioModifico;
            item.usuarioRegistro = res.usuarioRegistro;
            item.usuarioModifico = res.usuarioModifico;
            item.fechaRegistro = new Date(res.fechaRegistro);
            item.fechaModifico = res.fechaModifico ? new Date(res.fechaModifico) : null;
            collection.push(item);
          });

        }

        return collection;
      }),catchError((err) => {
        return throwError(err);
      })
    )
  }

    create(model: ClienteIncidencia): Observable<boolean> {
      return this.http.post<any>(`${environment.apiUrl}/api/clienteIncidencia`,model,{headers:this.headers}).pipe(
        map((res) => {

          if (res.status === 200){
            return true;
          }

          throw throwError(res.message);
        }),catchError((err) => {
          return throwError(err);
        })
      )
    }

}
