import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {PromocionRanking, PromocionZonaRanking} from "../models/promocion";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
@Injectable({ providedIn: 'root' })
export class PromocionService {

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
    obtenerParaModulo(activo: number): Observable<object[]> {
      return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/activo/${activo}/modulo`, {headers: this.headers});
    }
    obtenerParaModuloByServicio(activo: number, idServicio: number): Observable<any[]> {
      return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/activo/${activo}/${idServicio}/modulo`, {headers: this.headers});
    }
    obtener(activo: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/activo/${activo}`, {headers: this.headers});
    }
    updateStatus(value: Array<IUpdateIds>): Observable<any> {
      return this.http.put(`${environment.apiUrl}/api/promocion/update-status`, value, { headers: this.headers });
    }
    obtenerByServicio(activo: number, idServicio: number): Observable<object[]> {
      return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/activo/${activo}/servicio/${idServicio}`, {headers: this.headers});
    }
    obtenerByCategoria(idCategoria: number): Observable<object[]> {
      return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/categoria/${idCategoria}/1`, {headers: this.headers});
    }
    obtenerById(id: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/promocion/${id}`, {headers: this.headers});
    }
    guardar(model): any {
        return this.http.post(`${environment.apiUrl}/api/promocion`, model, {headers: this.headers});
    }
    actualizar(model): any {
        return this.http.put(`${environment.apiUrl}/api/promocion`, model, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/search/${str}`, {headers: this.headers});
    }
    obtenerDetalle(idPromocion: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/vista/${idPromocion}`, {headers: this.headers});
    }
    obtenerPlantilla(idPromocion: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/promocion/plantilla/${idPromocion}`, {headers: this.headers});
    }
    obtenerCondicionado(idPromocion: number): Observable<object> {
        return this.http.get<object>(`${environment.apiUrl}/api/promocion/condicion/${idPromocion}`, {headers: this.headers});
    }

    obtenerRankingAgendado(fechaInicio: string, fechaFin: string, idSede: number, idPromocion: number): Observable<PromocionRanking[]>
    {
      return this.http.get<any>(`${environment.apiUrl}/api/promocion/ranking-agendados/${fechaInicio}/${fechaFin}/${idSede}/${idPromocion}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: PromocionRanking[] = [];
          if(res.status === 200){
            res.data.forEach( d => {
              const promocion = new PromocionRanking();
              //promocion.idPromocion = d.idPromocion;
              promocion.promocion = d.promocion;
              promocion.fechaCita = new Date(d.fechaCita);
              promocion.total = d.total;
              //promocion.numZonas = d.numZonas;
              promocion.idSede = d.idSede;
              promocion.sede = d.sede;
              collection.push( promocion );
            });
          }
          return collection;
        }), catchError((e) => {
          return throwError(e.message, e.code);
        })
      );
    }

    obtenerRankingAtendido(fechaInicio: string, fechaFin: string, idSede: number, idPromocion: number): Observable<PromocionRanking[]>
    {
      return this.http.get<any>(`${environment.apiUrl}/api/promocion/ranking-atendidos/${fechaInicio}/${fechaFin}/${idSede}/${idPromocion}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: PromocionRanking[] = [];
          if(res.status === 200){
            res.data.forEach( d => {
              const promocion = new PromocionRanking();
              //promocion.idPromocion = d.idPromocion;
              promocion.promocion = d.promocion;
              promocion.fechaCita = new Date(d.fechaCita);
              promocion.total = d.total;
              //promocion.numZonas = d.numZonas;
              promocion.idSede = d.idSede;
              promocion.sede = d.sede;
              collection.push( promocion );
            });
          }
          return collection;
        }), catchError((e) => {
          return throwError(e.message, e.code);
        })
      );
    }

    obtenerRankingVendidos(fechaInicio: string, fechaFin: string, idSede: number, idPromocion: number): Observable<PromocionRanking[]>
    {
      return this.http.get<any>(`${environment.apiUrl}/api/promocion/ranking-venta/${fechaInicio}/${fechaFin}/${idSede}/${idPromocion}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: PromocionRanking[] = [];
          if(res.status === 200){
            res.data.forEach( d => {
              const promocion = new PromocionRanking();
              //promocion.idPromocion = d.idPromocion;
              promocion.promocion = d.promocion;
              promocion.fechaCita = new Date(d.fechaCita);
              promocion.total = d.total;
              //promocion.numZonas = d.numZonas;
              promocion.idSede = d.idSede;
              promocion.sede = d.sede;
              collection.push( promocion );
            });
          }
          return collection;
        }), catchError((e) => {
          return throwError(e.message, e.code);
        })
      );
    }


  obtenerTop10Zona(fechaInicio: string, fechaFin: string, idSede: number, idZonaTipo: number, idPromocion: number): Observable<PromocionZonaRanking[]>
  {
    return this.http.get<any>(`${environment.apiUrl}/api/promocion/top10Zonas/${fechaInicio}/${fechaFin}/${idSede}/${idZonaTipo}/${idPromocion}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: PromocionZonaRanking[] = [];
        if(res.status === 200){
          res.data.forEach( d => {
            const promocion = new PromocionZonaRanking();
            promocion.cantidad = d.cantidad;
            promocion.total = d.total;
            promocion.idZona = d.idZona;
            promocion.zona = d.zona;
            collection.push( promocion );
          });
        }
        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }


  obtenerBottom10Zona(fechaInicio: string, fechaFin: string, idSede: number, idZonaTipo: number, idPromocion: number): Observable<PromocionZonaRanking[]>
  {
    return this.http.get<any>(`${environment.apiUrl}/api/promocion/bottom10Zonas/${fechaInicio}/${fechaFin}/${idSede}/${idZonaTipo}/${idPromocion}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: PromocionZonaRanking[] = [];
        if(res.status === 200){
          res.data.forEach( d => {
            const promocion = new PromocionZonaRanking();
            promocion.cantidad = d.cantidad;
            promocion.total = d.total;
            promocion.idZona = d.idZona;
            promocion.zona = d.zona;
            collection.push( promocion );
          });
        }
        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }

  clone(idPromocion: number, idUsuario: number): Observable<boolean | ErrorSistema> {
    return this.http.post<any>(`${environment.apiUrl}/api/promocion/clonar/${idPromocion}/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 201){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.error;
          error.status = res.status;
        }
      }),catchError((err) => {
        return throwError(err);
      })
    );
  }

  obtenerZonasRanking(fechaInicio: string, fechaFin: string, idSede: number, idZonaTipo: number, idPromocion: number): Observable<PromocionZonaRanking[]>
  {
    return this.http.get<any>(`${environment.apiUrl}/api/promocion/zonasRanking/${fechaInicio}/${fechaFin}/${idSede}/${idZonaTipo}/${idPromocion}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: PromocionZonaRanking[] = [];
        if(res.status === 200){
          res.data.forEach( d => {
            const promocion = new PromocionZonaRanking();
            promocion.cantidad = d.cantidad;
            promocion.total = d.total;
            promocion.idZona = d.idZona;
            promocion.zona = d.zona;
            collection.push( promocion );
          });
        }
        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }

}
export interface IUpdateIds {
  id?:     number;
  status?: number;
}
