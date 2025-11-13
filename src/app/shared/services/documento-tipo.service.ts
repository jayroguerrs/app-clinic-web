import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError, tap} from "rxjs/operators";
import {DocumentoTipo, DocumentoTipoPerfil} from "../models/documento";
import {ErrorSistema} from "../models/error-sistema";
import {IUpdateIds} from '../interfaces/updateStatus'
@Injectable({
  providedIn: 'root'
})

export class DocumentoTipoService {

    headers: HttpHeaders;

    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });

    }
    obtenerListado(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/documentoTipo`, {headers: this.headers}).pipe(
          map(response => {

              const documentoTipos : DocumentoTipo[] = [];
              response.forEach( dt => {
                  const perfiles: DocumentoTipoPerfil[] = [];
                  dt.perfiles.forEach( p => {
                      const perfil: DocumentoTipoPerfil = {
                        id :p.id,
                        nombre: p.nombre
                      }
                      perfiles.push(perfil);
                  });

                  const documentoTipo = new DocumentoTipo();
                  documentoTipo.id = dt.id;
                  documentoTipo.nombre = dt.nombre;
                  documentoTipo.titulo = dt.titulo;
                  documentoTipo.perfiles = perfiles;
                  documentoTipo.idServicio = dt.idServicio;
                  documentoTipo.servicio = dt.servicio;
                  documentoTipo.servicioColor = dt.servicioColor;

                  documentoTipo.idUsuarioRegistro = dt.idUsuarioRegistro ? dt.idUsuarioRegistro : null;
                  documentoTipo.usuarioRegistro = dt.usuarioRegistro ? dt.usuarioRegistro : null;
                  documentoTipo.fechaRegistro = dt.fechaRegistro ? new Date(dt.fechaRegistro) : null;
                  documentoTipo.idUsuarioRegistro = dt.idUsuarioRegistro ? dt.idUsuarioRegistro : null;
                  documentoTipo.usuarioModifico = dt.usuarioModifico ? dt.usuarioModifico : null;
                  documentoTipo.fechaModifico = dt.fechaModifico ? new Date(dt.fechaModifico) : null;

                  documentoTipo.blPromocion= dt.blPromocion;
                  documentoTipo.blZona= dt.blZona;
                  documentoTipo.blPatologia= dt.blPatologia;
                  documentoTipo.blApoderado= dt.blApoderado;
                  documentoTipo.blMantenimiento= dt.blMantenimiento;
                  documentoTipo.blRetroceso= dt.blRetroceso;

                  documentoTipo.docStatus = dt.docStatus;


                  documentoTipos.push( documentoTipo );
              });

              return documentoTipos;
          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

    obtenerListadoByServicio(idServicio: number): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/api/documentoTipo/servicio/${idServicio}`, {headers: this.headers}).pipe(
        map(response => {

          const documentoTipos : DocumentoTipo[] = [];
          response.data.forEach( dt => {
            const documentoTipo = new DocumentoTipo();
            documentoTipo.id = dt.id;
            documentoTipo.nombre = dt.nombre;
            documentoTipo.titulo = dt.titulo;
            documentoTipo.idServicio = dt.idServicio;
            documentoTipo.version = dt.version;
            documentoTipo.servicio = dt.servicio;
            documentoTipos.push( documentoTipo );
          });

          return documentoTipos;
        }),
        catchError(err => {
          return throwError(err.message, err.code);
        })
      );
    }

    update( model: DocumentoTipo ): Observable<boolean | ErrorSistema> {
      return this.http.put<any>(`${environment.apiUrl}/api/documentoTipo/`, model, {headers: this.headers})
        .pipe(
          map(res=> {
            if(res.status !== 200 ){
              const error = new ErrorSistema();
              error.status = res.status;
              error.message = res.message;
              return error;
            }else{
              return true;
            }
          }),
          catchError(err => {
            return throwError(err);
          })
        );
    }

    create( model: DocumentoTipo ): Observable<boolean | ErrorSistema> {
      return this.http.post<any>(`${environment.apiUrl}/api/documentoTipo/`, model, {headers: this.headers})
        .pipe(
          map(res=> {
            if(res.status !== 201 ){
              const error = new ErrorSistema();
              error.status = res.status;
              error.message = res.message;
              return error;
            }else{
              return true;
            }
          }),
          catchError(err => {
            return throwError(err);
          })
        );
    }

    find( id: number ): Observable<DocumentoTipo | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/documentoTipo/${id}`, {headers: this.headers})
        .pipe(
          map(res=> {

            // console.log(res);

            if(res.status !== 200 ){
              const error = new ErrorSistema();
              error.status = res.status;
              error.message = res.message;
              return error;
            }else{
              const model = new DocumentoTipo();
              model.id = res.data.id;
              model.nombre = res.data.nombre;
              model.titulo = res.data.titulo;
              model.idServicio = res.data.idServicio;

              model.blPromocion= res.data.blPromocion;
              model.blZona= res.data.blZona;
              model.blPatologia= res.data.blPatologia;
              model.blApoderado= res.data.blApoderado;
              model.blMantenimiento= res.data.blMantenimiento;
              model.blRetroceso= res.data.blRetroceso;

              return model;
            }

          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

    getProfilesById( id: number ): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/api/documentoTipo/${id}/perfiles`, {headers: this.headers})
        .pipe(
          tap(res=> {

              const perfiles: DocumentoTipoPerfil[] = [];
              res.forEach( p => {
                const perfil: DocumentoTipoPerfil = {
                  id :p.id,
                  nombre: p.nombre
                }
                perfiles.push(perfil);
              });

              return perfiles;
          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

    assignProfiles( id:number, profiles: number[] ): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}/api/documentoTipo/${id}/perfiles`, profiles, {headers: this.headers})
        .pipe(
          tap(res=> {
            // console.log(res);
            if(res.exito){
              const perfiles: DocumentoTipoPerfil[] = [];
              const data = res.response;
              data.perfiles.forEach( p => {
                const perfil: DocumentoTipoPerfil = {
                  id :p.id,
                  nombre: p.nombre
                }
                perfiles.push(perfil);
              });

              const documentoTipo = new DocumentoTipo();
                documentoTipo.id = data.id;
                documentoTipo.nombre = data.nombre;
                documentoTipo.titulo = data.titulo;
                documentoTipo.perfiles = perfiles;
                documentoTipo.version = data.version;

              return documentoTipo;
            }else{
              return throwError(res.errorDetalle, res.errorNumero);
            }
          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

    
    updateStatus(value: Array<IUpdateIds>): Observable<any> {
      return this.http.put(`${environment.apiUrl}/api/documentoTipo/update-status`, value, { headers: this.headers });
    }
}
