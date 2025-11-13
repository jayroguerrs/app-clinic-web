import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {SunatEntidad} from "../models/sunat";
import {ErrorSistema} from "../models/error-sistema";
import {catchError, map} from "rxjs/operators";
import {EnumFacturaTipoDocumento} from "../enumeracion/enums";

@Injectable({ providedIn: 'root' })
export class SunatService {

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

    buscarEntidad(numero: string, idTipoDocumento: EnumFacturaTipoDocumento): Observable<SunatEntidad | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/sunat/consulta/${numero}/${idTipoDocumento}`, {headers: this.headers}).pipe(
          map(res => {
            if(res.status === 200){
              const model = new SunatEntidad();
              model.nombre = res.data.nombre;
              model.numero = res.data.numero;
              model.direccion = res.data.direccion;

              return model;
            }else{
              const error = new ErrorSistema();
              error.message = res.error;
              return error;
            }
          }), catchError((err: any) => {
            throw Error(err);
          })
        );
    }
}
