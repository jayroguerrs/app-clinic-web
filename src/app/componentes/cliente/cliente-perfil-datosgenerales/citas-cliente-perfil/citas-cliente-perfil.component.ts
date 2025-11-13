import { Component, OnInit, ViewChild, Inject, HostListener, ChangeDetectorRef, Input } from '@angular/core';
import { ControlDeCitasService } from '../../../../shared/services/control-de-citas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
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
import { ClienteService } from '../../../../shared/services/cliente.service';
import { PermisosService } from '../../../../shared/services/permisos.service';

import { AccionCita, AccionCronograma, ColorEstadoCita, ColorServicioCita } from "../../../../shared/enumeracion/enums";
import { NgbAccordion, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientePerfilGlobalComponent } from '../../cliente-perfil-global/cliente-perfil-global.component';
import { UtilsService } from '../../../../shared/services/funciones/utils.service';
@Component({
  selector: 'app-citas-cliente-perfil',
  templateUrl: './citas-cliente-perfil.component.html',
  styleUrls: ['./citas-cliente-perfil.component.scss', '../../../cita/control-de-citas/control-de-citas.component.scss', '../../../cita/control-de-citas/citas-cerradas/citas-cerradas.component.scss']
})
export class CitasClientePerfilComponent implements OnInit {
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
  pageSize: number = 5;
  esListadoPorFecha: boolean = false;

  esListadoGlobal: boolean = false;

  listadoClientesCcvox: any = [];
  @Input() idClientePerfil: number;

  currentIdServicio: number = 0;

  filtrarPendientes: boolean = false;
  filtrarAtendidas: boolean = false;

  @ViewChild('mdlOpcionesCitas') mdlOpcionesCitas: any;
  citaSelected: any;

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
    private clienteService: ClienteService,
    private permisoService: PermisosService,

    private modalService: NgbModal,
    private utilsService: UtilsService,
  ) {}

  displayedColumnsControlCitas: string[] = ['carta', 'id_cita', 'fecha_de_cita', 'resumen', 'id_servicio', 'nombre_cliente', 'clienteNuevo', 'id_estado', 'id_tipo_cita', 'id_tipo_cliente', 'id_sede', 'total', 'pago_final'];
  dataSourceControl = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('acc', { static: false }) acc: NgbAccordion;

  ngOnInit(): void {
    this.obtenerDatos();
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.searchSubject.pipe(
      debounceTime(800),  // Espera 2 segundos después de que el usuario deje de escribir
      distinctUntilChanged()  // Solo emite si el término de búsqueda
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
    this.idClienteElegido = this.idClientePerfil;
    this.obtenerDatosCliente();

  }

  filtrarServicioPorQuery(){
    this.route.queryParams.subscribe(params => {
      if(params['idServicio']) {
        this.currentIdServicio = +params['idServicio'];
        this.servicioSeleccionado = this.currentIdServicio;
        this.togglePanelYActualizarEstado('toggle-1');
        this.applyFilter(true);
        this.quitarServicio();
      } else if(params['nuevaCita']) {
      }
      else{
        this.currentIdServicio = 0;
        this.servicioSeleccionado = this.currentIdServicio;
        this.togglePanelYActualizarEstado('toggle-1');
        this.applyFilter();
        this.quitarServicio();
      }
    });
  }

  quitarServicio(){
    const index = this.displayedColumnsControlCitas.indexOf('id_servicio');
    if (this.currentIdServicio > 0 && index !== -1) {
      this.displayedColumnsControlCitas.splice(index, 1);
    } 
    if((this.currentIdServicio === 0 || !this.currentIdServicio) && index === -1) {
      //this.displayedColumnsControlCitas[3] = 'id_servicio';
      this.displayedColumnsControlCitas.splice(3, 0, 'id_servicio');
    }
  }

  onPageChanged(event: any): void {
    this.pageIndex = event.pageIndex;
  }

  obtenerDatosCliente(): void{
    this.clienteService.findById(this.idClientePerfil).subscribe((res) => {
      this.nombreClienteElegido = res.nombres;
      this.elegirCliente(this.idClientePerfil)
    }, error => {
    });
  }

  getColorPorEstadoDeCita(idEstado: number){
    const color = ColorEstadoCita.find(c => c.index === idEstado);
    return color ? color.value : '#252525';
  }
  
  getColorPorServicioDeCita(idServicio: number){
    const color = ColorServicioCita.find(c => c.idServicio === idServicio);
    return color ? color.value : '#252525';
  }

  testModal(data: any){
    this.citaSelected = data;
    this.mdlOpcionesCitas.show();
  }

  irCita(estadoCita: AccionCita): void {
    let url;
    if(this.citaSelected.idCronograma > 0){
      url = this.router.createUrlTree([
        '/Corporal360/Cronograma',
        this.citaSelected.idCronograma,
        AccionCronograma.ASIGNARCITAS,
        this.citaSelected.idCliente,
        0,
        this.citaSelected.idCita,
        estadoCita,
      ]);
    } else{
      url = `/Cita/${this.citaSelected.idCita}/${estadoCita}/${this.citaSelected.idCliente}/${this.citaSelected.idPreferente}/${this.citaSelected.idServicio}`;
    }
    
    this.navegarSegunDispositivo(url);
  }

  irCita360(estadoCita: AccionCita): void {
    window.open(`/Corporal360/Cronograma/${this.citaSelected?.idCronograma}/${AccionCronograma.ASIGNARCITAS}/${this.citaSelected?.idCliente}/${this.citaSelected?.idPreferente}/${this.citaSelected?.idCita}/${estadoCita}`, '_blank');
  }

  private navegarSegunDispositivo(url: any): void {
    if (this.utilsService.isLargeScreen()) {
      // Abrir en una nueva pestaña si no es móvil
      window.open(url.toString(), '_blank');
    } else {
      // Navegar internamente si es móvil
      this.router.navigateByUrl(url);
    }
  }

  citaVisualizar(): void {
    this.irCita(AccionCita.VER);
  }
  citaEditar(): void {
    this.irCita(AccionCita.EDITAR);
  }
  citaAtender(): void {
    this.irCita(AccionCita.ATENDER);
  }

  isPerfilAutorizado(): boolean {
    return this.permisoService.isAutorizado(this.usuarioActual.idperfil);
  }

  limpiarTodo(){
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
    this.dataSourceControl.paginator = this.paginator;
    this.spinner.hide();
    this.citasClienteFiltrado = [];
    this.citasCliente = [];
    this.listadoClientesCcvox = [];
    this.idClienteElegido = 0;
    this.filtrarAtendidas = false;
    this.filtrarPendientes = false;
    this.clientesEncontrados = [];
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
  }

  limpiarFiltros(){
    this.sedeSeleccionada = 0
    this.clienteSeleccionado = 0
    this.tipoCitaSeleccionada = 0
    this.estadoSeleccionado = 0
    //this.servicioSeleccionado = 0
    this.filtrarAtendidas = false;
    this.filtrarPendientes = false;

    this.horaDesde = '';
    this.horaHasta = '';
    if(!this.esListadoGlobal){
      this.fechaFiltro = null
    }
    this.dataSourceControl = new MatTableDataSource<any>(this.citasCliente);
    this.dataSourceControl.paginator = this.paginator;
    this.pageIndex = 0;

    this.clientesEncontrados = [];
  }

  limpiarFiltrosButton(){
    this.limpiarFiltrosPendientesRealizadas();
    this.applyFilterFiltros();
  }

  limpiarFiltrosPendientesRealizadas(){
    this.sedeSeleccionada = 0
    this.clienteSeleccionado = 0
    this.tipoCitaSeleccionada = 0
    this.estadoSeleccionado = 0

    this.horaDesde = '';
    this.horaHasta = '';
    if(!this.esListadoGlobal){
      this.fechaFiltro = null
    }
    //this.dataSourceControl = new MatTableDataSource<any>(this.citasCliente);
    this.dataSourceControl.paginator = this.paginator;
    this.pageIndex = 0;

    // this.applyFilterFiltros();
  }

  ngAfterViewInit() {
    // this.dataSourceControl.paginator = this.paginator;
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

  volverHora(){
    this.horaDesde = '';
    this.horaHasta = '';

    this.applyFilter();
  }

  elegirServicio(): void{
    this.router.navigate(['/ClientePerfil', this.idClientePerfil , 'General'], { queryParams: { idServicio: this.servicioSeleccionado } });
  }

  filtrarPorPendienteOAtendida(tipo: string){
    if(this.acc){
      this.acc.collapse('toggle-1');
    }
    if(tipo === 'Pendiente'){
      this.filtrarPendientes = true;
      this.filtrarAtendidas = false;
      this.estadoSeleccionado = 0;
      this.limpiarFiltrosPendientesRealizadas();
      this.applyFilter(true);
    } else{
      this.filtrarPendientes = false;
      this.filtrarAtendidas = true;
      this.estadoSeleccionado = 0;
      this.limpiarFiltrosPendientesRealizadas();
      this.applyFilter(true);
    }
    
  }

  togglePanelYActualizarEstado(id: string){
    this.filtrarPendientes = false;
    this.filtrarAtendidas = false;
    this.applyFilter(true);

    if(this.acc){
      this.acc.collapse('toggle-1');
    }
  }

  applyFilterFiltros(){
    this.filtrarPendientes = false;
    this.filtrarAtendidas = false;
    this.applyFilter(true);
  }

  applyFilter(esPorQueryParams: boolean = false) {
    
    if(!esPorQueryParams){
      this.router.navigate(['/ClientePerfil', this.idClientePerfil , 'General']);
    }

    if (this.filtrarPendientes) {
      this.filtrarAtendidas = false;
    } else if (this.filtrarAtendidas) {
      this.filtrarPendientes = false;
    }
    
    this.clientesEncontrados = [];

    this.citasClienteFiltrado = this.citasCliente.filter(item => {
      const filterBySede = this.sedeSeleccionada > 0 ? item.idSede === this.sedeSeleccionada : true;
      
      const filterByCliente = this.clienteSeleccionado > 0 ? item.idTipoCliente === this.clienteSeleccionado : true;
      
      const filterByTipoCita = this.tipoCitaSeleccionada > 0 ? item.idTipoCita === this.tipoCitaSeleccionada : true;
    
      const filterByEstadoDeCita = this.estadoSeleccionado > 0 ? item.idEstado === this.estadoSeleccionado : true;

      const filterByServicio = this.servicioSeleccionado > 0 ? item.idServicio === this.servicioSeleccionado : true;

      const filterByPendientes = this.filtrarPendientes ? item.idEstado !== 7 && item.idEstado !== 82 : true;

      const filterByAtendidas = this.filtrarAtendidas ? item.idEstado === 7 || item.idEstado === 82 : true;

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
    
      return filterBySede && filterByCliente && filterByTipoCita && filterByEstadoDeCita && filterByServicio && filterByHora && filterByFecha && filterByPendientes && filterByAtendidas;
    });

    this.pageIndex = 1;
    this.dataSourceControl = new MatTableDataSource<any>(this.citasClienteFiltrado);

    this.dataSourceControl.paginator = this.paginator;

    this.paginator.length = this.citasClienteFiltrado.length;

    this.cdr.detectChanges();

    this.paginator.pageIndex = 1;
    this.dataSourceControl.paginator?.firstPage();

  }

  obtenerCitasDeCliente(idCliente: number){
    this.listadoClientesCcvox = [];
    this.pageSize = 5;
    this.pageIndex = 0;
    this.spinner.show();
    this.clienteBusquedaService.obtenerListadoCitasCliente(idCliente).subscribe((resp: any) => {
      this.citasCliente = resp.citas;
      this.dataSourceControl = new MatTableDataSource<any>(resp.citas);
      this.dataSourceControl.paginator = this.paginator;
      this.esNuevoCliente = resp.esNuevoCliente;
      this.esListadoGlobal = false;
      this.limpiarFiltros()

      this.filtrarServicioPorQuery();
      this.spinner.hide();
    });
  }

  elegirCliente(cliente: any){
    this.clientesEncontrados = [];
    this.obtenerCitasDeCliente(this.idClienteElegido);
  }

  mostrarCitaDetalle(element: any){
    let url;
    if(this.citaSelected.idCronograma > 0){
      url = this.router.createUrlTree([
        '/Corporal360/Cronograma',
        element.idCronograma,
        AccionCronograma.ASIGNARCITAS,
        element.idCliente,
        0,
        element.idCita,
        1,
      ]);
    } else{
      url = `/Cita/${element.idCita}/1/${element.idCliente}/${element.idPreferente}/${element.idServicio}`;
    }
    
    this.navegarSegunDispositivo(url);
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


  openModalConfirm(idCita: number, precioNeto: number, precioDePagoFinal: any): void {
      this.mdlOpcionesCitas.hide();

      const sendData = {
        idCita: idCita,
        paciente: this.nombreClienteElegido,
        montoInicial: precioDePagoFinal != null ? precioDePagoFinal : precioNeto,
      };
  
      const dialogRef = this.dialog.open(PagoFinalDialog, {
        width: '430px',
        disableClose: true,
        data: {
          cita: sendData,
          montoFinal: 0,
          paciente: this.nombreClienteElegido,
        },
      });
  
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result !== undefined && result >= 0) {

          this.controlDeCitasService
            .updatePayment(idCita, result, this.usuarioActual.idUsuario)
            .subscribe((res: any) => {
              if (res.status !== 200) return;
  

              Swal.fire({ 
                title: 'Pago confirmado',
                icon: 'success',
                confirmButtonColor: "#3085d6",
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
              }).then(() => {
                this.obtenerCitasDeCliente(this.idClienteElegido);
              });
            });
        }
      });
    }
  
  windowWidth: number = window.innerWidth;
  isSmallScreen: boolean = this.windowWidth <= 1193;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = window.innerWidth;
    this.isSmallScreen = this.windowWidth <= 1193;
    this.mostrarFiltros = this.windowWidth >= 1193;
  }

  @ViewChild(ClientePerfilGlobalComponent) clientePerfilGlobalComponent!: ClientePerfilGlobalComponent;

  abrirModalFinanciamientoDesdePadre() {
    this.acc.expand('toggle-1');

    setTimeout(() => {
      const template = this.clientePerfilGlobalComponent.getFinanciamientoCuotasTemplate();
      const modalRef = this.modalService.open(template, { size: 'xl', backdrop: 'static' });

      modalRef.result.finally(() => {
        this.acc.collapse('toggle-1');
      }); 
    }, 100)
  }

  abrirModalHistoriaClinicaDesdePadre() {
    this.acc.expand('toggle-1');

    setTimeout(() => {
      const template = this.clientePerfilGlobalComponent.getHistoriaClinicaTemplate();
      const modalRef = this.modalService.open(template, { size: 'xl', backdrop: 'static' });

      modalRef.result.finally(() => {
        this.acc.collapse('toggle-1');
      });

    }, 100)
  }

  abrirModalDocumentosEmitidosDesdePadre() {
    this.acc.expand('toggle-1');

    setTimeout(() => {
      const template = this.clientePerfilGlobalComponent.getDocumentosEmitidosTemplate();
      const modalRef = this.modalService.open(template, { size: 'xl', backdrop: 'static' });

      modalRef.result.finally(() => {
        this.acc.collapse('toggle-1');
      });
    }, 100)
  }
  abrirModalResumenDeContratosDesdePadre() {
    this.acc.expand('toggle-1');

    setTimeout(() => {
      const template = this.clientePerfilGlobalComponent.getResumenContratosTemplate();
      const modalRef = this.modalService.open(template, { size: 'xl', backdrop: 'static' });

      modalRef.result.finally(() => {
        this.acc.collapse('toggle-1');
      });
    }, 100);
  }

  abrirModalEvolucionDeTratamientoDesdePadre() {
    this.acc.expand('toggle-1');

    setTimeout(() => {
      const template = this.clientePerfilGlobalComponent.getEvolucionTratamientoTemplate();
      const modalRef = this.modalService.open(template, { size: 'xl', backdrop: 'static' });

      modalRef.result.finally(() => {
        this.acc.collapse('toggle-1');
      });
    }, 100)
  }

  abrirModalDocumentosAnuladosDesdePadre() {
    this.acc.expand('toggle-1');

    setTimeout(() => {
      const template = this.clientePerfilGlobalComponent.getDocumentosAnuladosTemplate();
      const modalRef = this.modalService.open(template, { size: 'xl', backdrop: 'static' });

      modalRef.result.finally(() => {
        this.acc.collapse('toggle-1');
      });
    }, 100)
  }

  abrirModalHistorialDesdePadre() {
    this.acc.expand('toggle-1');

    setTimeout(() => {
      const template = this.clientePerfilGlobalComponent.getHistorialSeguimientoCitaTemplate();
      const modalRef = this.modalService.open(template, { size: 'xl', backdrop: 'static' });

      modalRef.result.finally(() => {
        this.acc.collapse('toggle-1');
      });
    }, 100)
  }
}
