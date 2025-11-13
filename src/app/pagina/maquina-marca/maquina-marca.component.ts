import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccionCita} from 'src/app/shared/enumeracion/enums';
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Usuario} from "../../shared/models";
import { Cliente } from 'src/app/shared/models/cliente';
import {Servicio} from "../../shared/models/servicio";
import {AuthService} from "../../shared/services/auth.service";
import {UsuarioService} from "../../shared/services/usuario.service";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {MaquinaMarcaService} from "../../shared/services/maquina-marca.service";
import {MdlMaquinaMarcaComponent} from "../../componentes/modals/mdl-maquina-marca/mdl-maquina-marca.component";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-maquina-marca',
  templateUrl: './maquina-marca.component.html',
  styleUrls: ['./maquina-marca.component.scss']
})
export class MaquinaMarcaComponent implements OnInit, OnDestroy, AfterViewInit {

  usuarioActual: Usuario;

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Subscriptions
  subscriptionCollection: Subscription;

  client: Cliente;
  AccionCita = AccionCita;

  // Datatable
  dataTable: any;

  sbcCollection: Subscription;

  selected: Servicio | null = null;

  // Permisos
  accTot: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;
  constructor(
    private auth: AuthService,
    private api: MaquinaMarcaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private permisoHelper: PermisoHelper
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;
    });
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
        this.sbcCollection = this.api.collection().subscribe(
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
        { title: 'NOMBRE CORTO', data: 'nombreCorto', width: '100px'},
        { title: 'SERVICIOS', data: 'servicios', render: (data: Servicio[]) => {
          let servicios = '';
          data.forEach(s => {
             servicios += `<span class="rounded-5px px-2 py-1 mr-1 text-white" style="background-color:${s.color}">${s.nombre}</span>`;
          });
          return servicios;
        }},
        { title: 'U. REGISTRO', data: 'usuarioRegistro', width: '100px' },
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
    const modalRef = this.modalService.open(MdlMaquinaMarcaComponent, {size: ' max-w-500px mx-auto', windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: true,  animation: true });
    modalRef.componentInstance.OnCreated.subscribe((res) => {
      this.onReload();
    });
  }

  onEdit(): void{
    const modalRef = this.modalService.open(MdlMaquinaMarcaComponent, {size: ' max-w-500px mx-auto', windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: true,  animation: true });
    modalRef.componentInstance.data = this.selected;
    modalRef.componentInstance.OnUpdated.subscribe((res) => {
      this.onReload();
    });
  }

}
