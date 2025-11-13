import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { ClienteService } from '../../../shared/services/cliente.service';
import Swal from 'sweetalert2';
import { ImportExportDataService } from '../../../shared/services/import-export-data.service';
import { Direccion, PreferenteUbigeoComponent } from '../../preferente/preferente-ubigeo/preferente-ubigeo.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TipoPerfil } from '../../../shared/enumeracion/enums';
import { Subscription } from 'rxjs';
import {MdlAgendarCitaComponent} from "../../modals/mdl-agendar-cita/mdl-agendar-cita.component";
import { error } from 'console';
import { ClienteRuc } from 'src/app/shared/models/cliente';

@Component({
    selector: 'app-cliente-datos',
    templateUrl: 'cliente-datos.component.html',
    styleUrls: ['cliente-datos.component.scss']
})
export class ClienteDatosComponent implements OnInit, OnDestroy {
    @ViewChild(PreferenteUbigeoComponent, {static: false}) preferenteUbigeoComponent: PreferenteUbigeoComponent;
    @Output() eventClienteListar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() maestroDepartamento: any = [];
    @Input() maestroGenero: any[];
    @Input() maestroTipoDocumento: any[];
    @Input() maestroMedioContacto: any = [];
    @Input() modal: NgbModalRef;
    @Input() idCliente: number;

    @Input() celularNuevoCliente: string = '';



    archivoImagenCliente: File = null;
    rutaImagenCliente: any; // '../../../../assets/images/alumno.png';

    bnotfoundRUC=false;
    bnotfoundDNI=false;
    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    frmClienteDatos: FormGroup;
    clienteDatos: any;
    mostrarOtroMedioContacto: boolean = false;
    direccionDetalle: Direccion;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
    paises: any = [
        {id: 54, pais: 'Argentina', selected: false },
        {id: 591, pais: 'Bolivia', selected: false },
        {id: 55, pais: 'Brasil', selected: false },
        {id: 56, pais: 'Chile', selected: false },
        {id: 57, pais: 'Colombia', selected: false },
        {id: 506, pais: 'Costa Rica', selected: false },
        {id: 53, pais: 'Cuba', selected: false },
        {id: 593, pais: 'Ecuador', selected: false },
        {id: 34, pais: 'España', selected: false },
        {id: 52, pais: 'Maxico', selected: false },
        {id: 595, pais: 'Paraguay', selected: false },
        {id: 51, pais: 'Perú', selected: true },
        {id: 598, pais: 'Uruguay', selected: false },
        {id: 58, pais: 'Venezuela', selected: false },
        {id: 1, pais: 'EEUU', selected: false },
        {id: 39, pais: 'Italia', selected: false }
    ];

    // Subscripciones
    subscriptionForm : Subscription;
    subscriptionSearchCLient: Subscription;
    subscriptionValidatePhone: Subscription;

    // Modal
    modalUbigeoRef: NgbModalRef;


    preferenteCliente: any | null = null;
    modalRef: NgbModalRef | undefined;



    dataUsuarios: Array<{id: string, text: string}> = [];
    maestroUsuarios: any = [];
    sbcCollectionUsuarios: Subscription;



    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private utilsService: UtilsService,
        private clienteService: ClienteService,
        private importExportDataService: ImportExportDataService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private modalService: NgbModal
    ) {}

    agregarCelularNuevoCliente(){
      if(this.celularNuevoCliente){
        this.frmClienteDatos.patchValue({
          cliCelular1: this.celularNuevoCliente,
        });
      }
    }

    ngOnInit(): void {
        this.direccionDetalle = new Direccion();
        this.usuarioActual = this.usuarioService.UsuarioActual;

        this.usuarioListar();


        if(this.idCliente > 0 )
        {
            this.accion = 'Editar';
            this.inicializarFormulario();
            this.clienteBuscar();
        } else {
            this.inicializarFormulario();
            this.accion = 'Nuevo';

            //Validar si existe datos en preferenteCliente
            this.preferenteCliente = this.importExportDataService.preferenteClienteImport();
            if(this.preferenteCliente != null) {
                this.frmClienteDatos.patchValue({
                    cliNombres : this.preferenteCliente.nombres,
                    cliApellidos: this.preferenteCliente.apellidos,
                    cliCorreo: this.preferenteCliente.email,
                    cliCelular1: this.preferenteCliente.numero1,
                    // cliPaisCelular1: preferenteCliente.paisNumero1,
                    cliCelular2: this.preferenteCliente.numero2,
                    // cliPaisCelular2: preferenteCliente.paisNumero2,
                    cliMedioContacto: this.preferenteCliente.medioContacto,
                    preDirecccion: this.preferenteCliente.direccion
                });
            }
        }

        this.agregarCelularNuevoCliente();
    }
    ngOnDestroy(): void{
      // Destroy subscription
      if ( this.subscriptionForm ){ this.subscriptionForm.unsubscribe() }
      if ( this.subscriptionSearchCLient ){ this.subscriptionSearchCLient.unsubscribe() }
      if ( this.subscriptionValidatePhone ){ this.subscriptionValidatePhone.unsubscribe() }
      // Destroy modals
      if ( this.modalUbigeoRef ){ this.modalUbigeoRef.close(); }
      this.spinner.hide();
      this.sbcCollectionUsuarios?.unsubscribe();
    }
    inicializarFormulario(): void {
        this.frmClienteDatos = this.formBuilder.group({
            cliNombres: new FormControl('', Validators.required),
            cliApellidos: new FormControl('', Validators.required),
            cliSeudonimo: new FormControl(''),
            cliCorreo: new FormControl('', [Validators.maxLength(100), Validators.email]),
            cliFechaNacimiento: new FormControl(''),
            cliIdDocumentoIdentidadTipo: new FormControl(0),
            cliDocumento: new FormControl({ value: '', disabled: true}, Validators.maxLength(20)),
            cliCelular1: new FormControl('', Validators.required),
            cliPaisCelular1: new FormControl(51),
            cliCelular2: new FormControl(''),
            cliPaisCelular2: new FormControl(51),
            cliMedioContacto: new FormControl(0),
            otroMedioContacto: new FormControl(''),
            cliPublicidad: new FormControl(''),
            cliIdGenero: new FormControl('', Validators.required),
            cliIdEstado: new FormControl(1, Validators.required),
            preDireccion: new FormControl(''),
            cliEdad: new FormControl(0),
            foto: this.rutaImagenCliente,
            cliHistoriaCli: new FormControl(''),
            idEspecialista: ['0'],
            cliRuc: new FormControl('',[ Validators.maxLength(11),Validators.minLength(11)]),
            cliRazonSocial: new FormControl('')
        });
    }
    get celular1(): string {
        let re = /[^\d]/g;
        return this.frmClienteDatos.controls.cliCelular1.value.replace(re, '').trim();
    }
    get celular2(): string {
        let re = /[^\d]/g;
        return this.frmClienteDatos.controls.cliCelular2.value.replace(re, '').trim();
    }
    get findInvalidControls() {
        const invalid = [];
        const controls = this.frmClienteDatos.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }
    get f(): any {
        return this.frmClienteDatos.controls;
    }
    get cliente(): any {
        if (this.frmClienteDatos.invalid) {
            console.log('Error en los siguientes controles: ', this.findInvalidControls);
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            return null;
        }

        //Dejar solo 9 digitos y quitar los espacios del numero celular
        let celular1 = this.celular1;
        if( celular1.length == 0){
            this.utilsService.mostrarToast('Número de celular principal incorrecto!!!', 'error');
            return null;
        }

        let celular2 = this.celular2;
        if(celular2.length > 0 && celular2.length < 9){
            this.utilsService.mostrarToast('Número de celular secundario incorrecto!!!', 'error');
            return null;
        }

        if(this.usuarioActual.idperfil == TipoPerfil.OPERADOR || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA || this.usuarioActual.idperfil == TipoPerfil.MARKETING || this.usuarioActual.idperfil == TipoPerfil.SUPERVISORVENTAS) {
            if(this.direccionDetalle.idDistrito == '0' || this.direccionDetalle.idDistrito == undefined) {
                Swal.fire({
                    title: 'Falta ingresar el distrito del cliente en el campo dirección!, caso contrario consultar al supervisor(a)',
                    icon: 'info'});
                return null;
            }
        }


        const fechaNacimiento = this.frmClienteDatos.controls.cliFechaNacimiento.value == '' ? null : this.frmClienteDatos.controls.cliFechaNacimiento.value;

        let idDocumentoIdentidadTipo = this.frmClienteDatos.controls.cliIdDocumentoIdentidadTipo.value;
        if(idDocumentoIdentidadTipo == '' ) idDocumentoIdentidadTipo = null;
        if(idDocumentoIdentidadTipo == null && this.frmClienteDatos.controls.cliDocumento.value.length > 0) {
            this.utilsService.mostrarToast('Si ingresó un número de documento, por favor seleccione tipo de documento', 'error');
            return null;
        }
        idDocumentoIdentidadTipo = (idDocumentoIdentidadTipo == null) ? null : parseInt(idDocumentoIdentidadTipo, 10);
        if(idDocumentoIdentidadTipo == 1) {
            if(this.frmClienteDatos.controls.cliDocumento.value.length != 8) {
                this.utilsService.mostrarToast('DNI incorrecto por favor verifique!!!', 'error');
                return null;
            }
        }

        let ruc= this.frmClienteDatos.controls.cliRuc.value;
        let razonSocial= this.frmClienteDatos.controls.cliRazonSocial.value;
        if (razonSocial!=undefined && razonSocial!="" ){
            if (ruc?.length!=11 && ruc?.length>0){
                this.utilsService.mostrarToast('Ingrese el número de Ruc asociado a la razón social', 'error');
                return null;
            }
        }
     



        let idGenero = this.frmClienteDatos.controls.cliIdGenero.value;
        idGenero = (idGenero !== '') ? parseInt(idGenero, 10) : null;

        const model = {
            id: this.idCliente,
            nombres: this.frmClienteDatos.controls.cliNombres.value.trim(),
            apellidos: this.frmClienteDatos.controls.cliApellidos.value.trim(),
            seudonimo: this.frmClienteDatos.controls.cliSeudonimo.value,
            idGenero,
            celular1,
            paisCelular1: parseInt(this.frmClienteDatos.controls.cliPaisCelular1.value, 10),
            celular2,
            paisCelular2: parseInt(this.frmClienteDatos.controls.cliPaisCelular2.value, 10),
            correo: this.frmClienteDatos.controls.cliCorreo.value,
            idMedioContacto: parseInt(this.frmClienteDatos.controls.cliMedioContacto.value, 10),
            otroMedioContacto: this.frmClienteDatos.controls.otroMedioContacto.value,
            publicidad: this.frmClienteDatos.controls.cliPublicidad.value,
            fechaNacimiento,
            usuarioRegistra: this.usuarioActual.nombre,
            usuarioEdita: this.usuarioActual.nombre,
            serieFirma: '0',
            serieHuella: '0',
            documento: this.frmClienteDatos.controls.cliDocumento.value,
            idDocumentoIdentidadTipo,
            idEstado: parseInt(this.frmClienteDatos.controls.cliIdEstado.value, 10),
            idUbicacion: this.direccionDetalle.idDistrito,
            direccion: this.direccionDetalle.solodireccion,
            foto: this.rutaImagenCliente,
            idHistoriaClinica: this.frmClienteDatos.controls.cliHistoriaCli.value,
            idPreferente: this.preferenteCliente ? this.preferenteCliente.id : 0,
            idEspecialista: parseInt( this.frmClienteDatos.controls.idEspecialista.value, 10 ),
            ruc: (this.frmClienteDatos.controls.cliRazonSocial.value==undefined || this.frmClienteDatos.controls.cliRazonSocial.value=="" || this.frmClienteDatos.controls.cliRuc.value=="")?null:   this.frmClienteDatos.controls.cliRuc.value,
            razonSocial:  (this.frmClienteDatos.controls.cliRuc.value==undefined || this.frmClienteDatos.controls.cliRuc.value=="" )?"" : this.frmClienteDatos.controls.cliRazonSocial.value
        };
        return model;
    }

    clienteGrabar(): void {
        this.clienteValidarCelular(this.idCliente);
    }
    grabar(idCliente): void {
        if (idCliente > 0 ){
            this.clienteModificar();
         } else {
             //Ver
             this.clienteNuevo();
         }
    }
    clienteBuscar(): void {
        this.spinner.show();
        this.subscriptionSearchCLient = this.clienteService.obtenerById(this.idCliente).subscribe(
            resultado => {
                this.clienteDatos = resultado;

                this.direccionDetalle.solodireccion = this.clienteDatos.direccion;
                this.direccionDetalle.idDistrito = this.clienteDatos.idUbicacion;
                this.direccionDetalle.idProvincia = this.clienteDatos.idUbicacion.substring(2, 4);
                this.direccionDetalle.idDepartamento = this.clienteDatos.idUbicacion.substring(0, 2);
                this.direccionDetalle.distrito = this.clienteDatos.distrito;
                this.direccionDetalle.provincia = this.clienteDatos.provincia;
                this.direccionDetalle.departamento = this.clienteDatos.departamento;
                this.direccionDetalle.cadenadireccion = this.clienteDatos.direccion + ' ' + this.clienteDatos.distrito + ' ' + this.clienteDatos.provincia + ' ' + this.clienteDatos.departamento;
                this.setDireccion(this.direccionDetalle);

                this.rutaImagenCliente = resultado.foto;

                console.log(this.clienteDatos.documento);

                this.frmClienteDatos.patchValue({
                    cliNombres : this.clienteDatos.nombres,
                    cliApellidos: this.clienteDatos.apellidos,
                    cliSeudonimo: this.clienteDatos.seudonimo,
                    cliIdGenero: this.clienteDatos.idGenero,
                    cliCorreo: this.clienteDatos.correo,
                    cliDireccion: this.clienteDatos.direccion,
                    cliMedioContacto: this.clienteDatos.idMedioContacto,
                    otroMedioContacto: this.clienteDatos.otroMedioContacto,
                    cliPublicidad: this.clienteDatos.publicidad,
                    cliIdEstado: this.clienteDatos.idEstado,
                    cliIdDocumentoIdentidadTipo: this.clienteDatos.idDocumentoIdentidadTipo,
                    cliDocumento: this.clienteDatos.documento,
                    cliUbicacion: this.clienteDatos.idUbicacion,
                    cliCelular1: this.clienteDatos.celular1,
                    cliCelular2: this.clienteDatos.celular2,
                    cliHistoriaCli: this.clienteDatos.idHistoriaClinica,
                    idEspecialista: this.clienteDatos.idEspecialista.toString(),
                    cliPaisCelular1 : this.clienteDatos.paisCelular1,
                    cliRuc:this.clienteDatos.ruc,
                    cliRazonSocial:this.clienteDatos.razonSocial
                });

                if(this.clienteDatos.documento != null  || this.clienteDatos.documento != ''){
                  this.frmClienteDatos.get('cliDocumento').enable();
                }

                if(this.clienteDatos.fechaNacimiento != null) {
                    this.frmClienteDatos.get('cliFechaNacimiento').patchValue(this.utilsService.formatDate(this.clienteDatos.fechaNacimiento));
                }
                this.change_OtroMedioContacto();
                this.spinner.hide();

                $('#txtDocumento').val(this.clienteDatos.documento);
            },
            error => {
                console.log(error);
                this.spinner.hide();
            }
        );
    }
    clienteNuevo(): void {
        this.submitted = true;


        this.spinner.show();

        const datosCliente = this.cliente;
        if(datosCliente == null) {
            this.spinner.hide();
            return null;
        }

        this.subscriptionForm = this.clienteService.guardar(this.cliente).subscribe(
            resultado => {
                if(resultado.exito) {
                    this.spinner.hide();
                    this.clienteAgendarCita(resultado);
                } else {
                    this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                    this.spinner.hide();
                }
            },
            error => {
                console.log('Error al registrar al cliente', error);
                this.spinner.hide();
            }
        );
    }
    clienteValidarCelular(idCliente): void {
        let cel1 = this.celular1;
        let cel2 = this.celular2;
        cel1 = cel1 == '' ? '0' : cel1;
        cel2 = cel2 == '' ? '0' : cel2;

        if(cel1 != ''){
            this.subscriptionValidatePhone = this.clienteService.validarNumeroCelular(idCliente, cel1, cel2).subscribe(
                resultado => {
                    if(!resultado.exito)
                    {
                        const urlClienteNumero = `${environment.frontEndUrl}/ClienteNumero?tipo=vernumero&numero1=${cel1}&numero2=${cel2}`;
                        Swal.fire({
                            title: resultado.mensaje,
                            html: '¿Aun así, desea registrar al cliente? <hr><a href=' + urlClienteNumero + ' target="_blank">Ver números</h6>',
                            icon: 'warning',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: true,
                            confirmButtonText: 'Si',
                            showCancelButton: true,
                            cancelButtonText: 'No',
                        }).then(
                            result => {
                                if(result.isConfirmed) {
                                    this.grabar(idCliente);
                                }
                            }
                        );
                    } else {
                        this.grabar(idCliente);
                    }
                },
                error => {
                    console.log('Error al validar los numeros celulares', error);
                }
            );
        }
    }
    clienteModificar(): void {
        this.spinner.show();
        this.subscriptionForm = this.clienteService.actualizar(this.cliente).subscribe(
            resultado => {
                if(resultado.exito){
                    Swal.fire(resultado.mensaje).then((result) => this.eventClienteListar.emit(true));
                    this.cerrarModal();
                    this.spinner.hide();
                } else {
                    this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                    this.spinner.hide();
                }
            },
            error => {
                console.log('Error al actualizar al cliente', error);
                this.spinner.hide();
            }
        );
    }
    clienteAgendarCita(resultado): void {
        Swal.fire({
            title: 'Cliente',
            icon: 'success',
            text: resultado.mensaje + ' ¿Desea agendar una cita?',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            showCancelButton: true
        }).then(
            result =>
            {
                if(result.isConfirmed) {
                    this.eventClienteListar.emit(true);

                    console.log('resultado', resultado);

                    this.modalRef = this.modalService.open(MdlAgendarCitaComponent,{size: 'xl', backdrop: "static", windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, backdropClass: 'bg-transparent', animation: true});
                    this.modalRef.componentInstance.idCliente = resultado.response.id;
                    this.modalRef.componentInstance.idPreferente = resultado.response.idPreferente;
                    this.modalRef.componentInstance.esPreferente = !!resultado.response.idPreferente;
                    this.modalRef.componentInstance.preferente = {nombres: resultado.response.nombres, apellidos: resultado.response.apellidos, id: resultado.response.idPreferente };


                    // const citaNueva = 0;
                    // this.router.navigate([]).then(result => {  window.open(`Cita/${citaNueva}/${AccionCita.NUEVA}/${resultado.response.id}/${resultado.response.idPreferente}`, '_blank'); });
                }else{
                  this.cerrarModal();
                }
            }
        );

        this.eventClienteListar.emit(true);
        this.cerrarModal();
        this.spinner.hide();
    }
    mostrarFotoCliente(file: FileList) {
        return;
        this.archivoImagenCliente = file.item(0);
        const reader = new FileReader();
        reader.onload = event => this.rutaImagenCliente = event.target.result;
        reader.readAsDataURL(this.archivoImagenCliente);
    }
    abrirModalUbigeo(modal: NgbModalRef): void{
        this.modalUbigeoRef = this.utilsService.abrirModal(modal, 'md');
    }
    setDireccion(dir: Direccion): void {
        this.direccionDetalle = dir;
        this.frmClienteDatos.patchValue({ preDireccion: dir.cadenadireccion });
      }
    getClienteImport(): void {
        const clienteImportClass = this.importExportDataService.ClienteImport();
    }
    change_OtroMedioContacto(): void {
        if(this.frmClienteDatos.controls.cliMedioContacto.value === "5") {
            this.mostrarOtroMedioContacto = true;
        } else {
            this.mostrarOtroMedioContacto = false;
        }
    }
    cerrarModal(): void {
        this.modal.close();
    }
    calculaEdad(): void {
        const edad = this.utilsService.calculaEdad(this.frmClienteDatos.controls.cliFechaNacimiento.value);
        this.frmClienteDatos.get('cliEdad').setValue(edad);
    }

    validarFormatoDocumento(event): void {
        const tipoDocumentoSeleccionado = parseInt(event.target.value, 10);
        let documento = this.frmClienteDatos.controls.cliDocumento.value;
        switch(tipoDocumentoSeleccionado) {
            case 0: {
                documento = '';
                this.frmClienteDatos.controls.cliDocumento.disable();
                this.frmClienteDatos.patchValue({
                   cliDocumento: documento
                });
                break;
            }
            case 1: {
                documento = '';
                this.frmClienteDatos.controls.cliDocumento.enable();
                break;
            }
            case 2:
            case 3: {
                documento = '';
              this.frmClienteDatos.controls.cliDocumento.enable();
                break;
            }
        }
        // this.frmClienteDatos.patchValue({
        //     cliDocumento: documento
        // });
    }
    validarFormatoCelular1(event): void {
        this.frmClienteDatos.patchValue({
            cliCelular1: ''
        });
    }
    validarFormatoCelular2(event): void {
        this.frmClienteDatos.patchValue({
            cliCelular2: ''
        });
    }


  usuarioListar(): void {
    this.sbcCollectionUsuarios = this.usuarioService.obtenerUsuarios(true).subscribe(
      resultado => {
        this.maestroUsuarios = resultado;
        this.dataUsuarios = this.maestroUsuarios.map((x) => {
          return {
            id: x.idUsuario,
            text:x.nombre
          };
        });
        this.dataUsuarios.unshift({ id: '0', text: '...TODOS...' });
        // this.dataUsuarios.forEach(u => {
        //   const data = {
        //     id: u.idUsuario,
        //     text:u.nombre
        //   }
        // });
        // console.log(this.dataUsuarios);
      },
      error => console.log('Error al obtener los usuario', error)
    );
  }

    buscarRuc(): void {
        // var model=this.f;
        if (this.f.cliRuc.value != undefined && this.f.cliRuc.value != "") {

            this.spinner.show();
            this.bnotfoundRUC = false;
            this.clienteService.obtenerRuc(this.f.cliRuc.value).subscribe(result => {
                if (result != null) {
                    this.bnotfoundRUC = false;
                    this.f.cliRazonSocial.setValue(result.razonSocial);
                    this.f.cliRuc.setValue(result.ruc);

                } else {
                    this.f.cliRazonSocial.setValue("");
                    this.bnotfoundRUC = true;
                }

            }, error => {
                console.log('Error al obtener ruc', error);


            });
            this.spinner.hide();
        }
    }

    buscarDNI(): void {
        // var model=this.f;
        if (this.f.cliDocumento.value != undefined && this.f.cliDocumento.value != "" && this.f.cliIdDocumentoIdentidadTipo.value==1) {

            this.spinner.show();
            this.bnotfoundDNI = false;
            this.clienteService.obtenerDatosDNI(this.f.cliDocumento.value).subscribe(result => {
                if (result != null) {
                    this.bnotfoundDNI = false;
                    this.f.cliNombres.setValue(result.nombres);
                    this.f.cliApellidos.setValue(result.apellidoPaterno + ' '+ result.apellidoMaterno);

                } else {
                    this.f.cliNombres.setValue("");
                    this.f.cliApellidos.setValue("");
                    this.bnotfoundDNI = true;
                }

            }, error => {
                console.log('Error al obtener DNI', error);


            });
            this.spinner.hide();
        }
    }


}
