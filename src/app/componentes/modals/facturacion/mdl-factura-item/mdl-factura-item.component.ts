import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

// import Swal from 'sweetalert2';
import {ComprobanteDatosCitaDetalle} from "../../../../shared/models/facturacion/factura-datos-cita";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {Subscription} from "rxjs";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {NgSelectConfig} from '@ng-select/ng-select';
import {FacturaTipoIgvService} from "../../../../shared/services/facturacion/factura-tipo-igv.service";
import {FacturaTipoIgv} from "../../../../shared/models/facturacion/factura-tipo-igv";
import {AuthService} from "../../../../shared/services/auth.service";
import {EnumComprobanteTipoIgv} from "../../../../shared/enumeracion/enums";

@Component({
    selector: 'app-mdl-factura-item',
    templateUrl: 'mdl-factura-item.component.html',
    styleUrls: ['./mdl-factura-item.component.scss'],
})
export class MdlFacturaItemComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() igv: number;
    @Input() detalle: ComprobanteDatosCitaDetalle;
    @Output() OnConfirmed: EventEmitter<ComprobanteDatosCitaDetalle> = new EventEmitter<ComprobanteDatosCitaDetalle>();

    formGroup: FormGroup;

    ldTiposIgv: boolean;
    sbcTiposIgv: Subscription | undefined;
    tiposIgv: FacturaTipoIgv[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private config: NgSelectConfig,
        private tipoIgvService: FacturaTipoIgvService,
        public modal: NgbActiveModal,
        private utilService: UtilsService,
        private authService: AuthService
    ) {
      this.config.notFoundText = 'No se encontraron resultados';

      this.ldTiposIgv = false;
      this.formGroup = this.formBuilder.group({
        producto: new FormControl(null, Validators.required),
        detalle: new FormControl(null, Validators.required),
        cantidad: new FormControl(1, Validators.required),
        valorUnitario: new FormControl(0.00, Validators.required),
        subTotal: new FormControl(0.00, Validators.required),
        idTipoIgv: new FormControl(0, Validators.required),
        igv: new FormControl(0, Validators.required),
        total: new FormControl(0, Validators.required),
      })
    }

    ngOnInit(): void {
      // console.log('detalle', this.detalle);

      this.obtenerTiposIgv();

      this.formGroup.patchValue({
        producto: this.detalle.zona,
        detalle: this.detalle.detalle,
        cantidad: this.detalle.cantidad,
        valorUnitario: this.detalle.valorUnitario,
        subTotal: this.detalle.subTotal,
        idTipoIgv: this.detalle.idTipoIgv,
        igv: this.detalle.igv,
        total: this.detalle.precio
      });
      this.formGroup.get('idTipoIgv').valueChanges.subscribe(async (res) => {
        if(res){
          const tipoIgv = this.tiposIgv.find(x => x.id === parseInt(res, 10));
          this.detalle.idTipoIgv = parseInt(res, 10);

          const precio = this.getPrecio();

          this.detalle.valorUnitario = precio;
          this.detalle.subTotal = precio;
          this.detalle.total = precio;
          this.detalle.precio = precio;
          this.detalle.igv = 600;

          if(tipoIgv.aplicaIgv){
            this.detalle.valorUnitario = precio / (1 + (this.igv / 100));
            this.detalle.subTotal = precio / (1 + (this.igv / 100));
            this.detalle.igv = (precio / (1 + (this.igv / 100))) * (this.igv / 100);
          }


          // asignar valores al detalle
          this.detalle.aplicaIgv = tipoIgv.aplicaIgv;
          this.detalle.gratuita = tipoIgv.gratuita;
          this.detalle.inafecta = tipoIgv.inafecta;
          this.detalle.exonerada = tipoIgv.exonerada;

          this.detalle.gratuitaTotal = tipoIgv.gratuita ? precio : 0.00;
          this.detalle.inafectaTotal = tipoIgv.inafecta ? precio : 0.00;
          this.detalle.exoneradaTotal = tipoIgv.exonerada ? precio : 0.00;

          // console.log(this.detalle);
        }
      });

      this.formGroup.get('detalle').valueChanges.subscribe(async (res) => {
        // console.log(res);
        this.detalle.detalle = res;
      });
    }

    ngAfterViewInit(): void{
    }

    ngOnDestroy(): void {
    }


    get f(): any { return this.formGroup.controls; }
    get loading(): boolean{
      return  this.ldTiposIgv;
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }


    /****************************************************************************************************************
     * Funciones
     */
    getPrecio(): number{
      let precio = 0.00;
      switch (this.detalle.idTipoIgv) {
        case EnumComprobanteTipoIgv.GRAVADO_OPERACION_ONEROSA: return this.detalle.precioReal;
        case EnumComprobanteTipoIgv.GRATUITO_EXONERADO_TRANSFERENCIA_GRATUITA: return this.detalle.precioCosto;
        default:  return this.detalle.precioReal;
      }
    }



    /****************************************************************************************************************
     * Eventos
     */
    evtOnSubmit(): void{
      this.OnConfirmed.emit(this.detalle);
      this.cerrarModal();
    }


    /****************************************************************************************************************
     * Data
     */
    obtenerTiposIgv(): void{
      this.ldTiposIgv =  true;
      this.sbcTiposIgv = this.tipoIgvService.listar2(this.authService.getUser().id).subscribe((res: FacturaTipoIgv[] | ErrorSistema) => {
        if(res instanceof  ErrorSistema){
          this.utilService.mostrarToast(res.message,'error');
        }else{
          this.tiposIgv = res.filter(x => [EnumComprobanteTipoIgv.GRAVADO_OPERACION_ONEROSA, EnumComprobanteTipoIgv.GRATUITO_EXONERADO_TRANSFERENCIA_GRATUITA].includes(x.id));
        }
        this.ldTiposIgv = false;
      }, error => {
        this.ldTiposIgv = false;
        this.utilService.mostrarToast('Ocurrio un error al obtener los tipos de igv', 'error');
      });
    }


}
