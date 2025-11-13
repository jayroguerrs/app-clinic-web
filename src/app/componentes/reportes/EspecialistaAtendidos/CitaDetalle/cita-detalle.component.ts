import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {DataTableDirective} from "angular-datatables";
import {ReporteService} from "../../../../shared/services/reporte.service";
import {DatePipe} from "@angular/common";
import {CitaEspecialista} from "../../../../shared/models/reportecitas";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {Sedes} from "../../../../shared/enumeracion/enums";

@Component({
  selector: 'app-cita-detalle',
  templateUrl: 'cita-detalle.component.html' ,
  styleUrls: ['./cita-detalle.component.scss'],
})
export class CitaDetalleComponent implements OnInit, OnDestroy, AfterViewInit{

    @Input() fecha: Date | null = null;
    @Input() idUsuario: number | null = 0;
    @Input() usuario: string | null = null;
    @Input() idSede: number = 0;

    citas: CitaEspecialista[] = [];

    // Datatable
    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
    dtResponsiveOptions: any = {};

    constructor(
      public activeModal: NgbActiveModal,
      public reporteService: ReporteService,
      public datePipe: DatePipe,
      public utilsService: UtilsService
    ) {

    }

    ngOnInit(): void {
      this.getData();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {

    }

    buildTable(): void{

    }

    onClose(): void{
      this.activeModal.close();
    }
    // functions
    fechaPaso(fecha: Date): string{
      let output = "";
      const today = new Date();
      const meses = this.getMonthDifference(fecha, today);


      return meses + "Meses ";
    }

    getMonthDifference(startDate, endDate): number {
      return (
        endDate.getMonth() -
        startDate.getMonth() +
        12 * (endDate.getFullYear() - startDate.getFullYear())
      );
    }

    // data
    getData(): void{
      this.dtResponsiveOptions = {
        ajax : (dataTablesParameters: any, callback) => {

          this.reporteService.obtenerCitasEspecialista(this.idUsuario, this.datePipe.transform(this.fecha,'yyyy-MM-dd'), this.idSede ).subscribe((res: CitaEspecialista[]) => {
            callback({ data : res });
            console.log(res);
          }, error => {
            callback({ data : [] });
            console.log(error);
          });

        },
        columns: [
          {
            "className":      'dtr-control',
            "orderable":      false,
            "data":           null,
            "defaultContent": '',
            width: '0px'
          },
          { title: 'Cita', data: 'idCita', className: 'align-middle', render: (data: any, type, row) => {
              return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0' target='_blank''>${ data }</a>`;
            }},
          { title: 'Cliente', data: 'cliente' , className: 'align-middle', render: (data: any, type, row) => {
              return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
            }},
          { title: 'Sede', data: 'sede', className: 'align-middle'},
          { title: 'Fecha', data: 'fecha', render: (data: Date) => {
              return this.datePipe.transform(data,'dd-MM-yyyy');
            }, className: 'align-middle', width: '100px'},
          { title: 'Hora', data: 'hora', className: 'align-middle', width: '100px'},
          { title: 'Sgte. Cita A.', data: 'proximaCitaAtendida', render: (data: Date | null, type, row) => {
              return data ? `<a href='/Cita/${parseInt(row.idProximaCitaAtendida, 10).toString()}/1/${row.idCliente}/0' target='_blank'>${ this.datePipe.transform(data,'dd-MM-yyyy') }</a>` : 'No registra';
            }, className: 'align-middle', width: '100px'},
          { title: 'Cita Pdte', data: 'fechaProximaCita', render: (data: Date | null, type, row) => {
              return data ? `<a title='${row.estadoProximaCita}' class='btn btn-sm text-white m-0' style='background-color:${row.colorProximaCita}' href='/Cita/${parseInt(row.idProximaCita, 10).toString()}/1/${row.idCliente}/0' target='_blank'>${ this.datePipe.transform(data,'dd-MM-yyyy') }</a>` : 'No registra';
            }, className: 'align-middle', width: '100px'},
        ],
        serverSide: false,
        processing: false,
        async: true,

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



