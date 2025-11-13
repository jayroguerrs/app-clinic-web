import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG } from '../configuracion/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { plantillapromocion } from '../models/promocionplantilla';


@Injectable({ providedIn: 'root' })
export class PromocionPlantillaService {
    url: string;
    versionapi: string;
    private userSubject: BehaviorSubject<plantillapromocion>;
    public user: Observable<plantillapromocion>;
    //private Url = 'http://localhost:4000/api/usuario';
    private headers: HttpHeaders;

    constructor(
        private router: Router,
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

    obtenerpromocionplantilla(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/promocionplantilla`, {headers: this.headers});
    }

    obtenerByIdPromocionPlantilla(num): any {
        return this.http.get<any>(`${environment.apiUrl}/api/promocionplantilla/`+num, {headers: this.headers});
      }

    searchByLikeNombre(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/promocionplantilla/search/`+str, {headers: this.headers});
    }
    guardar(promocionplantilla): any {
        console.log("services Plantilla Promocion ", promocionplantilla,`ruta: ${environment.apiUrl}/api/promocionplantilla`, {headers: this.headers});
        return this.http.post(`${environment.apiUrl}/api/promocionplantilla`, promocionplantilla);
    }

    actualizar(idpromocionplantilla, promocionplantilla): any {
        console.log("services Promocion Plantilla update ", promocionplantilla);
        return this.http.put(`${environment.apiUrl}/api/promocionplantilla/` + idpromocionplantilla, promocionplantilla, {headers: this.headers});
    }




}
