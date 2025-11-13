import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroSistemaService {

  private headers: HttpHeaders;

  constructor( private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    });
  }

  obtenerById(id): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/parametroSistema/${id}`, {headers: this.headers});
  }

  obtenerLinkQA(){
    return this.http.get<any>(`${environment.apiUrl}/api/parametroSistema/linkQA`, {headers: this.headers});
  }
}
