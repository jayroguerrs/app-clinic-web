import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {Cita, CitaDetalle} from "../../models/corporal-360/Cita";
import {Observable} from "rxjs/Observable";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {ErrorSistema} from "../../models/error-sistema";

@Injectable({ providedIn: 'root' })

export class Cita360Service {

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
    create(cita: Cita): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/api/cita360`, cita, {headers: this.headers}).pipe(
          map((res) => {
            if(res.status === 201){
              return true;
            }else{
              throw throwError(res.message);
            }
          }),catchError((err)=> {
            return throwError(err);
          })
        );
    }

  update(cita: Cita): Observable<boolean> {
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/${cita.idCita}`, cita, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          throw throwError(res.message);
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }
    findByCronograma(idCronograma: number): Observable<Cita[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/cita360/cronograma/${idCronograma}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: Cita[] = [];
          if(res.status === 200){
            res.data.forEach(x => {
              const m = new Cita();
              m.idCita = x.idCita;
              m.fechaCita = new Date(x.fechaCita);
              m.minutos = 30;
              m.idServicio = x.idServicio;
              m.servicio = x.servicio;
              m.servicioColor = x.servicioColor;
              m.detalles = x.detalles.map(x => {
                const m = new CitaDetalle();
                m.idTecnologia = x.idTecnologia;
                m.tecnologia = x.tecnologia;
                m.tecnologiaNombreCorto = x.tecnologiaNombreCorto;
                return m;
              });
              collection.push(m);
            });
          }
          return collection;
        }),catchError((err)=> {
          return throwError(err);
        })
      );
    }

  findById(idCita: number): Observable<Cita> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita360/${idCita}`, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
            const x = res.data;
            const m = new Cita();
            m.idCita = x.idCita;
            m.fechaCita = new Date(x.fechaCita);
            m.minutos = 30;
            m.idMaquina = x.idMaquina;
            m.idServicio = x.idServicio;
            m.idEstado = x.idEstado;
            m.servicio = x.servicio;
            m.servicioColor = x.servicioColor;
            m.horaInicio = x.horaInicio;
            m.horaTermino = x.horaTermino;
            m.idTipoCita = x.idTipoCita;
            m.idSede = x.idSede;
            m.atendidoPor = x.atendidoPor;
            m.numeroBox = x.numeroBox;
            m.detalles = x.detalles.map(x => {
              const sm = new CitaDetalle();
              sm.idTecnologia = x.idTecnologia;
              sm.tecnologia = x.tecnologia;
              sm.tecnologiaNombreCorto = x.tecnologiaNombreCorto;
              return sm;
            });

            // secondary
            m.maquina = x.maquina;
            m.sede = x.sede;
            m.tipoCita = x.tipoCita;
            return m;
        }else{
          throw throwError(res.message);
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }

  cancel(cita: Cita): Observable<boolean | ErrorSistema> {
      const c = cita;
      c.detalles = [];
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/cancelar`, c, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }

  earring(cita: Cita): Observable<boolean | ErrorSistema> {
    const c = cita;
    c.detalles = [];
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/pendiente`, c, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }

  bad(cita: Cita): Observable<boolean | ErrorSistema> {
    const c = cita;
    c.detalles = [];
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/anular`, c, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }

  confirm(cita: Cita): Observable<boolean | ErrorSistema> {
    const c = cita;
    c.detalles = [];
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/confirmar`, c, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }

  confirmAttendance(cita: Cita): Observable<boolean | ErrorSistema> {
    const c = cita;
    c.detalles = [];
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/confirmarAsistencia`, c, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }

  attend(cita: Cita): Observable<boolean | ErrorSistema> {
    const c = cita;
    c.detalles = [];
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/atender`, c, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }


  notCall(cita: Cita): Observable<boolean | ErrorSistema> {
    const c = cita;
    c.detalles = [];
    return this.http.put<any>(`${environment.apiUrl}/api/cita360/nollamar`, c, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }
      }),catchError((err)=> {
        return throwError(err);
      })
    );
  }

}
