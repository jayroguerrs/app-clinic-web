import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Roles } from '../models/roles';

@Injectable({ providedIn: 'root' })
export class RolesService {
    public user: Observable<Roles>;
    private headers: HttpHeaders;
    constructor(
        private http: HttpClient
    ) { }

    guardar(Roles): any {
        return this.http.post(`${environment.apiUrl}/api/roles/`, Roles, {headers: this.headers});
    }
    actualizar(Roles): any {
        return this.http.put(`${environment.apiUrl}/api/roles/`, Roles, {headers: this.headers});
    }
    obtenerByIdRoles(variable): any {
        return this.http.get<any>(`${environment.apiUrl}/api/roles/` + variable, {headers: this.headers});
    }
     ObtenerRoles(IdUsuario): any {
        return this.http.get<any>(`${environment.apiUrl}/api/roles/Roles/` + IdUsuario, {headers: this.headers});
     }
     ObtenerRolesMenu(variable): any {
        console.log('variable', variable)
       return this.http.get<any>(`${environment.apiUrl}/api/roles/Rolesmenu/` + variable, {headers: this.headers});
    }
}
