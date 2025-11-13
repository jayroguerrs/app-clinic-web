import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import {ErrorSistema} from "../../models/error-sistema";
import {
  ComprobanteElectronicoAnulado, ComprobanteElectronicoValidar
} from "../../models/facturacion/comprobante-electronico";
import {ComprobanteAnulacion} from "../../models/facturacion/comprobante-anulaciones";

@Injectable({ providedIn: 'root' })
export class ComprobanteElectronicoAnuladoService {
    public user: Observable<ComprobanteElectronicoAnulado>;
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

    buscar(idVenta: number, idUsuario: number): Observable<ComprobanteElectronicoAnulado | ErrorSistema> {
        return this.http.get<any>(`${environment.apiUrl}/api/comprobanteElectronicoAnulado/venta/${idVenta}/${idUsuario}`, {headers: this.headers}).pipe(
          map((res) =>{
            if(res.status === 200){
                const item = res.data;
                const model = new ComprobanteElectronicoAnulado();
                model.id = item.id;
                model.idVenta = item.idVenta;
                model.motivo = item.motivo;
                model.usuarioRegistro = item.usuarioRegistro;
                model.idUsuarioRegistro = item.idUsuarioRegistro;
                model.fechaRegistro = new Date(item.fechaRegistro);

                return model;
            }else{
              const error = new ErrorSistema();
              error.message = res.message;
              error.status = res.status;
              return error;
            }
          }),catchError((e) => {
            return  throwError(e);
          })
        );
    }

    collection(
      fechaDesde: string,
      fechaHasta: string,
      idTipoComprobante: number,
      idSede: number,
      idUsuario: number
    ): Observable<ComprobanteAnulacion[] | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/comprobanteAnulacion/obtener/${fechaDesde}/${fechaHasta}/${idTipoComprobante}/${idSede}/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) =>{
        if(res.status === 200){
          const collection: ComprobanteAnulacion[] = [];

          res.data.forEach(item => {
            const model = new ComprobanteAnulacion();
            model.id = item.id;
            model.motivo = item.motivo;

            model.idTipoComprobante = item.idTipoComprobante;
            model.tipoComprobante = item.tipoComprobante;

            model.idSede = item.idSede;
            model.sede = item.sede;
            model.serie = item.serie;
            model.numero = item.numero;

            model.idEstadoSunat = item.idEstadoSunat;
            model.estadoSunat = item.estadoSunat;
            model.estadoSunatColor = item.estadoSunatColor;

            model.codigo = item.codigo;
            model.sunatAcepto = item.sunatAcepto;
            model.sunatTicketNumero = item.sunatTicketNumero;
            model.sunatDescripcion = item.sunatDescripcion;
            model.sunatNota = item.sunatNota;
            model.sunatCodigoRespuesta = item.sunatCodigoRespuesta;
            model.sunatSoapError = item.sunatSoapError;
            model.sunatUrlCdr = item.sunatUrlCdr;
            model.sunatUrlPdf = item.sunatUrlPdf;
            model.sunatUrlXml = item.sunatUrlXml;
            model.idUsuarioRegistro = item.idUsuarioRegistro;
            model.idUsuarioModifico = item.idUsuarioModifico;

            model.fechaRegistro = new Date(item.fechaRegistro);
            model.fechaModifico = item.fechaModifico ? new Date(item.fechaModifico) : null;

            // Secundario
            model.usuarioRegistro = item.usuarioRegistro;
            model.usuarioModifico = item.usuarioModifico;

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
        return  throwError(e);
      })
    );
  }


    consultarAnulacion(idTipoComprobante: number, serie: string, numero: string, idSede: number, idUsuario: number): Observable<ComprobanteAnulacion | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/comprobanteElectronico/consultar-anulacion/${idTipoComprobante}/${serie}/${numero}/${idSede}/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) =>{
        if(res.status === 200){
          const item = res.data;
          const model = new ComprobanteAnulacion();
          model.idTipoComprobante = item.idTipoComprobante;
          model.idSede = item.idSede;
          model.codigo = item.codigo;
          model.numero = item.numero;
          model.serie = item.serie;
          model.idEstadoSunat = item.idEstadoSunat;
          model.estadoSunat = item.estadoSunat;
          model.estadoSunatColor = item.estadoSunatColor;
          return model;
        }else{
          const error = new ErrorSistema();
          error.message = res.error;
          error.status = res.status;
          return error;
        }
      }),catchError((e) => {
        return  throwError(e);
      })
    );
  }


}
