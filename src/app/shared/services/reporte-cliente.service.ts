import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {ReporteClienteCumpleanio} from "../models/reporte-cliente";

@Injectable({
  providedIn: 'root'
})
export class ReporteClienteService {

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

  reporteClienteCumpleanio(fechaDesde: string, fechaHasta: string, idEstadoAtendido: number): Observable<ReporteClienteCumpleanio[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/reporteCliente/cumpleanio/${fechaDesde}/${fechaHasta}/${idEstadoAtendido}`, {headers: this.headers}).pipe(
      map((res: any) => {
        const collection: ReporteClienteCumpleanio[] = [];

        res.data.forEach( x => {
          const model = new ReporteClienteCumpleanio();
          model.idCliente = x.idCliente;
          model.nombre = x.nombre;
          model.edad = x.edad;
          model.ultimaCita = x.ultimaCita ? new Date(x.ultimaCita) : null;
          model.ultimaCitaColor = x.ultimaCitaColor;
          model.idUltimaCita = x.idUltimaCita;
          model.proximaCita = x.proximaCita ? new Date(x.proximaCita) : null;
          model.proximaCitaColor = x.proximaCitaColor;
          model.idProximaCita = x.idProximaCita;
          collection.push(model);
        });

        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }

}
