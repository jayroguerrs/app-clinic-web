import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ControlDeCitasService } from '../../../../../../shared/services/control-de-citas.service';
import { Subscription } from 'rxjs';
import { GlobalConstants } from '../../../../../../../commons/global-constants'
import { MensajeSignalR } from '../../../../../../shared/services/signal-r.service';
import { TipoMensajeSignalR, TipoPerfil } from '../../../../../../shared/enumeracion/enums';
import { Usuario } from '../../../../../../shared/models/usuario';
import { UsuarioService } from '../../../../../../shared/services/usuario.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent implements OnInit {
  @Output() onChatCollapse = new EventEmitter();
  @Output() onChatToggle = new EventEmitter();
  public friendsList: any;
  public searchFriends: string;
  public layout = 1;
  usuarioActual: Usuario;
  notificaciones: any[];

  sbcGSignal: Subscription;

  constructor(
    private controlDeCitasService: ControlDeCitasService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.obtenerListadoDeNotificaciones();
    this.sbcGSignal = GlobalConstants.gSignalService.signalReceived.subscribe((trama: MensajeSignalR) => {
      this.procesarMensajeSignalR(trama);
    });

  }
  
  obtenerListadoDeNotificaciones(){
    if(this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil == TipoPerfil.SISTEMAS || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA || this.usuarioActual.idperfil == TipoPerfil.COORDINADOR_VENTAS_Y_MARKETING || this.usuarioActual.idperfil == TipoPerfil.ADMINISTRADOR || this.usuarioActual.idperfil == TipoPerfil.GERENCIA){
      this.controlDeCitasService.listadoDeNotificaciones(this.usuarioActual.idSede).subscribe((data: any) => {
        this.notificaciones = data;
      })

    }
  }

  onChatOn(friend_id) {
    this.onChatToggle.emit(friend_id);
  }

  completarNotificacion(idNotificacion: number){
    this.controlDeCitasService.completarNotificacion(idNotificacion).subscribe((data: any) => {
      if(data.status == 200){
        this.obtenerListadoDeNotificaciones();
      }
    })
  }

  revisarCita(celularCliente: string, fechaCita: string, idcita: number){
    this.controlDeCitasService.celularPaciente = celularCliente;
    this.controlDeCitasService.fechaCita = fechaCita;
    
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['/CitaListado']);
    // });
    this.router.navigate(['/Inicio'], { queryParams: { idCitaRevisar: idcita } });
  }

  procesarMensajeSignalR(trama: MensajeSignalR): void {


      switch (trama.tipo) {
        case TipoMensajeSignalR.NotificacionDePago: {
          const totalNotificacionesPorSede: any = JSON.parse( trama.datosJSON );
          if((this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil == TipoPerfil.SISTEMAS || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA || this.usuarioActual.idperfil == TipoPerfil.COORDINADOR_VENTAS_Y_MARKETING || this.usuarioActual.idperfil == TipoPerfil.ADMINISTRADOR || this.usuarioActual.idperfil == TipoPerfil.GERENCIA) && this.usuarioActual.idSede === totalNotificacionesPorSede.IdSedeNotifiacion){
            this.obtenerListadoDeNotificaciones();
          } 
          break;
        }

        case TipoMensajeSignalR.CitaPagada: {
            this.obtenerListadoDeNotificaciones(); 
          break;
        }
      }
  }
}
