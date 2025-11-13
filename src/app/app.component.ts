import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import Swal from 'sweetalert2';

import {SignalRService, MensajeSignalR, EventoSignalR} from './shared/services/signal-r.service';
import { UsuarioService } from './shared/services/usuario.service';
import { AccountService } from './shared/services/account.service';
import { UtilsService } from './shared/services/funciones/utils.service';
import { Usuario } from './shared/models/usuario';
import { ChatService } from './shared/services/chat.service';
import { GlobalConstants } from '../commons/global-constants';
import {TipoEventoSignalR, TipoMensajeSignalR, TipoPerfil} from './shared/enumeracion/enums';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { DEFAULT_INTERRUPTSOURCES, Idle, KeepaliveSvc } from '@ng-idle/core';
import { ParametroSistemaService } from './shared/services/parametro-sistema.service';
import {AuthService} from "./shared/services/auth.service";
import {EstadosService} from "./shared/services/estados.service";

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{ provide: Title }    ]
})
export class AppComponent implements OnInit {
  usuarios = [];
  usuarioActual: Usuario;
  chats = [];
  nombreUsuarioChat: string;
  idUsuarioChat: number;
  visibleListaUsuario = false;
  visibleChatUsuario = false;
  totalMensajes = 0;

  idleState = 'Not started.';
  timedOut = false;
  tiempoInactividad = 900;

  // Spinner
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private accountService: AccountService,
    private signalRService: SignalRService,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private idle: Idle,
    private keepAlive: KeepaliveSvc,
    private parametroSistemaService: ParametroSistemaService,
    private authService: AuthService,
    private estadosService: EstadosService
  ) {
      //Obtener los datos del usuario logeado
      this.usuarioActual = this.usuarioService.UsuarioActual;
      this.obtenerParametros();
      this.initializeApp();
      this.controlExpiraSesion();
  }
  obtenerParametros(): void {

  }
  controlExpiraSesion(): void {
    if(this.usuarioActual != null) {

      this.parametroSistemaService.obtenerById(8).subscribe(
        resultado => {
          this.tiempoInactividad = parseInt(resultado.response.valor, 10);

          this.idle.setIdle(this.tiempoInactividad);
          this.idle.setTimeout(10);
          this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
          this.idle.onTimeout.subscribe(() => {
            this.idleState = 'Sesión terminada!';
            this.logout();
            this.timedOut = true;
          });
          this.idle.onTimeoutWarning.subscribe(
            countdown => {
              this.idleState = 'La sesión se cerrará en ' + countdown + ' seconds!';
            }
          );
          this.idle.watch();

        },
        error => {
          console.log('Error al obtener los parametros', error);
        }
      );



    }
  }
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  logout(): void{
    this.accountService.logout();
  }
  ngOnInit(): void{
    if(this.usuarioActual != undefined) {
        this.inicializarChat();
    }


    GlobalConstants.gSignalService = this.signalRService;
    GlobalConstants.gSignalService.signalReceived.subscribe((trama: MensajeSignalR) => {
        this.procesarMensajeSignalR(trama);
        // console.log(trama);
    });

    GlobalConstants.gSignalService.eventReceived.subscribe((evento: EventoSignalR) => {
      this.procesarEventoSignalR(evento);
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }
      window.scrollTo(0, 0);
    });

    // SUSCRIBIRSE PARA EL TITULO DE LAS PAGINAS
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      var rt = this.getChild(this.activatedRoute)
      rt.data.subscribe(data => {
        this.titleService.setTitle(data.title)})
    })    
  }

  initializeApp(): void{
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  inicializarChat(): void {
    $('#listaUsuario').hide();
    $('#listaUsuario').hide();
    this.visibleListaUsuario = false;
    this.visibleChatUsuario = false;
    if(this.usuarioActual != undefined) {
      this.chatService.obtenerUsuarioListaChat(this.usuarioActual.idUsuario).subscribe(
        resultado => {
          this.usuarios = resultado
          this.contarTotalMensajes();
        });
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        this.mostrarListaUsuarios(false);
    }
}


  mostrarListaUsuarios(visible: boolean): void { this.visibleListaUsuario = visible; }
  mostrarChatUsuario(visible): void { this.visibleChatUsuario = visible; }
  abrirChat(nombreUsuario: string, idDeUsuario: number): void{
    this.visibleChatUsuario = true;
    this.nombreUsuarioChat = nombreUsuario;
    this.idUsuarioChat = idDeUsuario;
    this.chatService.obtenerMensajes(idDeUsuario, this.usuarioActual.idUsuario).subscribe(
      resultado => {
        this.chats = resultado;
        $(".scroll").stop().animate({ scrollTop: $(".scroll")[0].scrollHeight}, 1000);
        $('#chatUsuario').show();
        this.chatService.actualizarMensajeLeido(idDeUsuario, this.usuarioActual.idUsuario).subscribe(resultado =>  this.borrarMensajePendiente(idDeUsuario));
      });
  }
  borrarMensajePendiente(idDeUsuario): void {
    const usuario = this.usuarios.find(x => x.idUsuario == idDeUsuario);
    usuario.mensajeSinLeer = 0;
    this.contarTotalMensajes();
  }
  enviarMensaje(): void{
     const model = {
       idDeUsuario: this.usuarioActual.idUsuario,
       idParaUsuario: this.idUsuarioChat,
       texto: $('#msg').val()
     };
     this.chatService.grabar(model).subscribe(
       resultado => {
        this.chats.push(model);
        $('#msg').val('');
        $(".scroll").stop().animate({ scrollTop: $(".scroll")[0].scrollHeight}, 1000);
       }
     );
  }
  recibirMensaje(datos: any): void{
    const model = {
      idDeUsuario: datos.IdDeUsuario,
      idParaUsuario: datos.IdParaUsuario,
      texto: datos.Texto
    };
    this.chats.push(model);
    $(".scroll").stop().animate({ scrollTop: $(".scroll")[0].scrollHeight}, 1000);
    this.chatService.actualizarMensajeLeido(model.idDeUsuario, this.usuarioActual.idUsuario).subscribe(
      resultado => {
        this.borrarMensajePendiente(model.idDeUsuario);
        this.contarTotalMensajes();
      });
  }
  contarMensaje(datos: any): void {
    const usuario = this.usuarios.find(x => x.idUsuario == datos.IdDeUsuario);
    usuario.mensajeSinLeer = usuario.mensajeSinLeer + 1;
    this.contarTotalMensajes();
  }
  contarTotalMensajes(): void {
    this.totalMensajes = this.usuarios.reduce((tot, arr) => { return tot + arr.mensajeSinLeer; }, 0);
  }
  procesarEventoSignalR(evento: EventoSignalR): void{
    if(this.authService.getUser()?.id === evento.idUsuarioActual){
      return;
    }

    switch (evento.tipo) {
      case TipoEventoSignalR.CerrarSesion:
          if(evento.idUsuario === this.authService.getUser()?.id || evento.idUsuario === 0){
            this.authService.logout();
          }
          break;
      case TipoEventoSignalR.ActualizarSistema:
        if(evento.idUsuario === this.authService.getUser()?.id || evento.idUsuario === 0){
          location.reload();
          window.history.forward();
        }
        break;
      default: return;
    }
  }


  procesarMensajeSignalR(trama: MensajeSignalR): void {
    switch (trama.tipo) {
      case TipoMensajeSignalR.Actividad: {
        // console.log(this.usuarioActual);
        if (this.usuarioActual.idperfil == TipoPerfil.OPERADOR || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA){
          // console.log('responder');
          Swal.fire({
            title: '¿' + this.usuarioActual.nombre.split(' ')[0] + ' estás en linea?',
            icon: 'info',
            focusConfirm: true,
            allowOutsideClick: false,
            confirmButtonText:
             '<i class="fa fa-thumbs-up"></i> Confirmar!'
          }).then((result) => {
            if (result.isConfirmed) {
              const usuario = new Usuario(this.usuarioActual.idUsuario, this.usuarioActual.nombre, '', '', 0, 0, '', 0,'');
              usuario.usuario = this.authService.getUser().username;
              usuario.fechaRegistra = this.authService.getUser().fechaRegistra;
              console.log('usuario respondio', usuario);
              this.signalRService.preferenteResponderEscaneo(usuario).subscribe(respuesta => {});
                Swal.fire('Confirmado!', '', 'success');
              }
          });
        }
        break;
      }
      case TipoMensajeSignalR.AvisoGeneral: {
        let timerInterval
        Swal.fire({
          title: trama.datos,
          showConfirmButton: false,
          // html: 'Tiempo restante <b></b> segundos.',
          timer: 5000,
          allowOutsideClick: false,
          timerProgressBar: true,

          // onBeforeOpen: () => {
          //   Swal.showLoading()
          //   timerInterval = setInterval(() => {
          //     const content = Swal.getHtmlContainer()
          //     if (content) {
          //       const b = content.querySelector('b')
          //       if (b) {
          //         b.textContent = (Swal.getTimerLeft()/1000).toFixed(0)
          //       }
          //     }
          //   }, 1000)
          // },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
          }
        })
        break;
      }
      case TipoMensajeSignalR.PreferenteAsignado: {
        const idTeleoperador = trama.datos.Response.IdTeleoperador;
        if (idTeleoperador === this.usuarioActual.idUsuario || this.usuarioActual.idperfil === TipoPerfil.SUPERVISOR) { this.utilsService.mostrarToast(trama.mensaje, 'info');  }
        break;
      }
      case TipoMensajeSignalR.PreferentesAsignados: {
        const usuarios: any[] = JSON.parse( trama.datosJSON ).map(x => parseInt(x, 10));
        if( usuarios.includes(this.usuarioActual.idUsuario) ){
          if(this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil == TipoPerfil.OPERADOR || this.usuarioActual.idperfil == TipoPerfil.SISTEMAS){
            this.utilsService.mostrarToast('Tienes un nuevo preferente asignado.', 'info', null, true);
          }          
        }
        break;
      }
      case TipoMensajeSignalR.NotificacionDePago: {
        const totalNotificacionesPorSede: any = JSON.parse( trama.datosJSON );
        const cantidadNotificaionPorSede = totalNotificacionesPorSede.IdSedeNotifiacion === 1 ? totalNotificacionesPorSede.CantidadSurco : totalNotificacionesPorSede.IdSedeNotifiacion === 2 ? totalNotificacionesPorSede.CantidadMegaplaza : totalNotificacionesPorSede.IdSedeNotifiacion === 3 ? totalNotificacionesPorSede.CantidadPueblolibre : 0;

        if((this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil == TipoPerfil.SISTEMAS || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA || this.usuarioActual.idperfil == TipoPerfil.COORDINADOR_VENTAS_Y_MARKETING || this.usuarioActual.idperfil == TipoPerfil.ADMINISTRADOR || this.usuarioActual.idperfil == TipoPerfil.GERENCIA) && this.usuarioActual.idSede === totalNotificacionesPorSede.IdSedeNotifiacion){
          this.utilsService.mostrarToast(`Tienes una nueva notificación de pago. ${cantidadNotificaionPorSede} en total.`, 'info', null, true);
        }          
        break;
      }
      case TipoMensajeSignalR.RetornoPreferente: {
        // console.log(trama);
        // const idTeleoperador = trama.datos.Response.IdTeleoperador;
        if (this.usuarioActual.idperfil === TipoPerfil.COMMUNITYMANAGER) { this.utilsService.mostrarToast(trama.mensaje, 'info');  }
        // this.utilsService.mostrarToast(trama.mensaje, 'info');
        break;
      }
      case TipoMensajeSignalR.ConexionNueva: {
        if(this.usuarioActual.idUsuario !== trama.datos.idUsuario){
          const usuario = this.usuarios.find(x => x.idUsuario == trama.datos.idUsuario);
          usuario.estado = 1;
          usuario.ultimaConexion = "En línea";
        }
        break;
      }
      case TipoMensajeSignalR.ConexionRechazada: {
        console.log('Conexion Rechazada');
        break;
      }
      case TipoMensajeSignalR.ConexionListaUsuario: {
        if(this.usuarioActual != null) {
          const listaConectados = trama.datos;
          //! SHOW USERS CONECTED console.log('Usuarios conectados: ' + listaConectados.length);
          listaConectados.forEach(element => {
            if(element){
              if(element.IdUsuario !== this.usuarioActual.idUsuario){
                const usuario = this.usuarios.find(x => x.idUsuario === element.IdUsuario);
                if(usuario !== undefined) {
                  usuario.estado = 1;
                  usuario.ultimaConexion = "En linea";
                }
              }

            }

          });
        }
        break;
      }
      case TipoMensajeSignalR.DesconexionUsuario: {
          //!  USERS DISCONECTED console.log('DesconexionUsuario');
          const usuario = this.usuarios.find(x => x.idUsuario == trama.datos.IdUsuario);
          if(usuario != undefined){
            usuario.estado = 0;
            usuario.ultimaConexion = "hace un momento";
          }
        break;
      }
      case TipoMensajeSignalR.NuevoMensaje: {
        const idUsuarioRecibido = trama.datos.IdParaUsuario;
        if(this.usuarioActual.idUsuario = idUsuarioRecibido){
          if(this.visibleChatUsuario && this.idUsuarioChat == trama.datos.IdDeUsuario) { this.recibirMensaje(trama.datos); }
          if(this.visibleListaUsuario){ this.contarMensaje(trama.datos);  }
          if(this.visibleChatUsuario == false && this.visibleListaUsuario == false) { this.contarMensaje(trama.datos); }
        }
        break;
      }
      case TipoMensajeSignalR.NuevoPreferente: {
        if (this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil == TipoPerfil.COMMUNITYMANAGER || this.usuarioActual.idperfil == TipoPerfil.SA || this.usuarioActual.idperfil == TipoPerfil.SISTEMAS){
          this.utilsService.mostrarToast('Tienes un nuevo preferente por asignar.', 'info');
          this.estadosService.setNotificacion(true);
        }
        // if (idTeleoperador === this.usuarioActual.idUsuario || this.usuarioActual.idperfil === TipoPerfil.SUPERVISOR) { this.utilsService.mostrarToast(trama.mensaje, 'info');  }
        break;
      }
    }
  }
}
