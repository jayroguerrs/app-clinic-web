import {Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder } from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PromocionCategoriaService} from "../../shared/services/promocion-categoria.service";
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import {MdlPromocionCategoriaComponent} from "../../componentes/modals/mdl-promocion-categoria/mdl-promocion-categoria.component";
import {PromocionCategoria} from "../../shared/models/promocion";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'promocion-categoria.component.html'
})

export class PromocionCategoriaComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  frmFiltroGrilla: FormGroup;
  idMaquina = 0;
  dtResponsiveOptions: any = {};
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  selected: PromocionCategoria | null = null;

  // modal
  modalMaquinaDatosRef: NgbModalRef;

  // Subscriptions
  subscriptionCollection: Subscription;

  // Datatable
  dataTable: any;

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

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  constructor(
    private api: PromocionCategoriaService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private permisoHelper: PermisoHelper
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
    // Destroy modals
    if( this.modalMaquinaDatosRef ){ this.modalMaquinaDatosRef.close(); }

    // Destroy subscription
    if( this.subscriptionCollection ){ this.subscriptionCollection.unsubscribe(); }

    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }

    // Destroy datatable
    if(this.dataTable){ this.dataTable.destroy(true);}
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filterMaquina: ['']
    });
  }

  ngAfterViewInit(): void{
    const self = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      self.dataTable = dtInstance;

      dtInstance.on( 'select',  ( e, dt, type, indexes ) => {
        self.selected = dtInstance.rows( { selected: true } ).count() ;
        if ( type === 'row' ) {
          self.idMaquina = dtInstance.rows('.selected').data()[0].id;
          this.selected = dtInstance.rows('.selected').data()[0];
        }
      });
      dtInstance.on( 'deselect', ( e, dt, type, indexes ) => {
        self.selected = dtInstance.rows( { selected: true } ).count() ;
        this.selected = null;
      } );

   });
  }

  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        const strFiltro = this.frmFiltroGrilla.controls.filterMaquina.value;
        this.spinner.show();
        this.subscriptionCollection = this.api.listar().subscribe( resultado => {
          callback({
            data : resultado
          });
          this.spinner.hide();
        }, error =>  {
          console.log('Error al obtener categorias: ' + error);
          this.spinner.hide();
        });
      },
      columns: [
        { title: 'ID', data: 'id', width: '4%', visible: false },
        { title: 'NOMBRE', data: 'nombre', class: 'text-uppercase'},
        { title: 'F. REGISTRO', data: 'fechaRegistro', width: '100px' , render: (data: Date) => {
            return this.datePipe.transform(data, 'dd-MM-yyyy');
          }},
        { title: 'U. REGISTRO', data: 'usuarioRegistro', width: '100px' },
        { title: 'F. MODIFICO', data: 'fechaModifico', width: '100px' , render: (data: Date | null) => {
          return data ? this.datePipe.transform(data, 'dd-MM-yyyy') : null;
        }},
        { title: 'U. MODIFICO', data: 'usuarioModifico', width: '100px'},
        { title: 'ESTADO', width: '100px', data: 'idEstado', render: (data) => {
            return data === 1 ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>';
          }
        }
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
  showList(): void {
    this.dataTable.ajax.reload();
  }
  onCreate(): void {
    const modalRef = this.modalService.open(MdlPromocionCategoriaComponent, { windowClass: 'smodal round popins bg-dark-30' });
    modalRef.result.then((res: boolean) => {
      if(res){
        this.showList();
      }
    })
  }
  onEdit(): void {
    const modalRef = this.modalService.open(MdlPromocionCategoriaComponent);
    modalRef.componentInstance.categoria = this.selected;
    modalRef.result.then((res: boolean) => {
      if(res){
        this.showList();
      }
    })
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

  // Opciones menu movil
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }
}
