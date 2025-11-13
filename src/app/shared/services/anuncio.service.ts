import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

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
    return this.http.get<object[]>(`${environment.apiUrl}/api/anuncio`, {headers: this.headers})
  }
  obtenerById(id: number): any {
    return this.http.get<any>(`${environment.apiUrl}/api/anuncio/${id}`, {headers: this.headers});
  }
  guardar(anuncio: any): any {
    return this.http.post(`${environment.apiUrl}/api/anuncio`, anuncio, {headers: this.headers});
  }
  actualizar(anuncio): any {
      return this.http.put(`${environment.apiUrl}/api/anuncio`, anuncio, {headers: this.headers});
  }
}
