import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription } from 'rxjs';
import {ClienteIncidenciaService} from "../../../shared/services/cliente-incidencia.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DataTableDirective} from "angular-datatables";
import {NgxSpinnerService} from "ngx-spinner";
import { DatePipe } from '@angular/common';
import {ClienteIncidencia} from "../../../shared/models/cliente-incidencia";

@Component({
  selector: 'app-incidencia-tabla',
  templateUrl: './incidencia-tabla.component.html',
  styleUrls: ['./incidencia-tabla.component.scss']
})
export class IncidenciaTablaComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() idSede: number = 0;
  @Input() fechaDesde: string | null = null;
  @Input() fechaHasta: string | null = null;
  @Input() Sede: string = 'Todos';

  dtResponsiveOptions: any;
  sbcCollection: Subscription;
  selected = new BehaviorSubject<boolean>(false);
  collection = new BehaviorSubject<ClienteIncidencia[]>([]);
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  private dataTable: any;

  constructor(
    private api: ClienteIncidenciaService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.buildTable();
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
      dtInstance.on('select', (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          this.selected.next(data);
        }
      });
      dtInstance.on('deselect', (e, dt, type, indexes ) => {
        this.selected.next(null);
      });
    });
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.fechaDesde && this.fechaHasta){
      this.buildTable();
    }
  }

  buildTable(): void{
    this.dtResponsiveOptions = {
      ajax: (_dataTablesParameters: any, callback) => {
        this.spinner.show();
        this.sbcCollection = this.api.collection(this.idSede, this.fechaDesde, this.fechaHasta).subscribe(
          (data: ClienteIncidencia[]) => {
            this.collection.next(data);
            callback({ data });
          },
          error => {
            console.log(error);
            callback({ data : [] });
            this.spinner.hide();
          }, () => {
            this.spinner.hide();
          }
        )
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
        { title: 'ID', data: 'id', visible: false, bSortable: false, className: 'align-middle' },
        { title: 'CLIENTE', data: 'cliente' , bSortable: true, className: 'align-middle', render: (data: any, type, row) => {
            return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
          }},
        { title: 'CITA', data: 'idCita' , bSortable: true, className: 'align-middle', render: (data: any, type, row) =>{
            return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0' target='_blank''>${ data }</a>`;
          }},
        { title: 'DESCRIPCION', data: 'descripcion', bSortable: true, className: 'align-middle'},
        { title: 'SEDE', data: 'sede', bSortable: true, className: 'align-middle'},
        { title: 'USU. REG', data: 'usuarioRegistro',  bSortable: true, className: 'align-middle' },
        { title: 'FECH. REG', data: 'fechaRegistro', className: 'align-middle', render: (data: Date | null) =>{
           return data ? this.datePipe.transform(data,'dd-MM-yyyy') : null;
          }},
        { title: 'USU. MOD', data: 'usuarioModifico',  bSortable: true, className: 'align-middle' },
        { title: 'FECH. MOD', data: 'fechaModifico', className: 'align-middle', render: (data: Date | null) =>{
            return data ? this.datePipe.transform(data,'dd-MM-yyyy') : null;
          }  },
      ],
      serverSide: false,
      processing: false,
      async: true,
      order: [],
      aaSorting: [],
      buttons: [
        {
          extend: 'excelHtml5',
          title: () => {
            return this.getExportFileName();
          },
          /*          // exportOptions: {
                    //   columns: [ 1,2,3,4,5,6,7,8 ]
                    // },*/
          //autoFilter: true
        }
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
      pageLength: 10,
      "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]]
    };
  }

  reload(): void{
    this.dataTable.ajax.reload();
  }

  export(): void{
    this.dataTable.button(0).trigger();
  }

  getExportFileName(): string{
    return `Reporte de incidencias desde ${this.fechaDesde} hasta ${this.fechaHasta} (Sede - ${this.Sede})`;
  }

}
