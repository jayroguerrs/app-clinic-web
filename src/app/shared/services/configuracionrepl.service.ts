import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { configuracionrepl } from '../../documentacion/_models/configuracionrepl';

@Injectable({ providedIn: 'root' })

export class ConfiguracionReplService {
    private userSubject: BehaviorSubject<configuracionrepl  >;
    public user: Observable<configuracionrepl  >;

    constructor(
        private router: Router,
        private http: HttpClient
    ) { 
    }

    actualizar(IdConfiguracion, configuracionrepl): any {
        console.log("services Configuracion RPL update ", configuracionrepl );
        return this.http.put(`${environment.apiUrl}/api/configuracionrepl/` + IdConfiguracion, configuracionrepl);
    }
    dniidconfiguracion(variableunidad): any {
        console.log("services Traer Informacion Configuracion ", variableunidad );
        return this.http.get<any>(`${environment.apiUrl}/api/configuracionrepl/`+ variableunidad);
    }


}