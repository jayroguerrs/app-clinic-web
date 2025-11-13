import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { configuracion } from 'src/app/shared/models/configuracion';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
    private userSubject: BehaviorSubject<configuracion>;
    public user: Observable<configuracion>;
    private headers: HttpHeaders;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }

    obtenerConfiguracion(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/configuracion`, {headers: this.headers});
    }
    obtenerByIdConfiguracion(num): any {
        return this.http.get<any>(`${environment.apiUrl}/api/configuracion/`+num, {headers: this.headers});
    }
    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/configuracion/search/`+str, {headers: this.headers});
    }
    guardar(configuracion): any {
        console.log("configuracion service creada ", configuracion,`ruta: ${environment.apiUrl}/api/configuracion`);
        return this.http.post(`${environment.apiUrl}/api/configuracion`, configuracion, {headers: this.headers});
    }
    actualizar(IdConfiguracion, configuracion): any {
        console.log("services cliente update ", configuracion);
        return this.http.put(`${environment.apiUrl}/api/configuracion/` + IdConfiguracion, configuracion, {headers: this.headers});
    }
}
