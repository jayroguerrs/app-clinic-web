import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Usuario} from "../../../shared/models";
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import {Cliente} from "../../../shared/models/cliente";
import {AuthService} from "../../../shared/services/auth.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Sala} from "../../shared/model/sala";
import {MdlSalaComponent} from "../../componente/modal/mdl-sala/mdl-sala.component";
import {SalaService} from "../../shared/service/sala.service";
import {Servicio} from "../../../shared/models/corporal-360/servicio";

@Component({
  selector: 'app-box',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.scss']
})
export class SalaComponent implements OnInit, OnDestroy, AfterViewInit {

  usuarioActual: Usuario;

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  client: Cliente;

  // Datatable
  dataTable: any;

  sbcCollection: Subscription;

  selected: Sala | null = null;

  constructor(
    private auth: AuthService,
    private api: SalaService,
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
        { title: 'NOMBRE', data: 'nombre', className: 'text-uppercase font-weight-bold', render: (data) =>{
          return '<i class="fas fa-door-open mr-1"></i>' + data;
        }},
        { title: 'SEDE', data: 'sede', className: 'text-uppercase' },
        { title: 'SERVICIOS', data: 'servicios', className: 'text-uppercase', render: (data: Servicio[]) => {
          let output = "";
          data.forEach(x => {
            output += `<span class="rounded bg-color-primary text-white px-2 py-1 d-inline-block mx-1 small">${x.nombre}</span>`;
          });
          return output;
        }},
        { title: 'ESTADO', data: 'idEstado', width: '70px', render: (data) => {
            return data === 1 ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>';
          }},
        { title: 'U. REGISTRO', data: 'usuarioRegistro' },
        { title: 'F. REGISTRO', data: 'fechaRegistro', render: (data: Date) =>{
            return this.datePipe.transform(data, 'dd-MM-yyyy')
          }},
        { title: 'U. MODIFICO', data: 'usuarioModifico'},
        { title: 'F. MODIFICO', data: 'fechaModifico', render: (data: Date | null) =>{
            return data ? this.datePipe.transform(data, 'dd-MM-yyyy') : null;
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
    const modalRef = this.modalService.open(MdlSalaComponent);
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlSalaComponent);
    modalRef.componentInstance.data = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.onReload();
      }
    })
  }

}
