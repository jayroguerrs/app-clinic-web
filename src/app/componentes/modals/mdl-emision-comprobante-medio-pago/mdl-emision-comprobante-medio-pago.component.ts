import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ComprobanteEntidadTipoPagoService} from "../../../shared/services/facturacion/comprobante-entidad-tipo-pago.service";
import {ComprobanteEntidadTipoPago} from "../../../shared/models/facturacion/comprobante-entidad-tipo-pago";
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import { ErrorSistema } from 'src/app/shared/models/error-sistema';
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {FacturacionService} from "../../../shared/services/facturacion.service";
import {CurrencyMaskInputMode} from "ngx-currency";
import {ComprobanteElectronicoMedioPago} from "../../../shared/models/facturacion/comprobante-electronico";


@Component({
    selector: 'app-mdl-emision-comprobante-medio-pago',
    templateUrl: 'mdl-emision-comprobante-medio-pago.component.html',
    styleUrls: ['./mdl-emision-comprobante-medio-pago.component.scss'],
})
export class MdlEmisionComprobanteMedioPagoComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() detalles: any[] = [];
    @Input() mediosPago: ComprobanteElectronicoMedioPago[] = [];
    @Output() OnSuccess: EventEmitter<ComprobanteElectronicoMedioPago[]> = new EventEmitter<ComprobanteElectronicoMedioPago[]>();

    entidadTiposPago: ComprobanteEntidadTipoPago[] = [];
    sbcEntidadTiposPago: Subscription | undefined;
    ldEntidadTiposPago: boolean;


    // Datos de tipo de pago
    ldObtenerTiposPago: boolean;
    sbcObtenerTiposPago : Subscription | undefined;
    tiposPago: any[] = [];

    // Configuraciones
    options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }


    importePagado: number = 0.0;
    vuelto: number = 0.0;


    constructor(
      public modal: NgbActiveModal,
      private entidadTipoPagoService: ComprobanteEntidadTipoPagoService,
      private auth: AuthService,
      private util: UtilsService,
      private facturacionService: FacturacionService
    ) {
      this.ldEntidadTiposPago = false;
    }

    ngOnInit(): void {
      this.obtenerTiposPago();
      this.obtenerEntidadesTipoPago();

      if(!this.mediosPago.length){
        this.evtAgregarMedioPago();
      }
    }

    ngAfterViewInit(): void{

    }

    ngOnDestroy(): void {

    }

    /*******************************************************************************************************
     * Getters
     */
    importeTotal(): number{
      return this.detalles.map(x => x.precio).reduce((a,b) => a + b , 0);
    }
    get pagado(): number{
      return this.mediosPago.map(x => x.importe).reduce((a,b) => a + b , 0);
    }


    /*******************************************************************************************
     * Eventos
     */
    evtCerrarModal(): void{
      this.modal.close();
    }
    evtAgregarMedioPago(): void{
      this.mediosPago.push(
        new ComprobanteElectronicoMedioPago()
      )
    }
    evtSelectTipoPago(event: Event, medioPago: ComprobanteElectronicoMedioPago): void{
      // console.log(event);
      const value = (event.target as HTMLInputElement).value;
      medioPago.idTipoPago = value ? parseInt(value, 10) : null;
      medioPago.tipoPago = value ? this.tiposPago.find(x => x.idTipoPago === parseInt(value, 10)).descripcion : null;
      medioPago.entidad = value ? this.tiposPago.find(x => x.idTipoPago === parseInt(value, 10)).entidad : false;
      medioPago.numOperacion = value ? this.tiposPago.find(x => x.idTipoPago === parseInt(value, 10)).numOperacion : false;
      if(!medioPago.entidad){
        medioPago.idEntidadTipoPago = null;
        medioPago.numeroPedido = null;
      }
      // console.log(this.mediosPago);
    }
    evtChangeImporte(event: any): void{
      this.importePagado = this.mediosPago.map(x => x.importe).reduce((a,b) => a + b, 0);
      this.vuelto = this.importePagado - this.importeTotal();
    }
    evtChangeEntidadTipoPago(event: Event, medioPago: ComprobanteElectronicoMedioPago): void{
      const value = (event.target as HTMLInputElement).value;
      medioPago.idEntidadTipoPago = value ? parseInt(value, 10) : null;
      medioPago.entidadTipoPago = value ? this.entidadTiposPago.find(x => x.id === parseInt(value, 10)).nombre : null;
    }
    evtKeyUpPedido(event: Event, medioPago: ComprobanteElectronicoMedioPago): void{
      const value = (event.target as HTMLInputElement).value;
      medioPago.numeroPedido = value === '' ? null : value;
    }
    evtKeyUpNota(event: Event, medioPago: ComprobanteElectronicoMedioPago): void{
      const value = (event.target as HTMLInputElement).value;
      medioPago.nota = value === '' ? null : value;
    }
    evtOnValidate(): void{
      if( this.mediosPago.filter(x => x.importe === 0).length ){
        this.util.mostrarToast('El importe debe ser mayor a 0', 'warning');
        return;
      }

      this.OnSuccess.emit(this.mediosPago);
      this.evtCerrarModal();
    }
    evtQuitar(index: number): void{
      // console.log(index);
      this.mediosPago = this.mediosPago.filter((x,i) => i !== index );
      this.importePagado = this.mediosPago.map(x => x.importe).reduce((a,b) => a + b, 0);
      this.vuelto = this.importePagado - this.importeTotal();
    }

    /*******************************************************************************************
     * Data
     */
    obtenerEntidadesTipoPago(): void{
      this.ldEntidadTiposPago = true;
      this.sbcEntidadTiposPago = this.entidadTipoPagoService.listar(this.auth.getUser().id).subscribe((res: ComprobanteEntidadTipoPago[] | ErrorSistema)=> {
        if(res instanceof  ErrorSistema){
          this.util.mostrarToast(res.message, 'error');
        }else{
          this.entidadTiposPago = res;
        }
        this.ldEntidadTiposPago = true;
      }, error => {
        console.log(error);
        this.util.mostrarToast('Ocurrio un error al obtener las entidades del tipo de pago', 'error');
        this.ldEntidadTiposPago = true;
      })
    }
    obtenerTiposPago(): void{
      this.sbcObtenerTiposPago?.unsubscribe();
      this.ldObtenerTiposPago = true;
      this.sbcObtenerTiposPago = this.facturacionService.obtenerTipoPagoLista().subscribe((res: any[]) => {
        this.tiposPago = res;
        this.ldObtenerTiposPago = false;
      }, (error: any) => {
        this.ldObtenerTiposPago = false;
        console.log('Error al obtener los tipos de pago', error);
        this.util.mostrarToast('Error al obtener los tipos de pago','error');
      });
    }

}


