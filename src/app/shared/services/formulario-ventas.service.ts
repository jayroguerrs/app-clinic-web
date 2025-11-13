



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TipoClienteDTO } from '../interfaces/tipoClienteDTO';
import { PromocionFormDTO } from '../interfaces/promocionFormDTO';
import { ServicioPromocionDTO } from '../interfaces/servicioPromocionDTO';
import { VentaFormDTO } from '../interfaces/ventaFormDTO';

@Injectable({
    providedIn: 'root'
})
export class FormularioService {
    private url: string;
    private headers: HttpHeaders;

    constructor(private http: HttpClient) {
        this.url = `${environment.apiUrl}/api/formulario`;
        this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
        });
    }

    obtenerTipoCliente(idUsuario: number): Observable<TipoClienteDTO[]> {
        return this.http.get<any>(`${this.url}/tipocliente/${idUsuario}`, { headers: this.headers }).pipe(
        map(response => {
            
            return response.result.data;
        }),
        catchError(err => {
            return throwError(err);
        })
        );
    }

    obtenerPromociones(idUsuario: number): Observable<PromocionFormDTO[]> {        
        return this.http.get<any>(`${this.url}/promociones/${idUsuario}`, { headers: this.headers }).pipe(
        map(response => {
            return response.result.data;
        }),
        catchError(err => {
            return throwError(err);
        })
        );
    }
  
    obtenerServiciosPorPromocion(idPromocion: number, idUsuario: number): any {
        return this.http.get<any>(`${this.url}/servicios/promocion/${idPromocion}/${idUsuario}`, { headers: this.headers });
    }

    registrarVenta(form: VentaFormDTO): Observable<any> {
        return this.http.post<any>(`${this.url}/registrarventa`, form, { headers: this.headers }).pipe(
            map(response => {
                return response.result;  
            }),
            catchError(err => {
                return throwError(err);
            })
        );
    }

    reporteFormularioVenta(param: any): Observable<any> {
        return this.http.post<any>(`${this.url}/ReporteVenta`, param, { headers: this.headers }).pipe(
            map(response => {
                return response;  
            }),
            catchError(err => {
                return throwError(err);
            })
        );
    }
}
