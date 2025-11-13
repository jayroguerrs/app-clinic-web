import {AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import {CitaNuevoItem, FacturaDatosCita} from "../../../../shared/models/facturacion/factura-datos-cita";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {FacturaTipoDocumento} from "../../../../shared/models/facturacion/factura-tipo-documento";
import {Subscription} from "rxjs";
import {FacturaTipoDocumentoService} from "../../../../shared/services/facturacion/factura-tipo-documento.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {FacturaDatosCliente} from "../../../../shared/models/facturacion/factura-datos-cliente";
import {MedioContactoService} from "../../../../shared/services/medio-contacto.service";
import {MedioContacto, ZonaCorporal} from "../../../preferente/preferente.models";
import {ServicioService} from "../../../../shared/services/servicio.service";
import {Servicio} from "../../../../shared/models/servicio";
import {Servicios} from "../../../../shared/enumeracion/enums";
import {ZonaCorporalService} from "../../../../shared/services/zona-corporal.service";
import {Zona} from "../../../../shared/models/zonas";
import { NgSelectConfig } from '@ng-select/ng-select';
import {PromocionService} from "../../../../shared/services/promocion.services";
import {PromocionZonaService} from "../../../../shared/services/promocionZona.services";
import {PromocionZona} from "../../../../shared/models/promocion";
import {Tecnologia} from "../../../../shared/models/tecnologia";
import {TecnologiaService} from "../../../../shared/services/tecnologia.service";
import {UsuarioSeleccionComponent} from "../../../usuario/usuario-seleccion/usuario-seleccion.component";
import {CitaDetalle} from "../../../../shared/models/cita";
import {CitaService} from "../../../../shared/services/cita.service";

@Component({
    selector: 'app-mdl-nuevo-item',
    templateUrl: 'mdl-nuevo-item.component.html',
    styleUrls: ['./mdl-nuevo-item.component.scss'],
})
export class MdlNuevoItemComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() IdCita: number;
    @Input() IdSede: number;
    @Input() IdServicio: number;
    @Output() OnAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

    modalRef: NgbModalRef | undefined;

    submittedNuevoItem = false;
    ldSubmit = false;
    sbcSubmit: Subscription | undefined;



    formGroup: FormGroup;

    servicioEnum = Servicios;

    // data medios contacto
    ldMediosContacto = false;
    sbcMediosContacto: Subscription | undefined;
    mediosContacto : MedioContacto[] =[];

    // data servicios
    ldServicios = false;
    sbcServicio: Subscription | undefined;
    servicios: Servicio[] = [];

    // data zonas
    ldZonasCorporales = false;
    sbcZonasCorporales: Subscription | undefined;
    zonasCorporales: Zona[] = [];

    // data promocion zona
    ldPromocionesZona = false;
    sbcPromocionesZona: Subscription | undefined;
    promocionesZona: PromocionZona[] =[];

    // data tecnologias
    ldTecnologias = false;
    sbcTecnologias: Subscription | undefined;
    tecnologias: Tecnologia[] = [];

    primeraSesion = true;

    citaDetalles: CitaNuevoItem[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private modal: NgbActiveModal,
        public utilsService: UtilsService,
        private datePipe: DatePipe,
        private modalService: NgbModal,

        private medioContactoService: MedioContactoService,
        private servicioService: ServicioService,
        private zonaCorporalService: ZonaCorporalService,
        private config: NgSelectConfig,
        private promocionZonaService: PromocionZonaService,
        private tecnologiaService: TecnologiaService,
        private citaService: CitaService
    ) {
      this.config.notFoundText = 'No se encontraron resultados';

      this.initForm();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void{
      this.obtenerServicios();
      this.obtenerMediosContacto();
    }

    ngOnDestroy(): void {
    }

    initForm(): void {
      this.formGroup = this.formBuilder.group({
        idServicio: new FormControl({value: '', disabled: true}, Validators.required),
        idZona: new FormControl(null, Validators.required),
        idTecnologia: new FormControl(''),
        idPromocionPrecio: new FormControl(null, Validators.required),
        sesion: new FormControl(1, Validators.required),
        precio: new FormControl(0.00, Validators.required),
        minutos: new FormControl(0, Validators.required),
        agendadoPor: new FormControl('', Validators.required),
        idAgendadoPor: new FormControl(null, Validators.required),
        idOrigenMedio: new FormControl('', Validators.required),
        retroceso: new FormControl(false),
        pagoWeb: new FormControl(false)
      });
      this.formGroup.get('idServicio').valueChanges.subscribe((res) => {
        this.formGroup.patchValue({
          idZona: null,
          idPromocionPrecio: null,
          idTecnologia: ''
        });
        this.sbcZonasCorporales?.unsubscribe();
        this.sbcTecnologias?.unsubscribe();
        this.zonasCorporales = [];
        this.tecnologias = [];
        if(res){
          const idServicio = parseInt(res, 10);
          this.obtenerZonasCorporales(idServicio);
          if(Servicios.CORPORAL360 === idServicio){
            this.obtenerTecnologias(idServicio);
            this.f.idTecnologia.setValidators(Validators.required);
            this.f.idTecnologia.updateValueAndValidity();
          }
        }
      });
      this.formGroup.get('idZona').valueChanges.subscribe((res) => {
        this.formGroup.patchValue({
          idPromocionPrecio: null,
        });
        this.sbcPromocionesZona?.unsubscribe();
        this.promocionesZona = [];
        if(res){
          const idZona = parseInt(res, 10);
          this.obtenerPromocionesZona(idZona);
          this.f.minutos.patchValue(this.zonasCorporales.find( x => x.id === idZona).duracion);
        }
      });
      this.formGroup.get('idPromocionPrecio').valueChanges.subscribe((res) => {
        if(res){
          const idPromocionPrecio = parseInt(res, 10);
          this.f.precio.patchValue(this.promocionesZona.find(x => x.idPromocionPrecio === idPromocionPrecio).precioPromocion.toFixed(2));
        }
      });
      this.formGroup.get('sesion').valueChanges.subscribe((res) => {
        if(res){
          const numeroSesion = parseInt(res, 10);
          this.primeraSesion = numeroSesion === 1;

          if(!this.primeraSesion){
            this.formGroup.patchValue({
              idAgendadoPor: null,
              agendadoPor: null,
              idOrigenMedio: ''
            });
            this.f.idAgendadoPor.clearValidators();
            this.f.agendadoPor.clearValidators();
            this.f.idOrigenMedio.clearValidators();
            this.f.idAgendadoPor.updateValueAndValidity();
            this.f.agendadoPor.updateValueAndValidity();
            this.f.idOrigenMedio.updateValueAndValidity();
          }

        }
      });
    }

    clearForm(): void{
      this.formGroup.patchValue({
        idZona: null,
        idTecnologia: '',
        idPromocionPrecio: null,
        sesion: 1,
        precio: 0.00,
        minutos: 0,
        agendadoPor: '',
        idAgendadoPor: null,
        idOrigenMedio: '',
        retroceso: false,
        pagoWeb: false
      });
    }

    patchForm(data: FacturaDatosCliente): void{
      // console.log(this.data);
      // this.formGroup.patchValue({
      //   idTipoDocumentoCliente: data.idTipoDocumentoCliente ? data.idTipoDocumentoCliente : '',
      //   numeroDocumentoCliente: data.numeroDocumentoCliente,
      //   nombreCliente: data.nombreCliente,
      //   direccionFiscal: data.direccion,
      // });
    }

    get f(): any { return this.formGroup.controls; }
    get loading(): boolean{
      return  this.ldZonasCorporales ||
              this.ldServicios ||
              this.ldMediosContacto ||
              this.ldPromocionesZona ||
              this.ldTecnologias;
    }
    get modelItem(): any {
        return {
          idCita: this.IdCita,
          idSede: this.IdSede,
          idServicio: parseInt(this.f.idServicio.value, 10),
          idZona: parseInt(this.f.idZona.value, 10),
          zona: this.zonasCorporales.find( x => x.id === parseInt(this.f.idZona.value, 10))?.descripcion,
          idTecnologia: this.f.idTecnologia.value ? parseInt(this.f.idTecnologia.value, 10) : null,
          tecnologia: this.f.idTecnologia.value ? this.tecnologias.find(x => x.id === parseInt(this.f.idTecnologia.value, 10)).nombre : null,
          idPromocionPrecio: parseInt(this.f.idPromocionPrecio.value, 10),
          promocion: this.promocionesZona.find(x => x.idPromocionPrecio === parseInt(this.f.idPromocionPrecio.value, 10)).promocion,
          sesion: parseInt(this.f.sesion.value),
          precio: parseFloat(this.f.precio.value),
          duracion: parseInt(this.f.minutos.value, 10),
          idAgendadoPor: this.primeraSesion ? parseInt(this.f.idAgendadoPor.value, 10) : null,
          agendadoPor: this.primeraSesion ? this.f.agendadoPor.value : null,
          idOrigenMedio: this.primeraSesion ? parseInt(this.f.idOrigenMedio.value) : null,
          origenMedio: this.primeraSesion ? this.mediosContacto.find( x => x.id === parseInt(this.f.idOrigenMedio.value)).nombre : null,
          retroceso: this.f.retroceso.value,
          pagoWeb: this.f.pagoWeb.value,
          idUsuarioModifico: this.usuarioService.UsuarioActual.idUsuario
        };
    }

    onSubmit(): void{
      this.submittedNuevoItem = true;
      if (this.formGroup.invalid) {
        this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
        console.log(this.formGroup);
        return;
      }

      Swal.fire({
        html: `Desea agregar el nuevo detalle a la cita ??`,
        icon: 'question',
        allowOutsideClick: false,
        allowEscapeKey: false,
        buttonsStyling: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        customClass: {
          popup: 'popins rounded-grant shadow',
          confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
          cancelButton: 'btn sbtn btn-light popins mr-2',
        },
        reverseButtons: true
      }).then(
        result => {
          if(result.isConfirmed) {
              this.sbcSubmit = this.citaService.agregarDetalle(this.IdCita, this.modelItem).subscribe((res: boolean | ErrorSistema) => {
                if (res instanceof ErrorSistema){
                  this.utilsService.mostrarToast(res.message, 'error');
                }else{
                  this.OnAdded.emit(true);
                  this.utilsService.mostrarToast('Se agrego el nuevo detalle a la cita.', 'success');
                  this.modal.close();
                }
                this.ldSubmit = false;
              }, (error: any) => {
                console.log(error);
                this.utilsService.mostrarToast('Ocurrio un error al intentar agregar el detalle a la cita', 'error');
              })
          }
      });
    }

  /*  onSubmit(): void {
        this.submitted = true;
        this.loading = true;

        if (this.frmGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            this.loading = false;
            return;
        }

        if (this.data ){
            // EDITAR
          Swal.fire({
            html: `Desea editar los datos de la plantilla <b>${this.data.nombre}</b>??`,
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
                this.spinner.show();
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

                      this.spinner.hide();
                      this.loading = false;
                    }else{
                      Swal.fire({
                        html: `Se modifico los datos de la plantilla <b>${this.data.nombre}</b> con exito!!!`,
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                        }
                      });
                      this.spinner.hide();
                      this.loading = false;
                      this.cerrarModal(true);
                    }

                  },
                  error => {
                    Swal.fire({
                      title: 'Error',
                      html: `Error al intentar modificar los datos de la plantilla <b>${this.data.nombre}</b>`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                    console.log('Error al modificar de la plantilla', error);
                    this.loading = false;
                    this.spinner.hide();
                  });
              }else{
                this.cerrarModal();
              }
            }
          );

        } else {
            // NUEVO
          Swal.fire({
            title: 'Desea registrar la nueva plantilla??',
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
                this.spinner.show();
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

                      this.spinner.hide();
                      this.loading = false;
                    }else{
                      Swal.fire({
                        text: "Se registro la plantilla con exito",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                        }
                      });
                      this.spinner.hide();
                      this.loading = false;
                      this.cerrarModal(true);
                    }
                  },
                  error => {
                    this.loading = false;
                    console.log('Error al registrar la plantilla', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar el servicio',
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                    this.spinner.hide();
                  });
              }
            }
          );
        }
    }*/

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }


  /****************************************************************************************************************
   * Eventos
   */
  evtSeleccionarUsuario(): void{
    this.modalRef = this.modalService.open(UsuarioSeleccionComponent, {
      size: 'md',
      backdrop: false,
      windowClass: 'bg-dark-30',
      keyboard: false,
      backdropClass: 'bg-transparent'
    });
    this.modalRef.componentInstance.idPerfil = 9;
    this.modalRef.componentInstance.idSede = this.IdSede;
    this.modalRef.componentInstance.modal = this.modalRef;
    this.modalRef.componentInstance.eventUsuarioSeleccionado.subscribe((res) => {
      this.formGroup.patchValue({
        idAgendadoPor: res.idUsuario,
        agendadoPor: res.nombre
      });
    });
  }
  evtQuitarItem(index: number): void{
    this.citaDetalles = this.citaDetalles.filter((x,y) => y !== index);
  }


  /****************************************************************************************************************
     * Obtener los medios de contacto
     */
    obtenerMediosContacto(): void{
      this.ldMediosContacto =  true;
      this.sbcMediosContacto = this.medioContactoService.obtenerMedioContacto().subscribe((res: MedioContacto[]) => {
        this.mediosContacto = res;
        // this.formGroup.patchValue({
        //   form: res[0].id
        // })
        this.ldMediosContacto = false;
      }, error => {
        this.ldMediosContacto = false;
        this.utilsService.mostrarToast('Error al obtener los medios de contacto', 'error');
      });
    }


    /****************************************************************************************************************
     * Obtener los tipos de servicio
     */
    obtenerServicios(): void{
      this.ldServicios =  true;
      this.sbcServicio = this.servicioService.listar().subscribe((res: Servicio[]) => {
        this.servicios = res;
        this.formGroup.patchValue({
          idServicio: this.IdServicio
        })
        this.ldServicios = false;
      }, error => {
        this.ldServicios = false;
        this.utilsService.mostrarToast('Error al obtener los tipos de servicios', 'error');
      });
    }


    /****************************************************************************************************************
     * Obtener las zonas corporales por servicio
     */
    obtenerZonasCorporales(idServicio: number): void{
      this.sbcZonasCorporales?.unsubscribe();
      this.ldZonasCorporales =  true;
      this.sbcZonasCorporales = this.zonaCorporalService.obtenerListadoPorServicio(idServicio).subscribe((res: Zona[]) => {
        this.zonasCorporales = res.map(x => {
          const model = new Zona();
          model.id = x.id;
          model.descripcion = x.descripcion;
          model.minutos = x.minutos;
          model.duracion = x.duracion;
          return model;
        });
        // this.formGroup.patchValue({
        //   form: res[0].id
        // })
        this.ldZonasCorporales = false;
      }, error => {
        this.ldZonasCorporales = false;
        this.utilsService.mostrarToast('Error al obtener los tipos de servicios', 'error');
      });
    }


    /****************************************************************************************************************
     * Obtener las promociones por zona
     */
    obtenerPromocionesZona(idZona: number): void{
      this.sbcPromocionesZona?.unsubscribe();
      this.ldPromocionesZona =  true;
      this.sbcPromocionesZona = this.promocionZonaService.listarByZona(idZona).subscribe((res: PromocionZona[]) => {
        this.promocionesZona = res;
        this.ldPromocionesZona = false;
      }, error => {
        this.ldPromocionesZona = false;
        this.utilsService.mostrarToast('Error al obtener las promociones de la zona', 'error');
      });
    }


  /****************************************************************************************************************
   * Obtener las tecnologias
   */
  obtenerTecnologias(idServicio: number): void{
    this.sbcTecnologias?.unsubscribe();
    this.ldTecnologias =  true;
    this.sbcPromocionesZona = this.tecnologiaService.listarByServicio(idServicio).subscribe((res: Tecnologia[]) => {
      this.tecnologias = res;
      this.ldTecnologias = false;
    }, error => {
      this.ldTecnologias = false;
      this.utilsService.mostrarToast('Error al obtener las tecnologias', 'error');
    });
  }

}
