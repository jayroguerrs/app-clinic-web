  import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Usuario } from 'src/app/shared/models/usuario';
import { CitaAsignadaService } from '../../../shared/services/cita-asignada.service';
import { NgxSpinnerService } from 'ngx-spinner';
  import {Subscription} from "rxjs";
  import {PreferenteService} from "../../../shared/services/preferente.service";
  import {PreferenteAsignarLista} from "../../../shared/models/preferente.model";

  import Swal from 'sweetalert2';
  import {EstadoService} from "../../../shared/services/estado.service";
  import {Estado, MedioContacto} from "../preferente.models";
  import {GlobalConstants} from "../../../../commons/global-constants";
  import {MensajeSignalR} from "../../../shared/services/signal-r.service";
  import {TipoMensajeSignalR, TipoPerfil} from "../../../shared/enumeracion/enums";
  import {MedioContactoService} from "../../../shared/services/medio-contacto.service";

@Component({
  selector: 'app-preferente-asignar-operador',
  templateUrl: './preferente-asignar-operador.component.html',
  styleUrls: ['./preferente-asignar-operador.component.scss'],
  providers: [DatePipe]
})
export class PreferenteAsignarOperadorComponent implements OnInit, AfterViewInit, OnDestroy {

  tipoPerfil = TipoPerfil;



  @Input() modal: NgbModalRef;
  @Input() idUsuarioReasignacion: number = 0;
  @Input() nombreReasignado?: string = '';
  // @Input() listaTeleoperadorConfirmado: any[] = [];


  listaTeleoperadorConfirmado: any[] = [];

  frmOperadores: FormGroup;
  usuarioActual: Usuario;

  maestroPreferentes: any[] = [];
  // maestroUsuario: any[] = [];

  _usuariosSeleccionados: any = [];
  _preferentesSeleccionados: any = [];
  _preferenteAsignados: any = [];

  preferentesSeleccionados: any = [];
  usuariosSeleccionados: any = []
  preferenteAsignados: any = [];

  reloadBD: boolean = true;
  seleccionTodo: boolean = false;
  asignado: boolean = false;

  numPreferentesSeleccionadas = 0;
  numOperadorasSeleccionadas = 0;

  titulo = '';

  today = new Date();

  modoAsignacion = [
    {id: 0, descripcion: 'Todos'},
    {id: 1, descripcion: 'Dia siguiente'},
    {id: 2, descripcion: 'Semana siguiente'}
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

  constructor(
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private citaAsignadaService: CitaAsignadaService,
    private preferenteService: PreferenteService,
    private spinner: NgxSpinnerService,
    private estadoService: EstadoService,
    private medioContactoService: MedioContactoService
  ) {
    this.ldMediosContacto = false;
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.filtro.usuarioId = this.usuarioService.UsuarioActual.idUsuario;
    this.listarEstados();
    this.listarEstadosAtencion();
    this.inicializarFormulario();
    this.buildtableUsuario();
    this.buildtablePreferentes();
    this.listarMediosContacto();
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
                numPreferentes : 0
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
    this.numPreferentesSeleccionadas = this.preferentesSeleccionados.length;
    this.numOperadorasSeleccionadas = this.usuariosSeleccionados.length;

    const today = new Date();
    // console.log(today);

    this.frmOperadores = this.formBuilder.group({
      asignados: [0],
      fechaDesde: [this.datePipe.transform(today, 'yyyy-MM-dd'), Validators.required],
      fechaFin: [this.datePipe.transform(today, 'yyyy-MM-dd'), Validators.required],
      sinAsignar: [false],
      filterEstado: [0],
      filterEstadoAtencion: [0],
      filterMedioContacto: [''],
      esCliente: [2],
      horaDesde: [null],
      horaHasta: [null],
    });

    if(this.idUsuarioReasignacion == 0) {
      this.modoAsignacion = this.modoAsignacion.filter(f => f.id != 0);
    }
  }

  obtenerCitas(): void {
    this.submitted = true;

    if( this.frmOperadores.controls.fechaDesde.invalid || this.frmOperadores.controls.fechaFin.invalid ){
      this.utilsService.mostrarToast('Debe seleccionar el rango de fechas','warning');
      return;
    }

    this.reloadBD = true;
    this.seleccionTodo = false;
    this.preferenteAsignados = [];
    this._preferenteAsignados = [];
    this._preferentesSeleccionados = [];
    this.preferentesSeleccionados = [];
    $('.table-cita').DataTable().ajax.reload();
    $('.table-usuario').DataTable().ajax.reload();
  }

  buildtableUsuario(): void{
    this.dtResponsiveOptionsUsuario = {
      // data: this.listaTeleoperadorConfirmado,
      ajax: (_dataTablesParameters: any, callback) => {

        this.usuarioService.obtenerParaPreferentesPorId(this.usuarioActual.idUsuario).subscribe((res) => {
          const collection: any[] = res.data.map(x => {
            return {
              idUsuario: x.idUsuario,
              nombre: x.nombre,
              seleccionado: false,
              usuario: x.usuario,
              numPreferentes: 0
            }
          });
          this.listaTeleoperadorConfirmado = collection;
          callback({ data: collection  });
        }, error => {
          callback({ data: [] });
          this.utilsService.mostrarToast('Ocurrio un error al intentar obtener los usuarios', 'error');
        });

        // console.log('load pñreferente');
        // callback({ data: this.listaTeleoperadorConfirmado  });
      },
      columns: [
        { title: 'NOMBRE', data: 'nombre', width: "20%"
          , render: (data, type, row) => {
              return `<span class="index"></span><div class="checkbox d-inline">
                        <input type="checkbox" name="checkbox-usuario" class="user-select" id="usuario-${row.idUsuario}" ${ row.seleccionado ? 'checked': ''}>
                        <label for="usuario-${row.idUsuario}" class="cr mb-0 d-inline-flex align-items-center"  style="font-size:11px;">${row.nombre} - (${row.usuario})</label>
                      </div>`;
        }},
        { title: 'PREFERENTES', data: 'numPreferentes', width: "5%", visible: true
          , render: (data, type, row) => {
            return `<div style="text-align:right;"><label style="font-size:11px;">${row.numPreferentes}</label></div>`; }
        },
      ],
      createdRow: (row: any | Node, data: any | Object, index: number) => {

        // ------------------------------------------------

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
            console.log('usuario_seleccionados', this._usuariosSeleccionados );
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
            this.listaTeleoperadorConfirmado.forEach((a: any)  => { a.numPreferentes = 0; a.seleccionado = false });

            for(var i = 0; i < this.usuariosSeleccionados.length; i++) {
              const input = this.usuariosSeleccionados[i] as HTMLInputElement;
              const idUsuario = parseInt(input.getAttribute('id').split('-')[1], 10);
              this.listaTeleoperadorConfirmado.find(x => x.idUsuario == idUsuario).seleccionado = true;
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


  filtrarPorHora(data: any[], horaDesde: string, horaHasta?: string) {
    // Convertir horaDesde y horaHasta a horas y minutos
    const [horaDesdeFiltro, minutoDesdeFiltro] = horaDesde.split(':').map(Number);
    let [horaHastaFiltro, minutoHastaFiltro] = [25, 0];  
  
    // Si se proporciona horaHasta, también convertirla
    if (horaHasta) {
      [horaHastaFiltro, minutoHastaFiltro] = horaHasta.split(':').map(Number);
      horaHastaFiltro = horaHastaFiltro === 0 ? 24 : horaHastaFiltro;
      minutoHastaFiltro = horaHastaFiltro === 0 ? 0 : minutoHastaFiltro;
    }
  
    // Filtrar los datos
    const datosFiltrados = data.filter(item => {
      // Extraer hora y minutos de la fecha completa
      const fecha = new Date(item.fechaRegistra);
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();
  
      if (horaHastaFiltro !== 25) {
        const esMayorOIgualHoraDesde =
          (hora > horaDesdeFiltro) || (hora === horaDesdeFiltro && minutos >= minutoDesdeFiltro);
  
        const esMenorOIgualHoraHasta =
          (hora < horaHastaFiltro) || (hora === horaHastaFiltro && minutos <= minutoHastaFiltro);
  
        return esMayorOIgualHoraDesde && esMenorOIgualHoraHasta;
      } else {
        const esMayorOIgualHoraDesde =
          hora === horaDesdeFiltro && minutos === minutoDesdeFiltro;
        return esMayorOIgualHoraDesde;
      }
    });
  
    // Ordenar los datos filtrados por la hora (en formato Date)
    return datosFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fechaRegistra);  // Asegúrate de usar "fechaRegistra"
      const fechaB = new Date(b.fechaRegistra);
      
      // Ordenar por hora y minutos (sin tener en cuenta la fecha)
      const horaA = fechaA.getHours();
      const minutosA = fechaA.getMinutes();
      const horaB = fechaB.getHours();
      const minutosB = fechaB.getMinutes();
      
      // Primero se compara la hora, si son iguales, se compara los minutos
      if (horaA === horaB) {
        return minutosA - minutosB;  // Ordenar por minutos si las horas son iguales
      }
      return horaA - horaB;  // Ordenar por hora
    });
  }

  isHoraDesdeNull() {
    const boleanoHora = this.frmOperadores.get('horaDesde')?.value === null
    return !boleanoHora;
  }

  volverHora(){
    this.frmOperadores.patchValue({
      horaDesde: null,
      horaHasta: null
    });

    this.obtenerCitas();
  }

  buildtablePreferentes(): void{
    this.dtResponsivePreferentes = {
      ajax: (_dataTablesParameters: any, callback) => {

        const fecha = this.f.fechaDesde.value;
        const fechaFin = this.f.fechaFin.value;
        this.filtro.desde = fecha;
        this.filtro.hasta = fechaFin;
        this.filtro.estado = parseInt(this.f.filterEstado.value, 10);
        this.filtro.estadoAtencion = parseInt(this.f.filterEstadoAtencion.value, 10);
        this.filtro.medioContacto = this.f.filterMedioContacto.value === '' ? 0 : parseInt(this.f.filterMedioContacto.value);
        this.filtro.esCliente = parseInt(this.f.esCliente.value, 10);

        this.spinner.show();
        if(this.reloadBD){
            if(this.idUsuarioReasignacion == 0) {
              this.titulo = 'Asignación de listado de preferentes';

              this.sbcPreferentesObtener = this.preferenteService.preferenteConTelefonoObtenerPorFiltros(this.filtro).subscribe(
                data => {
                  data.forEach((a: any)  => { a.seleccionado = false });

                  if(this.f.horaDesde.value){
                    data = this.filtrarPorHora(data ,this.f.horaDesde.value, !this.f.horaHasta.value ? undefined : this.f.horaHasta.value);
                  }
                  // console.log(data);
                  this.maestroPreferentes = data;
                  callback({ data: this.maestroPreferentes });
                  this.spinner.hide();
                },
                error => {
                  console.log('Error al obtener los preferentes' + error);
                  this.spinner.hide();
                }
              );
            }
        }else {
          callback({ data: this.maestroPreferentes });
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
          return `<div class="checkbox d-inline">
                    <input type="checkbox" name="checkbox-cita" id="cita-${row.id}" class="cita-select" ${ row.seleccionado ? 'checked': ''}>
                    <label for="cita-${row.id}" class="cr mb-0 d-inline-flex align-items-center" style="font-size:11px;">${row.nombres}</label>
                  </div>`; }
        },
        { title : 'CONTACTO', data: 'medioContacto' ,
          render: (data, type, row) => {
            return `<span style="font-size:11px;">${data}</span>`; }
        },
        {
          title: 'HR ING.', data: 'fechaRegistra', width: "4%", render: (data: string) => {
            return this.datePipe.transform(new Date(data), 'hh:mm a');
          }
        },

        { title: 'FECHA',   data: 'fechaRegistra', width: "4%",
          render: (data: Date, type, row) => {
          return `<span style="font-size:11px;">${this.datePipe.transform(row.fechaRegistra, 'dd/MM/yyyy')}</span>`;
        }},

        { title : 'UTM CAMPAING', data: 'utmCampaign' ,
          render: (data, type, row) => {
            return `<span style="font-size:11px;">${data}</span>`; }
        },
        {
          title: 'ESTADO', data: 'idEstado', width: "10%", visible: true,
          render: (data, type, row) => {
            switch (row.idEstado) {
              case 1:
                return '<span class="label sm-status theme-bg-red fs-11px">SIN ASIGNAR</span>';
              case 2:
                return '<span class="label sm-status theme-bg-yellow fs-11px">ASIGNADO</span>';
              case 3:
                return '<span class="label sm-status theme-bg-green fs-11px">VISTO</span>';
              case 4:
                return '<span class="label sm-status theme-bg-black fs-11px" style="color: white;">TRABAJADO</span>';
              default:
                return '<span class="label sm-status bg-indigo fs-11px text-white">SIN NÚMERO</span>';
            }
          }
        }
      ],
      createdRow: (row: any | Node, data: any | Object, index: number) => {

        // console.log('data',data);
        // ------------------------------------------------
        if(this._preferentesSeleccionados.findIndex( x => x.id === data.id) >= 0 ){

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

            // console.log('seleccionadoooo');

            this._preferentesSeleccionados.push(data);

             console.log('_preferentesSeleccionados', this._preferentesSeleccionados);
            $('td:eq(0)', row).find('.index').text(this._preferentesSeleccionados.findIndex( x => x.id === data.id) + 1 );

            const table: any = $('.table-cita').DataTable();
            table.row(row, { page: 'current' }).select();

            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._preferentesSeleccionados.findIndex( x => x.id === this.data().id) + 1);
            });
          }else{
            this._preferentesSeleccionados = this._preferentesSeleccionados.filter( x => x.id !== data.id);
            $('td:eq(0)', row).find('.index').text('');

            const table: any = $('.table-cita').DataTable();
            table.row(row, { page: 'current' }).deselect();

            const _this = this;
            table.rows({ selected: true }).every( function ( rowIdx, tableLoop, rowLoop ) {
              $(this.node()).find('.index').text(_this._preferentesSeleccionados.findIndex( x => x.id === this.data().id) + 1);
            });
          }
        })
        // -------------------------------------------------
      },
      rowCallback: (row: Node, data: any | Object, index: number) => {

        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.preferentesSeleccionados = $('.table-cita').DataTable().rows().nodes().$('input:checked');
          this.numPreferentesSeleccionadas = this.preferentesSeleccionados.length;
          this.maestroPreferentes.find(x => x.id == data.id).seleccionado = true;
          console.log('Se selecciono un preferente', this.maestroPreferentes);
        });
        return row;

      },
      headerCallback: ( thead, data, start, end, display ) => {
        const checkbox = `<div class="checkbox d-inline">
                            <input type="checkbox" name="checkbox-todo" id="chkTodo" ${ this.seleccionTodo ? 'checked': ''}>
                            <label for="chkTodo" class="cr mb-0">PREFERENTES</label>
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
      // select: true,
      // searching: true,
      bLengthChange: false,
      order: []
    };
  }
  seleccionarTodasLasCitas(valor: boolean): void {
    this._preferentesSeleccionados = valor ? this.maestroPreferentes : [];
    this.maestroPreferentes.forEach((a: any) => a.seleccionado = valor );
    this.numPreferentesSeleccionadas = this.maestroPreferentes.filter(x => x.seleccionado == true).length
    this.reloadBD = false;
    this.seleccionTodo = valor;
    $('.table-cita').DataTable().ajax.reload();
  }

  async distribuirPreferentes(): Promise<void> {
    this.preferenteAsignados = [];
    this._preferenteAsignados = [];
    this.preferentesSeleccionados = $('.table-cita').DataTable().rows().nodes().$('input:checked');

    await this.listaTeleoperadorConfirmado.forEach((a: any) => a.numPreferentes = 0);

    if(this._preferentesSeleccionados.length == 0 ){
      this.utilsService.mostrarToast('Debe seleccionar preferentes', 'warning');
      return;
    }

    if(this._usuariosSeleccionados.length == 0){
      this.utilsService.mostrarToast('Debe seleccionar usuarios', 'warning');
      return;
    }

    // if(this.frmOperadores.controls.idModo.value == 0){
    //   this.utilsService.mostrarToast('Seleccione el modo', 'warning');
    //   return;
    // }


    // ****************************************************************

    // console.log('citas seleccionadas', this._citasSeleccionadas);
    console.log('_usuario seleccionadas', this._usuariosSeleccionados);
    console.log('_preferentes seleccionadas', this._preferentesSeleccionados);

    const num_usuarios = this._usuariosSeleccionados.length;
    const num_citas = this._preferentesSeleccionados.length;
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

        posicion_fin = (posicion_ini + (n_partes-1)) < this._preferentesSeleccionados.length ? (posicion_ini + (n_partes-1)) : (this._preferentesSeleccionados.length - 1);

        //console.log('pini = ' + posicion_ini, 'pfin = ' + posicion_fin);

        for (let i = posicion_ini; i <= posicion_fin; i++) {

          //console.log(this._citasSeleccionadas[i].id);
          this._preferenteAsignados.push({
            idPreferente: this._preferentesSeleccionados[i].id,
            idUsuarioOperador: u.idUsuario,
            // fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
            idUsuarioRegistra: this.usuarioActual.idUsuario,
            // tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
            //usuario: u.usuario
          });
          posicion_ini = i;
        }

        if( cont_residuo < residuo ){
          posicion_ini ++;
          //console.log('añadido residuo',this._citasSeleccionadas[posicion_ini].id);
          this._preferenteAsignados.push({
            idPreferente: this._preferentesSeleccionados[posicion_ini].id,
            idUsuarioOperador: u.idUsuario,
            // fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
            idUsuarioRegistra: this.usuarioActual.idUsuario,
            // tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
            //usuario: u.usuario
          });
          cont_residuo++;

          //console.log(cont_residuo);
        }

      });

      //console.log('Citas', this._citasAsignadas);
    }else {
      this._preferentesSeleccionados.forEach((x, i) => {
        this._preferenteAsignados.push({
          idPreferente: x.id,
          idUsuarioOperador: this._usuariosSeleccionados[i].idUsuario,
          // fechaConfirmacion: this.frmOperadores.controls.fechaConfirmacion.value,
          idUsuarioRegistra: this.usuarioActual.idUsuario,
          // tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
          //usuario: this._usuariosSeleccionados[i].usuario
        });
      });
    }
    // ****************************************************************



    // console.log(this._usuariosSeleccionados);

    let contadorUsuario = 0 ;
    // this.listaTeleoperadorConfirmado.forEach((a: any) => a.numPreferentes = 0);

    for(var  i = 0 ; i < this._preferentesSeleccionados.length; i++) {
      const idUsuarioOperador = parseInt(this._usuariosSeleccionados[contadorUsuario].idUsuario, 10);
      const citaAsig = {
        idPreferente: parseInt(this._preferentesSeleccionados[i].id, 10),
        idUsuarioOperador,
        // fechaConfirmacion:  this.frmOperadores.controls.fechaConfirmacion.value,
        idUsuarioRegistra: this.usuarioActual.idUsuario,
        // tipo: parseInt( this.frmOperadores.controls.idModo.value, 10),
        //usuario: this.listaTeleoperadorConfirmado.find(u => u.idUsuario == idUsuarioOperador).usuario
      }
      contadorUsuario = (contadorUsuario == this._usuariosSeleccionados.length - 1) ? 0 :  contadorUsuario + 1;
      this.preferenteAsignados.push(citaAsig);
    }

    //Actualizar lista de usuario con citas asignadas
    this.preferenteAsignados.forEach(element => {
      const idUsuarioOperador = element.idUsuarioOperador;
      this.listaTeleoperadorConfirmado.find(u => u.idUsuario == idUsuarioOperador).numPreferentes += 1;
    });

    //Actualizar lista de citas con nombre de usuario
    this.preferenteAsignados.forEach(element => {
      const id = element.idPreferente;
      this.maestroPreferentes.find(u => u.id == id).asignado = element.usuario ;
    });

    this.reloadBD = false;
    this.asignado = true;
    // $('.table-cita').DataTable().ajax.reload();

    const table = $('.table-usuario').DataTable();
    table.clear().rows.add(this.listaTeleoperadorConfirmado).draw();
    // table.ajax.reload();
    // table
    //   .order( [ 1, 'desc' ] )
    //   .draw();

    // console.log(this._citasAsignadas);
  }
  grabarDistribuirPreferentes(): void {
    if(this._preferenteAsignados.length == 0){
      this.utilsService.mostrarToast('No hay citas asignadas', 'warning');
      return;
    }

    const model = {
      preferentesAsignados: this._preferenteAsignados
    }
    //
    // console.log(model);
    // return;

    this.sbcGuardarPreferenteAsignado = this.preferenteService.asignarLista(this._preferenteAsignados).subscribe(
      resultado => {
        this.utilsService.mostrarToast('Preferentes asignados correctamente', 'success');
        this.modal.close(true);
      },
      error => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error', 'error');
      }
    );
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
      console.log(res);
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
      console.log(res);
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

}
