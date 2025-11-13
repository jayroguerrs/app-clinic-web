import {Component, OnInit, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MaquinaService } from '../../../shared/services/maquina.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { AuditoriaService } from '../../../shared/services/auditoria.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'maquina-listado.component.html'
})

export class MaquinaListadoComponent implements OnInit, OnDestroy {
  
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  frmFiltroGrilla: FormGroup;
  idMaquina = 0;
  dtResponsiveOptions: any = {};
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // modal
  modalMaquinaDatosRef: NgbModalRef;

  // Subscriptions
  subscriptionCollection: Subscription;

  // Datatable
  dataTable: any;
  selected = 0;

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

  ip: string;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  constructor(
    private maquinaService: MaquinaService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private auditoriaService : AuditoriaService,
    private bottomSheet: MatBottomSheet,
    private permisoHelper: PermisoHelper,
    private router: Router
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

      dtInstance.on( 'select', function ( e, dt, type, indexes ) {
        self.selected = dtInstance.rows( { selected: true } ).count() ;
        if ( type === 'row' ) {
          self.idMaquina = dtInstance.rows('.selected').data()[0].id;
        }
      });
      dtInstance.on( 'deselect', function ( e, dt, type, indexes ) {
        self.selected = dtInstance.rows( { selected: true } ).count() ;
      });

   });
  }

  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        const strFiltro = this.frmFiltroGrilla.controls.filterMaquina.value;
        this.spinner.show();
        if (strFiltro === '')
        {
          this.subscriptionCollection = this.maquinaService.obtenerMaquina().subscribe( resultado => {            
            callback({
              data : resultado
            });
            this.spinner.hide();
          }, error =>  {

            const { status,statusText,url, error: { message } } = error;

            if(status === 401){
              this.spinner.hide();
              this.router.navigate(['Unauthorized']);
            }
                        
            console.log('Error al obtener maquinas: ' + error);
            this.spinner.hide();
          });
        } else {
          this.subscriptionCollection = this.maquinaService.searchByLikeNombre(strFiltro).subscribe(resultado => {
            callback({
              data: resultado
            });
            this.spinner.hide();
          }, error => {
            console.log('Error al obtener maquinas por filtro: ' + error);
            this.spinner.hide();
          });
        }
      },
      columns: [
        { title: 'ID', data: 'id', width: '4%', visible: false },
        { title: 'DESCRIPCION', data: 'descripcion', width: '20%' },
        { title: 'COLOR', data: 'color', width: '20%', render: (data) => {
          return `<span style="background-color:${data}" class="d-block w-50px h-10px rounded-pill"></span>`
        }},
        { title: 'ESTADO', width: '5%', data: 'idEstado', render: (data) => {
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
  maquinaListar(): void {
    this.selected = 0;
    this.dataTable.ajax.reload();
  }
  maquinaNuevo(modal: any): void {
    this.idMaquina = 0;
    this.modalMaquinaDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalMaquinaDatosRef.result.then(result => this.maquinaListar());
  }
  maquinaEditar(modal: any): void {
    this.modalMaquinaDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalMaquinaDatosRef.result.then(result => this.maquinaListar());
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
