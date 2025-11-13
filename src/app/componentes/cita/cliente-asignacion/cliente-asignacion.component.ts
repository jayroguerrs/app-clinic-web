import { DatePipe } from '@angular/common';
import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SedeService } from 'src/app/shared/services/sede.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { CitaAsignadaService } from 'src/app/shared/services/cita-asignada.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import {EstadoAtencionClienteAsignado,TipoPerfil, EstadoClienteAsignado
} from '../../../shared/enumeracion/enums';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import Api = DataTables.Api;
import {MatBottomSheet} from "@angular/material/bottom-sheet";

import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";
import {CitaAsignacionOperadorFiltroComponent} from "../cita-asignacion-operador-filtro/cita-asignacion-operador-filtro.component";
import {MdlClienteAsignarOperadorComponent} from "../../modals/mdl-cliente-asignar-operador/mdl-cliente-asignar-operador.component";
import {ClienteAsignadoService} from "../../../shared/services/cliente-asignado.service";
import { ClienteAsignado } from 'src/app/shared/models/cliente';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {MdlVerCitasClienteAsignadoComponent} from "../../modals/mdl-ver-citas-cliente-asignado/mdl-ver-citas-cliente-asignado.component";
import {MdlClienteReasignarOperadorComponent} from "../../modals/mdl-cliente-reasignar-operador/mdl-cliente-reasignar-operador.component";
import { MdlClienteAsignadoHistorialComponent } from '../../modals/mdl-cliente-asignado-historial/mdl-cliente-asignado-historial.component';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { 
  AutocompleteOption, 
  AutocompleteConfig, 
  AutocompleteSelectionEvent 
} from '../../../shared/components/autocomplete-select';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-cliente-asignacion',
  templateUrl: './cliente-asignacion.component.html',
  styleUrls: ['./cliente-asignacion.component.scss'],
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
export class ClienteAsignacionComponent implements OnInit, AfterViewInit, OnDestroy {

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

  dataUsuarios: Array<{id: string, text: string}> = [];

  // Propiedades para autocomplete de sede
  sedeOptions: AutocompleteOption[] = [];
  sedeAutocompleteConfig: AutocompleteConfig = {
    placeholder: 'Seleccionar sede...',
    label: 'Sede',
    appearance: 'outline',
    searchable: true,
    clearable: false,
    prefixIcon: 'location_on',
    emptyMessage: 'No hay sedes disponibles'
  };

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
  contarTotal = 0;
  collapsed : boolean;
  collapsedResumen : boolean;


  modalRef: NgbModalRef;
  loading: boolean;
  collection: ClienteAsignado[] = [];
  estadoAtencionClienteAsignado = EstadoAtencionClienteAsignado;
  estadoClienteAsignado = EstadoClienteAsignado;
  clienteAsignadoSelected = null;

  filtrarAsignadoA = 0;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accImp: boolean = false;
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
    private api: ClienteAsignadoService,
    private permisoHelper: PermisoHelper
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.collapsed = true;
    this.collapsedResumen = false;
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.usuarioListar();
    this.buildtable();
    this.obtenerCitasEnEspera();
    this.obtenerSedes();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accImp = accesos.accImp;  
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
    this.modalRef?.close();
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      _this.dataTable = dtInstance;
      dtInstance.on('select', function (e, dt, type, indexes ) {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          _this.selected = dtInstance.rows({selected: true}).count();
          _this.dataSelected = data;
          _this.clienteAsignadoSelected = data;
          _this.verOpciones();
        }
      });

      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.dataSelected = null;
        _this.selected = dtInstance.rows({ selected: true }).count();
        _this.clienteAsignadoSelected = null;
      });

    });

    setTimeout(() => {
      if(this.accTot || this.accExc){
        $('#btnExportar').show();        
      }
      else{
        $('#btnExportar').hide();      
      }
    }, 200); 
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
    if( !!this.frmFiltro.controls.filtroFecha.value === true && this.frmFiltro.controls.asignadoA.value != '0' && this.frmFiltro.controls.tipoSiguiente.value != '0' ){
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
          this.collection = [];
          callback({ data: [] });
          return;
        }

        const fechaConfirmacion = this.frmFiltro.controls.filtroFecha.value;
        const tipoCliente = parseInt( this.frmFiltro.controls.tipoCliente.value, 10);
        const tipoSiguiente = parseInt(this.frmFiltro.controls.tipoSiguiente.value, 10);
        const idSede = parseInt(this.frmFiltro.controls.idSede.value, 10);
        const asignadoA = parseInt(this.frmFiltro.controls.asignadoA.value, 10);
        const asignadoPor = parseInt( this.frmFiltro.controls.asignadoPor.value, 10);

        // this.spinner.show();
        this.loading = true;
        this.sbcCollection = this.api.obtenerAsignados(fechaConfirmacion, tipoCliente, tipoSiguiente, idSede, asignadoA, asignadoPor).subscribe(
          (data: ClienteAsignado[] | ErrorSistema) => {


            if(data instanceof ErrorSistema){

            }else{
              this.collection = data;
              callback({ data });
            }

            // this.spinner.hide();
            this.loading = false;

        },
          error => {
            this.collection = [];
            callback({ data: [] });
            console.log('Error al obtener los usuarios/operadores' + error);
            // this.spinner.hide();
            this.loading = false;
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
        { title: 'CLIENTE', data: 'nombres', visible: false, render: (data, xhr, row)=>{
          return `${row.nombres} ${row.apellidos}`;
        }},
        { title: 'CLIENTE', data: 'nombres', render: (data: any, type, row) =>{
            return `${row.nombres} ${row.apellidos}`;
        }},
        { title: 'FECHA ASISTENCIA', data: 'fechaCita',       width: "4%", render: (data: Date, type, row) =>{
            return this.datePipe.transform(data,'dd/MM/yyyy');
          }},
        // { title: 'HORA ASISTENCIA', data: 'fechaCita',       width: "4%", render: (data: Date, type, row) =>{
        //     return this.datePipe.transform(data,'hh:mm:ss a');
        //   }},
        { title: 'CELULAR', data: 'telefono',       width: "4%"},
        { title: 'ASIGNADO A', data: 'usuarioOperador', width: "4%", render: (data: Date, type, row) =>{
            return `<span title="${row.usuarioOperadorNombre}">${row.usuarioOperador}</span>`;
          }},
        {title: 'TIPO', data: 'tipo'},
        { title: 'ASIGNADO POR', data: 'usuarioRegistro', width: "4%", render: (data: Date, type, row) =>{
            return `<span title="${row.usuarioRegistroNombre}">${row.usuarioRegistro}</span>`;
          }},
        { title: 'ESTADO ASIG.', data: 'estado', width: "115px", className: 'e_asignado', render: (data, type, row) => {
            return `<span class="text-white fw-semibold rounded-md text-white px-2 w-100px text-center" style="background-color: ${row.estadoColor}">${data}</span>`;
        }},
        { title: 'ESTADO CLIENTE', data: 'estadoCliente', render: (data: number,xhr,row) => {
            return row.idEstadoCliente ? `<span class="text-uppercase text-white fw-semibold rounded-md px-3" style="background-color: ${row.estadoClienteColor}">${data}</span>` : '';
          }},
        { title: 'T. CLIENTE', data: 'tipoCliente', width: "4%"},
        { title: 'SEDE', data: 'sede', width: "4%"},
        { title: 'CITAS', data: null, width: '60px' , className: 'all', visible: true, target: 0, responsivePriority: 10, orderable: false, render: (data, type, row) =>{
          return `<button title="Ver citas" data-idcliente="${data.idCliente}" class="btnVerCita btn btn-icon w-25px h-25px rounded btn-indigo m-0 mx-auto d-inline-block"><i class="fa-duotone fa-eye fs-14px"></i></button>`
        }},

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
        },
        init: function (api, node, config) {
          $(node).attr('id', 'btnExportar'); // Asigna el id al segundo botón
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
      createdRow: (row, data, dataIndex) => {
        // $('td.e_asignado', row).css('background-color', data.estadoColor);
        // $('td.e_asignado', row).css('text-align', 'center');

        // if(match_result=="2-2"){$('td', row).eq(5).css('background-color', 'Orange');}
        row.querySelector('.btnVerCita').addEventListener('click', () => {

          this.modalRef = this.modal.open(MdlVerCitasClienteAsignadoComponent, {size: "xl", windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false,  animation: true, backdrop: "static"});
          this.modalRef.componentInstance.Id = data.id;
          this.modalRef.componentInstance.IdCliente = data.idCliente;
          this.modalRef.componentInstance.Fecha = this.datePipe.transform(data.fechaCita, 'yyyy-MM-dd');

        });
      },
      // bLengthChange: false,
      "dom": "<'row'<'col-sm-12'B><'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'<'table-responsive'tr>>>" +
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
    this.frmFiltro.get('asignadoA').valueChanges.subscribe((res) => {
      this.filtrarAsignadoA = parseInt(res, 10);
    });
  }
  asignacionListar(): void {
    this.dataTable.ajax.reload();
  }
  obtenerSedes(): void {
    this.sbcCollectionSede = this.sedeService.obtener().subscribe(
      (resultado: any) => {
        this.maestroSede = resultado;
        // Convertir sedes a opciones de autocomplete
        this.convertirSedesAOpciones(resultado);
      },
      (error: any) => console.log("Error al obtener las sedes: ", error)
    );
  }

  private convertirSedesAOpciones(sedes: any[]): void {
    // Agregar opción "TODOS" al inicio
    this.sedeOptions = [
      { id: 0, text: '...TODOS...', icon: 'select_all' },
      ...sedes.map(sede => ({
        id: sede.idSede,
        text: sede.nombre,
        icon: 'location_on',
        metadata: sede
      }))
    ];
  }

  onSedeSelected(event: AutocompleteSelectionEvent): void {
    // Actualizar el valor del formulario reactivo
    this.frmFiltro.patchValue({
      idSede: event.option.id
    });
    
    // Ejecutar la búsqueda de citas
    this.citaListar();
  }
  irAsignacion(): void {
    const reasignacion = 0;
    this.idUsuarioReasignacion = 0;
    if(reasignacion) {
      //console.log(this.dataSelected)
      this.idUsuarioReasignacion = parseInt(this.frmFiltro.controls.asignadoA.value, 10);
      // console.log(this.maestroUsuarios);
      this.nombreUsuarioReasignacion = this.maestroUsuarios.find(f => f.idUsuario == this.idUsuarioReasignacion)?.nombre;
    }
    this.modalAsignacionRef = this.modal.open(MdlClienteAsignarOperadorComponent,{size: ' w-100 max-w-1400px rounded-15px overflow-hidden'});
    this.modalAsignacionRef.componentInstance.OnSaved.subscribe((res) => {
      this.dataTable.ajax.reload();
    });
  }

  irReAsignacion(): void {
    const filtro = {
       fechaConfirmacion : this.frmFiltro.controls.filtroFecha.value,
       tipoCliente : parseInt(this.frmFiltro.controls.tipoCliente.value, 10),
       tipoSiguiente : parseInt(this.frmFiltro.controls.tipoSiguiente.value, 10),
       idSede : parseInt(this.frmFiltro.controls.idSede.value, 10),
       asignadoA : parseInt(this.frmFiltro.controls.asignadoA.value, 10),
       asignadoPor : parseInt(this.frmFiltro.controls.asignadoPor.value, 10)
    }

    this.modalAsignacionRef = this.modal.open(MdlClienteReasignarOperadorComponent,{size: ' w-100 max-w-1400px rounded-15px overflow-hidden'});
    this.modalAsignacionRef.componentInstance.filtro = filtro;
    this.modalAsignacionRef.componentInstance.OnSaved.subscribe((res) => {
      this.dataTable.ajax.reload();
    });
  }

  evtAsignacionFiltro(): void{
    this.modalAsignacionRef = this.modal.open(CitaAsignacionOperadorFiltroComponent,{size: "xl", windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false,  animation: true, backdrop: "static"});
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
   * Functions
   */
  countStates(estadoAsignado: EstadoAtencionClienteAsignado): number{
    return this.collection.filter(c => c.idEstado === estadoAsignado).length;
  }
  countStatesClient(estadoClienteAsignado: EstadoClienteAsignado): number{
    // console.log(estadoClienteAsignado);
    // console.log(this.collection.filter(c => c.idEstadoCliente === estadoClienteAsignado));
    return this.collection.filter(c => c.idEstadoCliente === estadoClienteAsignado).length;
  }
  countStatesClientSinTrabajar(): number{
    return this.collection.filter(c => !c.idEstadoCliente).length;
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

  evtShowHistory(): void{
    this.modalRef = this.modal.open(MdlClienteAsignadoHistorialComponent, {size: 'md', windowClass: 'smodal fade2 round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.IdClientAsignado = this.clienteAsignadoSelected.id;
  }


}
