import {
  Component,
  Renderer2,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  TemplateRef
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { GeneroService } from '../../../shared/services/genero.service';
import { ZonaCorporalService } from '../../../shared/services/zona-corporal.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {DocumentoTipoPerfil} from "../../../shared/models/documento";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { DatePipe } from '@angular/common';
import {MdlZonaSesionTratamientoComponent} from "../../modals/mdl-zona-sesion-tratamiento/mdl-zona-sesion-tratamiento.component";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'zona-corporal-listado.component.html',
  styleUrls: [ './zona-corporal-listado.scss'],
  providers: [DatePipe]
})

export class ZonaCorporalListadoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('div') div: ElementRef;
  idZonaCorporal = 0;
  frmFiltroGrilla: FormGroup;
  maestroGeneros: any = [];
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Modales
  modalZonaCorporalDatosRef: NgbModalRef;
  modalZonaCorporalSubZonasRef: NgbModalRef;


  // Subscription
  collectionSubscription: Subscription;
  sbcCollectionGenero: Subscription;

  // datatable
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  dataTable: any
  selected = 0;
  zonaCorporal : any = null;

  zonasCollection: any[] = [];

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;


  modal: NgbModalRef | undefined;

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
      private zonaCorporalService: ZonaCorporalService,
      private formBuilder: FormBuilder,
      private utilsService: UtilsService,
      private generoService: GeneroService,
      private spinner: NgxSpinnerService,
      private el: ElementRef,
      private renderer: Renderer2,
      private bottomSheet: MatBottomSheet,
      private datePipe: DatePipe,
      private modalService: NgbModal,
      private permisoHelper: PermisoHelper,      
      private usuarioService: UsuarioService,
      private auditoriaService : AuditoriaService,
      private router: Router,
  ) { }

  ngOnInit() {
    this.inicializarFormulario();
    this.generoListar();
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
    if(this.collectionSubscription){ this.collectionSubscription.unsubscribe(); }
    if(this.sbcCollectionGenero){ this.sbcCollectionGenero.unsubscribe(); }
    // Destroy modales
    if(this.modalZonaCorporalDatosRef){ this.modalZonaCorporalDatosRef.close(); }
    if(this.modalZonaCorporalSubZonasRef){ this.modalZonaCorporalSubZonasRef.close(); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
    // Destroy datatable
    if(this.dataTable){ this.dataTable.destroy(true);}

    this.modal?.close();
  }

  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

      dtInstance.on( 'select', ( e, dt, type, indexes ) =>  {
        this.selected = dtInstance.rows( { selected: true } ).count() ;
        if ( type === 'row' ) {
          this.idZonaCorporal = dtInstance.rows('.selected').data()[0].id;
          this.zonaCorporal = dtInstance.rows('.selected').data()[0];
          this.verOpciones();
        }
      });
      dtInstance.on( 'deselect', ( e, dt, type, indexes ) => {
        this.selected = dtInstance.rows( { selected: true } ).count() ;
        this.zonaCorporal = null;
      });

    });
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filterZonaCorporal: ['']
    });
  }

  generoListar(): void {
    this.sbcCollectionGenero = this.generoService.obtenerTodos().subscribe(resultado => {
      this.maestroGeneros = resultado;
    });
  }
  buildtable() {
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        const strFiltro = this.frmFiltroGrilla.controls.filterZonaCorporal.value;
        const mensajeError = 'Error al obtener zonas corporales ';
        this.spinner.show();

        strFiltro === '' ?
        this.collectionSubscription =  this.zonaCorporalService.obtenerListadoGrilla().subscribe(
          data => {
            // console.log(data);
            callback({ data });
            this.zonasCollection = data;
            this.spinner.hide();
          },
          error => {
            console.log(mensajeError + error);
            this.spinner.hide();
          }
        )
        :
          this.collectionSubscription = this.zonaCorporalService.obtenerZonasCorporalesByNombre(strFiltro).subscribe(
          data => {
            callback({ data });
            this.zonasCollection = data;
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
        { title: 'CODIGO',  data: 'id',visible: false, className : 'align-middle', render: (data) => {
            return 'Z-' + data.toString().padStart(5,'0');
          } },
        { title: 'IMAGEN',  data: 'imagen',visible: false, className : 'align-middle', render: ( data: string | null ) => {
          return data ? `<img src="${data}" width="50" height="auto">` : '';
        }},
        { title: 'URL',  data: 'urlWeb',visible: false, className : 'align-middle', render: ( data: string | null ) => {
          return data ? `<a href="${data}" target="_blank">${data}</a>` : '';
        }},
        { title: 'DESCRIPCIÓN',  data: 'descripcion', className : 'align-middle'  },
        { title: 'DESCRIPCIÓN LARGA',  data: 'descripcionLarga',  className : 'align-middle'  },
        { title: 'SERVICIO', data: 'servicio', width: '20%', render: (data,row,full) => {
            return data ? `<span class="rounded py-1 px-2 text-uppercase text-white small" style="background-color:${full.servicioColor}" >${full.servicio}</span>` : '';
        }},
        { title: 'DURACIÓN (min.)', data: 'duracion', className : 'align-middle' },
        { title: 'GENERO', data: 'genero', className : 'align-middle' },
        { title: 'ACTIVO',data: 'idEstado',render: function (data, type, row) {
            if (data == 1) {
              return '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>';
            } else if (data == 2) {
              return '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>';
            }else{
              return '<span class="small theme-bg text-white p-1 estado rounded"></span>';
            }
          }, className : 'align-middle'
        },
        { title: 'TIPO',data: 'idTipo',render: function (data, type, row) {
            switch (data){
              case 1: return 'UNIDAD';
              case 2: return 'PACK';
              case 3: return 'MEDIO PACK';
              case 4: return 'TRIO';
              case 5: return 'DUO';
              default: return data;
            }
          }, className : 'align-middle'
        },
        { title: 'PRECIO BASE', data: 'precioBase', className : 'align-middle text-right', render: (data: number) => {
          return `S/ ${data.toFixed(2)}`;
        }},
        { title: 'PRECIO DSCTO.', data: 'precioDescuento', className : 'align-middle text-right', render: (data: number) => {
            return `S/ ${data.toFixed(2)}`;
        }},
        { title: 'SUBZONAS',data: 'subZonas',render: function (data: any[], type, row) {
            let output = '';
            data.forEach( (zona: any) => {
              output += `<div class="rounded bg-info text-white px-2 py-1 d-inline-block mr-2 my-1 small">${zona.descripcion}</div>`;
            });
            return output;
          }, className : 'align-middle'
        },
        { title: 'ZONAS REL.',data: 'zonasRelArray',render: (data: any[], type, row)  => {
            // console.log(this.zonasCollection);

            let output = '';
            data.forEach( (zona: any) => {
              output += `<div class="rounded bg-warning text-white px-2 py-1 d-inline-block mr-2 my-1 small">${zona.descripcion}</div>`;
            });
            return output;
          }, className : 'align-middle'
        },
        { title: 'U. REG.',data: 'usuarioRegistro', className : 'align-middle'},
        { title: 'F. REG', data: 'fechaRegistro', className : 'align-middle ', render: (data: number) => {
            return this.datePipe.transform(new Date(data), 'dd-MM-yyyy');
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

  zonaCorporalListar(reset:boolean = true): void {
    this.selected = 0;
    this.dataTable.ajax.reload(null,reset);
  }
  zonaCorporalNuevo(modal: any): void {
    this.idZonaCorporal = 0;
    this.modalZonaCorporalDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalZonaCorporalDatosRef.result.then(result =>  this.zonaCorporalListar());
  }
  zonaCorporalEditar(modal: any): void {
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar una zona', 'warning');
      return;
    }
    this.modalZonaCorporalDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalZonaCorporalDatosRef.result.then(result =>  this.zonaCorporalListar(false));
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
  asignarSubZonas(modal: any): void{
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar una zona', 'warning');
      return;
    }
    this.modalZonaCorporalSubZonasRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalZonaCorporalSubZonasRef.result.then(result => {
      if( result ){
        this.zonaCorporalListar(false);
      }
    });
  }


  asignarTratamientos(): void{
    if( !this.zonaCorporal ){
      this.utilsService.mostrarToast('Seleccionar una zona', 'warning');
      return;
    }
    this.modal = this.modalService.open(MdlZonaSesionTratamientoComponent, {size: ' max-w-800px mx-auto', windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: true,  animation: true, backdrop: "static" });
    this.modal.componentInstance.Zona = this.zonaCorporal;
    this.modal.componentInstance.IdServicio = this.zonaCorporal.idServicio;
    this.modal.componentInstance.OnSaved.subscribe((res) => {
        this.modal.close();
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
