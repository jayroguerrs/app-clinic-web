import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CitaEstado } from '../../../shared/enumeracion/enums';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { CitaService } from '../../../shared/services/cita.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Usuario } from '../../../shared/models/usuario';
import {CitaMotivo, CitaMotivoEstado} from "../../../shared/models/cita-motivo-estado";
import {CitaMotivoService} from "../../../shared/services/cita-motivo.service";
import {Subscription} from "rxjs";
import {CitaMotivoEstadoService} from "../../../shared/services/cita-motivo-estado.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-cita-condicion-estado',
  templateUrl: './cita-condicion-estado.component.html',
  styleUrls: ['./cita-condicion-estado.component.scss']
})
export class CitaCondicionEstadoComponent implements OnInit {
  @Output() eventoCondicionCambiada = new EventEmitter<Boolean>();
  @Input() modal: NgbModalRef;
  @Input() datosCita: any;

  usuarioActual: Usuario;
  estadoString: string;

  clickEvent = 0;

  // Motivos
  loadingMotivos = false;
  sbcCollectionMotivos: Subscription;
  motivos: CitaMotivo[] = [];

  CitaEstado = CitaEstado;


  formGroup: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private citaService: CitaService,
    private utilsService: UtilsService,
    private router: Router,
    private citaMotivoService: CitaMotivoService,
    private citaMotivoEstadoService: CitaMotivoEstadoService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.formGroup = this.formBuilder.group({
      motivos : new FormControl('')
    })
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.estadoString = this.CitaEstado[this.datosCita.idEstado].toString();
    this.obtenerMotivos();
  }

  get f(): any{
    return this.formGroup.controls;
  }

  cambiarEstado(): void{

    if(this.clickEvent){ return; }

    this.clickEvent = 1;
    // let estadoCambiado = false;
    switch(this.datosCita.idEstado) {
      case this.CitaEstado.NOASISTIO: {
        this.spinner.show();
        this.citaService.actualizarCondicionNoAsistio(this.datosCita).subscribe(
          resultado => {
            if(resultado.exito) {
              Swal.fire(resultado.mensaje, '', 'success').then(result => this.eventoCondicionCambiada.emit(true));
              this.cerrarModal(true);
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }
        });
        break;

      }

      case this.CitaEstado.CONFIRMADA: {
        this.spinner.show();
        this.citaService.actualizarCondicionConfirmar(this.datosCita).subscribe(
          resultado => {
            if(resultado.exito) {
              Swal.fire(resultado.mensaje, '', 'success').then(result => this.eventoCondicionCambiada.emit(true));
              this.cerrarModal(true);
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }
        });
        break;

      }

      case this.CitaEstado.ASISTENCIACONFIRMADA: {
        this.spinner.show();
        this.citaService.actualizarCondicionConfirmarAsistencia(this.datosCita).subscribe(
          resultado => {
            if(resultado.exito) {
              Swal.fire(resultado.mensaje, '', 'success').then(result => this.eventoCondicionCambiada.emit(true));
              this.cerrarModal(true);
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }
          });
        break;

      }

      case this.CitaEstado.CANCELADA: {

        if(!this.f.motivos.value){
          this.utilsService.mostrarToast('Seleccionar el motivo de cancelación', 'warning');
          this.clickEvent = 0;
          return;
        }

        this.spinner.show();
        this.citaService.actualizarCondicionCancelar(this.datosCita).subscribe(
          resultado => {
            if(resultado.exito) {

              const citaMotivoEstado = new CitaMotivoEstado();
              citaMotivoEstado.idCita = this.datosCita.idCita;
              citaMotivoEstado.idMotivo = parseInt( this.f.motivos.value, 10);
              citaMotivoEstado.usuarioRegistro = this.usuarioService.UsuarioActual.nombre;
              this.citaMotivoEstadoService.create(citaMotivoEstado).subscribe((res)=>{

                this.spinner.hide();
                Swal.fire(resultado.mensaje, '', 'success').then(result => this.eventoCondicionCambiada.emit(true));
                this.cerrarModal(true);
              });

            } else {
              this.spinner.hide();
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }
          });
        break;
      }
      case this.CitaEstado.NOLLAMAR: {

        if(!this.f.motivos.value){
          this.utilsService.mostrarToast('Seleccionar el motivo de cancelación', 'warning');
          this.clickEvent = 0;
          return;
        }

        this.spinner.show();
        this.citaService.actualizarCondicionNollamar(this.datosCita).subscribe(
          resultado => {
            if(resultado.exito) {

              const citaMotivoEstado = new CitaMotivoEstado();
              citaMotivoEstado.idCita = this.datosCita.idCita;
              citaMotivoEstado.idMotivo = parseInt( this.f.motivos.value, 10);
              citaMotivoEstado.usuarioRegistro = this.usuarioService.UsuarioActual.nombre;
              this.citaMotivoEstadoService.create(citaMotivoEstado).subscribe((res)=>{

                this.spinner.hide();
                Swal.fire(resultado.mensaje, '', 'success').then(result => this.eventoCondicionCambiada.emit(true));
                this.cerrarModal(true);
              });

            } else {
              this.spinner.hide();
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }
          });
        break;
      }
      case this.CitaEstado.ANULADA: {
        if(!this.f.motivos.value){
          this.utilsService.mostrarToast('Indique el motivo de la anulación', 'warning');
          this.clickEvent = 0;
          return;
        }   
        this.spinner.show();
        this.citaService.actualizarCondicionAnular(this.datosCita).subscribe(
          resultado => {
            if(resultado.exito) {

              const citaMotivoEstado = new CitaMotivoEstado();
              citaMotivoEstado.idCita = this.datosCita.idCita;
              citaMotivoEstado.idMotivo = parseInt( this.f.motivos.value, 10);
              citaMotivoEstado.usuarioRegistro = this.usuarioService.UsuarioActual.nombre;
              this.citaMotivoEstadoService.create(citaMotivoEstado).subscribe((res)=>{

                this.spinner.hide();
                Swal.fire(resultado.mensaje, '', 'success').then(result => this.eventoCondicionCambiada.emit(true));
                this.cerrarModal(true);
              });

            } else {
              this.spinner.hide();
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }
          });
        break;
      }

      case this.CitaEstado.PENDIENTE: {

        if(!this.f.motivos.value){
          this.utilsService.mostrarToast('Indique el motivo de pendiente', 'warning');
          this.clickEvent = 0;
          return;
        }

        // this.datosCita.idEstadoPendiente = parseInt(idEstadoPendiente.toString(), 10);

        this.spinner.show();
        this.citaService.actualizarCondicionPendiente(this.datosCita).subscribe(
          resultado => {
            if(resultado.exito) {

              const citaMotivoEstado = new CitaMotivoEstado();
              citaMotivoEstado.idCita = this.datosCita.idCita;
              citaMotivoEstado.idMotivo = parseInt( this.f.motivos.value, 10);
              citaMotivoEstado.usuarioRegistro = this.usuarioService.UsuarioActual.nombre;
              this.citaMotivoEstadoService.create(citaMotivoEstado).subscribe((res)=>{

                this.spinner.hide();
                Swal.fire(resultado.mensaje, '', 'success').then(result => this.eventoCondicionCambiada.emit(true));
                this.cerrarModal(true);
              });

            } else {
              this.spinner.hide();
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }
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
    this.loadingMotivos = true;
    this.sbcCollectionMotivos = this.citaMotivoService.collectionByCitaEstado(this.datosCita.idEstado).subscribe((res) => {
      this.motivos = res;
      console.log(this.motivos)
    }, error => {
      console.log(error);
    }, () => {
      this.loadingMotivos = false;
    });
  }
}
