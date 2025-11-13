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
  FacturacionReporteVenta, FacturacionReporteVentaCliente, FacturacionReporteVentaProducto
} from '../../../shared/models/facturacion/comprobante-electronico';
import {ErrorSistema} from "../../../shared/models/error-sistema";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
import {ComprobanteUnidadMedida} from "../../../shared/models/facturacion/comprobante-unidad-medida";
import {ComprobanteUnidadMedidaService} from "../../../shared/services/facturacion/comprobante-unidad-medida.service";

@Component({
  selector: 'app-comprobante-electronico-reporte-venta-producto',
  templateUrl: './comprobante-electronico-reporte-venta-producto.component.html',
  styleUrls: ['./comprobante-electronico-reporte-venta-producto.component.scss']
})
export class ComprobanteElectronicoReporteVentaProductoComponent implements OnInit, OnDestroy, AfterViewInit {

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

  /************ unidades de servicio ***************/
  ldUnidadMedida: boolean;
  sbcUnidadMedida: Subscription | undefined;
  unidadesMedida: ComprobanteUnidadMedida[] = [];

  modalAnularComprobanteRef: NgbModalRef;
  modalComprobanteViewRef: NgbModalRef;
  sbcEmisionTicket: Subscription | undefined;

  collection: FacturacionReporteVentaProducto[] = [];
  selected: FacturacionReporteVentaProducto | null = null;

  ldValidando: boolean;


  sbcAnularComprobante: Subscription | undefined;


  fechaDesde: string = '';
  fechaHasta: string = '';
  idUnidadMedida: number = 0;

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
    private unidadMedidaService: ComprobanteUnidadMedidaService
  ) {
    this.ldValidando = false;
    this.ldUnidadMedida = false;

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required),
      idUnidadMedida: new FormControl(0, Validators.required)
    });
    this.formGroup.get('fechaDesde').valueChanges.subscribe((res) => {
      this.fechaDesde = this.datePipe.transform(res[0], 'dd/MM/yyyy');
    });
    this.formGroup.get('fechaHasta').valueChanges.subscribe((res) => {
      this.fechaHasta = this.datePipe.transform(res[0], 'dd/MM/yyyy');
    });
    this.formGroup.get('idUnidadMedida').valueChanges.subscribe((res) => {
      this.idUnidadMedida = parseInt(res, 10);
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
    this.obtenerUnidadesMedida();
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
          this.subscription = this.api.obtenerReporteVentaProducto(this.usuarioActual.id, fechaDesde, fechaHasta, this.idUnidadMedida).subscribe( (res: FacturacionReporteVentaProducto[] | ErrorSistema) => {
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
      select: {
        selector: 'td:not(:first-child)'
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
        // { title: 'Cliente', data: 'cliente'},
        { title: 'Cod.Producto', data: 'idProducto'},
        { title: 'Producto', data: 'producto'},
        { title: 'Tipo', data: 'idTipoComprobante'},
        { title: 'Serie', data: 'serieComprobante'},
        { title: 'Numero', data: 'numeroComprobante'},
        { title: 'Codigo', data: 'documentoCliente'},
        { title: 'Nombre', data: 'documentoCliente', render: (data,xx,row) => row.apellidoCliente + " " + row.nombreCliente },
        { title: 'Fecha', data: 'fecha', render: (data: Date) => this.datePipe.transform(data, 'dd/MM/yyyy') },
        { title: 'Und', data: 'unidadMedida'},
        { title: 'Fact', data: 'factor'},
        { title: 'Cant', data: 'cantidad'},
        { title: 'Precio', data: 'precio', render: (data: number) => data.toFixed(2) },
        { title: 'Total', data: 'total', render: (data: number) => data.toFixed(2) },
        { title: 'M', data: 'moneda' },
        { title: 'Cajero', data: 'usuario' },
        { title: 'Caja', data: 'caja' },
        { title: 'Turno', data: 'turno' },
        { title: 'Estado', data: 'estado' },
        { title: 'Hora', data: 'fecha' , render: (data: Date) => this.datePipe.transform(data, 'hh:mm:ss')},
        { title: 'Comision', data: 'comision', render: (data: number) => data.toFixed(2) },
        { title: 'Total Comision', data: 'totalComision', render: (data: number) => data.toFixed(2) },
        { title: 'T. Igv', data: 'tipoIgv' },
      ],
      // columnDefs: [{
      //   targets: [0,1,2],
      //   visible: false
      // }],
      // order: [
      //   [0, 'asc']
      // ],
      // rowGroup: {
      //   dataSrc: ["cliente"]
      // },
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
      // select: true,
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

      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Reporte por producto');

      /**** Titulo ***/
      let data: any[] = [ '','', '', '', '', 'SEGUIMIENTO DE PRODUCTOS POR COMPROBANTES' ]
      worksheet.addRow(data);
      worksheet.getCell('F1').alignment = { vertical: 'center', horizontal: 'center' };
      worksheet.getCell('F1').font = {
        color: {argb: '0070B8'},
        size: 9,
        bold: true
      };
      /**** Fecha ***/
      data = [ `FECHA INICIO ${this.fechaDesde}`,'','',`FECHA FIN ${this.fechaHasta}` ]
      worksheet.addRow(data);
      // worksheet.mergeCells('A2:C2');
      // worksheet.mergeCells('D2:E2');
      /**** Cabeceras ***/
      data = [
        'Producto',
        'Tipo',
        'Serie',
        'Numero',
        'Codigo',
        'Nombre',
        'Fecha',
        'Producto',
        'Descripcion',
        'Und',
        'Fact',
        'Cant',
        'Precio',
        'Total',
        'M',
        'Cajero',
        'Caja',
        'Turno',
        'Estado',
        'Hora',
        'Comision',
        'Total Comision',
        'T. Igv'
      ];
      const cabecera = worksheet.addRow(data);
      cabecera.eachCell((cell, colNumber) => {
        cell.font = {bold:true, size: 9};
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
      const ubicacionNombreProductos: number[] = [];

      const key = 'idProducto';
      const productos = [...new Map(this.collection.map(item => [item[key], item])).values()];
      productos.forEach(p => {
        numCell++;

        // agregar el nombre del cliente
        data = [ p.idProducto,	`${p.producto}`];
        ubicacionNombreProductos.push(numCell);
        const producto = worksheet.addRow(data);
        // worksheet.mergeCells(`B${numCell}`,`F${numCell}`);
        producto.eachCell((cell, colNumber) => {
          cell.font = {
            bold:true,
            color: {argb: '3E5F8A'},
            size: 9
          }
        });

        // ventas cliente
        const ventasProducto = this.collection.filter(v => v.idProducto === p.idProducto);
        ventasProducto.forEach((vp: FacturacionReporteVentaProducto, i: number) => {
          numCell++;
          data = [
            null,
            vp.idTipoComprobante,
            vp.serieComprobante,
            vp.numeroComprobante,
            vp.documentoCliente,
            `${vp.apellidoCliente} ${vp.nombreCliente}`,
            this.datePipe.transform(vp.fecha,'dd/MM/yyyy'),
            vp.idProducto,
            vp.producto,
            vp.unidadMedida,
            vp.factor,
            vp.cantidad,
            vp.precio,
            vp.total,
            vp.moneda,
            vp.usuario,
            vp.caja,
            vp.turno,
            vp.estado,
            this.datePipe.transform(vp.fecha,'hh:mm:ss'),
            vp.comision,
            vp.totalComision,
            vp.tipoIgv
          ];
          const ventaProducto = worksheet.addRow(data);
          ventaProducto.eachCell((cell, colNumber) => {
            cell.font = {
              size: 9
            }
          });
          worksheet.getCell(`K${numCell}`).numFmt = '0';
          worksheet.getCell(`L${numCell}`).numFmt = '0';
          worksheet.getCell(`M${numCell}`).numFmt = '#,##0.00';
          worksheet.getCell(`N${numCell}`).numFmt = '#,##0.00';
          worksheet.getCell(`U${numCell}`).numFmt = '#,##0.00';
          worksheet.getCell(`V${numCell}`).numFmt = '#,##0.00';

          // if(i === (ventasProducto.length - 1)){
          //   numCell++;
          //   data = [ '',	'',	'',	'',	'',	ventasCliente.map(x => x.cantidad).reduce((a,b) => a +b, 0),	ventasCliente.map(x => x.total).reduce((a,b) => a +b, 0),ventasCliente.map(x => x.costo).reduce((a,b) => a +b, 0),	ventasCliente.map(x => x.ganancia).reduce((a,b) => a +b, 0),	[ ...new Set(ventasCliente.map(x => x.moneda))][0] ];
          //   const totalVentaCliente = worksheet.addRow(data);
          //   totalVentaCliente.font = {bold:true};
          //   worksheet.getCell(`E${numCell}`).numFmt = '0';
          //   worksheet.getCell(`F${numCell}`).numFmt = '0';
          //   worksheet.getCell(`G${numCell}`).numFmt = '#,##0.00';
          //   worksheet.getCell(`H${numCell}`).numFmt = '#,##0.00';
          //   worksheet.getCell(`I${numCell}`).numFmt = '#,##0.00';
          // }
        });

      });

      // numCell++;
      // data = [ '',	'',	'',	'',	'',	'',	'',	'',	'',	''];
      // worksheet.addRow(data);
      //
      // numCell++;
      // data = [ 'Gran Total S/',	'',	'',	'',	'',	this.collection.map(x => x.cantidad).reduce((a,b) => a +b, 0),	this.collection.map(x => x.total).reduce((a,b) => a +b, 0), this.collection.map(x => x.costo).reduce((a,b) => a +b, 0),	this.collection.map(x => x.ganancia).reduce((a,b) => a +b, 0),	'' ];
      // const totalVentaCliente = worksheet.addRow(data);
      // worksheet.getCell(`E${numCell}`).numFmt = '0';
      // worksheet.getCell(`F${numCell}`).numFmt = '0';
      // worksheet.getCell(`G${numCell}`).numFmt = '#,##0.00';
      // worksheet.getCell(`H${numCell}`).numFmt = '#,##0.00';
      // worksheet.getCell(`I${numCell}`).numFmt = '#,##0.00';
      // worksheet.mergeCells(`A${numCell}:E${numCell}`);
      // worksheet.getCell(`A${numCell}`).alignment = { vertical: 'center', horizontal: 'right' };
      // totalVentaCliente.eachCell((cell, colNumber) => {
      //   cell.font = {bold:true};
      //   cell.fill = {
      //     type: 'pattern',
      //     pattern:'solid',
      //     fgColor:{argb:'F8F335'}
      //   };
      // });


      worksheet.columns.forEach(function (column, i) {
        if(i!==0)
        {
          var maxLength = 0;
          column["eachCell"]({ includeEmpty: true }, function (cell) {
            console.log('celda', cell.model);
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
              maxLength = columnLength;
            }
          });
          column.width = maxLength < 10 ? 10 : maxLength;
        }
      });

      worksheet.mergeCells('A2:B2');
      worksheet.mergeCells('D2:F2');
      ubicacionNombreProductos.forEach(x => {
        worksheet.mergeCells(`B${x}`,`F${x}`);
      });

      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss' ) + " - Ventas por producto del "+ this.fechaDesde +" al " + this.fechaHasta + ".xlsx");
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
  obtenerUnidadesMedida(): void{
    this.ldUnidadMedida = true;
    this.sbcUnidadMedida = this.unidadMedidaService.listar(this.auth.getUser().id).subscribe((res: ComprobanteUnidadMedida[] | ErrorSistema) => {
      if(res instanceof  ErrorSistema){
        this.utilsService.mostrarToast(res.message, 'error');
      }else{
        this.unidadesMedida = res;
      }
      this.ldUnidadMedida = false;
    }, error => {
      console.log(error);
      this.ldUnidadMedida = false
    });
  }

}
