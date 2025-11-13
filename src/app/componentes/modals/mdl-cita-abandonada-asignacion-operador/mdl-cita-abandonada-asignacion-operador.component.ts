import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { DataTableDirective } from 'angular-datatables';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CitaAsignadaService } from '../../../shared/services/cita-asignada.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {Usuario} from "../../../shared/models";

@Component({
  selector: 'mdl-cita-abandonada-asignacion-operador',
  templateUrl: './mdl-cita-abandonada-asignacion-operador.component.html',
  styleUrls: ['./mdl-cita-abandonada-asignacion-operador.component.scss'],
  providers: [DatePipe]
})
export class MdlCitaAbandonadaAsignacionOperadorComponent implements OnInit, OnDestroy {

  @Input() idUsuarioReasignacion: number = 0;
  @Input() nombreReasignado?: string = '';

  frmOperadores: FormGroup;
  usuarioActual: Usuario;

  maestroCitas: any = [];
  maestroUsuario: any = [];

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
    {id: 2, descripcion: 'Semana siguiente'}
  ]
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Datatable
  dtResponsiveOptionsUsuario: any = {};
  dtResponsiveOptionsCita: any = {};
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  selectedUsuario = 0;
  selectedCita = 0;

  // Subscribes
  sbcObtenerUsuario: Subscription;
  sbcAsignadaObtener: Subscription;
  sbcObtenerReasignadoByUsuario: Subscription;
  sbcGuardarCitaAsignada: Subscription;

  today = new Date();

  constructor(
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private citaAsignadaService: CitaAsignadaService,
    private spinner: NgxSpinnerService,
    private modal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.buildtableUsuario();
    this.buildtableCita();
  }

  ngOnDestroy(): void {
    // Destroy Subscriptions
    if( this.sbcObtenerUsuario ){ this.sbcObtenerUsuario.unsubscribe(); }
    if( this.sbcAsignadaObtener ){ this.sbcAsignadaObtener.unsubscribe(); }
    if( this.sbcObtenerReasignadoByUsuario ){ this.sbcObtenerReasignadoByUsuario.unsubscribe(); }
    if( this.sbcGuardarCitaAsignada ){ this.sbcGuardarCitaAsignada.unsubscribe(); }
  }

  inicializarFormulario() : void {
    this.numCitasSeleccionadas = this.citasSeleccionadas.length;
    this.numOperadorasSeleccionadas = this.usuariosSeleccionados.length;

    this.frmOperadores = this.formBuilder.group({
      asignados: [0],
      fechaCita: [new Date()],
      fechaConfirmacion: [new Date(), Validators.required],
      sinAsignar: [false]
    });
    this.frmOperadores.patchValue({
      fechaCita:  this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      fechaConfirmacion:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
    this.cambiarFechaModo();

    if(this.idUsuarioReasignacion == 0) {
      this.modoAsignacion = this.modoAsignacion.filter(f => f.id != 0);
    }
  }
  cambiarFechaModo(): void {
    if(this.idUsuarioReasignacion == 0) {
      const fechaHoy = this.utilsService.formatDate(new Date());

      let fechaCita = this.frmOperadores.controls.fechaCita.value;
      let fechaConfirmar = new Date();

      this.frmOperadores.patchValue({
        fechaConfirmacion:  this.datePipe.transform(fechaConfirmar, 'yyyy-MM-dd'),
        fechaCita: this.datePipe.transform(fechaCita, 'yyyy-MM-dd')
      });
    } else {
      $('.table-cita').DataTable().ajax.reload();
    }
  }
  obtenerCitas(): void {
    this.reloadBD = true;
    this.seleccionTodo = false;
    $('.table-cita').DataTable().ajax.reload();
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
        const fecha = this.frmOperadores.controls.fechaCita.value;
        this.spinner.show();
        if(this.reloadBD){
            if(this.idUsuarioReasignacion == 0) {
              this.titulo = 'Asignación de citas abandonadas';
              const sinAsignar = ($('#chkSinAsignar')[0] as HTMLInputElement).checked;
              this.sbcAsignadaObtener = this.citaAsignadaService.obtenerAbandonados(fecha, sinAsignar).subscribe(
                (res: any) => {
                  console.log('ss');
                  res.data.forEach((a: any)  => { a.seleccionado = false });
                  this.maestroCitas = res.data;
                  callback({ data: this.maestroCitas });
                  this.spinner.hide();
                },
                error => {
                  console.log('Error al obtener las citas' + error);
                  this.spinner.hide();
                }
              );
            } else {
              this.titulo = 'Re-asignación de citas abandonadas de: ' + this.nombreReasignado;
              $('#div_fechaConfirmacion').hide();
              $('#div_fechaCita').hide();
              $('#cboModo').prop( "disabled", false);
              const fechaConfirmacion = this.frmOperadores.controls.fechaCita.value;
              this.sbcObtenerReasignadoByUsuario = this.citaAsignadaService.obtenerAbandonadosReasignadoByIdUsuario(3, fechaConfirmacion, this.idUsuarioReasignacion).subscribe(
                (res: any) => {
                  console.log('dd');
                  res.data.forEach((a: any)  => { a.seleccionado = false });
                  this.maestroCitas = res.data;
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

    if(this._citasSeleccionadas.length == 0 ){
      this.utilsService.mostrarToast('Debe seleccionar citas', 'warning');
      return;
    }

    if(this._usuariosSeleccionados.length == 0){
      this.utilsService.mostrarToast('Debe seleccionar usuarios', 'warning');
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

    if(this.frmOperadores.invalid){
      this.utilsService.mostrarToast('Debe rellenar todos los campos', 'warning');
      return;
    }

    if(this._citasAsignadas.length == 0){
      this.utilsService.mostrarToast('No hay citas asignadas', 'warning');
      return;
    }

    const model = {
      citasAsignadas: this._citasAsignadas.map(x => {
        x.fechaConfirmacion = this.frmOperadores.controls.fechaConfirmacion.value;
        return x;
      })
    }

    this.sbcGuardarCitaAsignada = this.citaAsignadaService.guardarAbandonados(model).subscribe(
      resultado => {
        this.utilsService.mostrarToast('Citas abandonadas asignadas correctamente', 'success');
        this.modal.close();
      },
      error => { console.log(error); }
    );
  }
  cerrarModal(): void {
    this.modal.close();
  }
}
