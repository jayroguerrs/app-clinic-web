import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { pull } from 'lodash';
import { Usuario } from 'src/app/shared/models/usuario';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import Swal from 'sweetalert2';
import { TipoPerfil } from '../../../shared/enumeracion/enums';

@Component({
  selector: 'app-preferente-zona-corporal',
  templateUrl: './preferente-zona-corporal.component.html',
  styleUrls: ['./preferente-zona-corporal.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupName  }
  ]
})
export class PreferenteZonaCorporalComponent {
  @Input() listaZonaCorporalDetalle: any = [];
  @ViewChild('modalZonaCorporal', { static: false }) modal: any;
  @Output() strZonasCorporales: EventEmitter<any> = new EventEmitter<any>();
  private modalRef: NgbModalRef;
  listaMZonasCorporales: any[];
  frmZonasCorporales: FormGroup;
  usuarioActual: Usuario;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService
  ) { }

  addTag(): void {
    if (this.frmZonasCorporales.value.cboZonaCorporal === '') { return; }

    const idZona = parseInt(this.frmZonasCorporales.controls.cboZonaCorporal.value, 10);
    const zonaControl = document.getElementById('cboZonaCorporal') as HTMLSelectElement;
    const desZona = zonaControl.selectedOptions[0].label;

    let resultado = null;
    if (this.listaZonaCorporalDetalle != null){
      resultado = this.listaZonaCorporalDetalle.find(f => f.idZonaCorporal === idZona);
    }

    if (resultado == null){
      const zonaCorporal  = {
        id: 0,
        idPreferente: 0,
        idZonaCorporal: idZona,
        descripcion: desZona,
      };
      this.listaZonaCorporalDetalle.push(zonaCorporal);
    } else {
      this.mostrarToast('Zona corporal ya seleccionado!!!');
    }

    this.frmZonasCorporales.patchValue({
      cboZonaCorporal: ''
    });

    this.strZonasCorporales.emit(this.listaZonaCorporalDetalle);
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.listaZonaCorporalDetalle, tag);
    } else {
      this.listaZonaCorporalDetalle.splice(-1);
    }
    this.strZonasCorporales.emit(this.listaZonaCorporalDetalle);
  }

  abrirModal(listaMaestraZonaCorporal): void{
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.frmZonasCorporales = this.formBuilder.group({
        cboZonaCorporal: [''],
        chips: [this.listaZonaCorporalDetalle, []]
    });

    if (this.usuarioActual.idperfil === TipoPerfil.OPERADOR){
      this.frmZonasCorporales.get('cboZonaCorporal').disable();
    }

    this.listaMZonasCorporales = listaMaestraZonaCorporal;
    this.modalRef = this.utilsService.abrirModal(this.modal, 'lg');
    this.modalRef.result.then(result => {}, reason => {});
  }

  mostrarToast(mensaje: string): void{
    Swal.mixin({
      toast: true,
      position: 'top-end',
      timer: 1200,
      timerProgressBar: false
    }).fire(mensaje, '', 'error');
  }
}