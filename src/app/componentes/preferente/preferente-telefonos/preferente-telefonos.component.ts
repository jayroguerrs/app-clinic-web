import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormGroupName } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { pull } from 'lodash';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import Swal from 'sweetalert2';
import { TipoPerfil } from '../../../shared/enumeracion/enums';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';

@Component({
  selector: 'app-preferente-telefonos',
  templateUrl: './preferente-telefonos.component.html',
  styleUrls: ['./preferente-telefonos.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupName  }
  ]
})
export class PreferenteTelefonosComponent implements OnInit {
  @Input() public listaNumerosDetalle: any[];
  @ViewChild('modalTelefono', { static: false }) modal: any;
  @Output() mostrarCadenaTelefonos: EventEmitter<string> = new EventEmitter<string>();

  constructor(
     private formBuilder: FormBuilder,
     private utilsService: UtilsService,
     private usuarioService: UsuarioService,
  ) { }

  private modalRef: NgbModalRef;
  frmTelefonos: FormGroup;
  usuarioActual: Usuario;

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.frmTelefonos = this.formBuilder.group({
        telNuevo: ['']
    });

    if (this.usuarioActual.idperfil === TipoPerfil.OPERADOR){
      this.frmTelefonos.get('telNuevo').disable();
    }
  }

  addTag(): void {
    let numero = this.frmTelefonos.value.telNuevo.toString().trim().split(" ").join("");
    // console.log('1', numero);
    if (numero === '') { this.utilsService.mostrarToast('El número no tiene el formato correcto', 'warning');return; }
    // console.log('2', numero);

    if(numero.length === 9){
      numero = numero.substring(0,3) + ' ' + numero.substring(3,6) + ' ' + numero.substring(6,9)
    }

    if (numero.length < 11) { this.utilsService.mostrarToast('El número no tiene el formato correcto', 'warning');return; }
    // console.log('3', numero);
    if(numero.length > 11) {
      numero = numero.substring(0, 11);
    }

    // console.log('4', numero);
    const resultado = this.listaNumerosDetalle.find(f => f.numero === numero.toString());
    if (resultado == null){
      const telefono  = { id: 0, numero };
      this.listaNumerosDetalle.push(telefono);
    } else {
      this.mostrarToast('Número ya ingresado!!!');
    }

    this.frmTelefonos.patchValue({ telNuevo: ''});
    this.concatenarNumerosTelefonicos();

    // console.log(this.listaNumerosDetalle);
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.listaNumerosDetalle, tag);
    } else {
      this.listaNumerosDetalle.splice(-1);
    }
    this.concatenarNumerosTelefonicos();
  }

  concatenarNumerosTelefonicos(): void {
    let cadenNumerosTelefonicos = '';
    if (this.listaNumerosDetalle.length === 0){
      cadenNumerosTelefonicos = '   Sin número telefónico';
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.listaNumerosDetalle.length; i++) {
        cadenNumerosTelefonicos = cadenNumerosTelefonicos + ' - ' + this.listaNumerosDetalle[i].numero;
      }
    }
    this.mostrarCadenaTelefonos.emit(cadenNumerosTelefonicos.substring(3));
  }

  mostrarToast(mensaje: string): void{
    Swal.mixin({
      toast: true,
      position: 'top-end',
      timer: 1200,
      timerProgressBar: false
    }).fire(mensaje, '', 'error');
  }

  abrirModal(): void{
    this.modalRef = this.utilsService.abrirModal(this.modal, 'lg');
    this.modalRef.result.then(result => {}, reason => {});
  }
}
