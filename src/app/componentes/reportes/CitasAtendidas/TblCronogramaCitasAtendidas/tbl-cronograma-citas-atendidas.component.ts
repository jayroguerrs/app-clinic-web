import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Input, ViewChild
} from '@angular/core';


import { DatePipe } from '@angular/common';
import {ReporteCitaService} from "../../../../shared/services/reporte-cita.service";
import {CronogramaCitasAtendidas} from "../../../../shared/models/reportecitas";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DataTableDirective} from "angular-datatables";
import {BehaviorSubject, Subscription} from "rxjs";

declare var $: any;

@Component({
  selector: 'tbl-cronograma-citas-atendidas',
  templateUrl: 'tbl-cronograma-citas-atendidas.component.html' ,
  styleUrls: ['./tbl-cronograma-citas-atendidas.component.scss'],
  providers: [DatePipe]
})
export class TblCronogramaCitasAtendidasComponent implements OnInit, OnDestroy, AfterViewInit{

    @Input() idSede: number = 0;
    @Input() fechaDesde: string | null = null;
    @Input() fechaHasta: string | null = null;

    dtResponsiveOptions: any = {};
    dataTable: any;

    loading = false;
    subscription : Subscription | null = null;

    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

    _collection = new BehaviorSubject<CronogramaCitasAtendidas[]>([]);

    constructor(
      private api: ReporteCitaService,
      private datePipe: DatePipe,
      private utilsService: UtilsService
    ) {

    }

    ngOnInit(): void {
      console.log(this.idSede, this.fechaDesde, this.fechaHasta);
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
          if(this.subscription){this.subscription.unsubscribe()}
          this.loading = true;
          this.subscription = this.api.cronogramaCitasAtendidas(this.idSede, this.fechaDesde, this.fechaHasta).subscribe( (res: CronogramaCitasAtendidas[]) => {
            callback({
              data : res
            });
            this._collection.next(res);
            this.loading = false;
          }, err =>  {
            callback({ data : [] });
            this._collection.next([]);
            this.loading = false;
            console.log('Error al obtener el cronograma de citas atendidas: ', err);
          });
        },
        columns: [

          { title: 'SEDE', data: 'sede'},
          { title: 'FECHA', data: 'fecha', render: (data) => {
            return this.datePipe.transform(data,'yyyy-MM-dd');
          }},
          { title: 'AÑO', data: 'fecha', render: (data) => {
              return this.datePipe.transform(data,'yyyy');
          }},
          { title: 'MES', data: 'fecha', render: (data) => {
              return this.datePipe.transform(data,'MMMM','','es-ES');
          }, class: 'text-uppercase'},
          { title: 'DIA', data: 'fecha', render: (data) => {
              return this.datePipe.transform(data,'EEEE','','es-ES');
          }, class: 'text-uppercase'},
          { title: 'NUMERO', data: 'fecha', render: (data) => {
              return this.datePipe.transform(data,'dd');
          }},
          { title: '08:00 AM', data: 'h8'},
          { title: '09:00 AM', data: 'h9'},
          { title: '10:00 AM', data: 'h10'},
          { title: '11:00 AM', data: 'h11'},
          { title: '12:00 PM', data: 'h12'},
          { title: '01:00 PM', data: 'h13'},
          { title: '02:00 PM', data: 'h14'},
          { title: '03:00 PM', data: 'h15'},
          { title: '04:00 PM', data: 'h16'},
          { title: '05:00 PM', data: 'h17'},
          { title: '06:00 PM', data: 'h18'},
          { title: '07:00 PM', data: 'h19'},
          { title: '08:00 PM', data: 'h20'},
          { title: '09:00 PM', data: 'h21'},
          {title: 'Total', data: null, render: (data, xhr, row) => {
            return row.h8 + row.h9 + row.h10 + row.h11 + row.h12 + row.h13 + row.h14 + row.h15 + row.h16 + row.h17 + row.h18 + row.h19 + row.h20 + row.h21;
          }}
        ],
        rowCallback: (row, data: CronogramaCitasAtendidas, index) => {
          $(row).find('td:eq(6)').css({'background-color': this.colorValue(data.h8), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(7)').css({'background-color': this.colorValue(data.h9), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(8)').css({'background-color': this.colorValue(data.h10), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(9)').css({'background-color': this.colorValue(data.h11), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(10)').css({'background-color': this.colorValue(data.h12), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(11)').css({'background-color': this.colorValue(data.h13), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(12)').css({'background-color': this.colorValue(data.h14), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(13)').css({'background-color': this.colorValue(data.h15), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(14)').css({'background-color': this.colorValue(data.h16), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(15)').css({'background-color': this.colorValue(data.h17), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(16)').css({'background-color': this.colorValue(data.h18), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(17)').css({'background-color': this.colorValue(data.h19), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(18)').css({'background-color': this.colorValue(data.h20), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(19)').css({'background-color': this.colorValue(data.h21), 'color':'white', 'text-align':'center', 'font-weight':'600'});
          $(row).find('td:eq(20)').css({'background-color': 'indigo', 'color':'white', 'text-align':'center', 'font-weight':'600'});
        },
        footerCallback:  ( row, data, start, end, display ) => {
          // const api = this.api();

          // converting to interger to find total
          /*const intVal = function ( i ) {
            return typeof i === 'string' ?
              i.replace(/[\$,]/g, '')*1 :
              typeof i === 'number' ?
                i : 0;
          };

          // computing column Total of the complete result
          const monTotal = this.dataTable?.column( 7 )
            .data()
            .reduce( function (a, b) {
              return intVal(a) + intVal(b);
            }, 0 );

          const tueTotal = this.dataTable?.column( 8 )
            .data()
            .reduce( function (a, b) {
              return intVal(a) + intVal(b);
            }, 0 );

          const wedTotal = this.dataTable?.column( 9 )
            .data()
            .reduce( function (a, b) {
              return intVal(a) + intVal(b);
            }, 0 );

          const thuTotal = this.dataTable?.column( 110 )
            .data()
            .reduce( function (a, b) {
              return intVal(a) + intVal(b);
            }, 0 );

          const friTotal = this.dataTable?.column( 11 )
            .data()
            .reduce( function (a, b) {
              return intVal(a) + intVal(b);
            }, 0 );


          // Update footer by showing the total with the reference of the column index
          this.dataTable?.column( 0 ).footer().html('Total');
          $( this.dataTable?.column( 1 ).footer() ).html(monTotal);
          $( this.dataTable?.column( 2 ).footer() ).html(tueTotal);
          $( this.dataTable?.column( 3 ).footer() ).html(wedTotal);
          $( this.dataTable?.column( 4 ).footer() ).html(thuTotal);
          $( this.dataTable?.column( 5 ).footer() ).html(friTotal);*/


          const total = (col: number): number => {
            return this.dataTable?.column( col )
              .data()
              .reduce( function (a, b) {
                return a + b;
              }, 0 );
          }


          $(this.dataTable?.column(6).footer()).html(total(6));
          $(this.dataTable?.column(7).footer()).html(total(7));
          $(this.dataTable?.column(8).footer()).html(total(8));
          $(this.dataTable?.column(9).footer()).html(total(9));
          $(this.dataTable?.column(10).footer()).html(total(10));
          $(this.dataTable?.column(11).footer()).html(total(11));
          $(this.dataTable?.column(12).footer()).html(total(12));
          $(this.dataTable?.column(13).footer()).html(total(13));
          $(this.dataTable?.column(14).footer()).html(total(14));
          $(this.dataTable?.column(15).footer()).html(total(15));
          $(this.dataTable?.column(16).footer()).html(total(16));
          $(this.dataTable?.column(17).footer()).html(total(17));
          $(this.dataTable?.column(18).footer()).html(total(18));
          $(this.dataTable?.column(19).footer()).html(total(19));
          // $(this.dataTable?.column(20).footer()).html(total(20));
        },
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          'excel'
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

    colorValue(value: number): string{
      if(value < 6)  { return '#F1416C' }
      if(value >= 6 && value < 11)  { return '#FFC700' }
      if(value >= 11)  { return '#04C8C8' }
    }
}



