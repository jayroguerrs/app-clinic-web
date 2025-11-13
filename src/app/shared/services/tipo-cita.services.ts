import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class TipoCitaService {

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

    obtenerTipoCita(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/CitaTipo`, {headers: this.headers});
    }
    obtenerById(num): any {
        return this.http.get<any>(`${environment.apiUrl}/api/CitaTipo/`+num, {headers: this.headers});
    }
    guardar(tipocita): any {
        return this.http.post(`${environment.apiUrl}/api/CitaTipo`, tipocita, {headers: this.headers});
    }
    actualizar(tipocita): any {
        return this.http.put(`${environment.apiUrl}/api/CitaTipo`, tipocita, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/CitaTipo/search/${str}`, {headers: this.headers});
    }
}
