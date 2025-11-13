import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {DatePipe} from "@angular/common";
import {FacturaSerie} from "../../../shared/models/factura-serie";
import {FacturaSerieService} from "../../../shared/services/factura-serie.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import Api = DataTables.Api;

@Component({
  selector: 'tbl-factura-serie',
  templateUrl: './tbl-factura-serie.component.html',
  styleUrls: ['./tbl-factura-serie.component.scss']
})
export class TblFacturaSerieComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  loading = false;
  optionDataTable: any = {};
  subscription: Subscription;
  datatableContratos: Api;
  selected = new Subject<FacturaSerie | null>();
  dataTable: any;

  constructor(
    private api: FacturaSerieService,
    private utilService: UtilsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.initValues();
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.dataTable = dtInstance;

      dtInstance.on('deselect',  (e, dt, type, indexes ) => {
        this.selected.next(null);
      });

      dtInstance.on('select',  (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          this.selected.next( dtInstance.rows('.selected').data()[0] );
        }
      });

    });



  }

  initValues(): void{
    this.optionDataTable = {
      //mark: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.loading = true;

        this.subscription = this.api.listar(  ).subscribe((data: FacturaSerie[]) => {

          if( data instanceof  ErrorSistema){
            this.utilService.mostrarToast(data.message,'error');
            callback([]);
          }else{
            callback({ data : data });
          }
          // console.log('documentos',data);
        }, err =>{
          console.log('Error al obtener las series de facturación', err);
          callback([]);
          this.utilService.mostrarToast('Ocurrio un error','warning');
        }, () => {
          this.loading = false;
        });

      },
      dom: '<"mb-3 d-flex"><"mb-3 d-flex"l>r<"table-responsive"t>ip',
      serverSide: false,
      processing: true,
      pageLength: 5,
      async: true,
      "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todo"]],
      language: this.utilService.datatableIdioma,
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
      select: {
        selector: 'td:not(:first-child)'
      },
      searching: false,
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
        { title: 'Serie', data: 'serie' },
        { title: 'Sede', data: 'sede' },
        { title: 'Estado', width: "90px", data: 'idEstado', bSortable: true, className: 'align-middle',
          render: (data: number) => { return (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">ANULADO</span>'; } },
        { title: 'F. Registro', data: 'fechaRegistro', render: (data) => {
            return this.datePipe.transform(data,'dd-MM-yyyy');
          }, width: '90px'},
        { title: 'F. Modifico', data: 'fechaModifico', render: (data) => {
            return this.datePipe.transform(data,'dd-MM-yyyy');
          }, width: '90px'},
        { title: 'U. Registro', data: 'usuarioRegistro',width: '150'},
        { title: 'U. Modifico', data: 'usuarioModifico',width: '150'},
      ]
    }
  }

  reload( reset: boolean = true ): void{
    this.dataTable.ajax.reload(null,reset);
  }


}
