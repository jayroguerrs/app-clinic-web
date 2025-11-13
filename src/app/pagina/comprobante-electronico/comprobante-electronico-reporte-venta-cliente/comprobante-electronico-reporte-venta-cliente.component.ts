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
import {
  FacturacionReportePago,
  FacturacionReporteVenta, FacturacionReporteVentaCliente
} from '../../../shared/models/facturacion/comprobante-electronico';
import {ErrorSistema} from "../../../shared/models/error-sistema";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';

@Component({
  selector: 'app-comprobante-electronico-reporte-venta-cliente',
  templateUrl: './comprobante-electronico-reporte-venta-cliente.component.html',
  styleUrls: ['./comprobante-electronico-reporte-venta-cliente.component.scss']
})
export class ComprobanteElectronicoReporteVentaClienteComponent implements OnInit, OnDestroy, AfterViewInit {

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

  collection: FacturacionReporteVentaCliente[] = [];
  selected: FacturacionReporteVentaCliente | null = null;

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
    private empresaService: EmpresaService,
    private numeroALetras: NumeroALetras,
  ) {
    this.ldValidando = false;

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required)
    });
    this.formGroup.get('fechaDesde').valueChanges.subscribe((res) => {
      this.fechaDesde = this.datePipe.transform(res[0], 'dd/MM/yyyy');
    });
    this.formGroup.get('fechaHasta').valueChanges.subscribe((res) => {
      this.fechaHasta = this.datePipe.transform(res[0], 'dd/MM/yyyy');
    });
  }

  ngOnInit(): void {
    this.render();
    this.usuarioActual = this.auth.getUser();
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
    return this.formGroup?.controls;
  }

  getTitle(): string{
    const fechaDesde = this.f.fechaDesde.value ? this.datePipe.transform(this.f.fechaDesde.value[0], 'dd-MM-yyyy') : '';
    const fechaHasta = this.f.fechaHasta.value ? this.datePipe.transform(this.f.fechaHasta.value[0], 'dd-MM-yyyy') : '';
    return `reporte-pago del ${fechaDesde} al ${fechaHasta}`;
  }


  render(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        if(!this.submitted){
          callback({ data : [] });
        }else{

          const fechaDesde = this.datePipe.transform(this.f.fechaDesde.value[0], 'yyyy-MM-dd');
          const fechaHasta = this.datePipe.transform(this.f.fechaHasta.value[0], 'yyyy-MM-dd');

          this.subscription?.unsubscribe();
          this.loading = true;
          this._loading.next(true);
          this.subscription = this.api.obtenerReporteVentaCliente(this.usuarioActual.id, fechaDesde, fechaHasta).subscribe( (res: FacturacionReporteVentaCliente[] | ErrorSistema) => {
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
            console.log('Error al obtener el reporte: ', err);
            this.utilsService.mostrarToast('Error al obtener el reporte','error');
          });

        }
      },
      searching: true,
      columns: [
        {
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        // { title: 'Cliente', data: 'cliente'},
        { title: 'Codigo', data: 'documentoCliente'},
        { title: 'Cliente', data: 'nombreCliente', render: (data,xx,row) => {
          return row.nombreCliente + " " + row.apellidoCliente;
          }},
        { title: 'Cod.Producto', data: 'idProducto'},
        { title: 'Descripcion', data: 'producto'},
        { title: 'Und', data: 'unidad'},
        { title: 'Factor', data: 'factor'},
        { title: 'Cantidad', data: 'cantidad'},
        { title: 'Total', data: 'total', render: (data: number) => data.toFixed(2), className: 'text-right'},
        { title: 'Costo', data: 'costo', render: (data: number) => data.toFixed(2), className: 'text-right'},
        { title: 'Ganancia', data: 'ganancia', render: (data: number) => data.toFixed(2), className: 'text-right'},
        { title: 'Moneda', data: 'moneda'},
      ],
      'columnDefs': [{
        'max-width': '34px',
        'targets': 0
      }],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: () => {
            return `Ventas por clientes del ${this.fechaDesde} al ${this.fechaHasta}`;
          },
          autoFilter: true,
          sheetName: 'Data',
          // exportOptions: {
          //   columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
          // }
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
  evtExportar(): void{

    if(this.collection.length){
      const title = 'Ventas por clietne';

      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Reporte por clientes',{
        views: [{ state: "frozen", ySplit: 3 }],
      });

      /**** Titulo ***/
      let data: any[] = [ '','','VENTAS POR CLIENTE', '','','','','','','' ];
      worksheet.addRow(data);
      worksheet.mergeCells('C1:F1');
      worksheet.getCell('C1').alignment = { vertical: 'center', horizontal: 'center' };
      worksheet.getCell('C1').font = {
        color: {argb: '0070B8'},
        size: 14,
        bold: true
      };
      /**** Fecha ***/
      data = [ `FECHA INICIO ${this.fechaDesde}`,'',`FECHA FIN ${this.fechaHasta}`,'','','','','','','' ]
      worksheet.addRow(data);
      worksheet.mergeCells('A2:B2');
      worksheet.mergeCells('C2:D2');
      /**** Cabeceras ***/
      data = [ 'Codigo',	'Cod.Producto',	'Descripcion',	'Und',	'Factor',	'Cantidad',	'Total',	'Costo',	'Ganancia',	'Moneda'];
      const cabecera = worksheet.addRow(data);
      cabecera.eachCell((cell, colNumber) => {
        cell.font = {bold:true};
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'C0C0FA'}
        };
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });

      let numCell = 3;

      const key = 'idCliente';
      const clientes = [...new Map(this.collection.map(item => [item[key], item])).values()];
      clientes.forEach(c => {
        numCell++;

        // agregar el nombre del cliente
        data = [ c.documentoCliente,	`${c.apellidoCliente} ${c.nombreCliente}`,'','','','','','','',''];
        const cliente = worksheet.addRow(data);
        worksheet.mergeCells(`B${numCell}`,`C${numCell}`);
        cliente.eachCell((cell, colNumber) => {
          cell.font = {
            bold:true,
            color: {argb: '3E5F8A'},
          }
        });

        // ventas cliente
        const ventasCliente = this.collection.filter(v => v.idCliente === c.idCliente);
        ventasCliente.forEach((vc: FacturacionReporteVentaCliente, i: number) => {
          numCell++;
          data = [ c.documentoCliente,	vc.idProducto.toString(),	vc.producto,	vc.unidad,	vc.factor,	vc.cantidad,	vc.total,	vc.costo,	vc.ganancia,	vc.moneda];
          const ventaCliente = worksheet.addRow(data);
          worksheet.getCell(`E${numCell}`).numFmt = '0';
          worksheet.getCell(`F${numCell}`).numFmt = '0';
          worksheet.getCell(`G${numCell}`).numFmt = '#,##0.00';
          worksheet.getCell(`H${numCell}`).numFmt = '#,##0.00';
          worksheet.getCell(`I${numCell}`).numFmt = '#,##0.00';

          if(i === (ventasCliente.length - 1)){
            numCell++;
            data = [ '',	'',	'',	'',	'',	ventasCliente.map(x => x.cantidad).reduce((a,b) => a +b, 0),	ventasCliente.map(x => x.total).reduce((a,b) => a +b, 0),ventasCliente.map(x => x.costo).reduce((a,b) => a +b, 0),	ventasCliente.map(x => x.ganancia).reduce((a,b) => a +b, 0),	[ ...new Set(ventasCliente.map(x => x.moneda))][0] ];
            const totalVentaCliente = worksheet.addRow(data);
            totalVentaCliente.font = {bold:true};
            worksheet.getCell(`E${numCell}`).numFmt = '0';
            worksheet.getCell(`F${numCell}`).numFmt = '0';
            worksheet.getCell(`G${numCell}`).numFmt = '#,##0.00';
            worksheet.getCell(`H${numCell}`).numFmt = '#,##0.00';
            worksheet.getCell(`I${numCell}`).numFmt = '#,##0.00';
          }
        });

      });

      numCell++;
      data = [ '',	'',	'',	'',	'',	'',	'',	'',	'',	''];
      worksheet.addRow(data);

      numCell++;
      data = [ 'Gran Total S/',	'',	'',	'',	'',	this.collection.map(x => x.cantidad).reduce((a,b) => a +b, 0),	this.collection.map(x => x.total).reduce((a,b) => a +b, 0), this.collection.map(x => x.costo).reduce((a,b) => a +b, 0),	this.collection.map(x => x.ganancia).reduce((a,b) => a +b, 0),	'' ];
      const totalVentaCliente = worksheet.addRow(data);
      worksheet.getCell(`E${numCell}`).numFmt = '0';
      worksheet.getCell(`F${numCell}`).numFmt = '0';
      worksheet.getCell(`G${numCell}`).numFmt = '#,##0.00';
      worksheet.getCell(`H${numCell}`).numFmt = '#,##0.00';
      worksheet.getCell(`I${numCell}`).numFmt = '#,##0.00';
      worksheet.mergeCells(`A${numCell}:E${numCell}`);
      worksheet.getCell(`A${numCell}`).alignment = { vertical: 'center', horizontal: 'right' };
      totalVentaCliente.eachCell((cell, colNumber) => {
        cell.font = {bold:true};
        cell.fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'F8F335'}
        };
      });


      worksheet.columns.forEach(function (column, i) {
        if(i!==0)
        {
          var maxLength = 0;
          column["eachCell"]({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
              maxLength = columnLength;
            }
          });
          column.width = maxLength < 10 ? 10 : maxLength;
        }
      });

      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss' ) + " - Ventas por cliente del "+ this.fechaDesde +" al " + this.fechaHasta + ".xlsx");
      });
    }

    // this.dataTable?.button(0).trigger();
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
