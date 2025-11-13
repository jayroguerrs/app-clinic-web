import {AfterViewInit, Component, OnInit, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { TipoCitaService } from '../../../shared/services/tipo-cita.services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
declare var $:any;
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'tipo-cita-listado.component.html',
})
export class TipoCitaListadoComponent implements OnInit, OnDestroy, AfterViewInit  {

  frmFiltroGrilla: FormGroup;
  idTipoCita: number;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // modales
  modalTipoCitaDatosRef: NgbModalRef;

  // datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  dataTable: any;
  selected = 0;

  // Subscriptions
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
      private tipoCitaService: TipoCitaService,
      private formBuilder: FormBuilder,
      private utilsService: UtilsService,
      private spinner: NgxSpinnerService,
      private bottomSheet: MatBottomSheet,
      private permisoHelper: PermisoHelper,      
      private usuarioService: UsuarioService,
      private auditoriaService : AuditoriaService,
      private router: Router,
  ) {}

  ngOnInit() {
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
    // Destroy subscription
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    // Destroy modals
    if( this.modalTipoCitaDatosRef ){ this.modalTipoCitaDatosRef.close(); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
    // Destroy datatable
    if(this.dataTable){ this.dataTable.destroy(true);}
  }

  ngAfterViewInit(): void{
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          _this.idTipoCita = data.idTipoCita;
          _this.verOpciones();
        }
        _this.selected = dtInstance.rows('.selected').count();
      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.idTipoCita = 0;
        _this.selected = dtInstance.rows('.selected').count();
      });
   });
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filterTipoCita: ['']
    });
  }
  buildtable(){
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const strFiltro = this.frmFiltroGrilla.controls.filterTipoCita.value;
        const mensajeError = 'Error al obtener tipo de citas ';
        this.spinner.show();

        strFiltro === '' ?
        this.tipoCitaService.obtenerTipoCita().subscribe(
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
        this.tipoCitaService.searchByLikeNombre(strFiltro).subscribe(
          data => {
            callback({  data });
            this.spinner.hide();
          },
          error => {
            console.log(mensajeError + error);
            this.spinner.hide();
          }
        );
        // $('#btnEditar1, #btnEditar2').hide();
      },
      columns: [
        { title: 'IdTipoCita',  data: 'idTipoCita',  width: "4%", visible: false },
        { title: 'TIPO CITA', data: 'nombre', width: "20%" },
        { title: 'ESTADO', width: "5%", data: 'idEstado',
            render: (data: number)  => { return (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>'; } }
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
      select: true
    };
  }
  nuevoTipoCitaDatos(modal: any): void{
    this.idTipoCita = 0;
    this.modalTipoCitaDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalTipoCitaDatosRef.result.then(result => this.tipoCitaListar());
  }
  editarTipoCitaDatos(modal: any): void{
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar un tipo de cita','warning');
      return;
    }
    this.modalTipoCitaDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalTipoCitaDatosRef.result.then(result => this.tipoCitaListar());
  }
  tipoCitaListar() {
    this.selected = 0;
    $('.table-zona').DataTable().ajax.reload();
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
