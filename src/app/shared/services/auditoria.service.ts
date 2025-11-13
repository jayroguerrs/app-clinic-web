import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
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

  insAuditoria(param: any): Observable<any> {    
    return this.http.post(`${environment.apiUrl}/api/SegAuditoria/Registrar`, param, {headers: this.headers});
  }
}
