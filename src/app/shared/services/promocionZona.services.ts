import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {PromocionZona} from "../models/promocion";
import {ErrorSistema} from "../models/error-sistema";
@Injectable({ providedIn: 'root' })
export class PromocionZonaService {

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

    obtenerByIdPromocion(idPromocion: number, idGenero?: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/promocionzona/${idPromocion}/${idGenero}`, {headers: this.headers});
    }
    obtenerByIdPromocionByServicio(idServicio: number, idPromocion: number, idGenero?: number): any {
      return this.http.get<any>(`${environment.apiUrl}/api/promocionzona/servicio/${idServicio}/${idPromocion}/${idGenero}`, {headers: this.headers});
    }
    obtenerByZonasCorporales(idsZonasCorporales: string): any {      
        return this.http.get<any>(`${environment.apiUrl}/api/promocionzona/zonasCorporales/${idsZonasCorporales}`, {headers: this.headers});
    }
    actualizarPrecioBase(promocionZona): any {
        return this.http.put(`${environment.apiUrl}/api/promocionzona`, promocionZona, {headers: this.headers});
    }
    deleteById(idPromocionZona): any {
        return this.http.delete<any>(`${environment.apiUrl}/api/promocionzona/${idPromocionZona}`, {headers: this.headers});
    }
    deleteByIds(ids: string): Observable< number[] | ErrorSistema> {
      return this.http.put<any>(`${environment.apiUrl}/api/promocionzona/lista`, {ids: ids} ,{headers: this.headers}).pipe(
        map(res => {
          if(res.status === 200){
            return res.data;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            return error;
          }
        }),catchError(err => {
          return throwError(err);
        })
      );
    }
    guardar(promocionZona): any {
        return this.http.post(`${environment.apiUrl}/api/promocionzona`, promocionZona, {headers: this.headers});
    }


    listarByZona(idZona: number): Observable<PromocionZona[]> {
      // return this.http.get<any>(`${environment.apiUrl}/api/promocionzona/zonasCorporales/${idsZonasCorporales}`, {headers: this.headers});
      return this.http.get<any>(`${environment.apiUrl}/api/promocionzona/zona/${idZona}`, {headers: this.headers}).pipe(
        map((res) => {
          // console.log(res);

          const collection: PromocionZona[] = [];

          if(res.status === 200){
            res.data.forEach( x => {
              const model = new PromocionZona();
              model.id = x.id;
              model.idPromocionPrecio = x.idPromocionPrecio;
              model.idPromocion = x.idPromocion;
              model.promocion = x.promocion;
              model.nombre = `[${x.precioPromocion}] ${x.promocion}`;
              model.idZona = x.idZona;
              model.idGenero = x.idGenero;
              model.precioBase = x.precioBase;
              model.precioPromocion = x.precioPromocion;
              collection.push(model);
            });
          }else{
            throw throwError(res.message);
          }

          return collection;
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }
}
