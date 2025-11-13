import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CitaService } from '../../../shared/services/cita.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita-comision',
  templateUrl: './cita-comision.component.html',
  styleUrls: ['./cita-comision.component.scss'],
  providers: [DatePipe]
})
export class CitaComisionComponent implements OnInit, AfterViewInit, OnDestroy {

  frmFiltroGrilla: FormGroup;
  maestroOperadoras: any = [];
  idUsuarioOperador: number;
  operador: string;


  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected: number = 0;
  dataTable: any;

  // Modals
  modalCitaComisionDetalleRef: NgbModalRef;

  // Subscriptions
  sbcCollection: Subscription;
  sbcCollectionUsuario: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accImp: boolean = false;

  constructor(
    private citaService: CitaService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private usuarioService: UsuarioService,
    private bottomSheet: MatBottomSheet,
    private permisoHelper: PermisoHelper,    
    private auditoriaService : AuditoriaService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerUsuarios();
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accImp = accesos.accImp;  
    });
  }
  ngOnDestroy(): void {
    // Destroy Subscription
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    if( this.sbcCollectionUsuario ){ this.sbcCollectionUsuario.unsubscribe(); }
    // Destroy Modals
    if( this.modalCitaComisionDetalleRef ){ this.modalCitaComisionDetalleRef.close(); }
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        _this.selected = dtInstance.rows('.selected').count();
        if ( type === 'row' ) {
          _this.idUsuarioOperador = dtInstance.rows('.selected').data()[0].idUsuarioOperador;
          _this.operador = dtInstance.rows('.selected').data()[0].usuarioOperador;
          _this.verOpciones();
        }
      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.selected = dtInstance.rows('.selected').count();
      });

    });
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filtroFechaInicio: [new Date()],
      filtroFechaTermino: [new Date()],
      filtroIdUsuarioOperador: [0]
    });
    const date = new Date();
    this.frmFiltroGrilla.patchValue({
      filtroFechaInicio:  this.datePipe.transform(date, 'yyyy-MM-dd'),
      filtroFechaTermino:  this.datePipe.transform(date, 'yyyy-MM-dd')
    });
  }
  get f(): any {
    return this.frmFiltroGrilla.controls;
  }
  buildtable(): void{
    this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {
          const mensajeError = 'Error al obtener las comisiones'
          const fecha1 = this.datePipe.transform( this.frmFiltroGrilla.controls.filtroFechaInicio.value, 'yyyy-MM-dd');
          const fecha2 = this.datePipe.transform( this.frmFiltroGrilla.controls.filtroFechaTermino.value, 'yyyy-MM-dd');
          this.sbcCollection = this.citaService.obtenerComisionesResumen(fecha1, fecha2, parseInt(this.frmFiltroGrilla.controls.filtroIdUsuarioOperador.value, 10)).subscribe(
            data => callback({ data }),
            error => console.log(mensajeError + '' + error));
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
        { title: 'OPERADORA',       data: 'usuarioOperador',  width: '10%'     },
        { title: 'CITAS',           data: 'numCitas',         width: '4%',  visible: false   },
        { title: 'ZONAS ATENTIDAS', data: 'numZonas',         width: '20%'     },
        { title: 'TOTAL',           data: 'montoTotal',       width: '10%'     },
        { title: 'COMISIÓN',        data: 'montoComision',    width: '10%'     },
        { title: 'COMISIÓN - IGV',    data: 'montoComisionIgv',    render : function ( data, type ) {
            return data.toFixed(2);
          },    width: '10%'}
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
      }
    };
  }
  obtenerResumenComisiones(): any {
    this.dataTable.ajax.reload();
  }

  obtenerUsuarios(): void {
    this.sbcCollectionUsuario = this.usuarioService.obtenerUsuarios(true).subscribe(
      resultado => this.maestroOperadoras = resultado,
      error => console.log('Error al obtener los usuarios', error)
    );
  }
  mostrarDetalle(modal: NgbModalRef): void {
    this.modalCitaComisionDetalleRef = this.utilsService.abrirModal(modal, 'xl');
    this.modalCitaComisionDetalleRef.result.then();
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
