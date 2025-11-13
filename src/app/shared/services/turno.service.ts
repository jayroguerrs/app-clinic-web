import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Turno } from '../models/turno';
@Injectable({ providedIn: 'root' })
export class TurnoService {
    public user: Observable<Turno>;
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


    obtenerturno(): Observable<Turno[]>{
        return this.http.get<Turno[]>(`${environment.apiUrl}/api/turno/`, {headers: this.headers});
    }
    obtenerturnoid(id): Observable<Turno[]>{        
        return this.http.get<Turno[]>(`${environment.apiUrl}/api/turno/`+ id, {headers: this.headers});
    }

}
