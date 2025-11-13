import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import localeEs from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { SanitizeService } from "../../../shared/services/SanitizeService ";
@Component({
  selector: 'app-preferente-observacion',
  templateUrl: './preferente-observacion.component.html',
  styleUrls: ['./preferente-observacion.component.scss']
})
export class PreferenteObservacionComponent implements OnInit {
  @Output() mostrarObservacion: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() listaObservacionesDetalle: any[];
  @ViewChild('modalObservacion', { static: false }) modal: any;
  private modalRef: NgbModalRef;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    registerLocaleData(localeEs, 'es');
  }

  frmObservacion: FormGroup;
  id: number;
  inicialUsuario: string;
  generoUsuario: number;
  formatoFecha = 'EEEE, dd/MM/yyyy hh:mm:ss';
  usuarioActual: Usuario;

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.frmObservacion = this.formBuilder.group({
      observacion: ['', Validators.maxLength(100)]
    });
  }

  abrirModal(id: number): void{
    this.id = id;
    this.modalRef = this.utilsService.abrirModal(this.modal, 'lg');
    this.modalRef.result.then(result => {}, reason => {});
  }

  cerrarModal(): void {
    this.modalRef.close();
  }

  mostrarToast(mensaje: string): void{
    Swal.mixin({
      toast: true,
      position: 'top-end',
      timer: 1200,
      timerProgressBar: false
    }).fire(mensaje, '', 'error');
  }

  agregarObservacion(): void{
    if (this.frmObservacion.value.observacion === ''){
      return;
    }

    let sanitizedAviso = SanitizeService.sanitizeInput(this.frmObservacion.value.observacion);

    const observacion = {
      id: 0,
      observacion: sanitizedAviso.toUpperCase(),
      fechaRegistra: new Date(),
      usuarioRegistra: this.usuarioActual.nombre,
      inicialesUsuario: this.usuarioActual.nombre.split(' ').map((inicial) => inicial[0]).join(' ')
    };
    this.listaObservacionesDetalle.push(observacion);
    this.frmObservacion.patchValue({
      observacion: ''
    });

    this.mostrarObservacion.emit(this.listaObservacionesDetalle);
  }

  observacionEliminar(fecha: Date, observacion: string): void{
    this.listaObservacionesDetalle = this.listaObservacionesDetalle.filter(item =>
          item.fechaRegistra !== fecha &&
          item.observacion !== observacion);

    this.mostrarObservacion.emit(this.listaObservacionesDetalle);
  }
}
