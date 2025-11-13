import { Injectable } from '@angular/core';
import { CONFIG } from '../configuracion/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { seguimientocitas } from '../models/seguimientocitas';
@Injectable({ providedIn: 'root' })

export class CitaSeguimientoService {
    url: string;
    versionapi: string;
    public user: Observable<seguimientocitas>;
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

    obtenerCitaSeguimiento(idCita: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/citaSeguimiento/${idCita}`, {headers: this.headers});
    }
    obtenerHistorialSeguimiento(idCliente: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/citaSeguimiento/cliente/${idCliente}`, {headers: this.headers});
    }
    obtenerHistorialSeguimientoPorServicio(idCliente: number, idServicio: number): Observable<object[]> {
      return this.http.get<object[]>(`${environment.apiUrl}/api/citaSeguimiento/cliente/${idCliente}/servicio/${idServicio}`, {headers: this.headers});
    }

    // obtenerByIdNotas(num): any {
    //     return this.http.get<any>(`${environment.apiUrl}/api/seguimientocitas/`+num);
    //   }

    // searchByLikeNombre(str): Observable<object[]> {
    //     return this.http.get<object[]>(`${environment.apiUrl}/api/cita/search/`+str);
    // }
    // guardar(seguimientocitas): any {
    //     console.log("services seguimientocitas create ", seguimientocitas,`ruta: ${environment.apiUrl}/api/Seguimientocita`);
    //     return this.http.post(`${environment.apiUrl}/api/Seguimientocita`, seguimientocitas);
    // }
    // actualizar(idseguimientocitas, seguimientocitas): any {
    //     console.log("services notas update ", seguimientocitas);
    //     return this.http.put(`${environment.apiUrl}/api/notas/` + idseguimientocitas, seguimientocitas);
    // }
}
