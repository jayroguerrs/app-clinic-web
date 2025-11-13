import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import Api = DataTables.Api;
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {EvolucionTratamientoService} from "../../../../shared/services/evolucion-tratamiento.service";
import {EvolucionTratamiento} from "../../../../shared/models/evolucion-tratamiento";

@Component({
  selector: 'app-evolucion-tratamiento',
  templateUrl: './evolucion-tratamiento.component.html',
  styleUrls: ['./evolucion-tratamiento.component.scss']
})
export class EvolucionTratamientoComponent implements OnInit {

  @Input() IdCliente: number;
  @Output() onShowOptions = new EventEmitter<EvolucionTratamiento>();
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;


  loading = false;
  optionDataTable: any = {};
  subscription: Subscription;
  datatableContratos: Api;
  evolucionTratamientoSelected: EvolucionTratamiento | null;
  dataTable: any;

  constructor(
    private utilService: UtilsService,
    private evolucionTratamientoService: EvolucionTratamientoService
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

        this.subscription = this.evolucionTratamientoService.obtenerListadoByIdCliente( this.IdCliente ).subscribe((data) => {
          callback({ data: data });
        }, err =>{
          console.log('Error al obtener la evolución del tratamiento de depilación laser del cliente', err);
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
          this.evolucionTratamientoSelected = data;
          this.onShowOptions.emit(this.evolucionTratamientoSelected);
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
            return 'EVT-' + data.toString().padStart(6,'0');
          },width: '90px'},
        {title: 'Cita', data: 'idCita', render: (data, full) => {
            return `<a href="Cita/${data}/1/${this.IdCliente}/0" target="_blank" onClick="event.stopPropagation();" class="rounded-pill border cita-view" title="Ver cita"><span class="mdi mdi-calendar-outline"></span>CI-` + data.toString().padStart(6,'0') + '</a>';
          },width: '90px'},
        { title: 'Fecha', data: 'fechaRegistro', render: (data) => {
            return this.utilService.formato_FechaString(data);
          }, width: '90px'},
        { title: 'Atendido por', data: 'usuarioAtendio'},
        { title: 'Usuario Registro', data: 'usuarioRegistro',width: '200px'}
      ]
    }
  }

  reload( reset: boolean = true ): void{
    this.dataTable.ajax.reload( null, reset );
  }

}
