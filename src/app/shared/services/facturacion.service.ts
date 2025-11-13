import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DetalleVentaClass} from '../models/detalle-venta';
import { Apertura } from '../models/apertura';

@Injectable({
    providedIn: 'root'
  })
  export class FacturacionService {

    url: string;
    versionapi: string;

    constructor(
      private http: HttpClient
    ) {
      this.url = CONFIG.url;
      this.versionapi = CONFIG.versionApi;
    }

    //Luis
    obtenerTipoPagoLista(): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/venta/tipoPago`);
    }
    obtenerNumeroSerie(idTipoComprobante: number, idSede: number): Observable<any>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/venta/numeroSerie/${idTipoComprobante},${idSede}`);
    }
    grabarVenta(venta): any {
      return this.http.post(`${environment.apiUrl}/api/venta`, venta);
    }
    grabarCitaPagada(venta): any {
      return this.http.post(`${environment.apiUrl}/api/venta/citaPagada`, venta);
    }
    ticketObtenerListado(filtros: any): Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/api/venta/ticket/listado/${filtros.idSede}/${filtros.fechaInicio}/${filtros.fechaTermino}`);
    }
    anularTicket(idVenta,idUsuarioModifica): any{
      return this.http.get<any>(`${environment.apiUrl}/api/venta/anularTicket/${idVenta}/${idUsuarioModifica}`);
    }
    obtenerEgresos(): any {
      return this.http.get<any>(`${environment.apiUrl}/api/egreso/obtener`);
    }


    //Jose
    obtenerFacturacionElectronica(fechaInicio, fechaTermino,idsede): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacion/${fechaInicio}/${fechaTermino}/${idsede}`);
    }
    obtenerFacturacionElectronicafiltrofiltro(strFiltro): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacionelectronica/`);
    }
    obtenerByIdDocumento(strFiltro): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacionelectronica/`);
    }
    // obtenerByIdFecha(fecha): Observable<facturacionelectronica[]>{
    //   return this.http.get<facturacionelectronica[]>(`${environment.apiUrl}/api/facturacion/cita/`+fecha);
    // }
    Obtenerticket(fechaInicio, fechaTermino,idsede): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacion/ticket/${fechaInicio}/${fechaTermino}/${idsede}`);
    }
    Obtenerventausuario(idusuario): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacion/obtenerventausuario/${idusuario}`);
    }
    searchByLikeNombre(strFiltro): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacion/ticket/`);
    }
    obteneridventa(idventa): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacion/venta/`+idventa);
    }
    // Obtenerventaporidcita(idcita): any{
    //   return this.http.get<any>(`${environment.apiUrl}/api/facturacion/ventaporcita/`+idcita);
    // }
    Obtenerventaporidcita(idcita): any{
      return this.http.get<any>(`${environment.apiUrl}/api/facturacion/ventaporcita/`+idcita);
    }

    obtenerDetalleFacturaId(idventa): Observable<DetalleVentaClass[]>{
      return this.http.get<DetalleVentaClass[]>(`${environment.apiUrl}/api/facturacion/detallefacturaid/`+idventa);
    }
    obtenerByIdCita(idcita): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacion/detallecita/`+idcita);
    }

    obtenerVentaPorIdNumeroDocumento(NumeroDocumento): any{
      return this.http.get<any>(`${environment.apiUrl}/api/facturacion/numerodocumento/`+NumeroDocumento);
    }
    reenvio(Documento,tipooper,fecha): any {
      return this.http.get<object[]>(`${environment.apiUrl}/api/facturacion/reenvio/${Documento},${tipooper},${fecha}`);
    }

    actualizar(strFiltro): Observable<any[]>{
      return this.http.get<any[]>(`${environment.apiUrl}/api/facturacionelectronica/`);
    }
    validacion(idusuario,idcita): Observable<Apertura[]>{
      return this.http.get<Apertura[]>(`${environment.apiUrl}/api/facturacion/validacionsedeusuariocita/${idusuario}/${idcita}`);
    }
    guardar(model): any {
      return this.http.post(`${environment.apiUrl}/api/facturacion/`, model);
    }
  }
