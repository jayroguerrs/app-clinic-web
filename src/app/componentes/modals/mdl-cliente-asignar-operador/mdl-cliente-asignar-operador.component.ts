  import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
    Output,
  SimpleChanges,
  ViewChild,
  EventEmitter
} from '@angular/core';
  import { UsuarioService } from 'src/app/shared/services/usuario.service';
  import { UtilsService } from '../../../shared/services/funciones/utils.service';
  import { DataTableDirective } from 'angular-datatables';
  import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
  import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
  import { DatePipe } from '@angular/common';
  import { Usuario } from 'src/app/shared/models/usuario';
  import { CitaAsignadaService } from '../../../shared/services/cita-asignada.service';
  import { NgxSpinnerService } from 'ngx-spinner';
  import {Subscription} from "rxjs";
  import {PreferenteService} from "../../../shared/services/preferente.service";
  import {EstadoService} from "../../../shared/services/estado.service";
  import {GlobalConstants} from "../../../../commons/global-constants";
  import {MensajeSignalR} from "../../../shared/services/signal-r.service";
  import {TipoMensajeSignalR, TipoPerfil} from "../../../shared/enumeracion/enums";
  import {MedioContactoService} from "../../../shared/services/medio-contacto.service";
  import {Estado, MedioContacto} from "../../preferente/preferente.models";
  import {SedeService} from "../../../shared/services/sede.service";
  import {ClienteAsignadoService} from "../../../shared/services/cliente-asignado.service";
  import {ClienteAsignado} from "../../../shared/models/cliente";
  import {ErrorSistema} from "../../../shared/models/error-sistema";

@Component({
  selector: 'app-mdl-cliente-asignar-operador',
  templateUrl: './mdl-cliente-asignar-operador.component.html',
  styleUrls: ['./mdl-cliente-asignar-operador.component.scss'],
  providers: [DatePipe]
})
export class MdlClienteAsignarOperadorComponent implements OnInit, AfterViewInit, OnDestroy {

  tipoPerfil = TipoPerfil;

  @Input() idUsuarioReasignacion: number = 0;
  @Input() nombreReasignado?: string = '';
  // @Input() listaTeleoperadorConfirmado: any[] = [];

  @Output() OnSaved: EventEmitter<boolean> = new EventEmitter<boolean>();


  listaTeleoperadorConfirmado: any[] = [];

  frmOperadores: FormGroup;
  usuarioActual: Usuario;

  // maestroUsuario: any[] = [];

  _usuariosSeleccionados: any = [];
  _clientesSeleccionados: any = [];
  _clienteAsignados: any = [];

  clientesSeleccionados: any = [];
  usuariosSeleccionados: any = []
  clienteAsignados: any = [];

  reloadBD: boolean = true;
  seleccionTodo: boolean = false;
  asignado: boolean = false;

  numClientesSeleccionadas = 0;
  numOperadorasSeleccionadas = 0;

  titulo = 'Asignación de clientes';

  today = new Date();

  modoAsignacion = [
    {id: 0, descripcion: 'Todos'},
    {id: 1, descripcion: 'Dia siguiente'},
    {id: 2, descripcion: 'Semana siguiente'},
    {id: 3, descripcion: 'Cita Pasada'},
  ];

  selectAsignado = [
    {id: 0, descripcion: 'Todos'},
    {id: 1, descripcion: 'Sí'},
    {id: 2, descripcion: 'No'},
  ]
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';


  // Datatable
  dtResponsiveOptionsUsuario: any = {};
  dtResponsivePreferentes: any = {};
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  selectedUsuario = 0;
  selectedCita = 0;

  // Subscribes
  sbcObtenerUsuario: Subscription;
  sbcPreferentesObtener: Subscription;
  sbcObtenerReasignadoByUsuario: Subscription;
  sbcAsignarPreferenteLista: Subscription;
  sbcTotalAsignados: Subscription
  sbcGuardarPreferenteAsignado: Subscription;


  // Filtro
  filtro: any = {
    desde: '',
    hasta: '',
    estado: 0,
    estadoAtencion: 0,
    teleoperador: 0,
    medioContacto: 0,
    usuarioId: 0,
    esCliente: 2
  }

  submitted = false;

  ldEstados = false;
  ldEstadosAtencion = false;
  estados: Estado[] = [];
  estadosAtencion: Estado[] = [];
  sbcEstados: Subscription | undefined;
  sbcEstadosAtencion: Subscription | undefined;


  ldMediosContacto: boolean;
  mediosContacto: MedioContacto[] = [];

  subscriptions: Subscription[] = [];


  ldSedes: boolean;
  maestroSede: any = [];
  maestroClienteAsignado: ClienteAsignado[] = [];
  maestroUsuario: any = [];


  constructor(
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private citaAsignadaService: CitaAsignadaService,
    private preferenteService: PreferenteService,
    private spinner: NgxSpinnerService,
    private estadoService: EstadoService,
    private medioContactoService: MedioContactoService,
    public modal: NgbActiveModal,
    private sedeService: SedeService,
    private clienteAsignadoService: ClienteAsignadoService,
  ) {
    this.ldMediosContacto = false;
    this.ldSedes = false;
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.filtro.usuarioId = this.usuarioActual.idUsuario;
    this.listarEstados();
    this.listarEstadosAtencion();
    this.inicializarFormulario();
    this.buildtableUsuario();
    this.buildtableCliente();
    this.listarMediosContacto();



    this.listarSedes();
  }

  ngOnDestroy(): void {
    // Destroy Subscriptions
    if( this.sbcObtenerUsuario ){ this.sbcObtenerUsuario.unsubscribe(); }
    if( this.sbcPreferentesObtener ){ this.sbcPreferentesObtener.unsubscribe(); }
    if( this.sbcObtenerReasignadoByUsuario ){ this.sbcObtenerReasignadoByUsuario.unsubscribe(); }
    if( this.sbcAsignarPreferenteLista ){ this.sbcAsignarPreferenteLista.unsubscribe(); }
    this.sbcTotalAsignados?.unsubscribe();

    this.subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

  ngAfterViewInit(): void {

    GlobalConstants.gSignalService.signalReceived.subscribe((trama: MensajeSignalR) =>{
      switch (trama.tipo)
      {
        case TipoMensajeSignalR.RespuestaActividad: {
          if (this.usuarioActual.idperfil === TipoPerfil.MARKETING || this.usuarioActual.idperfil === TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil === TipoPerfil.SUPERVISORVENTAS || this.usuarioActual.idperfil === TipoPerfil.SISTEMAS || this.usuarioActual.idperfil === TipoPerfil.SA){
            // console.log('respuesta', trama.datos);
            const today = new Date();

            // Obtener total asignados
            this.sbcTotalAsignados = this.preferenteService.obtenerTotalAsignados(trama.datos.IdUsuario, this.datePipe.transform(today, 'yyyy-MM-dd')).subscribe((res: number) => {
              const usuario = {
                idUsuario: trama.datos.IdUsuario,
                nombre: trama.datos.Nombre,
                usuario: trama.datos.Usuario,
                fechaRegistra: trama.datos.FechaRegistra,
                totalAsignados: res,
                numClientes : 0
              };
              // this.utilsService.mostrarToast(trama.datos.Nombre + ' a confirmado', 'success');
              const existeUsuario = this.listaTeleoperadorConfirmado.find(f => f.idUsuario === usuario.idUsuario);
              if (existeUsuario == null){
                this.listaTeleoperadorConfirmado.push(usuario);
              }else{
                existeUsuario.totalAsignados = res;
              }
              $('.table-usuario').DataTable().ajax.reload();
            }, error => {
              console.log(error);
            })


          }
          break;
        }
      }
    });
  }

  inicializarFormulario() : void {
    this.numClientesSeleccionadas = this.clientesSeleccionados.length;
    this.numOperadorasSeleccionadas = this.usuariosSeleccionados.length;

    const today = new Date();
    // console.log(today);

    this.frmOperadores = this.formBuilder.group({
      tipoCliente: new FormControl(0),
      idModo: new FormControl(1),
      idSede: new FormControl(0),
      fechaConfirmacion: new FormControl(this.datePipe.transform(today, 'yyyy-MM-dd'), Validators.required),
      fechaCita: new FormControl(this.datePipe.transform(today, 'yyyy-MM-dd'), Validators.required),
      asignado: new FormControl(0),
    });

    if(this.idUsuarioReasignacion == 0) {
      this.modoAsignacion = this.modoAsignacion.filter(f => f.id != 0);
    }
  }

  obtenerCitas(): void {
    this.submitted = true;

    if( this.f.fechaCita.invalid ){
      this.utilsService.mostrarToast('Debe seleccionar la fecha de la cita','warning');
      return;
    }

    // if( this.f.fechaConfirmacion.invalid ){
    //   this.utilsService.mostrarToast('Debe seleccionar la fecha de la llamada','warning');
    //   return;
    // }

    this.reloadBD = true;
    this.seleccionTodo = false;
    this.clienteAsignados = [];
    this._clienteAsignados = [];
    this._clientesSeleccionados = [];
    this.clientesSeleccionados = [];
    $('.table-cita').DataTable().ajax.reload();
    $('.table-usuario').DataTable().ajax.reload();
  }

  buildtableUsuario(): void{
    this.dtResponsiveOptionsUsuario = {
      // data: this.listaTeleoperadorConfirmado,
      ajax: (_dataTablesParameters: any, callback) => {

        if(this.reloadBD) {

          this.usuarioService.obtenerParaPreferentes().subscribe((res) => {
            const collection: any[] = res.data.map(x => {
              return {
                idUsuario: x.idUsuario,
                nombre: x.nombre,
                seleccionado: false,
                usuario: x.usuario,
                numClientes: 0
              }
            });
            this.listaTeleoperadorConfirmado = collection;
            this.maestroUsuario = collection;
            callback({data: collection});
          }, error => {
            callback({data: []});
            this.utilsService.mostrarToast('Ocurrio un error al intentar obtener los usuarios', 'error');
          });

        }else{
          callback({ data: this.maestroUsuario });
        }

        // console.log('load pñreferente');
        // callback({ data: this.listaTeleoperadorConfirmado  });
      },
      columns: [
        { title: '', data: null, width: "32px", orderable: false,
          render: (data, type, row) => {
            return `<div class="checkbox d-inline p-0 m-0">
                      <input type="checkbox" name="checkbox-usuario" class="user-select" id="usuario-${row.idUsuario}" ${ row.seleccionado ? 'checked': ''}>
                      <label for="usuario-${row.idUsuario}" class="cr cr-indigo cr-no-text mb-0"></label>
                    </div>`;
        }},
        { title: 'USUARIOS', data: 'nombre', render: (data, type, row) => {
            return `<span style="font-size:11px;">${row.nombre} - (${row.usuario})</span>`;
        }},
        { title: 'CLIENTES', data: 'numClientes', width: "5%", visible: true
          , render: (data, type, row) => {
            return `<span style="text-align:right;">${row.numClientes}</span>`; }
        },
      ],
      createdRow: (row: any | Node, data: any | Object, index: number) => {

        // ------------------------------------------------

        // console.log('usuario', this._usuariosSeleccionados.find( x => x.idUsuario === data.idUsuario));

        if(this._usuariosSeleccionados.find( x => x.idUsuario === data.idUsuario)){
          // console.log('seleccionado');
          $('td:eq(0)', row).find('.index').text(this._usuariosSeleccionados.findIndex( x => x.idUsuario === data.idUsuario) + 1);
          const table: any = $('.table-usuario').DataTable();
          table.row(row, { page: 'current' }).select();
          $(row).find('#usuario-'+data.idUsuario).prop('checked',true);
        }else{
          $('td:eq(0)', row).find('.index').text('');
          const table: any = $('.table-usuario').DataTable();
          table.row(row, { page: 'current' }).deselect();
        }

        // $(row).addClass('selected');

        $(row).find('input.user-select').on('change',(evt) => {
          if($(evt.target).is(':checked')){
            this._usuariosSeleccionados.push(data);
            // console.log('usuario_seleccionados', this._usuariosSeleccionados );
            $('td:eq(0)', row).find('.index').text(this._usuariosSeleccionados?.findIndex( x => x.idUsuario === data.idUsuario) + 1 );
            //$('.table-usuario').DataTable().row($(row)).invalidate().draw();

            // var data = $('.table-usuario').DataTable().rows({ selected: true });
            // console.log(data);
            const table: any = $('.table-usuario').DataTable();
            table.row(row, { page: 'current' }).select();

            //console.log( table.rows({ selected: true }).data().row().node() );
            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._usuariosSeleccionados?.findIndex( x => x.idUsuario === this.data().idUsuario) + 1);
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

            // console.log(this.numOperadorasSeleccionadas);

            //limpiar seleccion anterior seleccionado = 0;
            this.maestroUsuario.forEach((a: any)  => { a.numClientes = 0; a.seleccionado = false });

            for(var i = 0; i < this.usuariosSeleccionados.length; i++) {
              const input = this.usuariosSeleccionados[i] as HTMLInputElement;
              const idUsuario = parseInt(input.getAttribute('id').split('-')[1], 10);
              this.maestroUsuario.find(x => x.idUsuario == idUsuario).seleccionado = true;
            }
          }
        );
        return row;
      },
      order: [],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [ 'excel' ],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      bLengthChange: false,
      dom: '<"p-2 d-flex"f>lrt<"p-2 d-block"<"form-row m-0"<"col-12 paginate-center"p><"col-12 text-center center-info"i>>>',
      pagingType: 'full_numbers',
    };
  }

  buildtableCliente(): void{
    this.dtResponsivePreferentes = {
      ajax: (_dataTablesParameters: any, callback) => {

        const tipoCliente = parseInt(this.f.tipoCliente.value, 10);
        const idSede = parseInt(this.f.idSede.value, 10);
        const fechaCita = this.f.fechaCita.value;
        const asignado = parseInt(this.f.asignado.value, 10);

        // console.log(this._clientesSeleccionados);


        this.spinner.show();
        if(this.reloadBD){
            if(this.idUsuarioReasignacion == 0) {

              // console.log('clientes');

              const subs = this.clienteAsignadoService.obtener(tipoCliente, idSede, fechaCita, asignado).subscribe(
                (data: ClienteAsignado[] | ErrorSistema) => {

                  if(data instanceof ErrorSistema){
                    callback({ data: []});
                    this.utilsService.mostrarToast('Ocurrio un error al obtener los clientes', 'error');
                  }else{
                    this.maestroClienteAsignado = data;
                    callback({ data: this.maestroClienteAsignado });
                  }

                  this.spinner.hide();
                },
                error => {
                  console.log('Ocurrio un error al obtener los clientes' + error);
                  this.spinner.hide();
                  callback({ data: []});
                }
              );
              this.subscriptions.push(subs);
            }
        }else {
          callback({ data: this.maestroClienteAsignado });
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
        { title: '', data: 'id', width: "4%", orderable: false,
          render: (data, type, row) => {
            return `<div class="checkbox d-inline p-0 m-0">
                      <input type="checkbox" name="checkbox-cita" id="cita-${row.idCliente}" class="cita-select" ${ row.seleccionado ? 'checked': ''}>
                      <label for="cita-${row.idCliente}" class="cr cr-indigo cr-no-text mb-0 d-block"></label>
                    </div>`;
        }},
        { title : 'CLIENTES', data: 'nombres' ,
          render: (data, type, row) => {
            return `<span style="font-size:11px;">${row.nombres} ${row.apellidos}</span>`; }
        },
        { title: 'FECHA',   data: 'fechaCita', width: "4%",
          render: (data: Date, type, row) => {
          return `<span style="font-size:11px;">${this.datePipe.transform(data, 'dd/MM/yyyy')}</span>`;
        }},
        { title: 'HORA',   data: 'fechaCita', width: "4%",
          render: (data: Date, type, row) => {
            return `<span style="font-size:11px;">${this.datePipe.transform(data, 'hh:mm:ss a')}</span>`;
        }},
        { title: 'T. CLIENTE',   data: 'tipoCliente', width: "4%"},
        // {
        //   title: 'ESTADO', data: 'idEstado', width: "10%", visible: true,
        //   render: (data, type, row) => {
        //     switch (row.idEstado) {
        //       case 1:
        //         return '<span class="label sm-status theme-bg-red fs-11px">SIN ASIGNAR</span>';
        //       case 2:
        //         return '<span class="label sm-status theme-bg-yellow fs-11px">ASIGNADO</span>';
        //       case 3:
        //         return '<span class="label sm-status theme-bg-green fs-11px">VISTO</span>';
        //       case 4:
        //         return '<span class="label sm-status theme-bg-black fs-11px" style="color: white;">TRABAJADO</span>';
        //     }
        //   }
        // }
      ],
      createdRow: (row: any | Node, data: any | Object, index: number) => {

        // console.log('data',data);
        // console.log(this._clientesSeleccionados,this._clientesSeleccionados.findIndex( x => x.idCliente === data.idCliente));
        // ------------------------------------------------
        if(this._clientesSeleccionados.findIndex( x => x.idCliente === data.idCliente) >= 0 ){

          const table: any = $('.table-cita').DataTable();
          table.row(row, { page: 'current' }).select();

        }else{

        }

        if(data.seleccionado){
          const table: any = $('.table-cita').DataTable();
          table.row(row, { page: 'current' }).select();
        }else{
          const table: any = $('.table-cita').DataTable();
          table.row(row, { page: 'current' }).deselect();
        }

        $(row).find('input.cita-select').on('change',(evt) => {
          if($(evt.target).is(':checked')){
            this._clientesSeleccionados.push(data);

            // console.log(this._citasSeleccionadas);
            $('td:eq(0)', row).find('.index').text(this._clientesSeleccionados.findIndex( x => x.idCliente === data.idCliente) + 1 );

            const table: any = $('.table-cita').DataTable();
            table.row(row, { page: 'current' }).select();

            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._clientesSeleccionados.findIndex( x => x.idCliente === this.data().idCliente) + 1);
            });
          }else{
            this._clientesSeleccionados = this._clientesSeleccionados.filter( x => x.idCliente !== data.idCliente);
            $('td:eq(0)', row).find('.index').text('');

            const table: any = $('.table-cita').DataTable();
            table.row(row, { page: 'current' }).deselect();

            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._clientesSeleccionados.findIndex( x => x.idCliente === this.data().idCliente) + 1);
            });
          }
        })
        // -------------------------------------------------
      },
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.clientesSeleccionados = $('.table-cita').DataTable().rows().nodes().$('input:checked');
          this.numClientesSeleccionadas = this.clientesSeleccionados.length;
          this.maestroClienteAsignado.find(x => x.idCliente == data.idCliente).seleccionado = true;
          console.log('Se selecciono un cliente', this.maestroClienteAsignado);
        });
        return row;

      },
      headerCallback: ( thead, data, start, end, display ) => {
        const checkbox = `<div class="checkbox d-inline p-0 m-0">
                            <input type="checkbox" name="checkbox-todo" id="chkTodo" ${ this.seleccionTodo ? 'checked': ''}>
                            <label for="chkTodo" class="cr cr-indigo cr-no-text mb-0 d-block"></label>
                          </div>`;
        $(thead).find('th').eq(1).html(checkbox);

        $(thead).find('th div input').eq(0).off('click');
        $(thead).find('th div input').eq(0).on('click', (e) => {
          const valueSeleccionar = ($('#chkTodo')[0] as HTMLInputElement).checked;
          this.seleccionarTodosLosClientes(valueSeleccionar);
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
      // select: true,
      // searching: true,
      // bPaginate: true,
      bLengthChange: false,
      order: [],
      dom: '<"p-2 d-flex"f>lrt<"p-2 d-block"<"form-row m-0"<"col-12 paginate-center"p><"col-12 text-center center-info"i>>>',
      pagingType: 'full_numbers',
    };
  }

  seleccionarTodosLosClientes(valor: boolean): void {
    this._clientesSeleccionados = valor ? this.maestroClienteAsignado : [];
    this.maestroClienteAsignado.forEach((a: any) => a.seleccionado = valor );
    this.numClientesSeleccionadas = this.maestroClienteAsignado.filter(x => x.seleccionado == true).length
    this.reloadBD = false;
    this.seleccionTodo = valor;

    $('.table-cita').DataTable().ajax.reload();
  }

  distribuir(): void {
    this.clienteAsignados = [];
    this._clienteAsignados = [];
    this.clientesSeleccionados = $('.table-cita').DataTable().rows().nodes().$('input:checked');

    if(this._clientesSeleccionados.length == 0 ){
      this.utilsService.mostrarToast('Debe seleccionar clientes', 'warning');
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
    const num_clientes = this._clientesSeleccionados.length;
    let residuo: number = 0;
    let cont_residuo: number = 0;
    let n_partes = 0;
    let posicion_ini = 0;
    let posicion_fin = 0;


    if( num_clientes > num_usuarios ){

      n_partes = Math.floor(num_clientes / num_usuarios);
      residuo = num_clientes - ( num_usuarios * n_partes );

      //console.log(num_usuarios,num_clientes,n_partes,residuo);

      this._usuariosSeleccionados.forEach( u => {
        let cont_partes = 0;

        if(posicion_ini){
          posicion_ini++;
        }

        posicion_fin = (posicion_ini + (n_partes-1)) < this._clientesSeleccionados.length ? (posicion_ini + (n_partes-1)) : (this._clientesSeleccionados.length - 1);

        //console.log('pini = ' + posicion_ini, 'pfin = ' + posicion_fin);

        for (let i = posicion_ini; i <= posicion_fin; i++) {

          //console.log(this._citasSeleccionadas[i].idCita);
          this._clienteAsignados.push({
            fechaCita: this.f.fechaCita.value,
            idCliente: this._clientesSeleccionados[i].idCliente,
            idUsuarioOperador: u.idUsuario,
            fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
            idUsuarioRegistra: this.usuarioActual.idUsuario,
            idTipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
            usuario: u.usuario
          });
          posicion_ini = i;
        }

        if( cont_residuo < residuo ){
          posicion_ini ++;
          //console.log('añadido residuo',this._citasSeleccionadas[posicion_ini].idCita);
          this._clienteAsignados.push({
            fechaCita: this.f.fechaCita.value,
            idCliente: this._clientesSeleccionados[posicion_ini].idCliente,
            idUsuarioOperador: u.idUsuario,
            fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
            idUsuarioRegistra: this.usuarioActual.idUsuario,
            idTipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
            usuario: u.usuario
          });
          cont_residuo++;

          //console.log(cont_residuo);
        }

      });

      //console.log('Citas', this._citasAsignadas);
    }else{
      this._clientesSeleccionados.forEach((x,i) => {
        this._clienteAsignados.push({
          fechaCita: this.f.fechaCita.value,
          idCliente: x.idCliente,
          idUsuarioOperador: this._usuariosSeleccionados[i].idUsuario,
          fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
          idUsuarioRegistra: this.usuarioActual.idUsuario,
          idTipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
          usuario: this._usuariosSeleccionados[i].usuario
        });
      });

      //console.log('Citas', this._citasAsignadas);
    }
    // ****************************************************************



    // console.log(this._usuariosSeleccionados);

    let contadorUsuario = 0 ;
    this.maestroUsuario.forEach((a: any) => a.numClientes = 0);

    for(var  i = 0 ; i < this._clientesSeleccionados.length; i++) {
      const idUsuarioOperador = parseInt(this._usuariosSeleccionados[contadorUsuario].idUsuario, 10);
      const clienteAsig = {
        idCliente: parseInt(this._clientesSeleccionados[i].idCliente, 10),
        idUsuarioOperador,
        fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
        idUsuarioRegistra: this.usuarioActual.idUsuario,
        idTipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
        usuario: this.maestroUsuario.find(u => u.idUsuario == idUsuarioOperador).usuario
      }
      contadorUsuario = (contadorUsuario == this._usuariosSeleccionados.length - 1) ? 0 :  contadorUsuario + 1;
      this.clienteAsignados.push(clienteAsig);
    }

    //Actualizar lista de usuario con citas asignadas
    this.clienteAsignados.forEach(element => {
      const idUsuarioOperador = element.idUsuarioOperador;
      this.maestroUsuario.find(u => u.idUsuario == idUsuarioOperador).numClientes += 1;
    });

    //Actualizar lista de citas con nombre de usuario
    this.clienteAsignados.forEach(element => {
      const idCliente = element.idCliente;
      this.maestroClienteAsignado.find(u => u.idCliente == idCliente).asignado = element.usuario ;
    });

    this.reloadBD = false;
    this.asignado = true;
    // $('.table-cita').DataTable().ajax.reload();
    const table = $('.table-usuario').DataTable();
    table.ajax.reload();
    table
      .order( [ 2, 'desc' ] )
      .draw();

    // console.log(this._citasAsignadas);
  }


  grabarDistribuirClientes(): void {
    if(this._clienteAsignados.length == 0){
      this.utilsService.mostrarToast('No hay clientes asignados', 'warning');
      return;
    }

    const model = {
      clientesAsignados: this._clienteAsignados
    }
    //
    // console.log(model);
    // return;

    const subs = this.clienteAsignadoService.asignarLista(model).subscribe(
      resultado => {
        this.utilsService.mostrarToast('Los clientes fueron asignados correctamente', 'success');
        this.OnSaved.emit(true);
        this.modal.close(true);
      },
      error => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error', 'error');
      }
    );
    this.subscriptions.push(subs);
  }

  cerrarModal(): void {
    this.modal.close();
  }

  get f(): any{
    return this.frmOperadores.controls;
  }

  // Events
  escanearTeleoperador(): void {
    this.listaTeleoperadorConfirmado = [];
    $('.table-usuario').DataTable().ajax.reload();
    GlobalConstants.gSignalService.preferenteEscanearTeleoperador().subscribe(
      resultado =>
      {
        console.log('escanear teleoperador', resultado);
      }
    );
  }

  // Data
  listarEstados(): void {
    this.ldEstados = true;
    this.estadoService.obtenerEstadoByEntidad('Preferente').subscribe((res: Estado[]) => {
      this.estados = res;
      // console.log(res);
      this.ldEstados = false;
    }, error => {
      console.log(error);
      this.ldEstados = false;
    });
  }
  listarEstadosAtencion(): void {
    this.ldEstadosAtencion = true;
    this.estadoService.obtenerEstadoByEntidad('Preferente2').subscribe((res: Estado[]) => {
      this.estadosAtencion = res;
      // console.log(res);
      this.ldEstadosAtencion = false;
    }, error => {
      console.log(error);
      this.ldEstadosAtencion = false;
    });
  }
  listarMediosContacto(): void{
    this.ldMediosContacto = true;
    const subs = this.medioContactoService.obtenerMedioContacto().subscribe((res: MedioContacto[]) => {
      this.mediosContacto = res;
      this.ldMediosContacto = false;
    }, error => {
      this.utilsService.mostrarToast('No se pudo obtener los medios de contacto', 'error');
      this.ldMediosContacto = false;
    });
    this.subscriptions.push(subs);
  }
  listarSedes(): void{
      this.ldSedes = true;
      const subs = this.sedeService.obtener().subscribe(
        resultado => {this.maestroSede = resultado; this.ldSedes = false;},
        error => {console.log("Error al obtener las sedes: ", error); this.ldSedes = false;}
      );
      this.subscriptions.push(subs);
  }

}
