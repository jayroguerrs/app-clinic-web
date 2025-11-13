import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Input, ViewChild
} from '@angular/core';


import { DatePipe } from '@angular/common';
import {ReporteCitaService} from "../../../../shared/services/reporte-cita.service";
import {ReporteAtendidasDiarias} from "../../../../shared/models/reportecitas";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DataTableDirective} from "angular-datatables";
import {BehaviorSubject, Subscription} from "rxjs";
import {AccionCita, AccionCronograma} from "../../../../shared/enumeracion/enums";

declare var $: any;

@Component({
  selector: 'tbl-reporte-citas-adendidas-diarias',
  templateUrl: 'tbl-reporte-citas-adendidas-diarias.component.html' ,
  styleUrls: ['./tbl-reporte-citas-adendidas-diarias.component.scss'],
  providers: [DatePipe]
})
export class TblReporteCitasAdendidasDiariasComponent implements OnInit, OnDestroy, AfterViewInit{

    @Input() fecha: string | null = null;
    @Input() idSede: number = 0;
    @Input() idServicio: number = 0;

    dtResponsiveOptions: any = {};
    dataTable: any;

    loading = false;
    subscription : Subscription | undefined;

    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

    _collection = new BehaviorSubject<ReporteAtendidasDiarias[]>([]);

    constructor(
      private api: ReporteCitaService,
      private datePipe: DatePipe,
      private utilsService: UtilsService
    ) {

    }

    ngOnInit(): void {
      this.build();
    }

    ngAfterViewInit(): void {
      this.datatableElement.dtInstance.then((dtInstance: any) => {
        this.dataTable = dtInstance;
      });
    }

    ngOnDestroy(): void {
      if(this.subscription){this.subscription.unsubscribe()}
    }

    build(): void{
      this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {
          this.subscription?.unsubscribe();
          this.loading = true;
          this.subscription = this.api.reporteAtendidasDiarias(this.fecha, this.idSede, this.idServicio).subscribe( (res: ReporteAtendidasDiarias[]) => {
            callback({
              data : res
            });
            this._collection.next(res);
            this.loading = false;
          }, err =>  {
            callback({ data : [] });
            this._collection.next([]);
            this.loading = false;
            console.log('Error al obtener el reporte de citas atendidas diarias: ', err);
          });
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
          { title: 'FECHA', data: 'fecha'},
          { title: 'IDCITA', data: 'idCita', visible: false},
          { title: 'IDCITA', data: 'idCita', render: (data: any, type, row) => {
              let link = '';
              if(row.idCronograma > 0){
                link = `<a href='/Corporal360/Cronograma/${row.idCronograma}/${AccionCronograma.ASIGNARCITAS}/${row.idCliente}/0/${row.idCita}/${AccionCita.VER}' target='_blank'>${ data }</a>`;
              }else{
                link = `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0/${row.idServicio}' target='_blank''>${ data }</a>`;
              }
              return link;
          }},
          { title: 'TIPOCITA', data: 'tipoCita', visible: true},
          { title: 'SERVICIO', data: 'servicio'},
          { title: 'N° BOX', data: 'numeroBox', render: (data: number) => {
            return data ? data : '';
          }},
          { title: 'MAQUINA', data: 'maquinaMarca'},
          { title: 'CLIENTE', data: 'cliente', visible: false},
          { title: 'CLIENTE', data: 'cliente', render: (data, type, row) => {
              return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
          }},
          { title: 'SESIÓN', data: 'sesion'},
          { title: 'ZONA CLIENTE ANTIGUO', data: 'zonaClienteAntiguo'},
          { title: 'ZONA NUEVA CLIENTE', data: 'zonaNuevaCliente'},
          { title: 'ZONA CLIENTE NUEVO', data: 'zonaClienteNuevo'},
          { title: 'PRECIO', data: 'precio', render: (data) =>{
            return data.toFixed(2);
          }},
          { title: 'PROMOCION', data: 'promocion'},
          { title: 'ORIGEN', data: 'medioContactoOrigen'},
          { title: 'U. AGENDO', data: 'usuarioAgendo'},
          { title: 'ATENDIDO POR', data: 'atendidoPor'},
          { title: 'SEDE', data: 'sede'},
        ],
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          {
            extend: 'excelHtml5',
            title: () => {
              return 'Reporte Citas Atendidas Diarias fecha ' + this.fecha;
            },
            exportOptions: {
              columns: [1,2,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19]
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
        select: true
      };
    }
}



