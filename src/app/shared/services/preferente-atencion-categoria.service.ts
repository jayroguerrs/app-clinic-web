import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import {BehaviorSubject, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {PreferenteAtencionCategoria} from "../models/preferente.model";

@Injectable({
  providedIn: 'root'
})
export class PreferenteAtencionCategoriaService {
  url: string;
  versionapi: string;
  private headers: HttpHeaders;

  pendientesActuales: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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


  listar(): Observable<PreferenteAtencionCategoria[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/preferente-atencion-categoria/list`, {headers: this.headers}).
    pipe(
      map((res: any) => {

        if(res.status === 200){

          const collection: PreferenteAtencionCategoria[] = [];

          res.data.forEach(d => {
            const model = new PreferenteAtencionCategoria();
            model.id = d.id;
            model.nombre = d.nombre;
            model.idEstado = d.idEstado;

            collection.push(model);
          });

          return collection;

        }else{
          const aviso = new ErrorSistema();
          aviso.message = res.message;
          aviso.status = res.status;
          return aviso;

        }

      }),catchError((res) => {
        throw Error(res);
      })
    );
  }

}
