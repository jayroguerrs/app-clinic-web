import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs/Observable";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {MaquinaSede, MaquinaSedeDisponible} from "../../models/corporal-360/MaquinaSede";
import {ErrorSistema} from "../../models/error-sistema";
import {Tecnologia} from "../../models/tecnologia";

@Injectable({ providedIn: 'root' })

export class MaquinaSede360Service {

    headers: HttpHeaders;
    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }

    searchAvailable(fechaInicio: string, fechaFin: string, idServicio: number, idSede: number): Observable<MaquinaSedeDisponible[]> {
      /* Función para buscar el porcentaje de tiempo disponible en total de las maquinas */
      return this.http.get<any>(`${environment.apiUrl}/api/maquinaSede360/fecha-disponible/${fechaInicio}/${fechaFin}/${idServicio}/${idSede}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: MaquinaSedeDisponible[] = [];
          if(res.status === 200){
            res.data.forEach(x => {
              const m = new MaquinaSedeDisponible();
              m.fecha = new Date(x.fecha);
              m.idServicio = x.idServicio;
              m.idSede = x.idSede;
              m.porcentaje = x.porcentaje;

              // secondary
              m.servicio = x.servicio;
              m.sede = x.sede;
              collection.push(m);
            });
          }
          return collection;
        }),catchError((err)=> {
          return throwError(err);
        })
      );
    }

    listByDate(fecha: string, idServicio: number, idSede: number): Observable<MaquinaSede[]> {
      /* Función para buscar el porcentaje de tiempo disponible en total de las maquinas */
      return this.http.get<any>(`${environment.apiUrl}/api/maquinaSede360/maquina-disponible/${fecha}/${idServicio}/${idSede}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: MaquinaSede[] = [];
          if(res.status === 200){
            res.data.forEach(x => {
              const m = new MaquinaSede();
              m.idMaquina = x.idMaquina;
              m.idServicio = x.idServicio;
              m.idSede = x.idSede;
              m.porcentaje = x.porcentaje;

              // secondary
              m.servicio = x.servicio;
              m.sede = x.sede;
              m.maquina = x.maquina;
              m.tecnologias = x.tecnologias;
              collection.push(m);
            });
          }
          return collection;
        }),catchError((err)=> {
          return throwError(err);
        })
      );
    }

    asignarTecnologias(idMaquinaSede: number, model: MaquinaSede): Observable<boolean | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/maquinaSede360/tecnologias/${idMaquinaSede}`, model, {headers: this.headers}).pipe(
        map((res: any) =>{
          if(res.status === 201 ){
            return true;
          }else{
            const alerta = new ErrorSistema();
            alerta.status = res.status;
            alerta.message = res.message;
            return alerta;
          }
        }), catchError((e) => {
          throw e;
        })
      );
    }

    listarTecnologias(idMaquinaSede: number): Observable<Tecnologia[]>{
      return this.http.get<any>(`${environment.apiUrl}/api/maquinaSede360/tecnologias/${idMaquinaSede}`, {headers: this.headers}).pipe(
        map((res: any) =>{
          const collection: Tecnologia[] = [];
          if(res.status === 200 ){
            res.data.forEach((x) => {
              const model = new Tecnologia();
              model.id = x.id;
              model.idServicio = x.idServicio;
              model.nombre = x.nombre;
              collection.push(model);
            });
          }
          return collection;
        }), catchError((e) => {
          throw e;
        })
      );
    }

    searchByIdMaquina(idMaquina: number, fecha: string, idServicio: number, idSede: number): Observable<MaquinaSede> {
      /* Función para buscar la maquina y su porcentaje en cuanto tiempo libre o utilizado esta */
      return this.http.get<any>(`${environment.apiUrl}/api/maquinaSede360/maquina-disponible/${idMaquina}/${fecha}/${idServicio}/${idSede}`, {headers: this.headers}).pipe(
        map((res) => {
          const m = new MaquinaSede();
          if(res.status === 200){
              const data = res.data;
              m.idMaquina = data.idMaquina;
              m.porcentaje = data.porcentaje;
              m.idServicio = data.idServicio;
              m.idSede = data.idSede;
              m.maquina = data.maquina;
              m.servicio = data.servicio;
              m.sede = data.sede;
              m.tecnologias = data.tecnologias.map(x => {
                const t = new Tecnologia();
                t.id = x.id;
                t.nombre = x.nombre;
                t.nombreCorto = x.nombreCorto;
                return t;
              });
          }
          return m;
        }),catchError((err)=> {
          return throwError(err);
        })
      );
    }

}
