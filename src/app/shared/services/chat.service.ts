import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../configuracion/config';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
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

  obtenerUsuarioListaChat(idUsuario: number): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/chat/${idUsuario}`, {headers: this.headers});
  }
  grabar(chat): any{
    return this.http.post(`${environment.apiUrl}/api/chat`, chat, {headers: this.headers});
  }
  actualizar(chat): any {
    return this.http.put(`${environment.apiUrl}/api/chat`, chat, {headers: this.headers});
  }
  obtenerMensajes(idDeUsuario: number, idParaUsuario: number): Observable<object[]>{
    return this.http.get<object[]>(`${environment.apiUrl}/api/chat/mensajes/${idDeUsuario}/${idParaUsuario}`, {headers: this.headers});
  }
  actualizarMensajeLeido(idDeUsuario, idParaUsuario) {
    return this.http.get(`${environment.apiUrl}/api/chat/mensajes/leido/${idDeUsuario}/${idParaUsuario}`, {headers: this.headers});
  }
}
