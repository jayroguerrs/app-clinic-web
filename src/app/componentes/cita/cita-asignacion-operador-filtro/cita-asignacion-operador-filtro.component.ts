import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { DataTableDirective } from 'angular-datatables';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CitaAsignadaService } from '../../../shared/services/cita-asignada.service';
import { NgxSpinnerService } from 'ngx-spinner';
  import {Subscription} from "rxjs";
  import {SedeService} from "../../../shared/services/sede.service";
import {Usuario} from "../../../shared/models";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {EstadoService} from "../../../shared/services/estado.service";
import {CitaEstado} from "../../../shared/enumeracion/enums";
import {Estado} from "../../../shared/interfaces/estado";
import {CitaMotivoEstadoService} from "../../../shared/services/cita-motivo-estado.service";
import {CitaMotivoEstado, CitaMotivo} from "../../../shared/models/cita-motivo-estado";
import {RCitaMotivo, RCitaMotivoEstado} from "../../../shared/interfaces/Response/cita-motivo-estado";
import {CitaMotivoService} from "../../../shared/services/cita-motivo.service";

@Component({
  selector: 'app-cita-asignacion-operador-filtro',
  templateUrl: './cita-asignacion-operador-filtro.component.html',
  styleUrls: ['./cita-asignacion-operador-filtro.component.scss'],
  providers: [DatePipe]
})
export class CitaAsignacionOperadorFiltroComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() idUsuarioReasignacion: number = 0;
  @Input() nombreReasignado?: string = '';
  @Output() OnSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  frmOperadores: FormGroup;
  usuarioActual: Usuario;

  maestroCitas: any = [];
  maestroUsuario: any = [];
  maestroSede: any = [];

  _usuariosSeleccionados: any = [];
  _citasSeleccionadas: any = [];
  _citasAsignadas: any = [];

  citasSeleccionadas: any = [];
  usuariosSeleccionados: any = []
  citaAsignadas: any = [];

  reloadBD: boolean = true;
  seleccionTodo: boolean = false;
  asignado: boolean = false;

  numCitasSeleccionadas = 0;
  numOperadorasSeleccionadas = 0;

  titulo = '';

  modoAsignacion = [
    {id: 0, descripcion: 'Todos'},
    {id: 1, descripcion: 'Dia siguiente'},
    {id: 2, descripcion: 'Semana siguiente'},
    {id: 3, descripcion: 'Cita pasada'}
  ]
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Datatable
  dtResponsiveOptionsUsuario: any = {};
  dtResponsiveOptionsCita: any | undefined;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  selectedUsuario = 0;
  selectedCita = 0;

  // Subscribes
  sbcObtenerUsuario: Subscription;
  sbcAsignadaObtener: Subscription;
  sbcObtenerReasignadoByUsuario: Subscription;
  sbcGuardarCitaAsignada: Subscription;
  sbcCollectionSede: Subscription;

  subscriptions: Subscription[] = [];


  // estados
  estados: Estado[] = [];
  ldEstados: boolean

  // motivos de estado cita
  motivosEstado: CitaMotivo[] = [];
  ldMotivosEstado: boolean;


  constructor(
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private citaAsignadaService: CitaAsignadaService,
    private spinner: NgxSpinnerService,
    private sedeService: SedeService,
    public modal: NgbActiveModal,
    private estadoService: EstadoService,
    private citaMotivoService: CitaMotivoService
  ) {
    this.ldEstados = false;
    this.ldMotivosEstado = false;
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.buildtableUsuario();
    this.buildtableCita();
    this.obtenerSedes();
    this.obtenerEstados();
  }

  ngOnDestroy(): void {
    // Destroy Subscriptions
    if( this.sbcObtenerUsuario ){ this.sbcObtenerUsuario.unsubscribe(); }
    if( this.sbcAsignadaObtener ){ this.sbcAsignadaObtener.unsubscribe(); }
    if( this.sbcObtenerReasignadoByUsuario ){ this.sbcObtenerReasignadoByUsuario.unsubscribe(); }
    if( this.sbcGuardarCitaAsignada ){ this.sbcGuardarCitaAsignada.unsubscribe(); }
    this.sbcCollectionSede?.unsubscribe();
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    })
  }

  ngAfterViewInit(): void {
    // this.buildtableCita();
  }

  inicializarFormulario() : void {
    this.numCitasSeleccionadas = this.citasSeleccionadas.length;
    this.numOperadorasSeleccionadas = this.usuariosSeleccionados.length;

    this.frmOperadores = this.formBuilder.group({
      tipoCliente: [2],
      idSede: [0],
      fechaDesde: [new Date()],
      fechaHasta: [new Date()],
      fechaConfirmacion: new FormControl(null, Validators.required),
      idModo: [3],
      sinAsignar: [false],
      idEstado: [0],
      idMotivo: [0]
    });
    this.frmOperadores.patchValue({
      fechaDesde:  new Date(),
      fechaHasta:  new Date(),
      fechaConfirmacion:  null,
    });
    this.frmOperadores.get('idEstado').valueChanges.subscribe((res) => {
      this.frmOperadores.patchValue({
        idMotivo: 0
      });

      this.obtenerMotivos(parseInt(res, 10));
    });
    this.cambiarFechaModo();

    if(this.idUsuarioReasignacion == 0) {
      this.modoAsignacion = this.modoAsignacion.filter(f => f.id != 0);
    }
  }
  cambiarFechaModo(): void {
    // if(this.idUsuarioReasignacion == 0) {
    //   const fechaHoy = this.utilsService.formatDate(new Date());
    //
    //   let fechaCita = this.frmOperadores.controls.fechaRango.value.from;
    //   let fechaConfirmar = new Date();
    //
    //   if(this.frmOperadores.controls.idModo.value == 1) {
    //     fechaConfirmar = this.utilsService.sumarDiasAsDate(fechaHoy, 1);
    //     fechaCita = this.utilsService.sumarDiasAsDate(fechaHoy, 2);
    //   } else {
    //     fechaConfirmar = this.utilsService.sumarDiasAsDate(fechaHoy, 1);
    //     fechaCita = this.utilsService.sumarDiasAsDate(fechaHoy, 8);
    //   }
    //   this.frmOperadores.patchValue({
    //     fechaConfirmacion:  this.datePipe.transform(fechaConfirmar, 'yyyy-MM-dd'),
    //     fechaDesde: fechaConfirmar,
    //     fechaHasta: fechaConfirmar
    //   });
    // } else {
      $('.table-cita').DataTable().ajax.reload();
    // }
  }
  obtenerCitas(): void {
    if(this.frmOperadores.controls.fechaDesde.value && this.frmOperadores.controls.fechaHasta.value){
      this.reloadBD = true;
      this.seleccionTodo = false;
      $('.table-cita').DataTable().ajax.reload();
    }
  }

  buildtableUsuario(): void{
    this.dtResponsiveOptionsUsuario = {
      ajax: (_dataTablesParameters: any, callback) => {
        if(this.reloadBD) {
          this.sbcObtenerUsuario = this.usuarioService.obtenerUsuarios(true).subscribe(
            data => {
              this.maestroUsuario = data;
              this.maestroUsuario.forEach((a: any)  => { a.numCitas = 0, a.seleccionado = false });
              callback({ data: this.maestroUsuario });
          },
            error => console.log('Error al obtener los usuarios/operadores' + error))
        } else {
          callback({ data: this.maestroUsuario });
        }
      },
      columns: [
        { title: '', data: 'idUsuario', width: "4%", visible: false },
        { title: 'NOMBRE', data: 'nombre', width: "20%"
          , render: (data, type, row) => {
              return `<span class="index"></span><div class="checkbox d-inline">
                        <input type="checkbox" name="checkbox-usuario" class="user-select" id="usuario-${row.idUsuario}" ${ row.seleccionado ? 'checked': ''}>
                        <label for="usuario-${row.idUsuario}" class="cr mb-0 d-inline-flex align-items-center"  style="font-size:11px;">${row.nombre} - (${row.usuario})</label>
                      </div>`; }
        },
        { title: 'SEDE', data: 'sede', width: "5%", visible: false },
        { title: 'CITAS', data: 'numCitas', width: "5%", visible: true,
          render: (data, type, row) => {
            return `<div style="text-align:right;"><label style="font-size:11px;">${row.numCitas}</label></div>`;
          }
        },
      ],
      createdRow: (row: any | Node, data: any | Object, index: number) => {

        // ------------------------------------------------
        if(this._usuariosSeleccionados.findIndex( x => x.idUsuario === data.idUsuario) >=0 ){
          $('td:eq(0)', row).find('.index').text(this._usuariosSeleccionados.findIndex( x => x.idUsuario === data.idUsuario) + 1);
          const table: any = $('.table-usuario').DataTable();
          table.row(row, { page: 'current' }).select();
        }else{
          $('td:eq(0)', row).find('.index').text('');
        }

        // $(row).addClass('selected');

        $(row).find('input.user-select').on('change',(evt) => {
          if($(evt.target).is(':checked')){
            this._usuariosSeleccionados.push(data);
            //console.log('usuario_seleccionados', this._usuariosSeleccionados );
            $('td:eq(0)', row).find('.index').text(this._usuariosSeleccionados.findIndex( x => x.idUsuario === data.idUsuario) + 1 );
            //$('.table-usuario').DataTable().row($(row)).invalidate().draw();

            // var data = $('.table-usuario').DataTable().rows({ selected: true });
            // console.log(data);
            const table: any = $('.table-usuario').DataTable();
            table.row(row, { page: 'current' }).select();

            //console.log( table.rows({ selected: true }).data().row().node() );
            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._usuariosSeleccionados.findIndex( x => x.idUsuario === this.data().idUsuario) + 1);
            });

          }else{
            this._usuariosSeleccionados = this._usuariosSeleccionados.filter( x => x.idUsuario !== data.idUsuario);
            //console.log('usuario_deseleccionado', this._usuariosSeleccionados );
            $('td:eq(0)', row).find('.index').text('');

            const table: any = $('.table-usuario').DataTable();
            table.row(row, { page: 'current' }).deselect();

            //console.log( table.rows({ selected: true }).data().row().node() );
            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._usuariosSeleccionados.findIndex( x => x.idUsuario === this.data().idUsuario) + 1);
            });
          }
        })
        // -------------------------------------------------
      },
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('td', row).off('click');
        $('td', row).on(
          'click', () => {
            this.usuariosSeleccionados = $('.table-usuario').DataTable().rows().nodes().$('input:checked');
            console.log(this.usuariosSeleccionados);
            this.numOperadorasSeleccionadas = this.usuariosSeleccionados.length;

            //limpiar seleccion anterior seleccionado = 0;
            this.maestroUsuario.forEach((a: any)  => { a.numCitas = 0; a.seleccionado = false });

            for(var i = 0; i < this.usuariosSeleccionados.length; i++) {
              const input = this.usuariosSeleccionados[i] as HTMLInputElement;
              const idUsuario = parseInt(input.getAttribute('id').split('-')[1], 10);
              this.maestroUsuario.find(x => x.idUsuario == idUsuario).seleccionado = true;
            }
          }
        );
        return row;
      },
      serverSide: false,
      processing: false,
      async: true,
      buttons: [ 'excel' ],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      bLengthChange: false
    };
  }


  buildtableCita(): void{
    this.dtResponsiveOptionsCita = {
      ajax: (_dataTablesParameters: any, callback) => {
        const idTipoCliente = parseInt( this.frmOperadores.controls.tipoCliente.value, 10);
        const fechaDesde = this.frmOperadores.controls.fechaDesde.value;
        const fechaHasta = this.frmOperadores.controls.fechaHasta.value;
        const idSede = this.frmOperadores.controls.idSede.value;
        const idEstado = this.frmOperadores.controls.idEstado.value;
        const idMotivo = parseInt(this.frmOperadores.controls.idMotivo.value, 10);

        if(fechaDesde > fechaHasta){
          this.utilsService.mostrarToast('La fecha final debe ser mayor a la fecha inicial', 'warning');
          callback({ data: [] });
          return;
        }


        //console.log(fecha);
        this.spinner.show();
        if(this.reloadBD){
            if(this.idUsuarioReasignacion == 0) {
              this.titulo = 'Asignación de citas pasadas';
              const sinAsignar = this.frmOperadores.controls.sinAsignar.value;
              this.sbcAsignadaObtener = this.citaAsignadaService.obtenerCitasPasadas(idSede, this.datePipe.transform(fechaDesde, 'yyyy-MM-dd'), this.datePipe.transform(fechaHasta, 'yyyy-MM-dd'), sinAsignar, idEstado, idTipoCliente, idMotivo).subscribe(
                data => {
                  data.forEach((a: any)  => { a.seleccionado = false });
                  this.maestroCitas = data;
                  callback({ data: this.maestroCitas });
                  this.spinner.hide();
                },
                error => {
                  console.log('Error al obtener las citas' + error);
                  this.spinner.hide();
                }
              );
            } else {
              this.titulo = 'Re-asignación de citas pasadas de: ' + this.nombreReasignado;
              $('#div_fechaConfirmacion').hide();
              // $('#div_fechaCita').hide();
              $('#cboModo').prop( "disabled", false);
              const idTipoModo = parseInt(this.frmOperadores.controls.idModo.value, 10);
              const fechaCita = this.frmOperadores.controls.fechaCita.value;
              this.sbcObtenerReasignadoByUsuario = this.citaAsignadaService.obtenerReasignadoByIdUsuario(idTipoModo, fechaCita, this.idUsuarioReasignacion).subscribe(
                data => {
                  data.forEach((a: any)  => { a.seleccionado = false });
                  this.maestroCitas = data;
                  callback({ data: this.maestroCitas });
                  this.spinner.hide();
                },
                error => {
                  console.log('Error al obtener las citas' + error);
                  this.spinner.hide();
                }
              );
            }
        }else {
          callback({ data: this.maestroCitas });
          this.spinner.hide();
        }
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
        { title: '', data: 'idCita', orderable: false,
          render: (data, type, row) => {
          return `<div class="checkbox d-inline">
                    <input type="checkbox" name="checkbox-cita" class="cita-select" id="cita-${row.idCita}" ${ row.seleccionado ? 'checked': ''}>
                    <label for="cita-${row.idCita}" class="cr mb-0 d-inline-flex align-items-center" style="font-size:11px;">${row.idCita} - ${row.paciente}</label>
                  </div>`; }
        },
        { title: 'FECHA',   data: 'fechaCita', width: "4%",
          render: (data, type, row) => {
          return `<span style="font-size:11px;">${this.datePipe.transform(new Date(row.fechaCita), 'dd-MM-yyyy')}</span>`; }  },
        { title: 'HORA',   data: 'horaInicio', width: "4%",
          render: (data, type, row) => {
            return `<span style="font-size:11px;">${data}</span>`; }  },
        // { title : 'PACIENTE', data: 'nombres', width: "20%" },
        { title: 'ASIGNADO', data: 'asignado', width: "10%", visible: true,
          render: (data, type, row) => {
          return `<span style="font-size:11px;">${row.asignado}</span>`; }  },
        { title: 'ESTADO', data: 'estadoCita', width: "20%",
          render: (data, type, row) => {
          return `<span style="font-size:11px;">${row.estadoCita}</span>`; }  },
        { title: 'T. CLIENTE', data: 'tipoCliente'}
      ],
      createdRow: (row: any | Node, data: any | Object, index: number) => {

        // console.log('data',data);
        // ------------------------------------------------
        if(this._citasSeleccionadas.findIndex( x => x.idCita === data.idCita) >= 0 ){

          const table: any = $('.table-cita').DataTable();
          table.row(row, { page: 'current' }).select();

        }else{

        }

        $(row).find('input.cita-select').on('change',(evt) => {
          if($(evt.target).is(':checked')){
            this._citasSeleccionadas.push(data);

            // console.log(this._citasSeleccionadas);
            $('td:eq(0)', row).find('.index').text(this._citasSeleccionadas.findIndex( x => x.idCita === data.idCita) + 1 );

            const table: any = $('.table-cita').DataTable();
            table.row(row, { page: 'current' }).select();

            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._citasSeleccionadas.findIndex( x => x.idCita === this.data().idCita) + 1);
            });
          }else{
            this._citasSeleccionadas = this._citasSeleccionadas.filter( x => x.idCita !== data.idCita);
            $('td:eq(0)', row).find('.index').text('');

            const table: any = $('.table-cita').DataTable();
            table.row(row, { page: 'current' }).deselect();

            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._citasSeleccionadas.findIndex( x => x.idCita === this.data().idCita) + 1);
            });
          }
        })
        // -------------------------------------------------
      },
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.citasSeleccionadas = $('.table-cita').DataTable().rows().nodes().$('input:checked');
          this.numCitasSeleccionadas = this.citasSeleccionadas.length;
          this.maestroCitas.find(x => x.idCita == data.idCita).seleccionado = true;
        });
        return row;
      },
      headerCallback: ( thead, data, start, end, display ) => {
        const checkbox = `<div class="checkbox d-inline" style="margin-left:-13px; margin-bottom: 2px;">
                            <input type="checkbox" name="checkbox-todo" id="chkTodo" ${ this.seleccionTodo ? 'checked': ''}>
                            <label for="chkTodo" class="cr mb-0">CITA-PACIENTE</label>
                          </div>`;
        $(thead).find('th').eq(1).html(checkbox);

        $(thead).find('th div input').eq(0).off('click');
        $(thead).find('th div input').eq(0).on('click', (e) => {
          const valueSeleccionar = ($('#chkTodo')[0] as HTMLInputElement).checked;
          this.seleccionarTodasLasCitas(valueSeleccionar);
        });
      },
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
      //select: true,
      //searching: true,
      bLengthChange: false,
      order: []
    };
  }
  seleccionarTodasLasCitas(valor: boolean): void {
    this._citasSeleccionadas = valor ? this.maestroCitas : [];
    this.maestroCitas.forEach((a: any) => a.seleccionado = valor );
    this.numCitasSeleccionadas = this.maestroCitas.filter(x => x.seleccionado == true).length
    this.reloadBD = false;
    this.seleccionTodo = valor;

    $('.table-cita').DataTable().ajax.reload();
  }
  distribuirCitas(): void {
    this.citaAsignadas = [];
    this._citasAsignadas = [];
    this.citasSeleccionadas = $('.table-cita').DataTable().rows().nodes().$('input:checked');

    if(this.frmOperadores.controls.fechaConfirmacion.invalid){
      this.utilsService.mostrarToast('Debe seleccionar la fecha de confirmación', 'warning');
      return;
    }

    if(this._citasSeleccionadas.length == 0 ){
      this.utilsService.mostrarToast('Debe seleccionar citas', 'warning');
      return;
    }

    if(this._usuariosSeleccionados.length == 0){
      this.utilsService.mostrarToast('Debe seleccionar usuarios', 'warning');
      return;
    }

    if(this.frmOperadores.controls.idModo.value == 0){
      this.utilsService.mostrarToast('Seleccione el modo', 'warning');
      return;
    }


    // ****************************************************************

    // console.log('citas seleccionadas', this._citasSeleccionadas);

    const num_usuarios = this._usuariosSeleccionados.length;
    const num_citas = this._citasSeleccionadas.length;
    let residuo: number = 0;
    let cont_residuo: number = 0;
    let n_partes = 0;
    let posicion_ini = 0;
    let posicion_fin = 0;


    if( num_citas > num_usuarios ){

      n_partes = Math.floor(num_citas / num_usuarios);
      residuo = num_citas - ( num_usuarios * n_partes );

      //console.log(num_usuarios,num_citas,n_partes,residuo);

      this._usuariosSeleccionados.forEach( u => {
        let cont_partes = 0;

        if(posicion_ini){
          posicion_ini++;
        }

        posicion_fin = (posicion_ini + (n_partes-1)) < this._citasSeleccionadas.length ? (posicion_ini + (n_partes-1)) : (this._citasSeleccionadas.length - 1);

        //console.log('pini = ' + posicion_ini, 'pfin = ' + posicion_fin);

        for (let i = posicion_ini; i <= posicion_fin; i++) {

          //console.log(this._citasSeleccionadas[i].idCita);
          this._citasAsignadas.push({
            idCita: this._citasSeleccionadas[i].idCita,
            idUsuarioOperador: u.idUsuario,
            fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
            idUsuarioRegistra: this.usuarioActual.idUsuario,
            tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
            usuario: u.usuario
          });
          posicion_ini = i;
        }

        if( cont_residuo < residuo ){
          posicion_ini ++;
          //console.log('añadido residuo',this._citasSeleccionadas[posicion_ini].idCita);
          this._citasAsignadas.push({
            idCita: this._citasSeleccionadas[posicion_ini].idCita,
            idUsuarioOperador: u.idUsuario,
            fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
            idUsuarioRegistra: this.usuarioActual.idUsuario,
            tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
            usuario: u.usuario
          });
          cont_residuo++;

          //console.log(cont_residuo);
        }

      });

      //console.log('Citas', this._citasAsignadas);
    }else{
        this._citasSeleccionadas.forEach((x,i) => {
          this._citasAsignadas.push({
            idCita: x.idCita,
            idUsuarioOperador: this._usuariosSeleccionados[i].idUsuario,
            fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
            idUsuarioRegistra: this.usuarioActual.idUsuario,
            tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
            usuario: this._usuariosSeleccionados[i].usuario
          });
        });

        //console.log('Citas', this._citasAsignadas);
    }
    // ****************************************************************



    // console.log(this._usuariosSeleccionados);

    let contadorUsuario = 0 ;
    this.maestroUsuario.forEach((a: any) => a.numCitas = 0);

    for(var  i = 0 ; i < this._citasSeleccionadas.length; i++) {
      const idUsuarioOperador = parseInt(this._usuariosSeleccionados[contadorUsuario].idUsuario, 10);
      const citaAsig = {
        idCita: parseInt(this._citasSeleccionadas[i].idCita, 10),
        idUsuarioOperador,
        fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
        idUsuarioRegistra: this.usuarioActual.idUsuario,
        tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
        usuario: this.maestroUsuario.find(u => u.idUsuario == idUsuarioOperador).usuario
      }
      contadorUsuario = (contadorUsuario == this._usuariosSeleccionados.length - 1) ? 0 :  contadorUsuario + 1;
      this.citaAsignadas.push(citaAsig);
    }

    //Actualizar lista de usuario con citas asignadas
    this.citaAsignadas.forEach(element => {
      const idUsuarioOperador = element.idUsuarioOperador;
      this.maestroUsuario.find(u => u.idUsuario == idUsuarioOperador).numCitas += 1;
    });

    //Actualizar lista de citas con nombre de usuario
    this.citaAsignadas.forEach(element => {
      const idCita = element.idCita;
      this.maestroCitas.find(u => u.idCita == idCita).asignado = element.usuario ;
    });

    this.reloadBD = false;
    this.asignado = true;
    // $('.table-cita').DataTable().ajax.reload();
    const table = $('.table-usuario').DataTable();
    table.ajax.reload();
    table
      .order( [ 3, 'desc' ] )
      .draw();

    // console.log(this._citasAsignadas);
  }
  grabarDistribuirCitas(): void {
    if(this._citasAsignadas.length == 0){
      this.utilsService.mostrarToast('No hay citas asignadas', 'warning');
      return;
    }

    const model = {
      citasAsignadas: this._citasAsignadas
    }

    this.sbcGuardarCitaAsignada = this.citaAsignadaService.guardar(model).subscribe(
      resultado => {
        this.utilsService.mostrarToast('Citas asignadas correctamente', 'success');
        this.modal.close();
      },
      error => { console.log(error) }
    );
  }
  cerrarModal(): void {
    this.modal.close();
  }


  obtenerSedes(): void {
    this.sbcCollectionSede = this.sedeService.obtener().subscribe(
      resultado => this.maestroSede = resultado,
      error => console.log("Error al obtener las sedes: ", error)
    );
  }

  obtenerEstados(): void {
    const subs = this.estadoService.obtenerEstadoByEntidad('Cita').subscribe(
      resultado => {
        this.estados = resultado.filter(r => ![7, 9].includes(r.id)).map(m => {
            return {
              id: m.id,
              name: m.descripcion
            }
          }
        );
        // this.frmOperadores.patchValue({
        //   idEstado: this.estados[0].id
        // });
      }, error => console.log("Error al obtener los estados: ", error));
    this.subscriptions.push(subs);
  }

  obtenerMotivos(idEstado: number): void{
    this.ldMotivosEstado = true;
    const subs = this.citaMotivoService.collectionByCitaEstado(idEstado).subscribe((res: CitaMotivo[]) => {
      this.motivosEstado = res;
      this.ldMotivosEstado = false;
    }, error => {
      this.utilsService.mostrarToast('No se pudo obtener los motivos', 'error');
      console.log(error);
      this.ldMotivosEstado = false;
    });
    this.subscriptions.push(subs);
  }


  valores(valor): void{
    console.log(valor);
  }
}
