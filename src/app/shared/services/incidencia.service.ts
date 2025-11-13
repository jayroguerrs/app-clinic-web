import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {Observable} from "rxjs/Observable";
import {NivelAtencion} from "../models/incidencia";

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
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

  obtener(idEstado): any {
    return this.http.get<any>(`${environment.apiUrl}/api/incidencia/listado/${idEstado}`, {headers: this.headers});
  }

  obtenerNivelAtencion(): Observable<NivelAtencion> {
    return this.http.get<any>(`${environment.apiUrl}/api/incidencia/nivelAtencion`, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          const output: NivelAtencion = new NivelAtencion();
          output.numeroCitas = res.data.numeroCitas;
          output.total = res.data.total;
          return output;
        }else{
          throw throwError(res.message, res.status);
        }
      }), catchError((res) => {
        return throwError(res);
      })
    );
  }

}
