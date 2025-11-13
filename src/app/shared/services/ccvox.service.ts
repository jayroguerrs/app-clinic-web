import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CcvoxService {

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

  esCliente(numero: string){
    return this.http.get<any>(`${environment.apiUrl}/api/Ccvox/esCliente/${numero}`, {headers: this.headers});
  }


}
