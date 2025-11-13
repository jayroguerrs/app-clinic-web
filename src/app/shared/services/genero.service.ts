import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  url: string;
  versionapi: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = CONFIG.url;
    this.versionapi = CONFIG.versionApi;
   }

   obtenerTodos(): Observable<object[]> {
     return this.http.get<object[]>(`${environment.apiUrl}/api/genero`)
   }
}
