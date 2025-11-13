import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {ComprobanteEntidadTipoPago} from "../../models/facturacion/comprobante-entidad-tipo-pago";

@Injectable({ providedIn: 'root' })
export class ComprobanteEntidadTipoPagoService {
    public user: Observable<ComprobanteEntidadTipoPago>;
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

    listar(idUsuario: number): Observable<ComprobanteEntidadTipoPago[] | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/comprobanteEntidadTipoPago/lista/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: ComprobanteEntidadTipoPago[] = [];

            if(res.status === 200){
              res.data.forEach((item) => {
                const model = new ComprobanteEntidadTipoPago();
                model.id = item.id;
                model.nombre = item.nombre;
                model.valor = item.valor;
                model.idEstado = item.idEstado;
                collection.push(model);
              });
            }else{
              const error = new ErrorSistema();
              error.message = res.message;
              error.status = res.status;
              return error;
            }

            return collection;
          }),catchError((e) => {
            throw Error(e);
          })
        );
    }


}
