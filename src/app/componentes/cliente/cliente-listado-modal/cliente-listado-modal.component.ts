import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { ClienteService } from '../../../shared/services/cliente.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClienteImportClass } from '../../../shared/models/cliente';
import { ImportExportDataService } from '../../../shared/services/import-export-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
@Component({
  selector: 'app-cliente-listado-modal',
  templateUrl: './cliente-listado-modal.component.html',
  styleUrls: ['./cliente-listado-modal.component.scss']
})
export class ClienteListadoModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() modal: NgbModalRef;
  @Output() eventClienteSeleccionado: EventEmitter<ClienteImportClass> = new EventEmitter<ClienteImportClass>();
  frmClienteListadoModal: FormGroup;
  dtResponsiveOptions: any = {};
  cliente = new ClienteImportClass();
  esPrimeraVez = true;
  numClientes: number = 0;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  subscription: Subscription;

  constructor(
    private utilsService: UtilsService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private importExportDataService: ImportExportDataService,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.inicializarFormulario();
    // this.buildtable();
  }
  ngOnDestroy(): void {
    this.spinner.hide();
  }

  cerrarModal(): void {
    this.modal.close();
  }
  inicializarFormulario(): void {
    this.frmClienteListadoModal = this.formBuilder.group({
      filterCliente: ['']
    });
  }
  clienteListar(event): void{
    if(event.keyCode === 13) {
      $('.table-cliente').DataTable().ajax.reload();
    }
  }
  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.spinner.hide();

        this.subscription?.unsubscribe();

        if(this.esPrimeraVez) {
          this.spinner.show();
          console.log('spinner show');
          this.subscription = this.clienteService.obtenerClientes10().subscribe(
            data => {
               callback({ data });
               this.numClientes = data.length;
               this.esPrimeraVez = false;
               this.spinner.hide();
               console.log('spinner hide');
            },
            error => {
              console.log('Error al obtener los ultimos 10 clientes', error);
              this.spinner.hide();
              console.log('spinner hide');
            }
          );
        } else {
          this.spinner.show();
          console.log('spinner show');
          const stringFiltro = this.frmClienteListadoModal.controls.filterCliente.value;
          if(stringFiltro == '') {
            this.subscription = this.clienteService.obtenerClientes().subscribe(
              data => {
                callback({ data: [] });
                this.numClientes = 0;
                this.spinner.hide();
                console.log('spinner hide');
              },
              error => {
                console.log('Error al obtener la lista de clientes', error);
                this.spinner.hide();
                console.log('spinner hide');
              }
            );
          } else {
            this.subscription = this.clienteService.obtenerPorFiltro(stringFiltro).subscribe(
              data => {
                callback({ data });
                this.numClientes = data.length;
                this.spinner.hide();
                console.log('spinner hide');
              },
              error => {
                console.log('Error al obtener clientes', error);
                this.spinner.hide();
                console.log('spinner hide');
              }
            );
          }
        }
      },
      columns: [
      { title: 'Id',                  data: 'id',               width: '4%',    visible: false   },
      { title: 'NOMBRES Y APELLIDOS', data: 'nombresCompletos', width: '20%'     },
      { title: 'SEUDONIMO',           data: 'seudonimo',        width: '10%'     },
      { title: 'GENERO',              data: 'genero',           width: '10%'     },
      { title: 'CELULARES',           data: 'celular1',         width: '10%'     },
      { title: 'CORREO',              data: 'correo',           width: '10%',    visible: false },
      { title: 'DOCUMENTO',           data: 'documentoIdentidadTipo', width: '10%',
        render: function (data, type, row) { return row.documentoIdentidadTipo + ' ' + row.documento;  } },
      { title: 'ESTADO',              data: 'idEstado',         width: '5%', visible: false,
        render: (data: number) => { return (data === 1) ? '<span class="label theme-bg text-white f-12">ACTIVO</span>' : '<span class="label theme-bg2 text-white f-12">INACTIVO</span>'; } },
      { title: 'FECHA DE NACIMIENTO', data: 'fechaNacimiento', width: '10%'      },
      ],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
          this.cliente.id = data.id;
          this.cliente.nombresCompletos = data.nombresCompletos;
          this.cliente.documento = data.documento;
          this.cliente.tipoDocumento = data.documentoIdentidadTipo;
          this.cliente.celular1 = data.celular1;
          this.cliente.celular2 = data.celular2;
          this.cliente.edad = data.edad;
          this.cliente.idGenero = data.idGenero;
        });
        return row;
      },
      serverSide: false,
      processing: false,
      async: true,
      buttons: [ 'excel' ],
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
      select: true,
      searching: false,
      bLengthChange: false
    };
  }
  clienteSeleccionar(): void {
    this.eventClienteSeleccionado.emit(this.cliente);
    this.importExportDataService.ClienteExport(this.cliente);
    this.modal.close();
  }
}
