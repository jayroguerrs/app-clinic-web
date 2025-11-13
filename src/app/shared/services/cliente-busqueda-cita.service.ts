import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteBusquedaCitaService {
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

  busquedaClientes(datoCliente: string){
    return this.http.get<any>(`${environment.apiUrl}/api/ClienteBusquedaCitas/BusquedaCliente/${datoCliente}`, {headers: this.headers});
  }

  
  obtenerListadoCitasCliente(idCliente: number){
    return this.http.get<any>(`${environment.apiUrl}/api/ClienteBusquedaCitas/listadoByCliente/${idCliente}`, {headers: this.headers});
  }

  obtenerListadoCitasGlobales(fechaCita: any, pagina, rowPerPage, idSede, estadoCita, idServicio, tipoCliente, tipoCita, horaDesde, horaHasta){
    return this.http.get<any>(`${environment.apiUrl}/api/ClienteBusquedaCitas/listadoGlobal/${fechaCita}?Pagina=${pagina}&RowsPerPage=${rowPerPage}&Sede=${!idSede ? "" : idSede}&EstadoCita=${!estadoCita ? "" : estadoCita}&Servicio=${!idServicio ? "" : idServicio}&TipoCliente=${!tipoCliente ? "" : tipoCliente}&TipoCita=${!tipoCita ? "" : tipoCita}&HoraDesde=${!horaDesde ? "" : horaDesde}&HoraHasta=${!horaHasta ? "" : horaHasta}`, {headers: this.headers});
  }

  verTotales(fechaCita){
    return this.http.get<any>(`${environment.apiUrl}/api/ClienteBusquedaCitas/verTotales/${fechaCita}`, {headers: this.headers});
  }

  obtenerListadoCitasClienteCcvox(ids: string){
    return this.http.get<any>(`${environment.apiUrl}/api/ClienteBusquedaCitas/listadoCitasClienteCcvox?ids=${ids}`, {headers: this.headers});
  }

  obtenerCitaPorIdcita(idCita: number){
    return this.http.get<any>(`${environment.apiUrl}/api/ClienteBusquedaCitas/busquedaCitaPorId/${idCita}`, {headers: this.headers});
  }
}
