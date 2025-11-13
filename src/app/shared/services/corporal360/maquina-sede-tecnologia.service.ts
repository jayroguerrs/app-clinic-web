import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Servicio} from "../../models/corporal-360/servicio";
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../../models/error-sistema";
import {MaquinaSede} from "../../models/corporal-360/MaquinaSede";

@Injectable({ providedIn: 'root' })
export class MaquinaSedeTecnologiaService {
    public user: Observable<Servicio>;
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

    registrar(model: MaquinaSede): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/c360/maquinaSedeTecnologia`, model, {headers: this.headers}).pipe(
        map((res: any) =>{
          if(res.status === 201 ){
            return true;
          }else{
            const alerta = new ErrorSistema();
            alerta.status = res.status;
            alerta.message = res.message;
            return alerta;
          }
        }), catchError((e) => {
          throw e;
        })
      );
    }


}
