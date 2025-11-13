import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';


import {DatePipe} from '@angular/common';
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DataTableDirective} from "angular-datatables";
import {BehaviorSubject, Subscription} from "rxjs";
import { CitaReporteDetalladoAgendado} from "../../../../shared/models/cita";
import {CitaService} from "../../../../shared/services/cita.service";

declare var $: any;

@Component({
  selector: 'tbl-cita-detalle-reporte-agendado',
  templateUrl: 'tbl-cita-detalle-reporte-agendado.component.html' ,
  styleUrls: ['./tbl-cita-detalle-reporte-agendado.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class TblCitaDetalleReporteAgendadoComponent implements OnInit, OnDestroy, AfterViewInit{

    @Input() fechaInicio: string;
    @Input() fechaFin: string;
    @Input() idSede: number;
    @Input() idServicio:number;
    @Input() idEstado: number;
    @Input() idTipoCliente: number;
    @Input() idUsuarioAgendo: number;

    dtResponsiveOptions: any = {};
    dataTable: any;

    loading = false;
    subscription : Subscription | null = null;

    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

    _collection = new BehaviorSubject<CitaReporteDetalladoAgendado[]>([]);
    _loading = new BehaviorSubject<boolean>(false);

    constructor(
      private api: CitaService,
      private datePipe: DatePipe,
      private utilsService: UtilsService
    ) {

    }

    ngOnInit(): void {
      this.render();
    }

    ngAfterViewInit(): void {
      this.datatableElement.dtInstance.then((dtInstance: any) => {
        this.dataTable = dtInstance;
      });
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    get getTitleExel(): string{
      return `Reporte Agendo Cita del ${this.fechaInicio} al ${this.fechaFin}`;
    }

    render(): void{
      this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {
          this.subscription?.unsubscribe();
          this.loading = true;
          this._loading.next(true);
          this.subscription = this.api.ObtenerReporteDetalladoAgendado(
            this.fechaInicio,
            this.fechaFin,
            this.idSede,
            this.idServicio,
            this.idTipoCliente,
            this.idEstado,
            this.idUsuarioAgendo
          ).subscribe( (res: CitaReporteDetalladoAgendado[]) => {
            callback({
              data : res
            });
            this._collection.next(res);
            this.loading = false;
            this._loading.next(false);
          }, err =>  {
            callback({ data : [] });
            this._collection.next([]);
            this.loading = false;
            this._loading.next(false)
            console.log('Error al obtener el cronograma de citas atendidas: ', err);
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
          { title: 'IDCITA', data: 'idCita', visible: false},
          { title: 'CITA', data: 'idCita', render: (data: any, type, row) => {
              return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0/${row.idServicio}' target='_blank''>${ data }</a>`;
            }},
          //{ title: 'TIPO CITA', data: 'tipoCita'},
          { title: 'CLIENTE', data: null, visible: false, render: (data: any, type, row) => {
              return `${row.nombreCliente} ${row.apellidoCliente}`;
          }},
          // { title: 'GENERO', data: 'genero', visible: true},
          // { title: 'ALIAS', data: 'alias', visible: true},
          { title: 'CLIENTE', data: null, render: (data: any, type, row) => {
              return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${row.nombreCliente} ${row.apellidoCliente}</a>`;
            }},
          { title: 'N° DOCUMENTO', data: 'documentoCliente', visible: true},
          { title: 'TELEFONO', data: 'telefonoCliente', visible: true},
          { title: 'ZONA', data: 'zona'},
          { title: 'SESION', data: 'sesion'},
          { title: 'PROMOCIÓN', data: 'promocion'},
          { title: 'PRECIO', data: 'precio', render: (data: number) => {
            return data.toFixed(2);
          }},
          { title: 'ESTADO', data: 'estado', visible: false},
          { title: 'ESTADO', data: 'estado', width: '150px' , render: (data, type, full, meta) => {
              return `<span class="text-white py-1 px-3 text-uppercase rounded small" style="background-color:${full.estadoColor}">${full.estado}</span>`;
            }},
          { title: 'TIPOCLIENTE', data: 'tipoCliente', visible: true},
          { title: 'SEDE', data: 'sede'},
          { title: 'FECHACITA', data: 'fechaCita', render: (data) => {
            return this.datePipe.transform(data,'yyyy-MM-dd');
          }},
          { title: 'HORACITA', data: 'fechaCita', render: (data) => {
              return this.datePipe.transform(data,'hh:mm a');
           }},
          // { title: 'ORIGEN', data: 'origen'},
          // { title: 'SERVICIO', data: 'servicio'},
          { title: 'AGENDADOPOR', data: 'usuarioAgendo'},
          // { title: 'U. REGISTRO', data: 'usuarioRegistro'},
        ],
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          {
            extend: 'excelHtml5',
            title: this.getTitleExel,
            autoFilter: true,
            sheetName: 'Data',
            exportOptions: {
              columns: [1,3,5,6,7,8,9,10,11,13,14,15,16,17]
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
        select: false
      };
    }

}
