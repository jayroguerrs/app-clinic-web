import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { CONFIG } from 'src/app/shared/configuracion/config';
import { environment } from 'src/environments/environment';
import { ZonaCorporal } from 'src/app/componentes/preferente/preferente.models';
import {catchError, map, tap} from "rxjs/operators";
import { Zona } from '../models/zonas';

@Injectable({
  providedIn: 'root'
})
export class ZonaCorporalService {
  url: string;
  versionapi: string;
  private headers: HttpHeaders;

  constructor(
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
  obtener(): Observable<ZonaCorporal[]> {
    return this.http.get<ZonaCorporal[]>(`${environment.apiUrl}/api/zonacorporal`, {headers: this.headers});
  }
  obtenerListadoGrilla(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/zonacorporal/listado`, {headers: this.headers});
  }
  obtenerZonasCorporalesByNombre(descripcion: string): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/zonacorporal/search/${descripcion}`, {headers: this.headers});
  }
  obtenerListadoZonaServicio(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/ZonaCorporal/zona-servicio`, {headers: this.headers});
  }
  zonaCorporalByGeneroListar(idGenero: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/genero/${idGenero}`, {headers: this.headers});
  }
  zonaCorporalByGeneroByServicioListar(idGenero: number, idServicio: number): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/genero-servicio/${idGenero}/${idServicio}`, {headers: this.headers});
  }
  zonaCorporalByGeneroByPromocionListar(idGenero: number, idPromocion: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/genero/${idGenero}/${idPromocion}`, {headers: this.headers});
  }
  zonaCorporalByGeneroByPromocionByServicioListar(idGenero: number, idPromocion: number, idServicio: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/genero/${idGenero}/${idPromocion}/${idServicio}`, {headers: this.headers});
  }
  obtenerById(idZonaCorporal: number): any {
      return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/${idZonaCorporal}`, {headers: this.headers});
  }
  ObtenerZonaByCita(idcita): any {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/cita/${idcita}`, {headers: this.headers});
  }
  guardar(zona): any {
      return this.http.post(`${environment.apiUrl}/api/zonacorporal`, zona, {headers: this.headers});
  }
  actualizar(zona): any {
      return this.http.put(`${environment.apiUrl}/api/zonacorporal`, zona, {headers: this.headers});
  }
  obtenerZonasParaSubZonas( idZona: number ): Observable<any[]> {
    return this.http.get<ZonaCorporal[]>(`${environment.apiUrl}/api/zonacorporal/${idZona}/listarZonas`, {headers: this.headers});
  }

  asignarSubZonas( idZona:number, idZones: number[] ): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/zonacorporal/${idZona}/subZonas`, idZones, {headers: this.headers})
      .pipe(
        tap(res=> {
          // console.log(res);
          if(res.exito){
            return res;
          }else{
            return throwError(res.errorDetalle, res.errorNumero);
          }
        }),
        catchError(err => {
          return throwError(err.message, err.code);
        })
      );
  }


  obtenerSubZonasById( id: number ): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/${id}/subZonas`, {headers: this.headers})
      .pipe(
        map(res=> {
          if( res.status === 200 ){
            return res.data;
          }else{
            throwError(res.message);
          }
        }),
        catchError(err => {
          return throwError(err.message, err.code);
        })
      );
  }

  ObtenerTop10Atendidas(fechaInicio: string, fechaFin: string, idSede: number, idGenero: number, numeroSesion: number, idTipo: number): Observable<Zona[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/top10/cantidad/${fechaInicio}/${fechaFin}/${idSede}/${idGenero}/${numeroSesion}/${idTipo}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: Zona[] = [];

        if(res.status === 200){
          res.data.forEach( x => {

            const zona = new Zona();
            zona.id = x.id;
            zona.nombre = x.zona;
            zona.genero = x.genero;
            zona.cantidad = x.cantidad;

            collection.push(zona);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  ObtenerCantidadAtendidas(fechaInicio: string, fechaFin: string, idSede: number, idGenero: number, numeroSesion: number, idTipo: number): Observable<Zona[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/cantidad/${fechaInicio}/${fechaFin}/${idSede}/${idGenero}/${numeroSesion}/${idTipo}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: Zona[] = [];

        if(res.status === 200){
          res.data.forEach( x => {

            const zona = new Zona();
            zona.id = x.id;
            zona.nombre = x.zona;
            zona.genero = x.genero;
            zona.cantidad = x.cantidad;

            collection.push(zona);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  obtenerListadoPorServicio(idServicio: number): Observable<Zona[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/zonacorporal/servicio/${idServicio}`, {headers: this.headers}).pipe(
      map((res: any) => {
        const collection: Zona[] = [];
        if(res.status !== 200){
          throw new Error(res.message);
        }else{
          res.data.forEach(x => {
            const model = new Zona();
            model.id = x.id;
            model.descripcion = x.descripcion;
            model.descripcionLarga = x.descripcionLarga;
            model.duracion = x.duracion;
            model.genero = x.genero;
            model.idEstado = x.idEstado;
            model.idServicio = x.idServicio;
            model.servicio = x.servicio;
            model.servicioColor = x.servicioColor;
            model.idTipo = x.idTipo;
            model.sesion = x.sesion;
            model.igv = x.igv;
            model.precioBase = x.precioBase;
            model.precioDescuento = x.precioDescuento;
            collection.push(model);
          })

        }
        return collection;
      }), catchError((err) => {
        return throwError(err);
      })
    );
  }

}
