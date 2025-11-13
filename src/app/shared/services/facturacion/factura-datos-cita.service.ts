import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {ComprobanteDatosCitaDetalle, FacturaDatosCita} from "../../models/facturacion/factura-datos-cita";

@Injectable({ providedIn: 'root' })
export class FacturaDatosCitaService {
    public user: Observable<FacturaDatosCita>;
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

    obtenerDatosCita(idCita: number, idUsuario: number): Observable<FacturaDatosCita | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/facturacionElectronica/datos-comprobante-cita/${idCita}/${idUsuario}`, {headers: this.headers}).pipe(
        map((res) =>{
          if(res.status === 200){
            const item = res.data;
            const model = new FacturaDatosCita();
            model.idCita = item.idCita;
            model.idSede = item.idSede;
            model.idServicio = item.idServicio;
            model.fechaCita = new Date(item.fechaCita);
            model.numeroBox = item.numeroBox;
            model.idMaquinaMarca = item.idMaquinaMarca;
            model.maquinaMarca = item.maquinaMarca;
            model.idAtendidoPor = item.idAtendidoPor;
            model.atendidoPor = item.atendidoPor;

            model.idCliente = item.idCliente;
            model.nombreCliente = item.nombreCliente;
            model.idTipoDocumentoCliente = item.idTipoDocumentoCliente;
            model.tipoDocumentoCliente = item.tipoDocumentoCliente;
            model.documentoCliente = item.documentoCliente;
            return model;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }
        }),catchError((e) => {
          throw Error(e);
        })
      );
    }


  obtenerDatosCitaDetalle(idCita: number, idUsuario: number): Observable<ComprobanteDatosCitaDetalle[] | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/facturacionElectronica/datos-comprobante-cita-detalle/${idCita}/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) =>{
        if(res.status === 200){
          const collection : ComprobanteDatosCitaDetalle[] = [];

          res.data.forEach(item => {
            const model = new ComprobanteDatosCitaDetalle();
            model.idCitaDetalle = item.id;
            model.idCita = item.idCita;
            model.sesion = item.sesion;
            model.precio = item.precio;
            model.precioReal = item.precio;
            model.total = item.precio;
            model.subTotal = item.precio;
            model.igv = 0.0;
            model.valorUnitario = item.precio;
            model.idUnidadMedida = item.idUnidadMedida;
            model.unidadMedida = item.unidadMedida ? item.unidadMedida : 'Servicio';
            model.unidadMedidaValor = item.unidadMedidaValor ? item.unidadMedidaValor : 'ZZ';
            model.descripcionUnidadMedida = item.descripcionUnidadMedida;

            model.idZona = item.idZona;
            model.zona = `${item.zona} - SS${item.sesion}`;
            collection.push(model);
          })

          return collection;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((e) => {
        throw Error(e);
      })
    );
  }


}
