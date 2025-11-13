import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';


import { environment } from '../../../environments/environment';
import { Departamento } from 'src/app/componentes/preferente/preferente.models';

@Injectable({ providedIn: 'root' })
export class UbicacionService {

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
        return this.http.get<object[]>(`${environment.apiUrl}/api/ubicacion`, {headers: this.headers});
    }
    obtenerDepartamento(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/ubicacion/Departamento`, {headers: this.headers});
    }
     //Se creo un segundo metodo para traer los departamentos, con un observable Tipado
     obtenerDepartamento2(): Observable<Departamento[]> {
        return this.http.get<Departamento[]>(`${environment.apiUrl}/api/ubicacion/Departamento`, {headers: this.headers});
    }

    obtenerCiudadByToDepartamento(departamento): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/ubicacion/Ciudad/`+departamento, {headers: this.headers});
    }
    obtenerDistritoByToCiudadByToDepartamento(ciudad,departamento): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/ubicacion/Distrito/`+ciudad+`/`+departamento, {headers: this.headers});
    }
}
