import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {Subscription, BehaviorSubject} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FlatpickrOptions} from "ng2-flatpickr";
import Spain from "flatpickr/dist/l10n/es";
import {TipoComprobanteService} from "../../../shared/services/tipo-comprobante.service";
import {TipoComprobante} from "../../../shared/models/tipo-comprobante";
import {EnumTipoComprobante} from "../../../shared/enumeracion/enums";
import {Sede} from "../../../shared/models/sede";
import {SedeService} from "../../../corporal360/shared/service/sede.service";
import {ComprobanteElectronicoService} from "../../../shared/services/facturacion/comprobante-electronico.service";
import {DataTableDirective} from "angular-datatables";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {EmpresaService} from "../../../shared/services/empresa.services";
import {NumeroALetras} from "../../../shared/services/funciones/numero-letras.service";
import {MdlMotivoAnulacionComprobanteComponent} from "../../../componentes/modals/mdl-motivo-anulacion-comprobante/mdl-motivo-anulacion-comprobante.component";
import { FacturacionReporteVenta } from '../../../shared/models/facturacion/comprobante-electronico';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {ComprobanteUnidadMedidaService} from "../../../shared/services/facturacion/comprobante-unidad-medida.service";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-comprobante-electronico-reporte-venta',
  templateUrl: './comprobante-electronico-reporte-venta.component.html',
  styleUrls: ['./comprobante-electronico-reporte-venta.component.scss']
})
export class ComprobanteElectronicoReporteVentaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

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


  flatOptions2: FlatpickrOptions = {
    locale: Spain.es,
    // mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    altInput: true,
    altInputClass: 'form-control form-indigo form-control-sm text-center border-right-0',
  };


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

  collection: FacturacionReporteVenta[] = [];
  selected: FacturacionReporteVenta | null = null;

  ldValidando: boolean;

  sbcAnularComprobante: Subscription | undefined;

  fechaDesde: string = '';
  fechaHasta: string = '';

  constructor(
    private auth: AuthService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private tipoComprobanteService: TipoComprobanteService,
    private sedeService: SedeService,
    private api: ComprobanteElectronicoService,
    private unidadMedidaService: ComprobanteUnidadMedidaService
  ) {
    this.ldValidando = false;
  }

  ngOnInit(): void {
    this.render();
    this.usuarioActual = this.auth.getUser();

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required),
      idTipoComprobante: new FormControl(0, Validators.required),
      idSede: new FormControl(0, Validators.required),
    });
    this.formGroup.get('fechaDesde').valueChanges.subscribe((res) => {
      this.fechaDesde = this.datePipe.transform(res[0], 'dd/MM/yyyy');
    });
    this.formGroup.get('fechaHasta').valueChanges.subscribe((res) => {
      this.fechaHasta = this.datePipe.transform(res[0], 'dd/MM/yyyy');
    });
  }

  ngOnDestroy(): void {
    this.sbcCollection?.unsubscribe();
    this.sbcEmisionTicket?.unsubscribe();
    this.modalComprobanteViewRef?.close();
    this.sbcAnularComprobante?.unsubscribe();
  }

  ngAfterViewInit(): void {


    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

      dtInstance.on('select',  (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          this.selected = dtInstance.rows('.selected').data()[0];
        }
      });

      dtInstance.on('deselect', (e, dt, type, indexes ) => {
        this.selected = null ;
      });
    });


    this.obtenerTiposComprobante();
    this.obtenerSedes();
  }

  /**************************************************************************************
   * Getters
   */
  get f(): any{
    return this.formGroup.controls;
  }

  render(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        if(!this.submitted){
          callback({ data : [] });
        }else{

          const fechaDesde = this.datePipe.transform(this.f.fechaDesde.value[0], 'yyyy-MM-dd');
          const fechaHasta = this.datePipe.transform(this.f.fechaHasta.value[0], 'yyyy-MM-dd');
          const idSede = parseInt(this.f.idSede.value, 10);
          const idTipoComprobante = parseInt(this.f.idTipoComprobante.value, 10);

          this.subscription?.unsubscribe();
          this.loading = true;
          this._loading.next(true);
          this.subscription = this.api.obtenerReporteVenta(this.usuarioActual.id, idSede, idTipoComprobante, fechaDesde, fechaHasta).subscribe( (res: FacturacionReporteVenta[] | ErrorSistema) => {
            if(res instanceof ErrorSistema){
              this.collection = [];
              callback({ data : [] });
              this.utilsService.mostrarToast(res.message,'error');
            }else{
              callback({
                data : res
              });
              this.collection = res;
              console.log(res);
            }
            this.loading = false;
            this._loading.next(false);
          }, err =>  {
            callback({ data : [] });
            this.collection = [];
            this.loading = false;
            this._loading.next(false)
            console.log('Error al obtener el cronograma de citas atendidas: ', err);
            this.utilsService.mostrarToast('Error al obtener el cronograma de citas atendidas','error');
          });

        }
      },
      searching: true,
      'columnDefs': [{
        'max-width': '34px',
        'targets': 0
      }],
      columns: [
        {
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'Fecha', data: 'fecha', render: (data: Date | null) => {
            return data ? this.datePipe.transform(data,'yyyy-MM-dd') : null;
          }},
        { title: 'Local', data: 'local', visible: true, render: (data: number) => {
          return data.toString().padStart(2,'0');
        }},
        { title: 'Tipo', data: 'tipo', visible: true},
        { title: 'Serie', data: 'serie', visible: true},
        { title: 'Numero', data: 'numero', visible: true},
        { title: 'Codigo', data: 'codigo', visible: true},
        { title: 'Nombre', data: 'nombre', visible: true},
        { title: 'M', data: 'm', visible: true},
        { title: 'BaseImp', data: 'baseImp', visible: true, render: (data: number) => {
          return data.toFixed(2);
        }},
        { title: 'Exonera', data: 'exonera', visible: true},
        { title: 'Isc', data: 'isc', visible: true},
        { title: 'Impuesto', data: 'impuesto', visible: true, render: (data: number) => {
            return data.toFixed(2);
          }},
        { title: 'Total', data: 'total', visible: true, render: (data: number) => {
            return data.toFixed(2);
          }},
        { title: 'Ivap', data: 'ivap', visible: true},
        { title: 'Percepc', data: 'percepc', visible: true},
        { title: 'Servicio', data: 'servicio', visible: true},
        { title: 'Detraccion', data: 'detraccion', visible: true},
        { title: 'ICBPER', data: 'icbper', visible: true},
        { title: 'T/C', data: 'tc', visible: true},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: () => {
            return `Reporte de Ventas del ${this.fechaDesde} al ${this.fechaHasta}`;
          },
          autoFilter: true,
          sheetName: 'Data',
          exportOptions: {
            columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
          }
        },
      ],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function ( api, rowIdx, columns: any[] ) {
            const data = columns.map( x => {
              return x.hidden ?
                '<tr data-dt-row="'+x.rowIndex+'" data-dt-column="'+x.columnIndex+'">'+
                '<td><b>'+x.title+'</b></td>'+
                '<td><b>:</b></td>'+
                '<td>'+x.data+'</td>'+
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100','table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      },
      select: true,
      dom: "<'row mx-0'<'col-sm-6'l><'col-sm-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row mx-0'<'col-sm-5 py-2'i><'col-sm-7 py-2'p>>",
    };
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
    this.dataTable.ajax.reload();
    // const fechaDesde = this.datePipe.transform(this.f.fechaDesde.value[0], 'yyyy-MM-dd');
    // const fechaHasta = this.datePipe.transform(this.f.fechaHasta.value[0], 'yyyy-MM-dd');
    // const idSede = parseInt(this.f.idSede.value, 10);
    // const idTipoDocumento = parseInt(this.f.idTipoDocumento.value, 10);

  }
  evtImprimir(): void{
    this.dataTable?.button(0).trigger();
  }

  evtVerMotivo(): void{
    console.log(this.selected);
    this.modalAnularComprobanteRef = this.modalService.open(MdlMotivoAnulacionComprobanteComponent, {
      // size: 'xl mw-100 mx-md-4',
      size: 'lg w-100 max-w-600px',
      backdrop: "static",
      windowClass: 'smodal fade round popins bg-dark-30',
      keyboard: false,
      backdropClass: 'bg-transparent',
      animation: true,
      scrollable: true
    });
    this.modalAnularComprobanteRef.componentInstance.comprobante = this.selected;
  }

  reload( reset: boolean = true ): void{
    this.dataTable.ajax.reload(null,reset);
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

}
