import {Component, OnInit, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { MaquinaSedeService } from '../../../shared/services/maquinasede.service';
import { SedeService } from '../../../shared/services/sede.service';
import { MaquinaService } from '../../../shared/services/maquina.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {MdlMaquinasedeTecnologiaComponent} from "../../modals/mdl-maquinasede-tecnologia/mdl-maquinasede-tecnologia.component";
import {Tecnologia} from "../../../shared/models/tecnologia";
import {DatePipe} from "@angular/common";
import {MdlFacturaPorcentajeIgvComponent} from "../../modals/facturacion/mdl-factura-porcentaje-igv/mdl-factura-porcentaje-igv.component";
import {MdlMaquinaSedeAsignarPerfilesComponent} from "../../modals/mdl-maquina-sede-asignar-perfiles/mdl-maquina-sede-asignar-perfiles.component";
import {MaquinaSedePerfil} from "../../../shared/models/maquina";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'maquina-sede-listado.component.html'
})

export class MaquinaSedeListadoComponent implements OnInit, OnDestroy {

  // modal
  modalMaquinaSedeDatosRef: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  frmFiltroGrilla: FormGroup;
  idMaquinaSede = 0;
  dtResponsiveOptions: any = {};
  listaSedes: any;
  listaMaquinas: any;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // datatable
  dataTable: any;
  selected = 0;
  maquinaSelected: any | null;

  // subscription
  sbtCollection: Subscription;
  sbtCollectionMaquina: Subscription;
  sbtCollectionSede: Subscription;

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
    private maquinaSedeService: MaquinaSedeService,
    private maquinaService: MaquinaService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private sedeService: SedeService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private permisoHelper: PermisoHelper,    
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.sedeListar();
    this.maquinaListar();
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
    if( this.modalMaquinaSedeDatosRef ){ this.modalMaquinaSedeDatosRef.close(); }
    // Destroy subscription
    if( this.sbtCollection ){ this.sbtCollection.unsubscribe(); }
    if( this.sbtCollectionMaquina ){ this.sbtCollectionMaquina.unsubscribe(); }
    if( this.sbtCollectionSede ){ this.sbtCollectionSede.unsubscribe(); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
    // Destroy datatable
    if(this.dataTable){ this.dataTable.destroy(true);}
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filterMaquina: [''],
      filterSede: ['']
    });
  }

  sedeListar(): void {
    this.sbtCollectionSede = this.sedeService.obtener().subscribe(resultado => {
      this.listaSedes = resultado;
    });
  }
  maquinaListar(): void {
    this.sbtCollectionMaquina = this.maquinaService.obtenerMaquina().subscribe(resultado => {
      this.listaMaquinas = resultado;
    });
  }

  ngAfterViewInit(): void {
    const self = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      self.dataTable = dtInstance;

      dtInstance.on( 'select', function ( e, dt, type, indexes ) {
        self.selected = dtInstance.rows( { selected: true } ).count() ;
        if ( type === 'row' ) {
          self.maquinaSelected = dtInstance.rows('.selected').data()[0];
          self.idMaquinaSede = dtInstance.rows('.selected').data()[0].id;
        }
      } );
      dtInstance.on( 'deselect', function ( e, dt, type, indexes ) {
        self.maquinaSelected = null;
        self.selected = dtInstance.rows( { selected: true } ).count() ;
      } );
   });
  }
  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        let strFiltroNombre = this.frmFiltroGrilla.controls.filterMaquina.value;
        strFiltroNombre = strFiltroNombre === '' ? '' : strFiltroNombre;

        let intFiltroSede = this.frmFiltroGrilla.controls.filterSede.value;
         intFiltroSede =  intFiltroSede === '' ? 0 : parseInt(intFiltroSede, 10);
         this.spinner.show();
        if (strFiltroNombre === '')
        {
          this.sbtCollection = this.maquinaSedeService.obtener(0).subscribe(
            resultado => {
              callback({ data : resultado });
              this.spinner.hide();
            },
            error => {
              console.log('Error al obtener maquinas: ' + error);
              this.spinner.hide();
            }
          )
        } else {
          this.sbtCollection = this.maquinaSedeService.obtenerByFiltros(strFiltroNombre, intFiltroSede).subscribe(
            resultado => {
              callback({ data: resultado });
              this.spinner.hide();
            },
            error => {
              console.log('Error al obtener maquinas por filtro: ' + error);
              this.spinner.hide();
            }
          )
        }
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
        { title: 'ID', data: 'id', width: '4%', visible: false },
        { title: 'DESCRIPCION', data: 'descripcion', width: '20%' },
        { title: 'SEDE', data: 'sede', width: '20%' },
        { title: 'HORA INICIO', data: 'horaInicio', width: '20%' },
        { title: 'HORA TERMINO', data: 'horaFin', width: '20%' },
        { title: 'SERVICIO', data: 'servicio', width: '20%', render: (data,row,full) => {
          return data ? `<span class="rounded py-1 px-2 text-uppercase text-white small" style="background-color:${full.servicioColor}" >${full.servicio}</span>` : '';
        }},
        { title: 'TECNOLOGIAS', data: 'tecnologias', width: '20%', render: (data: Tecnologia[]) => {
            let output = '';
            data.forEach((x, i) => {
              output += `<span class="rounded py-1 px-2 text-uppercase text-white small bg-gradient ${i < (data.length - 1) ? 'mr-1' : ''}">${x.nombre}</span>`;
            })
            return output;
          }},
        { title: 'PERFILES', data: 'perfiles', width: '20%', render: (data: MaquinaSedePerfil[]) => {
            let output = '';
            data.forEach((x, i) => {
              output += `<span class="rounded py-1 px-2 text-uppercase text-white small bg-indigo ${i < (data.length - 1) ? 'mr-1' : ''}">${x.perfil}</span>`;
            })
            return output;
          }},
        { title: 'ESTADO', width: '5%', data: 'idEstado', render: (data) => {
          return (data === 1) ?
              '<span class="label theme-bg text-white f-12">ACTIVO</span>' :
              '<span class="label theme-bg2 text-white f-12">INACTIVO</span>';
          }
        },
        { title: 'FICTICIO', width: '5%', data: 'idFicticio', render: (data) => {
            return (data === 1) ?
              '<span class="label theme-bg text-white f-12">SI</span>' :
              '<span class="label theme-bg2 text-white f-12">NO</span>';
          }
        },
        { title: 'U. REGISTRO', width: '5%', data: 'usuarioRegistra'},
        { title: 'F. REGISTRO', width: '5%', data: 'fechaRegistra', render: (data: Date) => {
            return this.datePipe.transform(data,'dd-MM-yyyy')
          }
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
      pageLength: 20,
    };
  }

  maquinaSedeListar(): void {
    this.selected = 0;
    this.dataTable.ajax.reload();
  }
  maquinaSedeNuevo(modal: any): void {
    this.idMaquinaSede = 0;
    this.modalMaquinaSedeDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalMaquinaSedeDatosRef.result.then(result => this.maquinaSedeListar());
  }
  maquinaSedeEditar(modal: any): void {
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar una maquina', 'warning');
      return;
    }
    this.modalMaquinaSedeDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalMaquinaSedeDatosRef.result.then(result => this.maquinaSedeListar());
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
  maquinaSedeTecnologia(): void{
    if( !this.maquinaSelected ){
      this.utilsService.mostrarToast('Seleccionar una maquina', 'warning');
      return;
    }
    // console.log(this.maquinaSelected);
    const modal = this.modal.open(MdlMaquinasedeTecnologiaComponent, {size: 'lg mx-auto', windowClass: 'smodal round popins', keyboard: false });
    modal.componentInstance.IdServicio = this.maquinaSelected?.idServicio;
    modal.componentInstance.IdMaquinaSede = this.maquinaSelected?.id;
    modal.componentInstance.OnCreate.subscribe((res: boolean) => {
      if(res){
        this.dataTable.ajax.reload(null, false);
      }
    });
  }

  maquinaSedeAsignarPerfiles(): void{
    if( !this.maquinaSelected ){
      this.utilsService.mostrarToast('Seleccionar una maquina', 'warning');
      return;
    }

    const modalRef = this.modal.open(MdlMaquinaSedeAsignarPerfilesComponent, {size: 'md', windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    modalRef.componentInstance.IdMaquinaSede = this.maquinaSelected.id;
    modalRef.componentInstance.MaquinaSede = this.maquinaSelected;
    modalRef.componentInstance.OnCreated.subscribe((res) => {
      modalRef.close();
      this.dataTable.ajax.reload(null, false);
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
