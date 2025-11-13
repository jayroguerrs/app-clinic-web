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
import {Subscription} from "rxjs";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import Api = DataTables.Api;
import {DataTableDirective} from "angular-datatables";
import {DocumentoCLiente} from 'src/app/shared/models/documento';
import {DatePipe} from "@angular/common";
import {ClienteDocumentoService} from "../../../../shared/services/cliente-documento.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";

@Component({
  selector: 'app-documentos-cliente',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() IdCliente: number;
  @Input() IdServicio: number = 1;
  @Input() Status: number = 1;
  @Output() onShowOptions = new EventEmitter<DocumentoCLiente>();
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  @Input() tipoServicio: string = '';

  loading = false;
  optionDataTable: any = {};
  subscription: Subscription;
  datatableContratos: Api;
  documentoSelected: DocumentoCLiente | null;
  dataTable: any;

  constructor(
    private documentoClienteService: ClienteDocumentoService,
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
      //mark: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.loading = true;

        this.subscription = this.documentoClienteService.collectionByClientByService( this.IdCliente, this.IdServicio ).subscribe((data) => {
          if( data instanceof  ErrorSistema){
            this.utilService.mostrarToast(data.message,'error');
            callback([]);
          }else{
            callback({ data : data.filter( d => d.idEstado === this.Status ) });
          }
          // console.log('documentos',data);
        }, err =>{
          console.log('Error al obtener los contratos del cliente', err);
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
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
          this.documentoSelected = data;
          this.onShowOptions.emit(this.documentoSelected);
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
            return 'D-' + data.toString().padStart(8,'0');
          }},
        { title: 'DOCUMENTO', data: 'nombreDocumento', className: 'all' },
        { title: 'Confirmado', width: "90px", data: 'confirmado', bSortable: true, className: 'align-middle',
          render: (data: number) => { return (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">SI</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">NO</span>'; } },
        { title: 'Estado', width: "90px", data: 'idEstado', bSortable: true, className: 'align-middle',
          render: (data: number) => { return (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">ANULADO</span>'; } },
        { title: 'Fecha', data: 'fechaRegistra', render: (data) => {
            return this.datePipe.transform(data,'dd-MM-yyyy');
          }, width: '90px'},
        { title: 'Hora', data: 'fechaRegistra', render: (data) => {
            return this.datePipe.transform(data, 'hh:mm:ss');
          }, width: '90px'},
        { title: 'Zonas', data: 'listaZonas', className: 'text-center', width: '100'},
        { title: 'Email Enviado', data: 'emailEnviado', className: 'text-center', render: (data) => {
            return data ? '<span class="small theme-bg text-white p-1 estado rounded">SI</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">NO</span>';
          }, width: '100'},
        { title: 'Usuario Registro', data: 'usuarioRegistro',width: '150'},
      ]
    }
  }

  reload( reset: boolean = true ): void{
    this.dataTable.ajax.reload(null,reset);
  }


}
