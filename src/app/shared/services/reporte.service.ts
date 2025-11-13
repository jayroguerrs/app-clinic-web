import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import {catchError, map} from "rxjs/operators";
import {PromocionRanking} from "../models/promocion";
import {CitaEspecialista, especialistaCitas, reportecitas} from "../models/reportecitas";

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

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

  obtenerRptEvolucionCita(fecha: Date, idSede: number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/api/evolucioncitamensual/${fecha}/${idSede}`, {headers: this.headers});
  }

  obtenerEspecialistasCitasAtendidas(fechaDesde: string, fechaHasta: string, idSede: number, idUsuarioAtendio): Observable<especialistaCitas[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/reporteCita/especialista/atendidos/${idSede}/${fechaDesde}/${fechaHasta}/${idUsuarioAtendio}`, {headers: this.headers}).pipe(
      map((res: any) => {
        const collection: especialistaCitas[] = [];

        res.forEach( x => {

          const especialista = new especialistaCitas();
          especialista.id = x.id;
          especialista.nombre = x.nombre;
          especialista.citas = [];

          x.citasAtendidas.forEach(c => {
            const cita = new reportecitas(
              c.fechacita,
              c.cantidad
            );
            cita.idUsuarioAtendio = c.idUsuarioAtendio;
            especialista.citas.push(cita)
          });

          collection.push(especialista);
        });

        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }


  obtenerCitasEspecialista(idUsuarioAtendio: number, fecha: string, idSede: number): Observable<CitaEspecialista[]>{
    return this.http.get<any>(`${environment.apiUrl}/api/reporteCita/especialista/atendidos/detalle/${idUsuarioAtendio}/${fecha}/${idSede}`, {headers: this.headers}).pipe(
      map((res: any) => {
        const collection: CitaEspecialista[] = [];

        res.forEach( x => {

          const model = new CitaEspecialista();
          model.idCita = x.idCita;
          model.idCliente = x.idCliente;
          model.cliente = x.cliente;
          model.fecha = new Date(x.fecha);
          model.hora = x.hora;
          model.sede = x.sede;
          model.idProximaCitaAtendida = x.idProximaCitaAtendida;
          model.proximaCitaAtendida = x.proximaCitaAtendida;
          model.fechaProximaCita = x.fechaProximaCita;
          model.idProximaCita = x.idProximaCita;
          model.colorProximaCita = x.colorProximaCita;
          model.estadoProximaCita = x.estadoProximaCita;

          collection.push(model);

        });

        console.log(collection);

        return collection;
      }), catchError((e) => {
        return throwError(e.message, e.code);
      })
    );
  }

}
