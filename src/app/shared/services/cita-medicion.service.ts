import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {CitaMedicion, CitaMedicionGeneral} from "../models/CitaMedicion";
import {RCitaMotivoGeneral} from "../interfaces/Response/cita-motivo-estado";
import {TotalCitasEncuestadas} from "../models/reportecitas";

@Injectable({
  providedIn: 'root'
})

export class CitaMedicionService {

    headers: HttpHeaders;

    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });

    }
    guardarMedicion( citaMedicion ): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/api/citaMedicion`, citaMedicion,{headers: this.headers}).pipe(
          map(response => {

              if(response.status != 201){
                throwError(response.mensaje);
                return false;
              }

              return true;
          }),
          catchError(err => {
            return throwError(err.message, err.code);
          })
        );
    }

  obtenerMedicionByIdCita( idCita: number, idTipoMedicion: number ): Observable<CitaMedicion | null> {
    return this.http.get<any>(`${environment.apiUrl}/api/citaMedicion/cita/${idCita}/${idTipoMedicion}`,{headers: this.headers}).pipe(
      map(response => {

        if(response.status != 200){
          throwError(response.mensaje);
          return null;
        }

        const data = response.data;
        if(!data){return null;}

        const citaMedicion = new CitaMedicion();
        citaMedicion.id = data.id;
        citaMedicion.idCita = data.idCita;
        citaMedicion.idTipoMedicion = data.idTipoMedicion;
        citaMedicion.idAlternativaMedicion = data.idAlternativaMedicion;
        citaMedicion.fechaRegistro = data.fechaRegistro ? new Date(data.fechaRegistro) : null;
        citaMedicion.idUsuarioRegistro = data.idUsuarioRegistro;
        citaMedicion.fechaModifico = data.fechaModifico ? new Date(data.fechaModifico) : null;
        citaMedicion.idUsuarioModifico = data.idUsuarioModifico;
        citaMedicion.usuarioModifico = data.usuarioModifico;
        citaMedicion.usuarioRegistro = data.usuarioRegistro;

        return citaMedicion;

      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  reporteGeneral( idSede: number, fechaDesde: Date, fechaHasta: Date, idTipoMedicion: number, idServicio: number ): Observable<CitaMedicionGeneral[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/citaMedicion/reporteGeneral/${idSede}/${fechaDesde}/${fechaHasta}/${idTipoMedicion}/${idServicio}`,{headers: this.headers})
      .pipe(
        map((res: any ) => {

          if(res.status !== 200){
            throw throwError(res.status, res.mensaje);
          }

          const collection: CitaMedicionGeneral[] = [];
          res.data.forEach((el) => {
            const item = new CitaMedicionGeneral();

            item.idCita = el.idCita;
            item.idSede = el.idSede;
            item.cliente = el.cliente;
            item.idCliente = el.idCliente;
            item.genero = el.genero;
            item.idEstado = el.idEstado;
            item.estado = el.estado;
            item.estadoColor = el.estadoColor;
            item.tipoMedicion = el.tipoMedicion;
            item.alternativa = el.alternativa;
            item.fechaRegistro = el.fechaRegistro ? new Date(el.fechaRegistro) : null;
            item.usuarioRegistro = el.usuarioRegistro;
            item.usuarioAtendio = el.usuarioAtendio;
            item.idServicio = el.idServicio;
            item.servicio = el.servicio;
            item.servicioColor = el.servicioColor;
            item.siguienteCita = el.siguienteCita;

            collection.push(item);
          });

          return collection;

        }),catchError(err => {
          return throwError(err);
        })
      );
  }


  obtenerTotalCitasAtendidas( fechaDese: string, fechaHasta: string, idSede: number ): Observable<TotalCitasEncuestadas> {
    return this.http.get<any>(`${environment.apiUrl}/api/citaMedicion/citasEncuestadas/${fechaDese}/${fechaHasta}/${idSede}`,{headers: this.headers}).pipe(
      map(response => {

        const model : TotalCitasEncuestadas = new TotalCitasEncuestadas();

        if(response.status === 200) {
            const data = response.data;
            model.totalCitas = data.totalCitas;
            model.totalCitasPagadas = data.totalCitasPagadas;
            model.totalEfectividad = data.totalEfectividad;
            model.totalSatisfaccion = data.totalSatisfaccion;
        }
        return model;

      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

}
