import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { PreferenteTelefonosComponent } from '../preferente-telefonos/preferente-telefonos.component';
import { PreferenteZonaCorporalComponent } from '../preferente-zona-corporal/preferente-zona-corporal.component';
import { Direccion } from '../preferente-ubigeo/preferente-ubigeo.component';
import { PreferenteObservacionComponent } from '../preferente-observacion/preferente-observacion.component';
import {MaestroPreferente, Preferente} from '../preferente.models';
import { PreferenteService } from 'src/app/shared/services/preferente.service';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoPerfil } from 'src/app/shared/enumeracion/enums';
import {PreferenteClienteComponent} from "../preferente-cliente/preferente-cliente.component";
import {NgSelectConfig} from "@ng-select/ng-select";
import {MdlPreferenteReasignarModule} from "../../modals/mdl-preferente-reasignar/mdl-preferente-reasignar.module";
import {MdlPreferenteReasignarComponent} from "../../modals/mdl-preferente-reasignar/mdl-preferente-reasignar.component";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
// Ya no necesitamos RxJS para mat-select
import { MatSelectChange } from '@angular/material/select';
import { MarketingService, MapeoUtmSource, MapeoUtmCampaign } from '../../../shared/services/marketing.service';

@Component({
  selector: 'app-preferente-datos',
  templateUrl: './preferente-datos.component.html',
  styleUrls: ['./preferente-datos.component.scss'],
})
export class PreferenteDatosComponent implements OnInit {
  @ViewChild(PreferenteTelefonosComponent, {static: false}) preferenteTelefonosComponent: PreferenteTelefonosComponent;
  @ViewChild(PreferenteZonaCorporalComponent, {static: false}) preferenteZonaCorporalComponent: PreferenteZonaCorporalComponent;
  @ViewChild(PreferenteObservacionComponent, {static: false}) preferenteObservacionComponent: PreferenteObservacionComponent;

  @Input() idPerfil: number;
  @Input() listaMaestra: MaestroPreferente;
  @Input() id: number;
  @Input() modal: NgbModalRef;

  @Output() eventPreferenteListar: EventEmitter<boolean> = new EventEmitter<boolean>();

  modalUbigeoRef: NgbModalRef;

  modalPreferenteClienteRef: NgbModalRef;
  frmPreferenteDatos: FormGroup;
  modalUbigeoActual: string;
  closeResult: string;
  submitted = false;
  settings: any = {};
  accion: string;
  listaZonaCorporalDetalle: any = [];
  listaNumerosDetalle: any = [];
  listaObservacionesDetalle: any = [];
  direccionDetalle: Direccion;
  txtTelMascaraInput = 'Sin número telefónico';
  txtZonCorporalMascaraInput = 'Sin zona corporal';
  txtUbicacionMascaraInput = 'Sin ubicación';
  usuarioActual: Usuario;

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Para select
  utmSourceOptions: MapeoUtmSource[] = [];
  selectedCampaigns: MapeoUtmCampaign[] = [];
  selectedSourceOption: MapeoUtmSource | null = null;
  selectedCampaignOption: MapeoUtmCampaign | null = null;
  isLoading: boolean = false;

  // Permisos
  accTot: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private preferenteService: PreferenteService,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private config: NgSelectConfig,
    private permisoHelper: PermisoHelper,
    private marketingService: MarketingService
  ) {
    this.config.notFoundText = 'No se encontraron resultados';
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();

    if (this.id > 0){
        this.accion = 'Editar';
        this.limpiarFormulario();
        this.preferenteBuscar();
    } else {
      this.limpiarFormulario();
      this.accion = 'Nuevo';

      // Nuevo - setear estado como no asignado
      this.onSelectTeleoperador(0);
    }

    this.permisoHelper.readPermiso().then((accesos) => {      
      this.accTot = accesos.accTot;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;
    });
    
    // Cargar las fuentes UTM disponibles
    this.loadUtmSources();

    // Con mat-select ya no necesitamos este evento de valueChanges
    // porque ahora usamos los eventos onUtmSourceChanged y onUtmCampaignChanged

    // Asegurarse de que UTM Campaign esté deshabilitado inicialmente si UTM Source está vacío
    if (!this.frmPreferenteDatos.get('utmSource')?.value) {
      this.disableUtmCampaignField();
    }
  }
  
  /**
   * Método para deshabilitar el campo de UTM Campaign
   */
  private disableUtmCampaignField(): void {
    // Obtener el control de UTM Campaign Input
    const utmCampaignInput = this.frmPreferenteDatos.get('utmCampaignInput');
    if (utmCampaignInput) {
      // Deshabilitar el control
      utmCampaignInput.disable();
      // Limpiar su valor
      utmCampaignInput.setValue('');
    }
  }
  inicializarFormulario(): void {
    this.frmPreferenteDatos = this.formBuilder.group({
      preId: [''],
      preNombres: [null, [Validators.required, Validators.maxLength(50)]],
      preApellidos: [null, [Validators.required, Validators.maxLength(50)]],
      preEmail: ['', [Validators.email, Validators.maxLength(50)]],
      preNumeros: [this.txtTelMascaraInput],
      preIdComentario: [''],
      preIdEstado: [''],
      preDireccion: [this.txtUbicacionMascaraInput],
      preIdMedioContacto: ['', Validators.required],
      preIdMedioContactoCierre: [''],
      prePromocion: [''],
      preRedFacebook: [''],
      preRedInstagram: [''],
      preZonasCorporal: [this.txtZonCorporalMascaraInput],
      preIdTeleoperadorAsignado: new FormControl(null),
      preObservacion: [''],
      chips: [this.listaZonaCorporalDetalle],
      esCliente: new FormControl(0, Validators.required),
      idCliente: new FormControl(0, Validators.required),
      cliente: new FormControl(null),
      utmSource : [''],
      utmSourceInput: [''],
      utmMedium : [''],
      utmCampaign : [''],
      utmCampaignInput: [''],
      utmId : [''],
      utmTerm : [''],
      codAtencion : [''],
      preIdMedioRecontacto: [''],
    });

    this.frmPreferenteDatos.get('preIdTeleoperadorAsignado').valueChanges.subscribe((val) => {
      this.frmPreferenteDatos.get('preIdEstado').disable();
      if(val){
        this.frmPreferenteDatos.get('preIdEstado').enable();
        this.frmPreferenteDatos.patchValue({
          preIdEstado: 2
        });
      }
    });

    this.frmPreferenteDatos.get('preIdEstado').disable();
    if (this.usuarioActual.idperfil === TipoPerfil.OPERADOR ||  this.usuarioActual.idperfil === TipoPerfil.SA ||  this.usuarioActual.idperfil === TipoPerfil.SISTEMAS){
      this.frmPreferenteDatos.get('preIdEstado').enable();
    }
    this.frmPreferenteDatos.get('preNumeros').disable();
    this.frmPreferenteDatos.get('preZonasCorporal').disable();
    this.frmPreferenteDatos.get('preObservacion').disable();
    this.frmPreferenteDatos.get('preDireccion').disable();
    
    // Deshabilitar campos de medio de contacto si existe id (modo edición)
    if (this.id) {
      this.frmPreferenteDatos.get('preIdMedioContacto').disable();
      // Habilitar recontacto cuando medio de contacto esté deshabilitado
      this.frmPreferenteDatos.get('preIdMedioRecontacto').enable();
    } else {
      // Deshabilitar recontacto cuando medio de contacto esté habilitado
      this.frmPreferenteDatos.get('preIdMedioRecontacto').disable();
    }
    
    if (this.usuarioActual.idperfil === TipoPerfil.OPERADOR){
      this.frmPreferenteDatos.get('preNombres').disable();
      this.frmPreferenteDatos.get('preApellidos').disable();
      this.frmPreferenteDatos.get('preEmail').disable();
      this.frmPreferenteDatos.get('preIdMedioContacto').disable();
      this.frmPreferenteDatos.get('prePromocion').disable();
      this.frmPreferenteDatos.get('preIdTeleoperadorAsignado').disable();
    }

    this.frmPreferenteDatos.get('esCliente').valueChanges.subscribe((res: string) => {
      if( parseInt(res, 10) ){
        this.frmPreferenteDatos.get('cliente').setValidators(Validators.required);
      }else{
        this.frmPreferenteDatos.get('cliente').clearValidators();
        this.frmPreferenteDatos.get('cliente').patchValue(null);
        this.frmPreferenteDatos.get('idCliente').patchValue(0);
      }
      this.frmPreferenteDatos.get('cliente').updateValueAndValidity();
    });
  }
  preferenteGrabar(): void {
    this.submitted = true;
    if (this.frmPreferenteDatos.invalid){
      this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
      // console.log(this.frmPreferenteDatos);
      this.spinner.hide();
      return;
    }
    this.spinner.show();

    if (this.id > 0 ){
      // EDITAR
      this.preferenteService.preferenteModificar(this.preferente).subscribe(
        resultado => {
          if(resultado.exito) {
            Swal.fire(resultado.mensaje).then(resultado => {  this.eventPreferenteListar.emit(true); });
            this.cerrarModal(true);
          } else {
            this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
          }
          this.spinner.hide();
        },
        error => {
          console.log('Error al actualizar el preferente', error);
          this.spinner.hide();
        }
      );
    } else {
      // NUEVO
      this.preferenteService.preferenteGrabar(this.preferente).subscribe(
        resultado => {
          if(resultado.exito) {
            Swal.fire(resultado.mensaje).then(resultado => { this.eventPreferenteListar.emit(true); });
            this.cerrarModal(true);
          } else {
            if(resultado.errorNumero === 410){

              // console.log(resultado);

              // this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
              Swal.fire({
                title: resultado.mensaje + (resultado.errorDetalle ? ': ' + resultado.errorDetalle : ''),
                allowOutsideClick: false,
                allowEscapeKey: false,
                buttonsStyling: false,
                confirmButtonText: 'Reasignar',
                cancelButtonText: 'Cerrar',
                showCancelButton: true,
                customClass: {
                  confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
                  cancelButton: 'btn sbtn btn-light popins mr-2',
                },
                reverseButtons: true
              })
                .then((r) => {
                  if(r.isConfirmed){
                    this.reasignarPreferente(resultado.response.id);
                  }
                  this.eventPreferenteListar.emit(true);
                });
            }else{
              // this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
              Swal.fire({title: resultado.mensaje + (resultado.errorDetalle ? ': ' + resultado.errorDetalle : '') }).then(resultado => { this.eventPreferenteListar.emit(true); });
            }

          }
          this.spinner.hide();
        },
        error => {
          console.log('Error al registrar el preferente', error);
          this.spinner.hide();
        }
      );
    }

  }
  preferenteBuscar(): void {
    this.spinner.show();
    this.preferenteService.preferenteObtenerPorId(this.id, this.usuarioActual.idUsuario).subscribe(
      (resultado: Preferente) => {
        const datosPreferente = resultado;        

        this.setTelefono(this.concatenarNumerosTelefonicos(datosPreferente.preferenteTelefono));
        this.concatenarZonasCorporales(datosPreferente.preferenteZonaCorporal);

        this.listaObservacionesDetalle = datosPreferente.preferenteObservacion;
        if (this.listaObservacionesDetalle === null) { this.listaObservacionesDetalle = []; }
        this.setObservacion(this.listaObservacionesDetalle);

        this.direccionDetalle.solodireccion = datosPreferente.direccion;
        this.direccionDetalle.idDistrito = datosPreferente.idUbicacion;
        this.direccionDetalle.idProvincia = datosPreferente.idUbicacion.substring(2, 4);
        this.direccionDetalle.idDepartamento = datosPreferente.idUbicacion.substring(0, 2);
        this.direccionDetalle.distrito = datosPreferente.distrito;
        this.direccionDetalle.provincia = datosPreferente.provincia;
        this.direccionDetalle.departamento = datosPreferente.departamento;
        this.direccionDetalle.cadenadireccion = datosPreferente.direccion + ' ' + datosPreferente.distrito + ' ' + datosPreferente.provincia + ' ' + datosPreferente.departamento;        

        this.setDireccion(this.direccionDetalle);

        this.frmPreferenteDatos.patchValue({
          preId: datosPreferente.id,
          preNombres: datosPreferente.nombres,
          preApellidos: datosPreferente.apellidos,
          preEmail: datosPreferente.email,
          preIdComentario: datosPreferente.idComentario == null ? '' : datosPreferente.idComentario,
          preRedFacebook: datosPreferente.usuFacebook,
          preRedInstagram: datosPreferente.usuInstagram,
          preIdMedioContacto: datosPreferente.idMedioContacto,
          preIdMedioRecontacto: datosPreferente.idMedioRecontacto,

          preIdMedioContactoCierre: !datosPreferente.idMedioContactoCierre ? 39 : datosPreferente.idMedioContactoCierre,
          prePromocion: datosPreferente.promocion,
          preIdTeleoperadorAsignado: datosPreferente.idTeleoperador == null ? null : datosPreferente.idTeleoperador,
          preIdEstado: datosPreferente.idEstado,
          esCliente: datosPreferente.esCliente,
          idCliente: datosPreferente.idCliente,
          cliente: datosPreferente.idCliente ? (datosPreferente.nombres + ' ' + datosPreferente.apellidos) : null,
          utmSource: datosPreferente.utmSource,
          utmMedium: datosPreferente.utmMedium,
          utmCampaign: datosPreferente.utmCampaign,
          utmId: datosPreferente.utmId,
          utmTerm: datosPreferente.utmTerm,
          codAtencion: datosPreferente.codAtencion
        });
        
        // Si ya tenemos las fuentes UTM cargadas, intentamos establecer el valor del autocomplete
        if (this.utmSourceOptions.length > 0 && datosPreferente.utmSource) {
          const sourceOption = this.utmSourceOptions.find(s => s.name === datosPreferente.utmSource);
          if (sourceOption) {
            this.frmPreferenteDatos.get('utmSourceInput')?.setValue(sourceOption);
            this.loadUtmCampaigns(sourceOption.id);
          } else {
            // Si no hay coincidencia exacta, establecer el texto directamente
            this.frmPreferenteDatos.get('utmSourceInput')?.setValue(datosPreferente.utmSource);
          }
        }

        if (datosPreferente.idEstado === 3 || datosPreferente.idEstado === 4 ){
          this.frmPreferenteDatos.get('preIdTeleoperadorAsignado').disable();
        }

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }
  concatenarNumerosTelefonicos(listaNumerosDetalle): string {
    if (listaNumerosDetalle == null){ return '   Sin número telefónico'; }
    this.listaNumerosDetalle = listaNumerosDetalle;
    let cadenNumerosTelefonicos = '';
    if (this.listaNumerosDetalle.length === 0){
      cadenNumerosTelefonicos = '   Sin número telefónico';
    } else {
      for (let i = 0; i < this.listaNumerosDetalle.length; i++) {
        cadenNumerosTelefonicos = cadenNumerosTelefonicos + ' - ' + this.listaNumerosDetalle[i].numero;
      }
    }
    return cadenNumerosTelefonicos.substring(3);
  }
  concatenarZonasCorporales(listaZonaCorporalDetalle): string {
    if (listaZonaCorporalDetalle == null){ return '   Sin zona corporal'; }
    this.listaZonaCorporalDetalle = listaZonaCorporalDetalle;
    let cadenaZonasCorporales = '';
    if (this.listaZonaCorporalDetalle.length === 0){
      cadenaZonasCorporales = '   Sin zona corporal';
    } else {
      for (let i = 0; i < this.listaZonaCorporalDetalle.length; i++) {
        cadenaZonasCorporales = cadenaZonasCorporales + ' - ' + this.listaZonaCorporalDetalle[i].descripcion;
      }
    }
    this.frmPreferenteDatos.patchValue({ preZonasCorporal: cadenaZonasCorporales.substring(3) });
  }
  onSelectTeleoperador(idTeleoperador: number): void{
       const idEstado = (idTeleoperador > 0 ) ? 2 : 1;
       this.frmPreferenteDatos.controls.preIdEstado.setValue(idEstado);
  }
  get preferente(): any{
    const idComentario = this.frmPreferenteDatos.controls.preIdComentario.value === ''
                          ? null
                          : parseInt(this.frmPreferenteDatos.controls.preIdComentario.value, 10);

    const preferenteObservacion = this.listaObservacionesDetalle.filter(f => f.id === 0);
    const idTeleoperador = parseInt(this.frmPreferenteDatos.controls.preIdTeleoperadorAsignado.value, 10);
    const idEstado = parseInt(this.frmPreferenteDatos.controls.preIdEstado.value, 0);
    
    // Para UTM Source, usamos el valor del control oculto que contiene el nombre
    let utmSourceValue = this.frmPreferenteDatos.controls.utmSource.value;
    
    // Para UTM Campaign, obtenemos el valor del control oculto o del input si existe
    let utmCampaignValue = this.frmPreferenteDatos.controls.utmCampaign.value;
    
    // Si no hay valores en los controles ocultos, pero hay en los inputs, los obtenemos de ahí
    const utmSourceInput = this.frmPreferenteDatos.get('utmSourceInput')?.value;
    if (!utmSourceValue && utmSourceInput) {
      if (typeof utmSourceInput === 'object' && utmSourceInput.name) {
        utmSourceValue = utmSourceInput.name;
      } else if (typeof utmSourceInput === 'string') {
        utmSourceValue = utmSourceInput;
      }
    }
    
    const utmCampaignInput = this.frmPreferenteDatos.get('utmCampaignInput')?.value;
    if (!utmCampaignValue && utmCampaignInput) {
      if (typeof utmCampaignInput === 'object' && utmCampaignInput.name) {
        utmCampaignValue = utmCampaignInput.name;
      } else if (typeof utmCampaignInput === 'string') {
        utmCampaignValue = utmCampaignInput;
      }
    }
    
    const model = {
      id: this.id,
      nombres: this.frmPreferenteDatos.controls.preNombres.value,
      apellidos: this.frmPreferenteDatos.controls.preApellidos.value,
      email: this.frmPreferenteDatos.controls.preEmail.value,
      promocion: this.frmPreferenteDatos.controls.prePromocion.value,
      idUbicacion: this.direccionDetalle.idDistrito,
      direccion: this.direccionDetalle.solodireccion,
      usuFacebook: this.f.preRedFacebook.value,
      usuInstagram: this.f.preRedInstagram.value,
      idTeleoperador,
      idComentario,
      idEstado,
      idMedioContacto: parseInt(this.frmPreferenteDatos.controls.preIdMedioContacto.value, 10),

      idMedioRecontacto: parseInt(this.frmPreferenteDatos.controls.preIdMedioRecontacto.value, 10),

      idMedioContactoCierre: !this.frmPreferenteDatos.controls.preIdMedioContactoCierre.value ? 39 : parseInt(this.frmPreferenteDatos.controls.preIdMedioContactoCierre.value, 10),
      otroMedioContacto: '',
      usuarioRegistra: this.usuarioActual.nombre,
      usuarioEdita: this.usuarioActual.nombre,
      preferenteTelefono: this.listaNumerosDetalle ,
      preferenteZonaCorporal: this.listaZonaCorporalDetalle,
      preferenteObservacion,
      esCliente: parseInt(this.f.esCliente.value, 10),
      idCliente: parseInt(this.f.idCliente.value, 10),
      utmSource : utmSourceValue,
      utmMedium : this.frmPreferenteDatos.controls.utmMedium.value,
      utmCampaign : utmCampaignValue,
      utmId : this.frmPreferenteDatos.controls.utmId.value,
      utmTerm : this.frmPreferenteDatos.controls.utmTerm.value,
      codAtencion : this.frmPreferenteDatos.controls.codAtencion.value,
      };
    return model;
  }
  get f(): any{ return this.frmPreferenteDatos.controls; }
  setDireccion(dir: Direccion): void {
    this.direccionDetalle = dir;
    this.frmPreferenteDatos.patchValue({ preDireccion: dir.cadenadireccion });
  }
  setTelefono(cadenaTelefonos: string): void{
    this.frmPreferenteDatos.patchValue({ preNumeros: cadenaTelefonos });
  }
  setObservacion(listaObservaciones: any[]): void{
    this.listaObservacionesDetalle = listaObservaciones;
    if (this.listaObservacionesDetalle != null) {
       if (this.listaObservacionesDetalle.length > 0 ){
         this.frmPreferenteDatos.patchValue({
           preObservacion: this.listaObservacionesDetalle.map(x => { return x.observacion }).join('\n')
         });
       }
    }
  }
  cerrarModal(output: boolean = false): void {
    this.modal.close(output);
  }
  abrirPreferenteCliente(): void {
    this.modalPreferenteClienteRef = this.modalService.open(PreferenteClienteComponent,{size: 'lg', backdrop: false, windowClass: 'bg-dark-50'});
    this.modalPreferenteClienteRef.componentInstance.idPreferente = this.id;

    this.modalPreferenteClienteRef.componentInstance.OnSelect.subscribe((res: any) => {
      // console.log(res);
      this.frmPreferenteDatos.patchValue({
        idCliente: res.id,
        cliente: res.nombresCompletos,
        preNombres: res.nombres,
        preApellidos: res.apellidos,
        preEmail: res.correo,
      })
    });

    /*this.modalPreferenteClienteRef = this.utilsService.abrirModal(modal, 'lg');
    console.log( this.modalPreferenteClienteRef );*/
  }
  abrirModalTelefono(): void{
    this.preferenteTelefonosComponent.abrirModal(); }
  abrirModalZonaCorporal(): void{
    this.preferenteZonaCorporalComponent.abrirModal(this.listaMaestra.zonasCorporales); }
  abrirModalUbigeo(modal): void{
    this.modalUbigeoRef = this.utilsService.abrirModal(modal, 'xl');
  }
  abrirModalComentario(): void{
    this.preferenteObservacionComponent.abrirModal(this.id); }
  aceptarTelefono(): void {
    this.frmPreferenteDatos.patchValue({ preNumeros : this.txtTelMascaraInput }); }
  limpiarFormulario(): void{
    this.listaZonaCorporalDetalle = [];
    this.listaNumerosDetalle = [];
    this.listaObservacionesDetalle = [];
    this.direccionDetalle = new Direccion();
    this.direccionDetalle.solodireccion = '';
    this.txtTelMascaraInput = '';
    this.txtUbicacionMascaraInput = '';
    this.txtZonCorporalMascaraInput = '';
    this.frmPreferenteDatos.patchValue({
      preId: 0,
      preNombres: '',
      preApellidos: '',
      preEmail: '',
      preNumeros: this.txtTelMascaraInput,
      preIdComentario: '',
      preDireccion: this.txtUbicacionMascaraInput,
      preIdMedioContacto: '',
      prePromocion: '',
      preZonasCorporal: this.txtZonCorporalMascaraInput,
      preIdTeleoperadorAsignado: null,
      preObservacion: '',
      esCliente: 0
    });
  }




  reasignarPreferente(idPreferente: number): void {
    this.modalPreferenteClienteRef = this.modalService.open(MdlPreferenteReasignarComponent,{size: 'lg', backdrop: false, windowClass: 'smodal fade round popins bg-dark-30'});
    this.modalPreferenteClienteRef.componentInstance.idPreferente = idPreferente;

    this.modalPreferenteClienteRef.componentInstance.OnUpdated.subscribe((res: boolean) => {
      if(res){
        this.modal.close(true);
      }
    });
  }


  /**
   * Events
   */
  evtConsultarPreferenteByUsuFacebook(): void{
    const value = this.f.preRedFacebook.value;
    if(value){
        this.preferenteService.preferenteObtenerPorUsuarioFacebook(value).subscribe((res: Preferente | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            this.setTelefono(this.concatenarNumerosTelefonicos(res.preferenteTelefono));

            this.frmPreferenteDatos.patchValue({

              preNombres: res.clienteNombre ? res.clienteNombre : res.nombres,
              preApellidos: res.clienteApellido ? res.clienteApellido : res.apellidos,
              preEmail: res.clienteCorreo ? res.clienteCorreo : res.email,

              esCliente: res.esCliente,
              idCliente: res.idCliente,
              cliente: res.idCliente ? ( res.clienteNombre + " " + res.clienteApellido) : null,

            });
          }
        }, error => {
          console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error', 'error');
        });
    }
    // console.log(value);
  }

  evtConsultarPreferenteByUsuInstagram(): void{
    const value = this.f.preRedInstagram.value;
    if(value){
      this.preferenteService.preferenteObtenerPorUsuarioInstagram(value).subscribe((res: Preferente | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message, 'error');
        }else{
          this.setTelefono(this.concatenarNumerosTelefonicos(res.preferenteTelefono));

          this.frmPreferenteDatos.patchValue({

            preNombres: res.clienteNombre ? res.clienteNombre : res.nombres,
            preApellidos: res.clienteApellido ? res.clienteApellido : res.apellidos,
            preEmail: res.clienteCorreo ? res.clienteCorreo : res.email,

            esCliente: res.esCliente,
            idCliente: res.idCliente,
            cliente: res.idCliente ? ( res.clienteNombre + " " + res.clienteApellido) : null,

          });
        }
      }, error => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error', 'error');
      });
    }
    // console.log(value);
  }

  /**
   * Carga las fuentes UTM disponibles desde la API
   */
  loadUtmSources(): void {
    this.isLoading = true;
    this.marketingService.getMapeoUtmSources().subscribe({
      next: (sources) => {
        this.utmSourceOptions = sources;
        
        // Si estamos editando un preferente, establecer el valor de UTM Source después de cargar las fuentes
        if (this.id > 0) {
          const utmSource = this.frmPreferenteDatos.get('utmSource')?.value;
          if (utmSource) {
            // Buscar la fuente correspondiente en las opciones cargadas por nombre
            const sourceOption = this.utmSourceOptions.find(s => s.name === utmSource);
            if (sourceOption) {
              // Establecer la fuente seleccionada para el ngModel
              this.selectedSourceOption = sourceOption;
              
              // Cargar las campañas relacionadas con esta fuente
              if (sourceOption.id) {
                this.loadUtmCampaigns(sourceOption.id);
              }
            }
          }
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las fuentes UTM:', error);
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Ya no necesitamos métodos de filtrado para mat-select
   */

  /**
   * Carga las campañas UTM basadas en el sourceId seleccionado
   * @param sourceId ID de la fuente UTM seleccionada
   */
  loadUtmCampaigns(sourceId: number): void {
    this.isLoading = true;
    this.marketingService.getMapeoUtmCampaignsBySourceId(sourceId).subscribe({
      next: (campaigns) => {
        this.selectedCampaigns = campaigns;
        
        // Habilitar el campo UTM Campaign si hay campañas disponibles
        if (campaigns && campaigns.length > 0) {
          this.enableUtmCampaignField();
        } else {
          this.disableUtmCampaignField();
        }
        
        // Si estamos editando un preferente, establecer el valor de UTM Campaign después de cargar las campañas
        if (this.id > 0) {
          const utmCampaign = this.frmPreferenteDatos.get('utmCampaign')?.value;
          if (utmCampaign) {
            // Buscar la campaña correspondiente en las opciones cargadas por nombre
            const campaignOption = this.selectedCampaigns.find(c => c.name === utmCampaign);
            if (campaignOption) {
              // Establecer la campaña seleccionada para el ngModel
              this.selectedCampaignOption = campaignOption;
            }
          }
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las campañas UTM:', error);
        this.selectedCampaigns = [];
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Ya no necesitamos métodos de filtrado para campañas con mat-select
   */
  
  /**
   * Ya no necesitamos funciones de display para mat-select
   */
  
  /**
   * Maneja la selección de un source en el autocomplete
   */
  onUtmSourceChanged(event: any): void {
    const source = event.value as MapeoUtmSource;
    
    // Actualizar el campo oculto del formulario
    if (source && source.name) {
      this.frmPreferenteDatos.get('utmSource')!.setValue(source.name);
      
      // Trigger para que se carguen las campañas relacionadas
      if (source.id) {
        this.loadUtmCampaigns(source.id);
      }
    } else {
      this.frmPreferenteDatos.get('utmSource')!.setValue('');
      this.selectedCampaigns = [];
      this.selectedCampaignOption = null;
    }
    
    // Restablecer la campaña seleccionada si cambia la fuente
    if (source?.id !== this.selectedSourceOption?.id) {
      this.frmPreferenteDatos.get('utmCampaign')!.setValue('');
      this.selectedCampaignOption = null;
    }
  }
  
  /**
   * Método para habilitar el campo de UTM Campaign
   */
  private enableUtmCampaignField(): void {
    // Obtener el control de UTM Campaign Input
    const utmCampaignInput = this.frmPreferenteDatos.get('utmCampaignInput');
    if (utmCampaignInput && utmCampaignInput.disabled) {
      // Habilitar el control
      utmCampaignInput.enable();
    }
  }
  
  /**
   * Maneja la selección de una campaña en el select
   */
  onUtmCampaignChanged(event: any): void {
    const campaign = event.value as MapeoUtmCampaign;
    if (campaign && campaign.name) {
      this.frmPreferenteDatos.get('utmCampaign')!.setValue(campaign.name);
    } else {
      this.frmPreferenteDatos.get('utmCampaign')!.setValue('');
    }
  }

}
