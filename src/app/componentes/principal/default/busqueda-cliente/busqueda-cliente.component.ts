import { Component, OnInit, ViewChild, Inject, HostListener, ChangeDetectorRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { ControlDeCitasService } from '../../../../shared/services/control-de-citas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, Subject, Subscription } from 'rxjs';
import { ClienteBusquedaCitaService } from '../../../../shared/services/cliente-busqueda-cita.service';
import { RSede } from '../../../../shared/interfaces/Response/sede';
import { SedeService } from '../../../../shared/services/sede.service';
import { CitaService } from '../../../../shared/services/cita.service';
import { CitaTipoService } from '../../../../shared/services/cita-tipo.service';
import { EstadoService } from '../../../../shared/services/estado.service';
import { Estado } from '../../../preferente/preferente.models';
import { PagoFinalDialog } from '../../../cita/cita-registro/cita-registro.component';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../shared/models/usuario';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicio } from '../../../../shared/models/servicio';
import { ServicioService } from '../../../../shared/services/servicio.service';
import { PermisosService } from '../../../../shared/services/permisos.service';
import { CitaExportar } from '../../../../shared/models/cita';

import { AuditoriaService } from '../../../../shared/services/auditoria.service'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
import { UtilsService } from '../../../../shared/services/funciones/utils.service';
import { ImportExportDataService } from '../../../../shared/services/import-export-data.service';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { CitaEstado, ColorEstadoCita, ColorServicioCita } from '../../../../shared/enumeracion/enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdlAgendarCitaComponent } from '../../../modals/mdl-agendar-cita/mdl-agendar-cita.component';

const DEFAULT_DURATION = 300;
@Component({
  selector: 'app-busqueda-cliente',
  templateUrl: './busqueda-cliente.component.html',
  styleUrls: ['./busqueda-cliente.component.scss', '../../../cita/control-de-citas/citas-cerradas/citas-cerradas.component.scss', '../../../cita/control-de-citas/control-de-citas.component.scss'],
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
export class BusquedaClienteComponent implements OnInit {
 public palabraBusqueda : string;
  elementos_por_pagina: number = 10;
  pageIndex: number = 0; 

  idUsuario: any;

  collectionSede: RSede[] = [];
  listadoTipoCliente = [];
  idClienteElegido: number;
  listadoTipoCita: any = [];
  citaEstados: Estado[] = [];
  listaServicios: Servicio[] = [];

  
  private searchSubject = new Subject<string>();
  clientesEncontrados: any = [];
  esNuevoCliente: string = ''

  sedeSeleccionada: number = 0
  clienteSeleccionado: number = 0
  tipoCitaSeleccionada: number = 0
  estadoSeleccionado: number = 0
  servicioSeleccionado: number = 0
  horaDesde: string = ''
  horaHasta: string = ''
  fechaFiltro:any = null

  nombreClienteElegido: string = ''

  citasClienteFiltrado = [];
  citasCliente: any = [];

  usuarioActual: Usuario;

  mostrarFiltros: boolean = false;
  pageSize: number = 3;
  esListadoPorFecha: boolean = false;

  esListadoGlobal: boolean = false;

  listadoClientesCcvox: any = [];
  @Output() citaSeleccionada = new EventEmitter<number>();
  @Output() quitarCita = new EventEmitter<boolean>();
  @Output() quitarCitaPorId = new EventEmitter<boolean>();
  @Output() enviarCitasParaHistoria = new EventEmitter<any>();
  @Output() enviarFechaParaHistoria = new EventEmitter<string>();
  @Output() esListadoGlobalExportar = new EventEmitter<boolean>();

  selectedRow: any = null;
  
  subscriptionCitasExportar: Subscription;
  exportarCollection: CitaExportar[] = [];
  exportarCollectionInfo: any[] = [];

  subscriptions: Subscription[] = [];

  public pagina: number= 1;
  public rowsPerPage: number = 5;
  public totalDeCitasGlobales: number = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    public dialog: MatDialog,

    private clienteBusquedaService :ClienteBusquedaCitaService,
    private sedeService: SedeService,
    private citaService: CitaService,
    private tiposCitaService: CitaTipoService,

    private estadoService: EstadoService,
    private controlDeCitasService: ControlDeCitasService,    
    private usuarioService: UsuarioService,
    private router: Router,
    private servicioService: ServicioService,

    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private permisoService: PermisosService,
    private auditoriaService : AuditoriaService,  
    private utilsService: UtilsService,
    private importExportDataService: ImportExportDataService,
    private modalService: NgbModal,
  ) {}

  displayedColumnsControlCitas: string[] = ['carta', 'id_cita', 'fecha_de_cita', 'id_servicio', 'resumen', 'nombre_cliente', 'clienteNuevo', 'id_estado', 'id_tipo_cita', 'total', 'pago_final'];
  dataSourceControl = new MatTableDataSource<any>([]);

  collapsed = true;

  totales: any[] = []

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('secondDiv') secondDiv!: ElementRef;
  
  ngOnInit(): void {
    this.obtenerDatos();
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.searchSubject.pipe(
      debounceTime(200),  // Espera 2 segundos después de que el usuario deje de escribir
      distinctUntilChanged()  // Solo emite si el término de búsqueda cambia
    ).subscribe(searchTerm => {
      
      if (searchTerm.length === 0) {
        this.limpiarTodo();
        this.clientesEncontrados = [];
      }
      if (searchTerm.length > 1) {
        this.clienteBusquedaService.busquedaClientes(searchTerm).subscribe((resp: any) => {
          this.clientesEncontrados = resp;
        });
      }
    });

    this.isSmallScreen = this.windowWidth <= 1193;
    this.mostrarFiltros = this.windowWidth >= 1193;

    this.traerClientesCcvox();

    this.route.queryParams.subscribe(params => {
      if(params['listadoDeCitas']) {
        
        this.secondDiv.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
        });
      }
    }).add(() => {
      this.secondDiv.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    })
  }

  onPageChanged(event: any): void {
    if(this.esListadoGlobal){
      if(event.pageSize !== this.rowsPerPage) {
        this.pagina = 1;
        this.paginator.pageIndex = 0;
      } else{
        this.pagina = event.pageIndex + 1;
      }
      this.rowsPerPage = event.pageSize;
      this.obtenerTodasLasCitas();

    } else{
      this.pageIndex = event.pageIndex;
    }
  }

  isPerfilAutorizado(): boolean {
    return this.permisoService.isAutorizado(this.usuarioActual.idperfil);
  }

  public limpiarTodo(){
    this.spinner.show();
    this.sedeSeleccionada = 0
    this.clienteSeleccionado = 0
    this.tipoCitaSeleccionada = 0
    this.estadoSeleccionado = 0
    this.servicioSeleccionado = 0
    this.horaDesde = '';
    this.horaHasta = '';
    if(!this.esListadoGlobal){
      this.fechaFiltro = null
    }

    this.nombreClienteElegido = ''
    this.palabraBusqueda = '';
    this.esNuevoCliente = ''
    this.dataSourceControl = new MatTableDataSource<any>([]);
    this.enviarCitasParaHistoriaClinica();
    this.dataSourceControl.paginator = this.paginator;
    this.spinner.hide();
    this.citasClienteFiltrado = [];
    this.citasCliente = [];
    this.listadoClientesCcvox = [];
    this.idClienteElegido = 0;

    this.clientesEncontrados = [];
    this.limpiarFiltroBusquedaIdCita();
  }

  limpiarTodoMenosFiltros(){
    this.nombreClienteElegido = ''
    this.palabraBusqueda = '';
    this.esNuevoCliente = ''
    this.dataSourceControl = new MatTableDataSource<any>([]);
    this.dataSourceControl.paginator = this.paginator;
    this.citasClienteFiltrado = [];
    this.citasCliente = [];
    this.idClienteElegido = 0;

    this.limpiarFiltroBusquedaIdCita();
  }

  limpiarFiltros(){
    this.sedeSeleccionada = 0
    this.clienteSeleccionado = 0
    this.tipoCitaSeleccionada = 0
    this.estadoSeleccionado = 0
    this.servicioSeleccionado = 0
    this.horaDesde = '';
    this.horaHasta = '';
    if(!this.esListadoGlobal){
      this.fechaFiltro = null
    }
    this.dataSourceControl = new MatTableDataSource<any>(this.citasCliente);
    this.enviarCitasParaHistoriaClinica();
    this.dataSourceControl.paginator = this.paginator;
    this.pageIndex = 0;
    this.pagina = 1;
    this.clientesEncontrados = [];
    this.limpiarFiltroBusquedaIdCita();

    if(this.esListadoGlobal){
      this.obtenerTodasLasCitas();
    }
  }

  limipiarFiltrosListadoGlobalPaginado(){
    this.sedeSeleccionada = 0
    this.clienteSeleccionado = 0
    this.tipoCitaSeleccionada = 0
    this.estadoSeleccionado = 0
    this.servicioSeleccionado = 0
    this.horaDesde = '';
    this.horaHasta = '';
  }

  limipiarFiltrosListadoGlobal(){
    this.sedeSeleccionada = 0
    this.clienteSeleccionado = 0
    this.tipoCitaSeleccionada = 0
    this.estadoSeleccionado = 0
    this.servicioSeleccionado = 0
    this.horaDesde = '';
    this.horaHasta = '';
  }

  ngAfterViewInit() {
    this.dataSourceControl.paginator = this.paginator;
  }

  toggle() {
    this.collapsed = !this.collapsed;
    if(this.collapsed === false){
      this.verTotales();
    }
  }
  expand() {
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }

  performSearchDos(value: string = '') {
    this.searchSubject.next(value);  
  }

  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text');
    this.performSearchDos(pastedText);
  }

  mostrarFiltrosMobile(){
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  obtenerDatos(){
    this.obtenerSedes();
    this.obtenerTipDeCliente();
    this.obtenerTiposCita();
    this.obtenerEstados();
    this.listarServicios();
  }

  obtenerTipDeCliente(){
    this.citaService.obtenerDatosPreliminares().subscribe(
      resultado => {
        this.listadoTipoCliente = resultado.clienteTipos;
      },
      error => {
        console.log('Error al obtener los datos preliminares', error);
      }
    );
  }

  obtenerSedes(): void{
      // this.loadingSede = true;
      this.sedeService.obtener().subscribe((res: any[]) => {
        const collection: RSede[] = [];
        res.forEach((el) => {
          const sede: RSede = {
            id: el.idSede,
            nombre: el.nombre
          };
          collection.push(sede);
        });
  
        this.collectionSede = collection;
      }, error => {
        
      }, () => {
        // this.loadingSede = false;
      });
    }
  
  obtenerEstados(): void {
    this.estadoService.obtenerEstadoByEntidad('cita').subscribe((res: Estado[]) => {
      this.citaEstados = res;
    })

  }

  obtenerTiposCita(): void{
    this.tiposCitaService.collection().subscribe((res) => {
      this.listadoTipoCita = res;
    }, error => {
      
    });
  }

  listarServicios(): void{
    this.servicioService.listarByEstado(1).subscribe((x: Servicio[]) => {
      this.listaServicios = x;
    }, error => {
      
    })
  }

  traerClientesCcvox(){
    this.route.queryParams.subscribe(params => {
      if (params['idClientes']) {
        this.spinner.show();
        this.clienteBusquedaService.obtenerListadoCitasClienteCcvox(params['idClientes']).subscribe((resp: any) => {
          this.listadoClientesCcvox = resp;
          this.idClienteElegido = resp[0].id;
          this.obtenerCitasPorClienteCcvox(this.idClienteElegido);
          this.spinner.hide();

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
          });
        })

      }
    });
  }

  volverHora(){
    this.horaDesde = '';
    this.horaHasta = '';

    this.applyFilter();
  }

  obtenerTodasLasCitasPorHoy(){
    this.limpiarTodo();
    this.fechaFiltro = new Date();
    this.pagina = 1;
    this.obtenerTodasLasCitas();
  }

  obtenerCitasPaginadoPorFecha(){
    this.limipiarFiltrosListadoGlobalPaginado();
    this.limpiarTodoMenosFiltros();
    this.pagina = 1;
    this.obtenerTodasLasCitas();
  }

  obtenerCitasPaginadoGlobal(){
    this.limpiarTodoMenosFiltros();
    this.pagina = 1;
    this.obtenerTodasLasCitas();
  }

  obtenerTodasLasCitas(){
    this.spinner.show();
    this.pageIndex = 0;
    // this.pagina = 1;
    // this.limpiarTodoMenosFiltros();

    this.clientesEncontrados = [];
    this.listadoClientesCcvox = [];
    this.collapse();

    this.idClienteElegido = 1
    this.pageSize = 5
    if(!this.fechaFiltro){
      this.fechaFiltro = new Date();
    }
    const fechaActualFormateado = this.fechaFiltro.toISOString().split('T')[0];

    this.clienteBusquedaService.obtenerListadoCitasGlobales(fechaActualFormateado, this.pagina, this.rowsPerPage, this.sedeSeleccionada, this.estadoSeleccionado, this.servicioSeleccionado, this.clienteSeleccionado, this.tipoCitaSeleccionada, this.horaDesde, this.horaHasta).subscribe((resp: any) => {
      this.citasCliente = resp.citas;
      this.totalDeCitasGlobales = resp.total;
      this.dataSourceControl = new MatTableDataSource<any>(resp.citas);
      // this.dataSourceControl.paginator = this.paginator;

      this.quitarCitaPorId.emit(true);
      this.esListadoGlobal = true;
      this.esListadoGlobalExportar.emit(this.esListadoGlobal);

      this.enviarCitasParaHistoriaClinica();
      this.enviarFechaDeListadoDeCita()
      this.spinner.hide();

      this.secondDiv.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      //
    })
  }

  obtenerCitasPorClienteCcvox(idCLiente: number){
    this.spinner.show();
    this.pageIndex = 0;
    this.pagina = 1;
    this.limpiarTodoMenosFiltros();
    this.limpiarFiltros();
    this.clientesEncontrados = [];

    this.idClienteElegido = idCLiente;
    this.pageSize = 5

    const indexClienteCitas = this.listadoClientesCcvox.findIndex((x: any) => x.id === idCLiente);
    this.dataSourceControl = new MatTableDataSource<any>(this.listadoClientesCcvox[indexClienteCitas].citas);
    this.citasCliente = this.listadoClientesCcvox[indexClienteCitas].citas;
    this.dataSourceControl.paginator = this.paginator;

    this.nombreClienteElegido = this.listadoClientesCcvox[indexClienteCitas].nombreCliente;
    this.spinner.hide();
  }

  applyFilter(){
    if(!this.esListadoGlobal){
      this.applyFilterCliente();
    } else {
      this.obtenerCitasPaginadoGlobal();
    }

  }

  applyFilterCliente(){
    this.limpiarFiltroBusquedaIdCita();
    this.collapse();
    this.clientesEncontrados = [];

    this.citasClienteFiltrado = this.citasCliente.filter(item => {
      const filterBySede = this.sedeSeleccionada > 0 ? item.idSede === this.sedeSeleccionada : true;
      
      const filterByCliente = this.clienteSeleccionado > 0 ? item.idTipoCliente === this.clienteSeleccionado : true;
      
      const filterByTipoCita = this.tipoCitaSeleccionada > 0 ? item.idTipoCita === this.tipoCitaSeleccionada : true;
    
      const filterByEstadoDeCita = this.estadoSeleccionado > 0 ? item.idEstado === this.estadoSeleccionado : true;

      const filterByServicio = this.servicioSeleccionado > 0 ? item.idServicio === this.servicioSeleccionado : true;


      const filterByHora = this.horaDesde ? this.filtrarPorHora([item], this.horaDesde, this.horaHasta).length > 0 : true;

      let filterByFecha = true;

      if(!this.esListadoGlobal){
        if (this.fechaFiltro) {
          const fechaSeleccionada = new Date(this.fechaFiltro);
          const fechaSeleccionadaSoloFecha = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());
      
          const [dia, mes, año] = item.fechaCita.split('-').map(Number);
          const fechaCita = new Date(año, mes - 1, dia);
      
          const fechaCitaSoloFecha = new Date(fechaCita.getFullYear(), fechaCita.getMonth(), fechaCita.getDate());
      
          filterByFecha = fechaCitaSoloFecha.getTime() === fechaSeleccionadaSoloFecha.getTime();
        }
      }
    
      return filterBySede && filterByCliente && filterByTipoCita && filterByEstadoDeCita && filterByServicio && filterByHora && filterByFecha;
    });

    this.pageIndex = 1;
    this.dataSourceControl = new MatTableDataSource<any>(this.citasClienteFiltrado);
    this.enviarCitasParaHistoriaClinica();

    this.dataSourceControl.paginator = this.paginator;

    this.paginator.length = this.citasClienteFiltrado.length;

    this.cdr.detectChanges();

    this.paginator.pageIndex = 1;
    this.dataSourceControl.paginator?.firstPage();
  }

  obtenerCitasDeCliente(idCliente: number){
    this.listadoClientesCcvox = [];
    this.pageSize = 3;
    this.pageIndex = 0;
    this.pagina = 1;
    this.spinner.show();
    this.clienteBusquedaService.obtenerListadoCitasCliente(idCliente).subscribe((resp: any) => {
      this.citasCliente = resp.citas;
      this.dataSourceControl = new MatTableDataSource<any>(resp.citas);
      // this.dataSourceControl.paginator = this.paginator;
      this.esNuevoCliente = resp.esNuevoCliente;
      this.esListadoGlobal = false;
      this.esListadoGlobalExportar.emit(this.esListadoGlobal);
      this.limpiarFiltros()

      this.quitarCitaPorId.emit(true);
      this.spinner.hide();

      this.secondDiv.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    });
  }

  elegirCliente(cliente: any){
    this.nombreClienteElegido = cliente.nombre
    this.palabraBusqueda = cliente.nombre
    this.clientesEncontrados = [];

    this.idClienteElegido = cliente.idCliente;

    this.obtenerCitasDeCliente(cliente.idCliente);
  }

  mostrarCitaDetalle(element: any){

    let id = this.esListadoGlobal ? element.idCliente : this.idClienteElegido;

    if (this.isSmallScreen) {
      this.router.navigate([
        '/Cita',
        element.idCita,
        1,
        element.idCliente,
        element.idPreferente,
        element.idServicio
      ]);
    } else{
      const url = `/Cita/${element.idCita}/${1}/${id}/${element.idPreferente}/${element.idServicio}`;
      window.open(url, '_blank');

    }
  }

  mostrarClienteDetalle(id: number){
    if (this.isSmallScreen) {
      this.router.navigate([
        '/ClientePerfil',
        id
      ]);
    } else{
      const url = `/ClientePerfil/${id}`;
      window.open(url, '_blank');
    }
  }

  filtrarPorHora(data: any[], horaDesde: string, horaHasta?: string) {
    const [horaDesdeFiltro, minutoDesdeFiltro] = horaDesde.split(':').map(Number);
    let [horaHastaFiltro, minutoHastaFiltro] = [25, 0];  
  
    if (horaHasta) {
      [horaHastaFiltro, minutoHastaFiltro] = horaHasta.split(':').map(Number);
      horaHastaFiltro = horaHastaFiltro === 0 ? 24 : horaHastaFiltro;
      minutoHastaFiltro = horaHastaFiltro === 0 ? 0 : minutoHastaFiltro;
    }
  
    const datosFiltrados = data.filter(item => {
      const fecha = new Date(item.horaInicio);
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
  
    return datosFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fechaRegistra); 
      const fechaB = new Date(b.fechaRegistra);
      
      const horaA = fechaA.getHours();
      const minutosA = fechaA.getMinutes();
      const horaB = fechaB.getHours();
      const minutosB = fechaB.getMinutes();
      
      if (horaA === horaB) {
        return minutosA - minutosB; 
      }
      return horaA - horaB; 
    });
  }

  cambiarEstadoPagoFinal(idCita: number, result: any): void {
    const idCitaACambiar = this.dataSourceControl.data.findIndex((x: any) => x.idCita === idCita);
    this.dataSourceControl.data[idCitaACambiar].precioDePagoFinal = Number(result.montoFinal);
    this.dataSourceControl.data[idCitaACambiar].idTipoPago = result.tipoDePago;
    this.dataSourceControl.data[idCitaACambiar].colorTipoPago = result.color;
  }

  cambiarTipoComprobanteCita(idCita: number, tipoComprobante: number): void {
    const idCitaACambiar = this.dataSourceControl.data.findIndex((x: any) => x.idCita === idCita);
    this.dataSourceControl.data[idCitaACambiar].idTipoComprobante = tipoComprobante;
    this.dataSourceControl.data[idCitaACambiar].pagado = true;
  }

  openModalConfirm(idCita: number, precioNeto: number, precioDePagoFinal: any, tipoPago: number | null = null): void {
    this.controlDeCitasService.abrirMdlTipoDePago(idCita, this.nombreClienteElegido, precioDePagoFinal != null ? precioDePagoFinal : precioNeto, tipoPago, precioDePagoFinal)
    .subscribe(result => {
      if (result) {
        this.controlDeCitasService
          .updatePayment(idCita, result.montoFinal, this.usuarioActual.idUsuario, result.tipoDePago)
          .subscribe((res: any) => {
            if (res.status !== 200) return;

            this.cambiarEstadoPagoFinal(idCita, result);
            this.controlDeCitasService.mostrarSuccesPaymentToast(false);
          })

      }
    })
    }
  
  windowWidth: number = window.innerWidth;
  isSmallScreen: boolean = this.windowWidth <= 1193;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = window.innerWidth;
    //? REVIEW: ESTE PUEDE SER EL ERROR DE CIERRE DE FILTROS
    // this.isSmallScreen = this.windowWidth <= 1193;
    // this.mostrarFiltros = this.windowWidth >= 1193;
  }
    
  enviarCitaSeleccionada(row: any){
    this.selectedRow = row;
    this.citaSeleccionada.emit(row);
  }

  limpiarFiltroBusquedaIdCita(){
    this.selectedRow = null;
    this.quitarCita.emit(true);
  }

  enviarFechaDeListadoDeCita(){
    const fechaActualFormateado = this.fechaFiltro.toISOString().split('T')[0];
    this.enviarFechaParaHistoria.emit(fechaActualFormateado);
  }

  enviarCitasParaHistoriaClinica(){
    this.enviarCitasParaHistoria.emit(this.dataSourceControl.data);
  } 

  obtenerCitasParaExportar(){
    const fechaActualFormateado = this.fechaFiltro.toISOString().split('T')[0];
    let pacienteCelular = '';
    if (pacienteCelular == '') pacienteCelular = null;

    const horaDesde = !this.horaDesde ? null : this.horaDesde;
    const horaHasta = !this.horaHasta ? null : this.horaHasta;

    this.subscriptionCitasExportar = this.citaService.obtenerCitasListadoExportar(fechaActualFormateado, horaDesde, horaHasta, this.sedeSeleccionada, this.estadoSeleccionado, pacienteCelular, this.tipoCitaSeleccionada).subscribe((res) => {
      this.exportarCollection = res;
      this.exportar();
    }, error => {
      // Manejo de errores
    });
  }

  exportar(): void{
    const fechaActualFormateado = this.fechaFiltro.toISOString().split('T')[0];

    const param = {
      "idusuario": this.usuarioService.UsuarioActual.idUsuario,
      "tipo_opcion": this.router.url,
      "des_operacion": "Descarga Citas Atendidas",
      "des_nombre_usuario": this.usuarioService.UsuarioActual.nombre,
      "des_nombre_maquina": window.location.hostname, 
      "des_usuario_windows": "",     
      "des_sistema": "",
      "des_usuario_sistema":""
    }
        
    this.auditoriaService.insAuditoria(param).subscribe((res)=>{
      if(res.status === 200){
        if(this.exportarCollection.length){
          const title = 'Citas atendidas';
          const header = ["idCita", "Sede", "Cliente","FechaCita","Zonas","Promociones","HoraInicio","Estado","Pagado","Total"];
    
          const workbook = new Excel.Workbook();
          const worksheet = workbook.addWorksheet('Citas');
    
          worksheet.autoFilter = {
            from: 'A1',
            to: 'J1',
          }
    
          worksheet.getColumn('I').alignment = { horizontal: 'center' };
          worksheet.getColumn('J').alignment = { horizontal: 'right' };
    
          worksheet.addRow(header);
          this.exportarCollection.forEach( d => {
            const data = [ d.idCita , d.sede, d.cliente, d.fechaCita, d.zonas, d.promociones, d.horaInicio, d.estado, d.pagado, d.total.toFixed(2) ]
            worksheet.addRow(data);
          });
    
          worksheet.columns.forEach(function(column){
            var dataMax = 0;
            column.eachCell({ includeEmpty: true }, function(cell){
              var columnLength = cell.value.length;
              if (columnLength > dataMax) {
                dataMax = columnLength;
              }
            })
            column.width = dataMax < 10 ? 10 : dataMax;
          });
    
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, "Citas del "+ fechaActualFormateado  +".xlsx");
          });
        }
      }
      else if(res.status === 400){
        Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'info');
      }
    },    
    (error)=>{
      Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'error');
    });     
  }

  exportarInfo(): void{

    //? Validar campos
    if(!this.fechaFiltro){
      this.utilsService.mostrarToast('Seleccionar fecha','warning');
      return;
    }

    const param = {
      "idusuario": this.usuarioService.UsuarioActual.idUsuario,
      "tipo_opcion": this.router.url,
      "des_operacion": "Descarga Información Citas",
      "des_nombre_usuario": this.usuarioService.UsuarioActual.nombre,
      "des_nombre_maquina": window.location.hostname, 
      "des_usuario_windows": "",     
      "des_sistema": "",
      "des_usuario_sistema":""
    }
        
    this.auditoriaService.insAuditoria(param).subscribe((res)=>{
      if(res.status === 200){
        this.importExportDataService.SetFechaFiltro_ListadoCita(this.fechaFiltro);

        const fechaActualFormateado = this.fechaFiltro.toISOString().split('T')[0];
        let pacienteCelular = '';
        if (pacienteCelular == '') pacienteCelular = null;
    
        const horaDesde = !this.horaDesde ? null : this.horaDesde;
        const horaHasta = !this.horaHasta ? null : this.horaHasta;

        const idZonaContiene = 0;
        const nacio = 0;

        const subs = this.citaService.obtenerCitasListadoInfo(fechaActualFormateado, horaDesde, horaHasta, this.sedeSeleccionada, this.estadoSeleccionado, pacienteCelular, this.tipoCitaSeleccionada, this.servicioSeleccionado, idZonaContiene, nacio).subscribe((res: any[]) => {
          this.exportarCollectionInfo = res;



            if(this.exportarCollectionInfo.length){
              const title = `Citas del ${this.fechaFiltro}`;
              const header = ["IDCITA", "N° DOCUMENTO", "CLIENTE","CELULAR","ANTIGüEDAD","F. ULTIMA CITA","ZONAS ATENDIDAS","PROM. ADQUIRIDAS","ZONA PRECIO(ULT. CITA)","SEDE","FECHA CITA","ZONA/SESIÓN", "PROMOCIONES", "H. INICIO", "ESTADO", "PAGADO", "TOTAL"];

              const workbook = new Excel.Workbook();
              const worksheet = workbook.addWorksheet('Citas');

              worksheet.autoFilter = {
                from: 'A1',
                to: 'Q1',
              }

              // worksheet.getColumn('I').alignment = { horizontal: 'center' };
              // worksheet.getColumn('J').alignment = { horizontal: 'right' };

              worksheet.addRow(header);
              this.exportarCollectionInfo.forEach( d => {
                const data = [
                  d.idCita,
                  d.numeroDocumento,
                  d.cliente,
                  d.telefono,
                  d.tipoCliente,
                  d.fechaUltimaCita,
                  d.zonasAtendidas,
                  d.promocionesAdquiridas,
                  d.ultimaCitaZonas,
                  d.sede,
                  d.fechaCita,
                  d.zonasCitaActual,
                  d.promocionesActual,
                  d.horaInicio,
                  d.estado,
                  d.pagado,
                  d.total.toFixed(2),
                ]
                worksheet.addRow(data);
              });

              worksheet.columns.forEach(function(column){
                var dataMax = 0;
                column.eachCell({ includeEmpty: false }, function(cell){
                  if(cell.value){
                    var columnLength = cell.value.length;
                    if (columnLength > dataMax) {
                      dataMax = columnLength;
                    }
                  }
                })
                column.width = dataMax < 10 ? 10 : dataMax;
              });

              workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, "Citas del "+ fechaActualFormateado  +".xlsx");
              });
            }

        },
        error => {
          this.utilsService.mostrarToast('Error al obtener la info de las citas', 'error');
          
          this.spinner.hide();
        });

        this.subscriptions.push(subs);
      }
      else if(res.status === 400){
        Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'info');
      }
    },    
    (error)=>{
      Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'error');
    });             
  }

  verTotales(){
    const fechaActualFormateado = this.fechaFiltro.toISOString().split('T')[0];
    this.clienteBusquedaService.verTotales(fechaActualFormateado).subscribe((resp: any) => {
      this.totales = resp;
    });
  }

  
  colorPorEstadoMap = new Map<number, string>(
    ColorEstadoCita.map(e => [e.index, e.value])
  );
  
  getColorPorEstadoDeCita(idEstado: number): string {
    return this.colorPorEstadoMap.get(idEstado) || '#252525';
  }


  colorPorServicioMap = new Map<number, string>(
    ColorServicioCita.map(c => [c.idServicio, c.value])
  );
  
  getColorPorServicioDeCita(idServicio: number): string {
    return this.colorPorServicioMap.get(idServicio) || '#252525';
  }

  citaNueva(): void {
    const modalRef = this.modalService.open(MdlAgendarCitaComponent,{size: 'lg', windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false,  animation: true, backdrop: "static" });
    modalRef.componentInstance.idCliente = this.dataSourceControl.data[0].idCliente;
    modalRef.result.then((res: boolean) => {});
  }
}

