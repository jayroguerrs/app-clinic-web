import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {Usuario} from "../../../../shared/models";
import {CitaMotivo} from "../../../../shared/models/cita-motivo-estado";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {CitaMotivoService} from "../../../../shared/services/cita-motivo.service";
import {CitaMotivoEstadoService} from "../../../../shared/services/cita-motivo-estado.service";
import {CitaEstado} from '../../../../shared/enumeracion/enums';
import {Cita} from "../../../../shared/models/corporal-360/Cita";
import {Cita360Service} from "../../../../shared/services/corporal360/cita360.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {RCitaMotivo} from "../../../../shared/interfaces/Response/cita-motivo-estado";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-cita-estado.component.html',
  styleUrls: ['./mdl-cita-estado.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlCitaEstadoComponent implements OnInit {
  @Output() eventoCondicionCambiada = new EventEmitter<boolean>();
  @Input() cita: Cita;
  @Input() citaEstado: CitaEstado;

  usuarioActual: Usuario;
  estadoString: string;

  clickEvent = 0;

  // Motivos
  ldMotivos = false;
  sbcCollectionMotivos: Subscription;
  motivos: CitaMotivo[] = [];
  validarMotivo = true;

  CitaEstado = CitaEstado;

  motivoSelected: CitaMotivo | null = null;
  ldSubmit = false;

  constructor(
    private usuarioService: UsuarioService,
    public utilsService: UtilsService,
    private router: Router,
    private citaMotivoService: CitaMotivoService,
    private citaMotivoEstadoService: CitaMotivoEstadoService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modal: NgbActiveModal,
    private citaService: Cita360Service
  ) {

  }


  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.estadoString = this.CitaEstado[this.citaEstado].toString();
    this.obtenerMotivos();
    this.validarRequiereMotivo();
    // console.log(this.citaEstado);
  }

  validarRequiereMotivo(): void{
    switch(this.citaEstado) {
      case this.CitaEstado.CONFIRMADA:
        this.validarMotivo = false;
        break;
      case this.CitaEstado.ASISTENCIACONFIRMADA:
        this.validarMotivo = false;
        break;
      default:
        break;
    }
  }

  cambiarEstado(): void{


    switch(this.citaEstado) {
      case this.CitaEstado.CONFIRMADA: {

        this.ldSubmit = true;
        this.citaService.confirm({...this.cita}).subscribe((res: boolean | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            this.utilsService.mostrarToast('Se actualizó es estado de la cita a confirmado!!!','success');
            this.eventoCondicionCambiada.emit(true);
            this.modal.close(true);
          }
          this.ldSubmit = false;
        }, error => {
          console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error al intentar actualizar el estado de la cita a confirmada!!!', 'error');
          this.ldSubmit = false;
        });
        break;

      }

      case this.CitaEstado.ASISTENCIACONFIRMADA: {

        this.ldSubmit = true;
        this.citaService.confirmAttendance({...this.cita}).subscribe((res: boolean | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            this.utilsService.mostrarToast('Se actualizó es estado de la cita a asistencia confirmada!!!','success');
            this.eventoCondicionCambiada.emit(true);
            this.modal.close(true);
          }
          this.ldSubmit = false;
        }, error => {
          console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error al intentar actualizar el estado de la cita a asistencia confirmada!!!', 'error');
          this.ldSubmit = false;
        });
        break;

      }

      case this.CitaEstado.CANCELADA: {

        if(!this.motivoSelected){
          this.utilsService.mostrarToast('Seleccionar el motivo de cancelación', 'warning');
          return;
        }

        this.ldSubmit = true;
        this.citaService.cancel({...this.cita}).subscribe((res: boolean | ErrorSistema) => {
            if(res instanceof ErrorSistema){
              this.utilsService.mostrarToast(res.message, 'error');
            }else{
              this.utilsService.mostrarToast('Se actualizó es estado de la cita a cancelada!!!','success');
              this.eventoCondicionCambiada.emit(true);
              this.modal.close(true);
            }
            this.ldSubmit = false;
        }, error => {
            console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error al intentar actualizar el estado de la cita a cancelada!!!', 'error');
            this.ldSubmit = false;
        });
        break;

      }
      case this.CitaEstado.ANULADA: {
        if(!this.motivoSelected){
          this.utilsService.mostrarToast('Seleccionar el motivo!!!', 'warning');
          return;
        }

        this.ldSubmit = true;
        this.citaService.bad({...this.cita}).subscribe((res: boolean | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            this.utilsService.mostrarToast('Se actualizó es estado de la cita a anulado!!!','success');
            this.eventoCondicionCambiada.emit(true);
            this.modal.close(true);
          }
          this.ldSubmit = false;
        }, error => {
          console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error al intentar actualizar el estado de la cita a anulado!!!', 'error');
          this.ldSubmit = false;
        });
        break;

      }

      case this.CitaEstado.PENDIENTE: {

        if(!this.motivoSelected){
          this.utilsService.mostrarToast('Seleccionar el motivo!!!', 'warning');
          return;
        }

        this.ldSubmit = true;
        this.citaService.earring({...this.cita}).subscribe((res: boolean | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            this.utilsService.mostrarToast('Se actualizó es estado de la cita a pendiente!!!','success');
            this.eventoCondicionCambiada.emit(true);
            this.modal.close(true);
          }
          this.ldSubmit = false;
        }, error => {
          console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error al intentar actualizar el estado de la pendiente!!!', 'error');
          this.ldSubmit = false;
        });
        break;

      }


      case this.CitaEstado.NOLLAMAR: {

        if(!this.motivoSelected){
          this.utilsService.mostrarToast('Seleccionar el motivo!!!', 'warning');
          return;
        }

        this.ldSubmit = true;
        this.citaService.notCall({...this.cita}).subscribe((res: boolean | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            this.utilsService.mostrarToast('Se actualizó es estado de la cita a no llamar!!!','success');
            this.eventoCondicionCambiada.emit(true);
            this.modal.close(true);
          }
          this.ldSubmit = false;
        }, error => {
          console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error al intentar actualizar el estado a no llamar!!!', 'error');
          this.ldSubmit = false;
        });
        break;

      }
    }
  }
  cerrarModal( result: boolean = false ): void {
    this.modal.close(result);
  }

  resultadoEmail(resultado, mensaje, alertIcon ): void {
    Swal.fire(mensaje, resultado.mensaje, alertIcon);
    this.router.navigate(['CitaListado']);
  }

  // obtenerMotivos
  obtenerMotivos(): void{
    this.ldMotivos = true;
    this.sbcCollectionMotivos = this.citaMotivoService.collectionByCitaEstado(this.citaEstado).subscribe((res: RCitaMotivo[]) => {
      this.motivos = res;
    }, error => {
      console.log(error);
    }, () => {
      this.ldMotivos = false;
    });
  }

  // eventos
  select(motivo: CitaMotivo): void{
    this.motivoSelected = motivo;
  }
  isSelected(motivo: CitaMotivo): boolean{
    if(!this.motivoSelected){ return false;}
    return this.motivoSelected.id === motivo.id;
  }

}
