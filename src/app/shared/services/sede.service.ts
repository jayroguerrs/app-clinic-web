import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SedeService {

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

    obtener(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/sede`, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/sede/search/${str}`, {headers: this.headers});
    }
    obtenerById(id: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/sede/${id}`, {headers: this.headers});
    }
    guardar(sede): any {
        return this.http.post(`${environment.apiUrl}/api/sede`, sede, {headers: this.headers});
    }
    actualizar(sede): any {
        return this.http.put(`${environment.apiUrl}/api/sede`, sede, {headers: this.headers});
    }
}
