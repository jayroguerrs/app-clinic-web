import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { User } from 'src/app/shared/models/user';
import { CitaService } from '../../../shared/services/cita.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { ParametroSistemaService } from '../../../shared/services/parametro-sistema.service';
declare const AmCharts: any;
import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/serial.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { ImportExportDataService } from '../../../shared/services/import-export-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {IncidenciaService} from "../../../shared/services/incidencia.service";
import {NivelAtencion} from "../../../shared/models/incidencia";
import {Subscription} from "rxjs";
import {ReportePreferenteService} from "../../../shared/services/reporte-preferente.service";
import {DatePipe} from "@angular/common";
import {PreferenteReporteTotal} from "../../../shared/models/preferente.model";
import { CcvoxService } from '../../../shared/services/ccvox.service.js';
import Swal from 'sweetalert2';
import { TblBusquedaIdcitaComponent } from './tbl-busqueda-idcita/tbl-busqueda-idcita.component.js';

import { PermisoHelper } from '../../../shared/helpers/permisos.helper.js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CajaService } from '../../../shared/services/caja.service.js';
import { ControlDeCitasService } from '../../../shared/services/control-de-citas.service.js';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentExampleDialog } from '../../cita/cita-listado/cita-item-listado/cita-item-listado.component.js';
import { ComprobanteElectronicoDatos } from '../../../shared/models/facturacion/comprobante-electronico.js';
import { MdlEmisionComprobanteComponent } from '../../modals/mdl-emision-comprobante/mdl-emision-comprobante.component.js';
import { AccionCronograma, EnumTipoComprobante } from '../../../shared/enumeracion/enums.js';
import { ComprobanteElectronicoService } from '../../../shared/services/facturacion/comprobante-electronico.service.js';
import { NumeroALetras } from '../../../shared/services/funciones/numero-letras.service.js';

import * as JsBarcode from 'jsbarcode';

import { MdlPdfGoogleViewComponent } from '../../modals/mdl-pdf-google-view/mdl-pdf-google-view.component.js';
import { EmpresaService } from '../../../shared/services/empresa.services.js';
import { plantilla } from '../../../formatos/resumen-cita.js';
import { DomSanitizer } from '@angular/platform-browser';
import { MdlVisualizarTacoComponent } from '../../modals/mdl-visualizar-taco/mdl-visualizar-taco.component.js';
import { BusquedaClienteComponent } from './busqueda-cliente/busqueda-cliente.component.js';
import { MatBottomSheet } from '@angular/material/bottom-sheet';


// pdfMake.vfs = {
//   ...pdfFonts.vfs
//   // ...pdfCustom.vfs
// };


@Component({
  selector: 'app-home',
  templateUrl: 'principaldefault.component.html',
  styleUrls: ['principaldefault.component.scss', '../../cita/cita-listado/cita-listado.component.scss']
})
export class PrincipalDefaultComponent implements OnInit, OnDestroy{

    user: User;
    fechaActual = new Date();
    horaActual: string = '00:00:00';

    resumenCantidad = {
      citasAtendidas: 0,
      citasReprogramadas: 0,
      citasCanceladas: 0,
      citasAnuladas: 0,
      citasPendientes: 0,
      citasTotales: 0,
      citasRegistradas: 0,
      porcentajeCitasRealizadas: 0,
      porcentajeCitasPendientes: 0,
      porcentajeCitasCanceladas: 0,
    };
    ultimasAtendidas : any[];

    cantidadCitasSemanal:  number = 0;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    contadorMensajeActualizacion = 0;
    contadorDatos = 0;
    tiempoActualizacionDashboard = 30;

    usuarioActual: Usuario;
    interval: any;

    frmFiltro: FormGroup;

    nivelAtencion: NivelAtencion;

    sbcNivelAtencion: Subscription;
    sbcEmisionTicket: Subscription;
    sbcValidarCajaAperturada: Subscription;
    sbcCitaDetalles: Subscription | undefined;
    sbcCitaTaco: Subscription | undefined;

    ldReportePreferente = false;
    sbcReportePreferente: Subscription;
    reportePreferente: PreferenteReporteTotal | undefined;

    numeroCliente: string = '';
    nuevoDashboard: boolean = false;

    mostrarCita: boolean = false;
    citaSelected: any

    mdlActualizarDatosUser: NgbModalRef;

    @ViewChild('busquedaIdCita') TblBusquedaIdcitaComponent!: TblBusquedaIdcitaComponent;
    @ViewChild('busquedaCliente') busquedaCliente!: BusquedaClienteComponent;

    idCitatblBusquedaCita: number = 0;
    esListadoGlobalExportar: boolean = false;
    
    // Permisos
    accTot: boolean = false;
    accExp: boolean = false;
    accExc: boolean = false;
    accExi: boolean = false;
    accImp: boolean = false;
    accAge: boolean = false;
    accAgeF: boolean = false;
    accAgeR: boolean = false;
    accCrud: boolean = false;
    accCreate: boolean = false;
    accRead: boolean = false;
    accUpdate: boolean = false;
    accDelete: boolean = false;

    // Validacion Fecha
    maxDate: string = '';


    turno: number;

    // Modals
    modalComprobanteRef: NgbModalRef;
    modalComprobanteViewRef: NgbModalRef;
    modalVisualizarTaco: NgbModalRef;
    modalListaHistorialClinicoRef: NgbModalRef;
    
    ldCitaDetalles = false;
    sede = '';

    citas: any[] = [];
    fechaParaHistoriaStr: string = '';
    botonComprobanteDeshabilitado: boolean = false;
    @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;
    @ViewChild('secondDiv') secondDiv!: ElementRef;

    constructor(
        private accountService: AccountService,
        private citaService: CitaService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private usuarioService: UsuarioService,
        private router: Router,
        private importExportDataService: ImportExportDataService,
        private parametroSistemaService: ParametroSistemaService,
        private formBuilder: FormBuilder,
        private incidenciaService: IncidenciaService,
        private reportePreferenteService: ReportePreferenteService,
        private datePipe: DatePipe,

        private permisoHelper: PermisoHelper,      
        private cajaService: CajaService,   
        private controlDeCitasService: ControlDeCitasService,
        public dialog: MatDialog,
        private modalService: NgbModal,
        private comprobanteElectronicoService: ComprobanteElectronicoService,
        private numeroALetras: NumeroALetras,
        private empresaService: EmpresaService,
        private sanitizer: DomSanitizer,

        private cdr: ChangeDetectorRef,
        private bottomSheet: MatBottomSheet,
        private route: ActivatedRoute,
    ) {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.verificarPermiso();

        if(!this.nuevoDashboard){
          this.nivelAtencion = new NivelAtencion();

          this.inicializarFormulario();
          
          this.spinner.show();
          this.user = this.accountService.userValue;
          $('[id-elemento]').hide(); //ocultar paneles
          this.mostrarDatos();
          this.interval = setInterval(() => this.iniciaProcesosInterval(), 1000);
        }
    }
    ngOnInit(): void {
      this.obtenerNivelAtencion();
      this.obtenerReportePreferente();

      this.permisoHelper.readPermiso().then((accesos) => {
        this.accTot = accesos.accTot;
        this.accExp = accesos.accExp;
        this.accExc = accesos.accExc;
        this.accExi = accesos.accExi;
        this.accImp = accesos.accImp;    
        this.accAge = accesos.accAge; 
        this.accAgeF = accesos.accAgeF; 
        this.accAgeR = accesos.accAgeR;
        this.accCrud = accesos.accCrud;
        this.accCreate = accesos.accCreate;
        this.accRead = accesos.accRead;
        this.accUpdate = accesos.accUpdate;
        this.accDelete = accesos.accDelete;
  
        this.setMaxDate();
      });  

      this.route.queryParams.subscribe(params => {
        if(params['idCitaRevisar']) {
          this.idCitatblBusquedaCita = +params['idCitaRevisar'];
          this.mostrarCitaPorIdcita(+params['idCitaRevisar'])
  
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { },
          });
        }
  
        
      }).add(() => {
        this.secondDiv.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      })
    }

    // Validacion Fecha por Permiso
    setMaxDate(): void {
      if(!this.accAgeF){
        const today = new Date();
        today.setDate(today.getDate() + 1);
        this.maxDate = today.toISOString().split('T')[0];
      }  
    }
    ngOnDestroy(): void {
      this.sbcNivelAtencion?.unsubscribe();
      this.sbcReportePreferente?.unsubscribe();
      clearInterval(this.interval);
    }

    verificarPermiso(){
      const indexPermiso = this.usuarioActual.newMenu?.findIndex(x => x.key === "home");

      this.nuevoDashboard = this.usuarioActual.newMenu[indexPermiso].state;
    }

    inicializarFormulario(): void {
      this.frmFiltro = this.formBuilder.group({
        idSede: [0]
      });
    }

    mostrarCitaPorIdcita(citaId: number){

      this.quitarCitaSeleccionada(true);
      if(this.idCitatblBusquedaCita > 0 && this.idCitatblBusquedaCita != citaId){
        //this.mostrarCita = false;
        //this.quitarCitaSeleccionada(true);
      }

      this.idCitatblBusquedaCita = citaId;
      this.mostrarCita = true;

      //this.TblBusquedaIdcitaComponent.obtenerCitaPorIdCita();
    }

    obtenerParametros(): void {
      this.parametroSistemaService.obtenerById(7).subscribe(
        resultado => {
          this.tiempoActualizacionDashboard = resultado.response.valor;
        },
        error => {
          console.log('Error al obtener los parametros', error);
        }
      );
    }
    mostrarDatos() {
      const fecha = this.utilsService.formato_FechaUniversalSQL(new Date());
      const idSede = this.frmFiltro.controls.idSede.value;
      this.citaService.obtenerDashboard(fecha, idSede, this.usuarioActual.idperfil).subscribe(
        resultado => {
          if(resultado.elementosPermitidos.length > 0) {
            this.contadorMensajeActualizacion = this.tiempoActualizacionDashboard;
            for(var i = 0 ; i < resultado.elementosPermitidos.length; i++){
              const idElemento = resultado.elementosPermitidos[i].id;
              this.mostrarPaneles(idElemento, resultado);
            }
          }
          this.spinner.hide();
          this.contadorDatos = 0;
        },
        error => {
          console.log('Error al obtener los datos del dashboard', error);
          this.spinner.hide();
        }
      );
    }
    mostrarPaneles(idElemento: number, datos: any): void {
      $('[id-elemento=' + idElemento + ']').show(); //mostrar panel

      switch(idElemento) {
        case 1: {
          this.resumenCantidad = datos.resumenCantidad;
          break;
        }
        case 2: {
          this.ultimasAtendidas = datos.ultimasAtendidas;
          break;
        }
        case 3: {
          this.mostrarGraficoSemanal(datos.citasSemanal);
          break;
        }
        case 4: {
          this.mostrarGraficoAnual(datos.citasAnual);
          break;
        }
        case 5: {
          this.mostrarGraficoZonasMasAtendidas(datos.citasZonasAtendidas);
          break;
        }
        case 6: {
          this.mostrarGraficoMensual(datos);
          break;
        }
      }
    }

    iniciaProcesosInterval() {
      // mostrar fecha y hora
      const fechaHora = new Date();
      const horas = fechaHora.getHours();
      const minutos = fechaHora.getMinutes();
      const segundos = fechaHora.getSeconds();
      this.horaActual = String.prototype.concat( (horas < 10 ? '0' + horas.toString() : horas.toString()), ':', (minutos < 10 ? '0' + minutos.toString() : minutos.toString()), ':', (segundos < 10 ? '0' + segundos.toString() : segundos.toString()));

      //mostrar mensaje actualizacion
      if(this.contadorMensajeActualizacion > 0) {
        this.contadorMensajeActualizacion = this.contadorMensajeActualizacion - 1;
      } else {
        this.contadorMensajeActualizacion = this.tiempoActualizacionDashboard;
      }

      //mostrar datos
      if(this.contadorDatos >= this.tiempoActualizacionDashboard)
        this.mostrarDatos();

      this.contadorDatos = this.contadorDatos + 1;
    }
    mostrarPerfil(idCliente: number): void {
      this.router.navigate(['ClientePerfil/' + idCliente]).then();
    }
    mostrarGraficoSemanal(datos: any): void {
        this.cantidadCitasSemanal = datos.reduce((tot, arr) => { return tot + arr.value; }, 0);
        const chartc = AmCharts.makeChart('widget-line-chart', {
            "hideCredits":true,
            'type': 'serial',
            'addClassNames': true,
            'defs': {
              'filter': [{
                'x': '-50%',
                'y': '-50%',
                'width': '200%',
                'height': '200%',
                'id': 'blur',
                'feGaussianBlur': {
                  'in': 'SourceGraphic',
                  'stdDeviation': '30'
                }
              },
                {
                  'id': 'shadow',
                  'x': '-10%',
                  'y': '-10%',
                  'width': '120%',
                  'height': '120%',
                  'feOffset': {
                    'result': 'offOut',
                    'in': 'SourceAlpha',
                    'dx': '0',
                    'dy': '20'
                  },
                  'feGaussianBlur': {
                    'result': 'blurOut',
                    'in': 'offOut',
                    'stdDeviation': '10'
                  },
                  'feColorMatrix': {
                    'result': 'blurOut',
                    'type': 'matrix',
                    'values': '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .2 0'
                  },
                  'feBlend': {
                    'in': 'SourceGraphic',
                    'in2': 'blurOut',
                    'mode': 'normal'
                  }
                }
              ]
            },
            'fontSize': 15,
            'dataProvider': datos,
            'autoMarginOffset': 0,
            'marginRight': 0,
            'categoryField': 'day',
            'categoryAxis': {
              'color': '#fff',
              'gridAlpha': 0,
              'axisAlpha': 0,
              'lineAlpha': 0,
              'offset': -20,
              'inside': true,
            },
            'valueAxes': [{
              'fontSize': 0,
              'inside': true,
              'gridAlpha': 0,
              'axisAlpha': 0,
              'lineAlpha': 0,
              'minimum': 0,
              'maximum': 100,
            }],
            'chartCursor': {
              'valueLineEnabled': false,
              'valueLineBalloonEnabled': false,
              'cursorAlpha': 0,
              'zoomable': false,
              'valueZoomable': false,
              'cursorColor': '#fff',
              'categoryBalloonColor': '#51b4e6',
              'valueLineAlpha': 0
            },
            'graphs': [{
              'id': 'g1',
              'type': 'line',
              'valueField': 'value',
              'lineColor': '#ffffff',
              'lineAlpha': 1,
              'lineThickness': 3,
              'fillAlphas': 0,
              'showBalloon': true,
              'balloon': {
                'drop': true,
                'adjustBorderColor': false,
                'color': 'blue',
                'fillAlphas': 0.2,
                'bullet': 'round',
                'bulletBorderAlpha': 1,
                'bulletSize': 5,
                'hideBulletsCount': 50,
                'lineThickness': 2,
                'useLineColorForBulletBorder': true,
                'valueField': 'value',
                'balloonText': '<span style="font-size:18px;">[[value]]</span>'
              }
            }],
          });
        // $('g:has(> g[stroke="#3cabff"])').hide();
    }
    mostrarGraficoAnual(datos: any): void {
        const chart = AmCharts.makeChart('line-area2', {
            "hideCredits":true,
            'type': 'serial',
            'theme': 'light',
            'marginTop': 10,
            'marginRight': 0,
            'dataProvider': datos,
            'valueAxes': [{
              'axisAlpha': 0,
              'position': 'left'
            }],
            'graphs': [{
              'id': 'g1',
              'balloonText': '[[category]]<br><b><span style="font-size:14px;">[[value]]</span></b>',
              'bullet': 'round',
              'lineColor': '#1de9b6',
              'lineThickness': 3,
              'title': 'CONFIRMADAS',
              'negativeLineColor': '#1de9b6',
              'valueField': 'value'
            }, {
              'id': 'g2',
              'balloonText': '[[category]]<br><b><span style="font-size:14px;">[[value]]</span></b>',
              'bullet': 'round',
              'lineColor': '#10adf5',
              'lineThickness': 3,
              'title': 'ATENDIDAS',
              'negativeLineColor': '#10adf5',
              'valueField': 'value2'
            }],
            'chartCursor': {
              'cursorAlpha': 0,
              'valueLineEnabled': true,
              'valueLineBalloonEnabled': true,
              'valueLineAlpha': 0.3,
              'fullWidth': true
            },
            'categoryField': 'year',
            'categoryAxis': {
              'minorGridAlpha': 0,
              'minorGridEnabled': true,
              'gridAlpha': 0,
              'axisAlpha': 0,
              'lineAlpha': 0
            },
            'legend': {
              'useGraphSettings': true,
              'position': 'top'
            },
          });
    }
    mostrarGraficoMensual(datos: any): void {
      $('#titulo-mes-anio').html(datos.mes + ' ' + datos.anio);
      $('#dia-inicio-termino').html('Del ' + datos.diaInicioMes  + ' al ' +datos.diaTerminoMes);

      AmCharts.makeChart('bar-chart1', {
        'type': 'serial',
        'theme': 'light',
        "hideCredits":true,
        'dataProvider':datos.citasMensual,
        'valueAxes': [{
          'gridAlpha': 0,
          'axisAlpha': 0,
          'lineAlpha': 0,
          'fontSize': 0,
        }],
        'startDuration': 1,
        'graphs': [{
          'balloonText': '<b>[[category]]: [[value]]</b>',
          'labelPosition': 'top',
          'labelText': '[[value]]',
          'fillColorsField': 'color',
          'fillAlphas': 0.9,
          'lineAlpha': 0,
          'type': 'column',
          'valueField': 'value'
        }],
        'chartCursor': {
          'categoryBalloonEnabled': false,
          'cursorAlpha': 0,
          'zoomable': false
        },
        'categoryField': 'average',
        'categoryAxis': {
          'gridPosition': 'start',
          'gridAlpha': 0,
          'axisAlpha': 0,
          'lineAlpha': 0,
        }
      });
    }
    mostrarGraficoZonasMasAtendidas(datos: any): void {
      AmCharts.makeChart('bar-chart', {
        'type': 'serial',
        'theme': 'light',
        "hideCredits":true,
        'dataProvider':datos,
        'valueAxes': [{
          'gridAlpha': 0,
          'axisAlpha': 0,
          'lineAlpha': 0,
          'fontSize': 0,
        }],
        'startDuration': 1,
        'graphs': [{
          'balloonText': '<b>[[zonaCorporal]]: [[valor]]</b>',
          'labelPosition': 'top',
          'labelText': '[[valor]]',
          'fontSize': '8',
          'fillColorsField': 'color',
          'fillAlphas': 0.9,
          'lineAlpha': 0,
          'type': 'column',
          'valueField': 'valor',
          'columnWidth': 0.2,
        }],
        'chartCursor': {
          'categoryBalloonEnabled': false,
          'cursorAlpha': 0,
          'zoomable': true
        },
        'categoryField': 'zonaCorporal',
        'categoryAxis': {
          'fontSize': '8',
          'gridPosition': 'start',
          "labelRotation": 45,
          'gridAlpha': 0,
          'axisAlpha': 0,
          'lineAlpha': 0,
        }
      });
    }

    obtenerNivelAtencion(): void{
      this.sbcNivelAtencion = this.incidenciaService.obtenerNivelAtencion().subscribe((res) => {
        this.nivelAtencion = res;
      }, error => {
        console.log(error);
      });
    }

    obtenerReportePreferente(): void{
      this.ldReportePreferente = true;
      const fecha = this.datePipe.transform(new Date(),'yyyy-MM-dd');
      this.sbcReportePreferente = this.reportePreferenteService.reporteTotal(fecha).subscribe((res: PreferenteReporteTotal) => {
        this.reportePreferente = res;
        console.log(res);
        this.ldReportePreferente = false;
      }, error => {
        console.log(error);
        this.ldReportePreferente = false;
      })
    }

  get totalPreferentes(): number{
    return this.reportePreferente ?  this.reportePreferente.totalPreferentes : 0;
    // return this.collection.map(x.)
  }

  get totalAsignados(): number{
    return this.reportePreferente ?  this.reportePreferente.totalAsignados : 0;
    // return this.collection.map(x.)
  }

  get totalAgendados(): number{
    return this.reportePreferente ?  this.reportePreferente.totalAgendados : 0;
    // return this.collection.map(x.)
  }

  get porcentajeAsignados(): number{
    return isNaN(this.totalAsignados / this.totalPreferentes ) ? 0 : (this.totalAsignados / this.totalPreferentes) * 100;
    // return this.collection.map(x.)
  }

  get porcentajeAgendados(): number{
    return isNaN(this.totalAgendados / this.totalPreferentes ) ? 0 : (this.totalAgendados / this.totalPreferentes) * 100;
    // return this.collection.map(x.)
  }

  irCita(estadoCita){
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

  citaVisualizar(){
    this.irCita(1);
  }

  citaAtender(){
    this.irCita(3);
  }

  citaEditar(){
    this.irCita(2);
  }

  verCita(event: any){
    this.citaSelected = event;
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

  citaComprobante(model: NgbModalRef): void {
    // if( !$('[cita-id].selected').length) {
    //   this.utilsService.mostrarToast('Seleccione una cita para emitir comprobante.', 'info');
    //   return;
    // }
    this.botonComprobanteDeshabilitado = true;
    //Evaluar si el usuario y la cita son de la misma sede
    const idSedeUsuario = this.usuarioActual.idSede;
    // this.idCita = parseInt($('[cita-id].selected').attr('cita-id'), 10);
    // const citaSeleccionada = this.citas.find(x => x.idCita == this.idCita);

    if(idSedeUsuario != this.citaSelected.idSede){
      
      this.utilsService.mostrarToast('No se puede generar el ticket de una cita con otra sede', 'warning');
      this.botonComprobanteDeshabilitado = false;
      return;
    }
    if(this.citaSelected.pagado) {
      this.utilsService.mostrarToast('Cita ya tiene comprobante (ticket)', 'warning');
      this.botonComprobanteDeshabilitado = false;
      return;
    }

    //Evaluar si la caja esta aperturada antes de iniciar
    this.sbcValidarCajaAperturada = this.cajaService.consultarAperturaCaja(this.usuarioActual.idSede).subscribe(
      resultado => {
        if(!resultado.cajaPermitida) {
          this.utilsService.mostrarToast(resultado.mensaje, 'warning');
          this.router.navigate(['Caja']).then(() => { });
        } else {
          this.turno = resultado.turno;
          this.modalComprobante(model);
          this.botonComprobanteDeshabilitado = false;
        }
      },
      error => {
        this.botonComprobanteDeshabilitado = false;
        console.error(error);
      }
    );
  }

  modalComprobante(modal: NgbModalRef): void {
    this.modalComprobanteRef = this.utilsService.abrirModal(modal, 'lg');
  }

  actualizarPago(idCita: number, monto: any, esTicket: boolean = false){
    this.controlDeCitasService
      .updatePayment(idCita, monto, this.usuarioActual.idUsuario)
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
          this.busquedaCliente.cambiarEstadoPagoFinal(idCita, monto);
        });

      })
  }

  openModalConfirm(event: any, esTicket: boolean = false): void {
    if(event.pagoFinal){
      this.busquedaCliente.cambiarTipoComprobanteCita(this.citaSelected.idCita, event.idTipoComprobante);
      this.actualizarPago(this.citaSelected.idCita, event.pagoFinal);
      return;
    }

    setTimeout(() => {
      const citaSeleccionada = this.citaSelected;
          const sendData = {
            idCita: citaSeleccionada.idCita,
            paciente: citaSeleccionada.paciente,
            montoInicial: event.montoFinal,
          };
      
          const dialogRef = this.dialog.open(DialogContentExampleDialog, {
            width: '430px',
            disableClose: true,
            autoFocus: true,
            restoreFocus: false,
            data: {
              cita: sendData,
              montoFinal: 0,
              paciente: citaSeleccionada.paciente,
            },
            panelClass: 'custom-dialog-container',
          });

          dialogRef.afterClosed().subscribe(async (result) => {
            this.busquedaCliente.cambiarTipoComprobanteCita(this.citaSelected.idCita, event.idTipoComprobante);
            if (result !== undefined && result >= 0) {
                this.actualizarPago(citaSeleccionada.idCita, result, esTicket);
              }

            });
      
    }, 500);
  }

  cambiarTipoComprobante(){
    this.busquedaCliente.cambiarTipoComprobanteCita(this.citaSelected.idCita, 2);
  }

  citaComprobante2(model: NgbModalRef): void {
    if (!this.citaSelected) {
      this.utilsService.mostrarToast('Seleccione una cita para emitir comprobante.', 'info');
      return;
    }
    if(this.usuarioService.UsuarioActual.idSede !== this.citaSelected.idSede){
      // 
      this.utilsService.mostrarToast('No se puede generar el ticket de una cita con otra sede', 'warning');
      return;
    }

    //Evaluar si la caja esta aperturada antes de iniciar
    this.sbcValidarCajaAperturada = this.cajaService.consultarAperturaCaja(this.usuarioActual.idSede).subscribe(
      resultado => {
        if(!resultado.cajaPermitida) {
          this.utilsService.mostrarToast(resultado.mensaje, 'warning');
          this.router.navigate(['Caja']).then(() => { });
        } else {
          // if(this.modalComprobanteRef.){ return }
          this.turno = resultado.turno;
          this.modalComprobanteRef = this.modalService.open(MdlEmisionComprobanteComponent, {
            // size: 'xl mw-100 mx-md-4',
            size: 'lg w-100 max-w-1200px',
            backdrop: "static",
            windowClass: 'smodal fade round popins bg-dark-30',
            keyboard: false,
            backdropClass: 'bg-transparent',
            animation: true,
            scrollable: false
          });
          this.modalComprobanteRef.componentInstance.IdCita = this.citaSelected.idCita;
          this.modalComprobanteRef.componentInstance.IdSede = this.citaSelected.idSede;
          this.modalComprobanteRef.componentInstance.IdServicio = this.citaSelected.idServicio;
          this.modalComprobanteRef.componentInstance.Turno = this.turno;
          this.modalComprobanteRef.componentInstance.OnCreated.subscribe(async (res: ComprobanteElectronicoDatos) => {


            if(res.idSiguienteCita){
              window.open(`Cita/${res.idSiguienteCita}/${2}/${res.idCliente}/0`);
            }

            if(res.idTipoComprobante === EnumTipoComprobante.TICKET){
              const documentDefinition = this.comprobanteElectronicoService.dibujarTicket(this.datePipe, res, this.numeroALetras);
              const pdf = pdfMake.createPdf(documentDefinition);

              pdf.getDataUrl(async (dataURL: any) => {
                const pdfstr = await fetch(dataURL);
                const blobFromFetch = await pdfstr.blob();
                const blob = new Blob([blobFromFetch], {type: "application/pdf"});
                const blobUrl = URL.createObjectURL(blob);

                this.modalComprobanteViewRef = this.modalService.open(MdlPdfGoogleViewComponent, {
                  // size: 'xl mw-100 mx-md-4',
                  size: 'lg w-100 max-w-900px',
                  backdrop: "static",
                  windowClass: 'smodal fade round popins bg-dark-30',
                  keyboard: false,
                  backdropClass: 'bg-transparent',
                  animation: true,
                  scrollable: true
                });
                this.modalComprobanteViewRef.componentInstance.Url = blobUrl;

              });


            }else{

              const pdfstr = await fetch(`data:application/pdf;base64,${res.boletaPdfBase64}`);
              const blobFromFetch= await pdfstr.blob();
              const blob = new Blob([blobFromFetch], {type: "application/pdf"});
              const blobUrl = URL.createObjectURL(blob);

              this.modalComprobanteViewRef = this.modalService.open(MdlPdfGoogleViewComponent, {
                // size: 'xl mw-100 mx-md-4',
                size: 'lg w-100 max-w-900px',
                backdrop: "static",
                windowClass: 'smodal fade round popins bg-dark-30',
                keyboard: false,
                backdropClass: 'bg-transparent',
                animation: true,
                scrollable: true
              });
              this.modalComprobanteViewRef.componentInstance.Url = blobUrl;
            }

            this.modalComprobanteRef.close();
            // this.obtenerCitas();
            this.cambiarTipoComprobante()
          });
        }
      },
      error => {
        this.utilsService.mostrarToast('No se puede evaluar el estado de la caja', 'warning');
        
      }
    );
  }


  imprimirTicket(esMovil: boolean = false) {
    // if( !$('[cita-id].selected').length) {
    //   this.utilsService.mostrarToast('Seleccione una cita para imprimir ticket.', 'info');
    //   return;
    // }

    if(!this.citaSelected) {
      this.utilsService.mostrarToast('Seleccione una cita para imprimir ticket.', 'info');
      return;
    }
    
    this.sbcEmisionTicket = this.empresaService.obtenerEmpresaEmisionTicket(this.citaSelected.idCita).subscribe(
      async (resultado: any) => {
        if(resultado.idTipoComprobante === EnumTipoComprobante.TICKET){

          const documentDefinition = this.getTicketEstructura(resultado);
          const pdf = pdfMake.createPdf(documentDefinition);

          // const documentDefinition = this.getTicketEstructura(resultado);
          // const pdf = pdfMake.createPdf(documentDefinition);
          pdf.getDataUrl(async (dataURL: any) => {
            const pdfstr = await fetch(dataURL);
            const blobFromFetch = await pdfstr.blob();
            const blob = new Blob([blobFromFetch], {type: "application/pdf"});
            const blobUrl = URL.createObjectURL(blob);

            this.modalComprobanteViewRef = this.modalService.open(MdlPdfGoogleViewComponent, {
              // size: 'xl mw-100 mx-md-4',
              size: 'lg w-100 max-w-900px',
              backdrop: "static",
              windowClass: 'smodal fade round popins bg-dark-30 pt-superior',
              keyboard: false,
              backdropClass: 'bg-transparent',
              animation: true,
              scrollable: true
            });

            this.modalComprobanteViewRef.componentInstance.Url = blobUrl;
            
            if(esMovil === true){
              this.modalComprobanteViewRef.componentInstance.urlVisualizar = dataURL;
              this.modalComprobanteViewRef.componentInstance.mostrarPdfViewer = true;

              pdf.download(`Ticket-${this.citaSelected.idCita}.pdf`);
            }

            this.modalComprobanteViewRef.componentInstance.eventImprimirMobile.subscribe((data: any) => {
              pdf.open();
            });

          });




        }else{
          const pdfstr = await fetch(`data:application/pdf;base64,${resultado.boletaPdfBase64}`);
          const blobFromFetch= await pdfstr.blob();
          const blob = new Blob([blobFromFetch], {type: "application/pdf"});
          const blobUrl = URL.createObjectURL(blob);

          this.modalComprobanteViewRef = this.modalService.open(MdlPdfGoogleViewComponent, {
            // size: 'xl mw-100 mx-md-4',
            size: 'lg w-100 max-w-900px',
            backdrop: "static",
            windowClass: 'smodal fade round popins bg-dark-30',
            keyboard: false,
            backdropClass: 'bg-transparent',
            animation: true,
            scrollable: true
          });
          this.modalComprobanteViewRef.componentInstance.Url = blobUrl;
        }
      },
      error => {
        console.error(error)
      }
    );
  }

  getTicketEstructura(datosEmpresa): any {
    const lineaSeparacion = '------------------------------------------------------------------------------------------';
    const estructura: any = {
      content: [
        [
          this.getProfilePicObject()
        ],
        { text: datosEmpresa.razonSocial,       bold: true,   fontSize: 10,     margin: [0, 5, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: 'R.U.C. ' + datosEmpresa.ruc,   bold: true,   fontSize: 10,     margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: datosEmpresa.descripcion,       bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: datosEmpresa.direccionBySede,   bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: datosEmpresa.telefonos,         bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: 'TICKET DE VENTA',                          bold: true,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name',  decoration: 'underline' },
        { text: datosEmpresa.serieNumeroComprobante,           bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        {
          widths: [100, 50],
          columns :
          [
                { text: 'Fecha emisión:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
                { text: this.utilsService.formato_FechaFullString(new Date(), '-', ':'),  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        {
          widths: [100, 50],
          columns :
          [
                { text: 'Sede:',       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'left' },
                { text: datosEmpresa.sede, fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { columns :
          [
                { text: 'Emitido por:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
                { text: this.usuarioActual.login,       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { columns :
          [
                { text: 'Documento:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
                { text: datosEmpresa.documento,    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
          ]
        },
        { columns :
          [
                { text: 'Cliente:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
                { text: datosEmpresa.cliente,    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
          ]
        },
        { text: lineaSeparacion, bold: false,  fontSize: 8, margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [60, 10, 50, 55],
            body: [
              [
                  {text: 'DESCRIPCIÓN', style: 'tableHeader', alignment: 'left'},
                  {text: 'SS',          style: 'tableHeader', alignment: 'right'},
                  {text: 'P.U.',        style: 'tableHeader', alignment: 'right'},
                  {text: 'IMPORTE',     style: 'tableHeader', alignment: 'right'}
              ],
              // Mostrar las zonas dinamicamente
            ]
          },
          layout: 'noBorders',
        },
        { text: lineaSeparacion, bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        {
          columns:
          [
            { text: 'SubTotal:',   fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'left'  },
            { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
            { text: datosEmpresa.total.toFixed(2).toString(), fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' }
          ]
        },
        {
          columns:
          [
            { text: 'Adelantos:', fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'left'  },
            { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
            { text: '0.00',    fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' }
          ]
        },
        {
          columns:
          [
            { text: 'Concepto Total:',  fontSize: 8,  bold: false, margin: [0, 2, 0, 0],  alignment: 'left'  },
            { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
            { text: datosEmpresa.total.toFixed(2).toString(), fontSize: 8,  bold: false, margin: [0, 2, 0, 0],  alignment: 'right' }
          ]
        },
        {
          columns:
          [
            { text: 'Saldo Deudor:',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],  alignment: 'left' },
            { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
            { text: '0.00',        fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right'}
          ]
        },
        {
          columns: [
            { text: 'Vuelto:',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],   alignment: 'left'  },
            { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
            { text: datosEmpresa.vuelto.toFixed(2),  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],   alignment: 'right' }
          ]
        },
        {
          columns:
          [
            { text: 'SON: ' + this.numeroALetras.NumeroALetras(datosEmpresa.total) , fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],alignment: 'left' }
          ]
        },
        {
          columns:
          [
            { text: 'Modalidad: Efectivo',  fontSize: 8, bold: false, margin: [0, 2, 0, 0], alignment: 'left' }
          ]
        },
        {
          columns:
          [
            { text: 'Representación impresa de comprobante', fontSize: 5, bold: false, margin: [0, 2, 0, 0], alignment: 'center' }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 8,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 0, 0, 0]
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black',
          margin: [0, 0, 0, 0]
        },
        tableBody: {
          fontSize: 8,
          color: 'black',
          margin: [0, 0, 0, 0]
        },
        name: {
          fontSize: 8,
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 10],
        }
      },
      defaultStyle: {
        // font: 'Arial'
      },
      pageMargins: [5,5,5,0],
      font: 'Arial',
      pageSize: { height: 595,  width: 210  }
    }

    for(var i = 0; i < datosEmpresa.detalle.length; i++){
      const zona = datosEmpresa.detalle[i].zonaCorporal;
      const sesion = datosEmpresa.detalle[i].sesion;
      const precio = datosEmpresa.detalle[i].precio;
      const importe = precio;
      estructura.content[15].table.body.push(
        [ { text: zona, style: 'tableBody' }, {text: sesion, alignment: 'right', style: 'tableBody'}, {text: precio.toFixed(2).toString(),  alignment: 'right', style: 'tableBody'}, {text: importe.toFixed(2).toString(), alignment:  'right', style: 'tableBody'}]
      );
    }
    return estructura;
  }

  getProfilePicObject() {
    return {
      image:"data:image/png;base64,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",
      width: 100,
      /* alignment : 'center' */
      margin: [50,0,0,0],
      alignment : 'left'
    };
  }

  async imprimirResumen(esMovil: boolean = false) {
    this.sbcCitaDetalles?.unsubscribe();
    this.ldCitaDetalles = true;

    this.sbcCitaTaco = this.citaService.obtenerTaco(this.citaSelected.idCita, this.usuarioActual.idUsuario).subscribe(async (res: any) => {


      let aplyCuppon = null; //* descuento(res.data.detalle)
      let code1 = (!!res.data.telefonos) ? res.data.telefonos : res.data.clienteDocumento;
      let codigo_barra = `${code1} - ${res.data.idCita}`;

      const canvas = await document.createElement('canvas');
      await JsBarcode(canvas, codigo_barra, {
        format: 'CODE128',
        width: 2,
        height: 40,
        displayValue: true,
      });
      const barcodeBase64 = await canvas.toDataURL('image/png');
      let valeCupon = {};

      if (aplyCuppon === null) {
        valeCupon = {
          barcodeBase64,
        };
        res.data['valeCupon'] = valeCupon;
      } else if (aplyCuppon > 0) {
        valeCupon = {
          cliente_documento: res.data.clienteDocumento,
          cliente_nombre: res.data.cliente,
          fecha_compra: res.data.fechaHora,
          total: res.data.detalle.reduce((acc, item) => acc + item.precio, 0),
          descuento: aplyCuppon,
          codigo_barra,
          notas: [
            {
              texto:
                'Cupón de descuento válido para depilación zona no especificada. No acumulable con otras promociones.',
            },
          ],
          fecha_termino: '31/12/2024',
        };

        res.data['valeCupon'] = valeCupon;
        res.data['valeCupon']['barcodeBase64'] = barcodeBase64;
      }
      res.data['servicio'] = this.citaSelected.idServicio;

      const ptl = await plantilla(res.data, this.datePipe, aplyCuppon);
      
      const pdf = pdfMake.createPdf(ptl);
      pdf.getDataUrl(async (dataURL: any) => {
        const safeBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(dataURL);

        const pdfstr = await fetch(dataURL);
        const blobFromFetch= await pdfstr.blob();
        const blob = new Blob([blobFromFetch], {type: "application/pdf"});
        const blobUrl = URL.createObjectURL(blob);

        const pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

        this.modalVisualizarTaco = this.modalService.open(MdlVisualizarTacoComponent, {size: 'md', backdrop: "static", windowClass: 'smodal fade round popins bg-dark-30 fondo-anterior pt-superior', keyboard: false, backdropClass: 'bg-transparent fondo-anterior', animation: true});
        this.modalVisualizarTaco.componentInstance.urlData = pdfSource;
        this.modalVisualizarTaco.componentInstance.IdCita = this.citaSelected.idCita;
        this.modalVisualizarTaco.componentInstance.IdUsuario = this.usuarioActual.idUsuario;
        this.modalVisualizarTaco.componentInstance.total = this.citaSelected.total;
        this.modalVisualizarTaco.componentInstance.citaEstado = this.citaSelected.estado;
        this.modalVisualizarTaco.componentInstance.idPerfil = this.usuarioActual.idperfil;

        if(esMovil === true){
          this.modalVisualizarTaco.componentInstance.urlVisualizar = dataURL;
          this.modalVisualizarTaco.componentInstance.mostrarPdfViewer = true;
          pdf.download(`Taco-${res.data.idCita}.pdf`);
        }
        // pdf.print();
        this.modalVisualizarTaco.componentInstance.eventImprimirMobile.subscribe((data: any) => {
          pdf.open();
        });

        this.modalVisualizarTaco.componentInstance.eventCitaListarPago.subscribe((data: any) => {
          this.openModalConfirm(data);
        });

      });

    }, (error: any) => {
      
      this.utilsService.mostrarToast('Ocurrio un error al obtener el taco de cita', 'error');
    });
  }

  modalHistorialClinico(modal: NgbModalRef): void{
    this.modalListaHistorialClinicoRef = this.utilsService.abrirModal(modal, 'lg');
  }

  verCronograma(): void{
    const url = this.router.createUrlTree(['Corporal360/Cronograma',this.citaSelected.idCronograma,AccionCronograma.ASIGNARCITAS, this.citaSelected.idCliente, this.citaSelected.idPreferente, 0, 0]);
    window.open(url.toString(), '_blank');
  }

  quitarCitaSeleccionada(event: any){
    if(event === true){
      this.citaSelected = null;
      this.mostrarCita = false;
      this.esListadoGlobalExportar = false;
      this.cdr.detectChanges();
    }
  }

  quitarCitaSeleccionadaGlobal(event: any){
    if(event === true){
      this.citaSelected = null;
      this.cdr.detectChanges();
    }
  }

  ocultarTablaGlobal(event: any){
    this.busquedaCliente.limpiarTodo();
  }

  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }

  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }

  citasParaHistoria(event: any): void{
    this.citas = event;
  }

  fechaParaHistoria(event: any): void{
    this.fechaParaHistoriaStr = event;
  }

  exportar(){
    this.busquedaCliente.obtenerCitasParaExportar();
  }

  exportarInfo(){
    this.busquedaCliente.exportarInfo();
  }

  esListadoGlobalExportarF(event: any): void{
    this.esListadoGlobalExportar = event;
  }


  actualizarDatosUser(modal: any): void{
    this.mdlActualizarDatosUser = this.utilsService.abrirModal(modal, 'lg');
    this.mdlActualizarDatosUser.result.then(result => console.log(result));
  }

}
