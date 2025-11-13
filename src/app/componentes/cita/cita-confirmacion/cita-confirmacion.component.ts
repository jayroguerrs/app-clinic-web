import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild, TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import {AccionCita, AccionCronograma, TipoPerfil} from 'src/app/shared/enumeracion/enums';
import { CitaAsignadaService } from 'src/app/shared/services/cita-asignada.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {DataTableDirective} from "angular-datatables";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-cita-confirmacion',
  templateUrl: './cita-confirmacion.component.html',
  styleUrls: ['./cita-confirmacion.component.scss'],
  providers: [DatePipe]
})
export class CitaConfirmacionComponent implements OnInit, OnDestroy, AfterViewInit {

  frmFiltro: FormGroup;
  citas: any = [];
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
  citaSelected: any | undefined;
  idCliente: number = 0;
  idUsuarioReasignacion: number = 0;
  nombreUsuarioReasignacion: string = '';

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Modals
  modalAsignacionRef: NgbModalRef;

  // Subscription
  sbcCollectionUsuario: Subscription;
  sbcCollectionCitaAsignada: Subscription;
  sbcCitaMarcarVisto: Subscription;

  // Datatable
  dataTable: any;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  citasSeleccionadas: number;
  selected = 0;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private citaAsignadaService: CitaAsignadaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.usuarioListar();
    this.buildtable();
  }
  ngOnDestroy(): void {
    // Destroy modals
    if ( this.modalAsignacionRef ){ this.modalAsignacionRef.close(); }
    // Destroy subscriptions
    if( this.sbcCitaMarcarVisto ){ this.sbcCitaMarcarVisto.unsubscribe(); }
    if( this.sbcCollectionCitaAsignada ){ this.sbcCollectionCitaAsignada.unsubscribe(); }
    if( this.sbcCollectionUsuario ){ this.sbcCollectionUsuario.unsubscribe(); }
  }
  ngAfterViewInit(): void {
    // const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

      dtInstance.on('select',  (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          this.citaSelected = data;
          this.idCita = parseInt(data.idCitaString, 10);
          this.idCliente = parseInt(data.idCliente, 10);
          this.verOpciones();
        }
        this.selected = dtInstance.rows({ selected: true }).count();
      });
      dtInstance.on('deselect',  (e, dt, type, indexes ) => {
        this.citaSelected = undefined;
        this.selected = dtInstance.rows({ selected: true }).count();
      });
    });
  }

  usuarioListar(): void {
    this.sbcCollectionUsuario = this.usuarioService.obtenerUsuarios(true).subscribe(
      resultado => this.maestroUsuarios = resultado,
      error => console.log('Error al obtener los usuario', error)
    );
  }
  citaListar(): void{
    this.dataTable.ajax.reload();
  }
  buildtable(): void{
    const usuarioX = this.usuarioActual;

    this.dtResponsiveOptions = {
      ajax: (_dataTablesParameters: any, callback) => {

        const fechaConfirmacion = this.frmFiltro.controls.filtroFecha.value;

        this.spinner.show();
        this.sbcCollectionCitaAsignada = this.citaAsignadaService.obtenerListado(fechaConfirmacion, false, this.usuarioActual.idUsuario, 0, 0, 0, this.usuarioActual.idUsuario, 2).subscribe(
          data => {
            this.asigPendiente = data.filter((d: any) => d.idEstadoAsignacion == 11).length;
            this.asigVisto = data.filter((d: any) => d.idEstadoAsignacion == 12).length;
            this.asigTrabajado = data.filter((d: any) => d.idEstadoAsignacion == 13).length;
            this.asigTotal = this.asigPendiente + this.asigVisto + this.asigTrabajado;
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
              this.sbcCitaMarcarVisto = this.citaAsignadaService.marcarVisto(citaAsignada).subscribe(
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
      columns: [
        { title: '',            data: 'id',                 width: "4%", visible: false },
        { title: 'CITA',        data: 'idCitaString',       width: "4%",
          render: (data: any, xhr, row) =>
          {
            switch(usuarioX.idperfil) {
              case TipoPerfil.OPERADOR :
              case TipoPerfil.ESPECIALISTA : {
                return  data;
              }
              default : {
                return `<a href='/Cita/${parseInt(data, 10).toString()}/1/0/0/${row.idServicio}' target='_blank''>${ data }</a>`;
              }
            }
          }
        },
        { title: 'CLIENTE',     data: 'paciente',           width: "20%",
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
        { title: 'FECHA LLAMAR',data: 'fechaConfirmacion',  width: "8%",  render: (data: any) => this.datePipe.transform(new Date(data), 'dd/MM/yyyy') },
        { title: 'FECHA CITA',  data: 'fechaCita',          width: "8%",  render: (data: any) => this.datePipe.transform(new Date(data), 'dd/MM/yyyy') },
        { title: 'HORA CITA',  data: 'horaInicio',          width: "8%",  render: (data: any) => `<span>${ (data == null) ? 'Sin hora' : data }</span>` },
        { title: 'TIPO',        data: 'tipo',               width: "10%", render: (data: any) => `<span>${ (data == 1) ? 'Dia siguiente' : (data == 2) ? 'Semana siguiente' : (data == 3) ? 'Cita Pasada' : 'Sin asignar' }</span>` },
        { title: 'TIPO CL', data: 'tipoCliente',         width: "8%"},
        { title: 'ESTADO ASIG', data: 'estadoAsignacion',   width: "8%"},
        { title: 'ESTADO CITA', data: 'estadoCita',         width: "8%", render: (data, dd, row) => `<span class="text-white py-1 px-2 text-uppercase rounded small" style="background-color:${row.colorEstadoCita}">${row.estadoCita}</span>`},
        { title: 'SEDE', data: 'sede',         width: "8%"},
        { title: 'ASIGNADO POR',data: 'asignadoPor',        width: "10%"},

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
      select: true,
      bLengthChange: false
    };
  }
  inicializarFormulario(): void {
    this.frmFiltro = this.formBuilder.group({
      filtroFecha: [new Date()],
    });
    this.frmFiltro.patchValue({
      filtroFecha:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
  }
  asignacionListar(): void {
    this.dataTable.ajax.reload();
  }
  irCita(): void {
    if(this.idCita > 0 ) {

      if(this.citaSelected.idCronograma > 0){
        window.open(`/Corporal360/Cronograma/${this.citaSelected?.idCronograma}/${AccionCronograma.ASIGNARCITAS}/${this.citaSelected.idCliente}/0/${this.citaSelected?.idCita}/${AccionCita.VER}`, '_blank');
      }else{
        window.open(`/Cita/${this.idCita}/${AccionCita.CONFIRMAR}/${this.idCliente}/0/${this.citaSelected.idServicio}`, '_blank');
      }
    } else {
      this.utilsService.mostrarToast('Seleccione una cita para confirmar', 'info');
    }
  }
  citaSeleccionada(): void {
    const citas = $('input:checked[type="checkbox"][cita]');
    this.citasSeleccionadas = citas.length;
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

}
