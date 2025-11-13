import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado } from 'src/app/componentes/preferente/preferente.models';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  url: string;
  versionapi: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = CONFIG.url;
    this.versionapi = CONFIG.versionApi;
  }

  obtenerEstado(): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${environment.apiUrl}/api/estado`);
  }
  obtenerEstadoByEntidad(entidad): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${environment.apiUrl}/api/estado/${entidad}`);
  }
  obtenerEstadoByEntidadHijo(param: any): Observable<Estado[]>{
    return this.http.get<Estado[]>(`${environment.apiUrl}/api/estado/${param.entidad}/${param.idEstPadr}`);
  }  
}
