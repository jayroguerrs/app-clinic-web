import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { MaestroPreferente, Preferente } from '../preferente.models';
import { DataTableDirective } from 'angular-datatables';
import { SignalRService } from 'src/app/shared/services/signal-r.service';
import { EstadoService } from '../../../shared/services/estado.service';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { PreferenteService } from 'src/app/shared/services/preferente.service';
import { MedioContactoService } from '../../../shared/services/medio-contacto.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { UbicacionService } from 'src/app/shared/services/ubicacion.service';
import { ZonaCorporalService } from '../../../shared/services/zona-corporal.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MensajeSignalR } from '../../../shared/services/signal-r.service';
import { GlobalConstants } from 'src/commons/global-constants';
import { PreferenteAtencionComponent } from '../preferente-atencion/preferente-atencion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoMensajeSignalR, TipoPerfil } from '../../../shared/enumeracion/enums';
import { Subscription } from 'rxjs';
import { MatBottomSheet } from "@angular/material/bottom-sheet";

declare var $;

import * as XLSX from 'xlsx';
import { AuthService } from "../../../shared/services/auth.service";
import { MdlPreferenteHistorial2Component } from "../../modals/mdl-preferente-historial2/mdl-preferente-historial2.component";
import { MdlBuscarPreferenteComponent } from "../../modals/mdl-buscar-preferente/mdl-buscar-preferente.component";
import { MdlDateRangeFilterComponent } from "../../modals/mdl-date-range-filter/mdl-date-range-filter.component";
import * as Excel from 'exceljs';
import * as fs from 'file-saver';
import { PermisoHelper } from '../../../shared/helpers/permisos.helper';
import { Router, ActivatedRoute  } from '@angular/router';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { MdlClienteAplicativoSettingsModalComponent } from '../../modals/mdl-cliente-aplicativo-settings-modal/mdl-cliente-aplicativo-settings-modal.component';

@Component({
  selector: 'app-preferente-listado',
  templateUrl: './preferente-listado.component.html',
  styleUrls: ['./preferente-listado.component.scss'],
  providers: [DatePipe, SignalRService]
})
export class PreferenteListadoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(PreferenteAtencionComponent, { static: false }) preferenteAtencionComponent: PreferenteAtencionComponent;

  tipoPerfil = TipoPerfil;

  listaMaestra = new MaestroPreferente();
  zonaCorporalDetalle: any = [];
  numeroDetalle: any = [];
  listaTeleoperadorConfirmado: any = [];

  dtpFechaDesde = '';
  dtpFechaHasta = '';
  cboUsuario = '0';
  cboMedioContacto = '0';

  frmFiltroGrilla: FormGroup;
  idPerfil: TipoPerfil;
  mostrarFiltro = true;
  usuarioActual: Usuario;
  idPreferente: number;
  datosPreferente: any[];
  datosMobilePreferente: any[];

  mostrarBtnAtender: boolean = false;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // modales
  modalPreferenteDatosRef: NgbModalRef;
  modalPreferenteAsignarRef: NgbModalRef;
  modalPreferenteAtencionRef: NgbModalRef;
  modalAsignacionRef: NgbModalRef;

  // datatable
  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;
  dataTable: any;
  optionsDtPreferentes = {};
  selected = 0;
  preferenteSelected: Preferente | null = null;

  // subscripciones
  sbcCollection: Subscription;
  sbcActualizarEstadoVisto: Subscription;
  sbcGSignal: Subscription;
  sbcCollectionEstados: Subscription;
  sbcCollectionEstadosAtencion: Subscription;
  sbcGSignalResponderEscaneo: Subscription;
  sbcCollectionTeleoperador: Subscription;
  sbcCollectionMedioContacto: Subscription;
  sbcCollectionZonasCorporales: Subscription;
  sbcCollectionDepartamentos: Subscription;
  sbcTotalAsignados: Subscription


  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;
  @ViewChild('modPrefDatos') modalEditarPref: any; 

  fechaDesde = '';
  fechaHasta = '';

  modalRef: NgbModalRef | undefined;

  preferentes: any[] = [];
  preferentesReporte: any[] = [];
  errorMessage: string = '';
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accImp: boolean = false;
  accLstI: boolean = false;
  accLstG: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;
  accExv: boolean = false;
  constructor(
    private medioContactoService: MedioContactoService,
    private preferenteService: PreferenteService,
    private usuarioService: UsuarioService,
    private zonaCorporalService: ZonaCorporalService,
    private ubicacionService: UbicacionService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private estadoService: EstadoService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private authService: AuthService,
    private modalService: NgbModal,
    private permisoHelper: PermisoHelper,
    private router: Router,
    private auditoriaService: AuditoriaService,
    private route: ActivatedRoute
  ) {

  }
  dateRangeValidator(): boolean {
    const fechaDesde = this.fechaDesde;
    const fechaHasta = this.fechaHasta;
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      this.utilsService.mostrarToast('La fecha "Desde" no puede ser mayor que la fecha "Hasta".', 'error');
      return false;
    }
    return true;
  }
  exportClientData(): void {
    if (!this.dateRangeValidator()) {
      return;
    }
    this.preferenteService.exportarPreferenteVentas(this.usuarioActual.idUsuario, this.frmFiltroGrilla.controls.filterDesde.value , this.frmFiltroGrilla.controls.filterHasta.value).subscribe(
      data => {        
        if (data && data.data.length > 0) {
          this.preferentes = data.data;
          this.createExcelFile().then((blob) => {
            const fileName = `Reporte de ventas de ${this.frmFiltroGrilla.controls.filterDesde.value} al ${this.frmFiltroGrilla.controls.filterHasta.value}.xlsx`;
            fs.saveAs(blob, fileName);
            this.utilsService.mostrarToast('Se descargó correctamente', 'success');
          });
        } else {
          this.utilsService.mostrarToast('No hay datos disponibles para el rango de fechas especificado.', 'warning');
        }
      },
      error => {
        this.utilsService.mostrarToast('Ocurrió un error al intentar descargar los datos. Por favor, inténtalo nuevamente.', 'error');
        this.errorMessage = error.message;
      }
    );
  }

  exportarTabla(): void {    
    if (!this.dateRangeValidator()) {
      return;
    }

    this.preferenteService.exportarReportePreferente(this.filtros).subscribe(
      data => {                             
        if (data && data.length > 0) {
          this.preferentesReporte = data;
          this.createExcelFileReport().then((blob) => {
            const fileName = `Reporte de Preferentes de ${this.frmFiltroGrilla.controls.filterDesde.value} al ${this.frmFiltroGrilla.controls.filterHasta.value}.xlsx`;
            fs.saveAs(blob, fileName);
            this.utilsService.mostrarToast('Se descargó correctamente', 'success');
          });
        } else {
          this.utilsService.mostrarToast('No hay datos disponibles para el rango de fechas especificado.', 'warning');
        }
      },
      error => {
        this.utilsService.mostrarToast('Ocurrió un error al intentar descargar los datos. Por favor, inténtalo nuevamente.', 'error');
        this.errorMessage = error.message;
      }
    );
  }

  private async createExcelFile(): Promise<Blob> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('DataSheet');

    const header = [
      "PREFERENTE", "ESTADO", "FICHA CLIENTE", "ATENCION", "VENTA", "CELULAR",
      "ZONA", "TELEOPERADORA", "CORREO", "CONTACTO", "DISTRITO",
      "OBSERVACION", "COMENTARIO", "USU. FACEBOOK", "USU. INSTAGRAM",
      "UTM FUENTE", "UTM MEDIO", "UTM CAMPAÑA", "UTM ID", "UTM TERM", "UTM CONT", 
      "FEC. INGR.", "HORA INGR.", "U. REG", "FEC. ASIG.", "FEC. AGENDO.",
      "MES", "EJECUTIVO", "SUPERVISOR", "CITAS"
    ];

    this.addDateRange(worksheet, 'A1:AD1');
    this.addHeader(worksheet, header);
    this.addData(worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private async createExcelFileReport(): Promise<Blob> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('DataSheet');

    const header = [
      "ID", "NOMBRES", "TELEOPERADOR", "DATOS TELEOPERADOR", "FECHA REGISTRO", "FECHA ASIGNACION",
      "COMENTARIO", "ID ESTADO", "ESTADO ATENCIÓN", "ESTADO TIPO ATENCIÓN", "PROMOCIÓN",
      "FECHA CITA", "CELULAR", "EMAIL", "DISTRITO",
      "ZONA CORPORAL", "MEDIO CONTACTO", "USUARIO FACEBOOK", "USUARIO INSTAGRAM", "ES CLIENTE",
      "ID CLIENTE", "UTM SOURCE", "UTM MEDIUM", "UTM CAMPAÑA", "UTM ID",
      "UTM TERM","UTM CONT", "OBSERVACION", "USUARIO REG", "AGENDO"
    ];

    this.addDateRange(worksheet, 'A1:AD1');
    this.addHeader(worksheet, header);
    this.addDataReporte(worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private addDateRange(worksheet: Excel.Worksheet, CellMerge: string): void {
    const fechaRange = `Fecha Desde: ${this.fechaDesde} - Fecha Hasta: ${this.fechaHasta}`;
    worksheet.mergeCells(CellMerge);
    const startCell = worksheet.getCell('A1');
    startCell.value = fechaRange;
    startCell.font = { bold: true };
    startCell.alignment = { horizontal: 'center' };
  }

  private addHeader(worksheet: Excel.Worksheet, headers: string[]): void {
    // Agrega las cabeceras
    const headerRow = worksheet.addRow(headers);
    // Aplica negrita a las cabeceras
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { ...cell.font, bold: true };
    });
  }

  private addData(worksheet: Excel.Worksheet): void {
    this.preferentes.forEach(preferente => {
      const row = [
        preferente.preferente || '', preferente.estado || '', preferente.cliente || '', preferente.atencion || '',
        preferente.venta || '', preferente.celular || '', preferente.zona || '', preferente.teleoperadora || '',
        preferente.correo || '', preferente.contacto || '', preferente.distrito || '', preferente.observacion || '',
        preferente.comentario || '', preferente.usuFacebook || '', preferente.usuInstagram || '', preferente.utmFuente || '',
        preferente.utmMedio || '', preferente.utmCampaña || '', preferente.utmId || '', preferente.utmTerm || '', preferente.utmCont || '',
        preferente.fechaIngreso || '', preferente.horaIngreso || '', preferente.uReg || '', preferente.fechaAsignacion || '',
        preferente.fechaAgendado || '', preferente.mes || '', preferente.ejecutivo || '', preferente.supervisor || '', preferente.citas || ''
      ];
      worksheet.addRow(row);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber === 1) return;
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength < 10 ? 10 : maxLength + 3;
    });
  }

  private addDataReporte(worksheet: Excel.Worksheet): void {
    this.preferentesReporte.forEach(preferente => {
      const row = [
        preferente.id || '', preferente.nombres || '', preferente.teleoperadora || '', preferente.nombreTeleoperador || '',
        preferente.fechaRegistra || '', preferente.fechaAsignacion || '', preferente.comentario || '', preferente.idEstado || '',
        preferente.estadoAtencion || '', preferente.estadoTipoAtencion || '', preferente.promocion || '', preferente.fechaCita || '',
        preferente.celular || '', preferente.email || '', preferente.distrito || '', preferente.zonaCorporal || '',
        preferente.medioContacto || '', preferente.usuFacebook || '', preferente.usuInstagram || '', preferente.esCliente || '',
        preferente.idCliente || '', preferente.utmSource || '', preferente.utmMedium || '', preferente.utmCampaign || '',
        preferente.utmId || '', preferente.utmTerm || '', preferente.utmCont || '', preferente.observacion || '', preferente.usuarioRegistro || '', preferente.agendo || ''
      ];
      worksheet.addRow(row);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber === 1) return;
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength < 10 ? 10 : maxLength + 3;
    });
  }

  // exportClientData(): void {
  //   this.modalService.open(MdlDateRangeFilterComponent)
  //  }
  ngOnInit(): void {    
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.sbcGSignal = GlobalConstants.gSignalService.signalReceived.subscribe((trama: MensajeSignalR) => {
      this.procesarMensajeSignalR(trama);
      // console.log(trama);
    });

    const fechaHoy = new Date();
    this.dtpFechaDesde = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd');
    this.dtpFechaHasta = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd');

    this.fechaDesde = this.dtpFechaDesde;
    this.fechaHasta = this.dtpFechaHasta;

    this.inicializarFormulario();
    this.teleoperadorListar();
    this.medioContactoListar();
    this.zonasCorporalesListar();
    this.departamentoListar();
    this.estadoListar();
    this.estadoAtencionListar();
    this.buildtable(this.idPerfil);

    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accImp = accesos.accImp;
      this.accLstI = accesos.accLstI;
      this.accLstG = accesos.accLstG;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;

      this.mostrarBtnAtender = false;
      this.idPerfil = this.usuarioActual.idperfil;
      if (this.idPerfil === TipoPerfil.OPERADOR || this.idPerfil == TipoPerfil.ESPECIALISTA) {
        this.mostrarFiltro = true;
        this.mostrarBtnAtender = true;
      }
      else{
        if (this.accTot === true) {
          this.mostrarBtnAtender = true;
        }
      }
    });


  }

  abrirModalCcvox(){
    this.route.queryParams.subscribe(params => {
      const idPreferente = params['id_preferente']; 
      
      if (idPreferente) {
        this.idPreferente = parseInt(idPreferente);
        this.prefEditar(this.modalEditarPref);

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Destroy modal
    if (this.modalPreferenteAsignarRef) { this.modalPreferenteAsignarRef.close(); }
    if (this.modalPreferenteAtencionRef) { this.modalPreferenteAtencionRef.close(); }
    if (this.modalPreferenteDatosRef) { this.modalPreferenteDatosRef.close(); }
    // Destroy subscription
    if (this.sbcCollection) { this.sbcCollection.unsubscribe(); }
    if (this.sbcActualizarEstadoVisto) { this.sbcActualizarEstadoVisto.unsubscribe(); }
    if (this.sbcGSignal) { this.sbcGSignal.unsubscribe(); }
    if (this.sbcGSignalResponderEscaneo) { this.sbcGSignalResponderEscaneo.unsubscribe(); }
    if (this.sbcCollectionEstados) { this.sbcCollectionEstados.unsubscribe(); }
    if (this.sbcCollectionEstadosAtencion) { this.sbcCollectionEstadosAtencion.unsubscribe(); }
    if (this.sbcCollectionTeleoperador) { this.sbcCollectionTeleoperador.unsubscribe(); }
    if (this.sbcCollectionMedioContacto) { this.sbcCollectionMedioContacto.unsubscribe(); }
    if (this.sbcCollectionZonasCorporales) { this.sbcCollectionZonasCorporales.unsubscribe(); }
    if (this.sbcCollectionDepartamentos) { this.sbcCollectionDepartamentos.unsubscribe(); }
    // Destroy bottom sheet
    if (this.bottomSheet) { this.bottomSheet.ngOnDestroy(); }
    // Destroy datatable
    if (this.dataTable) { this.dataTable.destroy(true); }
    this.sbcTotalAsignados?.unsubscribe();


    this.modalPreferenteDatosRef?.close();
    this.modalPreferenteAsignarRef?.close();
    this.modalPreferenteAtencionRef?.close();
    this.modalAsignacionRef?.close();

    this.spinner.hide();
  }

  ngAfterViewInit(): void {

    const _this = this;
    const usuarioTemp = this.usuarioActual;    
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
          const data = dtInstance.rows('.selected').data()[0];
          _this.idPreferente = data.id;
          _this.preferenteSelected = data;

          if (usuarioTemp.idperfil == TipoPerfil.MARKETING || usuarioTemp.idperfil == TipoPerfil.SUPERVISOR) {
            if (data.idEstado == 1) {
              //$('#btnEditar1, #btnEditar2, #btnAsignar1, #btnAsignar2').show();
            }
          }
          if (usuarioTemp.idperfil == TipoPerfil.OPERADOR || usuarioTemp.idperfil == TipoPerfil.ESPECIALISTA) {
            $('#btnAtender1, #btnAtender2').show();
          }
          _this.verOpciones();
        }
        _this.selected = dtInstance.rows({ selected: true }).count();
      });

      dtInstance.on('deselect', function (e, dt, type, indexes) {
        _this.idPreferente = 0;
        _this.preferenteSelected = null;
        if (usuarioTemp.idperfil == TipoPerfil.MARKETING || usuarioTemp.idperfil == TipoPerfil.SUPERVISOR) {
          $(' #btnEditar2').hide();
        }
        if (usuarioTemp.idperfil == TipoPerfil.OPERADOR || usuarioTemp.idperfil == TipoPerfil.ESPECIALISTA) {
          $('#btnAtender1, #btnAtender2').hide();
        }
        _this.selected = dtInstance.rows({ selected: true }).count();
      });
    });


    this.abrirModalCcvox();
  }


  inicializarFormulario(): void {

    this.frmFiltroGrilla = this.formBuilder.group({
      filterDesde: [''],
      filterHasta: [''],
      filterEstado: [''],
      filterEstadoAtencion: [''],
      filterTeleoperador: [null],
      filterMedioContacto: [''],
      esCliente: [2],
    });

    this.frmFiltroGrilla.patchValue({
      filterDesde: this.dtpFechaDesde,
      filterHasta: this.dtpFechaHasta,
      filterEstado: 1
    });

    this.frmFiltroGrilla.get('filterDesde').valueChanges.subscribe((res) => {
      if (res) {
        this.fechaDesde = res;
      }
    });

    this.frmFiltroGrilla.get('filterHasta').valueChanges.subscribe((res) => {
      if (res) {
        this.fechaHasta = res;
      }
    });

  }

  get getTitle(): string {
    let output = '';
    output = `Reporte de preferentes de ${this.fechaDesde} al ${this.fechaHasta}`;
    return output;
  }

  get filtros(): any {
    const filtrosPreferente = {
      desde: this.frmFiltroGrilla.value.filterDesde,
      hasta: this.frmFiltroGrilla.value.filterHasta,
      estado: this.frmFiltroGrilla.value.filterEstado === '' ? 0 : this.frmFiltroGrilla.value.filterEstado,
      estadoAtencion: this.frmFiltroGrilla.value.filterEstadoAtencion === '' ? 0 : this.frmFiltroGrilla.value.filterEstadoAtencion,
      teleoperador: this.frmFiltroGrilla.value.filterTeleoperador === null ? 0 : this.frmFiltroGrilla.value.filterTeleoperador,
      medioContacto: this.frmFiltroGrilla.value.filterMedioContacto === '' ? 0 : this.frmFiltroGrilla.value.filterMedioContacto,
      usuarioId: this.usuarioActual.idUsuario,
      esCliente: parseInt(this.frmFiltroGrilla.value.esCliente, 10)
    };
    return filtrosPreferente;
  }
  buildtable(idPerfil: TipoPerfil): void {
    this.optionsDtPreferentes = {
      ajax: (dataTablesParameters: any, callback) => {
        this.spinner.show();
        this.sbcCollection = this.preferenteService.preferenteObtenerPorFiltros(this.filtros).subscribe(
          data => {
            this.datosPreferente = data;


            callback({ data });
            this.spinner.hide();
          }
        );
        $('#btnEditar1, #btnEditar2, #btnAsignar1, #btnAsignar2, #btnAtender1, #btnAtender2').hide();
      },
      select: {
        selector: 'td:not(:first-child)'
      },
      searching: true,
      'columnDefs': [{
        'max-width': '34px',
        'targets': 0
      }],
      columns: [
        {
          "className": 'dtr-control',
          "orderable": false,
          "data": null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'ID', width: '0', data: 'id', visible: false },
        { title: 'PREFERENTE', width: '10%', data: 'nombres' },
        {
          title: 'ESTADO', width: '10%', data: 'idEstado', render(data): any {
            switch (data) {
              case 1: return '<span class="label theme-bg-red">SIN ASIGNAR</span>';
              case 2: return '<span class="label theme-bg-yellow f-12">ASIGNADO</span>';
              case 3: return '<span class="label theme-bg-green f-12">VISTO</span>';
              case 4: return '<span class="label theme-bg-black f-12" style="color: white;">TRABAJADO</span>';
              case 64: return '<span class="label f-12" style="color: white; background: #587fbd;">PROVINCIA</span>';
              case 61: return '<span class="label f-12" style="color: white; background: #53327c;">PENDIENTE RESPUESTA</span>';
              case 62: return '<span class="label f-12" style="color: white; background: #37815c;" >No Apto</span>';
              default: return '<span class="label bg-indigo">SIN NÚMERO</span>';
            }
          }
        },
        // { title: 'A. CATEGORIA',  data: 'atencionCategoria' },
        // { title: 'A. OPCIÓN', data: 'atencionOpcion' },
        {
          title: 'FICHA CLIENTE', data: 'esCliente', render(data): any {
            switch (data) {
              case 0: return '<span class="label theme-bg-red">NO</span>';
              case 1: return '<span class="label theme-bg-green">SI</span>';
            }
          }
        },
        { title: 'ATENCION', width: '5%', data: 'estadoAtencion' },
        { title: 'CELULAR', width: '5%', data: 'celular' },
        { title: 'ZONA', width: '5%', data: 'zonaCorporal' },
        {
          title: 'TELEOPERADORA', width: '"5%', data: 'teleoperadora', visible: (this.usuarioActual.idperfil != TipoPerfil.OPERADOR), render: (data, xhr, row) => {
            return `<span title="${row.nombreTeleoperador}">${data}</span>`
          }
        },
        { title: 'CORREO', width: '5%', data: 'email' },
        { title: 'CONTACTO', width: '5%', data: 'medioContacto' },
        { title: 'CONTACTO CIERRE', width: '5%', data: 'medioContactoCierre' },
        { title: 'RECONTACTO', width: '5%', data: 'medioRecontacto' },

        { title: 'DISTRITO', width: '5%', data: 'distrito' },
        {
          title: 'OBSERVACION', width: '5%', data: 'observacion', render: (data: string[]) => {
            let output = '<ul class="mb-0 pl-0">';
            data.forEach(x => {
              output += `<li>${x}</li>`;
            });
            output += '</ul>';

            return data.length ? output : '';
          }
        },
        { title: 'COMENTARIO', width: '5%', data: 'comentario' },
        { title: 'USU. FACEBOOK', data: 'usuFacebook' },
        { title: 'USU. INSTAGRAM', data: 'usuInstagram' },
        { title: 'UTM FUENTE', data: 'utmSource' },
        { title: 'UTM MEDIO', data: 'utmMedium' },
        { title: 'UTM CAMPAÑA', data: 'utmCampaign' },
        { title: 'UTM ID', data: 'utmId' },
        { title: 'UTM TERM', data: 'utmTerm' },
        { title: 'UTM CONT', data: 'utmCont' },
        {
          title: 'FEC. INGR.', data: 'fechaRegistra', render: (data: string) => {
            return this.datePipe.transform(new Date(data), 'dd/MM/yyyy');
          }
        },
        {
          title: 'HORA INGR.', data: 'fechaRegistra', render: (data: string) => {
            return this.datePipe.transform(new Date(data), 'hh:mm a');
          }
        },
        { title: 'U. REG', data: 'usuarioRegistro' },
        { title: 'FEC. ASIG.', data: 'fechaAsignacion' },
        {
          title: 'FEC. AGENDO.', data: 'agendo', render: (data: Date | null) => {
            return data ? this.datePipe.transform(new Date(data), 'dd/MM/yy hh:mm:ss a') : null;
          }
        },
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [{
        extend: 'excelHtml5',
        title: this.getTitle,
        text: 'Preferentes',
        className: 'btn btn-sm btn-secondary',
        exportOptions: {
          columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        }
      }],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function (api, rowIdx, columns: any[]) {
            const data = columns.map(x => {
              return x.hidden ?
                '<tr data-dt-row="' + x.rowIndex + '" data-dt-column="' + x.columnIndex + '">' +
                '<td><b>' + x.title + '</b></td>' +
                '<td><b>:</b></td>' +
                '<td>' + x.data + '</td>' +
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100', 'table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      },
      order: []
    };
  }

  checkViewAppointment(id: number): void {
    // Si es usuario OPERADOR o ESPECIALISTA, cambiar estado de preferente por visto cuando se lista en la pantalla
    if (this.usuarioActual.idperfil === TipoPerfil.OPERADOR || this.usuarioActual.idperfil === TipoPerfil.ESPECIALISTA) {
      this.sbcActualizarEstadoVisto = this.preferenteService.actualizaEstadoVisto({ ids: [id] }).subscribe(
        resultado => {
          this.utilsService.mostrarToast('Se ha marcado como visto', 'success');
          this.prefListar();
        }
      );
    }
  }
 // Método para manejar el evento de clic en el botón de vista
  onViewAppointment(): void {
    if (this.preferenteSelected) {
      this.checkViewAppointment(this.preferenteSelected.id);
    } else {
      this.utilsService.mostrarToast('Seleccione una cita para visualizar', 'info');
    }
  }

  procesarMensajeSignalR(trama: MensajeSignalR): void {
    switch (trama.tipo) {
      case TipoMensajeSignalR.Actividad: {
        if (this.usuarioActual.idperfil == TipoPerfil.OPERADOR) {
          Swal.fire({
            title: 'Hola ' + this.usuarioActual.nombre.split(' ')[0] + ', ¿Estas en línea?',
            icon: 'info',
            focusConfirm: true,
            allowOutsideClick: false,
            confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> Confirmar!'
          }).then((result) => {
            if (result.isConfirmed) {
              const usuario = new Usuario(this.usuarioActual.idUsuario, this.usuarioActual.nombre, '', '', 0, 0, '', 0, '');
              usuario.usuario = this.authService.getUser().username;
              usuario.fechaRegistra = this.authService.getUser().fechaRegistra;
              console.log('usuario respondio', usuario);
              this.sbcGSignalResponderEscaneo = GlobalConstants.gSignalService.preferenteResponderEscaneo(usuario).subscribe(respuesta => { });
              Swal.fire('Confirmado!', '', 'success');
            }
          });
        }
        break;
      }
      case TipoMensajeSignalR.RespuestaActividad: {
        if (this.usuarioActual.idperfil === TipoPerfil.MARKETING || this.usuarioActual.idperfil === TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil === TipoPerfil.SISTEMAS || this.usuarioActual.idperfil === TipoPerfil.SA || this.usuarioActual.idperfil === TipoPerfil.SUPERVISORVENTAS || this.usuarioActual.idperfil === TipoPerfil.COMMUNITYMANAGER) {
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
              numPreferentes: 0
            };
            console.log('usuario respondio', usuario);
            this.utilsService.mostrarToast(trama.datos.Nombre + ' a confirmado', 'success');
            const existeUsuario = this.listaTeleoperadorConfirmado.find(f => f.idUsuario === usuario.idUsuario);
            if (existeUsuario == null) {
              this.listaTeleoperadorConfirmado.push(usuario);
            } else {
              existeUsuario.totalAsignados = res;
            }
          }, error => {
            console.log(error);
          })


        }
        break;
      }
      case TipoMensajeSignalR.PreferenteAsignado: {
        const idTeleoperador = trama.datos.Response.IdTeleoperador;
        if (idTeleoperador === this.usuarioActual.idUsuario || this.usuarioActual.idperfil === TipoPerfil.MARKETING || this.usuarioActual.idperfil === TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil === TipoPerfil.SISTEMAS || this.usuarioActual.idperfil === TipoPerfil.SA) {
          this.prefListar();
        }
        break;
      }
      case TipoMensajeSignalR.PreferentesAsignados: {
        const usuarios: any[] = JSON.parse(trama.datosJSON).map(x => parseInt(x, 10));
        if (usuarios.includes(this.usuarioActual.idUsuario) || this.usuarioActual.idperfil === TipoPerfil.MARKETING || this.usuarioActual.idperfil === TipoPerfil.SUPERVISOR || this.usuarioActual.idperfil === TipoPerfil.SISTEMAS || this.usuarioActual.idperfil === TipoPerfil.SA) {
          this.prefListar();
        }
        break;
      }
      case TipoMensajeSignalR.RetornoPreferente: {
        this.prefListar();
        break;
      }
      case TipoMensajeSignalR.NuevoPreferente: {
        this.prefListar();
        break;
      }
    }
  }

  teleoperadorListar(): void {
    this.sbcCollectionTeleoperador = this.usuarioService.obtenerByIdPerfil(TipoPerfil.OPERADOR.toString(), 0).subscribe(
      resultado => this.listaMaestra.teleoperadores = resultado);
  }
  medioContactoListar(): void {
    this.sbcCollectionMedioContacto = this.medioContactoService.obtenerMedioContacto().subscribe(
      resultado => this.listaMaestra.mediosContactos = resultado);
  }
  zonasCorporalesListar(): void {
    this.sbcCollectionZonasCorporales = this.zonaCorporalService.obtener().subscribe(
      resultado => this.listaMaestra.zonasCorporales = resultado);
  }
  departamentoListar(): void {
    this.sbcCollectionDepartamentos = this.ubicacionService.obtenerDepartamento2().subscribe(
      resultado => this.listaMaestra.departamentos = resultado);
  }
  estadoListar(): void {
    this.sbcCollectionEstados = this.estadoService.obtenerEstadoByEntidad('Preferente').subscribe(resultado => {
      // if (this.usuarioActual.idperfil === TipoPerfil.OPERADOR){
      //    resultado = resultado.filter(item => item.id === 3 || item.id === 4 || item.id === 2);
      // }
      this.listaMaestra.estado = resultado;
    });
  }
  estadoAtencionListar(): void {
    this.sbcCollectionEstadosAtencion = this.estadoService.obtenerEstadoByEntidad('Preferente2').subscribe(resultado => {
      // if (this.usuarioActual.idperfil === TipoPerfil.OPERADOR){
      //    resultado = resultado.filter(item => item.id === 3 || item.id === 4 || item.id === 2);
      // }
      this.listaMaestra.estadoAtencion = resultado;
    });
  }
  prefListar(): void {
    this.selected = 0;
    this.dataTable.ajax.reload();
  }

  prefNuevo(modal: any): void {
    this.idPreferente = 0;
    this.modalPreferenteDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalPreferenteDatosRef.result.then((result: boolean) => {
      if (result) {
        this.prefListar()
      }
    });
  }
  prefEditar(modal: any): void {
    this.modalPreferenteDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalPreferenteDatosRef.result.then((result: boolean) => {
      if (result) {
        this.prefListar()
      }
    });
  }
  prefAsig(modal: any): void {
    this.listaTeleoperadorConfirmado = [];
    this.modalPreferenteAsignarRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalPreferenteAsignarRef.result.then(result => this.prefListar());
  }
  prefAtendido(modal: any): void {
    // 1 - Estado Sin Asignar
    if (this.preferenteSelected.idEstado === 1) {
      this.utilsService.mostrarToast('Para atencion al preferente el estado debe ser ASIGNADO', 'info');
      return;
    }

    this.modalPreferenteAtencionRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalPreferenteAtencionRef.result.then(result => {
      this.prefListar();
    });
  }
  prefImportarExcel(event): void {
    if (event.target.files) {

      const file: File = event.target.files[0];
      if (file.name.split('.').pop().toLowerCase() !== 'xlsx') {
        this.utilsService.mostrarToast('Seleccionar un archivo excel', 'warning');
        return;
      }

      //console.log( file);
      Swal.fire({
        html: 'Desea importar los datos del archivo <b>' + file.name + '</b>?',
        icon: 'info',
        focusConfirm: true,
        allowOutsideClick: false,
        confirmButtonText: 'Si',
        showCancelButton: true,
        cancelButtonText: 'No'
      }).then(async (result) => {
        const fileReader = new FileReader();
        let arrayBuffer: any;
        if (result.isConfirmed) {
          fileReader.readAsArrayBuffer(file);
          fileReader.onload = (e) => {
            arrayBuffer = fileReader.result;
            const data = new Uint8Array(arrayBuffer);
            const arr = [];
            for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            const bstr = arr.join("");
            const workbook = XLSX.read(bstr, { type: "binary" });
            const first_sheet_name = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[first_sheet_name];
            const arraylist: any = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: "" });

            if (!arraylist.length) { return }

            const headersOrigin = ['Nombres', 'Apellidos', 'Correo', 'Telefono', 'IdMedioContacto', 'Observacion'];
            const headersFile = Object.keys(arraylist[0]);

            for (const header in headersFile) {
              if (!headersOrigin.includes(headersFile[header])) {
                this.utilsService.mostrarToast('Existe un error en las cabeceras del archivo', 'warning');
                return;
              }
            }

            const preferentes: Preferente = arraylist.map(p => {
              const preferente = new Preferente();
              preferente.nombres = p.Nombres.trim();
              preferente.apellidos = p.Apellidos.trim();
              preferente.email = p.Correo.trim();
              preferente.telefono = this.convertirNumeroYPrefijo(p.Telefono.toString().replaceAll(' ', '').replace('+', ''));
              preferente.usuarioRegistra = this.usuarioActual.nombre;
              preferente.idMedioContacto = parseInt(p.IdMedioContacto, 10);
              preferente.observacion = p.Observacion.trim();
              return preferente;
            });


            this.spinner.show();
            this.preferenteService.importarPreferentes(preferentes).subscribe((res) => {
              if (res.status === 201) {
                this.spinner.hide();
                this.prefListar();
                Swal.fire({
                  text: 'Se importo correctamente la lista de preferentes al registro!!!',
                  icon: 'success',
                  focusConfirm: true,
                  allowOutsideClick: false,
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 1000
                });
              } else {
                this.spinner.hide();
                console.log(res.message);
                this.utilsService.mostrarToast('Ocurrio un error al intentar importar los preferentes', 'error');
              }
            }, error => {
              this.spinner.hide();
              console.log(error);
            })

          }
        } else {
          event.target.value = null;
        }
      });
    }
  }
  convertirNumeroYPrefijo(numero: string): string {
    let numeroFinal = "";

    if (!numero.length) { return numeroFinal }

    numeroFinal = numero.substr(-9);

    const pref = numero.substr(0, (numero.length - 9));
    if (pref) {
      if (pref.includes('51')) {
        numeroFinal = '051' + numeroFinal;
      } else {
        numeroFinal = pref + numeroFinal;
      }
    } else {
      numeroFinal = '051' + numeroFinal;
    }

    return numeroFinal;
  }


  irAsignacion(modal: NgbModalRef, reasignacion): void {
    this.listaTeleoperadorConfirmado = [];
    this.modalAsignacionRef = this.utilsService.abrirModal(modal, ' w-100 max-w-1400px rounded-15px overflow-hidden');
    this.modalAsignacionRef.result.then((res) => {
      if (res) {
        Swal.fire({
          title: 'Los preferentes fueron asignados correctamente!!!',
          icon: 'success',
          focusConfirm: true,
          allowOutsideClick: false,
          confirmButtonText: 'Aceptar',
          showCancelButton: false,
        });
        this.prefListar();
      }
    });
  }


  // Opciones menu movil
  verOpciones(): void {
    if (!this.utilsService.isLargeScreen()) {
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void {
    this.bottomSheet.dismiss();
  }


  /*******************************************************************************************************
   * Events
   */
  evtShowHistory(): void {
    this.modalRef = this.modalService.open(MdlPreferenteHistorial2Component, { size: 'md', windowClass: 'smodal fade2 round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.IdPreferente = this.preferenteSelected.id;
  }
  
  evtBuscarPreferente(modal: any): void {
    this.modalRef = this.modalService.open(MdlBuscarPreferenteComponent, { size: 'xl max-w-1400px', windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: false, animation: true });
    // this.modalRef.componentInstance.IdPreferente = this.preferenteSelected.id;
    this.modalRef.componentInstance.OnEdit.subscribe((val: number) => {
      this.modalRef.close();
      this.idPreferente = val;
      this.modalPreferenteDatosRef = this.utilsService.abrirModal(modal, 'lg');
      this.modalPreferenteDatosRef.result.then((result: boolean) => {
        if (result) {
          this.prefListar()
        }
      });

    });
  }
}
