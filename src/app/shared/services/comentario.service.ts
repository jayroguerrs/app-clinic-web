import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  url: string;
  versionapi: string;
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

  obtenerComentario(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/comentario`, {headers: this.headers});
  }
}
