import {Component, DoCheck, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {animate, style, transition, trigger} from '@angular/animations';
import {DattaConfig} from '../../../../../app-config';
import { Subscription } from 'rxjs';
import { GlobalConstants } from '../../../../../../commons/global-constants';
import { MensajeSignalR } from '../../../../../shared/services/signal-r.service';
import { UsuarioService } from '../../../../../shared/services/usuario.service';
import { Usuario } from '../../../../../shared/models/usuario';
import { TipoMensajeSignalR, TipoPerfil } from '../../../../../shared/enumeracion/enums';
import { ControlDeCitasService } from '../../../../../shared/services/control-de-citas.service'
@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class NavRightComponent implements OnInit, DoCheck {
  public visibleUserList: boolean;
  public chatMessage: boolean;
  public friendId: boolean;
  public dattaConfig: any;
  public layout = 2;
  public nuevaNotificacion = false;
  public totalDeNotificaciones: number;
  public masDeNueveNotificaciones: boolean = false;

  sbcGSignal: Subscription;
  usuarioActual: Usuario;

  
  constructor(
    config: NgbDropdownConfig, 
    private usuarioService: UsuarioService,
    private controlDeCitasService: ControlDeCitasService
  ) {
    config.placement = 'bottom-right';
    this.visibleUserList = false;
    this.chatMessage = false;
    this.dattaConfig = DattaConfig.config;
  }

  ngOnInit() {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.obtenerTotalNotificaciones(this.usuarioActual.idSede);
    this.sbcGSignal = GlobalConstants.gSignalService.signalReceived.subscribe((trama: MensajeSignalR) => {
      this.procesarMensajeSignalR(trama);
    });
  }

  onChatToggle(friend_id) {
    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;
  }

  Lock(){
    localStorage.clear();
    window.location.reload();
  }

  ngDoCheck() {
    if (document.querySelector('body').classList.contains('datta-rtl')) {
      this.dattaConfig['rtl-layout'] = true;
    } else {
      this.dattaConfig['rtl-layout'] = false;
    }
  }

  obtenerTotalNotificaciones(idSede: number){
    if(this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil == TipoPerfil.SISTEMAS || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA || this.usuarioActual.idperfil == TipoPerfil.COORDINADOR_VENTAS_Y_MARKETING || this.usuarioActual.idperfil == TipoPerfil.ADMINISTRADOR || this.usuarioActual.idperfil == TipoPerfil.GERENCIA){
      this.controlDeCitasService.totalDeNotificaciones(idSede).subscribe((data: any) => {
        this.totalDeNotificaciones = data > 9 ? 9 : data;
        this.masDeNueveNotificaciones = data > 9 ? true : false;

        if(this.totalDeNotificaciones > 0){
          this.nuevaNotificacion = true;
        } else{
          this.nuevaNotificacion = false
        }

      })
    }
  }

  procesarMensajeSignalR(trama: MensajeSignalR): void {
    switch (trama.tipo) {
      case TipoMensajeSignalR.NotificacionDePago: {
        const totalNotificacionesPorSede: any = JSON.parse( trama.datosJSON );
        if((this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil == TipoPerfil.SISTEMAS || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA || this.usuarioActual.idperfil == TipoPerfil.COORDINADOR_VENTAS_Y_MARKETING || this.usuarioActual.idperfil == TipoPerfil.ADMINISTRADOR || this.usuarioActual.idperfil == TipoPerfil.GERENCIA) && this.usuarioActual.idSede === totalNotificacionesPorSede.IdSedeNotifiacion){ 
          this.obtenerTotalNotificaciones(this.usuarioActual.idSede);
        } 
        break;
      }

      case TipoMensajeSignalR.CitaPagada: {
        this.obtenerTotalNotificaciones(this.usuarioActual.idSede); 
        break;
      }
    }
  }
}
