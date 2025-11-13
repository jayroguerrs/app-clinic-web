import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioService} from "../../../shared/services/usuario.service";
import {FacturaDatosCitaService} from "../../../shared/services/facturacion/factura-datos-cita.service";
import Swal from 'sweetalert2';
import {ComprobanteDatosCitaDetalle, FacturaDatosCita} from "../../../shared/models/facturacion/factura-datos-cita";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {MaquinaMarcaService} from "../../../shared/services/maquina-marca.service";
import {MaquinaMarca} from "../../../shared/models/maquina-marca";
import {FacturaMoneda} from "../../../shared/models/facturacion/factura-moneda";
import {FacturaMonedaService} from "../../../shared/services/facturacion/factura-moneda.service";
import {CitaDetalleService} from "../../../shared/services/cita-detalle.service";
import {CitaDetalle} from "../../../shared/models/cita";
import {FacturaPorcentajeIgv} from "../../../shared/models/facturacion/factura-porcentaje-igv";
import {FacturaPorcentajeIgvService} from "../../../shared/services/facturacion/factura-porcentaje-igv.service";
import {FacturaTransaccionSunat} from "../../../shared/models/facturacion/factura-transaccion-sunat";
import {FacturaTransaccionSunatService} from "../../../shared/services/facturacion/factura-transaccion-sunat.service";
import {DocumentoTipoIdentidad} from "../../../shared/models/documento-tipo-identidad";
import {DocumentoIdentidadTipoService} from "../../../shared/services/documento-identidad-tipo.service";
import {ClienteService} from "../../../shared/services/cliente.service";
import {MdlNuevoItemComponent} from "../facturacion/mdl-nuevo-item/mdl-nuevo-item.component";
import {MdlDatosClienteComprobanteComponent} from "../facturacion/mdl-datos-cliente-comprobante/mdl-datos-cliente-comprobante.component";
import {FacturaDatosCliente} from "../../../shared/models/facturacion/factura-datos-cliente";
import {FacturaDatosClienteService} from "../../../shared/services/facturacion/factura-datos-cliente.service";
import {TipoComprobanteService} from "../../../shared/services/tipo-comprobante.service";
import {TipoComprobante} from "../../../shared/models/tipo-comprobante";
import {EnumComprobanteTipoIgv, EnumTipoComprobante, EnumTipoPago} from "../../../shared/enumeracion/enums";
import {ComprobanteSerieService} from "../../../shared/services/facturacion/comprobante-serie.service";
import {ComprobanteSerie} from "../../../shared/models/facturacion/comprobante-serie";
import {ComprobanteEntidadTipoPago} from "../../../shared/models/facturacion/comprobante-entidad-tipo-pago";
import {ComprobanteEntidadTipoPagoService} from "../../../shared/services/facturacion/comprobante-entidad-tipo-pago.service";
import {FacturacionService} from "../../../shared/services/facturacion.service";
import {CurrencyMaskInputMode} from "ngx-currency";
import {ComprobanteElectronicoService} from "../../../shared/services/facturacion/comprobante-electronico.service";
import {
  ComprobanteElectronicoDatos,
  ComprobanteElectronicoMedioPago
} from 'src/app/shared/models/facturacion/comprobante-electronico';
import {MdlListaDatosClienteComprobanteComponent} from "../facturacion/mdl-lista-datos-cliente-comprobante/mdl-lista-datos-cliente-comprobante.component";
import {UsuarioSeleccionEspecialistaComponent} from "../../usuario/usuario-seleccion-especialista/usuario-seleccion-especialista.component";
import {MdlFacturaItemComponent} from "../facturacion/mdl-factura-item/mdl-factura-item.component";
import {MdlEmisionComprobanteMedioPagoComponent} from "../mdl-emision-comprobante-medio-pago/mdl-emision-comprobante-medio-pago.component";

@Component({
    selector: 'app-mdl-emision-comprobante',
    templateUrl: 'mdl-emision-comprobante.component.html',
    styleUrls: ['./mdl-emision-comprobante.component.scss'],
})
export class MdlEmisionComprobanteComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() Turno: number = 0;
    @Input() IdCita: number;
    @Input() IdServicio: number;
    @Output() OnCreated: EventEmitter<ComprobanteElectronicoDatos> = new EventEmitter<ComprobanteElectronicoDatos>();

    // validar si es ticket
    esTicket = false;
    // editar documento del cliente en el clinic
    editarDocumento: boolean;


    formGroup: FormGroup | undefined;

    // Emitir Comprobante
    submitted: boolean;
    sbcSubmit: Subscription | undefined;
    ldSubmit: boolean;

    // Datos Cita
    ldObtenerData: boolean;
    sbcObtenerData : Subscription | undefined;
    dataCita : FacturaDatosCita | null;

    // Datos Tipo Documento
    ldObtenerTiposDocumentoIdentidad: boolean;
    sbcObtenerTiposDocumentoIdentidad: Subscription | undefined;
    tiposDocumentoIdentidad : DocumentoTipoIdentidad[] = [];

    // Datos Cita Detalle
    ldObtenerDataDetalle: boolean;
    sbcObtenerDataDetalle : Subscription | undefined;
    dataCitaDetalle : ComprobanteDatosCitaDetalle[] = [];

    // Datos Maquina Marca
    ldObtenerMaquinaMarca: boolean;
    sbcObtenerMaquinaMarca: Subscription | undefined;
    marcasMaquina: MaquinaMarca[] = [];

    // Datos Moneda Factura
    ldObtenerTiposMoneda: boolean;
    sbcObtenerTiposMoneda: Subscription | undefined;
    tiposMoneda: FacturaMoneda[] = [];

    // Datos Cita Detalle
    ldObtenerCitaDetalle: boolean;
    sbcObtenerCitaDetalle: Subscription | undefined;
    citaDetalle: CitaDetalle[] = [];

    // Datos Porcentajes Igv
    ldObtenerPorcentajeIgv: boolean;
    sbcObtenerPorcentajeIgv: Subscription | undefined;
    porcentajesIgv: FacturaPorcentajeIgv[] = [];

    // Datos tipos de transaccion
    ldObtenerTiposTransaccion: boolean;
    sbcObtenerTiposTransaccion: Subscription | undefined;
    tiposTransaccion: FacturaTransaccionSunat[] = [];


    // Actualizar documento cliente
    documentoClienteSubmitted: boolean;
    ldActualizarDocumentoCliente: boolean;
    sbcActualizarDocumentoCliente: Subscription | undefined;

    // Datos de facturacion del cliente
    ldObtenerDatoClientePredeterminadoFacturacion: boolean;
    sbcObtenerDatoClientePredeterminadoFacturacion: Subscription | undefined;
    datoClientePredeterminadoFacturacion: FacturaDatosCliente | undefined;

    // Datos de tipos de comprobante
    ldObtenerTiposComprobantes: boolean;
    sbcObtenerTiposComprobantes: Subscription | undefined;
    tiposComprobantes: TipoComprobante[] = [];

    // Datos de series por comprobante y sede
    ldObtenerSeriesComprobante: boolean;
    sbcObtenerSeriesComprobante: Subscription | undefined;
    seriesComprobante: ComprobanteSerie[] = [];

    // Datos de entidades de tipo de pago
    ldObtenerEntidadesTipoPago: boolean;
    sbcObtenerEntidadesTipoPago: Subscription | undefined;
    entidadesTipoPago: ComprobanteEntidadTipoPago[] = [];


    // Datos de tipo de pago
    ldObtenerTiposPago: boolean;
    sbcObtenerTiposPago : Subscription | undefined;
    tiposPago: any[] = [];

    // Medios de pago
    mediosPago: ComprobanteElectronicoMedioPago[] = [];


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





    editarNumeroComprobante: boolean;

    _totalSubTotal: number = 0;
    _totalSubTotalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    _precioTotal: number = 0;
    _precioTotalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    _totalIgv: number = 0;
    _totalIgvSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);


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
        private comprobanteSerieService: ComprobanteSerieService,
        private comprobanteEntidadTipoPagoService: ComprobanteEntidadTipoPagoService,
        private facturacionService: FacturacionService,
        public  utilsService: UtilsService,
        private api: ComprobanteElectronicoService,
        private datePipe: DatePipe,
        private modalService: NgbModal
    ) {

      this.verEntidadTipoPago = false;
      this.verPagoEfectivo = false;
      this.verPagoTarjeta = false;
      this.errorRecibido = false;
      this.editarNumeroComprobante = false;

      this.initForm();


      this._totalSubTotalSubject.subscribe((res: number) => {
        this._totalSubTotal = res;
      });

      this._precioTotalSubject.subscribe((res: number) => {
        this._precioTotal = res;
      });

      this._totalIgvSubject.subscribe((res: number) => {
        this._totalIgv = res;
      })

    }

    ngOnInit(): void {
      this.editarDocumento = false;
      this.ldObtenerData = false;
      this.ldObtenerMaquinaMarca = false;
      this.ldObtenerTiposTransaccion = false;
      this.ldObtenerTiposMoneda = false;
      this.ldObtenerPorcentajeIgv = false;
      this.ldObtenerCitaDetalle = false;
      this.ldActualizarDocumentoCliente = false;
      this.ldObtenerDatoClientePredeterminadoFacturacion = false;
      this.ldObtenerTiposPago = false;
      this.ldObtenerEntidadesTipoPago = false;
      this.ldObtenerSeriesComprobante = false;
      this.ldObtenerTiposComprobantes = false;
      this.ldObtenerTiposDocumentoIdentidad = false;
      this.ldObtenerDataDetalle = false;
      this.ldSubmit = false;
      this.submitted = false;

      this.obtenerDataCita();

      console.log('idServicio', this.IdServicio);
    }

    ngAfterViewInit(): void{
      this.obtenerDataCita();
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
      this.sbcActualizarDocumentoCliente?.unsubscribe();
      this.sbcObtenerTiposDocumentoIdentidad?.unsubscribe();
      this.sbcObtenerTiposMoneda?.unsubscribe();
      this.sbcObtenerCitaDetalle?.unsubscribe();
      this.sbcObtenerData?.unsubscribe();
      this.sbcObtenerDataDetalle?.unsubscribe();
      this.sbcObtenerMaquinaMarca?.unsubscribe();
      this.sbcObtenerPorcentajeIgv?.unsubscribe();
      this.sbcObtenerTiposTransaccion?.unsubscribe();
      this.sbcObtenerTiposPago?.unsubscribe();
      this.sbcObtenerSeriesComprobante?.unsubscribe();
      this.sbcObtenerTiposComprobantes?.unsubscribe();
      this.sbcObtenerEntidadesTipoPago?.unsubscribe();
      this.sbcObtenerDatoClientePredeterminadoFacturacion?.unsubscribe();
      this.sbcSubmit?.unsubscribe();
    }

    initForm(): void {
      this.formGroup = this.formBuilder.group({
        nombreCliente: new FormControl(''),
        idTipoDocumentoCliente: new FormControl(''),
        documentoCliente: new FormControl(null),

        idCita: new FormControl(null, Validators.required),
        fechaCita: new FormControl(null, Validators.required),
        idAtendidoPor: new FormControl(null, Validators.required),
        atendidoPor: new FormControl(null, Validators.required),
        numeroBox: new FormControl('', Validators.required),
        idMaquinaMarca: new FormControl('', Validators.required),
        siguienteCita: new FormControl(false, Validators.required),
        numeroMeses: new FormControl(0),
        idTipoComprobante: new FormControl(1, Validators.required),
        idSerieComprobante: new FormControl('', Validators.required),
        numeroComprobante: new FormControl(null, Validators.required),
        idPorcentajeIgv: new FormControl(''),
        sunatTransaccion: new FormControl(''),
        idTipoMoneda: new FormControl(''),
        tipoCambio: new FormControl(null),



        idTipoPago: new FormControl('', Validators.required),
        idEntidadTipoPago: new FormControl(''),
        codigoOperacion: new FormControl(null),

        // total: new FormControl('S/ 0.00'),
        pagoEfectivo: new FormControl(0.00),
        pagoTarjeta: new FormControl(0.00),


        recibido: new FormControl(0.00),
        vuelto: new FormControl(0.00),


        observaciones: new FormControl(''),
        formato: new FormControl('TICKET'),
      });
      this.formGroup.get('idTipoComprobante').valueChanges.subscribe(async (res) => {

        // Si el valor es valido
        if(res){
          const idTipoComprobante = parseInt(res, 10);

          // Actualizamos el estado actual si es ticket o no
          this.esTicket = idTipoComprobante === EnumTipoComprobante.TICKET;

          // Limpiamos los validadores
          this.formGroup.get('idPorcentajeIgv').clearValidators();
          this.formGroup.get('sunatTransaccion').clearValidators();
          this.formGroup.patchValue({
            idPorcentajeIgv : '',
            sunatTransaccion : ''
          });

          // Actualizar el valor unitario deacuerdo al porcentaje del igv
          this.evtCalcularValores();

          // this.dataCitaDetalle.forEach(async x => {
          //   x.valorUnitario = await this.valorUnitario(x.precio);
          //   x.subTotal = await this.subTotalUnitario(x.precio);
          //   // console.log(this.subTotalUnitario(x.precio));
          //   x.igv = await this.igvUnitario(x.precio);
          // });

          // Si se selecciona otro tipo de comprobante que no sea ticket
          if(!this.esTicket){
            // Agregamos los validadores
            this.formGroup.get('idPorcentajeIgv').setValidators(Validators.required);
            this.formGroup.get('sunatTransaccion').setValidators(Validators.required);
            this.obtenerPorcentajesIgv(false);
            this.obtenerTiposTransaccion();
          }else{
            this.porcentajeIgvActual = 0;
          }

          // Actualizamos los validadores
          this.formGroup.get('idPorcentajeIgv').updateValueAndValidity();
          this.formGroup.get('sunatTransaccion').updateValueAndValidity();

          // Obtenemos la series del tipo de comprobante y si tiene datos de facturación se obtiene y muestra
          this.obtenerSeriesComprobante(idTipoComprobante);
          this.obtenerDatosFacturacionCliente(this.dataCita!.idCliente, (this.f.idTipoComprobante.value ? parseInt( this.f.idTipoComprobante.value, 10 ) : EnumTipoComprobante.TICKET) );


        }

      });

      this.formGroup.get('idPorcentajeIgv').valueChanges.subscribe((res) => {
        if(res){
          this.porcentajeIgvActual = this.porcentajesIgv.length ? this.porcentajesIgv.find(x => x.id === parseInt(res, 10)).valor : 0.00;
        }
      });

      this.formGroup.get('recibido').valueChanges.subscribe((res) => {
        this.vuelto();
      });

      // Tipo pago accion del cambio
      this.formGroup.get('idTipoPago').valueChanges.subscribe((res) => {
        if(res){
          const idTipoPago = parseInt(res, 10);

          this.formGroup.patchValue({
            codigoOperacion: null
          });

          this.verEntidadTipoPago = idTipoPago === this.enumTipoPago.MIXTO || idTipoPago === this.enumTipoPago.TARJETACREDITO;
          this.verPagoEfectivo = idTipoPago === this.enumTipoPago.MIXTO;
          this.verPagoTarjeta = idTipoPago === this.enumTipoPago.MIXTO;
          this.verCodigoOperacion = idTipoPago === this.enumTipoPago.MIXTO || idTipoPago === this.enumTipoPago.TARJETACREDITO || idTipoPago === this.enumTipoPago.DEPOSITO || idTipoPago === this.enumTipoPago.DEPILCARD;

          if(!this.verPagoEfectivo){ this.formGroup.patchValue({ pagoEfectivo: 0  }) }
          if(!this.verPagoTarjeta){ this.formGroup.patchValue({ pagoTarjeta: 0  }) }
          if(!this.verCodigoOperacion){
              this.formGroup.get('codigoOperacion').clearValidators();
          }else{
              this.formGroup.get('codigoOperacion').setValidators(Validators.required);
          }


          this.formGroup.patchValue({
            idEntidadTipoPago: ''
          });
          this.formGroup.get('idEntidadTipoPago').clearValidators();
          this.entidadesTipoPago = [];
          if(EnumTipoPago.TARJETACREDITO === idTipoPago || EnumTipoPago.MIXTO === idTipoPago || EnumTipoPago.TARJETADEBITO ){
            this.formGroup.get('idEntidadTipoPago').setValidators(Validators.required);
            this.obtenerEntidadesTipoPago();
          }

          this.f.recibido.enable();

          switch (idTipoPago) {
            case EnumTipoPago.DEPILCARD:
            case EnumTipoPago.DEPOSITO:
            case EnumTipoPago.TARJETADEBITO:
            case EnumTipoPago.TARJETACREDITO:
                this.errorRecibido = false;
                this.f.recibido.disable();
                this.formGroup.patchValue({
                  recibido: this.precioTotal()
                });
              break;
            case EnumTipoPago.MIXTO:
              this.f.recibido.disable();
              this.formGroup.patchValue({
                recibido: 0
              });
              break;
          }

          this.formGroup.get('idEntidadTipoPago').updateValueAndValidity();
          this.formGroup.get('codigoOperacion').updateValueAndValidity();
        }
      });

      this.formGroup.get('siguienteCita').valueChanges.subscribe((res) => {
        this.formGroup.get('numeroMeses').clearValidators();
        this.siguienteCita = res;
        if(res){
          this.formGroup.get('numeroMeses').setValidators(Validators.required);
        }
        this.formGroup.get('numeroMeses').updateValueAndValidity();
      });
      this.formGroup.get('pagoEfectivo').valueChanges.subscribe((res) => {
        this.formGroup.patchValue({
          recibido: parseFloat(res) + parseFloat( this.f.pagoTarjeta.value )
        })
      });
      this.formGroup.get('pagoTarjeta').valueChanges.subscribe((res) => {
        this.formGroup.patchValue({
          recibido: parseFloat(res) + parseFloat( this.f.pagoEfectivo.value )
        })
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
    get numeroComprobante(): number{
      return this.f.numeroComprobante.value ? parseInt(this.f.numeroComprobante.value, 10) : 0;
    }
    get recibido(): number{
      return this.f.recibido.value ? parseFloat(this.f.recibido.value) : 0.00;
    }
    vuelto(): void{

      if(this.recibido > this.precioTotal()) {
        this.formGroup.patchValue({ vuelto: (this.recibido - this.precioTotal()) });
      } else {
        this.formGroup.patchValue({ vuelto: 0.00 });
      }
    }
    get model(): any {

        const idTipoComprobante = parseInt(this.f.idTipoComprobante.value, 10);
        // console.log(this.tiposPago);
        return {
          idCliente: this.dataCita!.idCliente,
          idCita: this.IdCita,
          idSede: this.dataCita!.idSede,

          idAtendidoPor: parseInt(this.f.idAtendidoPor.value, 10),
          numeroBox: parseInt(this.f.numeroBox.value, 10),
          idMaquinaMarca: parseInt(this.f.idMaquinaMarca.value, 10),
          siguienteCita: this.f.siguienteCita.value,
          numeroMeses: parseInt(this.f.numeroMeses.value, 10),

          idTipoComprobanteValor: parseInt( this.tiposComprobantes.find(x => x.id === parseInt(this.f.idTipoComprobante.value, 10)).valor , 10),
          idTipoComprobante: this.f.idTipoComprobante.value ? parseInt(this.f.idTipoComprobante.value, 10) : null,
          tipoComprobante: this.f.idTipoComprobante.value ? this.tiposComprobantes.find(x => x.id === parseInt(this.f.idTipoComprobante.value, 10))?.descripcion : null,
          idSerieComprobante: this.f.idSerieComprobante.value ? parseInt(this.f.idSerieComprobante.value, 10) : null,
          serieComprobante: this.f.idSerieComprobante.value ? this.seriesComprobante.find(x => x.id === parseInt(this.f.idSerieComprobante.value, 10)).serie : null,
          numeroComprobante: this.f.numeroComprobante.value,

          idPorcentajeIgv: this.f.idPorcentajeIgv.value ? parseInt(this.f.idPorcentajeIgv.value, 10) : null,
          porcentajeIgv: this.f.idPorcentajeIgv.value ? this.porcentajesIgv.find(x => x.id === parseInt(this.f.idPorcentajeIgv.value, 10))?.valor : null,
          idSunatTransaccion: this.f.sunatTransaccion.value ? parseInt(this.f.sunatTransaccion.value, 10) : null,
          sunatTransaccion: this.f.sunatTransaccion.value ? this.tiposTransaccion.find(x => x.id === parseInt(this.f.sunatTransaccion.value, 10))?.descripcion : null,
          idTipoMoneda: this.f.idTipoMoneda.value ? parseInt(this.f.idTipoMoneda.value, 10) : null,
          tipoMoneda: this.f.idTipoMoneda.value ? this.tiposMoneda.find(x => x.id === parseInt(this.f.idTipoMoneda.value, 10))?.descripcion : null,
          tipoMonedaValor: this.f.idTipoMoneda.value ? this.tiposMoneda.find(x => x.id === parseInt(this.f.idTipoMoneda.value, 10))?.valor : null,
          tipoMonedaSimbolo: this.f.idTipoMoneda.value ? this.tiposMoneda.find(x => x.id === parseInt(this.f.idTipoMoneda.value, 10))?.simbolo : null,
          tipoCambio: this.f.tipoCambio.value ? parseFloat(this.f.tipoCambio.value) : null,
          idTipoPago: this.f.idTipoPago.value ? parseInt(this.f.idTipoPago.value, 10) : null,
          tipoPagoValor: this.tiposPago.find(x => x.idTipoPago === parseInt(this.f.idTipoPago.value, 10)).valor,
          tipoPago: this.f.idTipoPago.value ? this.tiposPago.find(x => x.idTipoPago === parseInt(this.f.idTipoPago.value, 10))?.descripcion : null,

          codigoOperacion: this.f.codigoOperacion.value ? this.f.codigoOperacion.value : '',

          idEntidadTipoPago: this.f.idEntidadTipoPago.value ? parseInt(this.f.idEntidadTipoPago.value, 10) : null,
          entidadTipoPago: this.f.idEntidadTipoPago.value ? this.entidadesTipoPago.find(x => x.id === parseInt(this.f.idEntidadTipoPago.value, 10))?.nombre : null,




          totalInafecta: this.totalInafecta(),
          totalGratuita: this.totalGratuita(),
          totalExonerada: this.totalExonerada(),
          totalIgv: this.totalIgv(),
          subTotal: this.totalSubTotal(),
          total: this.precioTotal(),
          pagoEfectivo: parseFloat( this.f.pagoEfectivo.value ),
          pagoTarjeta: parseFloat( this.f.pagoTarjeta.value ),
          recibido: this.recibido,
          vuelto: this.recibido > this.precioTotal() ? (this.recibido - this.precioTotal()) : 0.00,
          detalles: this.detalles(),

          idUsuarioRegistro: this.usuarioService.UsuarioActual.idUsuario,

          idClienteComprobante: this.esTicket ? null : this.datoClientePredeterminadoFacturacion.id,
          clienteDocumentoComprobante: this.esTicket ? null : this.datoClientePredeterminadoFacturacion.numeroDocumentoCliente,
          clienteDenominacionComprobante: this.esTicket ? null : this.datoClientePredeterminadoFacturacion.nombreCliente,
          clienteDireccionComprobante: this.esTicket ? null : this.datoClientePredeterminadoFacturacion.direccion,
          tipoDocumentoClienteValorComprobante: this.esTicket ? null : this.datoClientePredeterminadoFacturacion.tipoDocumentoClienteValor,


          idDetallesEliminados: this.idDetallesEliminados,
          turno: this.Turno,


          observaciones: this.f.observaciones.value ? this.f.observaciones.value : '',
          formato: this.f.formato.value
        }

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
                this.ldObtenerMaquinaMarca ||
                this.ldObtenerTiposTransaccion ||
                this.ldObtenerTiposMoneda ||
                this.ldObtenerPorcentajeIgv ||
                this.ldObtenerCitaDetalle ||
                this.ldActualizarDocumentoCliente ||
                this.ldObtenerDatoClientePredeterminadoFacturacion ||
                this.ldObtenerTiposPago ||
                this.ldObtenerEntidadesTipoPago ||
                this.ldObtenerSeriesComprobante ||
                this.ldObtenerTiposComprobantes ||
                this.ldObtenerTiposDocumentoIdentidad ||
                this.ldObtenerDataDetalle ||
                this.ldSubmit );

      return obs;
    }

    onSubmit(): void{

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
            html: `Desea editar los datos de la plantilla <b>${this.data?.nombre}</b>??`,
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
                        html: `Se modifico los datos de la plantilla <b>${this.data?.nombre}</b> con exito!!!`,
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
                      html: `Error al intentar modificar los datos de la plantilla <b>${this.data?.nombre}</b>`,
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


    // validaciones
    onChangeTipoComprobante(event): void{
      this.esTicket = !parseInt(event.target.value, 10)
    }

    /*******************************************************************************************
     * Eventos
     */
    evtOnSubmit(): void{
      this.submitted = true;
      this.errorRecibido = false;
      if(this.formGroup.invalid){
        this.utilsService.mostrarToast('Faltan datos por ingresar','warning');
        console.log(this.formGroup);
        return;
      }

      if(!this.esTicket && !this.datoClientePredeterminadoFacturacion){
        this.utilsService.mostrarToast('Falta ingresar los datos del cliente para el comprobante','warning');
        return;
      }

      if(parseFloat(this.f.recibido.value) === 0 && this.precioTotal() > 0) {
          this.errorRecibido = true;
          this.utilsService.mostrarToast('Falta ingresar el pago total','warning');
          return;
      }

      if(parseFloat(this.f.recibido.value) < this.precioTotal()) {
        this.errorRecibido = true;
        console.log(parseFloat(this.f.recibido.value), this.precioTotal());
        this.utilsService.mostrarToast('El pago total debe ser mayor o igual al monto a pagar','warning');
        return;
      }

      Swal.fire({
        title: 'Desea emitir el comprobante electrónico??',
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
            this.api.emitir(this.model).subscribe((res: ComprobanteElectronicoDatos | ErrorSistema) => {
                if (res instanceof ErrorSistema){
                  res.status === 400 ? this.utilsService.mostrarToast( res.message, 'error') : this.utilsService.mostrarToast( 'Ocurrio un error con el servicio de facturación', 'error');
                  this.ldSubmit = false;
                }else{
                  this.utilsService.mostrarToast( "Se registro el comprobante con exito", 'success');
                  this.ldSubmit = false;
                  this.OnCreated.emit(res);
                }
              },
              error => {
                this.ldSubmit = false;
                console.log(error);
                this.utilsService.mostrarToast( "Ocurrio une error al intentar emitir el comprobante", 'error');
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
    evtEditarItem(item: ComprobanteDatosCitaDetalle): void{
      this.modalRef = this.modalService.open(MdlFacturaItemComponent, {
        size: 'lg w-100 max-w-900px',
        backdrop: "static",
        windowClass: 'smodal fade round popins bg-dark-30',
        keyboard: false,
        backdropClass: 'bg-transparent',
        animation: true,
        scrollable: false
      });
      this.modalRef.componentInstance.detalle = item;
      this.modalRef.componentInstance.igv = this.porcentajeIgvActual;
      this.modalRef.componentInstance.OnConfirmed.subscribe(async (res: ComprobanteDatosCitaDetalle) => {
        this.dataCitaDetalle = this.dataCitaDetalle.map(x => {
          if(x.idCitaDetalle === res.idCitaDetalle){
            return res;
          }else{
            return x;
          }
        });

      });
    }
    evtQuitarItem(index: number): void{
      const detalle = this.dataCitaDetalle.find((x,y) => y === index);
      // console.log(detalle);
      detalle.selectComprobante = !detalle.selectComprobante;
    }
    evtEliminarItem(index: number): void{
      const detalle = this.dataCitaDetalle.find((x,y) => y === index);
      // console.log(detalle);
      this.dataCitaDetalle = this.dataCitaDetalle.filter(x => x.idCitaDetalle !== detalle.idCitaDetalle);
      this.idDetallesEliminados.push(detalle.idCitaDetalle);
    }
    evtAgregarDatoClienteFactura(): void{
      this.modalRef = this.modalService.open(MdlDatosClienteComprobanteComponent, {
        size: 'lg w-100 max-w-900px',
        backdrop: "static",
        windowClass: 'smodal fade round popins bg-dark-30',
        keyboard: false,
        backdropClass: 'bg-transparent',
        animation: true,
        scrollable: true
      });
      this.modalRef.componentInstance.IdTipoComprobante = parseInt( this.f.idTipoComprobante.value, 10 );
      this.modalRef.componentInstance.IdCliente = this.dataCita!.idCliente;
      this.modalRef.componentInstance.OnCreated.subscribe((res) => {
        this.obtenerDatosFacturacionCliente(this.dataCita!.idCliente);
      });
    }
    evtVerListaDatoClienteFactura(): void{
      this.modalRef = this.modalService.open(MdlListaDatosClienteComprobanteComponent, {
        size: 'lg w-100 max-w-600px',
        backdrop: "static",
        windowClass: 'smodal fade round popins bg-dark-30',
        keyboard: false,
        backdropClass: 'bg-transparent',
        animation: true,
        scrollable: true
      });
      this.modalRef.componentInstance.IdCliente = this.dataCita!.idCliente;
      this.modalRef.componentInstance.OnSelected.subscribe((res: FacturaDatosCliente) => {
        this.datoClientePredeterminadoFacturacion = res;
        console.log(res);
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
    evtEditarDatosCliente(): void{
      this.documentoClienteSubmitted = true;

      if(this.f.idTipoDocumentoCliente.valid && this.f.documentoCliente.valid){

        Swal.fire({
          html: `Desea editar los datos del documento de identidad??`,
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
              this.sbcActualizarDocumentoCliente?.unsubscribe();
              this.ldActualizarDocumentoCliente = true;
              // this.sbcActualizarDocumentoCliente?.unsubscribe();
              this.sbcActualizarDocumentoCliente = this.clienteService.actualizarDocumentoIdentidad(this.modelDocumentoIdentidad).subscribe((res: boolean | ErrorSistema) => {
                if(res instanceof ErrorSistema){
                  this.utilsService.mostrarToast(res.message, 'error');
                }else{
                  this.evtEditarDocumento();
                  this.utilsService.mostrarToast('Se actualizaron los datos del documento de identidad del cliente con exito.', 'success');
                }
                this.ldActualizarDocumentoCliente = false;
                this.documentoClienteSubmitted = false;
              }, error => {
                console.log('Ocurrio un error al intentar actualizar el documento de identidad del cliente.');
                this.utilsService.mostrarToast('Ocurrio un error al intentar actualizar el documento de identidad del cliente.', 'error');
                console.log(error);
                this.ldActualizarDocumentoCliente = false;
              });
            }
        });

      }else{
        this.utilsService.mostrarToast('Faltan ingresar datos', 'warning');
      }
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
        this.obtenerDataCitaDetalle();
      });
    }
    evtCalcularValores(): void{
      this.dataCitaDetalle.forEach(async x => {

        const precio = this.getPrecio(x);

        x.valorUnitario = precio;
        x.subTotal = precio;
        x.total = precio;
        x.precio = precio;
        x.igv = 0;

        if(x.aplicaIgv){
          x.valorUnitario =  precio / (1 + (this.porcentajeIgvActual / 100));
          x.subTotal = precio / (1 + (this.porcentajeIgvActual / 100));
          x.igv = (precio / (1 + (this.porcentajeIgvActual / 100))) * (this.porcentajeIgvActual / 100);
        }

        x.gratuitaTotal = x.gratuita ? precio : 0.00;
        x.inafectaTotal = x.inafecta ? precio : 0.00;
        x.exoneradaTotal = x.exonerada ? precio : 0.00;

        // x.valorUnitario = await this.valorUnitario(x.precio);
        // x.subTotal = await this.subTotalUnitario(x.precio);
        // // console.log(this.subTotalUnitario(x.precio));
        // x.igv = await this.igvUnitario(x.precio);
      });
    }
    evtEditarNumeroComprobante(): void{
        this.editarNumeroComprobante = !this.editarNumeroComprobante;
    }

    evtMostrarMedioPago(): void{
        const modalref = this.modalService.open(MdlEmisionComprobanteMedioPagoComponent,{
          size: 'lg w-100 max-w-900px',
          backdrop: false,
          windowClass: 'bg-dark-30 popins',
          keyboard: false,
          backdropClass: 'bg-transparent'
        });
        modalref.componentInstance.detalles = this.detalles();
        modalref.componentInstance.mediosPago = [...this.mediosPago];
        modalref.componentInstance.OnSuccess.subscribe((res: ComprobanteElectronicoMedioPago[]) => {
          this.mediosPago = [...res];
          this.formGroup.get('recibido').patchValue( this.mediosPago.map(x => x.importe).reduce((a,b) => a + b , 0) );
        });
    }




    /*******************************************************************************************
     * Obtener data de cita para llenar el comprobante
     */
    obtenerDataCita(): void{
      this.sbcObtenerData?.unsubscribe();
      this.ldObtenerData = true;
      this.sbcObtenerData = this.datosCitaService.obtenerDatosCita(this.IdCita, this.usuarioService.UsuarioActual.idUsuario).subscribe((res: FacturaDatosCita | ErrorSistema) => {
        // console.log(res);

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
          this.dataCita = res;
          this.obtenerDatosFacturacionCliente(res.idCliente);
          this.patchForm(this.dataCita);

          this.obtenerDataCitaDetalle();
          this.obtenerMarcasMaquina();
          this.obtenerTiposMoneda();
          this.obtenerPorcentajesIgv();
          this.obtenerTiposTransaccion();
          this.obtenerTiposDocumentoIdentidad();
          this.obtenerTiposComprobante();
          this.obtenerTiposPago();

        }

        this.ldObtenerData = false;
      }, (error: any) => {
        this.ldObtenerData = false;
        console.log('Error al obtener los datos de la cita', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los datos de la cita',
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




    /*******************************************************************************************
     * Obtener data de cita para llenar el comprobante
     */
    obtenerDataCitaDetalle(): void{
      this.sbcObtenerDataDetalle?.unsubscribe();
      this.ldObtenerDataDetalle = true;
      this.sbcObtenerDataDetalle = this.datosCitaService.obtenerDatosCitaDetalle(this.IdCita, this.usuarioService.UsuarioActual.idUsuario).subscribe(async (res: ComprobanteDatosCitaDetalle[] | ErrorSistema) => {
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
          this.dataCitaDetalle = res;
          this.patchForm(this.dataCita);

          // calcular
          await this.calcularTotalSubTotal();
          await this.calcularTotalIgv();

          if(this._totalSubTotal > 0){
            const medioPago = new ComprobanteElectronicoMedioPago();
            medioPago.idTipoPago = EnumTipoPago.EFECTIVO;
            medioPago.tipoPago = "Efectivo";
            medioPago.importe = parseFloat(this._totalSubTotal.toFixed(2));
            medioPago.idCita = this.dataCita.idCita;
            this.mediosPago.push(medioPago);

            this.formGroup.patchValue({
              recibido: parseFloat(this._totalSubTotal.toFixed(2))
            });
          }

        }
        this.ldObtenerDataDetalle = false;
      }, (error: any) => {
        this.ldObtenerDataDetalle = false;
        console.log('Error al obtener los datos del detalle', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los datos del detalle',
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


    /*******************************************************************************************
     * Obtener data de maquina marca
     */
    obtenerMarcasMaquina(): void{
      this.sbcObtenerMaquinaMarca?.unsubscribe();
      this.ldObtenerMaquinaMarca = true;
      this.sbcObtenerMaquinaMarca = this.maquinaMarcaService.listarByServicio(this.IdServicio).subscribe((res: MaquinaMarca[]) => {
        // console.log(res);

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
          this.marcasMaquina = res;
        }
        this.ldObtenerMaquinaMarca = false;
      }, (error: any) => {
        this.ldObtenerMaquinaMarca = false;
        console.log('Error al obtener la lista de maquinas', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los datos de la cita',
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

    /*******************************************************************************************
     * Obtener tipos de moneda
     */
    obtenerTiposMoneda(): void{
      this.sbcObtenerTiposMoneda?.unsubscribe();
      this.ldObtenerTiposMoneda = true;
      this.sbcObtenerTiposMoneda = this.facturaMonedaService.listar2(this.usuarioService.UsuarioActual.idUsuario).subscribe((res: FacturaMoneda[] | ErrorSistema) => {

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
          this.tiposMoneda = res;
          this.formGroup.patchValue({
            idTipoMoneda: this.tiposMoneda.length ? this.tiposMoneda[0].id : ''
          })
        }
        this.ldObtenerTiposMoneda = false;
      }, (error: any) => {
        this.ldObtenerTiposMoneda = false;
        console.log('Error al obtener los tipos de moneda', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los tipo de  moneda',
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


    /*******************************************************************************************
     * Obtener detalles de la cita
     */
    // obtenerCitaDetalle(): void{
    //   this.sbcObtenerCitaDetalle?.unsubscribe();
    //   this.ldObtenerCitaDetalle = true;
    //   this.sbcObtenerCitaDetalle = this.citaDetalleService.obtenerDetalleByCita(this.IdCita).subscribe((res: CitaDetalle[]) => {
    //     // console.log(res);
    //     this.citaDetalle = res;
    //     this.ldObtenerCitaDetalle = false;
    //
    //   }, (error: any) => {
    //     this.ldObtenerCitaDetalle = false;
    //     console.log('Error al obtener el detalle de la cita', error);
    //     Swal.fire({
    //       title: 'Error',
    //       text: 'Error al obtener el detalle de la cita',
    //       icon: 'error',
    //       buttonsStyling: false,
    //       confirmButtonText: 'Aceptar',
    //       customClass: {
    //         popup: 'popins rounded-grant shadow',
    //         confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
    //       }
    //     });
    //   });
    // }


    /*******************************************************************************************
     * Obtener porcentajes igv
     */
    obtenerPorcentajesIgv(esTicket: boolean = true): void{
      this.sbcObtenerPorcentajeIgv?.unsubscribe();
      this.ldObtenerPorcentajeIgv = true;
      this.sbcObtenerPorcentajeIgv = this.facturaPorcentajeIgvService.listar2(this.usuarioService.UsuarioActual.idUsuario).subscribe((res): void => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message, 'error');
        }else{
          this.porcentajesIgv = res;
          if(!this.esTicket){
            this.formGroup.patchValue({
              idPorcentajeIgv: this.porcentajesIgv.length ? res[0].id : ''
            });
            this.porcentajeIgvActual = this.porcentajesIgv.length ? res[0].valor : 0.00;
          }else{
            this.formGroup.patchValue({
              idPorcentajeIgv: ''
            });
            this.porcentajeIgvActual = 0.00;
          }

          this.evtCalcularValores();

          // this.dataCitaDetalle.forEach( async x => {
          //   x.valorUnitario = await this.valorUnitario(x.precio);
          //   x.subTotal = await this.subTotalUnitario(x.precio);
          //   x.igv = await this.igvUnitario(x.precio);
          // });
        }
        this.ldObtenerPorcentajeIgv = false;
      }, (error: any) => {
        this.ldObtenerPorcentajeIgv = false;
        console.log('Error al obtener los porcentajes de igv', error);
        this.utilsService.mostrarToast('Ocurrio un error al intentar obtener los porcentaje de igv', 'error');
      });
    }


    /*******************************************************************************************
     * Obtener data de maquina marca
     */
    obtenerTiposTransaccion(): void{
      this.sbcObtenerTiposTransaccion?.unsubscribe();
      this.ldObtenerTiposTransaccion = true;
      this.sbcObtenerTiposTransaccion = this.tipoTransaccionService.listar2(this.usuarioService.UsuarioActual.idUsuario).subscribe((res: FacturaTransaccionSunat[] | ErrorSistema) => {
        // console.log(res);

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
          this.tiposTransaccion = res;
          this.formGroup.patchValue({
            sunatTransaccion: this.tiposTransaccion.length ? res[0].id : ''
          });
        }
        this.ldObtenerTiposTransaccion = false;
      }, (error: any) => {
        this.ldObtenerTiposTransaccion = false;
        console.log('Error al obtener los tipos de transacción', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los tipos de transacción',
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



    /*******************************************************************************************
     * Obtener data de tipos de documento identidad
     */
    obtenerTiposDocumentoIdentidad(): void{
      this.sbcObtenerTiposDocumentoIdentidad?.unsubscribe();
      this.ldObtenerTiposDocumentoIdentidad = true;
      this.sbcObtenerTiposDocumentoIdentidad = this.tipoDocumentoIdentidadService.obtener().subscribe((res: object[]) => {
        // console.log('tiposdocumentoidentidad', res);
        this.tiposDocumentoIdentidad = res.map((x: any) => {
          const model = new DocumentoTipoIdentidad();
          model.id = x.id;
          model.descripcion = x.descripcion;
          return model;
        });
        this.ldObtenerTiposDocumentoIdentidad = false;
      }, (error: any) => {
        this.ldObtenerTiposDocumentoIdentidad = false;
        console.log('Error al obtener los tipos de transacción', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los tipos de transacción',
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


    /*******************************************************************************************
     * Obtener data de datos de facturación del cliente
     */
    obtenerDatosFacturacionCliente(idCliente: number, idTipoComprobante: number = 0): void{
      this.sbcObtenerDatoClientePredeterminadoFacturacion?.unsubscribe();
      this.ldObtenerDatoClientePredeterminadoFacturacion = true;
      this.sbcObtenerDatoClientePredeterminadoFacturacion = this.facturaDatosClienteService.buscarPredeterminadoByCliente(idCliente, idTipoComprobante,  this.usuarioService.UsuarioActual.idUsuario).subscribe((res: FacturaDatosCliente | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }else{
          // console.log(res);
          this.datoClientePredeterminadoFacturacion = res.id === 0 ? undefined : res;
        }
        this.ldObtenerDatoClientePredeterminadoFacturacion = false;
      }, (error: any) => {
        this.ldObtenerDatoClientePredeterminadoFacturacion = false;
        console.log('Error al obtener los datos predeterminados de facturación', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener los tipos de transacción',
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
          this.tiposComprobantes = res.filter(x => x.id !== EnumTipoComprobante.TICKET);
          this.formGroup.patchValue({
            idTipoComprobante: this.tiposComprobantes.length ? EnumTipoComprobante.BOLETA : 3
          })
        }
        this.ldObtenerTiposComprobantes = false;
      }, (error: any) => {
        this.ldObtenerTiposComprobantes = false;
        console.log('Error al obtener los tipos de comprobantes', error);
        this.utilsService.mostrarToast('Error al obtener los tipos de comprobantes','error');
      });
    }


    /*******************************************************************************************
     * Obtener data de datos de series del tipo de comprobante
     */
    obtenerSeriesComprobante(idTipoComprobante: number): void{
      this.sbcObtenerSeriesComprobante?.unsubscribe();
      this.ldObtenerSeriesComprobante = true;
      this.sbcObtenerSeriesComprobante = this.comprobanteSerieService.listarBySedeTipoComprobante(this.usuarioService.UsuarioActual.idUsuario,this.dataCita!.idSede, idTipoComprobante).subscribe((res: ComprobanteSerie[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else{
          this.seriesComprobante = res;
          this.formGroup.patchValue({
            idSerieComprobante: this.seriesComprobante.length ? this.seriesComprobante[0].id : '',
            numeroComprobante:  this.seriesComprobante.length
                                            ? ( this.seriesComprobante[0].idTipoComprobante !== EnumTipoComprobante.TICKET ? (this.seriesComprobante[0].numeroComprobante).toString().padStart(8,'0') : (this.seriesComprobante[0].numeroComprobante).toString().padStart(8,'0') )
                                            : '00000000'
          });
        }
        this.ldObtenerSeriesComprobante = false;
      }, (error: any) => {
        this.ldObtenerSeriesComprobante = false;
        console.log('Error al obtener las series del tipo de comprobante', error);
        this.utilsService.mostrarToast('Error al obtener las series del tipo de comprobante','error');
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




    /*******************************************************************************************
     * Funciones
     */

    detalles(): any[]{
      return this.dataCitaDetalle.filter(xx => xx.selectComprobante);
    }

    getPrecio(detalle: ComprobanteDatosCitaDetalle): number{
      let precio = 0.00;
      switch (detalle.idTipoIgv) {
        case EnumComprobanteTipoIgv.GRAVADO_OPERACION_ONEROSA: return detalle.precioReal;
        case EnumComprobanteTipoIgv.GRATUITO_EXONERADO_TRANSFERENCIA_GRATUITA: return detalle.precioCosto;
        default:  return detalle.precioReal;
      }
    }


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

    precioSubTotal(): number{
        let total: number = 0.00;
        this.detalles().forEach(x => {
            total += x.subTotal;
        });
        return total;
      // return this.dataCitaDetalle.filter(xx => xx.selectComprobante).map(x => x.valorUnitario).reduce((x,y) => x + y , 0);
    }

    totalSubTotal(): number{
      let total: number = 0.000000000;
      if(this.esTicket){
        return total;
      }
      this.detalles().forEach(x => {
        if(!x.inafecta && !x.gratuita && !x.exonerada){
          total += x.subTotal;
        }
      });
      return total;
    }

    totalIgv(): number{
      let total: number = 0.000000000;
      if(this.esTicket){
        return total;
      }
      this.detalles().forEach(x => {
        total += x.igv;
      });
      return total;
    }

    totalGratuita(): number{
      let total: number = 0.000000000;
      if(this.esTicket){
        return total;
      }
      this.detalles().forEach(x => {
        total +=  x.gratuitaTotal;
      });
      return total;
    }

    totalInafecta(): number{
      let total: number = 0.000000000;
      if(this.esTicket){
        return total;
      }
      this.detalles().forEach(x => {
        total +=  x.inafectaTotal;
      });
      return total;
    }

    totalExonerada(): number{
      let total: number = 0.000000000;
      if(this.esTicket){
        return total;
      }
      this.detalles().forEach(x => {
        total +=  x.exoneradaTotal;
      });
      return total;
    }

    precioTotal(): number{
        let total: number = 0.00;

        total = this.totalSubTotal() +  this.totalIgv() +  this.totalInafecta() +  this.totalExonerada();
        return parseFloat(total.toFixed(2));
        // return this.dataCitaDetalle.filter(xx => xx.selectComprobante).map(x => x.precio).reduce((x,y) => x + y , 0);
    }



    /// functions
    async calcularTotalSubTotal(): Promise<void>{
      const subTotal = this.dataCitaDetalle.filter(x => x.selectComprobante && !x.inafecta && !x.gratuita && !x.exonerada).map(y => y.subTotal).reduce((a,b) => a + b , 0 );
      await this._totalSubTotalSubject.next(subTotal);
    }
    async calcularTotalIgv(): Promise<void>{
      let total: number = 0.000000000;
      if(this.esTicket){
        this._totalIgvSubject.next(total);
        return;
      }
      // const totalIgv = this.dataCitaDetalle.filter(x => x.selectComprobante).map(y => y.igv).reduce((a,b) => a + b , 0 );
      const dd =  this.dataCitaDetalle.filter(x => x.selectComprobante);
      setTimeout(() => {
        console.log(dd);
      }, 3000)
      // await this._totalIgvSubject.next(totalIgv);
    }
}


