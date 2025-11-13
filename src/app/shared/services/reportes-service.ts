import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { clienterecurrente} from '../models/clienterecurrente';
import { reportezonas} from '../models/reportezonas';
import { especialistas} from '../models/especialistas';
import { reportecitas} from '../models/reportecitas';

@Injectable({
    providedIn: 'root'
  })
  export class ReportesService {

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

    Obtenerclienterecurrente(): Observable<clienterecurrente[]>{
      return this.http.get<clienterecurrente[]>(`${environment.apiUrl}/api/clienterecurrente/`, {headers: this.headers});
    }
    Obtenerclienterecurrentefecha(fechaInicio, fechaTermino): Observable<clienterecurrente[]>{
      return this.http.get<clienterecurrente[]>(`${environment.apiUrl}/api/clienterecurrente/cita/${fechaInicio}/${fechaTermino}`, {headers: this.headers});
    }
    Obtenerzonasmaximo(fechaInicio, fechaTermino): Observable<reportezonas[]>{
      return this.http.get<reportezonas[]>(`${environment.apiUrl}/api/reportezonas/maximo/${fechaInicio}/${fechaTermino}`, {headers: this.headers});
    }

    Obtenerzonasmaximofecha(): Observable<reportezonas[]>{
      return this.http.get<reportezonas[]>(`${environment.apiUrl}/api/reportezonas/`, {headers: this.headers});
    }
    Obtenerzonasminimo(): Observable<reportezonas[]>{
      return this.http.get<reportezonas[]>(`${environment.apiUrl}/api/reportezonas/minimo`, {headers: this.headers});
    }
    Obtenerzonasminimofecha(fechaInicio, fechaTermino): Observable<reportezonas[]>{
      return this.http.get<reportezonas[]>(`${environment.apiUrl}/api/reportezonas/minimo/${fechaInicio}/${fechaTermino}`, {headers: this.headers});
    }
    Obtenerespecialistas(): Observable<especialistas[]>{
      return this.http.get<especialistas[]>(`${environment.apiUrl}/api/reportezonas/especialistas`, {headers: this.headers});
    }
    Obtenerespecialistasfecha(fechaInicio, fechaTermino): Observable<especialistas[]>{
      return this.http.get<especialistas[]>(`${environment.apiUrl}/api/reportezonas/especialistas/${fechaInicio}/${fechaTermino}`, {headers: this.headers});
    }
/*     Obtenercitas(fechaInicio, fechaTermino): Observable<reportecitas[]>{
      return this.http.get<reportecitas[]>(`${environment.apiUrl}/api/reportezonas/cita/${fechaInicio}/${fechaTermino}`);
    } */
    Obtenercitas(): Observable<reportecitas[]>{
      return this.http.get<reportecitas[]>(`${environment.apiUrl}/api/reportezonas/cita/`, {headers: this.headers});
    }
    Obtenercitasfechas(fechaInicio, fechaTermino): Observable<reportecitas[]>{
      return this.http.get<reportecitas[]>(`${environment.apiUrl}/api/reportezonas/cita/${fechaInicio}/${fechaTermino}`, {headers: this.headers});
    }
  }
