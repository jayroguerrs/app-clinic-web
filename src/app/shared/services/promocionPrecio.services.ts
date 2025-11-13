import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class PromocionPrecioService {
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
    guardar(promocionPrecio): any {
        return this.http.post(`${environment.apiUrl}/api/promocionPrecio`, promocionPrecio, {headers: this.headers});
    }
    obtenerByIdpromocion(idPromocion: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/promocionPrecio/${idPromocion}`, {headers: this.headers});
    }
    // obtenerPromocionPrecioZonas(idzona: number, sesiones: number, idpromocion: number): any {
    //     return this.http.get<any>(`${environment.apiUrl}/api/promocionPrecio/${idzona},${sesiones},${idpromocion}`);
    // }
}
