import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { CONFIG } from '../configuracion/config';
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CitaAsignadaService {
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

  guardar(citaAsignadaLista): any {
    return this.http.post(`${environment.apiUrl}/api/citaAsignada`, citaAsignadaLista, {headers: this.headers});
  }
  obtener(fecha, sinAsignar, idSede: number, tipoCliente): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/${fecha}/${sinAsignar}/${idSede}/${tipoCliente}`, {headers: this.headers})
  }
  obtenerCitasPasadas(idSede: number, fechaInicial: string, fechaFinal: string, sinAsignar, idEstdo: number, idTipoCliente: number, idMotivo: number): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/citas-pasadas/${idSede}/${fechaInicial}/${fechaFinal}/${sinAsignar}/${idEstdo}/${idTipoCliente}/${idMotivo}`, {headers: this.headers})
  }
  obtenerReasignado(fechaCita, idUsuarioReasignacion): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/reasignado/${fechaCita}/${idUsuarioReasignacion}`, {headers: this.headers})
  }
  obtenerReasignadoByIdUsuario(idModo, fechaConfirmacion, idUsuarioReasignacion): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/reasignadoByIdUsuario/${idModo}/${fechaConfirmacion}/${idUsuarioReasignacion}`, {headers: this.headers})
  }
  obtenerListado(fechaConfirmar, sinAsignar, asignadoA, tipoSiguiente, asignadoPor, idSede, idUsuario, tipoCliente): Observable<object[]> {
    console.log(tipoCliente);
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/lista/${fechaConfirmar}/${sinAsignar}/${asignadoA}/${tipoSiguiente}/${asignadoPor}/${idSede}/${idUsuario}/${tipoCliente}`, {headers: this.headers});
  }
  obtenerListadoReporte(fechaDesde, fechaHasta, sinAsignar, asignadoA, tipoSiguiente, asignadoPor, idSede, idUsuario): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/reporte/${fechaDesde}/${fechaHasta}/${sinAsignar}/${asignadoA}/${tipoSiguiente}/${asignadoPor}/${idSede}/${idUsuario}`, {headers: this.headers});
  }
  marcarVisto(citaAsignada): any {
    return this.http.put(`${environment.apiUrl}/api/citaAsignada/marcarVisto`, citaAsignada, {headers: this.headers});
  }
  obtenerAbandonados(fecha, sinAsignar): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/abandonadas/${fecha}/${sinAsignar}`, {headers: this.headers})
  }
  obtenerAbandonadosEnEspera(fecha: string): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/abandonadas/en-espera/${fecha}`, {headers: this.headers})
  }
  obtenerListadoAbadonados(fechaConfirmar, sinAsignar, asignadoA, asignadoPor, idUsuario): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/abandonadas/lista/${fechaConfirmar}/${sinAsignar}/${asignadoA}/${asignadoPor}/${idUsuario}`, {headers: this.headers});
  }
  obtenerAbandonadosReasignadoByIdUsuario(idModo, fechaConfirmacion, idUsuarioReasignacion): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/citaAsignada/abandonadas/reasignadoByIdUsuario/${idModo}/${fechaConfirmacion}/${idUsuarioReasignacion}`, {headers: this.headers})
  }
  guardarAbandonados(citaAsignadaLista): any {
    return this.http.post(`${environment.apiUrl}/api/citaAsignada/abandonadas`, citaAsignadaLista, {headers: this.headers});
  }

  cambiarFechaAsignacion(citaAsignada): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/api/citaAsignada/cambiarFecha`, citaAsignada, {headers: this.headers}).pipe(
      map((res: any) => {
        if(res.status === 200){
          return true;
        }
        throw throwError(res.message);
      }),catchError((err) => {
        return throwError(err);
      })
    );
  }

  asignarAbandonadosEnEspera(citaAsignadaLista): any {
    return this.http.post(`${environment.apiUrl}/api/citaAsignada/abandonadas/en-espera`, citaAsignadaLista, {headers: this.headers});
  }

}
