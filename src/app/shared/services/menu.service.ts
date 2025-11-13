import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private _menuItems: any = [];
  private enviarDatosMenuSubject = new Subject<any>();
  enviarDatosObservable = this.enviarDatosMenuSubject.asObservable();
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

  enviarMenu(menuItems: any) {
    this._menuItems = menuItems;
    this.enviarDatosMenuSubject.next(menuItems);
  }

  obtenerMenu(idUsuario): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/menu/${idUsuario}`, {headers: this.headers});
  }

  obtenerMenuConfiguracion(idUsuario): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/menu/configuracion/${idUsuario}`, {headers: this.headers});
  }

  obtenerMenuByPerfil(idPerfil: number): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/usuario/menu/perfil/${idPerfil}`, {headers: this.headers});
  }

  // MenuExport(menuItems: any): boolean {
  //   this._menuItems = menuItems;
  //   return true;
  // }
  // MenuImport(): any{
  //   return this._menuItems;
  // }

}
