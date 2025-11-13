import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {FacturaDatosCitaService} from "../../../../shared/services/facturacion/factura-datos-cita.service";
import Swal from 'sweetalert2';
import {ComprobanteDatosCitaDetalle, FacturaDatosCita} from "../../../../shared/models/facturacion/factura-datos-cita";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {MaquinaMarcaService} from "../../../../shared/services/maquina-marca.service";
import {MaquinaMarca} from "../../../../shared/models/maquina-marca";
import {FacturaMonedaService} from "../../../../shared/services/facturacion/factura-moneda.service";
import {CitaDetalleService} from "../../../../shared/services/cita-detalle.service";
import {CitaDetalle} from "../../../../shared/models/cita";
import {FacturaPorcentajeIgv} from "../../../../shared/models/facturacion/factura-porcentaje-igv";
import {FacturaPorcentajeIgvService} from "../../../../shared/services/facturacion/factura-porcentaje-igv.service";
import {FacturaTransaccionSunat} from "../../../../shared/models/facturacion/factura-transaccion-sunat";
import {FacturaTransaccionSunatService} from "../../../../shared/services/facturacion/factura-transaccion-sunat.service";
import {DocumentoTipoIdentidad} from "../../../../shared/models/documento-tipo-identidad";
import {DocumentoIdentidadTipoService} from "../../../../shared/services/documento-identidad-tipo.service";
import {ClienteService} from "../../../../shared/services/cliente.service";
import {MdlNuevoItemComponent} from "../mdl-nuevo-item/mdl-nuevo-item.component";
import {MdlDatosClienteComprobanteComponent} from "../mdl-datos-cliente-comprobante/mdl-datos-cliente-comprobante.component";
import {FacturaDatosCliente} from "../../../../shared/models/facturacion/factura-datos-cliente";
import {FacturaDatosClienteService} from "../../../../shared/services/facturacion/factura-datos-cliente.service";
import {TipoComprobanteService} from "../../../../shared/services/tipo-comprobante.service";
import {TipoComprobante} from "../../../../shared/models/tipo-comprobante";
import {
  EnumComprobanteTipoIgv,
  EnumTipoComprobante,
  EnumTipoPago,
  EnumUnidadMedida
} from "../../../../shared/enumeracion/enums";
import {ComprobanteSerieService} from "../../../../shared/services/facturacion/comprobante-serie.service";
import {ComprobanteSerie} from "../../../../shared/models/facturacion/comprobante-serie";
import {ComprobanteEntidadTipoPago} from "../../../../shared/models/facturacion/comprobante-entidad-tipo-pago";
import {ComprobanteEntidadTipoPagoService} from "../../../../shared/services/facturacion/comprobante-entidad-tipo-pago.service";
import {FacturacionService} from "../../../../shared/services/facturacion.service";
import {CurrencyMaskInputMode} from "ngx-currency";
import {ComprobanteElectronicoService} from "../../../../shared/services/facturacion/comprobante-electronico.service";
import {MdlListaDatosClienteComprobanteComponent} from "../mdl-lista-datos-cliente-comprobante/mdl-lista-datos-cliente-comprobante.component";
import {UsuarioSeleccionEspecialistaComponent} from "../../../usuario/usuario-seleccion-especialista/usuario-seleccion-especialista.component";
import {MdlFacturaItemComponent} from "../mdl-factura-item/mdl-factura-item.component";
import {
  ComprobanteElectronicoCliente,
  ComprobanteElectronicoDatos
} from "../../../../shared/models/facturacion/comprobante-electronico";
import {
  ComprobanteNotaCredito,
  ComprobanteTipoNotaCredito
} from "../../../../shared/models/facturacion/comprobante-nota-credito";
import {ComprobanteTipoNotaCreditoService} from "../../../../shared/services/facturacion/comprobante-tipo-nota-credito.service";
import {Sede} from "../../../../shared/models/sede";
import {SedeService} from "../../../../shared/services/sede.service";

@Component({
    selector: 'app-mdl-emision-nota-credito',
    templateUrl: 'mdl-emision-nota-credito.component.html',
    styleUrls: ['./mdl-emision-nota-credito.component.scss'],
})
export class MdlEmisionNotaCreditoComponent implements OnInit, AfterViewInit, OnDestroy {

    @Output() OnCreated: EventEmitter<ComprobanteElectronicoDatos> = new EventEmitter<ComprobanteElectronicoDatos>();

    // validar si es ticket
    esTicket = true;
    // editar documento del cliente en el clinic
    editarDocumento: boolean;


    formGroup: FormGroup | undefined;

    // Emitir Comprobante
    submitted: boolean;
    sbcSubmit: Subscription | undefined;
    ldSubmit: boolean;

    // Datos Cita
    ldSedes: boolean;
    sbcSedes : Subscription | undefined;
    sedes : Sede[] = [];
    idSede = 0;

    // Datos Cita
    ldObtenerData: boolean;
    sbcObtenerData : Subscription | undefined;
    dataCita : FacturaDatosCita | null;

    // Datos de tipos de comprobante
    ldObtenerTiposComprobantes: boolean;
    sbcObtenerTiposComprobantes: Subscription | undefined;
    tiposComprobantes: TipoComprobante[] = [];

    // Datos de series para nota credito
    ldObtenerSeriesComprobante: boolean;
    sbcObtenerSeriesComprobante: Subscription | undefined;
    seriesComprobante: ComprobanteSerie[] = [];

    ldObtenerSeriesComprobanteModifica: boolean;
    sbcObtenerSeriesComprobanteModifica: Subscription | undefined;
    seriesComprobanteModifica: ComprobanteSerie[] = [];

    // Datos de entidades de tipo de pago
    ldObtenerEntidadesTipoPago: boolean;
    sbcObtenerEntidadesTipoPago: Subscription | undefined;
    entidadesTipoPago: ComprobanteEntidadTipoPago[] = [];


    // Datos de tipo de pago
    ldObtenerTiposPago: boolean;
    sbcObtenerTiposPago : Subscription | undefined;
    tiposPago: any[] = [];


    modalRef: NgbModalRef | undefined


    // opciones
    enumTipoPago = EnumTipoPago;
    options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }

    optionsNumeroComprobante = { thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }


    // GENERAL
    porcentajeIgvActual: number = 0.00;

    // ACTIVAR MESES PAR LA SGT CITA
    public siguienteCita = false;

    // DETALLES ELIMINADOS
    idDetallesEliminados: number[] = [];


    // ACTIVAR ENTIDAD TIPO PAGO
    verEntidadTipoPago: boolean;
    verPagoEfectivo: boolean;
    verPagoTarjeta: boolean;
    verCodigoOperacion: boolean;

    errorRecibido: boolean;




    ldTiposNotaCredito: boolean;
    sbcTiposNotaCredito: Subscription | undefined;
    tiposNotaCredito: ComprobanteTipoNotaCredito[] = [];

    ldBuscarComprobante: boolean;
    sbcBuscarComprobante: Subscription | undefined;
    comprobante: ComprobanteElectronicoDatos | undefined;


    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private modal: NgbActiveModal,
        private datosCitaService: FacturaDatosCitaService,
        private maquinaMarcaService: MaquinaMarcaService,
        private facturaMonedaService: FacturaMonedaService,
        private facturaPorcentajeIgvService: FacturaPorcentajeIgvService,
        private citaDetalleService: CitaDetalleService,
        private clienteService: ClienteService,
        private tipoTransaccionService: FacturaTransaccionSunatService,
        private tipoDocumentoIdentidadService: DocumentoIdentidadTipoService,
        private facturaDatosClienteService: FacturaDatosClienteService,
        private tipoComprobanteService: TipoComprobanteService,
        private comprobanteEntidadTipoPagoService: ComprobanteEntidadTipoPagoService,
        private facturacionService: FacturacionService,
        public  utilsService: UtilsService,
        private api: ComprobanteElectronicoService,
        private datePipe: DatePipe,
        private modalService: NgbModal,


        private tipoNotaCreditoService: ComprobanteTipoNotaCreditoService,
        private comprobanteSerieService: ComprobanteSerieService,
        private comprobanteElectronicoService: ComprobanteElectronicoService,
        private sedeService: SedeService
    ) {

      this.verEntidadTipoPago = false;
      this.verPagoEfectivo = false;
      this.verPagoTarjeta = false;
      this.errorRecibido = false;
      this.ldBuscarComprobante = false;

      this.initForm();
      this.idSede = this.usuarioService.UsuarioActual.idSede;
    }

    ngOnInit(): void {
      this.editarDocumento = false;
      this.ldObtenerData = false;
      this.ldObtenerTiposPago = false;
      this.ldObtenerEntidadesTipoPago = false;
      this.ldObtenerSeriesComprobante = false;
      this.ldObtenerTiposComprobantes = false;
      this.ldSubmit = false;
      this.submitted = false;
      this.ldTiposNotaCredito = false;

      // this.obtenerDataCita();

      this.obtenerSedes();
      this.obtenerTiposComprobante();
      this.obtenerTiposNotaCredito();
      // this.obtenerSerieByTipoComprobante(EnumTipoComprobante.BOLETA);
    }

    ngAfterViewInit(): void{
      // this.obtenerDataCita();
      // this.obtenerCitaDetalle();
      // this.obtenerDataCitaDetalle();

      // this.obtenerMarcasMaquina();
      // this.obtenerTiposMoneda();
      // this.obtenerPorcentajesIgv();
      // this.obtenerTiposTransaccion();
      // this.obtenerTiposDocumentoIdentidad();
      // this.obtenerTiposComprobante();
      // this.obtenerTiposPago();
    }

    ngOnDestroy(): void {
      this.modalRef?.close();
      this.sbcObtenerData?.unsubscribe();
      this.sbcObtenerTiposPago?.unsubscribe();
      this.sbcObtenerSeriesComprobante?.unsubscribe();
      this.sbcObtenerTiposComprobantes?.unsubscribe();
      this.sbcObtenerEntidadesTipoPago?.unsubscribe();
      this.sbcSubmit?.unsubscribe();
      this.sbcBuscarComprobante?.unsubscribe();
    }

    initForm(): void {
      this.formGroup = this.formBuilder.group({

        idSede: new FormControl('', Validators.required),

        idSerie: new FormControl('',Validators.required),
        serie: new FormControl(null,Validators.required),
        numero: new FormControl(null,Validators.required),


        idTipoComprobanteModifica: new FormControl(EnumTipoComprobante.BOLETA,Validators.required),
        idSerieComprobanteModifica: new FormControl('',Validators.required),
        serieComprobanteModifica: new FormControl(null,Validators.required),
        numeroComprobanteModifica: new FormControl(0,Validators.required),
        idTipoNotaCredito: new FormControl('',Validators.required),

        observaciones: new FormControl(''),
        formato: new FormControl('TICKET', Validators.required),
      });

      this.formGroup.get('idSede').valueChanges.subscribe(async (res) => {
        if(res){
          this.idSede = res;
          this.obtenerSeries(res);
          this.obtenerSerieByTipoComprobante(parseInt(this.f.idTipoComprobanteModifica.value,10), this.idSede);
        }
      });

      this.formGroup.get('idSerie').valueChanges.subscribe(async (res) => {
        if(res){
          const serie = this.seriesComprobante.find(x => x.id === parseInt(res, 10) );

          this.formGroup.patchValue({serie: serie.serie, numero: (serie.numeroComprobante).toString().padStart(8,'0')})
        }
      });

      this.formGroup.get('idTipoComprobanteModifica').valueChanges.subscribe(async (res) => {
        if(res){
          const idTipoComprobante = parseInt(res, 10);
          this.obtenerSerieByTipoComprobante(idTipoComprobante, this.idSede);
        }
      });
      this.formGroup.get('idSerieComprobanteModifica').valueChanges.subscribe(async (res) => {
        if(res){
          const idSerieComprobante = parseInt(res, 10);
          this.formGroup.patchValue({
            serieComprobanteModifica: this.seriesComprobanteModifica.find(x => x.id === idSerieComprobante).serie
          })
        }
      });

    }

    patchForm(data: FacturaDatosCita): void{
      // console.log(data);
      this.formGroup.patchValue({
        nombreCliente: `#${data?.idCliente}  - ${data?.nombreCliente}`,
        idTipoDocumentoCliente: data?.idTipoDocumentoCliente ? data?.idTipoDocumentoCliente : '',
        documentoCliente: data?.documentoCliente,
        idCita: data?.idCita,
        fechaCita: this.datePipe.transform(data?.fechaCita, 'dd/MM/yyyy'),
        idAtendidoPor: data?.idAtendidoPor,
        numeroBox: data?.numeroBox ? data?.numeroBox : '',
        idMaquinaMarca: data?.idMaquinaMarca ? data?.idMaquinaMarca : '',
        atendidoPor: data?.atendidoPor,
      });
    }

    /*******************************************************************************************************
     * Getters
     */
    get f(): any { return this.formGroup.controls; }
    get getIdTipoPago(): number{
      return this.f.idTipoPago.value ? parseInt(this.f.idTipoPago.value, 10) : 0;
    }
    // get numeroComprobante(): number{
    //   return this.f.numeroComprobante.value ? parseInt(this.f.numeroComprobante.value, 10) : 0;
    // }
    get recibido(): number{
      return this.f.recibido.value ? parseFloat(this.f.recibido.value) : 0.00;
    }
    get model(): any {
        const model = new ComprobanteElectronicoDatos();
        model.idCliente = this.comprobante.idCliente;
        model.idSede = this.comprobante.idSede;
        model.idUsuarioRegistro = this.usuarioService.UsuarioActual.idUsuario;
        model.idVenta = this.comprobante.idVenta;

        model.idTipoComprobante = EnumTipoComprobante.NOTACREDITO;
        model.serieComprobante = this.f.serie.value;
        model.numeroComprobante = this.f.numero.value;

        // console.log('tipostransaccion', this.tiposTransaccion);

        model.idSunatTransaccion = this.comprobante.idSunatTransaccion;
        model.sunatTransaccionValor = this.comprobante.sunatTransaccionValor;

        model.comprobanteCliente = this.comprobante.comprobanteCliente;

        model.fechaEmision = new Date();
        model.fechaVencimiento = new Date();

        model.idTipoMoneda = this.comprobante.idTipoMoneda;
        model.tipoMonedaValor = this.comprobante.tipoMonedaValor;

        model.tipoCambio = 0;

        model.porcentajeIgv = this.comprobante.porcentajeIgv;
        model.descuento = this.comprobante.descuento;
        model.descuentoGlobal = this.comprobante.descuentoGlobal;
        model.totalDescuento = this.comprobante.totalDescuento;

        model.totalAnticipo = this.comprobante.totalAnticipo;
        model.subTotal = this.comprobante.subTotal;
        model.totalInafecta = this.comprobante.totalInafecta;
        model.totalExonerada = this.comprobante.totalExonerada;
        model.totalIgv = this.comprobante.totalIgv;
        model.totalGratuita = this.comprobante.totalGratuita;
        model.totalOtros = this.comprobante.totalOtros;
        model.totalIsc = this.comprobante.totalIsc;
        model.total = this.comprobante.total;


        model.observaciones = this.f.observaciones.value;
        model.idTipoComprobanteModifica = parseInt(this.f.idTipoComprobanteModifica.value, 10);
        model.numeroComprobanteModifica = (this.f.numeroComprobanteModifica.value).toString();
        model.serieComprobanteModifica = this.f.serieComprobanteModifica.value;

        model.tipoComprobanteModificaValor = this.tiposComprobantes.find(x => x.id === parseInt(this.f.idTipoComprobanteModifica.value, 10)).valor;

        model.detalles = this.comprobante.detalles;
        // model.detalles = this.comprobante.detalles.map(x => {
        //   x.idUnidadMedida = EnumUnidadMedida.Servicio;
        //   x.unidadMedidaValor = 'ZZ';
        //   return x;
        // });

        model.idTipoNotaCredito = parseInt(this.f.idTipoNotaCredito.value);
        model.tipoNotaCreditoValor = this.tiposNotaCredito.find(x => x.id === parseInt(this.f.idTipoNotaCredito.value)).valor;
        return model;
    }
    get modelDocumentoIdentidad(): any{
      return {
        id: this.dataCita!.idCliente,
        idDocumentoIdentidadTipo: parseInt(this.f.idTipoDocumentoCliente.value, 10),
        documento: this.f.documentoCliente.value,
        idUsuarioModifico: this.usuarioService.UsuarioActual.idUsuario
      }
    }
    get loading(): Observable<boolean>{
      const obs = new BehaviorSubject<boolean>(false);
      obs.next( this.ldObtenerData ||
                this.ldObtenerTiposPago ||
                this.ldObtenerEntidadesTipoPago ||
                this.ldObtenerSeriesComprobante ||
                this.ldObtenerTiposComprobantes ||
                this.ldSubmit );

      return obs;
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }


    // validaciones
    onChangeTipoComprobante(event): void{
      this.esTicket = !parseInt(event.target.value, 10)
    }

    /*******************************************************************************************
     * Eventos
     */
    evtVerComprobante(): void{
      if(this.f.idTipoComprobanteModifica.invalid){
        this.utilsService.mostrarToast('Seleccionar el tipo de comprobante', 'error');
        return
      }

      if(this.f.serieComprobanteModifica.invalid){
        this.utilsService.mostrarToast('Seleccionar la serie', 'error');
        return
      }
      if(this.f.numeroComprobanteModifica.invalid){
        this.utilsService.mostrarToast('Ingresar el numero del comprobante', 'error');
        return
      }

      const idTipoComprobante = parseInt(this.f.idTipoComprobanteModifica.value, 10);
      const serie = this.f.serieComprobanteModifica.value;
      const numero = this.f.numeroComprobanteModifica.value;

      this.sbcBuscarComprobante?.unsubscribe();
      this.ldBuscarComprobante = true;
      this.sbcBuscarComprobante = this.comprobanteElectronicoService.buscarComprobante(serie, numero, idTipoComprobante).subscribe((res: ComprobanteElectronicoDatos | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.comprobante = undefined;
          this.utilsService.mostrarToast(res.message, 'error');
          return;
        }else{
          this.comprobante = res;

          //console.log('comprobante', res);
          this.formGroup.patchValue({
            serieComprobante: res.serieComprobante,
            numeroComprobante: res.numeroComprobante,
            idTipoComprobante: res.idTipoComprobante,
            tipoMonedaSimbolo: res.tipoMonedaSimbolo,
            sunatTransaccion: res.sunatTransaccion,
            tipoPago: res.tipoPago,
            porcentajeIgv: res.porcentajeIgv,
            total: res.total,
            recibido: res.recibido,
            vuelto: res.vuelto,
            tipoComprobante: res.tipoComprobante
          })
        }
        this.ldBuscarComprobante = false;
      } ,(error: any) => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error al buscar el comprobante electrónico', 'error');
        this.ldBuscarComprobante = false;
        this.comprobante = undefined;
      })

    }
    evtOnSubmit(): void{
      this.submitted = true;
      this.errorRecibido = false;

      if(this.formGroup.invalid){
        this.utilsService.mostrarToast('Faltan datos por ingresar','warning');
        console.log(this.formGroup);
        return;
      }

      if(this.model.serieComprobante !== this.model.serieComprobanteModifica){
        this.utilsService.mostrarToast('La serie debe ser la misma para el tipo de comprobante que se va modificar','warning');
        return;
      }

      if(parseInt(this.f.numeroComprobanteModifica.value, 10) !== parseInt(this.comprobante.numeroComprobante, 10)){
        this.utilsService.mostrarToast('El número de serie que modifica debe ser la misma que de la busqueda','warning');
        return;
      }

      Swal.fire({
        title: 'Desea emitir la nota de crédito?',
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
            this.api.emitirNotaCredito(this.model).subscribe((res: ComprobanteElectronicoDatos | ErrorSistema) => {
                console.log(res);

                if (res instanceof ErrorSistema){
                  res.status === 400 ? this.utilsService.mostrarToast( res.message, 'error') : this.utilsService.mostrarToast( 'Ocurrio un error con el servicio de facturación', 'error');
                  this.ldSubmit = false;
                }else{
                  this.utilsService.mostrarToast( "Se emitio la nota de crédito con exito", 'success');
                  this.ldSubmit = false;
                  this.OnCreated.emit(res);
                }
              },
              error => {
                this.ldSubmit = false;
                console.log(error);
                this.utilsService.mostrarToast( "Ocurrio une error al intentar emitir la nota de crédito", 'error');
              });
          }
        }
      );

    }
    evtSeleccionarUsuario(): void{
      // console.log(this.dataCita);
      this.modalRef = this.modalService.open(UsuarioSeleccionEspecialistaComponent, {
        size: 'md',
        backdrop: false,
        windowClass: 'bg-dark-30',
        keyboard: false,
        backdropClass: 'bg-transparent'
      });
      this.modalRef.componentInstance.idPerfil = 9;
      this.modalRef.componentInstance.idSede = this.dataCita!.idSede;
      this.modalRef.componentInstance.modal = this.modalRef;
      this.modalRef.componentInstance.eventUsuarioSeleccionado.subscribe((res) => {
        this.formGroup.patchValue({
          idAtendidoPor: res.idUsuario,
          atendidoPor: res.nombre
        });
      });
    }
    evtEditarDocumento(): void{
      this.editarDocumento = !this.editarDocumento;
      if(this.editarDocumento){
        this.f.idTipoDocumentoCliente.setValidators(Validators.required);
        this.f.documentoCliente.setValidators([Validators.required, Validators.maxLength(20)]);
      }else{
        this.f.idTipoDocumentoCliente.clearValidators();
        this.f.documentoCliente.clearValidators();
      }
      this.f.idTipoDocumentoCliente.updateValueAndValidity();
      this.f.documentoCliente.updateValueAndValidity();
    }
    evtAgregarNuevoItem(): void{
      // console.log(this.dataCita);
      this.modalRef = this.modalService.open(MdlNuevoItemComponent, {
        size: 'md max-w-700px',
        backdrop: "static",
        windowClass: 'smodal fade round popins bg-dark-30',
        keyboard: false,
        backdropClass: 'bg-transparent',
        scrollable: false,
        animation: true
      });
      this.modalRef.componentInstance.IdCita = this.dataCita!.idCita;
      this.modalRef.componentInstance.IdSede = this.dataCita!.idSede;
      this.modalRef.componentInstance.IdServicio = this.dataCita!.idServicio;
      this.modalRef.componentInstance.OnAdded.subscribe((res) => {
        // this.obtenerDataCitaDetalle();
      });
    }

    /*******************************************************************************************
     * Obtener data de datos de facturación del cliente
     */
    obtenerTiposComprobante(): void{
      this.sbcObtenerTiposComprobantes?.unsubscribe();
      this.ldObtenerTiposComprobantes = true;
      this.sbcObtenerTiposComprobantes = this.tipoComprobanteService.obtenerParaPuntoVenta(this.usuarioService.UsuarioActual.idUsuario).subscribe(async (res: TipoComprobante[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else{
          this.tiposComprobantes = res.filter(x => [EnumTipoComprobante.FACTURA, EnumTipoComprobante.BOLETA].includes(x.id));
          this.formGroup.patchValue({
            idTipoComprobanteModifica: this.tiposComprobantes.length ? EnumTipoComprobante.BOLETA : 3
          })
        }
        this.ldObtenerTiposComprobantes = false;
      }, (error: any) => {
        this.ldObtenerTiposComprobantes = false;
        console.log('Error al obtener los tipos de comprobantes', error);
        this.utilsService.mostrarToast('Error al obtener los tipos de comprobantes','error');
      });
    }


    obtenerSerieByTipoComprobante(idTipoComprobante: number, idSede: number): void{
      this.sbcObtenerSeriesComprobanteModifica?.unsubscribe();
      this.ldObtenerSeriesComprobanteModifica = true;
      this.sbcObtenerSeriesComprobanteModifica = this.comprobanteSerieService.listarBySedeTipoComprobante(this.usuarioService.UsuarioActual.idUsuario, idSede, idTipoComprobante).subscribe((res: ComprobanteSerie[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else{
          this.seriesComprobanteModifica = res;
          this.formGroup.patchValue({
            idSerieComprobanteModifica: this.seriesComprobanteModifica.length ? this.seriesComprobanteModifica[0].id : '',
            serieComprobanteModifica: this.seriesComprobanteModifica.length ? this.seriesComprobanteModifica[0].serie : '',
          });
        }
        this.ldObtenerSeriesComprobanteModifica = false;
      }, (error: any) => {
        this.ldObtenerSeriesComprobanteModifica = false;
        console.log('Error al obtener las series del tipo de comprobante', error);
        this.utilsService.mostrarToast('Error al obtener las series del tipo de comprobante','error');
      });
    }


    obtenerSeries( idSede: number ): void{
      this.sbcObtenerSeriesComprobante?.unsubscribe();
      this.ldObtenerSeriesComprobante = true;
      this.sbcObtenerSeriesComprobante = this.comprobanteSerieService.listarBySedeTipoComprobante(this.usuarioService.UsuarioActual.idUsuario, idSede, EnumTipoComprobante.NOTACREDITO).subscribe((res: ComprobanteSerie[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else{
          this.seriesComprobante = res;
          this.formGroup.patchValue({
            idSerie: this.seriesComprobante.length ? this.seriesComprobante[0].id : '',
            serie: this.seriesComprobante.length ? this.seriesComprobante[0].serie : null,
          });
        }
        this.ldObtenerSeriesComprobante = false;
      }, (error: any) => {
        this.ldObtenerSeriesComprobante = false;
        console.log('Error al obtener las series para la nota de crédito', error);
        this.utilsService.mostrarToast('Error al obtener las series para la nota de crédito','error');
      });
    }




    /*******************************************************************************************
     * Obtener data de datos de entidades del tipo de pago
     */
    obtenerEntidadesTipoPago(): void{
      this.sbcObtenerEntidadesTipoPago?.unsubscribe();
      this.ldObtenerEntidadesTipoPago = true;
      this.sbcObtenerEntidadesTipoPago = this.comprobanteEntidadTipoPagoService.listar(this.usuarioService.UsuarioActual.idUsuario).subscribe((res: ComprobanteEntidadTipoPago[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else{
          this.entidadesTipoPago = res;
          this.formGroup.patchValue({
            idEntidadTipoPago: this.entidadesTipoPago.length ? this.entidadesTipoPago[0].id : ''
          })
        }
        this.ldObtenerEntidadesTipoPago = false;
      }, (error: any) => {
        this.ldObtenerEntidadesTipoPago = false;
        console.log('Error al obtener las entidades del tipo de pago', error);
        this.utilsService.mostrarToast('Error al obtener las entidades del tipo de pago','error');
      });
    }

    /*******************************************************************************************
     * Obtener data de datos de tipos de pago
     */
    obtenerTiposPago(): void{
      this.sbcObtenerTiposPago?.unsubscribe();
      this.ldObtenerTiposPago = true;
      this.sbcObtenerTiposPago = this.facturacionService.obtenerTipoPagoLista().subscribe((res: any[]) => {
        this.tiposPago = res;
        this.ldObtenerTiposPago = false;
        this.formGroup.patchValue({
          idTipoPago: this.tiposPago.length ? this.tiposPago[0].idTipoPago : ''
        })
      }, (error: any) => {
        this.ldObtenerTiposPago = false;
        console.log('Error al obtener los tipos de pago', error);
        this.utilsService.mostrarToast('Error al obtener los tipos de pago','error');
      });
    }

    obtenerTiposNotaCredito(): void{
      this.ldTiposNotaCredito = true;
      this.sbcTiposNotaCredito = this.tipoNotaCreditoService.listar2(this.usuarioService.UsuarioActual.idUsuario).subscribe((res: ComprobanteTipoNotaCredito[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message, 'error');
        }else{
          this.tiposNotaCredito = res;
        }
        this.ldTiposNotaCredito = false;
      }, (error: any) => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error al obtener los tipos de nota de crédito', 'error');
        this.ldTiposNotaCredito = false;
      });
    }

    obtenerSedes(): void{
      this.ldSedes = true;
      this.sbcSedes = this.sedeService.obtener().subscribe((res: any[]) => {
        this.sedes = res.map(x => {
          const sede = new Sede();
          sede.id = x.idSede;
          sede.nombre = x.nombre;
          return sede;
        })
        this.formGroup.patchValue({
          idSede: this.usuarioService.UsuarioActual.idSede
        })
        this.ldTiposNotaCredito = false;
      }, (error: any) => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error al obtener los tipos de nota de crédito', 'error');
        this.ldTiposNotaCredito = false;
      });
    }




    /*******************************************************************************************
     * Funciones
     */

    async valorUnitario(precioUnitario: number): Promise<number>{
      // console.log(this.porcentajesIgv, this.f.idPorcentajeIgv.value);
      if(this.esTicket){
        return precioUnitario;
      }
      return precioUnitario - (precioUnitario * (this.porcentajeIgvActual / 100));
    }
    async igvUnitario(precioUnitario: number): Promise<number>{
      if(this.esTicket){
        return 0;
      }
      return precioUnitario * (this.porcentajeIgvActual / 100);
    }
    async subTotalUnitario(precioUnitario): Promise<number>{
      if(this.esTicket){
        return precioUnitario;
      }
      return precioUnitario - (precioUnitario * (this.porcentajeIgvActual / 100));
    }


}


