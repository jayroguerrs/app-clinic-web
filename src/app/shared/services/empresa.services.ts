import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empresaelectronica} from '../models/empresa';
@Injectable({
    providedIn: 'root'
  })
  export class EmpresaService {
    url: string;
    versionapi: string;
  
    constructor(
      private http: HttpClient
    ) {
      this.url = CONFIG.url;
      this.versionapi = CONFIG.versionApi;
    }
    obtenerEmpresa(): Observable<Empresaelectronica[]>{
      return this.http.get<Empresaelectronica[]>(`${environment.apiUrl}/api/Empresa/`);
    }
    // obtenerEmpresaidSede(idSede: number): Observable<Empresaelectronica[]>{
    //   return this.http.get<Empresaelectronica[]>(`${environment.apiUrl}/api/Empresa/porsede/${idSede}`);
    // }
    obtenerEmpresaEmisionTicket(idCita): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/api/empresa/ticket/${idCita}`);
    }

  }