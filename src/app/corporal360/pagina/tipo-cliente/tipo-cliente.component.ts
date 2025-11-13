import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Usuario} from "../../../shared/models";
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TipoCliente} from "../../shared/model/cliente";
import {TipoClienteService} from "../../shared/service/tipo-cliente.service";
import {MdlTipoClienteComponent} from "../../componente/modal/mdl-tipo-cliente/mdl-tipo-cliente.component";

@Component({
  selector: 'app-tipo-cliente',
  templateUrl: './tipo-cliente.component.html',
  styleUrls: ['./tipo-cliente.component.scss']
})
export class TipoClienteComponent implements OnInit, OnDestroy, AfterViewInit {

  usuarioActual: Usuario;

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Datatable
  dataTable: any;

  sbcCollection: Subscription;

  selected: TipoCliente | null = null;

  constructor(
    private auth: AuthService,
    private api: TipoClienteService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.buildtable();
  }

  ngOnDestroy(): void {
    this.sbcCollection?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
      dtInstance.on('select',  (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          this.selected = dtInstance.rows('.selected').data()[0];
        }
      });
      dtInstance.on('deselect',  (e, dt, type, indexes ) => {
        this.selected = null;
      });
    });
  }

  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.spinner.show();
        this.sbcCollection = this.api.listar().subscribe(
          resultado => {
            callback({ data : resultado });
            this.spinner.hide();
          },
          error => {
            console.log(error);
            this.spinner.hide();
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
        { title: 'ID', data: 'id', visible: false },
        { title: 'NOMBRE', data: 'nombre', className: 'text-uppercase font-weight-bold' },
        { title: 'U. REGISTRO', data: 'usuarioRegistro' , width: '100px'},
        { title: 'F. REGISTRO', data: 'fechaRegistro', width: '100px', render: (data: Date) =>{
            return this.datePipe.transform(data, 'dd-MM-yyyy')
          }},
        { title: 'U. MODIFICO', data: 'usuarioModifico', width: '100px'},
        { title: 'F. MODIFICO', data: 'fechaModifico', width: '100px', render: (data: Date | null) =>{
            return data ? this.datePipe.transform(data, 'dd-MM-yyyy') : null;
          }},
        { title: 'ESTADO', data: 'idEstado', width: '70px', render: (data) => {
            return data === 1 ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>';
          }},
      ],
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
      }
    };
  }

  onReload(): void{
    this.dataTable.ajax.reload();
    this.selected = null;
  }

  onCreate(): void{
    const modalRef = this.modalService.open(MdlTipoClienteComponent);
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    });
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlTipoClienteComponent);
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

}
