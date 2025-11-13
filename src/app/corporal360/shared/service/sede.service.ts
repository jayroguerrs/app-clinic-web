import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {Sede} from "../../../shared/models/sede";

@Injectable({ providedIn: 'root' })
export class SedeService {
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

    listar(): Observable<Sede[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/sede`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: Sede[] = [];
              res.forEach((item) => {
                const model = new Sede();
                model.id = item.idSede;
                model.nombre = item.nombre;

                collection.push(model);
              });

            return collection;
          }),catchError((e) => {
            return throwError(e);
          })
        );
    }

}
