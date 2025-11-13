import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FlatpickrOptions} from "ng2-flatpickr";
import Spain from "flatpickr/dist/l10n/es";
import {TipoComprobanteService} from "../../../shared/services/tipo-comprobante.service";
import {TipoComprobante} from "../../../shared/models/tipo-comprobante";
import {EnumTipoComprobante} from "../../../shared/enumeracion/enums";
import {Sede} from "../../../shared/models/sede";
import {SedeService} from "../../../corporal360/shared/service/sede.service";


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ComprobanteElectronicoAnuladoService} from "../../../shared/services/facturacion/comprobante-electronico-anulado.service";
import {TblComprobanteAnulacionesComponent} from "../../../componentes/tables/facturacion/tbl-comprobante-anulaciones/tbl-comprobante-anulaciones.component";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-comprobante-electronico-anulacion',
  templateUrl: './comprobante-electronico-anulacion.component.html',
  styleUrls: ['./comprobante-electronico-anulacion.component.scss']
})
export class ComprobanteElectronicoAnulacionComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabla') tabla: TblComprobanteAnulacionesComponent;

  loading = false;
  _loading = new BehaviorSubject<boolean>(false);

  usuarioActual: any;
  ldSubmit = false;
  submitted = false;
  subscription: Subscription | undefined;


  formGroup: FormGroup;
  sbcCollection: Subscription | undefined;
  // collection: CitaSinSiguienteCita[] =[];
  ldCollection: boolean;

  flatOptions: FlatpickrOptions = {
    locale: Spain.es,
    mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    altInput: true,
    allowInput: false,
    altInputClass: 'form-control form-indigo form-control-sm text-center',
    defaultDate: new Date()
  };


  flatOptions2: FlatpickrOptions = {
    locale: Spain.es,
    mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    altInput: true,
    allowInput: false,
    altInputClass: 'form-control form-indigo form-control-sm text-center border-right-0',
    defaultDate: new Date()
  };

  fechaDesde: string;
  fechaHasta: string;
  idTipoComprobante: number = 0;
  idSede: number = 0;


  /************ tipos de collection **************/
  ldTiposComprobante: boolean;
  sbcTiposComprobante: Subscription | undefined;
  tiposComprobante: TipoComprobante[] = [];


  /************ sedes **************/
  ldSedes: boolean;
  sbcSedes: Subscription | undefined;
  sedes: Sede[] = [];

  modalAnularComprobanteRef: NgbModalRef;
  modalComprobanteViewRef: NgbModalRef;
  sbcEmisionTicket: Subscription | undefined;

  ldValidando: boolean;

  constructor(
    private auth: AuthService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private tipoComprobanteService: TipoComprobanteService,
    private sedeService: SedeService,
    private api: ComprobanteElectronicoAnuladoService
  ) {
    this.ldValidando = false;
  }

  ngOnInit(): void {
    // this.render();
    this.usuarioActual = this.auth.getUser();

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required),
      idTipoComprobante: new FormControl(0, Validators.required),
      idSede: new FormControl(0, Validators.required),
    });
    this.formGroup.get('fechaDesde').valueChanges.subscribe((res) => {
      if(res){
        this.fechaDesde = this.datePipe.transform(res[0], 'yyyy-MM-dd');
      }
    });
    this.formGroup.get('fechaHasta').valueChanges.subscribe((res) => {
      if(res){
        this.fechaHasta = this.datePipe.transform(res[0], 'yyyy-MM-dd');
      }
    });
    this.formGroup.get('idSede').valueChanges.subscribe((res) => {
      if(res){
        console.log(res);
        this.idSede = parseInt(res, 10);
      }
    });
    this.formGroup.get('idTipoComprobante').valueChanges.subscribe((res) => {
      if(res){
        console.log(res);
        this.idTipoComprobante = parseInt(res, 10);
      }
    });

    this.formGroup.patchValue({
      fechaDesde: [new Date()],
      fechaHasta: [new Date()],
      idTipoComprobante: 0,
      idSede: 0
    });

    this.submitted = true;
    // this.render();


  }

  ngOnDestroy(): void {
    this.sbcCollection?.unsubscribe();
    this.sbcEmisionTicket?.unsubscribe();
    this.modalComprobanteViewRef?.close();
    this.modalAnularComprobanteRef?.close();
  }

  ngAfterViewInit(): void {
    this.obtenerTiposComprobante();
    this.obtenerSedes();

    this.tabla?._ldValidando.subscribe((res: boolean) => {
      this.ldValidando = res;
    });
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
      this.utilsService.mostrarToast('Debe seleccionar un rango de fecha', 'warning');
      console.log(this.formGroup);
      return;
    }

    if( this.f.fechaDesde.value[0].getTime() > this.f.fechaHasta.value[0].getTime() ){
      this.utilsService.mostrarToast('La fecha inicial debe ser menor', 'warning');
      return;
    }

    this.submitted = true;

    // console.log('reload');

    this.tabla?.reload();

  }
  evtImprimir(): void{

  }

  evtValidar(): void{
    this.tabla?.evtValidar();
  }

  reload( reset: boolean = true ): void{
    // this.dataTable.ajax.reload(null,reset);
  }


  /**************************************************************************************
   * Data
   */
  obtenerTiposComprobante(): void{
    this.ldTiposComprobante = true;
    this.sbcTiposComprobante = this.tipoComprobanteService.obtener().subscribe((res: any[]) => {
      this.tiposComprobante = res.filter(x => x.id !== EnumTipoComprobante.TICKET).map(x => {
          const m = new TipoComprobante();
          m.id = x.id;
          m.descripcion = x.descripcion;
          return m;
      });
      this.ldTiposComprobante = false
    }, error => {
      console.log(error);
      this.ldTiposComprobante = false
    });
  }
  obtenerSedes(): void{
    this.ldSedes = true;
    this.sbcSedes = this.sedeService.listar().subscribe((res: Sede[]) => {
      this.sedes = res;
      this.ldSedes = false;
    }, error => {
      console.log(error);
      this.ldSedes = false
    });
  }
  // async validarComprobantes(): Promise<void> {
  //
  //   return new Promise(async (resolve, reject) => {
  //
  //     // const collection: PhonesNum[] = [];
  //     this.ldValidando = true;
  //     for (const [i, item] of this.collection.entries()) {
  //
  //       if( item.validando === true ){
  //         await this.api.consultar(
  //           item.id,
  //           item.idTipoComprobante,
  //           item.serie,
  //           item.numero,
  //           item.idSede,
  //           this.auth.getUser().id
  //         ).toPromise().then(  (e: ComprobanteElectronicoValidar | ErrorSistema) => {
  //
  //           if(e instanceof ErrorSistema){
  //             console.log('error');
  //             this.collection.find(x => x.id === item.id).estadoSunat = 'error';
  //           }else{
  //             this.collection.find(x => x.id === item.id).estadoSunat = e.sunat;
  //           }
  //           item.validando = false;
  //           this.dataTable.clear().rows.add(this.collection).draw();
  //
  //         }).catch(e => {
  //           item.validando = false;
  //           this.collection.find(x => x.id === item.id).estadoSunat = '400';
  //           this.dataTable.clear().rows.add(this.collection).draw();
  //         });
  //       }
  //
  //       if ( i === (this.collection.length - 1) ) {
  //         console.log('finish');
  //         // await resolve(collection);
  //         // this.submittedSiguienteCita = false;
  //         this.ldValidando = false;
  //         await resolve();
  //       }
  //
  //
  //     }
  //   });
  // }


}
