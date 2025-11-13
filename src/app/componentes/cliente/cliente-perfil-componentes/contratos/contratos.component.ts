import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {ClienteContrato} from "../../../../shared/models/cliente-contrato";
import {ClienteContratoService} from "../../../../shared/services/cliente-contrato.service";
import {Subscription} from "rxjs";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import Api = DataTables.Api;
import {DataTableDirective} from "angular-datatables";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() IdCliente: number;
  @Input() IdServicio: number = 1;
  @Output() onShowOptions = new EventEmitter<ClienteContrato>();
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  @Input() TipoServicio: string = '';

  loading = false;
  optionDataTable: any = {};
  subscription: Subscription;
  datatableContratos: Api;
  contratoSelected: ClienteContrato | null;
  dataTable: any;

  constructor(
    private clienteContratoService: ClienteContratoService,
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

        this.subscription = this.clienteContratoService.listarByClientePorServicio( this.IdCliente, this.IdServicio ).subscribe((data: ClienteContrato[]) => {
          callback({ data });
          //console.log(data);
          //this.contratoSource.data = data;
        }, err =>{
          console.log('Error al obtener los contratos del cliente', err);
          callback([]);
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
        'max-width': '34px',
        'targets': 0
      }],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
          this.contratoSelected = data;
          this.onShowOptions.emit(this.contratoSelected);
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
        { title: 'Id', data: 'id', render: (data) => {
            return 'CTT-' + data.toString().padStart(8,'0');
          }},
        { title: 'Confirmado', width: "90px", data: 'confirmado', bSortable: true, className: 'align-middle',
          render: (data: number) => { return (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">SI</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">NO</span>'; } },
        { title: 'Estado', width: "90px", data: 'idEstado', bSortable: true, className: 'align-middle',
          render: (data: number) => { return (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">ANULADO</span>'; } },
        { title: 'Fecha', data: 'fechaRegistro', render: (data) => {
            return this.utilService.formato_FechaString(data);
          }, width: '90px'},
        { title: 'Hora', data: 'fechaRegistro', render: (data) => {
            return this.utilService.formato_hora_hms(data);
          }, width: '90px'},
        { title: 'Documentos', data: 'listaDocumentos', render: (data) => {
            return data;
          }, width: '90px'},
        { title: 'Email Enviado', data: 'emailEnviado', className: 'text-center', render: (data) => {
            return data ? '<span class="small theme-bg text-white p-1 estado rounded">SI</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">NO</span>';
          }, width: '100'},
        { title: 'Usuario Registro', data: 'usuarioRegistro',width: '150'},
        { title: 'F. Confirmo', data: 'fechaConfirmo', render: (data: Date) => {
            return this.datePipe.transform(data, 'dd-MM-yyyy HH:mm a');
        }}
      ]
    }
  }

  reload( reset: boolean = true): void{
    this.dataTable.ajax.reload( null, reset );
  }


}
