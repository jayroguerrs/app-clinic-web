import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {PreferenteReporteMedioContacto, PreferenteReporteTotal} from "../models/preferente.model";

@Injectable({
  providedIn: 'root'
})
export class ReportePreferenteService {

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

  reporteMedioContacto(fechaDesde: string, fechaHasta: string, idMedioContacto: number): Observable<PreferenteReporteMedioContacto[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/reportePreferente/mediocontacto/${fechaDesde}/${fechaHasta}/${idMedioContacto}`, {headers: this.headers}).pipe(
      map((res: any) => {
        const collection: PreferenteReporteMedioContacto[] = [];

        res.data.forEach( x => {
          const model = new PreferenteReporteMedioContacto();
          model.fecha = new Date(x.fecha);
          model.totalPreferentes = x.totalPreferentes;
          model.totalAsignados = x.totalAsignados;
          model.totalAgendados = x.totalAgendados;
          model.totalEfectivos = x.totalEfectivos;
          model.totalEfectivosNuevos = x.totalEfectivosNuevos;
          model.totalEfectivosAntiguos = x.totalEfectivosAntiguos;
          model.idMedioContacto = x.idMedioContacto;
          model.medioContacto = x.medioContacto;
          collection.push(model);
        });

        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }


  reporteTotal(fecha: string): Observable<PreferenteReporteTotal>{
    return this.http.get<any>(`${environment.apiUrl}/api/reportePreferente/reporteTotal/${fecha}`, {headers: this.headers}).pipe(
      map((res: any) => {
        if(res.status === 200){

          const x = res.data;
          const model = new PreferenteReporteTotal();
          model.totalPreferentes = x.totalPreferentes;
          model.totalAsignados = x.totalAsignados;
          model.totalAgendados = x.totalAgendados;
          model.totalEfectivos = x.totalEfectivos;
          model.totalEfectivosNuevos = x.totalEfectivosNuevos;
          model.totalEfectivosAntiguos = x.totalEfectivosAntiguos;

          return model;
        }else{
          throw  throwError(res.message);
        }
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }

}
