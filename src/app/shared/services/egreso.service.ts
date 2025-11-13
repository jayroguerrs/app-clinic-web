import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EgresoService {
    constructor(
        private http: HttpClient
    ) { }

    obtenerEgresos(fechaInicio, fechaTermino): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/egreso/listado/${fechaInicio}/${fechaTermino}` );
    }
    guardar(egreso): any {
        return this.http.post(`${environment.apiUrl}/api/egreso`, egreso);
    }
    anularEgreso(model): any {
        return this.http.put(`${environment.apiUrl}/api/egreso/anularEgreso`, model);
    }
    
}