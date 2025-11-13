import { EventEmitter, Injectable, QueryList } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import {TipoEventoSignalR} from "../enumeracion/enums";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;
  signalReceived = new EventEmitter<any>();
  eventReceived = new EventEmitter<any>();
  idConexionSignalR: any;
  idUsuario: number;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {
    this.headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    });
    this.idUsuario = this.usuarioService.UsuarioActual == undefined ? 0 : this.usuarioService.UsuarioActual.idUsuario;
    this.buildConnection(this.idUsuario);
    this.startConnection();
  }

  public buildConnection(idUsuario: number): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}${environment.proxySignalR}?idUsuario=${idUsuario}`)
    .build();
  }

  public startConnection = () => {
    this.hubConnection
    .start()
    .then(() => {
      this.registerSignalEvents();
    })
    .catch( error =>
      console.log('Error de conexion' + error)
    );
  }

  private registerSignalEvents(): void {
    console.log('Conexion realizada...');
    this.hubConnection.on('mensajeroSignal', (data: MensajeSignalR) => {
      data.datos = JSON.parse(data.datosJSON);
      this.signalReceived.emit(data);
    });
    this.hubConnection.on('eventoSignal', (data: EventoSignalR) => {
      this.eventReceived.emit(data);
    });
  }

  preferenteEscanearTeleoperador(): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/signalr/escanearPregunta`, {headers: this.headers});
  }
  preferenteResponderEscaneo(usuario: Usuario): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/api/signalr/escanearRespuesta`, usuario, {headers: this.headers});
  }
  identificarUsuario(identificacion): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/api/signalr/identificacionUsuario`, identificacion, {headers: this.headers});
  }
  enviarMensajeGeneral(mensaje: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/signalr/MensajeGeneral/${mensaje}`, {headers: this.headers});
  }
  enviarEvento(idTipoEvento: TipoEventoSignalR, idUsuario: number, idUsuarioActual: number): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/signalr/evento/${idTipoEvento}/${idUsuario}/${idUsuarioActual}`, {headers: this.headers});
  }
}

export class MensajeSignalR
{
  public exito: boolean;
  public mensaje: string;
  public idPerfil: number;
  public datosJSON: any;
  public tipo: number;
  public datos: any;
  constructor() {
  }
}

export class EventoSignalR
{
  public tipo: number;
  public idUsuario: number;
  public idUsuarioActual: number;
  constructor() {
  }
}
