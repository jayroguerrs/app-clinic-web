import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {FacturaTipoDocumento} from "../../../../shared/models/facturacion/factura-tipo-documento";
import {Subscription} from "rxjs";
import {FacturaTipoDocumentoService} from "../../../../shared/services/facturacion/factura-tipo-documento.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {FacturaDatosCliente} from "../../../../shared/models/facturacion/factura-datos-cliente";
import {FacturaDatosClienteService} from "../../../../shared/services/facturacion/factura-datos-cliente.service";
import {EnumFacturaTipoDocumento, EnumTipoComprobante} from "../../../../shared/enumeracion/enums";
import {SunatService} from "../../../../shared/services/sunat.service";
import { SunatEntidad } from 'src/app/shared/models/sunat';

@Component({
    selector: 'app-mdl-datos-cliente-comprobante',
    templateUrl: 'mdl-datos-cliente-comprobante.component.html',
    styleUrls: ['./mdl-datos-cliente-comprobante.component.scss'],
})
export class MdlDatosClienteComprobanteComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() IdTipoComprobante: number;
    @Input() IdCliente: number | null = null;
    @Input() data: FacturaDatosCliente | undefined;
    @Output() OnCreated: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() OnUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

    estados: {id: number; value: string}[] = [
      {id: 0, value: 'INACTIVO'},
      {id: 1, value: 'ACTIVO'}
    ];

    // validar si es ticket
    esTicket = true;

    formGroup: FormGroup | undefined;
    submitted = false;
    ldSubmit: boolean;

    //// Tipos de documento del cliente
    ldFacturaTipoDocumento = false;
    sbcFacturaTipoDocumento: Subscription | null;
    facturaTipoDocumento: FacturaTipoDocumento[] = [];


    // Buscar datos del cliente por documento
    ldBuscarCliente: boolean;
    sbcBuscarCliente: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private modal: NgbActiveModal,
        public utilsService: UtilsService,
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private api: FacturaDatosClienteService,
        private facturaTipoDocumentoService: FacturaTipoDocumentoService,
        private sunatService: SunatService
    ) {
      this.ldSubmit = false;
      this.ldBuscarCliente = false;

      this.initForm();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void{
      console.log('Tipo Comprobante: ', this.IdTipoComprobante);
      this.obtenerTiposDocumentoCliente();
    }

    ngOnDestroy(): void {
      this.sbcBuscarCliente?.unsubscribe();
      this.sbcFacturaTipoDocumento?.unsubscribe();
    }

    initForm(): void {

      this.formGroup = this.formBuilder.group({
        idTipoDocumentoCliente: new FormControl('', Validators.required),
        numeroDocumentoCliente: new FormControl('', Validators.required),
        nombreCliente: new FormControl('', Validators.required),
        direccionFiscal: new FormControl(''),
        predeterminado: new FormControl(true, Validators.required),
        idEstado: new FormControl(1, Validators.required)
      })
      /************** Evento al cambiar el tipo de documento para el comprobante electrónico ************/
      this.formGroup.get('idTipoDocumentoCliente').valueChanges.subscribe(async (res) => {
        // Limpiar las validaciones
        this.f.direccionFiscal.clearValidators();
        this.f.numeroDocumentoCliente.clearValidators();
        this.f.numeroDocumentoCliente.setValidators(Validators.required);

        if(res){
          const tipoDocumentoCliente = await this.facturaTipoDocumento.find(x => x.id === parseInt( res, 10) );
          if(tipoDocumentoCliente){
            console.log(tipoDocumentoCliente);

            if(tipoDocumentoCliente.longitud > 0){
              await this.f.numeroDocumentoCliente.clearValidators();
              await this.f.numeroDocumentoCliente.setValidators([Validators.required, Validators.maxLength(tipoDocumentoCliente.longitud)]);
              // console.log(this.f.numeroDocumentoCliente);
            }

            if(tipoDocumentoCliente.id === EnumFacturaTipoDocumento.RUC){
              await this.f.direccionFiscal.setValidators(Validators.required);
            }
          }
        }

        this.formGroup.get('numeroDocumentoCliente').updateValueAndValidity();
        this.formGroup.get('direccionFiscal').updateValueAndValidity();
      });

    }

    patchForm(data: FacturaDatosCliente): void{
      // console.log(this.data);
      this.formGroup.patchValue({
        idTipoDocumentoCliente: data.idTipoDocumentoCliente ? data.idTipoDocumentoCliente : '',
        numeroDocumentoCliente: data.numeroDocumentoCliente,
        nombreCliente: data.nombreCliente,
        direccionFiscal: data.direccion,
        predeterminado: data.predeterminado,
        idEstado: data.idEstado
      });
    }

    get f(): any { return this.formGroup.controls; }
    get loading(): boolean{
      return  this.ldSubmit ||
        this.ldFacturaTipoDocumento;
    }
    get model(): any {
        return {
            idCliente: this.IdCliente,
            denominacion: this.f.nombreCliente.value.toUpperCase(),
            idTipoDocumento: parseInt(this.f.idTipoDocumentoCliente.value, 10),
            numeroDocumento: this.f.numeroDocumentoCliente.value,
            direccion: this.f.direccionFiscal.value,
            idUsuarioRegistro: this.data ? null : this.usuarioService.UsuarioActual.idUsuario,
            idUsuarioModifico: this.data ? this.usuarioService.UsuarioActual.idUsuario : null,
          // plantilla: this.f.plantilla.value,
            predeterminado: this.f.predeterminado.value,
            idEstado: parseInt(this.f.idEstado.value, 10)
        };
    }

    onSubmit(): void {
        this.submitted = true;
        console.log(this.formGroup);

        if (this.formGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            console.log(this.formGroup);
            this.ldSubmit = false;
            return;
        }

        if (this.data ){
            // EDITAR
          Swal.fire({
            html: `Desea editar los datos de facturación??`,
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            customClass: {
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
              cancelButton: 'btn sbtn btn-light popins mr-2',
            },
            reverseButtons: true
          }).then(
            result => {
              if(result.isConfirmed) {
                this.ldSubmit = true;
                this.api.modificar(this.model).subscribe((res: boolean | ErrorSistema)=> {

                    if (res instanceof ErrorSistema){

                      Swal.fire({
                        title: 'Error',
                        text: res.message,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                          confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                        }
                      });

                      this.ldSubmit = false;
                    }else{
                      Swal.fire({
                        html: `Se modifico los datos de facturación con exito!!!`,
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                        }
                      });
                      this.OnUpdated.emit(true);
                      this.ldSubmit = false;
                      this.cerrarModal(true);
                    }

                  },
                  error => {
                    Swal.fire({
                      title: 'Error',
                      html: `Error al intentar modificar los datos de facturación`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                    console.log('Error al modificar los datos de facturación', error);
                    this.ldSubmit = false;
                  });
              }else{
                this.cerrarModal();
              }
            }
          );

        } else {
            // NUEVO
          Swal.fire({
            title: 'Desea registrar los nuevos datos de facturación??',
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            customClass: {
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
              cancelButton: 'btn sbtn btn-light popins mr-2',
            },
            reverseButtons: true
          }).then(
            result => {
              if(result.isConfirmed) {
                this.api.registrar(this.model).subscribe((res: boolean | ErrorSistema) => {
                    if (res instanceof ErrorSistema){

                      Swal.fire({
                        title: 'Error',
                        text: res.message,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                          confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                        }
                      });

                      this.ldSubmit = false;
                    }else{
                      Swal.fire({
                        text: "Se registraron los nuevos datos de facturacíón con exito",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                        }
                      });
                      this.ldSubmit = false;
                      this.OnCreated.emit(true);
                      this.cerrarModal(true);
                    }
                  },
                  error => {
                    this.ldSubmit = false;
                    console.log('Error al registrar los datos de facturación', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar los datos de facturación',
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                  });
              }
            }
          );
        }
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }


    /****************************************************************************************************************
     * Obtener los tipos de documento del cliente para la facturación
     */
    obtenerTiposDocumentoCliente(): void{
      this.ldFacturaTipoDocumento =  true;
      this.sbcFacturaTipoDocumento = this.facturaTipoDocumentoService.listar2(this.usuarioService.UsuarioActual.idUsuario).subscribe((res: FacturaTipoDocumento[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          Swal.fire({
            title: 'Error',
            text: res.message,
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'popins rounded-grant shadow',
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
            }
          });
        }else{
          if(this.IdTipoComprobante === EnumTipoComprobante.FACTURA){
            // console.log(res);
            this.facturaTipoDocumento = res.filter(x => x.id === EnumFacturaTipoDocumento.RUC);
          }else{
            this.facturaTipoDocumento = res;
          }
          // this.formGroup.patchValue({
          //   idTipoDocumentoCliente: res[0].id
          // })
        }
        this.ldFacturaTipoDocumento = false;
      }, error => {
        this.ldFacturaTipoDocumento = false;
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los tipos de documento',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'popins rounded-grant shadow',
            confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
          }
        });
      });
    }


    /****************************************************************************************************************
     * Events
     */
    evtBuscarCliente(): void{
      if(this.f.idTipoDocumentoCliente.invalid){
        this.utilsService.mostrarToast('Falta seleccionar el tipo de documento', 'warning');
        return;
      }
      if(this.f.numeroDocumentoCliente.invalid){
        this.utilsService.mostrarToast('Falta ingresar el número del documento', 'warning');
        return;
      }
      const numeroDocumento = this.f.numeroDocumentoCliente.value.trim()
      const idTipoDocumento = parseInt( this.f.idTipoDocumentoCliente.value, 10);
      if(!(idTipoDocumento === EnumFacturaTipoDocumento.RUC || idTipoDocumento === EnumFacturaTipoDocumento.DNI) ){
        this.utilsService.mostrarToast('Solo puedes consultar Ruc o Dni', 'warning');
        return;
      }

      this.ldBuscarCliente = true;
      this.sbcBuscarCliente = this.sunatService.buscarEntidad(numeroDocumento, idTipoDocumento).subscribe((res: SunatEntidad | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message, 'error');
        }else{
          this.formGroup.patchValue({
            nombreCliente: res.nombre,
            direccionFiscal: res.direccion,
          })
        }
        this.ldBuscarCliente = false;
      }, error => {
          this.ldBuscarCliente = false;
      })
    }

}
