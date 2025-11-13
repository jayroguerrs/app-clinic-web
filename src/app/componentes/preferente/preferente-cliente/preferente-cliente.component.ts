import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy, AfterViewInit
} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Router } from '@angular/router';
import { PreferenteService } from '../../../shared/services/preferente.service';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { ImportExportDataService } from '../../../shared/services/import-export-data.service';
import { ClienteImportClass } from 'src/app/shared/models/cliente';
import {CitaImportClass} from "../../../shared/models/cita";
import {AccionCita} from "../../../shared/enumeracion/enums";
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-preferente-cliente',
  templateUrl: './preferente-cliente.component.html',
  styleUrls: ['./preferente-cliente.component.scss']
})
export class PreferenteClienteComponent implements OnInit, AfterViewInit, OnDestroy {


  @Output() eventCerrarModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() idPreferente: number;
  //@Input() modal: NgbModalRef;
  mostrarClienteDePreferente = true;
  mostrarClienteExistente = false;

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChild('spnGrabar', {read: ElementRef}) private snpGrabar : ElementRef;

  frmPreferenteCliente: FormGroup;
  optionsDtPreferentes = {};
  usuarioActual: Usuario;

  idCliente: number;
  datosClienteExistente: any;
  nombres: string;
  apellidos: string;
  numeros: string;
  email: string;


  frmFiltroGrilla: FormGroup;
  buscado = false;
  numClientes = 0;
  subscription: Subscription | undefined;

  // Datatable
  dataTable: any | null = null;
  selected : any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private router: Router,
    private preferenteService: PreferenteService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private renderer2: Renderer2,
    private importExportDataService: ImportExportDataService,
    private spinner: NgxSpinnerService,
    private modal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {
    this.buildtable();
    this.inicializarFormulario();
    // this.preferenteService.preferenteObtenerPorId(this.idPreferente, this.usuarioActual.idUsuario).subscribe(resultado => {
    //   //datos desde preferente
    //   this.nombres = resultado.nombres;
    //   this.apellidos = resultado.apellidos;
    //   this.numeros = resultado.preferenteTelefono.map(t => t.numero).join(' ');
    //   this.email = resultado.email;
    //   //buscar cliente por coincidencia de preferente
    //   this.clienteService.obtenerByPreferente(this.nombres, this.apellidos, this.numeros, this.email).subscribe(resultado => {
    //     this.datosClienteExistente = resultado;
    //   });
    // });
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

      dtInstance.on('select', (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          this.selected = dtInstance.rows('.selected').data()[0];
        }
      });

      dtInstance.on('deselect', (e, dt, type, indexes ) => {
        this.selected = null;
      });

    });
  }

  ngOnDestroy(): void {
    // Destroy datatable
    this.dataTable?.destroy(true);
    this.subscription?.unsubscribe();
  }

  buildtable(): void {

    this.optionsDtPreferentes = {
      ajax: (dataTablesParameters: any, callback) => {
        if(this.frmFiltroGrilla.controls.filterCliente.value != '') {
          this.spinner.show();
          this.subscription = this.clienteService.obtenerPorFiltro(this.frmFiltroGrilla.controls.filterCliente.value).subscribe(
            data => {
              this.buscado = true
              this.numClientes = data.length;
              callback({ data });
              this.spinner.hide();
            },
            error => {
              console.log('Error al obtener clientes', error);
              this.spinner.hide();
            }
          );
        } else {
          callback({ data: [] });
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
      columns: [
        {
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'Id',                  data: 'id',               width: '4%',    visible: false   },
        { title: 'NOMBRES Y APELLIDOS', data: 'nombresCompletos',     },
        { title: 'DOCUMENTO',           data: 'documento',             },
        { title: 'CELULAR 1',           data: 'celular1',            },
        { title: 'CELULAR 2',           data: 'celular2',        },
        { title: 'CORREO',              data: 'correo',           }
      ],
      serverSide: false,
      processing: false,
      pageLength: 10,
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
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todo"]]
    };

/*

    this.optionsDtPreferentes = {
      ajax: (dataTablesParameters: any, callback) => {
        callback({
          data: this.datosClienteExistente
        });
      },
      createdRow: function(row, data, dataIndex) {
        $(row).attr('data-id', data.id);
      },
      columns: [
        { title: 'NOMBRES Y APELLIDOS', width: '10%',  data: 'nombresCompletos' },
        { title: 'ID', width: '0', data: 'id', visible: false },
        { title: 'DNI / CE', width: '5%', data: 'documento'},
        { title: 'CELULAR', width: '5%', data: 'celular1',
            render: function (data, type, row) { return row.celular1 + ' - ' + row.celular2;  } },
        { title: 'CORREO', width: '5%', data: 'correo' },
        ],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
        });
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
      paging: false,
      searching: false,
      scrollY:  '50vh',
      scrollCollapse: true,
    };*/
  }
  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filterCliente: new FormControl('')
    });

   }
  clientePreferenteGrabar(): void {
    this.OnSelect.emit(this.selected);
    this.modal.close();
    // if(this.mostrarClienteDePreferente) {
    //   this.grabarNuevoCliente();
    // } else {
    //
    //   this.redirigirAlClienteSeleccionado();
    // }
  }
  grabarNuevoCliente(): void {
    //Agregar cliente de importacion al servicio
    const clienteExport = new ClienteImportClass();
    clienteExport.id = this.idCliente;
    clienteExport.nombresCompletos = this.nombres + ' ' + this.apellidos;
    clienteExport.celular1 = this.numeros;
    clienteExport.celular2 = '';
    clienteExport.documento = '';
    this.importExportDataService.ClienteExport(clienteExport);

    this.eventCerrarModal.emit();
    this.modal.close();
    this.router.navigate(['Cliente', 0]).then(() => {
    });
  }
  redirigirAlClienteSeleccionado(): void{
    const seleccionado = $('#tablaPreferenteCliente tBody tr.selected').length;
    if(seleccionado > 0 ){
      this.idCliente = parseInt($('#tablaPreferenteCliente tBody tr.selected')[0].getAttribute('data-id'), 10);
    } else {
      this.idCliente = 0
      this.utilsService.mostrarToast('Seleccione un cliente!!!', 'warning');
      return;
    }

    this.eventCerrarModal.emit();
    this.modal.close();
    this.router.navigate(['Cliente', this.idCliente]).then(() => {
    });
  }
  generarCliente(element: any): void{
    if(element == 1 ){
      this.mostrarClienteDePreferente = true;
      this.mostrarClienteExistente = false;
      this.renderer2.setProperty(this.snpGrabar.nativeElement, 'innerText', 'Grabar');
    } else {
      this.mostrarClienteDePreferente = false;
      this.mostrarClienteExistente = true;
      this.renderer2.setProperty(this.snpGrabar.nativeElement, 'innerText', 'Seleccionar');
    }
  }

  cerrarModal() {
    this.modal.close();
  }


  clienteListar( event: KeyboardEvent = null ): void{
    if(event){
      if(event.keyCode === 13) {
        this.dataTable.ajax.reload();
      }
    }else{
      this.dataTable.ajax.reload();
    }
  }
}
