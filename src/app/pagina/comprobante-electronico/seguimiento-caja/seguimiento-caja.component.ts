import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FlatpickrOptions} from "ng2-flatpickr";
import Spain from "flatpickr/dist/l10n/es";


import {FacturacionService} from "../../../shared/services/facturacion.service";
import {CajaService} from "../../../shared/services/caja.service";
import {Caja} from "../../../shared/models/caja";

@Component({
  selector: 'app-seguimiento-caja',
  templateUrl: './seguimiento-caja.component.html',
  styleUrls: ['./seguimiento-caja.component.scss']
})
export class SeguimientoCajaComponent implements OnInit, OnDestroy, AfterViewInit {

  loading = false;
  _loading = new BehaviorSubject<boolean>(false);

  usuarioActual: any;
  ldSubmit = false;
  submitted = false;
  subscription: Subscription | undefined;

  dtResponsiveOptions: any = {};
  dataTable: any;

  formGroup: FormGroup;
  sbcCollection: Subscription | undefined;
  // collection: CitaSinSiguienteCita[] =[];
  ldCollection: boolean;

  flatOptions: FlatpickrOptions = {
    locale: Spain.es,
    // mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    altInput: true,
    altInputClass: 'form-control form-indigo form-control-sm text-center',
  };


  tiposPago: any[] = [];
  ldTiposPago: boolean;
  sbcTiposPago: Subscription | undefined;

  cajas: Caja[] = [];
  ldCajas: boolean;
  sbcCajas: Subscription | undefined;

  seguimiento: any | undefined;

  constructor(
    private auth: AuthService,
    public utilsService: UtilsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private facturacionService: FacturacionService,
    private cajaService: CajaService,
  ) {
      this.ldTiposPago = false;
  }

  ngOnInit(): void {
    this.usuarioActual = this.auth.getUser();

    this.formGroup = this.formBuilder.group({
      fecha: new FormControl(null, Validators.required)
    });


    this.obtenerTiposPago();
    this.obtenerCajas();
  }

  ngOnDestroy(): void {
    this.sbcCollection?.unsubscribe();
  }

  ngAfterViewInit(): void {


    // this.datatableElement.dtInstance.then((dtInstance: any) => {
    //
    //   this.dataTable = dtInstance;
    //
    //   dtInstance.on('select',  (e, dt, type, indexes ) => {;
    //     if ( type === 'row' ) {
    //       this.selected = dtInstance.rows('.selected').data()[0];
    //     }
    //   });
    //
    //   dtInstance.on('deselect', (e, dt, type, indexes ) => {
    //     this.selected = null ;
    //   });
    // });
  }

  /**************************************************************************************
   * Getters
   */
  get f(): any{
    return this.formGroup.controls;
  }


  /**************************************************************************************
   * Events
   */
  evtOnSubmit(): void{
    if(this.formGroup.invalid){
      this.utilsService.mostrarToast('Debe seleccionar una fecha', 'warning');
      console.log(this.formGroup);
      return;
    }

    this.submitted = true;

    const fecha = this.datePipe.transform(this.f.fecha.value[0], 'yyyy-MM-dd');
    this.subscription = this.cajaService.obtenerSeguimientoDiario(fecha, this.usuarioActual.id).subscribe( (res) => {
      this.seguimiento = res.data;
      console.log(this.seguimiento);
      this.loading = false;
      this._loading.next(false);
    }, err =>  {
      this.loading = false;
      this._loading.next(false)
      console.log('Error al obtener el cronograma de citas atendidas: ', err);
      this.utilsService.mostrarToast('Error al obtener el cronograma de citas atendidas','error');
    });

  }


  /**************************************************************************************
   * Data
   */
  obtenerTiposPago(): void{
    this.ldTiposPago = true;
    this.sbcTiposPago = this.facturacionService.obtenerTipoPagoLista().subscribe((res: any[]) => {
      this.tiposPago = res;
          this.ldTiposPago = false;
    }, error => {
          this.ldTiposPago = false;
    })
  }
  obtenerCajas(): void{
    this.ldCajas = true;
    this.sbcCajas = this.cajaService.obtener().subscribe((res: any) => {
      this.cajas = res;
      this.ldCajas = false;
    }, error => {
      this.ldCajas = false;
    })
  }

  /**************************************************************************************
   * Functions
   */
  totalCaja(idCaja: number): number{
    // console.log(idCaja);
    if(!this.seguimiento){
      return 0
    }
    if(!this.seguimiento.cajas){
      return 0
    }
    return this.seguimiento.cajas.find(x => x.id === idCaja).total;
  }
  totalTipoPago(idCaja: number, idTipoPago: number): number{
    // console.log(idCaja, idTipoPago);
    if(!this.seguimiento){
      return 0
    }
    if(!this.seguimiento.ingresos){
      return 0
    }
    return this.seguimiento.ingresos.find(x => x.idCaja === idCaja && x.idTipoPago === idTipoPago).total;
  }
  totalTiposPago(idTipoPago: number): number{
    // console.log(idCaja, idTipoPago);
    if(!this.seguimiento){
      return 0
    }
    if(!this.seguimiento.ingresos){
      return 0
    }
    return this.seguimiento.ingresos.filter(x => x.idTipoPago === idTipoPago).map(x => x.total).reduce((a,b) => a + b, 0);
  }
  totalCajas(): number{
    if(!this.seguimiento){
      return 0
    }
    if(!this.seguimiento.cajas){
      return 0
    }
    return this.seguimiento.cajas.map(x => x.total).reduce((a,b) => a + b , 0);
  }
}

