import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Preferente } from 'src/app/componentes/preferente/preferente.models';
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {PreferenteHistoria} from "../models/preferente.model";

@Injectable({
  providedIn: 'root'
})
export class PreferenteService {
  url: string;
  versionapi: string;
  private headers: HttpHeaders;

  pendientesActuales: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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

  guardar(preferenteAsignadoLista): any {
    return this.http.post(`${environment.apiUrl}/api/preferente`, preferenteAsignadoLista, {headers: this.headers});
  }
  
  preferenteObtenerTodos(): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/preferente`, {headers: this.headers});
  }

  preferenteObtenerPorFiltros(filtros: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/${filtros.desde}/${filtros.hasta}/${filtros.estado}/${filtros.teleoperador}/${filtros.medioContacto}/${filtros.usuarioId}/${filtros.estadoAtencion}/${filtros.esCliente}`, {headers: this.headers});
  }

  preferenteMobileObtener(){
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/mobilePreferentes`, {headers: this.headers});
  }

  actualizarEstadoPrefMobile(idCita: number, estadoId: number){
    return this.http.patch<any>(`${environment.apiUrl}/api/preferente/estadoMobilePreferentes/${idCita}/${estadoId}`, {headers: this.headers});
  }

  preferenteConTelefonoObtenerPorFiltros(filtros: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/telefono/${filtros.desde}/${filtros.hasta}/${filtros.estado}/${filtros.teleoperador}/${filtros.medioContacto}/${filtros.usuarioId}/${filtros.estadoAtencion}/${filtros.esCliente}`, {headers: this.headers});
  }

  exportarReportePreferente(filtros:any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/reporte/${filtros.desde}/${filtros.hasta}/${filtros.estado}/${filtros.teleoperador}/${filtros.medioContacto}/${filtros.usuarioId}/${filtros.estadoAtencion}/${filtros.esCliente}`, {headers: this.headers});
  }

  preferenteGrabar(preferente: Preferente): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/preferente`, preferente, {headers: this.headers});
  }
  preferenteObtenerPorId(id: number, idUsuarioSistema: number): Observable<Preferente> {
    return this.http.get<Preferente>(`${environment.apiUrl}/api/preferente/${id}/${idUsuarioSistema}`, {headers: this.headers});
  }
  preferenteModificar(preferente: Preferente): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/preferente`, preferente, {headers: this.headers});
  }
  preferenteAsignar(preferente: Preferente): Observable<object[]> {
    return this.http.put<object[]>(`${environment.apiUrl}/api/preferente/asignar`, preferente, {headers: this.headers});
  }
  preferenteAtendido(preferente: Preferente): Observable<any> {
    return this.http.put<object[]>(`${environment.apiUrl}/api/preferente/atendido`, preferente, {headers: this.headers});
  }
  preferenteAtendidoNew(param: any): Observable<any> {
    return this.http.put<object[]>(`${environment.apiUrl}/api/preferente/atendido`, param, {headers: this.headers});
  }
  actualizaEstadoVisto(preferenteIds): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/preferente/actualizaEstadoVisto`, preferenteIds, {headers: this.headers});
  }
  importarPreferentes( preferentes: Preferente ): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/api/preferente/importarExcel`, preferentes, {headers: this.headers});
  }
  asignarLista( preferentes: any ): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/api/preferente/asignarLista`, preferentes, {headers: this.headers});
  }

  obtenerTotalAsignados( idUsuario: string, fecha: string ): Observable<number>{
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/numeroAsignados/${idUsuario}/${fecha}`, {headers: this.headers}).
      pipe(
        map((res) => {
          if(res.status === 200){
            return res.data;
          }
          return 0
        }),catchError((res) => {
        throw Error(res);
      })
    );
  }

  atendiendoPreferente(idPreferente: number, termino: number): Observable<boolean | ErrorSistema>{
    return this.http.put<any>(`${environment.apiUrl}/api/preferente/atendiendo/${idPreferente}/${termino}`, {},{headers: this.headers}).
    pipe(
      map((res) => {

        if(res.status === 200){

          return true;

        }else{
          const aviso = new ErrorSistema();
          aviso.message = res.message;
          aviso.status = res.status;
          return aviso;

        }

      }),catchError((res) => {
        throw Error(res);
      })
    );
  }

  obtenerPendientesActuales(): Observable<number>{
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/pendientes-actuales`, {headers: this.headers}).
    pipe(
      map((res) => {
        if(res.status === 200){
          return res.data;
        }
        return 0
      }),catchError((res) => {
        throw Error(res);
      })
    );
  }

  obtenerHistorial(idPreferente: number): Observable<PreferenteHistoria[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/${idPreferente}/historia`, {headers: this.headers}).
    pipe(
      map((res) => {
        if(res.status === 200){
          const collection:  PreferenteHistoria[] = [];

          res.data.forEach(d => {
            const historia = new PreferenteHistoria();
            historia.id = d.id;
            historia.idPreferente = d.idPreferente;
            historia.asignadoA = d.asignadoA;
            historia.asignadoPor = d.asignadoPor;
            historia.fechaRegistro = new Date(d.fechaRegistro);

            collection.push(historia);
          });

          return collection;
        }else{
          throw  Error("Ocurrio un error");
        }
      }),catchError((res) => {
        throw Error(res);
      })
    );
  }

  preferenteReasignar(model: any): Observable<boolean | ErrorSistema>{
    return this.http.put<any>(`${environment.apiUrl}/api/preferente/reasignar`, model,{headers: this.headers}).
    pipe(
      map((res) => {

        if(res.status === 200){

          return true;

        }else{
          const aviso = new ErrorSistema();
          aviso.message = res.message;
          aviso.status = res.status;
          return aviso;

        }

      }),catchError((res) => {
        throw Error(res);
      })
    );
  }

  preferenteObtenerPorUsuarioFacebook(usuarioFacebook: string): Observable<Preferente | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/facebook/${usuarioFacebook}`, {headers: this.headers}).pipe(
      map((res: any) => {
         if(res.status === 200){
           return res.data;
         }else{
           const error = new ErrorSistema();
           error.message = res.error;
           return error;
         }
      }),catchError((res) => {
        throw Error(res);
      })
    );
  }

  preferenteObtenerPorUsuarioInstagram(usuarioInstagram: string): Observable<Preferente | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/instagram/${usuarioInstagram}`, {headers: this.headers}).pipe(
      map((res: any) => {
        if(res.status === 200){
          return res.data;
        }else{
          const error = new ErrorSistema();
          error.message = res.error;
          return error;
        }
      }),catchError((res) => {
        throw Error(res);
      })
    );
  }


  buscarPreferente(filtros: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/preferente/buscar`, filtros, {headers: this.headers});
  }


  // D LAND
  exportarPreferenteVentas(idUsuario: number, fechaDesde: string, fechaHasta: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/preferente/exportar/${idUsuario}/${fechaDesde}/${fechaHasta}`, {headers: this.headers}).pipe(
      map((res: any) => {
        if (res.status === 'Success') {
          return res.result;
        } else {
          throw new Error(res.errors[0].message);
        }
      }),catchError(error => {
        return throwError(() => new Error(error.message || 'Error desconocido'));
      })
    );
  }  
}
