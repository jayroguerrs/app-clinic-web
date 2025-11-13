import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ElementRef, Inject} from '@angular/core';
import {CitaService} from '../../../shared/services/cita.service';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {UtilsService} from '../../../shared/services/funciones/utils.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {NgbAccordion, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import localeEs from '@angular/common/locales/es-PE';
import {registerLocaleData} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ImportExportDataService} from '../../../shared/services/import-export-data.service';
import {Usuario} from 'src/app/shared/models/usuario';
import {CitaDetalle, CitaImportClass, CitaMaquina, ZonaCorporalClass} from 'src/app/shared/models/cita';
import {ClienteImportClass} from 'src/app/shared/models/cliente';
import {ClienteService} from '../../../shared/services/cliente.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AccionCita, AccionCronograma, TipoPerfil} from 'src/app/shared/enumeracion/enums';
import {CitaEstado} from '../../../shared/enumeracion/enums';
import {CurrencyMaskInputMode} from 'ngx-currency';
import { Subscription } from 'rxjs';
import {CitaDetalleService} from "../../../shared/services/cita-detalle.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ParametroSistemaService} from "../../../shared/services/parametro-sistema.service";
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {CitaMedicion} from "../../../shared/models/CitaMedicion";
import {CitaMedicionService} from "../../../shared/services/cita-medicion.service";
import {EvolucionTratamientoService} from "../../../shared/services/evolucion-tratamiento.service";
import {EvolucionTratamiento, EvolucionTratamientoZona} from "../../../shared/models/evolucion-tratamiento";
import {MedioContactoService} from "../../../shared/services/medio-contacto.service";
import {DescuentoService} from "../../../shared/services/descuento.service";
import { Descuento } from 'src/app/shared/models/descuento';
import {MdlFechaCitaAsignadaComponent} from "../../modals/mdl-fecha-cita-asignada/mdl-fecha-cita-asignada.component";
import { ServicioService } from 'src/app/shared/services/servicio.service';
import { Servicio } from 'src/app/shared/models/servicio';
import {MedioContacto} from "../../preferente/preferente.models";
import {MaquinaMarcaService} from "../../../shared/services/maquina-marca.service";
import {MaquinaMarca} from "../../../shared/models/maquina-marca";
import {MdlSiguienteCitaComponent} from "../../modals/mdl-siguiente-cita/mdl-siguiente-cita.component";
import {ZonaSesionTratamientoService} from "../../../shared/services/zona-sesion-tratamiento.service";
import { ZonaTratamiento } from 'src/app/shared/models/zonas';
import { ErrorSistema } from 'src/app/shared/models/error-sistema';
import { EditarZonaService } from './editar-zona.service';
import { AutocompleteOption, AutocompleteSelectionEvent } from '../../../shared/components/autocomplete-select/autocomplete-select.interface';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import {SanitizeService} from "../../../shared/services/SanitizeService ";
import { ControlDeCitasService } from '../../../shared/services/control-de-citas.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermisosService } from '../../../shared/services/permisos.service';
import { MdlHistorialParametrosComponent } from '../../modals/mdl-historial-parametros/mdl-historial-parametros.component';
import { MdlAgendarCitaComponent } from '../../modals/mdl-agendar-cita/mdl-agendar-cita.component';
import { CronometroComponent } from '../../widgets/cronometro/cronometro.component';
import { SubmdlSeleccionarZonaComponent } from '../../modals/submodals/submdl-seleccionar-zona/submdl-seleccionar-zona.component';
import { MdlParametrosCitaRegistroComponent } from '../../modals/mdl-parametros-cita-registro/mdl-parametros-cita-registro.component';
declare const $: any;

@Component({
  selector: 'app-cita-registro',
  templateUrl: 'cita-registro.component.html',
  styleUrls: ['./cita-registro.component.scss']
})
export class CitaRegistroComponent implements OnInit, AfterViewInit, OnDestroy {
  CitaEstado = CitaEstado;

  windows = window;

  windowWidth: number = window.innerWidth;
  isSmallScreen: boolean = this.windowWidth <= 1193;

  @Input() modal: NgbModalRef;
  mostrarNotas: EventEmitter<any[]> = new EventEmitter<any[]>();
  mostrarAvisos: EventEmitter<any[]> = new EventEmitter<any[]>();
  mostrarDetalles: EventEmitter<any[]> = new EventEmitter<any[]>();

  @ViewChild('cronometro') cronometroComponent!: CronometroComponent;

  options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }
  optionwatts = {
  prefix: '',
  thousands: '',
  allowNegative: false,
  decimal: '',
  precision: 0
};

  frmNotas: FormGroup;
  frmAvisos: FormGroup;
  frmDetalles: FormGroup;

  maestroUsuarios= [];
  maestroUsuariosEspecialistas = [];
  maestroTipoCita = [];
  maestroTipoCliente = [];
  maestroSedes = [];
  maestroZonasCorporales = [];
  maestroMaquinaSedes = [];
  maestroMedioContacto = [];

  promocionesPorZonaCorporal = []
  usuarioActual: Usuario;

  // modales
  modalCitaCuponAplicaRef: NgbModalRef;
  modalCitaHorarioRef: NgbModalRef;
  modalCitaHistorialRef: NgbModalRef;
  modalUsuarioSeleccionRef: NgbModalRef;
  modalCitaEstadoRef: NgbModalRef;
  modalHistoriaClinicaRef: NgbModalRef;
  modalCitaMedicionRef: NgbModalRef;

  citaActualizaCondicionEstado: CitaEstado;
  datosCitaCondicion: any;

  sede = null;
  // zCorporalesCadena = '';
  formatoFecha = 'dd-MM-yyyy';
  formatoFechaHora = 'dd-MM-yyyy HH:mm';
  formatoHora = 'HH:mm';
  cita = new CitaImportClass();
  idPromocionPrecio = 0;
  sesionesZona = 1;
  valorPromocionElegida: number[] = [];
  valorUsuarioElegido: number[] = [];
  precioPromocionZona: any[] = [];

  titulo: string = '';
  titulo2: string = '';
  colorFuente: string = '#fff';
  cboPromocionDeshabilitado: Boolean = false;

  idPerfilBuscarUsuario: string = '';
  idZonaSeleccion: number = 0;

  totalDuracion: number = 0;
  totalPrecio: number = 0.00;
  precioNeto: number = 0;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  mostrarCtrlAtendidoPor = false;
  esConfirmada = false;

  zonasCorporales: ZonaCorporalClass[] = [];

  // Historia clinica
  ldEvolucionTratamiento = false;
  sbcHistoriaClinica: Subscription;
  evolucionTratamiento: EvolucionTratamiento = null;
  sbcParametroSistemaCabeceraPagina: Subscription;
  sbcParametroSistemaPiePagina: Subscription;
  cabeceraPagina: string = null;
  piePagina: string = null;

  // Detalles de la cita
  ldCollectionDetalleCita = true;
  sbcCollectionCitaDetalle: Subscription;
  collectionCitaDetalle: CitaDetalle[] = [];

  // Cita Opciones
  AccionesCita = {
    ATENDER : false,
    EDITAR : false,
    VER : false,
    NUEVA : false,
    SIGUIENTE : false,
    CONFIRMAR: false,
    CONFIRMARASISTENCIA: false
  };
  tipoPerfil = TipoPerfil;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  // notas,avisos,detalles
  @ViewChild('scrollDetalle') scrollDetalle: PerfectScrollbarComponent;
  @ViewChild('scrollAviso') scrollAviso: PerfectScrollbarComponent;
  @ViewChild('scrollNota') scrollNota: PerfectScrollbarComponent;

  // Medicion cita
  tipoMedicion = 0;
  sbcMedicionSatisfaccion: Subscription;
  sbcMedicionEfectividad: Subscription;
  citaSatisfaccion: CitaMedicion | null = null;
  citaEfectividad: CitaMedicion | null = null;
  citaMedicion: CitaMedicion | null = null;

  // Evolución del tratamiento
  @ViewChild('modalOpcionesEvolucion') modalOpcionesEvolucion: any;
  @ViewChild('modalFotosEvolucion') modalFotosEvolucion: any;
  fotos: string[] = [];
  sbcObtenerFotosById: Subscription;
  ldObtenerFotosById = false;
  zonaEvolucionTratamiento: EvolucionTratamientoZona | null = null;
  carSubTitleEvolucion : string = "";


  editarEvolucion = false;

  // Subscriptions
  sbcMedioContacto: Subscription;
  idDescuento: FormControl;
  cuponDescuento: FormControl;
  descuentoAdicional: number = 0;
  idDescuentoZonas: string | null;

  // cupones
  collectionCupones: Descuento[] = [];
  sbcCollectionCupon: Subscription;

  // datos generales
  accionCita: number = 0;
  idPreferente: number = 0;
  idServicio: number = 0;

  servicios: Servicio[] = [];
  sbcServicios: Subscription;

  maquinaMarcas: MaquinaMarca[] = [];
  sbcMaquinaMarca: Subscription | undefined;

  modalRef: NgbModalRef | undefined;
  mdlSeleccionarZona: NgbModalRef;

  atenderCita: boolean = false;
  tipoPagoInvalido: boolean = false;

  subscriptions: Subscription[] = [];
  @ViewChild('modEvolucionTratamiento') modEvolucionTratamiento: any;
  @ViewChild('acc', { static: true }) accordion: NgbAccordion;
  @ViewChild('mdlCitaBox') mdlCitaBox: any;

  mdltratamientoMostrar: boolean = false;
  constructor(
    private citaService: CitaService,
    private formBuilder: FormBuilder,
    private usuarioservice:UsuarioService,
    public utilsService: UtilsService,
    private importExportDataService: ImportExportDataService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private spinner: NgxSpinnerService,
    private descuentoService: DescuentoService,
    private evolucionTratamientoService: EvolucionTratamientoService,
    private citaDetalleService: CitaDetalleService,
    private bottomSheet: MatBottomSheet,
    private parametroSistemaService: ParametroSistemaService,
    private citaMedicionService: CitaMedicionService,
    private modalService: NgbModal,
    private medioContactoService: MedioContactoService,
    private servicioService: ServicioService,
    private maquinaMarcaService: MaquinaMarcaService,
    private zonaSesionTratamientoService: ZonaSesionTratamientoService,

    private editarZonaService: EditarZonaService,
    private controlDeCitasService : ControlDeCitasService,
    public dialog: MatDialog,

    private permisoService: PermisosService
  ) {
    registerLocaleData(localeEs, 'es');
    this.idDescuento = new FormControl({value:0,disabled: true});
    this.cuponDescuento = new FormControl({value:null,disabled: true});
    this.idDescuentoZonas = "";
  }
  ngAfterViewInit(): void {
    this.estadoFormulario(this.cita.accionCita);
    // this.verEvolcuionParaEditar();
  }
  ngOnInit(): void {

    this.listarServicios();
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.formulario();
    this.obtenerDatosPreliminares();
    this.obtenerDetalleCita();
    this.obtenerEvolucionTratamiento();
    this.obtenerPieyCabeceradePagina();

    this.citaMedicionSatisfaccion();
    this.citaMedicionEfectividad();
    this.listarMedioContacto();
    this.listarCupones();
    setTimeout(async () => {
      await this.listarMaquinaMarcas();
    }, 0)

    this.crearVioModalLocalStorage();
    this.mostrarModalDeNuevaVersion();
    this.mostrarModalEvolucionTratamiento();

  }
  ngOnDestroy(): void {
    this.sbcServicios?.unsubscribe();
    if(  this.modalCitaHorarioRef ){ this.modalCitaHorarioRef.close(); }
    if(  this.modalCitaHistorialRef ){ this.modalCitaHistorialRef.close(); }
    if(  this.modalUsuarioSeleccionRef ){ this.modalUsuarioSeleccionRef.close(); }
    if(  this.modalCitaEstadoRef ){ this.modalCitaEstadoRef.close(); }
    if(  this.modalHistoriaClinicaRef ){ this.modalHistoriaClinicaRef.close(); }
    if(  this.modalUsuarioSeleccionRef ){ this.modalUsuarioSeleccionRef.close(); }

    // Destroy subscription
    if( this.sbcHistoriaClinica ){ this.sbcHistoriaClinica.unsubscribe(); }
    if( this.sbcCollectionCitaDetalle ){ this.sbcCollectionCitaDetalle.unsubscribe(); }
    if( this.sbcMedioContacto ){ this.sbcMedioContacto.unsubscribe(); }
    if( this.sbcCollectionCupon ){ this.sbcCollectionCupon.unsubscribe(); }

    this.subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

  isPerfilAutorizado(): boolean {
    return this.permisoService.isAutorizado(this.usuarioActual.idperfil);
  }

  mostrarModalEvolucionTratamiento(){
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['Mdltratamientoid']) {
        this.mdltratamientoMostrar = true;
      } else{
        this.mdltratamientoMostrar = false;
      }
    });
  }

  obtenerDatosPreliminares(): void {
    this.spinner.show();
    this.citaService.obtenerDatosPreliminares().subscribe(
      resultado => {
        this.maestroTipoCita = resultado.citaTipos;
        this.maestroTipoCliente = resultado.clienteTipos;
        this.maestroSedes = resultado.sedes;
        this.maestroZonasCorporales = resultado.zonasCorporales;
        this.maestroMaquinaSedes = resultado.maquinaSedes;
        this.inicializarCargaDatosExistentes();
      },
      error => {
        console.log('Error al obtener los datos preliminares', error);
      }
    );
  }

  existeZonaCorporalDuplicadaDeshabilitada(): boolean {
    if(this.cita.zonasCorporales){
      return this.cita.zonasCorporales.some(zona => zona.estado === false && zona.duplicado === true);
    }
    return false;
  }

  existeZonaCorporalDeshabilitada(): boolean {
    if(this.cita.zonasCorporales){
      return this.cita.zonasCorporales.some(zona => zona.estado === false);
    }
    return false;
  }

  showMdlBox(){
    this.mdlCitaBox.show();
  }

  onCheckboxChangeTratamientoRealizado(event: any, idCitaDetalle: any, zonaCorporal:any){
    const isChecked = (event.target as HTMLInputElement).checked;
    const estado = isChecked ? 1 : 0;

    if(idCitaDetalle > 0){
      this.citaService.actualizarTratamientoRealizado(estado, idCitaDetalle).subscribe((resp: any) => {
      });
    }
  }

  inicializarCargaDatosExistentes(): void {
    const parametro = this.activatedRoute.snapshot.params;
    const idCita = parseInt(parametro.id, 10);
    const idCliente = parseInt(parametro.idcliente, 10);
    const accionCita = parseInt(parametro.accion, 10);
    this.accionCita = parseInt(parametro.accion, 10);
    this.idPreferente = parseInt(parametro.idPreferente, 10);
    this.idServicio = parseInt(parametro.idServicio, 10);

    if(idCita === 0){ this.colorFuente = ''; }

    this.clienteService.obtenerById(idCliente).subscribe(
      clienteResult => {

        const cliente = new ClienteImportClass();
        cliente.id = clienteResult.id;
        cliente.nombresCompletos = clienteResult.nombres + ' ' + clienteResult.apellidos;
        cliente.numerosCelulares = clienteResult.celular1 + ' ' + clienteResult.celular2;
        cliente.documento = clienteResult.documento;
        cliente.seudonimo = clienteResult.seudonimo;
        cliente.idHistoriaClinica = clienteResult.idHistoriaClinica;
        cliente.ruc=clienteResult.ruc;
        cliente.razonSocial=clienteResult.razonSocial;

        this.cita.cliente = cliente;
        this.cita.accionCita = accionCita;

        if (idCita > 0) {
          
          
          this.citaService.obtenerById(idCita, true).subscribe(
            citaResult => {
              //console.log(citaResult);
              //console.log(citaResult);
              this.cita.idEstado = citaResult.idEstado;
              this.esConfirmada = citaResult.idEstado === 6;
              this.cita.idCita = idCita;
              this.cita.idSede = citaResult.idSede;
              this.cita.sede = citaResult.sede;
              this.cita.fecha = new Date(citaResult.fechaCita);
              this.cita.horaInicio = this.utilsService.horaStringToDate(citaResult.horaCita);
              this.cita.horaTermino = this.utilsService.sumarMinutosAsDate(this.cita.horaInicio, citaResult.duracion);
              this.cita.duracion = citaResult.duracion;
              this.cita.fechaRegistra = citaResult.fechaRegistra;
              this.cita.usuarioRegistra = citaResult.usuarioRegistra;
              this.cita.colorEstado = citaResult.colorEstado;
              this.cita.idUsuarioAsignado = citaResult.idUsuarioAsignado;
              this.cita.idCitaAsignacion = citaResult.idCitaAsignacion;
              this.cita.fechaConfirmacion = citaResult.fechaConfirmacion ? new Date(citaResult.fechaConfirmacion) : null;
              this.cita.numeroBox = citaResult.numeroBox;
              this.cita.idMaquinaMarca = citaResult.idMaquinaMarca;
              this.getCitaImport();
              this.spinner.hide();

              this.cita.maquina = new CitaMaquina(citaResult.maquina.id, citaResult.maquina.descripcion);

              /*if(citaResult.idEstado === CitaEstado.ATENDIDA){
                this.router.navigate([`Cita/${idCita}/1/${citaResult.idCliente}`]);
                return;
              }*/

            },
            error => { console.log('Error al consultar los datos de la cita', error); }
          );
        } else {
          //  Asignar el servicio según la data de la ruta
          this.cita.idServicio = this.idServicio;

          this.getCitaImport();
          this.spinner.hide();
        }
      },
      error => { console.log('Error al consultar los datos del cliente', error); }
    );
  }

  getCitaImport(): void {
      this.estadoFormulario(this.cita.accionCita);
      if(this.cita.idCita > 0) {
        //Preguntar si los datos ya se estan manipulando o recien bien de la lista de cita con la opcion de reprogramacion - Buscar de la base de datos
          this.titulo ='CITA: ' + AccionCita[this.cita.accionCita] + ' (' + (this.cita.idCita) + ')';
          this.titulo2 = 'FECHA DE REGISTRO: ' +  this.utilsService.formato_FechaHoraUniversalSQL2(this.cita.fechaRegistra) + ' -  REGISTRADOR POR: ' + this.cita.usuarioRegistra ;

          if(this.cita.accionCita == AccionCita.EDITAR)
          {
            let esReprogramacion = true;
            if(this.cita.modificado == false) {
              this.citaService.obtenerById(this.cita.idCita, esReprogramacion).subscribe(
                (resultado: any) => {
                  this.cboPromocionDeshabilitado = true;
                  this.cita.idTipoCita = resultado.idTipoCita;
                  this.cita.idTipoCliente = resultado.idTipoCliente;
                  this.cita.otroMedioContacto = resultado.otroMedioContacto;
                  this.cita.idMedioContacto = resultado.idMedioContacto;
                  this.cita.idMaquina = resultado.idMaquina;
                  this.cita.citaMensajeAvisos = resultado.citaMensajeAvisos;
                  this.cita.citaMensajeNotas = resultado.citaMensajeNotas;
                  this.cita.citaMensajeDetalles = resultado.citaMensajeDetalles;

                  const zonaConVerDuplicado = resultado.zonasCorporales.map(zona => ({
                    ...zona,
                    verDuplicado: true
                  }));

                  this.cita.zonasCorporales = zonaConVerDuplicado;
                  this.zonasCorporales = zonaConVerDuplicado;
                  this.cita.zonasCorporales.sort((a: any, b: any) => {
                    if (a.idZona !== b.idZona) {
                        return a.idZona - b.idZona;
                    }
                    if (a.estado !== b.estado) {
                        return a.estado ? -1 : 1;
                    }
                    if (a.estado === true && a.duplicado !== b.duplicado) {
                        return a.duplicado ? 1 : -1;
                    }
                    if (a.estado === false) {
                        return b.duplicado - a.duplicado; 
                    }
                    return 0;
                });
                

                  this.zonasCorporales.sort((a: any, b: any) => {
                    // 1. Ordenar por idZona
                    if (a.idZona !== b.idZona) {
                        return a.idZona - b.idZona;
                    }
                    // 2. Ordenar por estado (true primero, false después)
                    if (a.estado !== b.estado) {
                        return a.estado ? -1 : 1;
                    }
                    // 3. Si estado es true, ordenar por duplicado (false primero, true después)
                    if (a.estado === true && a.duplicado !== b.duplicado) {
                        return a.duplicado ? 1 : -1; // No duplicado antes que duplicado
                    }
                    // 4. Si estado es false, ordenar por duplicado (true primero, false después)
                    if (a.estado === false) {
                        return b.duplicado - a.duplicado; 
                    }
                    return 0;
                });
              
                  this.cita.idUsuarioAtendidoPor = resultado.idUsuarioAtendidoPor;
                  this.cita.usuarioAtendidoPor = resultado.usuarioAtendidoPor;
                  this.cita.maquina = new CitaMaquina(resultado.maquina.id, resultado.maquina.descripcion);
                  this.cita.descuentoAplicaA = resultado.descuentoAplicaA;
                  this.cita.idDescuento = resultado.idDescuento;
                  this.cita.cuponDescuento = resultado.cuponDescuento;
                  this.cita.idServicio = resultado.idServicio ? parseInt(resultado.idServicio) : 0;
                  this.cita.idPreferente = resultado.idPreferente;
                  this.cuponDescuento.enable();
                  this.idDescuento.enable();
                  this.idDescuento.setValue(resultado.idDescuento);
                  this.cuponDescuento.setValue(resultado.cuponDescuento);
                  this.descuentoAdicional = this.collectionCupones.find( x => x.id )?.porcentaje;

                  this.cita.precioDePagoFinal = resultado.precioDePagoFinal;
                  this.cita.tipoDePago = resultado.tipoDePago;

                  this.calcularTotales();
                },
                (error: any) => console.error('Error al obtener la Cita', error)
              );
            } else {
              this.calcularTotales();
            }
          }

          if( this.cita.accionCita == AccionCita.VER  || this.cita.accionCita == AccionCita.ATENDER || this.cita.accionCita == AccionCita.CONFIRMAR )
          {
            let esReprogramacion = false;
            if(this.cita.modificado == false) {
              this.citaService.obtenerById(this.cita.idCita, esReprogramacion).subscribe(
                (resultado: any) => {
                  this.esConfirmada = resultado.idEstado === 6;
                  this.cboPromocionDeshabilitado = true;
                  this.cita.idTipoCita = resultado.idTipoCita;
                  this.cita.idTipoCliente = resultado.idTipoCliente;
                  this.cita.idMaquina = resultado.idMaquina;
                  this.cita.otroMedioContacto = resultado.otroMedioContacto;
                  this.cita.idMedioContacto = resultado.idMedioContacto;
                  this.cita.citaMensajeAvisos = resultado.citaMensajeAvisos;
                  this.cita.citaMensajeNotas = resultado.citaMensajeNotas;
                  this.cita.citaMensajeDetalles = resultado.citaMensajeDetalles;
                  // this.cita.zonasCorporales = resultado.zonasCorporales;
                  this.cita.zonasCorporales = resultado.zonasCorporales.map(zona => ({
                    ...zona,
                    verDuplicado: true
                  }));
                  this.cita.idUsuarioAtendidoPor = resultado.idUsuarioAtendidoPor;
                  this.cita.usuarioAtendidoPor = resultado.usuarioAtendidoPor;
                  this.cita.maquina = new CitaMaquina(resultado.maquina.id, resultado.maquina.descripcion);
                  this.cita.precioDePagoFinal = resultado.precioDePagoFinal;
                  this.cita.tipoDePago = resultado.tipoDePago;

                  this.cita.descuentoAplicaA = resultado.descuentoAplicaA;
                  this.cita.cuponDescuento = resultado.cuponDescuento;

                  const ordenarZonasCorporales = (a: any, b: any): number => {
                    if (a.idZona !== b.idZona) return a.idZona - b.idZona;
                    if (a.estado !== b.estado) return a.estado ? -1 : 1;
                    if (a.estado) return a.duplicado ? 1 : -1;
                    return b.duplicado - a.duplicado;
                };
                
                // Aplicamos la misma función a ambas listas
                this.cita.zonasCorporales.sort(ordenarZonasCorporales);
                this.zonasCorporales.sort(ordenarZonasCorporales);
                
                  this.cita.esNotificado = resultado.esNotificado;

                  this.cita.idServicio = resultado.idServicio ? parseInt(resultado.idServicio) : 0;

                  this.idDescuento.setValue(resultado.idDescuento);
                  this.cuponDescuento.setValue(resultado.cuponDescuento);
                  this.descuentoAdicional = this.collectionCupones.find( x => x.id)?.porcentaje;

                  this.calcularTotales();
                },
                (error: any) => console.log('Error al obtener la Cita', error)
              );
            }
          }
      } else {
        //CITA NUEVA
        this.cita.accionCita = AccionCita.NUEVA;
        this.titulo = 'CITA: ' + AccionCita[AccionCita.NUEVA];
        this.consultarNotasCitaNueva(this.cita.cliente.id);
        this.calcularTotales();
      }
  }

  consultarNotasCitaNueva(idCliente: number): void {
    //verificar si hay notas, si no hay consultar en la base de datos
    if( this.cita.citaMensajeNotas.length == 0) {
      this.citaService.obtenerNotasEnCitaNueva(idCliente).subscribe(
        resultado => {
          this.cita.citaMensajeNotas = resultado;
        },
        error => {
          console.log('Error al consultar las notas del cliente', error);
        }
      );
    }
  }
  calcularTotalesEvento(): void{
    this.calcularTotales();
  }
  //hice un event emiter del nieto al abuelo para esta funcion pero no me calcula el precio los minutos si el precio no por que?
  calcularTotales(): void {

    // CALCULAR EL MONTO TOTAL y DURACION TOTAL
    if(this.cita.zonasCorporales != null){
      const zonasCalculo = this.cita.zonasCorporales.filter(zona => zona.estado === true);
      this.totalPrecio = 0;
      zonasCalculo.forEach(x => {
        const precio = x.precioDescuento ? x.precioDescuento : x.precio;
        this.totalPrecio += precio;
      });

      this.precioNeto = this.totalPrecio;

      this.totalDuracion = zonasCalculo.reduce(function(tot, arr) { return tot + arr.duracion; },0);
    } else {
      this.totalPrecio = 0;
      this.precioNeto = 0;
      this.totalDuracion = 0;
    }
  }
  mostrarModalCuponAplica(modal: any) :void{
    const idDescuento = parseInt( this.idDescuento.value, 10);
    this.cita.idDescuento = idDescuento;

    const zonasCorporalesHabilitadas = this.cita.zonasCorporales.filter(zona => zona.estado === true);

    if(!zonasCorporalesHabilitadas || !zonasCorporalesHabilitadas.length){
      this.utilsService.mostrarToast('Seleccionar zonas','warning');
      return;
    }

    if(!idDescuento){
      this.utilsService.mostrarToast('Seleccionar un descuento extra','warning');
      return;
    }

    this.modalCitaCuponAplicaRef = this.utilsService.abrirModal(modal, 'md');
    this.modalCitaCuponAplicaRef.result.then(()=>{
      this.actualizarDescuentos();
      this.calcularTotales();
    });

  }

  activarConfirmada(): void {
    this.esConfirmada = !this.esConfirmada;
  }
  estadoFormulario(accionCita: AccionCita): void {
    accionCita = Number(accionCita);
    this.AccionesCita = {
      ATENDER : false,
      EDITAR : false,
      VER : false,
      NUEVA : false,
      SIGUIENTE : false,
      CONFIRMAR: false,
      CONFIRMARASISTENCIA: false
    };

    switch(accionCita) {
      case AccionCita.ATENDER: {
        this.AccionesCita.ATENDER = true;
        this.mostrarCtrlAtendidoPor = true;
        break;
      }
      case AccionCita.EDITAR: {
        this.AccionesCita.EDITAR = true;
        break;
      }
      case AccionCita.VER: {
        this.AccionesCita.VER = true;
        //Cuando se ve una cita atendida
        if(this.cita.idEstado == CitaEstado.ATENDIDA || this.cita.idEstado === 82){

          this.mostrarCtrlAtendidoPor = true;

        }
        break;
      }
      case AccionCita.NUEVA:
      case AccionCita.SIGUIENTE: {
        this.AccionesCita.NUEVA = true;
        this.AccionesCita.SIGUIENTE = true;
        break;
      }
      case AccionCita.CONFIRMAR: {
        this.AccionesCita.CONFIRMAR = true;
      }
      case AccionCita.CONFIRMARASISTENCIA: {
        this.AccionesCita.CONFIRMARASISTENCIA = true;
      }
    }
  }
  addNotasCita(): void{
    if (this.frmNotas.value.cita === '' || !this.frmNotas.controls.nota.value) { return; }

    let sanitizedNota = SanitizeService.sanitizeInput(this.frmNotas.value.nota);

    this.cita.citaMensajeNotas.push({
        id: 0,
        idCita: this.cita.idCita,
        nota: sanitizedNota.toUpperCase(),
        fechaRegistra: new Date(),
        destacado: this.frmNotas.controls.destacado.value,
        idUsuario: this.usuarioservice.UsuarioActual.idUsuario,
        inicialesUsuario: this.usuarioservice.UsuarioActual.nombre.split(' ').map((inicial) => inicial[0]).join('')
      });

    this.frmNotas.patchValue({ nota: '', destacado: false });
    this.mostrarNotas.emit(this.cita.citaMensajeNotas);
    this.scrollNota?.directiveRef?.update();
    this.scrollNota?.directiveRef?.scrollToTop(0,100);
  }
  addAvisosCita(): void{
    if (this.frmAvisos.value.aviso === '') { return; }

    let sanitizedAviso = SanitizeService.sanitizeInput(this.frmAvisos.value.aviso);

    this.cita.citaMensajeAvisos.push({
      id: 0,
      idCita: this.cita.idCita,
      aviso: sanitizedAviso.toUpperCase(),
      fechaRegistra: new Date(),
      destacado: this.frmAvisos.controls.destacado.value,
      idUsuario: this.usuarioservice.UsuarioActual.idUsuario,
      inicialesUsuario: this.usuarioservice.UsuarioActual.nombre.split(' ').map((inicial) => inicial[0]).join('')
    });
    this.frmAvisos.patchValue({ aviso: '', destacado: false });
    this.mostrarAvisos.emit(this.cita.citaMensajeAvisos);
    this.scrollAviso?.directiveRef?.update();
    this.scrollAviso?.directiveRef?.scrollToTop(0,100);
  }
  addDetallesCita(): void{
    if (this.frmDetalles.value.detalle === '') { return; }

    let sanitizedDetalle = SanitizeService.sanitizeInput(this.frmDetalles.value.detalle);

    this.cita.citaMensajeDetalles.push({
      id: 0,
      idCita: this.cita.idCita,
      detalle: sanitizedDetalle.toUpperCase(),
      fechaRegistra: new Date(),
      destacado: this.frmDetalles.controls.destacado.value,
      idUsuario: this.usuarioservice.UsuarioActual.idUsuario,
      inicialesUsuario: this.usuarioservice.UsuarioActual.nombre.split(' ').map((inicial) => inicial[0]).join('')
    });
    this.frmDetalles.patchValue({ detalle: '', destacado: false });
    this.scrollDetalle?.directiveRef?.update();
    this.scrollDetalle?.directiveRef?.scrollToTop(0,100);
  }
  delNotaCita(fecha: Date, nota: string): void{
    this.cita.citaMensajeNotas = this.cita.citaMensajeNotas.filter(item => item.fechaRegistra !== fecha &&  item.nota !== nota);
    this.mostrarNotas.emit(this.cita.citaMensajeNotas);
    this.scrollNota?.directiveRef?.update();
  }
  delAvisoCita(fecha: Date, aviso: string): void{
    this.cita.citaMensajeAvisos = this.cita.citaMensajeAvisos.filter(item => item.fechaRegistra !== fecha &&  item.aviso !== aviso);
    this.mostrarAvisos.emit(this.cita.citaMensajeAvisos);
    this.scrollNota?.directiveRef?.update();
  }
  delDetalleCita(fecha: Date, detalle: string): void{
    this.cita.citaMensajeDetalles = this.cita.citaMensajeDetalles.filter(item => item.fechaRegistra !== fecha && item.detalle !== detalle);
    this.mostrarDetalles.emit(this.cita.citaMensajeDetalles);
    this.scrollDetalle?.directiveRef?.update();
  }
  formulario(){
    this.frmNotas = this.formBuilder.group({ nota: ['', Validators.maxLength(100)], destacado: [false, Validators.required] });
    this.frmAvisos = this.formBuilder.group({ aviso: ['', Validators.maxLength(100)], destacado: [false, Validators.required] });
    this.frmDetalles = this.formBuilder.group({ detalle: ['', Validators.maxLength(100)], destacado: [false, Validators.required] });
  }
  get mensajePendiente(): boolean {
    //Verifica que si el usuario escribio algun texto en los casilleros de nota, aviso y detalle y no presiono enter
    if(this.frmAvisos.controls.aviso.value != '') {
      this.utilsService.mostrarToast('Tienes un aviso pendiente de confirmar', 'warning');
      return false;
    }
    if(this.frmNotas.controls.nota.value != '') {
      this.utilsService.mostrarToast('Tienes una nota pendiente de confirmar', 'warning');
      return false;
    }
    if(this.frmDetalles.controls.detalle.value != '') {
      this.utilsService.mostrarToast('Tienes un detalle pendiente de confirmar', 'warning');
      return false;
    }
    return true;
  }
  get acccionCita(): typeof AccionCita {
    return AccionCita;
  }
  get citaModel(): any {
    if(!this.mensajePendiente){
      return null;
    }
    let cita: any;
    if(this.cita != null){

      const zonasCorporales = this.cita.zonasCorporales;
      let tempHoraInicioPorZona = new Date(this.cita.horaInicio);
      const detalles : any = [];

      let total = 0;
      zonasCorporales.forEach( (zonax) => {
        const element: ElementRef<any> =  new ElementRef<any>(
          document.getElementById('duracionIdZona' + zonax.idZona)
        );
        const duracion =  parseInt(element.nativeElement.value, 10);
        tempHoraInicioPorZona = this.utilsService.sumarMinutosAsDate(
          tempHoraInicioPorZona,
          duracion
        );
        let idUsuarioAgendado = $(
          '[usuarioAgendado-idZonaEnviar=' +
            zonax.idZona +
            zonax.idUsuarioAgendadoStr +
            ']'
        ).attr('usuarioAgendado-idUsuario');
        idUsuarioAgendado =
          idUsuarioAgendado == undefined
            ? null
            : parseInt(idUsuarioAgendado, 10);
        const precio = this.cita.zonasCorporales.find(
          (x) => x.idZona == zonax.idZona
        ).precio;
        const precioSumarTotal = this.cita.zonasCorporales.find(
          (x) =>
            x.idZona == zonax.idZona &&
            x.estado === true &&
            zonax.estado === true
        );
        if (precioSumarTotal) {
          const valorASumar =
            precioSumarTotal.precioDescuento > 0
              ? precioSumarTotal.precioDescuento
              : precioSumarTotal.precio;
          total = total + valorASumar;
        }

        detalles.push({
          idCita: this.cita.idCita,
          idZona: zonax.idZona,
          sesion: zonax.sesion
            ? zonax.sesion
            : parseInt($('[sesion-idZona=' + zonax.idZona + ']').val(), 10),
          idPromocionPrecio: zonax.idPromocionPrecio
            ? zonax.idPromocionPrecio
            : zonax.idPromocionPrecio === undefined
            ? 0
            : zonax.idPromocionPrecio === 0
            ? 0
            : parseInt($('[promocion-idZona=' + zonax.idZona + ']').val(), 10),
          precioDescuento: zonax.precioDescuento,
          pagoWeb: zonax.pagoWeb,
          retroTratam: zonax.retroTratam,
          // precio: precioSumarTotal ? precioSumarTotal.precio : zonax.precio ? zonax.precio : precio,
          precio: zonax.precio,
          //duracion
          duracion: zonax.duracion,
          idUsuarioAgendado: zonax.idUsuarioAgendado
            ? zonax.idUsuarioAgendado
            : idUsuarioAgendado,
          idMedioContactoOrigen: zonax.idMedioContactoOrigen
            ? zonax.idMedioContactoOrigen
            : null,
          //estado: zonax.estado ? 1 : 0,
          estado: zonax.estado === true ? 1 : zonax.estado === false ? 0 : 9,
          id: (zonax.modificado && zonax.id > 0) || this.AccionesCita.ATENDER === true ? zonax.id : 0,
          duplicado: zonax.duplicado ? 1 : 0,
          parametros : !zonax.parametros ? '' : zonax.parametros,
          sesionFinal : !zonax.sesionFinal ? null : zonax.sesionFinal,
          tratamientoRealizado: zonax.tratamientoRealizado ? 1 : 0,
        });
      });

      const fechaCita = this.utilsService.formatDate(this.cita.fecha);
      const horaInicio = this.utilsService.formato_hora_hms(this.cita.horaInicio);
      const horaTermino = this.utilsService.formato_hora_hms(this.cita.horaTermino);

      let idUsuarioAtendidoPor = null;
      if($('[atendidoPor-idUsuario]').length > 0) {
        idUsuarioAtendidoPor = parseInt($('[atendidoPor-idUsuario]').attr('atendidoPor-idUsuario'), 10);
      }

      //verifica si es registrada o reprogramada
      //luego evalua si es confirmada

      //que si esta en estado pagado no se modifique la cita
      let idEstado

      if(this.cita.idEstado !== 82){
        idEstado = this.cita.idCita > 0 ? 10 : 5;
        idEstado = this.esConfirmada ? 6 : idEstado;
      } else{
        idEstado = this.cita.idEstado
      }


      cita = {
        idCita: this.cita.idCita,
        idTipoCita: Number(this.cita.idTipoCita),
        idCliente: this.cita.cliente.id,
        idTipoCliente: parseInt(this.cita.idTipoCliente.toString(), 10),
        idMedioContacto: 0, //parseInt(this.cita.idMedioContacto.toString(), 10),
        idMaquina: this.cita.idMaquina,
        idSede: parseInt(this.cita.idSede.toString(), 10),
        idUsuario: this.usuarioservice.UsuarioActual.idUsuario,
        fechaCita,
        horaInicio,
        horaTermino,
        total,
        usuarioRegistra: this.usuarioActual.nombre,
        usuarioEdita: this.usuarioActual.nombre,
        detalles,
        citaMensajeNotas: this.cita.citaMensajeNotas, //.filter(d => d. id == 0 ),
        citaMensajeAvisos: this.cita.citaMensajeAvisos, //.filter(d => d.id == 0 ),
        citaMensajeDetalles: this.cita.citaMensajeDetalles, //.filter(d => d.id == 0 ),
        idUsuarioAtendidoPor,
        idEstado,
        idServicio: parseInt(this.cita.idServicio.toString(),10),
        idDescuento: this.cita.idDescuento,
        descuentoAplicaA: this.cita.descuentoAplicaA,
        cuponDescuento: this.cuponDescuento.value,
        maquina: this.cita.maquina,
        idPreferente: this.idPreferente,
        numeroBox: parseInt(this.cita.numeroBox.toString(), 10),
        idMaquinaMarca: parseInt(this.cita.idMaquinaMarca.toString(), 10),
        tipoDePago: this.cita.tipoDePago,
        precioDePagoFinal: this.cita.precioDePagoFinal
      };
    }
    return cita;
  }
  citaPendiente(): void {
    this.citaService.actualizarCondicionPendiente(this.citaModel).subscribe(
      resultado => {
        if(resultado.exito) {
          this.utilsService.mostrarToast(resultado.mensaje, 'success');
        } else {
          this.utilsService.mostrarToast(resultado.mensaje, 'error');
        }
      },
      error => {
        console.log('Error al actualizar como pendiente la cita', error);
      }
    );
  }
  citaGrabar(): void {
    // Lanzar validaciones
    if(!this.validaciones() || !this.citaModel){ return; }
    this.spinner.show();
    $('.botonera-escritorio').prop( "disabled", true );

    if (this.citaModel.idCita > 0 ){
      this.citaService.actualizar(this.citaModel).subscribe(
        resultado => {
          if(resultado.exito) {
            const data = resultado.response;
            Swal.fire({
              title: 'Cita Actualizada',
              icon: 'success'
            });
            if(this.atenderCita){
              this.actualizarCitaAtendida();
            }

            this.router.navigate([`Cita/${data.idCita}/1/${data.idCliente}/${data.idPreferente}/${this.citaModel.idServicio}`]);
          } else {

            if(resultado.idCita){
              Swal.mixin({
                toast: true,
                position: 'top-end',
                timer: 7000,
                timerProgressBar: true,
                background: '#FFFFBB',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'Ver Cita'
              }).fire(resultado.mensaje, '', "error").then((result: any) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.dismiss == 'cancel') {
                  if(resultado.idCronograma){
                    window.open(`/Corporal360/Cronograma/${resultado.idCronograma}/${AccionCronograma.ASIGNARCITAS}/${this.citaModel.idCliente}/0/${resultado.idCita}/${AccionCita.VER}`, '_blank');
                  }else{
                    window.open(`/Cita/${resultado.idCita}/${AccionCita.VER}/${this.citaModel.idCliente}/0/${resultado.idServicio}`, '_blank');
                  }
                }
              });
            }else {
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }

            $('.botonera-escritorio').prop( "disabled", true );
          }
          this.spinner.hide();
        },
        error => {
          console.log('Error al actualizar la Cita: ' + error);
          this.spinner.hide();
        }
      );
    } else {
      // NUEVO
      this.citaService.grabar(this.citaModel).subscribe(
        resultado => {
          if(resultado.exito) {

            const data = resultado.response;
            Swal.fire({
              title: 'Cita Registrada',
              icon: 'success'
            });
            this.router.navigate([`Cita/${data.idCita}/1/${data.idCliente}/${data.idPreferente}/${this.citaModel.idServicio}`]);

            // this.citaPostGrabarAcciones(resultado, 'Cita Registrada');
          } else {

            if(resultado.idCita){
              Swal.mixin({
                toast: true,
                position: 'top-end',
                timer: 7000,
                timerProgressBar: true,
                background: '#FFFFBB',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'Ver Cita'
              }).fire(resultado.mensaje, '', "error").then((result: any) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.dismiss == 'cancel') {
                  if(resultado.idCronograma){
                    window.open(`/Corporal360/Cronograma/${resultado.idCronograma}/${AccionCronograma.ASIGNARCITAS}/${this.citaModel.idCliente}/0/${resultado.idCita}/${AccionCita.VER}`, '_blank');
                  }else{
                    window.open(`/Cita/${resultado.idCita}/${AccionCita.VER}/${this.citaModel.idCliente}/0/${resultado.idServicio}`, '_blank');
                  }
                }
              });
            }else{
              this.utilsService.mostrarToast(resultado.mensaje, 'error');
            }


            $('.botonera-escritorio').prop( "disabled", true );
          }
          this.spinner.hide();
        },
        error => {
          console.log('Error al registrar la cita', error);
          this.spinner.hide();
        }
      );
    }
  }
  citaEditar(){
    this.router.navigate([`/Cita/${this.cita.idCita}/${this.acccionCita.EDITAR}/${this.cita.cliente.id}/${this.idPreferente}/${this.citaModel.idServicio}`]);
  }
  citaPostGrabarAcciones(resultado: any, accionCita: string){
    //mostrar mensaje ok
    Swal.fire(accionCita);
    //eliminar los datos de la cita del servicio
    this.importExportDataService.CitaExport(null);
  }
  validaciones(): boolean {
    let validacion = true;

    if(this.cita == undefined) {
      this.utilsService.mostrarToast('No ha completado los datos de la cita.', 'error');
      return false;
    } else {

      if(this.cita.zonasCorporales == undefined)
      {
        this.utilsService.mostrarToast('No ha seleccionado las zonas corporales para la cita.', 'error');
        return false;
      } else if (this.cita.zonasCorporales.length == 0){
        this.utilsService.mostrarToast('No ha seleccionado las zonas corporales para la cita.', 'error');
        return false;
      } else {
        //verificar si se ha seleccionado las promociones
        this.cita.zonasCorporales.some(zonax => {
          if(this.usuarioActual.idperfil !== 9 ){
            if(zonax.idPromocionPrecio == 0 && zonax.estado === true || !zonax.idPromocionPrecio && zonax.estado === true) {
              this.utilsService.mostrarToast('Seleccione la promoción.', 'error');
              validacion = false;
              return true;
            }
          }

          if(this.usuarioActual.idperfil !== 9 ){
            if(zonax.sesion === 1 && !zonax.idMedioContactoOrigen && zonax.estado === true && zonax.duplicado === false) {
              this.utilsService.mostrarToast('Seleccione el origen', 'error');
              validacion = false;
              return true;
            }
          }
        });
        if(!validacion) {
          return false;
        }
      }
    }
    /*if(this.cita.idMedioContacto == 0) {
      this.utilsService.mostrarToast('Seleccione un medio de contacto.', 'error');
      return false;
    }*/
    if(this.cita.idTipoCliente == 0) {
      this.utilsService.mostrarToast('Seleccione el tipo de cliente.', 'error');
      return false;
    }
    if(this.cita.idTipoCita == 0) {
      this.utilsService.mostrarToast('Seleccione el tipo de cita.', 'error');
      return false;
    }

    if(this.cita.idMaquina == 0) {
      this.utilsService.mostrarToast('Seleccione una maquina.', 'error');
      return false;
    }

    if(this.cita.idServicio == 0) {
      this.utilsService.mostrarToast('Seleccione un servicio.', 'error');
      return false;
    }

    const almenosUnActivo = this.cita.zonasCorporales.findIndex(zona => zona.estado === true);
    //validar que no tenga todos los detalles deshabilitados

    if(almenosUnActivo === -1){
      this.utilsService.mostrarToast('Registre al menos una zona corporal Habilitada', 'error');
      return false;
    }

    if(!this.cita.tipoDePago || this.cita.precioDePagoFinal == null){
      this.tipoPagoInvalido = true;
      this.utilsService.mostrarToast('Complete los datos de tipo de pago.', 'error');

      setTimeout(() => {
        this.tipoPagoInvalido = false;
      }, 1800); 

      return false;
    }

    return validacion;
  }
  actualizarDescuentos(): void{
    const zonas = this.cita.zonasCorporales;
    const descuentoAplica = this.cita.descuentoAplicaA ? this.cita.descuentoAplicaA.split(",").map(x => parseInt(x,10)) : [];
    if(zonas){
      zonas.forEach( x => {
        if(descuentoAplica.includes(x.idZona) && x.estado === true){
          const descuento = x.precio * ( this.descuentoAdicional / 100 );
          x.precioDescuento = x.precio - descuento;
        }else{
          x.precioDescuento = 0;
        }
      });

    }
  }

  actualizaPrecio(valor, idZona: number): void {
    this.actualizarDescuentos();
    this.calcularTotales();
  }
  ponerPrecio(idPromocionPrecio: any, idZonaCorporal: number, duplicado: any): void {
    const precio = parseInt(idPromocionPrecio, 10);
    let precioZonaSegunPromocion = 0;
    if(precio > 0) {
      precioZonaSegunPromocion = this.cita.zonasCorporales.find(z => z.idZona == idZonaCorporal).promociones.find(p => p.idPromocionPrecio == precio).precioPromocion;
    }

    if(duplicado === undefined || !duplicado){
      this.cita.zonasCorporales.find(z => z.idZona == idZonaCorporal && z.estado === true).precio = precioZonaSegunPromocion;
      this.cita.zonasCorporales.find(z => z.idZona == idZonaCorporal && z.estado === true).idPromocionPrecio = precio;
    } else{
      this.cita.zonasCorporales.find(z => z.idZona == idZonaCorporal && z.estado === true && z.duplicado === true).precio = precioZonaSegunPromocion;
      this.cita.zonasCorporales.find(z => z.idZona == idZonaCorporal && z.estado === true && z.duplicado === true).idPromocionPrecio = precio;
    }


    $('[precio-idZona=' + idZonaCorporal+']').val('S/ ' + (Math.round(precioZonaSegunPromocion * 100) / 100).toFixed(2));
    this.actualizarDescuentos();
    this.calcularTotales();
  }

  ponerOrigen(idOrigenMedio: string, idZonaCorporal: number): void {
    const medioOrigen = parseInt(idOrigenMedio, 10);
    this.cita.zonasCorporales.find(z => z.idZona == idZonaCorporal && z.estado === true).idMedioContactoOrigen = medioOrigen;
    // console.log(this.cita.zonasCorporales);
  }

  getPrecio(precio){
    return 'S/ ' + (Math.round(precio * 100) / 100).toFixed(2);
  }
  getPrecioDescuento(precio): string{
    const porcentaje = this.descuentoAdicional / 100;
    const precioDescuento = precio - (precio * porcentaje);
    return 'S/ ' + precioDescuento.toFixed(2);
  }

  historial(modal: any) : void {
    this.modalCitaHistorialRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalCitaHistorialRef.result.then();
  }
  irHorario(modal: any): void {

    this.modalCitaHorarioRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalCitaHorarioRef.result.then(()=>{

      if(this.cita.zonasCorporales != null || this.cita.zonasCorporales?.length){
        this.idDescuento.enable();
        this.cuponDescuento.enable();
      }else{
        this.idDescuento.disable();
        this.cuponDescuento.enable();
      }
    });

    //this.modalCitaCuponAplicaRef.componentInstance['editarZona'] = true;

    if(this.cita.zonasCorporales != null){
      for(var i = 0; i < this.cita.zonasCorporales.length; i++){
      // guardo idUsuarioAgendado
        const idZonaTemp = this.cita.zonasCorporales[i].idZona.toString();
        const idUsuarioAgendadoTemp = parseInt($('[name=nombreusuario][usuarioAgendado-idZona=' + idZonaTemp + ']').attr('usuarioAgendado-idUsuario'), 10);
        const usuarioAgendadoTemp = $('[name=nombreusuario][usuarioAgendado-idZona=' + idZonaTemp + ']').val();
        // this.cita.zonasCorporales[i].idUsuarioAgendado = idUsuarioAgendadoTemp;
        // this.cita.zonasCorporales[i].usuarioAgendado = usuarioAgendadoTemp;
        //intento 2
        // this.cita.zonasCorporales[i].estado ? this.cita.zonasCorporales[i].idUsuarioAgendado = idUsuarioAgendadoTemp : this.cita.zonasCorporales[i].idUsuarioAgendado = null;
        // this.cita.zonasCorporales[i].estado ? this.cita.zonasCorporales[i].usuarioAgendado = usuarioAgendadoTemp : this.cita.zonasCorporales[i].usuarioAgendado = undefined;
        !this.cita.zonasCorporales[i].idUsuarioAgendado ? this.cita.zonasCorporales[i].idUsuarioAgendado = null : this.cita.zonasCorporales[i].idUsuarioAgendado ? this.cita.zonasCorporales[i].idUsuarioAgendado = this.cita.zonasCorporales[i].idUsuarioAgendado : this.cita.zonasCorporales[i].idUsuarioAgendado = idUsuarioAgendadoTemp;
        !this.cita.zonasCorporales[i].usuarioAgendado ? this.cita.zonasCorporales[i].usuarioAgendado = "" : this.cita.zonasCorporales[i].usuarioAgendado ? this.cita.zonasCorporales[i].usuarioAgendado = this.cita.zonasCorporales[i].usuarioAgendado : this.cita.zonasCorporales[i].usuarioAgendado = usuarioAgendadoTemp;
        
        //guardo promocion seleccionada
        const idPromoPrecioSeleccionadaTemp = parseInt($('[name=promocion][promocion-idZona=' + idZonaTemp + ']').val(), 10);
        !this.cita.zonasCorporales[i].idPromocionPrecio ? this.cita.zonasCorporales[i].idPromocionPrecio = undefined : this.cita.zonasCorporales[i].idPromocionPrecio ? this.cita.zonasCorporales[i].idPromocionPrecio = this.cita.zonasCorporales[i].idPromocionPrecio : this.cita.zonasCorporales[i].idPromocionPrecio = idPromoPrecioSeleccionadaTemp;
      }
    }
  }

  citaAtendida(): void {
    if(this.cita.zonasCorporales.some(zona => zona.tratamientoRealizado === false && zona.estado === true)) {
      this.utilsService.mostrarToast('Hay zonas que no han sido marcadas como atendidas', 'warning');
      return;
    }

    if($('#atendidoPor').val() == '') {
      this.utilsService.mostrarToast('Seleccione la especialista que atendió la cita', 'warning');
      return;
    }

    if($('#numeroBox').val() == '0') {
      this.utilsService.mostrarToast('Seleccione el número del box', 'warning');
      return;
    }

    if($('#idMaquinaMarca').val() == '0') {
      this.utilsService.mostrarToast('Seleccione la marca de la máquina utilizada', 'warning');
      return;
    }

    this.atenderCita = true;
    this.citaGrabar();
  }

  actualizarCitaAtendida(): void {
    this.citaService.actualizarEstadoAtendido(this.citaModel).subscribe(
      resultado => {
        if(resultado > 0){

          $('#btnProximaCita1').show();
          $('#btnProximaCita2').show();
          this.openModalConfirm(true);
          
        }
      },
      error => {});
  }

  citaEstado(modal: any, citaEstado: CitaEstado): void {
    this.citaActualizaCondicionEstado = citaEstado;
    this.datosCitaCondicion = this.citaModel;
    this.datosCitaCondicion.idEstado = citaEstado;

    this.modalCitaEstadoRef = this.utilsService.abrirModal(modal, 'xs')
    this.modalCitaEstadoRef.result.then(result =>  {
      if(result){
        this.eventoCondicionCambiada(true)
      }
    });
  }

  cambiarFechaAsignacion(): void{
    const modalRef = this.modalService.open(MdlFechaCitaAsignadaComponent);
    modalRef.componentInstance.cita = this.cita;
  }

  abrirSelecionarUsuario(modal: any, zonaSeleccionada?, agendado: boolean = false, ): void {

    if(zonaSeleccionada !== undefined && agendado) {
      if(!this.esNuevaZona(zonaSeleccionada)){
        return;
      }
    }

    if(zonaSeleccionada == undefined) {
      this.idZonaSeleccion = 0;
      //Usuario que atendio
      if(this.cita.accionCita == AccionCita.ATENDER){
        this.idPerfilBuscarUsuario = TipoPerfil.ESPECIALISTA.toString();
        this.modalUsuarioSeleccionRef = this.utilsService.abrirModal(modal, 'md');
      }
    } else {
      this.idZonaSeleccion = zonaSeleccionada.idZona;
      if(zonaSeleccionada.sesion > 1) {
        return;
      }
      //Usuario que agenda la zona
      if(this.cita.accionCita == AccionCita.EDITAR || this.cita.accionCita == AccionCita.NUEVA) {
        this.idPerfilBuscarUsuario = TipoPerfil.TODOS.toString();
        this.modalUsuarioSeleccionRef = this.utilsService.abrirModal(modal, 'md');
      }
    }
  }
  eventUsuarioSeleccionado(event): void {
    if(this.idZonaSeleccion == 0) {
      $('[name=atendidoPor]').val(event.nombre);
      $('[name=atendidoPor]').attr('atendidoPor-idUsuario', event.idUsuario);
    } else {
      //Usuario que Agenda
      this.cita.zonasCorporales.find(z => z.idZona == this.idZonaSeleccion).usuarioAgendado = event.nombre;
      this.cita.zonasCorporales.find(z => z.idZona == this.idZonaSeleccion).idUsuarioAgendadoStr = event.idUsuario.toString();
      this.cita.zonasCorporales.find(z => z.idZona == this.idZonaSeleccion).idUsuarioAgendadoStr = event.idUsuario.toString();
      $('[name=nombreusuario][usuarioAgendado-idZona=' + this.idZonaSeleccion + ']').attr('usuarioAgendado-idUsuario', event.idUsuario);
      $('[name=nombreusuario][usuarioAgendado-idZona=' + this.idZonaSeleccion + ']').val(event.nombre);
    }
    this.idZonaSeleccion = 0;
  }

  ordenarCitasDetalles(){
    this.cita.zonasCorporales.sort((a: any, b: any) => {
      if (a.idZona !== b.idZona) {
          return a.idZona - b.idZona;
      }
      if (a.estado !== b.estado) {
          return a.estado ? -1 : 1;
      }
      if (a.estado === true && a.duplicado !== b.duplicado) {
          return a.duplicado ? 1 : -1; // No duplicado antes que duplicado
      }
      if (a.estado === false) {
          return b.duplicado - a.duplicado; // true (1) antes que false (0)
      }
      return 0;
  });
  }

  eliminarZona(idZona, index, esCreadoEnAtencion: boolean = false): void {
    if(esCreadoEnAtencion){
      this.deshabilitarZona(idZona, index);
      return;
    }

    Swal.fire({
      title: "¿Estás seguro de deshabilitar la zona?",
      html: `Se quedará registrado en el historial que usted fue quien lo desactivó. 
      <span style="color: gray; font-size: 0.9em;">
      (Desactívelo solo si cometió un error o si desea cambiar el usuario agendado por el suyo)
      </span>`,
      
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, deshabilítalo!",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deshabilitarZona(idZona, index);
      }
    });
  }

  deshabilitarZona(idZona, index){
      const zonasCorporales = this.cita.zonasCorporales;
      if(zonasCorporales[index].duplicado){
        if(zonasCorporales[index].id > 0){
          this.desactivarHabilitarZonaDuplicada(idZona, false);
        } else{
          this.cita.zonasCorporales.splice(index, 1); 
        }
      } else{


        zonasCorporales[index].estado = false;

        //eliminar duplicado si existe
        const indexDuplicado = this.cita.zonasCorporales.findIndex(z => z.idZona === idZona && z.duplicado === true);
        if (indexDuplicado !== -1) {
          const zonaDuplicada = zonasCorporales[indexDuplicado];
      
          if(zonaDuplicada !== undefined){
            if(zonasCorporales[indexDuplicado].id > 0){
              this.cita.zonasCorporales.push(zonaDuplicada);
            }
            this.cita.zonasCorporales.splice(indexDuplicado, 1); 

        }}

        if(zonasCorporales[index].id > 0){
          this.cita.zonasCorporales.push(zonasCorporales[index]);
          zonasCorporales[index].precioDescuento = zonasCorporales[index].precioDescuento ? zonasCorporales[index].precioDescuento  : 0;
        }
        
        this.cita.zonasCorporales.splice(index, 1); 
        
        this.cita.duracion = this.cita.zonasCorporales.reduce(this.sumaDuracion, 0);
        this.cita.horaTermino =  this.utilsService.sumarMinutosAsDate( this.cita.horaInicio,  this.cita.duracion);
        this.cita.modificado = true;
        const descuentosAplica = this.cita.descuentoAplicaA ?  this.cita.descuentoAplicaA.split(",").map(x => parseInt(x)) : [];
        this.cita.descuentoAplicaA = descuentosAplica.filter(x => x != idZona ).join(","); 

        this.actualizarDescuentos();
        this.calcularTotales();
        this.desactivarHabilitarZonaDuplicada(idZona, false);
      }
  }

  desactivarHabilitarZonaDuplicada(idZona: number, habilitado: boolean): void {
    const zonasCorporales = this.cita.zonasCorporales;
    zonasCorporales.forEach(zona => {
      if (zona.idZona === idZona && zona.duplicado) {
        zona.estado = habilitado;
        if(!habilitado){
          //zona.verDuplicado = false;
        }
      }
    });
    this.actualizarDescuentos();
    this.calcularTotales();
  }

  verZonasDuplicadas(idZona: number): void {
    this.cita.zonasCorporales.forEach(zona => {
      if (zona.idZona === idZona && zona.duplicado) {
        zona.verDuplicado = !zona.verDuplicado;
      } 

    });


  }

  desactivarZonasDuplicadasDiferenteOperador(idZona: number, idUsuario: number){
    this.cita.zonasCorporales.forEach(zona => {
      if(zona.idZona === idZona && zona.duplicado && zona.idUsuarioAgendado !== idUsuario){
        zona.estado = false;
      }
    });

  }

  desactivarZonasDuplicadasDiferenteOperadorNoDuplicada(idZona: number, idUsuario: number){
    this.cita.zonasCorporales.forEach(zona => {
      if(zona.idZona === idZona && !zona.duplicado && zona.idUsuarioAgendado !== idUsuario){
        zona.estado = false;
      }
    });

  }

  verDuplicados(idZona: number){
    this.cita.zonasCorporales.forEach(zona => {
      if(zona.idZona === idZona && zona.duplicado){
        zona.verDuplicado = true;
      }
    });
  }

  agregarZonaAnulada(){
    const zonaAntesDeTransformar = this.cita.zonasCorporales[0]
    
    const zonaAnulada = {
      ...zonaAntesDeTransformar,
      estado: true,
      promociones: [
        {
          idPromocionPrecio: 1186974, 
          idPromocion: 759, 
          idZonaCorporal: 1576, 
          descripcion: "ANULADAS DUPLICADOS (1 - 12)", 
          precioBase: 10, 
          precioPromocion: 0, 
        },
        {
            idPromocionPrecio: 1396052, 
            idPromocion: 941, 
            idZonaCorporal: 1576,  
            descripcion: "NINGUNA BL (1 - 1)", 
            precioPromocion: 0, 
            precioBase: 0, 
        },
        {
            idPromocionPrecio: 1397707,
            idPromocion: 942,
            idZonaCorporal: 1576,
            descripcion: "NINGUNA 360 (1 - 1)",
            precioBase: 0,
            precioPromocion: 0,
        },
        {
            idPromocionPrecio: 1399362,
            idPromocion: 943,
            idZonaCorporal: 1576,
            descripcion: "NINGUNA TF (1 - 1)",
            precioBase: 0,
            precioPromocion: 0,
        },
        {
            idPromocionPrecio: 1401017,
            idPromocion: 944,
            idZonaCorporal: 1576,
            descripcion: "NINGUNA LF (1 - 1)",
            precioBase: 0,
            precioPromocion: 0,
        },
        {
            idPromocionPrecio: 1402672,
            idPromocion: 945,
            idZonaCorporal: 1576,
            descripcion: "NINGUNA EXF (1 - 1)",
            precioBase: 0,
            precioPromocion: 0,
        },
        {
            idPromocionPrecio: 1404327,
            idPromocion: 946,
            idZonaCorporal: 1576,
            descripcion: "NINGUNA DER (1 - 1)",
            precioBase: 0,
            precioPromocion: 0,
        }
      ],
      idZona: this.cita.idServicio === 1 ? 1576 : this.cita.idServicio === 2 ? 1578 : this.cita.idServicio === 3 ? 1580 : this.cita.idServicio === 10 ? 1696 : 1582,
      idUsuarioAgendado: this.usuarioActual.idUsuario,
      idUsuarioAgendadoStr: this.usuarioActual.idUsuario.toString(),
      usuarioAgendado: this.usuarioActual.nombre,
      precio: 0,
      precioBase: 0,
      precioDescuento: 0,
      descripcion: "ZONA ANULADA",
      idTipo: 0,
      igv: 0,
      duracion: 10,
      pagoWeb: false,
      sesion: 1,
      idEstado: 1,
      retroTratam: false,
      idPromocionPrecio: 1186974,
      idServicio: this.cita.idServicio,
      servicio: "",
      servicioColor: "#00aded",
      idMedioContactoOrigen: 5
    }

    this.cita.zonasCorporales.push(zonaAnulada);
    this.calcularTotales();
  }

  desactivarZonasParaAnular(){
    if (this.cita.idServicio === 1 || this.cita.idServicio === 2 || this.cita.idServicio === 3 || this.cita.idServicio === 4 || this.cita.idServicio === 10) {
      this.cita.zonasCorporales.forEach(zona => {
        if(zona.idZona !== 1576 && zona.idZona !== 1578 && zona.idZona !== 1580 && zona.idZona !== 1582 && zona.idZona !== 1696){
          zona.estado = false;
        }
      })
  
      const existeZonaAnulada = this.cita.zonasCorporales.some(zona => zona.descripcion.startsWith("ZONA ANULADA"));

      if(!existeZonaAnulada){
        this.agregarZonaAnulada();
      }
    }
  }

  actualizarAgendado(zona){
    //verificar que no exista esa zona con el mismo usuario
    Swal.fire({
      title: "Deshabilitaras a " + zona.usuarioAgendado.split(" ")[0] + "!!!",
      html: `<span style="color: gray; font-size: 0.9em;">
      (¿Quieres asignarte esta cita?).
      </span>`,
      
      
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, Asignarmelo!",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const existeDuplicado = this.cita.zonasCorporales.findIndex(
          (x: any) => x.idZona === zona.idZona && x.idUsuarioAgendado === this.usuarioActual.idUsuario
        );
      
        //si existe lo cambio a true
        if(existeDuplicado !== -1){
          this.cita.zonasCorporales[existeDuplicado].estado = true;
    
          this.desactivarZonasDuplicadasDiferenteOperadorNoDuplicada(zona.idZona, this.usuarioActual.idUsuario);
        } else{
          //sino creo la renovacion
          const zonaNuevaDeUsuarioAgendado = {
            ...zona,
            idUsuarioAgendado: this.usuarioActual.idUsuario,
            idUsuarioAgendadoStr: this.usuarioActual.idUsuario.toString(),
            usuarioAgendado: this.usuarioActual.nombre,
          }
    
          this.cita.zonasCorporales.push(zonaNuevaDeUsuarioAgendado);
    
          this.desactivarZonasDuplicadasDiferenteOperadorNoDuplicada(zona.idZona, this.usuarioActual.idUsuario);
          this.ordenarCitasDetalles();
        }

      }})



  }

  duplicarZona(zona): void {
    Swal.fire({
      title: "¿Quieres duplicar la zona?",
      html: `<span style="color: gray; font-size: 0.9em;">
      (Hágalo solo si el cliente desea más sesiones de la misma zona).
      </span>`,
      
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, duplícalo!",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        const existeDuplicado = this.cita.zonasCorporales.findIndex(
          (x: any) => x.idZona === zona.idZona && x.duplicado && x.idUsuarioAgendado === this.usuarioActual.idUsuario
        );
      
        if(existeDuplicado !== -1){
          this.cita.zonasCorporales[existeDuplicado].estado = true;
          this.desactivarZonasDuplicadasDiferenteOperador(zona.idZona, this.usuarioActual.idUsuario);
          //funcion para poner false los demas duplicados
        } else{
          const zonaDuplicada = {
            ...zona,
            id: 0,
            duracion: 0,
            idMedioContactoOrigen: 0,
            idPromocionPrecio: 0,
            idUsuarioAgendado: this.usuarioActual.idUsuario,
            idUsuarioAgendadoStr: this.usuarioActual.idUsuario.toString(),
            pagoWeb: false,
            precio: 0,
            precioDescuento: 0,
            retroTratam: false,
            usuarioAgendado: this.usuarioActual.nombre,
            duplicado: true,
            verDuplicado: true
          }
          const index = this.cita.zonasCorporales.findIndex(z => {
            return z.id === zona.id && zona.estado === true
          }
          );
          this.cita.zonasCorporales.splice(index + 1, 0, zonaDuplicada);
          this.verDuplicados(zona.idZona);

          this.desactivarZonasDuplicadasDiferenteOperador(zona.idZona, this.usuarioActual.idUsuario);
          this.ordenarCitasDetalles();
        }


      }
    });

    
  }

  tieneUnDuplicado(idzona: number): boolean {

    const existeDuplicado = this.cita.zonasCorporales.some(
      (x: any) => x.idZona === idzona && x.duplicado 
    );
    
    return existeDuplicado;
  }

  tieneUnPadreActivo(idzona: number): boolean {
    const duplicadoTieneUnPadreActivo = this.cita.zonasCorporales.some(
      (x: any) => x.idZona === idzona && x.duplicado === false && x.estado
    );

    return duplicadoTieneUnPadreActivo;
  }

  tieneUnDuplicadoAbierto(idzona: number): boolean {
    const existeDuplicado = this.cita.zonasCorporales.some(
      (x: any) => x.idZona === idzona && x.duplicado && x.verDuplicado
    );
    
    return existeDuplicado;
  }

  habilitarZona(idZona, index, modalHorario, esPadre, idUsuarioAgendado): void {
    Swal.fire({
      title: "¿Estas seguro de habilitar la zona?",
      
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, habilítalo!",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const zonasCorporales = this.cita.zonasCorporales;

        if(zonasCorporales[index].duplicado){
          this.desactivarHabilitarZonaDuplicada(idZona, true);
          this.desactivarZonasDuplicadasDiferenteOperador(idZona, idUsuarioAgendado);
        } else{

          
          zonasCorporales[index].estado = true;
          this.actualizarDatosConNuevaZonaHabilitada(index, idZona, esPadre);
          this.abrirModalHorario(modalHorario, idZona, index, esPadre);
        }
      }
    });
  }

  actualizarDatosConNuevaZonaHabilitada(index, idZona, esPadre){
    const zonasCorporales = this.cita.zonasCorporales;

    this.desactivarZonaConOtroUsuario(index, idZona, esPadre);
    this.cita.duracion = this.cita.zonasCorporales.reduce(this.sumaDuracion, 0);
    this.cita.horaTermino =  this.utilsService.sumarMinutosAsDate( this.cita.horaInicio,  this.cita.duracion);
    this.cita.modificado = true;
    const descuentosAplica = this.cita.descuentoAplicaA ?  this.cita.descuentoAplicaA.split(",").map(x => parseInt(x)) : [];
    this.cita.descuentoAplicaA = descuentosAplica.filter(x => x != idZona ).join(","); 
    zonasCorporales[index].precioDescuento = zonasCorporales[index].precioDescuento ? zonasCorporales[index].precioDescuento  : 0;

    this.actualizarDescuentos();
    this.calcularTotales();
  }

  desactivarZonaConOtroUsuario(indexZona: number, idZona: number, esPadre: boolean){
    const zonasCorporales = this.cita.zonasCorporales;
    const zonaReferencia = zonasCorporales[indexZona];
    const existeMismaZonaActiva = zonasCorporales.some(z => z.idZona === zonaReferencia.idZona && z.idUsuarioAgendado !== zonaReferencia.idUsuarioAgendado && !z.duplicado && z.estado);    
    
    zonasCorporales.forEach((zona, index) => {
      if (zona.idZona === zonaReferencia.idZona && zona.idUsuarioAgendado !== zonaReferencia.idUsuarioAgendado && !zona.duplicado) {
        zona.estado = false;

        this.cita.zonasCorporales.push(zona);
        this.cita.zonasCorporales.splice(index, 1); 

        const indexDuplicado = this.cita.zonasCorporales.findIndex(z => z.idZona === zona.idZona && z.duplicado === true);
        if (indexDuplicado !== -1) {
          const zonaDuplicada = this.cita.zonasCorporales[indexDuplicado];
      
          if(zonaDuplicada !== undefined){
            this.cita.zonasCorporales.splice(indexDuplicado, 1); 
            this.cita.zonasCorporales.push(zonaDuplicada);
        }}
      }
    });

    const index = this.cita.zonasCorporales.findIndex(z => z.idZona === zonaReferencia.idZona && z.duplicado === true);
    const indexZonaActivo = this.cita.zonasCorporales.findIndex(z => z.idZona === zonaReferencia.idZona && z.estado === true && z.duplicado === false);
    if (index !== -1) {
      const zonaDuplicada = zonasCorporales[index];
  
      if(zonaDuplicada !== undefined){
        this.cita.zonasCorporales.splice(index, 1); 
        this.cita.zonasCorporales.splice(indexZonaActivo + 1, 0, zonaDuplicada);
      }

      if(!existeMismaZonaActiva){
      } else{
      }
    } else{
    }

  }
  
  abrirModalHorario(modalHorario: any, idZona: number, index: number, esPadre){
    this.spinner.show();
    this.modalCitaHorarioRef = this.utilsService.abrirModal(modalHorario, 'lg' );

    this.modalCitaHorarioRef.result
    .then(() => {
      this.ordenarCitasDetalles();
      this.spinner.hide();
    })

    const pintarAgendaPorSeleccionZC = {
      idCita: this.cita.idCita,
      idUsuario: this.usuarioActual.idUsuario,
      duracion: this.cita.duracion,
      horaInicio: this.cita.horaInicio,
      minutoInicio: this.utilsService.totalDeMinutos(this.cita.horaInicio),
      minutoTermino: this.utilsService.totalDeMinutos(this.cita.horaInicio) + this.cita.duracion
    };

    this.editarZonaService.pintarAgendaPorSeleccionZC = pintarAgendaPorSeleccionZC;
    this.editarZonaService.verificarHorarioZonaActivada = true;
    this.editarZonaService.idZonaHorarioZonaActivada = idZona;
    this.editarZonaService.indexZonaHorarioZonaActivada = index;
  }

  desahibilitarZonaPorCruceDeHorario(event: { index: number; idZona: number }): void{
    const zonasCorporales = this.cita.zonasCorporales;
    
    zonasCorporales[event.index].estado = false;
    this.cita.duracion = this.cita.zonasCorporales.reduce(this.sumaDuracion, 0);
    this.cita.horaTermino =  this.utilsService.sumarMinutosAsDate( this.cita.horaInicio,  this.cita.duracion);
    this.cita.modificado = true;
    const descuentosAplica = this.cita.descuentoAplicaA ?  this.cita.descuentoAplicaA.split(",").map(x => parseInt(x)) : [];
    this.cita.descuentoAplicaA = descuentosAplica.filter(x => x != event.idZona ).join(","); 
    zonasCorporales[event.index].precioDescuento = zonasCorporales[event.index].precioDescuento ? zonasCorporales[event.index].precioDescuento  : 0;
    this.actualizarDescuentos();
    this.calcularTotales();
  }

  sumaDuracion(total, num) {
    if(num.estado){
      return total + num.duracion;
    }
    return total;
  }

  activarRetroTto(event, idZona: number): void{
    this.cita.zonasCorporales.find( x => x.idZona === idZona && x.estado === true).retroTratam = event.target.checked;
  }
  activarPagoWeb(event, idZona: number): void{
    this.cita.zonasCorporales.find( x => x.idZona === idZona && x.estado === true).pagoWeb = event.target.checked;
  }

  eventoCondicionCambiada(event) {
    this.router.navigateByUrl('/Cita', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/Cita/${this.cita.idCita}/${this.acccionCita.VER}/${this.cita.cliente.id}/${this.idPreferente}/${this.citaModel.idServicio}`]);
    });
  }

  esNuevaZona( nuevaZona: any ): boolean {
    const zonaEncontrada = this.zonasCorporales.find(( x => x.idZona == nuevaZona.idZona))
    if (zonaEncontrada){
      // console.log('zonaencontrada', zonaEncontrada);
      return false;
    }else{
      // console.log('zonanoencontrada');
      return true;
    }
  }

  // Evolucion del tratamiento
  visualizarOpciones(): void{
    this.modalService.open(this.modalOpcionesEvolucion,{
      size: 'md',
      centered: true
    });
  }
  obtenerPieyCabeceradePagina(): void{
    this.sbcParametroSistemaCabeceraPagina = this.parametroSistemaService.obtenerById(11).subscribe((res) => {
      this.cabeceraPagina = res.response?.valor;
    });
    this.sbcParametroSistemaPiePagina = this.parametroSistemaService.obtenerById(12).subscribe((res) => {
      this.piePagina = res.response?.valor;
    });
  }

  verEvolcuionParaEditar(){
    this.evolucionTratamientoGrabar(this.modEvolucionTratamiento, true);
  }

  evolucionTratamientoGrabar(modal: any, editar: boolean = false): void{
    this.editarEvolucion = editar;
    this.modalHistoriaClinicaRef = this.utilsService.abrirModal(modal, 'xl');
    this.modalHistoriaClinicaRef.result.then((res) => {
      if(res){
        this.obtenerEvolucionTratamiento();
      }
    });
  }
  obtenerEvolucionTratamiento(): void{
    const parametro = this.activatedRoute.snapshot.params;
    const idCita = parseInt(parametro.id, 10);

    this.ldEvolucionTratamiento = true;
    this.sbcHistoriaClinica =  this.evolucionTratamientoService.obtenerEvolucionTratamientoByCita(idCita).subscribe((res) => {

      // console.log('evoluciontratamiento',res);

      if(!res){
        const evot: EvolucionTratamiento = new EvolucionTratamiento();
        evot.idCita = idCita;
        evot.usuarioRegistro = this.usuarioService.UsuarioActual.nombre;
        evot.idUsuarioRegistro = this.usuarioService.UsuarioActual.idUsuario;
        evot.idUsuarioModifico = null;
        this.evolucionTratamiento = evot;
        return;
      }

      this.evolucionTratamiento = res;
      this.evolucionTratamiento.idUsuarioModifico = this.usuarioService.UsuarioActual.idUsuario;
      this.carSubTitleEvolucion = '(EVT-' + this.evolucionTratamiento.id.toString().padStart(8,'0') + ') FECHA DE REGISTRO: ' + this.utilsService.formato_FechaFullString(this.evolucionTratamiento.fechaRegistro,'-',':') + ' - REGISTRADO POR: ' + this.evolucionTratamiento.usuarioRegistro;

      if(this.mdltratamientoMostrar){
        this.verEvolcuionParaEditar();

        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {},
        });
      }
    }, error => {
      console.log(error);
    }, () => {
      this.ldEvolucionTratamiento = false;
    });
  }
  exportarHistoriaClinicaPdf(view: boolean = false): void{

    if(!this.evolucionTratamiento){
      this.utilsService.mostrarToast('Registrar historia clinica','warning');
      return;
    }
    this.evolucionTratamientoService.exportarEvolucionTratamientoPdf(this.evolucionTratamiento,this.cita.cliente,this.cabeceraPagina,this.piePagina,view);

  }


  abrirMdlParametrosHistorial(idZona: number, idDetalle: number, sesion: number) {
    this.modalRef = this.modalService.open(MdlHistorialParametrosComponent, { size: 'md', windowClass: 'bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.modal = this.modalRef;

    this.modalRef.componentInstance.idServicio = this.cita.idServicio;
    this.modalRef.componentInstance.idCliente = this.cita.cliente.id;
    this.modalRef.componentInstance.idZona = idZona;
    this.modalRef.componentInstance.idDetalle = idDetalle;
    this.modalRef.componentInstance.sesion = sesion;
  }
  
  abrirMdlFotosParametro(idZona: number, parametro: any, citaDetalleId: number, index: number, sesion: number) {
    // MdlFotosParametrosCitaComponent
    this.modalRef = this.modalService.open(MdlParametrosCitaRegistroComponent, { size: 'md', windowClass: 'bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.modal = this.modalRef;

    this.modalRef.componentInstance.clienteId = this.cita.cliente.id;
    this.modalRef.componentInstance.servicioId = this.cita.idServicio;
    this.modalRef.componentInstance.zonaId = idZona;
    this.modalRef.componentInstance.citaDetalleId = citaDetalleId;
    this.modalRef.componentInstance.sesion = sesion;

    this.modalRef.componentInstance.tieneParametro = parametro ? true : false

    this.modalRef.componentInstance.addParametro.subscribe(() => {
    });
  }

  abrirMdlTipoDePago(){
    this.controlDeCitasService.abrirMdlTipoDePago(this.cita.idCita, this.cita.cliente.nombresCompletos, this.precioNeto, this.cita.tipoDePago, this.cita.precioDePagoFinal)
    .subscribe(result => {
      if (result) {
        this.cita.precioDePagoFinal = result.montoFinal;
        this.cita.tipoDePago = result.tipoDePago;
        if(this.AccionesCita.VER){
          this.controlDeCitasService
                .updatePayment(this.cita.idCita, result.montoFinal, this.usuarioActual.idUsuario, this.cita.tipoDePago)
                .subscribe((res: any) => {
                  if (res.status !== 200) return;
      
                  this.cita.idEstado = 82;
                  this.controlDeCitasService.mostrarSuccesPaymentToast(true);
                });
        }
      }
    });
  }

  verFotos(zonaEvolucionDetalle: EvolucionTratamientoZona){
    this.fotos = [];
    this.zonaEvolucionTratamiento = zonaEvolucionDetalle;
    this.spinner.show();
    this.ldObtenerFotosById = true;
    this.sbcObtenerFotosById = this.evolucionTratamientoService.obtenerFotosById(zonaEvolucionDetalle.id).subscribe((res) => {
      if(!res.foto1){
        this.ldObtenerFotosById = false;
        this.spinner.hide();
        this.utilsService.mostrarToast('La zona no tiene fotos registradas','warning');
        return;
      }

      if( res.foto1 ){ this.fotos.push(res.foto1); }
      if( res.foto2 ){ this.fotos.push(res.foto2); }
      this.ldObtenerFotosById = false;
      this.spinner.hide();
      this.modalService.open(this.modalFotosEvolucion,{
        size: 'lg',
        centered: true
      });

    }, error => {
      console.log(error);
      this.ldObtenerFotosById = false;
    })

  }



  // Cita Detalle
  obtenerDetalleCita(): void{
    const parametro = this.activatedRoute.snapshot.params;
    const idCita = parseInt(parametro.id, 10);

    this.ldCollectionDetalleCita = true;
    this.sbcCollectionCitaDetalle = this.citaDetalleService.obtenerDetalleByCita( idCita ).subscribe( (res) => {
      this.collectionCitaDetalle = res;
      this.ldCollectionDetalleCita = false;
    }, error => {
      console.error(error);
      this.ldCollectionDetalleCita = false;
    });
  }
  showZone( idCitaDetalle: number ): string{
    const citaDetalle = this.collectionCitaDetalle.find( cd => cd.id === idCitaDetalle );
    if(citaDetalle){
      return citaDetalle.zona.nombre;
    }
    return '';
  }
  // Cita Medicion
  citaMedicionGrabar(modal: any, tipoMedicion: number): void{
    this.tipoMedicion = tipoMedicion;
    if(!this.tipoMedicion){
      this.utilsService.mostrarToast('Seleccionar un tipo de medición','warning');
      return;
    }

    switch (tipoMedicion){
      case 1: this.citaMedicion = this.citaSatisfaccion;break;
      case 2: this.citaMedicion = this.citaEfectividad;break;
      default: break;
    }
    this.modalCitaMedicionRef = this.utilsService.abrirModal(modal, 'md');
    this.modalCitaMedicionRef.result.then((res) => {
      this.citaMedicionSatisfaccion();
      this.citaMedicionEfectividad();
    });
  }
  citaMedicionSatisfaccion(): void{
    const parametro = this.activatedRoute.snapshot.params;
    const idCita = parseInt(parametro.id, 10);
    this.citaMedicionService.obtenerMedicionByIdCita(idCita, 1).subscribe((res) => {
      this.citaSatisfaccion = res;
    });
  }
  citaMedicionEfectividad(): void{
    const parametro = this.activatedRoute.snapshot.params;
    const idCita = parseInt(parametro.id, 10);
    this.citaMedicionService.obtenerMedicionByIdCita(idCita, 2).subscribe((res) => {
      this.citaEfectividad = res;
    });
  }


  // Opciones menu movil
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }


  // Init data
  listarMedioContacto(): void{
    this.sbcMedioContacto = this.medioContactoService.obtenerMedioContacto().subscribe((res: MedioContacto[]) => {
      //console.log(res);
      this.maestroMedioContacto = res;
      console.info('[Listar] Medio de contacto');
    },error => {
      console.log(error);
    });
  }

  listarCupones(): void{
    this.sbcCollectionCupon = this.descuentoService.obtenerListado().subscribe((res: Descuento[]) => {
      //console.log(res);
      this.collectionCupones = res;
      console.info('[Listar] Cupones');
    },error => {
      console.log(error);
    })
  }

  listarServicios(): void{
    this.sbcServicios = this.servicioService.listarByEstado(1).subscribe((res)  => {
      this.servicios = res;
    }, error => {
      console.log(error);
    })
  }

  async listarMaquinaMarcas(): Promise<void>{

    const parametro = await this.activatedRoute.snapshot.params;
    this.idServicio = parseInt(parametro.idServicio, 10);

    this.sbcMaquinaMarca = this.maquinaMarcaService.listarByServicio(this.idServicio).subscribe((res: MaquinaMarca[]) => {
      console.log(res);
      this.maquinaMarcas = res;
    }, error => {
      console.log(error);
    })
  }


  // ChangeEvents
  actualizarDescuento(event): void{
    const id = parseInt(event.target.value);
    this.cita.idDescuento;
    if(id){
      this.descuentoAdicional = this.collectionCupones.find( x => x.id).porcentaje;
    }else{
      this.descuentoAdicional = 0;
      this.cita.descuentoAplicaA = null;
      this.cita.zonasCorporales.forEach(x => {
        x.precioDescuento = 0;
      });
    }
  }




  // Funciones
  obtenerDescripcionPromocion(idPromocionPrecio): string{
    return '';
  }
  aplicaDescuentoAdicional(idZona: number, estado: boolean): boolean{
    if(this.cita.descuentoAplicaA){
      const ids = this.cita.descuentoAplicaA.split(",").map( x => parseInt(x,10));
      return ids.includes(idZona) && estado === true;
    }

    return false;
  }
  activarCampos(): boolean{
    return this.accionCita === 4 || this.accionCita === 2;
  }
  verBotonCambiarFechaLlamada(): boolean{
    return this.usuarioService.UsuarioActual.idUsuario === this.cita.idUsuarioAsignado;
  }

  agendarSiguienteCita(): void{
    const modalRef = this.modalService.open(MdlSiguienteCitaComponent,{size: 'md', backdrop: "static", windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, backdropClass: 'bg-transparent', animation: true});
    modalRef.componentInstance.IdCita = this.cita.idCita;
    modalRef.componentInstance.IdCliente = this.cita.cliente.id;
  }

  procesarPromocionesPorZona(promociones: any[]): AutocompleteOption[] {
    return promociones.map(p => ({ id: p.idPromocionPrecio, text: '[' + p.precioPromocion + '] ' + p.descripcion }))
  }

  getPromocionFormControl(idZona: number): FormControl {
    // Crear un FormControl dinámico para cada zona
    const zona = this.cita.zonasCorporales.find(z => z.idZona === idZona && z.estado === true);
    const value = zona?.idPromocionPrecio || '0';
    return new FormControl(value);
  }

  onPromocionSelected(event: AutocompleteSelectionEvent, idZona: number, duplicado: any): void {
    if (event.option) {
      this.ponerPrecio(event.option.id, idZona, duplicado);
    }
  }
  /*******************************************************************************************************************
   * Events
   */
  evtOnChangeSesion(model: ZonaCorporalClass): void{
      if(model.sesion.toString() != ""){
        model.loading = true;
        const subs = this.zonaSesionTratamientoService.tratamientosByZonaSesion(this.usuarioActual.idUsuario, model.idZona, model.sesion).subscribe((res: ZonaTratamiento[] | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            model.tratamientos = res;
          }
          model.loading = false;
        }, error => {
          this.utilsService.mostrarToast('No se pudo obtener los tratamientos', 'error');
          model.tratamientos = [];
          model.loading = false;
        });
        this.subscriptions.push(subs);
      }
  }

  onPromocionCleared(idZona: number, duplicado?: boolean): void {
    let zona: any = null;
    
    // Buscar la zona corporal en la lista, considerando si es duplicado o no
    if (duplicado === undefined || !duplicado) {
      zona = this.cita.zonasCorporales.find((z: any) => z.idZona === idZona && z.estado === true);
    } else {
      zona = this.cita.zonasCorporales.find((z: any) => z.idZona === idZona && z.estado === true && z.duplicado === true);
    }
    
    if (zona) {
      // Limpiar el precio y el ID de la promoción
      zona.precio = 0;
      zona.idPromocionPrecio = 0; // o null según convenga
      
      // Actualizar la interfaz si es necesario (usando jQuery como se hace en ponerPrecio)
      $('[precio-idZona=' + idZona + ']').val('S/ 0.00');
      
      // Actualizar descuentos y recalcular totales
      this.actualizarDescuentos();
      this.calcularTotales();
      
    }
  }

  abrirModalDeEdicion(modalHorario: any, idZona: number, id:number, idUsuario: number){
    this.modalCitaHorarioRef = this.utilsService.abrirModal(modalHorario, 'lg' );

    this.editarZonaService.editarZona = true;
    this.editarZonaService.idZona = idZona;
    this.editarZonaService.id = id;
    this.editarZonaService.idUsuario = idUsuario;
  }

  //funcion para que se reestablezca la citadetalle como estaba antes de modificar
  deshacerCambios(){
    window.location.reload();
  }

  crearVioModalLocalStorage(){
      // Verificar si 'vioModal' ya existe en localStorage
      if (localStorage.getItem('vioModalDetalle') === null) {
        // Si no existe, lo crea y lo establece en false
        localStorage.setItem('vioModalDetalle', 'false');
      }
  }

  mostrarModalDeNuevaVersion(){
    if (localStorage.getItem('vioModalDetalle') !== 'true'){
      Swal.fire({
        title: "¡Nueva Actualización de Clinic!",
        //html: `Antes de registrar, por favor, borra la memoria caché de tu navegador y asegúrate de elegir 'desde siempre' como el período de tiempo Aquí. Si aún tienes problemas, intenta abrir el Clinic en una ventana de incógnito. Gracias.`,
        html: `
      Antes de registrar, por favor, borra la memoria caché de tu navegador y asegúrate de elegir 
      'desde siempre' como el período de tiempo 
      <a href="https://www.siteground.es/kb/como-limpiar-cache-y-cookies/" target="_blank" style="color: blue; font-weight: bold; text-decoration: underline;">
        Tutorial Aquí
      </a>. 
      Si aún tienes problemas, intenta abrir el Clinic en una ventana de incógnito. Gracias.
    `,
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok, entendido!",
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('vioModalDetalle', 'true');
        }
      });

    }

  }

  citaNueva(): void {
    const modalRef = this.modalService.open(MdlAgendarCitaComponent,{size: 'lg', windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false,  animation: true, backdrop: "static" });
    modalRef.componentInstance.idCliente = this.cita.cliente.id;;
    modalRef.result.then((res: boolean) => {});
  }

  debeMostrarDocumentoEspecialista(): boolean {
    const esMobile = this.isSmallScreen;
    // const esEspecialista = this.usuarioActual?.idperfil === 9;
    const esAccionRestringida = this.AccionesCita.ATENDER || this.AccionesCita.VER || this.AccionesCita.CONFIRMAR || this.AccionesCita.ATENDER;

    return !(esMobile && esAccionRestringida);
  }

  mostrarEspecialistaMobile(){
    // return this.usuarioActual.idperfil === 9 && this.isSmallScreen === true
    return this.isSmallScreen === true; 
  }

    enviarNotificacion(idSede: number, idcita: number){
      Swal.fire({
        title: "¿Estas seguro de notificar el pago?",
        
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, notifícalo!",
        cancelButtonText: "No, Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.controlDeCitasService.enviarNotificaionDePago(this.usuarioActual.idUsuario, idSede, this.usuarioActual.nombre, idcita).subscribe((resp : any) => {
            if(resp.status == 201){
              this.cita.esNotificado = true;
  
              Swal.fire({ 
                title: 'Notificación enviada',
                icon: 'success',
                buttonsStyling: false,
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false,
              })
            }
            if(resp.status == 400){

              Swal.fire({ 
                title: 'No se puede notificar',
                text: resp.message,
                icon: 'error',
                buttonsStyling: false,
                timer: 2000,
                showCancelButton: false,
                showConfirmButton: false,
              })
            }
          });
        }
    })};



    openModalConfirm(esAtender?: boolean): void {
        const sendData = {
          idCita: this.cita.idCita,
          paciente: this.cita.cliente.nombresCompletos,
          montoInicial: this.precioNeto,
        };
    
        const dialogRef = this.dialog.open(PagoFinalDialog, {
          width: '430px',
          data: {
            cita: sendData,
            montoFinal: 0,
            paciente: this.cita.cliente.nombresCompletos,
          },
        });
    
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result !== undefined && result >= 0) {

            this.controlDeCitasService
              .updatePayment(this.cita.idCita, result, this.usuarioActual.idUsuario, this.cita.tipoDePago)
              .subscribe((res: any) => {
                if (res.status !== 200) return;
    
                this.cita.idEstado = 82;

                Swal.fire({ 
                  title: 'Pago confirmado',
                  icon: 'success',
                  confirmButtonColor: "#3085d6",
                  timer: 1500,
                  showCancelButton: false,
                  showConfirmButton: false,
                  allowOutsideClick: false,
                }).then(() => {
                    window.location.reload();
                });
              });
          }

          if(esAtender !== undefined && esAtender){
            window.location.reload();
          }
        });
      }
    
  atencionEmpezada: boolean = false;  
  
  //Iniciar la atencion
  
  iniciarTemporizador(): void {
    setTimeout(() => {
      this.cronometroComponent.iniciar();
    }, 10)
  }

  inicioAtencion(){
    this.atencionEmpezada = true;
    this.cita.colorEstado = '#ff9a00';
    this.iniciarTemporizador();
  }

  validarIniciarAtencion(){
    const atendidoPor = $('[name=atendidoPor]').val();

    return (
      Number(this.cita.numeroBox) === 0 || 
      Number(this.cita.idMaquinaMarca) === 0 || 
      !atendidoPor || atendidoPor.trim() === ''
    );  
  }

  verMdlZonas(): void{
    this.mdlSeleccionarZona = this.modalService.open(SubmdlSeleccionarZonaComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static', backdropClass: 'bg-transparent' });
    this.mdlSeleccionarZona.componentInstance.IdServicio = this.cita.idServicio;
    this.mdlSeleccionarZona.componentInstance.TecnologiasSelected = [];
    this.mdlSeleccionarZona.componentInstance.TecnologiasActived = [];
    this.mdlSeleccionarZona.componentInstance.zonasDetalle = this.cita.zonasCorporales;
    this.mdlSeleccionarZona.componentInstance.onZonaSeleccionada.subscribe((zonasSeleccionadas: any[]) => {
      this.cita.zonasCorporales.push(...zonasSeleccionadas);
    }); 
  }

}






@Component({
  selector: 'dialog-content-example-dialog',
  styleUrls: ['../cita-listado/cita-item-listado/cita-item-listado.component.scss' ],
  template: `
    <h1 mat-dialog-title class="text-center m-0">
      CONFIRMAR PAGO FINAL DE CITA
    </h1>
    <h6 class="custom-text">
      {{ data.paciente }} : Código de Cita {{ data.cita.idCita }}
    </h6>

    <span class="mySubtitle mb-3">
      <h6>Monto inical del Contrato</h6>
      <h3>S/. {{ data.cita.montoInicial }}</h3></span
    >

    <mat-dialog-content class="mat-typography">
      <section class="content-dialog m-0">
        <mat-form-field appearance="fill">
          <mat-label>Monto Final S/.</mat-label>
          <input [disabled]="!enabled" matInput [(ngModel)]="montoFinal" />
          <mat-hint align="start">¿Desea cambiar el monto final? </mat-hint>
        </mat-form-field>
        <mat-checkbox
          class="example-margin"
          [(ngModel)]="enabled"
        ></mat-checkbox>
      </section>
    </mat-dialog-content>

    <mat-dialog-actions class="mt-3" align="end">
      <button
        class="bg-primary"
        mat-button
        [mat-dialog-close]="enabled ? montoFinal : data.cita.montoInicial"
        cdkFocusInitial
      >
        Guardar Monto Final
      </button>
    </mat-dialog-actions>
  `,
})
export class PagoFinalDialog {
  montoFinal: string;
  paciente: string;
  enabled = false;

  constructor(
    public dialogRef: MatDialogRef<PagoFinalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.montoFinal = data.cita.montoInicial; // Valor inicial del monto
    this.paciente = data.paciente;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}