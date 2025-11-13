import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../configuracion/config';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoIdentidadTipoService {
  url: string;
  versionapi: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = CONFIG.url;
    this.versionapi = CONFIG.versionApi;
  }

  obtener(): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/documentoIdentidadTipo`);
  }

}
