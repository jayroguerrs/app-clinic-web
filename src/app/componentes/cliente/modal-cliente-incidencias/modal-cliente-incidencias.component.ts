import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ClienteIncidenciaService} from "../../../shared/services/cliente-incidencia.service";
import {Subscription} from "rxjs";
import { Cliente } from 'src/app/shared/models/cliente';
import {DatePipe} from "@angular/common";
import {ClienteIncidencia} from "../../../shared/models/cliente-incidencia";
import {UtilsService} from "../../../shared/services/funciones/utils.service";

@Component({
  selector: 'app-modal-cliente-incidencias',
  templateUrl: './modal-cliente-incidencias.component.html',
  styleUrls: ['./modal-cliente-incidencias.component.scss']
})
export class ModalClienteIncidenciasComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() cliente: Cliente;

  dtResponsiveOptions: any;
  sbcIncidencias : Subscription;
  loadingIncidencias = false;

  constructor(
    private activeModal: NgbActiveModal,
    private api: ClienteIncidenciaService,
    private datePipe: DatePipe,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.buildtable();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.sbcIncidencias?.unsubscribe();
  }

  cerrarModal(): void{
    this.activeModal.close();
  }

  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (_dataTablesParameters: any, callback) => {
        this.loadingIncidencias = true;
        this.sbcIncidencias = this.api.collectionByClient(this.cliente.id).subscribe(
          (data: ClienteIncidencia[]) => {
            callback({ data });
          },
          error => {
            console.log(error);
            callback({ data : [] });
            this.loadingIncidencias = false;
          }, () => {
            this.loadingIncidencias = false;
          }
        )
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
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'ID', data: 'id', visible: false, bSortable: false, className: 'align-middle' },
        { title: 'CLIENTE', data: 'cliente' , bSortable: true, className: 'align-middle', render: (data: any, type, row) => {
            return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
          }},
        { title: 'CITA', data: 'idCita' , bSortable: true, className: 'align-middle', render: (data: any, type, row) =>{
            return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0' target='_blank''>${ data }</a>`;
          }},
        { title: 'DESCRIPCION', data: 'descripcion', bSortable: true, className: 'align-middle'},
        { title: 'SEDE', data: 'sede', bSortable: true, className: 'align-middle'},
        { title: 'USU. REG', data: 'usuarioRegistro',  bSortable: true, className: 'align-middle' },
        { title: 'FECH. REG', data: 'fechaRegistro', className: 'align-middle', render: (data: Date | null) =>{
            return data ? this.datePipe.transform(data,'dd-MM-yyyy') : null;
          }},
        { title: 'USU. MOD', data: 'usuarioModifico',  bSortable: true, className: 'align-middle' },
        { title: 'FECH. MOD', data: 'fechaModifico', className: 'align-middle', render: (data: Date | null) =>{
            return data ? this.datePipe.transform(data,'dd-MM-yyyy') : null;
          }  },
      ],
      serverSide: false,
      processing: false,
      async: true,
      order: [],
      aaSorting: [],
      // buttons: [
      //   {
      //     extend: 'excelHtml5',
      //     title: () => {
      //       return this.getExportFileName();
      //     },
      //     /*          // exportOptions: {
      //               //   columns: [ 1,2,3,4,5,6,7,8 ]
      //               // },*/
      //     //autoFilter: true
      //   }
      // ],
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
      pageLength: 10,
      "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]]
    };
  }

}
