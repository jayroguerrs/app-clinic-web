import { DatePipe } from '@angular/common';
import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SedeService } from 'src/app/shared/services/sede.service';
import {NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { CitaAsignadaService } from 'src/app/shared/services/cita-asignada.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import Api = DataTables.Api;
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AccionCita, AccionCronograma, TipoPerfil} from 'src/app/shared/enumeracion/enums';
import {MdlCitaAbandonadaAsignacionOperadorComponent} from "../../componentes/modals/mdl-cita-abandonada-asignacion-operador/mdl-cita-abandonada-asignacion-operador.component";
import {MdlCitaAbandonadaEnEsperaAsignacionOperadorComponent} from "../../componentes/modals/mdl-cita-abandonada-en espera-asignacion-operador/mdl-cita-abandonada-en-espera-asignacion-operador.component";

import Swal from 'sweetalert2';

@Component({
  templateUrl: './citas-abandonadas-asignacion.component.html',
  styleUrls: ['./citas-abandonadas-asignacion.component.scss'],
  providers: [DatePipe]
})
export class CitasAbandonadasAsignacionComponent implements OnInit, AfterViewInit, OnDestroy {
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

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true
  });
  citasAbandonadasEnEspera = 0;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private utilsService: UtilsService,
    private citaAsignadaService: CitaAsignadaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.obtenerCitasEnEspera();

    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.usuarioListar();
    this.buildtable();

    this.frmFiltro.get('asignadoA').valueChanges.subscribe((res) => {
      this.citaListar();
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
    if( this.f.filtroFecha.value && this.f.asignadoA.value !== '0' ){
      this.mostrarReasignacion = true;
    }else{
      this.mostrarReasignacion = false;
    }
    if(this.dataTable){this.dataTable.ajax.reload()};
  }
  buildtable(): void{
    const usuarioX = this.usuarioActual;

    this.dtResponsiveOptions = {
      ajax: (_dataTablesParameters: any, callback) => {

        const fechaConfirmacion = this.frmFiltro.controls.filtroFecha.value;
        const asignadoA = this.frmFiltro.controls.asignadoA.value;
        const asignadoPor = this.frmFiltro.controls.asignadoPor.value;

        this.spinner.show();
        this.sbcCollection = this.citaAsignadaService.obtenerListadoAbadonados(fechaConfirmacion, false, asignadoA, asignadoPor, this.usuarioActual.idUsuario).subscribe(
          (res: any) => {
            // console.log(res);
            this.asigPendiente = res.data.filter((d: any) => d.idEstadoAsignacion == 11).length;
            this.asigVisto = res.data.filter((d: any) => d.idEstadoAsignacion == 12).length;
            this.asigTrabajado = res.data.filter((d: any) => d.idEstadoAsignacion == 13).length;
            this.asigTotal = this.asigPendiente + this.asigVisto + this.asigTrabajado;
            callback({ data : res.data });
            this.spinner.hide();

            //marcar como visto las citas asignadas al operador
            let citaAsignada = [];
            if(this.usuarioActual.idperfil == TipoPerfil.OPERADOR || this.usuarioActual.idperfil == TipoPerfil.ESPECIALISTA) {
              res.data.forEach(
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
        { title: 'ASIGNADO A',  data: 'asignado',           width: "15%", render: (data, dd, row) => `<span title="${row.asignadoA}">${data}</span>` }  ,
        { title: 'FECHA LLAMAR',data: 'fechaConfirmacion',  width: "8%",  render: (data: any) => `<span>${ (data == null) ? 'Sin fecha' : this.utilsService.formato_FechaString(data) }</span>` },
        { title: 'FECHA CITA',  data: 'fechaCita',          width: "8%",  render: (data: any) => `<span>${ (data == null) ? 'Sin fecha' : this.utilsService.formato_FechaString(data) }</span>` },
        { title: 'HORA CITA',  data: 'horaInicio',          width: "8%",  render: (data: any) => `<span>${ (data == null) ? 'Sin hora' : data }</span>` },
        { title: 'TIPO',        data: 'tipo',               width: "10%", render: (data: any) => `<span>${ (data == 1) ? 'Dia siguiente' : (data == 2) ? 'Semana siguiente' : 'Sin asignar' }</span>` },
        { title: 'ASIGNADO POR',data: 'asignadoPor',        width: "10%"},
        { title: 'ESTADO ASIG', data: 'estadoAsignacion',   width: "8%"},
        { title: 'ESTADO CITA', data: 'estadoCita',         width: "8%", render: (data,dd,row) => `<span class="px-2 rounded text-white" style="background-color:${row.colorEstadoCita}">${data}</span>`},
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
      bLengthChange: false
    };
  }
  inicializarFormulario(): void {
    this.frmFiltro = this.formBuilder.group({
      filtroFecha: [new Date()],
      asignadoA: ['0'],
      asignadoPor: ['0']
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

  irAsignacion( reasignacion: boolean): void {
    this.idUsuarioReasignacion = 0;
    if(reasignacion) {
      //console.log(this.dataSelected)
      this.idUsuarioReasignacion = parseInt(this.frmFiltro.controls.asignadoA.value, 10);
      // console.log(this.maestroUsuarios);
      this.nombreUsuarioReasignacion = this.maestroUsuarios.find(f => f.idUsuario == this.idUsuarioReasignacion)?.nombre;
    }

    const modalRef = this.modalService.open(MdlCitaAbandonadaAsignacionOperadorComponent,{size:'xl'});
    modalRef.componentInstance.idUsuarioReasignacion = this.idUsuarioReasignacion;
    modalRef.componentInstance.nombreReasignado = this.nombreUsuarioReasignacion;
  }

  irAsignacionEnEspera( reasignacion: boolean): void {
    this.idUsuarioReasignacion = 0;
    if(reasignacion) {
      //console.log(this.dataSelected)
      this.idUsuarioReasignacion = parseInt(this.frmFiltro.controls.asignadoA.value, 10);
      // console.log(this.maestroUsuarios);
      this.nombreUsuarioReasignacion = this.maestroUsuarios.find(f => f.idUsuario == this.idUsuarioReasignacion)?.nombre;
    }

    const modalRef = this.modalService.open(MdlCitaAbandonadaEnEsperaAsignacionOperadorComponent,{size:'xl'});
    modalRef.componentInstance.idUsuarioReasignacion = this.idUsuarioReasignacion;
    modalRef.componentInstance.nombreReasignado = this.nombreUsuarioReasignacion;
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

  get f(): any{
    return this.frmFiltro.controls;
  }

  obtenerCitasEnEspera(): void{
    if(![TipoPerfil.SA, TipoPerfil.SISTEMAS, TipoPerfil.SUPERVISOR, TipoPerfil.ADMINISTRADOR].includes(this.usuarioService.UsuarioActual.idperfil)){
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
              title: `Tiene ${this.citasAbandonadasEnEspera} citas abandonadas que estan en espera por confirmar para el día de hoy`,
              position: 'bottom-end',
              background: '#FFFFBB'
            });
          }
      },
      error => {
        console.log('Error al obtener las citas abandonadas' + error);
      }
    );
  }

}
