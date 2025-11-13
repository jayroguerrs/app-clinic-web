import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { environment } from "../../../../../../environments/environment"
import { UserSettingsService } from '../../../../../shared/services/user-settings.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IGetPrivilegio, IIsApproved, UsuarioService } from '../../../../../shared/services/usuario.service';
import { Usuario } from '../../../../../shared/models/usuario';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../../shared/services/funciones/utils.service';
import { AccountService } from '../../../../../shared/services/account.service';
import { PermisosService } from '../../../../../shared/services/permisos.service';

@Component({
  selector: 'app-nav-logo',
  templateUrl: './nav-logo.component.html',
  styleUrls: ['./nav-logo.component.scss']
})
export class NavLogoComponent implements OnInit, AfterViewInit {
  @Input() navCollapsed: boolean;
  @Output() onNavCollapse = new EventEmitter();
  public mode = environment.qa ? 'QA' : environment.production ? 'PROD' : 'DEV';
  versionClinic: string
  public windowWidth: number;

  mdlActualizarDatosUser: NgbModalRef;
  mdlConfirmarSupervisor: NgbModalRef;

  @ViewChild('modalConfirmarSupervisor') modalConfirmarSupervisor!: NgbModalRef;
  @ViewChild('solicitudEnviadaModal') modalSolicitudEnviadaModal!: NgbModalRef;

  
  usuarioActual: Usuario;
  estadoAprobacionUsuarioActual: 0 | 1 | 3;

  private subscriptions: Subscription[] = [];
  
  constructor(
    public userSettingsService: UserSettingsService,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private accountService: AccountService,
    private permisosService: PermisosService,
    private modalService: NgbModal,
  ) {
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {

    const usuarioSub = this.usuarioService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
    this.subscriptions.push(usuarioSub);
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.versionClinic = environment.version;
  }

  ngAfterViewInit(){
    this.usuarioService.obtenerPrivilegioUsuario(this.usuarioActual.idUsuario)
    .subscribe((data: IGetPrivilegio) => {
      this.estadoAprobacionUsuarioActual = data.estadoAprobacion ? data.estadoAprobacion : 0;

      if(!this.permisosService.tienePrivilegio(data.privilegio) && this.usuarioActual.datosActualizados === true && (data.estadoAprobacion === 3 || data.estadoAprobacion === 0) && !this.usuarioActual.idSupervisor){
        this.abrirModalConfirmarSupervisor(this.modalConfirmarSupervisor);
      }
      
      if(this.usuarioActual.idSupervisor && this.usuarioActual.idSupervisor > 0 && this.estadoAprobacionUsuarioActual === 3 && this.usuarioActual.datosActualizados === true){
        console.log("Mostrando modal de solicitud enviada por estado de aprobacion 3");  
        this.mostrarModalSolicitudEnviada(this.modalSolicitudEnviadaModal);
      }
      if(this.usuarioActual.idSupervisor && this.usuarioActual.idSupervisor > 0 && this.estadoAprobacionUsuarioActual === 0 && this.usuarioActual.datosActualizados === true){
        console.log("Mostrando modal de solicitud enviada por estado de aprobacion 3");  
        this.mostrarModalSolicitudEnviada(this.modalSolicitudEnviadaModal);
      }

    });

  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.onNavCollapse.emit();
    }
  }
  
  actualizarDatosUser(modal: any): void{
    this.mdlActualizarDatosUser = this.utilsService.abrirModal(modal, 'lg');
    this.mdlActualizarDatosUser.result.then(result => console.log(""));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  abrirModalConfirmarSupervisor(modal: any): void{
    this.mdlConfirmarSupervisor = this.utilsService.abrirModal(modal, 'md');
  }

  private mdlSolicitudEnviada: NgbModalRef | undefined;

  mostrarModalSolicitudEnviada(modalTemplate: any): void {
    console.log("Abriendo modal de solicitud enviada...");
    this.mdlSolicitudEnviada = this.modalService.open(modalTemplate, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }
}
