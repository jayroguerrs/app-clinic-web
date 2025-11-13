import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';


import {DatePipe} from '@angular/common';
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DataTableDirective} from "angular-datatables";
import {BehaviorSubject, Subscription} from "rxjs";
import {CitaReporteDetallado} from "../../../../shared/models/cita";
import {CitaService} from "../../../../shared/services/cita.service";

declare var $: any;

@Component({
  selector: 'tbl-cita-reporte-detallado',
  templateUrl: 'tbl-cita-reporte-detallado.component.html' ,
  styleUrls: ['./tbl-cita-reporte-detallado.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class TblCitaReporteDetalladoComponent implements OnInit, OnDestroy, AfterViewInit{

    @Input() fechaInicio: string;
    @Input() fechaFin: string;
    @Input() idSede: number;
    @Input() idServicio:number;
    @Input() idEstado: number;
    @Input() idTipoCita: number;
    @Input() idZona: number;

    dtResponsiveOptions: any = {};
    dataTable: any;

    loading = false;
    subscription : Subscription | null = null;

    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

    _collection = new BehaviorSubject<CitaReporteDetallado[]>([]);
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
      return 'Reporte_Citas';
    }

    render(): void{
      this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {
          this.subscription?.unsubscribe();
          this.loading = true;
          this._loading.next(true);
          this.subscription = this.api.ObtenerReporteDetallado(this.fechaInicio, this.fechaFin, this.idSede, this.idServicio, this.idEstado, this.idTipoCita, this.idZona).subscribe( (res: CitaReporteDetallado[]) => {
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
          { title: 'TIPO CITA', data: 'tipoCita'},
          { title: 'CLIENTE', data: 'cliente', visible: false},
          { title: 'GENERO', data: 'genero', visible: true},
          { title: 'ALIAS', data: 'alias', visible: true},
          { title: 'CLIENTE', data: 'cliente', render: (data: any, type, row) => {
              return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
            }},
          { title: 'N° DOCUMENTO', data: 'documentoIdentidad', visible: true},
          { title: 'TELEFONO', data: 'telefono', visible: true},
          { title: 'ZONA', data: 'zona'},
          { title: 'SESION', data: 'sesion'},
          { title: 'PROMOCIÓN', data: 'promocion'},
          { title: 'PRECIO', data: 'precio', render: (data: number) => {
            return data.toFixed(2);
          }},
          { title: 'AGENDADOPOR', data: 'agendadoPor'},
          { title: 'ORIGEN', data: 'origen'},
          { title: 'SERVICIO', data: 'servicio'},
          { title: 'ESTADO', data: 'estado', visible: false},
          { title: 'TIPOCLIENTE', data: 'tipoCliente', visible: true},
          { title: 'ESTADO', data: 'estado', width: '150px' , render: (data, type, full, meta) => {
              return `<span class="text-white py-1 px-3 text-uppercase rounded small" style="background-color:${full.estadoColor}">${full.estado}</span>`;
            }},
          { title: 'SEDE', data: 'sede'},
          { title: 'FECHACITA', data: 'fecha', render: (data) => {
            return this.datePipe.transform(data,'yyyy-MM-dd');
          }},
          { title: 'HORACITA', data: 'fecha', render: (data) => {
              return this.datePipe.transform(data,'hh:mm a');
           }},
          { title: 'U. REGISTRO', data: 'usuarioRegistro'},
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
              columns: [1,3,4,5,6,8,9,10,11,12,13,14,15,16,18,19,20,21,22,23]
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
