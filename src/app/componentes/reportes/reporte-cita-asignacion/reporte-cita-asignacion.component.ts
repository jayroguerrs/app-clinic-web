import { DatePipe } from '@angular/common';
import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccionCita, AccionCronograma, CitaEstado, TipoPerfil} from '../../../shared/enumeracion/enums';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import Api = DataTables.Api;
import {MatBottomSheet} from "@angular/material/bottom-sheet";

import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {SedeService} from "../../../shared/services/sede.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {CitaAsignadaService} from "../../../shared/services/cita-asignada.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {Usuario} from "../../../shared/models";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-reporte-cita-asignacion',
  templateUrl: './reporte-cita-asignacion.component.html',
  styleUrls: ['./reporte-cita-asignacion.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('slideFromBottom', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(15px)' }),
        animate('300ms {{delay}}ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ], { params: { delay: 10 } })
    ]),
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class ReporteCitaAsignacionComponent implements OnInit, AfterViewInit, OnDestroy {

  frmFiltro: FormGroup;
  citas: any = [];
  citasSeleccionadas: number;
  maestroSede: any = [];
  maestroUsuarios: any = [];

  asigPendiente = 0;
  asigVisto = 0;
  asigTrabajado = 0;
  asigTotal = 0;

  diaSiguiente = 0;
  semanaSiguiente = 0;
  sinConfirmar = 0;
  reprogramada = 0;
  cancelada = 0;
  anulada = 0;
  usuarioActual: Usuario;
  idCita: number = 0;

  idUsuarioReasignacion: number = 0;
  nombreUsuarioReasignacion: string = '';

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Modals
  modalAsignacionRef: NgbModalRef;

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  dataTable: any;
  dataSelected: any | null;

  // Subscription
  sbcCollectionSede: Subscription;
  sbcCollectionUsuarios: Subscription;
  sbcCollection: Subscription;
  sbcMarcarVisto: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  mostrarReasignacion = false;

  dataUsuarios: Array<{id: string, text: string}> = [];

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timerProgressBar: true,
    confirmButtonText: 'IR',
    onOpen: (toast: any) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  citasAbandonadasEnEspera = 0;



  // Valores totales
  contarRegistrada = 0;
  contarPendiente = 0;
  contarConfirmada = 0;
  contarAsistenciaConfirmada = 0;
  contarReprogramada = 0;
  contarAtendida = 0;
  contarCancelada = 0;
  contarAnulada = 0;
  contarGenerado = 0;
  contarNoasistio = 0;
  contarTotal = 0;
  collapsed : boolean;
  collapsedResumen : boolean;


  fechaDesde: string;
  fechaHasta: string;

  tipoPerfil = TipoPerfil;
  usuario: Usuario;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  accAgeR: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private utilsService: UtilsService,
    private citaAsignadaService: CitaAsignadaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private modal: NgbModal,
    private permisoHelper: PermisoHelper,        
    private auditoriaService : AuditoriaService,    
  ) {
    this.usuario = this.usuarioService.UsuarioActual;
  }

  ngOnInit(): void {
    this.collapsed = true;
    this.collapsedResumen = false;
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.usuarioListar();
    this.buildtable();
    this.obtenerSedes();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accExf = accesos.accExf;
      this.accImp = accesos.accImp;  
      this.accAgeR = accesos.accAgeR;
    });
  }

  ngOnDestroy(): void {
    // Destroy modals
    if ( this.modalAsignacionRef ){ this.modalAsignacionRef.close(); }
    // Destroy subcription
    if ( this.sbcCollectionSede ){ this.sbcCollectionSede.unsubscribe(); }
    if ( this.sbcCollectionUsuarios ){ this.sbcCollectionUsuarios.unsubscribe(); }
    if ( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    if ( this.sbcMarcarVisto ){ this.sbcMarcarVisto.unsubscribe(); }
    this.Toast.close();
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      _this.dataTable = dtInstance;
      dtInstance.on('select', function (e, dt, type, indexes ) {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          _this.selected = dtInstance.rows({selected: true}).count();
          _this.dataSelected = data;
          _this.idCita = parseInt(data.idCitaString, 10);
          _this.verOpciones();
        }
      });

      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.dataSelected = null;
        _this.selected = dtInstance.rows({ selected: true }).count();
      });

    });
  }

  usuarioListar(): void {
    this.sbcCollectionUsuarios = this.usuarioService.obtenerUsuarios(true).subscribe(
      resultado => {
        this.maestroUsuarios = resultado;
        this.dataUsuarios = this.maestroUsuarios.map((x) => {
          return {
            id: x.idUsuario,
            text:x.nombre
          };
        });
        this.dataUsuarios.unshift({ id: '0', text: '...TODOS...' });
        // this.dataUsuarios.forEach(u => {
        //   const data = {
        //     id: u.idUsuario,
        //     text:u.nombre
        //   }
        // });
        // console.log(this.dataUsuarios);
      },
      error => console.log('Error al obtener los usuario', error)
    );
  }
  citaListar(): void{
    if( !!this.frmFiltro.controls.fechaDesde.value === true && this.frmFiltro.controls.asignadoA.value != '0' && this.frmFiltro.controls.tipoSiguiente.value != '0' ){
      this.mostrarReasignacion = true;
    }else{
      this.mostrarReasignacion = false;
    }
    this.dataTable.ajax.reload();
  }
  buildtable(): void{
    const usuarioX = this.usuarioActual;

    this.dtResponsiveOptions = {
      ajax: (_dataTablesParameters: any, callback) => {

        if(this.frmFiltro.invalid){
          this.utilsService.mostrarToast('Debe seleccionar una fecha', 'warning');
          callback({ data: [] });
          return;
        }

        const fechaDesde = this.frmFiltro.controls.fechaDesde.value;
        const fechaHasta = this.frmFiltro.controls.fechaHasta.value;
        const asignadoA = this.frmFiltro.controls.asignadoA.value;
        const tipoSiguiente = this.frmFiltro.controls.tipoSiguiente.value;
        const asignadoPor = this.frmFiltro.controls.asignadoPor.value;
        const idSede = this.frmFiltro.controls.idSede.value;

        this.spinner.show();
        this.sbcCollection = this.citaAsignadaService.obtenerListadoReporte(fechaDesde, fechaHasta, false, asignadoA, tipoSiguiente, asignadoPor, idSede, this.usuarioActual.idUsuario).subscribe(
          data => {
            this.asigPendiente = data.filter((d: any) => d.idEstadoAsignacion == 11).length;
            this.asigVisto = data.filter((d: any) => d.idEstadoAsignacion == 12).length;
            this.asigTrabajado = data.filter((d: any) => d.idEstadoAsignacion == 13).length;
            this.asigTotal = this.asigPendiente + this.asigVisto + this.asigTrabajado;

            this.contarRegistrada  = data.filter((f: any) => f.idEstadoCita === CitaEstado.REGISTRADA).length;
            this.contarConfirmada = data.filter((f: any) => f.idEstadoCita === CitaEstado.CONFIRMADA).length;
            this.contarAsistenciaConfirmada = data.filter((f: any) => f.idEstadoCita === CitaEstado.ASISTENCIACONFIRMADA).length;
            this.contarReprogramada = data.filter((f: any) => f.idEstadoCita === CitaEstado.REPROGRAMADA).length;
            this.contarAtendida = data.filter((f: any) => f.idEstadoCita === CitaEstado.ATENDIDA).length;
            this.contarCancelada = data.filter((f: any) => f.idEstadoCita === CitaEstado.CANCELADA).length;
            this.contarAnulada = data.filter((f: any) => f.idEstadoCita === CitaEstado.ANULADA).length;
            this.contarGenerado = data.filter((f: any) => f.idEstadoCita === CitaEstado.GENERADOPORSISTEMA).length;
            this.contarNoasistio = data.filter((f: any) => f.idEstadoCita === CitaEstado.NOASISTIO).length;
            this.contarPendiente = data.filter((f: any) => f.idEstadoCita === CitaEstado.PENDIENTE).length;
            this.contarTotal = data.length;

            callback({ data });
            this.spinner.hide();

            //marcar como visto las citas asignadas al operador
            let citaAsignada = [];
            if(this.usuarioActual.idperfil == TipoPerfil.OPERADOR || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA) {
              data.forEach(
                (item: any) => {
                  if(item.idEstadoAsignacion == 11)
                    citaAsignada.push({id : item.id});
                }
              );
              this.sbcMarcarVisto = this.citaAsignadaService.marcarVisto(citaAsignada).subscribe(
                resultado => {
                  console.log('Citas marcadas con visto', resultado);
                },
                error => {
                  console.log('No se pudo marcar como visto las citas consultadas', error);
                }
              );
            }
        },
          error => {
            console.log('Error al obtener los usuarios/operadores' + error);
            this.spinner.hide();
          }
        );
      },
      select: {
        selector: 'td:not(:first-child)'
      },
      searching: true,
      'columnDefs': [{
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
        { title: '',            data: 'id',                 width: "4%", visible: false },
        { title: 'CITA',        data: 'idCitaString',       width: "4%", visible: false},
        { title: 'CITA',        data: 'idCitaString',       width: "4%",
          render: (data: any, type, row) =>
          {
            switch(usuarioX.idperfil) {
              case TipoPerfil.OPERADOR :
              case TipoPerfil.ESPECIALISTA : {
                return  data;
              }
              default : {
                let link = '';
                if(row.idCronograma > 0){
                  link = `<a href='/Corporal360/Cronograma/${row.idCronograma}/${AccionCronograma.ASIGNARCITAS}/${row.idCliente}/0/${row.idCita}/${AccionCita.VER}' target='_blank'>${ data }</a>`;
                }else{
                  link = `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0/${row.idServicio}' target='_blank''>${ data }</a>`;
                }

                return link;
              }
            }
          }
        },
        { title: 'CLIENTE',     data: 'paciente',visible: false},
        { title: 'CLIENTE',     data: 'paciente',
          render: function (data, type, row) {
            switch(usuarioX.idperfil) {
              case TipoPerfil.OPERADOR :
              case TipoPerfil.ESPECIALISTA : {
                return  data;
              }
              default : {
                return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
              }
            }
          }
        },
        { title: 'DOCUMENTO',     data: 'numeroDocumento', visible: false},
        { title: 'TELEFONO',     data: 'telefono'},
        { title: 'ASIGNADO A',  data: 'asignadoA',           width: "15%", visible: false },
        { title: 'ASIGNADO A',  data: 'asignado',           width: "15%", render: (data, dd, row) => `<span title="${row.asignadoA}">${data}</span>` }  ,
        { title: 'FECHA LLAMAR',data: 'fechaConfirmacion',  width: "8%",  render: (data: any) => this.datePipe.transform(new Date(data),'dd/MM/yyyy') },
        { title: 'FECHA CITA',  data: 'fechaCita',          width: "8%",  render: (data: any) => this.datePipe.transform(new Date(data),'dd/MM/yyyy')},
        { title: 'HORA CITA',  data: 'horaInicio',          width: "8%",  render: (data: any) => `<span>${ (data == null) ? 'Sin hora' : data }</span>` },
        { title: 'TIPO',        data: 'tipo',               width: "10%", render: (data: any) => `<span>${ (data == 1) ? 'Dia siguiente' : (data == 2) ? 'Semana siguiente' : (data == 3) ? 'Cita Pasada' : 'Sin asignar' }</span>` },
        { title: 'ASIGNADO POR',data: 'asignadoPor',        width: "10%"},
        { title: 'ESTADO ASIG', data: 'estadoAsignacion',   width: "8%"},
        { title: 'ESTADO CITA', data: 'estadoCita',         width: "8%", render: (data, type, full, meta) => {
          return `<span class="text-white py-1 px-3 text-uppercase rounded small" style="background-color:${full.colorEstadoCita}">${full.estadoCita}</span>`;
        }},
        { title: 'ESTADO CITA', data: 'estadoCita', visible: false},
        { title: 'MOTIVO', data: 'motivo',         width: "8%"},
        { title: 'SEDE', data: 'sede',         width: "8%"},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [ {
        extend: 'excelHtml5',
        title:  () => {
          return `Reporte de Citas Asignadas del ${this.fechaDesde} al ${this.fechaHasta}`
        },
        text: 'Exportar Excel',
        className: 'btn btn-sm btn-secondary',
        exportOptions: {
          columns: [2,4,6,7,8,9,10,11,12,13,14,16,17,18],
        }
      }],
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
      // bLengthChange: false,
      "dom": "<'row'<'col-sm-12'><'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
    };
  }
  inicializarFormulario(): void {
    this.frmFiltro = this.formBuilder.group({
      fechaDesde: [new Date(), Validators.required],
      fechaHasta: [new Date(), Validators.required],
      asignadoA: [0],
      tipoSiguiente: [0],
      asignadoPor: [0],
      idSede: [0]
    });

    this.frmFiltro.get('fechaDesde').valueChanges.subscribe((v) => {
      if(v){
        this.fechaDesde = v;
      }
    });
    this.frmFiltro.get('fechaHasta').valueChanges.subscribe((v) => {
      if(v){
        this.fechaHasta = v;
      }
    });

    this.frmFiltro.patchValue({
      fechaDesde:  this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      fechaHasta:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
  }
  asignacionListar(): void {
    this.dataTable.ajax.reload();
  }
  obtenerSedes(): void {
    this.sbcCollectionSede = this.sedeService.obtener().subscribe(
      resultado => this.maestroSede = resultado,
      error => console.log("Error al obtener las sedes: ", error)
    );
  }
  irAsignacion(modal: NgbModalRef, reasignacion): void {
    this.idUsuarioReasignacion = 0;
    if(reasignacion) {
      //console.log(this.dataSelected)
      this.idUsuarioReasignacion = parseInt(this.frmFiltro.controls.asignadoA.value, 10);
      console.log(this.maestroUsuarios);
      this.nombreUsuarioReasignacion = this.maestroUsuarios.find(f => f.idUsuario == this.idUsuarioReasignacion)?.nombre;
    }
    this.modalAsignacionRef = this.utilsService.abrirModal(modal, 'xl');
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

  /********************************************************************************************************
   * Events
   */
  toggle() {
    this.collapsed = !this.collapsed;
  }
  toggleResumen() {
    this.collapsedResumen = !this.collapsedResumen;
  }
  expand() {
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }
  exportar(): void{    
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
