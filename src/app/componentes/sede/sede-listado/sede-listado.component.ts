import {AfterViewInit, Component, OnInit, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { SedeService } from '../../../shared/services/sede.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'sede-listado.component.html'
})
export class SedeListadoComponent implements OnInit, OnDestroy, AfterViewInit {

  idSede: number;
  frmFiltroGrilla: FormGroup;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // modales
  modalSedeDatosRef: NgbModalRef;

  // datatable
  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtResponsiveOptions: any = {};
  dataTable: any;
  selected = 0;

  // subscription
  sbcCollection: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;
  constructor(
    private sedeService: SedeService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
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
      this.accImp = accesos.accImp;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;
    });
  }

  ngOnDestroy(): void {
    // Destroy modal
    if( this.modalSedeDatosRef ){ this.modalSedeDatosRef.close(); }
    // Destroy subscription
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
    // Destroy datatable
    if(this.dataTable){ this.dataTable.destroy(true);}
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          _this.idSede = data.idSede;
          _this.verOpciones();
        }
        _this.selected = dtInstance.rows('.selected').count();
      });

      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.idSede = 0;
        _this.selected = dtInstance.rows('.selected').count();
      });

   });
}
  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({ filterNombre: [''] });
  }
  buildtable() {
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const strFiltro = this.frmFiltroGrilla.controls.filterNombre.value;
        const mensajeError = 'Error al obtener sedes ';
        this.spinner.show();

        strFiltro === '' ?
        this.sbcCollection = this.sedeService.obtener().subscribe(
          data => {
            callback({ data });
            this.spinner.hide();
          },
          error => {
            console.log(mensajeError + error);
            this.spinner.hide();
          }
        )
        :
        this.sbcCollection = this.sedeService.searchByLikeNombre(strFiltro).subscribe(
          data => {
            callback({ data });
            this.spinner.hide();
          },
          error => {
            console.log(mensajeError + error);
            this.spinner.hide();
          }
        );
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
        { title: 'ID',  data: 'idSede',  width: "4%", visible: false },
        { title: 'NOMBRE', data: 'nombre',  width: "20%" },
        { title: 'ESTADO', width: "5%",data: 'estado', render: function (data, type, row) {
            return data === 1 ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>';
          }},
        { title: 'DIRECCION', data: 'direccion', width: "5%" },
        { title: 'DISTRITO', data: 'ubicacion.distrito', width: "5%" },
        { title: 'PROVINCIA', data: 'ubicacion.ciudad', width: "5%" },
        { title: 'DEPARTAMENTO', data: 'ubicacion.departamento', width: "5%" },
        { title: 'HORA INICIO', data: 'horaInicio', width: "5%" },
        { title: 'HORA FIN', data: 'horaFin', width: "5%" }
      ],
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
      order: []
    };
  }
  sedeListar() {
    this.selected = 0;
    this.dataTable.ajax.reload();
  }
  nuevoSedeDatos(modal: any): void{
    this.idSede = 0;
    this.modalSedeDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalSedeDatosRef.result.then(result =>  this.sedeListar());
  }
  editarSedeDatos(modal: any): void{
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar una sede','warning');
      return;
    }
    this.modalSedeDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalSedeDatosRef.result.then(result =>  this.sedeListar());
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

  // Menu Mobile
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }
}
