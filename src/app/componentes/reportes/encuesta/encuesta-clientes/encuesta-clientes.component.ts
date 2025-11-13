import {AfterViewInit, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {DatePipe} from "@angular/common";
import {Cliente} from "../../../../shared/models/cliente";
import {FormularioEncuestaService} from "../../../../shared/services/formulario-encuesta.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta-clientes',
  templateUrl: './encuesta-clientes.component.html',
  styleUrls: ['./encuesta-clientes.component.scss']
})
export class EncuestaClientesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() FechaInicio: string | null;
  @Input() FechaFin: string | null;
  @Input() IdSede: number = 0;
  @Input() IdFormulario: number = 0;

  collection: Cliente[] = [];
  subscription: Subscription;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  dataTable: any;

  loading = false;

  constructor(
    private datePipe: DatePipe,
    private api: FormularioEncuestaService,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildTable();
  }

  ngAfterViewInit(): void{
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(this.FechaInicio && this.FechaFin){
    //   this.reload();
    // }
  }

  ngOnDestroy(): void {
    if(this.subscription){ this.subscription.unsubscribe(); }
  }

  public reload(): void{
    if(this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }

  private buildTable(): void{

    this.dtResponsiveOptions = {
        ajax:  (dataTablesParameters: any, callback) => {
          if(this.FechaInicio && this.FechaFin) {

            this.subscription =  this.api.obtenerReporteClientes(this.IdSede, this.IdFormulario, this.FechaInicio, this.FechaFin).subscribe((res) => {
              callback({data: res});
              this.collection = res;
            }, error => {
              callback({data: []});
              this.collection = [];
              console.log(error);
            }, () => {
              this.loading = false;
            });

          }else{
            console.log('empty',this.FechaInicio , this.FechaFin , this.IdFormulario);
             callback({data: []});
          }

        },
        searching: false,
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
          // { title: 'Código', data: 'id', className: 'align-middle'},
          {title: '#', data: 'id', className: 'align-middle'},
          {title: 'Nombre', data: 'nombres', className: 'align-middle', render: (data, type, row: Cliente) => {
              return `<a href='/ClientePerfil/${row.id}' target='_blank''>${ row.nombres + " " + row.apellidos }</a>`;
            }},
          {title: 'Nombre', data: 'nombres', className: 'align-middle', render: (data, type, row: Cliente) => {
            return  row.nombres + " " + row.apellidos;
          }, visible: false},
          {title: 'Encuesta', data: 'encuesta', className: 'align-middle'},
          {title: 'Teléfono', data: 'telefono1', className: 'align-middle'},
          {title: 'Fecha Encuesta', data: 'fechaEncuesta', className: 'align-middle', render: (data) => {
              return this.datePipe.transform(data,'dd-MM-yyyy');
          }},
        ],
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          {
            extend: 'excelHtml5',
            title: () => {
              return 'Reporte clientes encuestados por sede desde ' + this.FechaInicio + ' hasta ' + this.FechaFin;
            },
            exportOptions: {
              columns: [ 1,3,4,5 ]
            },
          }
        ],
        language: this.utilsService.datatableIdioma,
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
        }
      };

  }

  exportarExcel(): void{
    const param = {
      "idusuario": this.usuarioService.UsuarioActual.idUsuario,
      "tipo_opcion": this.router.url,
      "des_operacion": "Descarga",
      "des_nombre_usuario": this.usuarioService.UsuarioActual.nombre,
      "des_nombre_maquina": window.location.hostname, 
      "des_usuario_windows": "",     
      "des_sistema": "",
      "des_usuario_sistema":""
    }
       
    this.auditoriaService.insAuditoria(param).subscribe((res)=>{
      if(res.status === 200){
        this.dataTable.button(0).trigger();
      }
      else if(res.status === 400){
        Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'info');
      }
    },    
    (error)=>{
      Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'error');
    });    
  }

}
