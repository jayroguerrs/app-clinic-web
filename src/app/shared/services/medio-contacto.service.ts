import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { MedioContacto } from '../../componentes/preferente/preferente.models';
import {catchError, map} from "rxjs/operators";

@Injectable({  providedIn: 'root' })
export class MedioContactoService {
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

  obtenerMedioContacto(): Observable<MedioContacto[]> {
    return this.http.get<MedioContacto[]>(`${environment.apiUrl}/api/medioContacto`, {headers: this.headers}).pipe(
      map((res) => {
        const out: MedioContacto[] = [];
        res.forEach((r) => {
          const item = new MedioContacto();
          item.id = r.id;
          item.nombre = r.nombre;
          out.push(item);
        });
        return out;
      }),catchError((err) => {
        return throwError(err.message, err.code);
      })
    );
  }
}
