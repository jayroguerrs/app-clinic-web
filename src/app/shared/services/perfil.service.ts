import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';


import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PerfilService {

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
        return this.http.get<object[]>(`${environment.apiUrl}/api/perfil`, {headers: this.headers});
    }
    obtenerById(idPerfil): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/perfil/${idPerfil}`, {headers: this.headers});
    }
    grabar(perfil): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/api/perfil`, perfil, {headers: this.headers});
    }
    modificar(perfil): Observable<object[]> {
        return this.http.put<object[]>(`${environment.apiUrl}/api/perfil`, perfil, {headers: this.headers});
    }

}
