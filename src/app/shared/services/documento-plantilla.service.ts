import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError, tap} from "rxjs/operators";
import {DocumentoPlantilla, DocumentoTipo, DocumentoTipoPerfil} from "../models/documento";

@Injectable({
  providedIn: 'root'
})

export class DocumentoPlantillaService {

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
        return this.http.get<any>(`${environment.apiUrl}/api/documentoPlantilla`, {headers: this.headers}).pipe(
          map(response => {

              const documentoPlantillas : DocumentoPlantilla[] = [];
              response.forEach( p => {
                  const plantilla = new DocumentoPlantilla();
                  plantilla.id = p.id;
                  plantilla.plantilla = p.plantilla;
                  plantilla.version = p.version;
                  plantilla.estado = !!p.idEstado;
                  plantilla.fechaRegistra = p.fechaRegistra;
                  plantilla.usuarioRegistra = p.usuarioRegistra;
                  plantilla.header = p.imagenCabeceraDocumento;
                  plantilla.footer = p.imagenPieDocumento;
                  plantilla.html = p.html;
                  plantilla.margin = JSON.parse(p.margin);

                  const Documento = new DocumentoTipo();
                  Documento.id = p.documento.id;
                  Documento.nombre = p.documento.nombre;
                  Documento.titulo = '';
                  Documento.perfiles = [];

                  plantilla.documento = Documento;

                  documentoPlantillas.push( plantilla );
              });

              return documentoPlantillas;
          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

    find( id: number ): Observable<DocumentoPlantilla> {
    return this.http.get<any>(`${environment.apiUrl}/api/documentoPlantilla/${id}`, {headers: this.headers})
      .pipe(
        map(res=> {

          if(res.exito){
            const perfiles: DocumentoTipoPerfil[] = [];
            const p = res.response;
            const plantilla = new DocumentoPlantilla();
            plantilla.id = p.id;
            plantilla.plantilla = p.plantilla;
            plantilla.version = p.version;
            plantilla.estado = !!p.idEstado;
            plantilla.fechaRegistra = p.fechaRegistra;
            plantilla.usuarioRegistra = p.usuarioRegistra;
            plantilla.header = p.imagenCabeceraDocumento;
            plantilla.footer = p.imagenPieDocumento;
            plantilla.html = p.html;
            plantilla.margin = JSON.parse(p.margin);

            const Documento = new DocumentoTipo();
            Documento.id = p.documento.id;
            Documento.nombre = p.documento.nombre;
            Documento.titulo = '';
            Documento.perfiles = [];

            plantilla.documento = Documento;
            return plantilla;
          }else{
            throw new Error(res.errorDetalle);
          }

        }),
        catchError(err => {
          return throwError(err.message, err.code);
        })
      );
  }



  create( model: {} ): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/documentoPlantilla/`, model, {headers: this.headers})
      .pipe(
        map(res=> {
          // console.log(res);
          if(res.exito){
            const perfiles: DocumentoTipoPerfil[] = [];
            const p = res.response;
            const plantilla = new DocumentoPlantilla();
            plantilla.id = p.id;
            plantilla.plantilla = p.plantilla;
            plantilla.version = p.version;
            plantilla.estado = !!p.idEstado;
            plantilla.fechaRegistra = p.fechaRegistra;
            plantilla.usuarioRegistra = p.usuarioRegistra;
            plantilla.header = p.imagenCabeceraDocumento;
            plantilla.footer = p.imagenPieDocumento;
            plantilla.html = p.html;
            plantilla.margin = JSON.parse(p.margin);

            const Documento = new DocumentoTipo();
            Documento.id = p.documento.id;
            Documento.nombre = p.documento.nombre;
            Documento.titulo = '';
            Documento.perfiles = [];

            plantilla.documento = Documento;
            return plantilla;
          }else{
            throw Error(res.mensaje);
          }
        }),
        catchError(err => {
          return throwError(err);
        })
      );
  }

  update( model: {} ): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/documentoPlantilla/`, model, {headers: this.headers})
      .pipe(
        map(res=> {
          // console.log(res);
          if(res.exito){
            const perfiles: DocumentoTipoPerfil[] = [];
            const p = res.response;
            const plantilla = new DocumentoPlantilla();
            plantilla.id = p.id;
            plantilla.plantilla = p.plantilla;
            plantilla.version = p.version;
            plantilla.estado = !!p.idEstado;
            plantilla.fechaRegistra = p.fechaRegistra;
            plantilla.usuarioRegistra = p.usuarioRegistra;
            plantilla.header = p.imagenCabeceraDocumento;
            plantilla.footer = p.imagenPieDocumento;
            plantilla.html = p.html;
            plantilla.margin = JSON.parse(p.margin);

            const Documento = new DocumentoTipo();
            Documento.id = p.documento.id;
            Documento.nombre = p.documento.nombre;
            Documento.titulo = '';
            Documento.perfiles = [];

            plantilla.documento = Documento;
            return plantilla;
          }else{
            throw Error(res.mensaje);
          }
        }),
        catchError(err => {
          return throwError(err);
        })
      );
  }

}
