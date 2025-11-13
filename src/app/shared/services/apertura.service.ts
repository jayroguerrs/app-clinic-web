import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Aperturalist } from '../models/aperturalis';
import { ListadoAperturaycierre } from '../models/listadoaperturaycierre';
import { ReporteAperturaEnt } from '../models/ReporteApertura';



@Injectable({ providedIn: 'root' })
export class AperturaService {
    public user: Observable<Aperturalist>;
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

    guardar(Aperturalist): any {
        return this.http.post(`${environment.apiUrl}/api/apertura`, Aperturalist, {headers: this.headers});
    }

    actualizar(Aperturalist): any {
        return this.http.put(`${environment.apiUrl}/api/apertura/`, Aperturalist, {headers: this.headers});
    }

    listadoaperturaporfechayidturno(fechaInicio, idturno , idcaja): Observable<ListadoAperturaycierre[]>{
        return this.http.get<ListadoAperturaycierre[]>(`${environment.apiUrl}/api/apertura/listadoaperturaycierreporfechayidturno/${fechaInicio}/${idturno}/${idcaja}`, {headers: this.headers});
    }

    reporteaperturafecha(fechaInicio, idturno): Observable<ReporteAperturaEnt[]>{
        return this.http.get<ReporteAperturaEnt[]>(`${environment.apiUrl}/api/apertura/reportecierre/${fechaInicio}/${idturno}`, {headers: this.headers});
    }
    montototal(fechaInicio, idturno): Observable<ReporteAperturaEnt[]>{
        return this.http.get<ReporteAperturaEnt[]>(`${environment.apiUrl}/api/apertura/montototal/${fechaInicio}/${idturno}`, {headers: this.headers});
    }
    principal(fechaInicio, idturno, idcaja): Observable<ReporteAperturaEnt[]>{
        return this.http.get<ReporteAperturaEnt[]>(`${environment.apiUrl}/api/apertura/principal/${fechaInicio}/${idturno}/${idcaja}`, {headers: this.headers});
    }

}
