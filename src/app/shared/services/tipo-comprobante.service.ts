import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {catchError, map} from "rxjs/operators";
import {TipoComprobante} from "../models/tipo-comprobante";
import {ErrorSistema} from "../models/error-sistema";

@Injectable({
  providedIn: 'root'
})
export class TipoComprobanteService {
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

  obtener(): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/tipoComprobante`, {headers: this.headers});
  }

  obtenerById(idTipoComprobante): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/tipoComprobante/${idTipoComprobante}`, {headers: this.headers});
  }

  grabar(tipoComprobante): any {
    return this.http.post(`${environment.apiUrl}/api/tipoComprobante`, tipoComprobante, {headers: this.headers});
  }

  actualizar(tipoComprobante): any {
    return this.http.put(`${environment.apiUrl}/api/tipoComprobante`, tipoComprobante, {headers: this.headers});
  }

  obtenerParaPuntoVenta(idUsuario): Observable<TipoComprobante[] | ErrorSistema>{
    return this.http.get(`${environment.apiUrl}/api/tipoComprobante/punto-venta/${idUsuario}`, {headers: this.headers}).pipe(
      map((res: any) => {

        if(res.status === 200){
          const collection: TipoComprobante[] = [];
          res.data.forEach(x => {
            const model = new TipoComprobante();
            model.idEstado = x.idEstado;
            model.id = x.id;
            model.puntoVenta = x.puntoVenta;
            model.descripcion = x.descripcion;
            model.abreviatura = x.abreviatura;
            model.valor = x.valor;
            collection.push(model);
          });
          return collection;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }

      }, catchError((err) => {
          throw Error(err);
      }))
    );
  }

}
