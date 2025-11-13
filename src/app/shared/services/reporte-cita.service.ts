import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {CronogramaCitasAtendidas, ReporteAtendidasDiarias} from "../models/reportecitas";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReporteCitaService {

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

  cronogramaCitasAtendidas(idSede: number, fechaDesde: string, fechaHasta: string): Observable<CronogramaCitasAtendidas[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/reporteCita/cronograma-citas-atendidas/${idSede}/${fechaDesde}/${fechaHasta}`, {headers: this.headers}).pipe(
      map((res: any) => {
        const collection: CronogramaCitasAtendidas[] = [];

        res.data.forEach( x => {

          const model = new CronogramaCitasAtendidas();
          model.sede = x.sede;
          model.fecha = new Date(x.fecha);
          model.h8 = x.h8;
          model.h9 = x.h9;
          model.h10 = x.h10;
          model.h11 = x.h11;
          model.h12 = x.h12;
          model.h13 = x.h13;
          model.h14 = x.h14;
          model.h15 = x.h15;
          model.h16 = x.h16;
          model.h17 = x.h17;
          model.h18 = x.h18;
          model.h19 = x.h19;
          model.h20 = x.h20;
          model.h21 = x.h21;

          collection.push(model);
        });

        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }


  reporteAtendidasDiarias(fecha: string, idSede: number, idServicio: number): Observable<ReporteAtendidasDiarias[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/reporteCita/atendidos-diarios/${fecha}/${idSede}/${idServicio}`, {headers: this.headers}).pipe(
      map((res: any) => {
        const collection: ReporteAtendidasDiarias[] = [];

        res.data.forEach( x => {

          const model = new ReporteAtendidasDiarias();
          model.idCronograma = x.idCronograma
          model.idCita = x.idCita;
          model.tipoCita = x.tipoCita;
          model.fecha = x.fecha;
          model.idServicio = x.idServicio;
          model.servicio = x.servicio;
          model.idMaquinaMarca = x.idMaquinaMarca;
          model.maquinaMarca = x.maquinaMarca;
          model.numeroBox = x.numeroBox;
          model.idCliente = x.idCliente;
          model.cliente = x.cliente;
          model.sesion = x.sesion;
          model.zonaClienteAntiguo = x.zonaClienteAntiguo;
          model.zonaNuevaCliente = x.zonaNuevaCliente;
          model.zonaClienteNuevo = x.zonaClienteNuevo;
          model.precio = x.precio;
          model.promocion = x.promocion;
          model.medioContactoOrigen = x.medioContactoOrigen;
          model.usuarioAgendo = x.usuarioAgendo;
          model.atendidoPor = x.atendidoPor;
          model.sede = x.sede;

          collection.push(model);
        });

        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }

}
