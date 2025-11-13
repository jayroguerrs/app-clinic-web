import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ModulosService {
    maestroModulos = [];
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

        obtenerlistado(): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/Modulos/`, {headers: this.headers});
        }
        obtenerlistadousuario(): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/usuario/`, {headers: this.headers});
        }
        obtenerlistadomodulomenu(idModulo): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/Modulos/detallemodulonombremenu/`+ idModulo, {headers: this.headers});
        }
        obtenerlistadoiomodulos(): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/Modulos/iomodulos/`, {headers: this.headers});
        }
        obtenerlistadoiomodulosid(idModulo): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/Modulos/iomodulosid/`+ idModulo, {headers: this.headers});
        }
        obtenerlistadoiousuarios(): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/Modulos/iousuarios/`, {headers: this.headers});
        }
        obtenerlistadoioperfil(): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/Modulos/ioperfil/`, {headers: this.headers});
        }
        obtenerlistadoiomenu(idModulo): Observable<object[]> {
            return this.http.get<object[]>(`${environment.apiUrl}/api/Modulos/iomenu/`+ idModulo, {headers: this.headers});
        }
}
