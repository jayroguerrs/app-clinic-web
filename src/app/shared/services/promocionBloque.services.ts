import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class PromocionBloqueService {
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

    obtenerByIdPromocion(idPromocion: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/promocionbloque/obtenerByIdpromocion/${idPromocion}`, {headers: this.headers});
    }
    grabarPlantillas(plantillas): any{
        return this.http.post<any>(`${environment.apiUrl}/api/promocionbloque/grabarPlantillas`, plantillas, {headers: this.headers});
    }

}
