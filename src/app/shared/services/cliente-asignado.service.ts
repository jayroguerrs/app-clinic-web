import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { CONFIG } from '../configuracion/config';
import {catchError, map} from "rxjs/operators";
import {ClienteAsignado, ClienteAsignadoHistorial} from "../models/cliente";
import {ErrorSistema} from "../models/error-sistema";

@Injectable({
  providedIn: 'root'
})
export class ClienteAsignadoService {
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

  obtener(tipoCliente:number, idSede: number, fechaCita: string, asignado: number): Observable<ClienteAsignado[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cliente-asignado/${tipoCliente}/${idSede}/${fechaCita}/${asignado}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection : ClienteAsignado[] = [];

        if(res.status === 200){
          res.data.forEach((x) => {
            const item = new ClienteAsignado();
            item.id = x.id;
            item.idCliente = x.idCliente;
            item.nombres = x.nombres;
            item.apellidos = x.apellidos;
            item.tipoCliente = x.tipoCliente;
            item.fechaCita = new Date(x.fechaCita);

            collection.push(item);
          });
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;

          return error;
        }

        return collection;
      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }

  asignarLista( clientes: any ): Observable<any>{
      return this.http.post<any>(`${environment.apiUrl}/api/cliente-asignado`, clientes, {headers: this.headers});
  }

  reasignarLista( clientes: any ): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/api/cliente-asignado/reasignar`, clientes, {headers: this.headers});
  }

  obtenerAsignados(fechaConfirmacion: string, tipoCliente: number, idTipo: number, idSede: number, asignadoA: number, asignadoPor: number): Observable<ClienteAsignado[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cliente-asignado/asignados/${fechaConfirmacion}/${tipoCliente}/${idTipo}/${idSede}/${asignadoA}/${asignadoPor}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection : ClienteAsignado[] = [];

        if(res.status === 200){
          res.data.forEach((x) => {
            const item = new ClienteAsignado();
            item.id = x.id;
            item.idCliente = x.idCliente;
            item.nombres = x.nombres;
            item.apellidos = x.apellidos;
            item.fechaCita = new Date(x.fechaCita);
            item.telefono = x.telefono;
            item.usuarioOperador = x.usuOperador;
            item.usuarioOperadorNombre = x.usuOperadorNombre;
            item.tipo = x.tipo;
            item.usuarioRegistro = x.usuRegistro;
            item.usuarioRegistroNombre = x.usuRegistroNombre;
            item.idEstado = x.idEstado;
            item.estado = x.estado;
            item.estadoColor = x.estadoColor;
            item.tipoCliente = x.tipoCliente;
            item.sede = x.sede;
            item.idEstadoCliente = x.idEstadoCliente;
            item.estadoCliente = x.estadoCliente;
            item.estadoClienteColor = x.estadoClienteColor;

            collection.push(item);
          });
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;

          return error;
        }

        return collection;
      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }

  obtenerParaReasignados(fechaConfirmacion: string, tipoCliente: number, idTipo: number, idSede: number, asignadoA: number, asignadoPor: number): Observable<ClienteAsignado[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cliente-asignado/para-reasignados/${fechaConfirmacion}/${tipoCliente}/${idTipo}/${idSede}/${asignadoA}/${asignadoPor}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection : ClienteAsignado[] = [];

        if(res.status === 200){
          res.data.forEach((x) => {
            const item = new ClienteAsignado();
            item.id = x.id;
            item.idCliente = x.idCliente;
            item.nombres = x.nombres;
            item.apellidos = x.apellidos;
            item.fechaCita = new Date(x.fechaCita);
            item.telefono = x.telefono;
            item.usuarioOperador = x.usuOperador;
            item.usuarioOperadorNombre = x.usuOperadorNombre;
            item.tipo = x.tipo;
            item.usuarioRegistro = x.usuRegistro;
            item.usuarioRegistroNombre = x.usuRegistroNombre;
            item.idEstado = x.idEstado;
            item.estado = x.estado;
            item.estadoColor = x.estadoColor;
            item.tipoCliente = x.tipoCliente;
            item.sede = x.sede;
            item.idEstadoCliente = x.idEstadoCliente;
            item.estadoCliente = x.estadoCliente;
            item.estadoClienteColor = x.estadoClienteColor;

            collection.push(item);
          });
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;

          return error;
        }

        return collection;
      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }


  obtenerAsignadosUsuario(fechaConfirmacion: string,  asignadoA: number): Observable<ClienteAsignado[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cliente-asignado/asignados-usuario/${fechaConfirmacion}/${asignadoA}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection : ClienteAsignado[] = [];

        if(res.status === 200){
          res.data.forEach((x) => {
            const item = new ClienteAsignado();
            item.id = x.id;
            item.idCliente = x.idCliente;
            item.nombres = x.nombres;
            item.apellidos = x.apellidos;
            item.fechaCita = new Date(x.fechaCita);
            item.telefono = x.telefono;
            item.usuarioOperador = x.usuOperador;
            item.usuarioOperadorNombre = x.usuOperadorNombre;
            item.tipo = x.tipo;
            item.usuarioRegistro = x.usuRegistro;
            item.usuarioRegistroNombre = x.usuRegistroNombre;
            item.idEstado = x.idEstado;
            item.estado = x.estado;
            item.estadoColor = x.estadoColor;
            item.tipoCliente = x.tipoCliente;
            item.sede = x.sede;
            item.idEstadoCliente = x.idEstadoCliente;
            item.estadoCliente = x.estadoCliente;
            item.estadoClienteColor = x.estadoClienteColor;

            collection.push(item);
          });
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;

          return error;
        }

        return collection;
      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }

  trabajarAsignado( model: any ): Observable<boolean | ErrorSistema>{
    return this.http.post<any>(`${environment.apiUrl}/api/cliente-asignado/trabajar`, model, {headers: this.headers}).pipe(
      map((res) => {

        if(res.status === 200){
          return res.data;
        }else{
          const error = new ErrorSistema();
          error.message = res.error;
          error.status = res.status;

          return error;
        }

      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }

  marcarVisto(clienteAsignados): Observable<boolean | ErrorSistema> {

    return this.http.post<any>(`${environment.apiUrl}/api/cliente-asignado/marcar-visto`, clienteAsignados, {headers: this.headers}).pipe(
      map((res) => {

        if(res.status === 200){
          return res.data;
        }else{
          const error = new ErrorSistema();
          error.message = res.error;
          error.status = res.status;

          return error;
        }

      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }


  obtenerHistorial(idClientAsignado: number): Observable<ClienteAsignadoHistorial[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cliente-asignado/historial/${idClientAsignado}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection : ClienteAsignadoHistorial[] = [];

        if(res.status === 200){
          res.data.forEach((x) => {
            const item = new ClienteAsignadoHistorial();
            item.id = x.id;
            item.idClientAsignado = x.idClientAsignado;
            item.asignadoA = x.asignadoA;
            item.asignadoPor = x.asignadoPor;
            item.fechaRegistro = new Date(x.fechaRegistro);

            collection.push(item);
          });
        }else{
          const error = new ErrorSistema();
          error.message = res.error;
          error.status = res.status;

          return error;
        }

        return collection;
      }), catchError((err:any) => {
        return throwError(err);
      })
    );
  }

}
