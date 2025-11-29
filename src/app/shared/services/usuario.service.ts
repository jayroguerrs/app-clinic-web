import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {Usuario, UsuarioActualizarDatos} from 'src/app/shared/models/usuario';
import {catchError, map} from "rxjs/operators";
import {User} from "../../corporal360/shared/model/usuario";
import {ErrorSistema} from "../models/error-sistema";
import { AprobarUsuario, ConfirmarUsuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

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

    // Permisos
    valAccess(param:any): any {      
      return this.http.post(`${environment.apiUrl}/api/permisos/obtener-permisos`, param, {headers: this.headers});
    }

    obtenerListadoGrilla(): Observable<any> {        
        return this.http.get<any>(`${environment.apiUrl}/api/usuario/listadoGrilla`, {headers: this.headers});
    }

    obtenerListadoGrillaBySupervisor(idSupervisor: number): Observable<any> {        
        return this.http.get<any>(`${environment.apiUrl}/api/usuario/listadoGrillaBySupervisor/${idSupervisor}`, {headers: this.headers});
    }
    
    confirmarSupervisor(model: ConfirmarUsuario): Observable<any> {        
        return this.http.post<any>(`${environment.apiUrl}/api/usuario/confirmarSupervisor`, model, {headers: this.headers});
    }

    cambiarEstadoAprobacion(model: AprobarUsuario): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/usuario/aprobarUsuario`, model, {headers: this.headers});
    }

    obtenerEstadoAprobacionUsuario(idUsuario: number): Observable<IIsApproved>{
      return this.http.get<IIsApproved>(`${environment.apiUrl}/api/usuario/obtenerEstadoAprobadoByUsuario/${idUsuario}`, {headers: this.headers});
    }

    obtenerPrivilegioUsuario(idUsuario: number): Observable<IGetPrivilegio>{
      return this.http.get<IGetPrivilegio>(`${environment.apiUrl}/api/usuario/obtenerPrivilegioByUsuario/${idUsuario}`, {headers: this.headers});
    }

    obtenerSupervisores(){
      return this.http.get<any>(`${environment.apiUrl}/api/usuario/listadoDeSupervisores`, {headers: this.headers});
    }

    obtenerUsuarios(idEstado): Observable<any[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/usuario/estado/${idEstado}`, {headers: this.headers});
    }

    obtenerUsuarioResponsableCaja(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/usuario/responsableCaja`, {headers: this.headers});
    }

    obtenerByLikeNombre(nombre): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/usuario/search/${nombre}`, {headers: this.headers});
    }

    usuarioObtenerById(id: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/usuario/${id}`, {headers: this.headers});
    }

    guardar(usuario): any {
        return this.http.post(`${environment.apiUrl}/api/usuario`, usuario, {headers: this.headers});
    }

    actualizar(usuario): any {
        return this.http.put(`${environment.apiUrl}/api/usuario`, usuario, {headers: this.headers});
    }

    obtenerByIdPerfil(idPerfil: string, idSede?: number): any {
        return this.http.get<any>(`${environment.apiUrl}/api/usuario/perfil/${idPerfil},${idSede}`, {headers: this.headers});
    }

    obtenerByIdPerfilTemp(idUsuario?: number): any {
      return this.http.get<any>(`${environment.apiUrl}/api/usuario/perfil/${idUsuario}`, {headers: this.headers});
  }

    obtenerToCita(): any {
      return this.http.get<any>(`${environment.apiUrl}/api/usuario/lista-para-cita`, {headers: this.headers});
    }

    obtenerParaPreferentes(): any {
      return this.http.get<any>(`${environment.apiUrl}/api/usuario/perfil/preferentes`, {headers: this.headers});
    }
    obtenerParaPreferentesPorId(idPerfil: number): any {
      return this.http.get<any>(`${environment.apiUrl}/api/usuario/perfil/preferentes/${idPerfil}`, {headers: this.headers});
    }

    cambiarClave(model): any {
        return this.http.put(`${environment.apiUrl}/api/usuario/cambiarClave`, model, {headers: this.headers});
    }


    get UsuarioActual(): Usuario{
        const userKey = JSON.parse( localStorage.getItem('usersKey'));
        let usuario: any;
        if(userKey != null) {
            usuario = new Usuario(
                            userKey.idUsuario,
                            userKey.nombre,
                            userKey.usuario,
                            '',
                            userKey.idPerfil,
                            1,
                            '',
                            userKey.idSede,
                            userKey.foto
                            );
            usuario.genero = userKey.genero;
            usuario.menu = userKey.menu;
            usuario.perfil = userKey.perfil;
            usuario.sede = userKey.sede;
            usuario.newMenu = userKey.new_menu;
            usuario.datosActualizados = userKey.datosActualizados;
            usuario.idSupervisor = userKey.idSupervisor;
            usuario.aprobado = userKey.aprobado;
            usuario.privilegio = userKey.privilegio;
            usuario.claveGenerica = userKey.claveGenerica;
        }
        return usuario;
    }


  collectionByEstado(idEstado: number): Observable<User[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/usuario/collection/${idEstado}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: User[] = [];

        if(res.status === 200){
          res.data.forEach(x => {
            const model = new User();
            model.id = x.id;
            model.nombre = x.nombre;
            collection.push(model);
          });
        }

        return collection;
      }), catchError((err)=> {
        return throwError(err);
      })
    );
  }



  ObtenerClave(idUsuario: number): Observable<string | ErrorSistema> {    
    return this.http.get<any>(`${environment.apiUrl}/api/usuario/${idUsuario}/obtener-clave`, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return res.data;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.message = res.status;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  obtenerClaveUsuario(idUsuario: number): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/api/usuario/verClaveUsuario/${idUsuario}`)
  }

  actualizarDatosUsuario(model: UsuarioActualizarDatos): Observable<UsuarioActualizarDatos>{
    return this.http.put<any>(`${environment.apiUrl}/api/usuario/actualizarDatos`, model)
  }

  generarClaveGenerica(idUsuario: number): Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/api/usuario/generarClaveGenerica/${idUsuario}`, {})
  }

  CambiarClave(idUsuario: number, clave: string): Observable<boolean | ErrorSistema> {
    return this.http.put<any>(`${environment.apiUrl}/api/usuario/cambiar-clave`, {claveNueva: clave, idUsuario: idUsuario}, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.message = res.status;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  cambiarClaveGenerica(idUsuario: number, clave: string): Observable<boolean | ErrorSistema> {
    return this.http.put<any>(`${environment.apiUrl}/api/usuario/cambiar-clave-generica`, {claveNueva: clave, idUsuario: idUsuario}, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.message = res.status;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  private usuarioActualSubject = new BehaviorSubject<Usuario>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

  actualizarUsuarioActual(usuario: Usuario): void {
    this.usuarioActualSubject.next(usuario);
  }

  
}

export interface IGetPrivilegio {
    privilegio:       Privilegio;
    estadoAprobacion: 0 | 1 | 3;
}

export enum Privilegio {
  ConfidantStaff = 3,
  Admin = 6,
  SuperAdmin = 9,
}

export interface IIsApproved {
    data: 0 | 1 | 3;
}
