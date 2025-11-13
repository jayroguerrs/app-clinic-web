import {AfterViewInit, Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, ViewChild} from '@angular/core';

import {DatePipe} from "@angular/common";
import {CronogramaCitaService} from "../../../../shared/services/corporal360/cronograma-cita.service";
import {Subscription} from "rxjs";
import {CronogramaCita} from "../../../../shared/models/corporal-360/Cita";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {DataTableDirective} from "angular-datatables";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { Router} from "@angular/router";
import {AccionCronograma} from "../../../../shared/enumeracion/enums";

@Component({
  selector: 'app-tbl-cliente-cronogramas',
  templateUrl: './tbl-cliente-cronogramas.component.html',
  styleUrls: ['./tbl-cliente-cronogramas.component.scss']
})
export class TblClienteCronogramasComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() IdCliente: number = 0;
  @Input() IdServicio: number = 0;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChild('opciones') opciones : any;

  loading = false;
  subscription: Subscription;
  collection: CronogramaCita[] = [];

  // Datatable
  dataTable: any;
  selected: CronogramaCita | null = null;
  dtResponsiveOptions: any = {};

  constructor(
    private modalService: NgbModal,
    private utilService: UtilsService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private api: CronogramaCitaService,
    private route: Router
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

      dtInstance.on('select', (e, dt, type, indexes) => {
        if (type === 'row') {
          this.selected = dtInstance.rows('.selected').data()[0];
          this.modalService.open(this.opciones, {size: ' max-w-300px mx-auto', windowClass: 'smodal round popins', keyboard: false, centered: true });
        }
      });

      dtInstance.on('deselect', (e, dt, type, indexes) => {
        this.selected = null;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.listarCronogramas();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  reload(): void {
    this.dataTable.ajax.reload();
  }

  private listarCronogramas(): void {

    this.dtResponsiveOptions = {
      "dom": "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      ajax: (dataTablesParameters: any, callback) => {
        this.loading = true;
        this.subscription = this.api.collectionByClient(this.IdCliente, this.IdServicio).subscribe((res: CronogramaCita[]) => {
          // console.log(res);
          callback({data: res});
          this.loading = false;
        }, error => {
          callback({data: []});
          console.log(error);
          this.loading = false;
        })
      },
      select: {
        selector: 'td:not(:first-child)'
      },
      searching: true,
      'columnDefs': [{
        'max-width': '34px',
        'targets': 0
      }],
      columns: [
        {
          "className": 'dtr-control',
          "orderable": false,
          "data": null,
          "defaultContent": '',
          width: '0px'
        },
        {title: 'Id', data: 'id', render: (data) => '#'+data.toString().padStart(5,'0')},
        {title: 'ZONA', data: 'zona'},
        {title: 'SEDE', data: 'sede'},
        {title: 'SERVICIO', data: 'servicio'},
        {title: 'TRATAMIENTO', data: 'tratamiento'},
        {title: 'N° CITAS', data: 'numeroCitas'},
        {
          title: 'F. REGISTRO',
          data: 'fechaRegistro',
          render: (data: Date) => this.datePipe.transform(data, 'dd-MM-yyyy')
        },
        {title: 'U. REGISTRO', data: 'usuarioRegistro'},
        {
          title: 'F. MODIFICO',
          data: 'fechaModifico',
          render: (data: Date | null) => data ? this.datePipe.transform(data, 'dd-MM-yyyy') : null
        },
        {title: 'U. MODIFICO', data: 'usuarioModifico'},
      ],
      serverSide: false,
      processing: false,
      pageLength: 10,
      async: true,
      buttons: ['excel'],
      language: this.utilService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function (api, rowIdx, columns: any[]) {
            const data = columns.map(x => {
              return x.hidden ?
                '<tr data-dt-row="' + x.rowIndex + '" data-dt-column="' + x.columnIndex + '">' +
                '<td><b>' + x.title + '</b></td>' +
                '<td><b>:</b></td>' +
                '<td>' + x.data + '</td>' +
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100', 'table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      },
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todo"]]
    };
  }

  // Events
  asignarCitas(): void{
    const url = this.route.createUrlTree(['/Corporal360/Cronograma',this.selected.id,AccionCronograma.ASIGNARCITAS, this.selected.idCliente, this.selected.idPreferente, 0, 0]);
    window.open(url.toString(), '_blank');
  }
  editarDatos(): void{
    const url = this.route.createUrlTree(['/Corporal360/Cronograma',this.selected.id,AccionCronograma.EDITAR, this.selected.idCliente, this.selected.idPreferente, 0, 0]);
    window.open(url.toString(), '_blank');
  }

}
