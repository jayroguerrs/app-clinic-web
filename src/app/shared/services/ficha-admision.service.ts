import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {FichaAdmision, FA_Patologia} from "../models/ficha-admision";
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class FichaAdmisionService {

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

  obtenerById( idFichaAdmision: number ): Observable<FichaAdmision | null> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/fichaAdmision/editar/${idFichaAdmision}`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          const data = res.data;

          if(!data){return null; }

          const fichaAdmision: FichaAdmision = new FichaAdmision();

          const patologias: FA_Patologia[] = [];
          data.patologias.forEach( p => {
            const patologia: FA_Patologia = new FA_Patologia();
            patologia.id = p.id;
            patologia.nombre = p.nombre;
            patologia.activo = p.activo;

            patologias.push(patologia);
          });

          fichaAdmision.patologias = patologias;

          return fichaAdmision;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }

  editarFicha( model: FichaAdmision ): Observable<boolean> {
    // Registra la historia clinica de la cita
    return this.http.put(`${environment.apiUrl}/api/fichaAdmision/editar/${model.id}`, model, {headers: this.headers})
      .pipe(
        map((res: any) => {

          if (res.status === 200){
            return true;
          }else{
            return false;
          }

        }), catchError((err) => {
          return throwError(err);
        })
      );
  }




}
