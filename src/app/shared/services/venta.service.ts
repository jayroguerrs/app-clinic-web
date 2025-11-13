import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from "rxjs/operators";
import {CONFIG} from "../configuracion/config";
import {environment} from "../../../environments/environment";
import {Venta, VentaPotencial, VentaPotencial_Citas} from "../models/venta";
@Injectable({
  providedIn: 'root'
})
export class VentaService {
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


  ObtenerRangoFechaVenta(fechaInicio: string, fechaFin: string, idVenta: number, idGenero: number, numeroSesion: number): Observable<Venta[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/venta/reporte/${fechaInicio}/${fechaFin}/${idVenta}/${idGenero}/${numeroSesion}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: Venta[] = [];

        if(res.status === 200){
          res.data.forEach( x => {

            const venta = new Venta();
            venta.idSede = x.idSede;
            venta.sede = x.sede;
            venta.totalVenta = x.totalVenta;
            venta.fecha = new Date(x.fecha);

            collection.push(venta);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }



  ReportePotencialVenta(fechaInicio: string, fechaFin: string, idSede: number, idServicio: number): Observable<VentaPotencial[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/venta/reporte-potencial-venta/${fechaInicio}/${fechaFin}/${idSede}/${idServicio}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: VentaPotencial[] = [];

        if(res.status === 200){
          res.data.forEach( x => {

            const venta = new VentaPotencial();
            venta.idCliente = x.idCliente;
            venta.cliente = x.cliente;
            venta.sede = x.sede;
            venta.servicio = x.servicio;
            venta.medioContacto = x.medioContacto;
            venta.clienteActivo = x.clienteActivo;
            venta.citas = x.citas.map(c => {
              const model: VentaPotencial_Citas = new VentaPotencial_Citas();
              model.atendidoPor = c.atendidoPor;
              model.total = c.total;
              model.fechaCita = new Date(c.fechaCita)
              return model
            });

            collection.push(venta);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

}
