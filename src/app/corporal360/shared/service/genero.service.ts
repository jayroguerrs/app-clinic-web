import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {Caso} from "../model/caso";
import {Genero} from "../model/genero";

@Injectable({ providedIn: 'root' })
export class GeneroService {
    public user: Observable<Caso>;
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

    listar(): Observable<Genero[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/genero`, {headers: this.headers}).pipe(
          map((res) =>{
            const collection: Genero[] = [];
              res.forEach((item) => {
                const model = new Genero();
                model.id = item.id;
                model.nombre = item.descripcion;
                model.activo = !!item.activo;
                collection.push(model);
              });

            return collection;
          }),catchError((e) => {
            return throwError(e);
          })
        );
    }

  listarByEstado(idEstado: number): Observable<Genero[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/genero/estado/${idEstado}`, {headers: this.headers}).pipe(
      map((res) =>{
        const collection: Genero[] = [];
        res.forEach((item) => {
          const model = new Genero();
          model.id = item.id;
          model.nombre = item.descripcion;
          model.activo = !!item.activo;
          collection.push(model);
        });

        return collection;
      }),catchError((e) => {
        return throwError(e);
      })
    );
  }

}
