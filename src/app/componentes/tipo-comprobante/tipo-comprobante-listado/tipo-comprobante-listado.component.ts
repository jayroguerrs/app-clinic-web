import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { TipoComprobanteService } from '../../../shared/services/tipo-comprobante.service'
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'tipo-comprobante-listado.component.html'
})

export class TipoComprobanteListadoComponent implements OnInit, OnDestroy, AfterViewInit {

  frmFiltroGrilla: FormGroup;
  idTipoComprobante: number = 0;

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  dataTable: any;

  // Modals
  modalTipoComprobanteDatosRef: NgbModalRef;

  // Subscriptions
  sbcCollection: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private tipoComprobanteService: TipoComprobanteService,
    private bottomSheet: MatBottomSheet,
    private permisoHelper: PermisoHelper,    
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,    
    ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accImp = accesos.accImp;  
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;
    });
  }

  ngOnDestroy(): void {
    // Destroy modals
    if (this.modalTipoComprobanteDatosRef){ this.modalTipoComprobanteDatosRef.close(); }
    // Destroy subcriptions
    if (this.sbcCollection){ this.sbcCollection.unsubscribe(); }
  }

  ngAfterViewInit(): void{
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          _this.idTipoComprobante = data.id;
          _this.verOpciones();
        }
        _this.selected = dtInstance.rows({ selected: true }).count();
      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.idTipoComprobante = 0;
        _this.selected = dtInstance.rows({ selected: true }).count();
      });

    });
  }


  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filterDocumentoContable: ['']
    });
  }



  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.sbcCollection =  this.tipoComprobanteService.obtener().subscribe(
          resultado => callback({ data : resultado}),
          error =>  console.log('Error al obtener el Tipo de comprobante: ', error));
      },
      columns: [
        { title: 'ID', data: 'id', width: '4%', visible: false },
        { title: 'TIPO COMPROBANTE', data: 'descripcion', width: '40%' },
        { title: 'ABREVIATURA', data: 'abreviatura', width: '30%' },
        { title: 'ESTADO', width: '30%', data: 'idEstado', render: (data) => {
            return data === 1 ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>';
          },
        },
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
      },
      select: true
    };
  }

  tipoComprobanteListar(): void {
    this.dataTable.ajax.reload();
  }
  tipoComprobanteNuevo(modal: NgbModalRef): void {
    this.idTipoComprobante = 0;
    this.modalTipoComprobanteDatosRef = this.utilsService.abrirModal(modal, 'md')
    this.modalTipoComprobanteDatosRef.result.then(result => this.tipoComprobanteListar());
  }
  tipoComprobanteEditar(modal: NgbModalRef): void {
    this.modalTipoComprobanteDatosRef = this.utilsService.abrirModal(modal, 'md')
    this.modalTipoComprobanteDatosRef.result.then(result => this.tipoComprobanteListar());
  }

  exportarTabla(): void{
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

  // Bottom sheet
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }

}
