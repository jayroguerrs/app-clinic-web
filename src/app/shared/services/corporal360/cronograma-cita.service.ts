import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ErrorSistema} from "../../models/error-sistema";
import {CronogramaCita, CronogramaCita_Cita} from "../../models/corporal-360/Cita";

@Injectable({ providedIn: 'root' })
export class CronogramaCitaService {
    public user: Observable<CronogramaCita>;
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

    create(CronogramaCita: CronogramaCita): Observable<number | ErrorSistema >{
      return this.http.post(`${environment.apiUrl}/api/360/CronogramaCita`, CronogramaCita, {headers: this.headers}).pipe(
        map((res: any) =>{
          if(res.status === 201 ){
            return res.data;
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

    update(CronogramaCita: CronogramaCita): Observable<boolean | ErrorSistema >{
      return this.http.put(`${environment.apiUrl}/api/360/CronogramaCita/${CronogramaCita.id}`, CronogramaCita, {headers: this.headers}).pipe(
        map((res: any) =>{
          if(res.status === 200 ){
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

    find(id: number): Observable<CronogramaCita | ErrorSistema>{
      return this.http.get(`${environment.apiUrl}/api/360/CronogramaCita/${id}`, {headers: this.headers}).pipe(
        map((res: any) =>{
          if(res.status === 200 ){
            const data = res.data;
            const m = new CronogramaCita();
            m.id = data.id;
            //m.uuid = data.uuid;
            m.idCliente = data.idCliente;
            m.idSede = data.idSede;
            m.idTipoCliente = data.idTipoCliente;
            m.idServicio = data.idServicio;
            m.idTratamiento = data.idTratamiento;
            m.idZona = data.idZona;
            m.precio = data.precio;
            // m.semanas = data.semanas;
            m.idUsuarioRegistro = data.idUsuarioRegistro;
            m.fechaRegistro = new Date(data.fechaRegistro);
            m.idUsuarioModifico = data.idUsuarioModifico;
            m.fechaModifico = data.fechaModifico ? new Date(data.fechaModifico) : null;

            // m.semanas = data.semanas.map(x => {
            //   const s = new CronogramaCitaSemana();
            //   s.inicio = new Date(x.inicio);
            //   s.fin = new Date(x.fin);
            //   console.log(s);
            //   return s;
            // })

            m.usuarioRegistro = data.usuarioModifico;
            m.usuarioModifico = data.usuarioModifico;

            return m;
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

  // listWeeks(uuid: string, id: number): Observable<CronogramaCitaSemana[]>{
  //   return this.http.get(`${environment.apiUrl}/api/360/CronogramaCita/semanas/${uuid}/${id}`, {headers: this.headers}).pipe(
  //     map((res: any) =>{
  //       const collection: CronogramaCitaSemana[] = [];
  //       if(res.status === 200 ){
  //
  //         res.data.map(x => {
  //           const s = new CronogramaCitaSemana();
  //           s.inicio = new Date(x.inicio);
  //           s.fin = new Date(x.fin);
  //           collection.push(s);
  //         })
  //
  //       }
  //       return collection;
  //     }), catchError((e) => {
  //       throw e;
  //     })
  //   );
  // }


  collectionByClient(idCliente: number, idServicio: number): Observable<CronogramaCita[]>{
    return this.http.get(`${environment.apiUrl}/api/360/CronogramaCita/cliente/${idCliente}/${idServicio}`, {headers: this.headers}).pipe(
      map((res: any) =>{
        const collection: CronogramaCita[] = [];
        if(res.status === 200 ){

          res.data.map(x => {
            const s = new CronogramaCita();
            s.id = x.id;
            // s.uuid = x.uuid;
            s.idCliente = x.idCliente;
            s.idServicio = x.idServicio;
            s.servicio = x.servicio;
            s.servicioColor = x.servicioColor;
            s.idZona = x.idZona;
            s.zona = x.zona;
            s.idTratamiento = x.idTratamiento;
            s.tratamiento = x.tratamiento;
            s.idSede = x.idSede;
            s.sede = x.sede;
            s.precio = x.precio;
            s.fechaRegistro = x.fechaRegistro;
            s.idUsuarioRegistro = x.idUsuarioRegistro;
            s.usuarioRegistro = x.usuarioRegistro;
            s.idUsuarioModifico = x.idUsuarioModifico;
            s.usuarioModifico = x.usuarioModifico;
            s.fechaModifico = x.fechaModifico ? new Date(x.fechaModifico) : null;
            s.numeroCitas = x.numeroCitas;
            s.idPreferente = x.idPreferente;

            collection.push(s);
          })

        }
        return collection;
      }), catchError((e) => {
        throw e;
      })
    );
  }


  listCitas(idCronograma: number): Observable<CronogramaCita_Cita[]>{
    return this.http.get(`${environment.apiUrl}/api/360/CronogramaCita/${idCronograma}/citas`, {headers: this.headers}).pipe(
      map((res: any) =>{
        const collection: CronogramaCita_Cita[] = [];
        if(res.status === 200 ){

          res.data.map(x => {
            const s = new CronogramaCita_Cita();
            s.id = x.id;
            s.fecha = new Date(x.fecha);
            s.idEstado = x.idEstado;
            s.idTipoCita = x.idTipoCita;
            s.estado = x.estado;
            s.estadoColor = x.estadoColor;
            s.detalles = x.detalles;
            s.idPreferente = x.idPreferente;
            collection.push(s);
          })

        }
        return collection;
      }), catchError((e) => {
        throw e;
      })
    );
  }

}
