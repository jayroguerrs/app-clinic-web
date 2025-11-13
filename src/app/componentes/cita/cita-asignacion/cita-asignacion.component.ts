import { DatePipe } from '@angular/common';
import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SedeService } from 'src/app/shared/services/sede.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { CitaAsignadaService } from 'src/app/shared/services/cita-asignada.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import {AccionCita, AccionCronograma, CitaEstado, TipoPerfil} from '../../../shared/enumeracion/enums';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import Api = DataTables.Api;
import {MatBottomSheet} from "@angular/material/bottom-sheet";

import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";
import {CitaAsignacionOperadorFiltroComponent} from "../cita-asignacion-operador-filtro/cita-asignacion-operador-filtro.component";

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-cita-asignacion',
  templateUrl: './cita-asignacion.component.html',
  styleUrls: ['./cita-asignacion.component.scss'],
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
export class CitaAsignacionComponent implements OnInit, AfterViewInit, OnDestroy {

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
  dataTable: Api;
  dataSelected: any | null;

  // Subscription
  sbcCollectionSede: Subscription;
  sbcCollectionUsuarios: Subscription;
  sbcCollection: Subscription;
  sbcMarcarVisto: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  mostrarReasignacion = false;

  dataUsuarios: Array<{ id: number; text: string }>;

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
  contarNollamar = 0;
  contarNoasistio = 0;
  contarTotal = 0;
  collapsed : boolean;
  collapsedResumen : boolean;


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
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.collapsed = true;
    this.collapsedResumen = false;
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.usuarioListar();
    this.buildtable();
    this.obtenerCitasEnEspera();
    this.obtenerSedes();
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
            id: Number(x.idUsuario),
            text: x.nombre
          };
        });
        this.dataUsuarios.unshift({ id: 0, text: '...TODOS...' });
      },
      error => console.log('Error al obtener los usuario', error)
    );
  }
citaListar(): void{
    if (!!this.frmFiltro.controls.filtroFecha.value === true
        && this.frmFiltro.controls.asignadoA.value != 0
        && this.frmFiltro.controls.tipoSiguiente.value != 0 ){
      this.mostrarReasignacion = true;
    } else {
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

        const fechaConfirmacion = this.frmFiltro.controls.filtroFecha.value;
        const asignadoA = this.frmFiltro.controls.asignadoA.value;
        const tipoSiguiente = this.frmFiltro.controls.tipoSiguiente.value;
        const asignadoPor = this.frmFiltro.controls.asignadoPor.value;
        const idSede = this.frmFiltro.controls.idSede.value;
        const tipoCliente = parseInt( this.frmFiltro.controls.tipoCliente.value, 10);

        this.spinner.show();
        this.sbcCollection = this.citaAsignadaService.obtenerListado(fechaConfirmacion, false, asignadoA, tipoSiguiente, asignadoPor, idSede, this.usuarioActual.idUsuario, tipoCliente).subscribe(
          data => {
            console.log(data);
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
            this.contarNollamar = data.filter((f: any) => f.idEstadoCita === CitaEstado.NOLLAMAR).length;
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
        { title: 'TELEFONO',     data: 'telefono'},
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
        { title: 'T. CLIENTE', data: 'tipoCliente',         width: "8%"},
        { title: 'SEDE', data: 'sede',         width: "8%"},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [ {
        extend: 'excelHtml5',
        title: 'Citas Asignadas',
        text: 'Exportar Excel',
        className: 'btn btn-sm btn-secondary',
        exportOptions: {
          columns: [2,4,6,7,8,9,10,11,12,13,15,16,17,18],
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
      "dom": "<'row'<'col-sm-12'B><'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
    };
  }
  inicializarFormulario(): void {
    this.frmFiltro = this.formBuilder.group({
      filtroFecha: [new Date(), Validators.required],
      asignadoA: [0],
      tipoSiguiente: [0],
      asignadoPor: [0],
      idSede: [0],
      tipoCliente: [2]
    });
    this.frmFiltro.patchValue({
      filtroFecha:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')
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

  evtAsignacionFiltro(): void{
    this.modalAsignacionRef = this.modal.open(CitaAsignacionOperadorFiltroComponent,{size: "xl max-w-1400px", windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false,  animation: true, backdrop: "static"});
    this.modalAsignacionRef.componentInstance.idUsuarioReasignacion = this.idUsuarioReasignacion;
    this.modalAsignacionRef.componentInstance.nombreReasignado = this.nombreUsuarioReasignacion;
    this.modalAsignacionRef.componentInstance.OnSaved.subscribe((res) => {

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


  obtenerCitasEnEspera(): void{

    if(![TipoPerfil.SA, TipoPerfil.SISTEMAS, TipoPerfil.SUPERVISOR, TipoPerfil.ADMINISTRADOR].includes(this.usuarioActual.idperfil)){
      return;
    }

    this.citaAsignadaService.obtenerAbandonadosEnEspera(this.datePipe.transform(new Date(),'yyyy-MM-dd')).subscribe(
      (res: any) => {
        if(res.status === 200){
          this.citasAbandonadasEnEspera = res.data.length;
        }

        if(this.citasAbandonadasEnEspera){
          this.Toast.fire({
            icon: 'info',
            title: `Tiene ${this.citasAbandonadasEnEspera} citas asignadas que estan en espera por confirmar para el día de hoy`,
            position: 'bottom-end',
            background: '#FFFFBB',
            timer: 5000
          }).then((res) => {
            if(res.isConfirmed){
              this.router.navigate([`/CitaAsignacion`]);
            }
          });
        }
      },
      error => {
        console.log('Error al obtener las citas asignadas' + error);
      }
    );
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


}
