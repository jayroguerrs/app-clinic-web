import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Caja } from '../models/caja';

@Injectable({ providedIn: 'root' })
export class CajaService {
    public user: Observable<Caja>;
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

    obtener(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/caja`, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/caja/search/${str}`, {headers: this.headers});
    }
    obtenerByIdCaja(id): any {
        return this.http.get<any>(`${environment.apiUrl}/api/caja/${id}`, {headers: this.headers});
    }
    guardar(caja): any {
        return this.http.post(`${environment.apiUrl}/api/caja`, caja, {headers: this.headers});
    }
    actualizar(caja): any {
        return this.http.put(`${environment.apiUrl}/api/caja`, caja, {headers: this.headers});
    }
    abrirCerrar(caja): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/caja/abrirCerrar`, caja, {headers: this.headers});
    }
    consultarAperturaCaja(idSede): any {
        return this.http.get<any>(`${environment.apiUrl}/api/caja/consultarAperturaCaja/${idSede}`, {headers: this.headers});
    }
    obtenerCuadreCaja(fecha, idCaja,idUsuario: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/caja/cuadre/${fecha}/${idCaja}/${idUsuario}`, {headers: this.headers});
    }
    verificarEstadoCaja(idCaja: number, fecha): any {
        return this.http.get<any>(`${environment.apiUrl}/api/caja/verificaEstado/${fecha}/${idCaja}`, {headers: this.headers});
    }
    obtenerSeguimientoDiario(fecha, idUsuario: number): any {
      return this.http.get<any>(`${environment.apiUrl}/api/caja/seguimiento-diario/${fecha}/${idUsuario}`, {headers: this.headers});
    }
    insPos(param: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/api/caja/insertar-reg-pos`, param, {headers: this.headers});
    }
    selTipRepo(): any {
        return this.http.get<any>(`${environment.apiUrl}/api/caja/tipo-reporte`, {headers: this.headers});
      }
    updFilePos(param:any,file: File): Observable<any> {             
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('IdSede', param.IdSede.toString());
        formData.append('IdUser', param.IdUser.toString());
        formData.append('TipRep', param.TipRep.toString());
        return this.http.post<any>(`${environment.apiUrl}/api/caja/upload`, formData);
    }
}
