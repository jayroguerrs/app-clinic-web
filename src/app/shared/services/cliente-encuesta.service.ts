import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {ClienteEncuesta, ClienteEncuestaPregunta, ClienteEncuestaResultado} from "../models/cliente";

@Injectable({ providedIn: 'root' })

export class ClienteEncuestaService {

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

    collectionByFiltro( idSede: number, fdesde: string, fhasta: string): Observable<ClienteEncuesta[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/clienteEncuesta/reporteGeneral/${idSede}/${fdesde}/${fhasta}`,{headers: this.headers})
      .pipe(
        map((res: any ) => {
          if(res.status === 200){

            const collection: ClienteEncuesta[] = [];
            res.data.forEach((el) => {
              const resultados = new ClienteEncuesta();
              resultados.id = el.id;
              resultados.vcliente = el.cliente;
              resultados.vdistrito = el.distrito;
              resultados.vsede = el.sede;
              resultados.vefectividadTrat = el.vEfectividadTratamiento;
              resultados.vatencionCli = el.vAtencionCliente;
              resultados.vclaridadInfo = el.vClaridadInformativa;
              resultados.vbrindoInfoPromo = el.vBrindoInformacionPromo;
              resultados.vmedio = el.vMedio;
              resultados.vespecialista = el.vEspecialista;
              resultados.fechaCreacion = new Date(el.fechaCreacion);
              collection.push(resultados);
            });

            return collection;
          }else{
            throw throwError(res.status, res.mensaje);
          }

        }),catchError(err => {
          return throwError(err);
        })
      );
    }

  collectionGraficoByFiltro( idSede: number, fdesde: string, fhasta: string): Observable<ClienteEncuestaPregunta[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/clienteEncuesta/reporteGeneral/grafico/${idSede}/${fdesde}/${fhasta}`,{headers: this.headers})
      .pipe(
        map((res: any ) => {
          if(res.status === 200){

            const collection: ClienteEncuestaPregunta[] = [];
            res.data.forEach((el) => {
              const pregunta = new ClienteEncuestaPregunta();
              pregunta.id = el.id;
              pregunta.nombre = el.nombre;

              el.resultados.forEach( r => {
                const resultado = new ClienteEncuestaResultado();
                resultado.item = r.item;
                resultado.total = r.total;
                pregunta.resultados.push(resultado);
              });

              collection.push(pregunta);
            });

            return collection;
          }else{
            throw throwError(res.status, res.mensaje);
          }

        }),catchError(err => {
          return throwError(err);
        })
      );
  }

}
