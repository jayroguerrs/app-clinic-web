import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {catchError, map} from "rxjs/operators";
import {Documento, DocumentoCLiente, DocumentoTipo} from '../models/documento';
import {TiposDocumento} from "../enumeracion/enums";
@Injectable({ providedIn: 'root' })
export class DocumentoService {

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

    obtenerDocumentoTipo(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/documento/tipoDocumento`);
    }

    obtenerDocumentoTipoByPerfil(idPerfil: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/documento/tipoDocumento/perfil/${idPerfil}`);
    }


    obtenerDocumentoPlantilla(idDocumentoTipo: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/documento/plantilla/${idDocumentoTipo}`);
    }

/*  obtenerDocumentoPlantilla(idDocumentoTipo: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/documento/plantilla/${idDocumentoTipo}`).pipe(
            map(response => {
                // Limpiar la respuesta, eliminando las propiedades no deseadas
                console.log("🚀 ~ DocumentoService ~ obtenerDocumentoPlantilla ~ response['plantilla']:", response['plantilla'])
                response['plantilla'] = response['plantilla']
                    .replace(/"font":"calibri,sans-serif",/g, '')
                    .replace(/"bold":.*?,/g, '');
                response['html'] = response['html']
                    .replace(/font-family:Calibri,sans-serif;/g, '');
                return response;
            })
        );
    } */
    

    //getTemplateFile
    async getTemplateFile(idDocumentoTipo: number): Promise<any> {
        const response = await this.http.get<any>(`${environment.apiUrl}/api/documento/plantilla/${idDocumentoTipo}`).toPromise();
        //clean response, replace font-family:Calibri,sans-serif witn '' , replace "font":"calibri,sans-serif" with "font":""
        response['plantilla'] = response['plantilla'].replace(/"font":"calibri,sans-serif",/g, '').replace(/"bold":.*?,/g, '');
        response['html'] = response['html'].replace(/font-family:Calibri,sans-serif;/g, '');
        return response;
    }

    grabarDocumento(clienteDocumento: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/api/documento`, clienteDocumento);
    }

    obtenerListado(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/documento`);
    }



    //////////////////////////////////////////////////
    ////////////////////////////////////////////////////

}
