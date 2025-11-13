import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UtilsService } from '../../../../shared/services/funciones/utils.service';
import { ColorEstadoCita } from '../../../../shared/enumeracion/enums';
import { CitaClass } from '../../../../shared/models/cita';
import { CitaService } from '../../../../shared/services/cita.service';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-tabla-cliente-perfil-global',
  templateUrl: './tabla-cliente-perfil-global.component.html',
  styleUrls: ['./tabla-cliente-perfil-global.component.scss']
})
export class TablaClientePerfilGlobalComponent implements OnInit, OnChanges, OnDestroy {

  dtOptionsTableCitasPendientes: any = {};
  citasResumen: any = [];

  @Input() idCliente: number;
  @Input() idServicio: number;
  @Input() estadoDeCita: string;
  
  subscriptionCitas: Subscription;
  @Output() citaSelectedChange = new  EventEmitter<CitaClass | null>();
  @Output() subscriptionCitasChange = new EventEmitter<Subscription>();
  @Output() abrirModalCitaSelected = new EventEmitter<CitaClass[]>();

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private utilService: UtilsService,
    private citaService: CitaService,

    private route: ActivatedRoute,
  ) { }

  ngOnDestroy(): void {
    this.subscriptionCitas?.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.configurarOpcionesTabla();
    if (this.dtElement?.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();

        this.configurarOpcionesTabla();
        this.dtTrigger.next();
      });
    } else {
      setTimeout(() => {
        this.configurarOpcionesTabla();
        this.dtTrigger.next();
      }, 500);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idServicio'] && !changes['idServicio'].firstChange) {
  
      if (this.dtElement?.dtInstance) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
  
          this.configurarOpcionesTabla();
          this.dtTrigger.next();
        });
      } else {
        // En caso de que aún no esté lista la tabla, esperar un poco y volver a intentar
        setTimeout(() => {
          this.configurarOpcionesTabla();
          this.dtTrigger.next();
        }, 500);
      }
    }
  }

  configurarOpcionesTabla(): void{

    this.dtOptionsTableCitasPendientes = {
      ajax: (dataTablesParameters: any, callback) => {
        //  Obtiene el listado de citas del cliente
        // this.loadingCitas = true;

        this.subscriptionCitas = this.citaService.obtenerParaPerfilByServicio(this.idCliente, this.idServicio).subscribe(
          (resultado: CitaClass[]) => {
            let data: CitaClass[] = []

            this.citasResumen = resultado;
            if(this.estadoDeCita === 'Pendiente'){
              data = this.citasResumen.filter(x => x.estado.nombre != 'Atendida' && x.estado.nombre != 'Pagado');
            }

            if(this.estadoDeCita === 'Atendida'){
              data = this.citasResumen.filter(x => x.estado.nombre == 'Atendida' || x.estado.nombre == 'Pagado');
            }

            callback({ data });
          },
          error => {
            console.log('Error al obtener el historial del cliente', error);

            callback([]);
          }, () => {
            // this.loadingCitas = false;
          }
        );
      },
      serverSide: false,
      processing: false,
      pageLength: 5,
      async: true,
      autoWidth: false,
      responsive: {
        details: {
          renderer: ( api, rowIdx, columns: any[] ) => {
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
      order:[],
      "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todo"]],
      language: this.utilService.datatableIdioma,
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click',() => {
          // this.citaSelected = null;
          this.citaSelectedChange.emit(null); 
        });
        $('td:not(:eq(0))', row).on('click', () => {
          // this.citaSelected = data;
          this.citaSelectedChange.emit(data); 
          // this.mostrarModalOpciones(this.mdlOpcionesCitas, data);
          this.abrirModalCitaSelected.emit(data);
        });
        return row;
      },
      select: false,
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
        { title: 'Id', data: 'id', width: '4%', visible: false   },
        { title: 'Cita', data: 'numeroCita', width: '100px'},
        { title: 'Fecha', data: 'fechaCita', width: '100px', render: (data) => {
            return this.utilService.formato_FechaString(data);
          }},
        { title: 'Hora', data: 'hora', width: '100px'},
        { title: 'Resumen', data: 'resumen', width: '500px', className: 'ws-normal'},
        { title: 'Tipo', data: 'tipoCita', width: 'auto', render: function(data){
            return data.nombre;
          }},
        { title: 'Servicio', data: 'servicio', width: 'auto'},
        { title: 'Estado Pago', data: 'pagado', width: '100px', render: function(data){
            return data ? 'PAGADO' : 'NO PAGADO'
          }},
        { title: 'Estado Cita', data: 'estado', width: '150px', render: function(data,type,row){
            return `<span class="rounded px-2 text-uppercase small py-1 text-white" style="background-color:${ColorEstadoCita.find(c => c.index === row.estado?.id)?.value}">${data?.nombre}</span>`;
          }},
        { title: 'Sede', data: 'sede', width: '150px', render: function(data){
            return data.nombre;
          },visible: true }
      ]
    }
  }

  obtenerServicioPorQueryParaTabla(){
    this.route.queryParams.subscribe(params => {
      if(params['idServicio']) {
        this.idServicio = +params['idServicio'];
      }
    });
  }

  
}
