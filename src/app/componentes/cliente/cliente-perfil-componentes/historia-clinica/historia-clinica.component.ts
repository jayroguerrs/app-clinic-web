import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import Api = DataTables.Api;
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {HistoriaClinicaService} from "../../../../shared/services/historia-clinica.service";
import {HistoriaClinicaCliente} from "../../../../shared/models/historia-clinica";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() IdCliente: number;
  @Output() onShowOptions = new EventEmitter<HistoriaClinicaCliente>();
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;


  loading = false;
  optionDataTable: any = {};
  subscription: Subscription;
  datatableContratos: Api;
  historiaSelected: HistoriaClinicaCliente | null;
  dataTable: any;

  constructor(
    private historiaClinicaService: HistoriaClinicaService,
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
    });

    this.dtElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
    });
  }

  initValues(): void{
    this.optionDataTable = {
      ajax: (dataTablesParameters: any, callback) => {
        this.loading = true;

        this.subscription = this.historiaClinicaService.obtenerListadoByIdCliente( this.IdCliente ).subscribe((data) => {
          callback({ data });
        }, err =>{
          console.log('Error al obtener la historia clínica', err);
          callback([]);
          this.loading = false;
          this.utilService.mostrarToast('Ocurrio un error','warning');
        }, () => {
          this.loading = false;
        });

      },
      //dom: '<"mb-3 d-flex"><"mb-3 d-flex"l>r<"table-responsive"t>ip',
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
        'width': '34px',
        'targets': 0
      }],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
          this.historiaSelected = data;
          this.onShowOptions.emit(this.historiaSelected);
          //this.mostrarContratoOpciones(this.modalOpcionesContratos);
        });
        return row;
      },
      columns: [
        {
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: '#', width: "5%", data: 'id', bSortable: true, className: 'align-middle',
          render: (data: number) => { return 'Ficha #' + data.toString().padStart(8,'0') } },
        { title: 'F. Registro', data: 'fechaRegistro', render: (data) => {
            return this.datePipe.transform(data,'dd-MM-yyyy');
          }, width: '100'},
        { title: 'U. Registro', data: 'usuarioRegistro', render: (data : string | null) => {
            return data ? data : 'Cliente';
          }, width: '100'},
        { title: 'F. Modifico', data: 'fechaModifico', render: (data : Date | null) => {
            return data ? this.datePipe.transform(data,'dd-MM-yyyy') : null;
          }, width: '100'},
        { title: 'U. Modifico', data: 'usuarioModifico',width: '150'},
      ]
    }
  }

  reload(reset: boolean = true): void{
    this.dataTable.ajax.reload(null,reset);
  }

}
