import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormBuilder, FormGroup, FormGroupName} from '@angular/forms';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {UbicacionService} from 'src/app/shared/services/ubicacion.service';
import {UsuarioService} from 'src/app/shared/services/usuario.service';
import {UtilsService} from 'src/app/shared/services/funciones/utils.service';
import {Usuario} from 'src/app/shared/models/usuario';

@Component({
  selector: 'app-preferente-ubigeo',
  templateUrl: './preferente-ubigeo.component.html',
  styleUrls: ['./preferente-ubigeo.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupName  }
  ]
})
export class PreferenteUbigeoComponent implements OnInit {
  @Input() modal :NgbModalRef;
  @Input() direccionDetalle: Direccion;
  @Output() direccion: EventEmitter<Direccion> = new EventEmitter<Direccion>();
  @Input() listaMaestraDepartamentos: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private ubicacionService: UbicacionService,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService
  ) { }

  frmUbigeo: FormGroup;
  listaUbigeo: any = [];
  listaProvincia: any = [];
  listaDistrito: any = [];
  submittedUbigeo = false;
  usuarioActual: Usuario;

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.frmUbigeo = this.formBuilder.group({
        preIdDepartamento: ['15'],
        preIdProvincia: ['01'],
        preIdDistrito: [0],
        nomDepartamento: [''],
        nomProvincia: [''],
        nomDistrito: [''],
        direccion: [''],
    });
    if(this.direccionDetalle.idDepartamento != undefined) {
      this.frmUbigeo.patchValue({
        direccion: this.direccionDetalle.solodireccion,
        preIdDepartamento: this.direccionDetalle.idDepartamento,
        preIdProvincia : this.direccionDetalle.idProvincia
      });
      this.onSelectDepartamento(this.direccionDetalle.idDepartamento);
    } else {
      this.onSelectDepartamento('15');
    }
  }

  onSelectDepartamento(idDepartamento: string): void {
    if (idDepartamento !== '') {

      this.ubicacionService.obtenerCiudadByToDepartamento(idDepartamento).subscribe(
        resultado => {
          this.listaProvincia = resultado;
          this.listaDistrito = null;

          this.frmUbigeo.get('preIdProvincia').enable();
          this.frmUbigeo.get('preIdDistrito').disable();

          this.frmUbigeo.controls.preIdDepartamento.setValue(idDepartamento);
          const nomDepartamentoTemp = idDepartamento == '0' ? '' : this.listaMaestraDepartamentos.find(d => d.idDepartamento == idDepartamento).departamento;
          this.frmUbigeo.patchValue({
                nomDepartamento:  nomDepartamentoTemp,
                preIdProvincia: this.direccionDetalle.idProvincia,
                preIdDistrito: '',
                nomProvincia: '',
                nomDistrito: '',
            });

            // ASIGNAR VALOR SI EXISTE
          if (this.direccionDetalle.idProvincia !== undefined){
            this.onSelectProvincia(this.direccionDetalle.idProvincia);
          } else {
            this.frmUbigeo.patchValue({
              preIdProvincia : '01'
            });
            this.onSelectProvincia('01');
          }
      });
    } else {
      this.listaProvincia = null;
      this.listaDistrito = null;
      this.frmUbigeo.get('preIdProvincia').disable();
      this.frmUbigeo.get('preIdDistrito').disable();
      this.frmUbigeo.patchValue({
          preIdProvincia: '',
          preIdDistrito: '',
          nomDepartamento: '',
          nomProvincia: '',
          nomDistrito: '',
      });
    }
  }
  onSelectProvincia(idProvincia): void {
    if (idProvincia !== '') {
      const preIdDepartamento =  this.frmUbigeo.controls.preIdDepartamento.value;
      this.ubicacionService.obtenerDistritoByToCiudadByToDepartamento(idProvincia, preIdDepartamento).subscribe(resultado => {
        this.listaDistrito = resultado;

        const nomProvinciaTemp = idProvincia == '0' ? '' : this.listaProvincia.find(d => d.idCiuda == idProvincia).ciudad;
        this.frmUbigeo.get('preIdDistrito').enable();
        this.frmUbigeo.patchValue({
            nomProvincia: nomProvinciaTemp,
            preIdProvincia: idProvincia,
            nomDistrito: '',
        });

        // ASIGNAR VALOR SI EXISTE
        if (this.direccionDetalle.idDistrito !== undefined){
          this.onSelectDistrito(this.direccionDetalle.idDistrito);
        } else {
          this.frmUbigeo.patchValue({
            preIdDistrito: '0'
          })
        }
      });

    } else {
      this.listaDistrito = null;
      this.frmUbigeo.get('preIdDistrito').disable();
      this.frmUbigeo.patchValue({
        preIdProvincia: '',
        preIdDistrito: '',
        nomProvincia: '',
        nomDistrito: '',
      });
    }
  }
  onSelectDistrito(idDistrito): void {
    if (idDistrito !== '') {
      this.frmUbigeo.get('preIdDistrito').enable();

      let nomDistritoTemp = '';
      if(idDistrito == '0') {
        nomDistritoTemp = ''
      } else {
        const distrito = this.listaDistrito.find(d => d.idUbicacion == idDistrito);
        if(distrito != undefined)
          nomDistritoTemp = distrito.distrito;
      }

      this.frmUbigeo.patchValue({
        preIdDistrito: idDistrito,
        nomDistrito: nomDistritoTemp
      });
    // } else {
    //   this.listaDistrito = null;
    //   this.frmUbigeo.get('preIdDistrito').disable();
    //   this.frmUbigeo.patchValue({
    //     preIdDistrito: idDistrito,
    //     nomDistrito: ''
    //   });
    }
  }

  get fUbigeo(): any {
    return this.frmUbigeo.controls;
  }

  mostrarToast(mensaje: string): void{
    Swal.mixin({
      toast: true,
      position: 'top-end',
      timer: 1200,
      timerProgressBar: false
    }).fire(mensaje, '', 'error');
  }

  concatenarDireccion(): void{

    // const departamentoHtml = document.getElementById('preIdDepartamento') as HTMLSelectElement;
    // const provinciaHtml = document.getElementById('preIdProvincia') as HTMLSelectElement;
    // const distritoHtml = document.getElementById('preIdDistrito') as HTMLSelectElement;
    // this.frmUbigeo.patchValue({
    //   nomDepartamento: departamentoHtml.selectedOptions[0].label,
    //   nomProvincia: provinciaHtml.selectedOptions[0].label,
    //   nomDistrito: distritoHtml.selectedOptions[0].label,
    // });

    this.direccionDetalle.cadenadireccion = this.frmUbigeo.controls.nomDepartamento.value + ' - ' +
      this.frmUbigeo.controls.nomProvincia.value + ' ' +
      this.frmUbigeo.controls.direccion.value + ' - ' +
      this.frmUbigeo.controls.nomDistrito.value;
    this.direccionDetalle.solodireccion = this.frmUbigeo.controls.direccion.value;
    this.direccionDetalle.idDistrito = this.frmUbigeo.controls.preIdDistrito.value;
    this.direccionDetalle.idProvincia = this.frmUbigeo.controls.preIdProvincia.value;
    this.direccionDetalle.idDepartamento = this.frmUbigeo.controls.preIdDepartamento.value;
    this.direccion.emit(this.direccionDetalle);
    this.cerrarModal();
  }
  cerrarModal(){
    this.modal.close();
  }
}

export class Direccion{
  cadenadireccion: string;
  solodireccion: string;
  idDistrito: string;
  idProvincia: string;
  idDepartamento: string;
  distrito: string;
  provincia: string;
  departamento: string;
}
