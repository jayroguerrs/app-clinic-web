import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {Cita, CitaDetalle} from "../../models/corporal-360/Cita";
import {Observable} from "rxjs/Observable";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";

@Injectable({ providedIn: 'root' })

export class CitaDetalle360Service {

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

    findByCita(idCita: number): Observable<CitaDetalle[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/citaDetalle360/cita/${idCita}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: CitaDetalle[] = [];
          if(res.status === 200){
            res.data.forEach(x => {
              const m = new CitaDetalle();
              m.id = x.id;
              m.idCita = x.idCita;
              m.idZona = x.idZona;
              m.zona = x.zona;
              m.precio = x.precio;
              m.sesion= x.sesion;
              m.idPromocion = x.idPromocionPrecio;
              m.idPromocionPrecio = x.idPromocionPrecio;
              m.idTecnologia = x.idTecnologia;
              m.tecnologia = x.tecnologia;
              m.minutos = x.minutos;
              m.idUsuarioAgendado = x.idUsuarioAgendado;
              m.idMedioContactoOrigen = x.idMedioContactoOrigen;

              //secondary
              m.promocion = x.promocion;
              m.usuarioAgendado = x.usuarioAgendado;
              collection.push(m);
            });
          }
          return collection;
        }),catchError((err)=> {
          return throwError(err);
        })
      );
    }


}
