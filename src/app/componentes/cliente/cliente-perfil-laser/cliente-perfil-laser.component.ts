import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CitaClass, CitaDetalle} from "../../../shared/models/cita";
import {BehaviorSubject, Subscription} from "rxjs";
import {CitaService} from "../../../shared/services/cita.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {AccionCita, ColorEstadoCita, DocumentoPlantillas, EnumServicio, Meses} from "../../../shared/enumeracion/enums";
import {CitaSeguimientoService} from "../../../shared/services/cita-seguimiento.service";
import {ClienteService} from "../../../shared/services/cliente.service";
import {HistoriaClinicaCliente} from "../../../shared/models/historia-clinica";
import Swal from "sweetalert2";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {HistoriaClinicaService} from "../../../shared/services/historia-clinica.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {HistoriaClinicaComponent} from "../cliente-perfil-componentes/historia-clinica/historia-clinica.component";
import {NgxSpinnerService} from "ngx-spinner";
import {
  EditarFichaAdmisionComponent
} from "../cliente-perfil-componentes/editar-ficha-admision/editar-ficha-admision.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ParametroSistemaService} from "../../../shared/services/parametro-sistema.service";
import {CC_DocumentosRenderizados, ClienteContrato} from "../../../shared/models/cliente-contrato";
import {ContratosComponent} from "../cliente-perfil-componentes/contratos/contratos.component";
import {ClienteContratoService} from "../../../shared/services/cliente-contrato.service";
import {DocumentoPlantillaService} from "../../../shared/services/documento-plantilla.service";
import {EvolucionTratamiento} from "../../../shared/models/evolucion-tratamiento";
import {EvolucionTratamientoService} from "../../../shared/services/evolucion-tratamiento.service";
import {ClienteImportClass} from "../../../shared/models/cliente";
import {CitaDetalleService} from "../../../shared/services/cita-detalle.service";
import {DocumentoCLiente} from "../../../shared/models/documento";
import {ClienteDocumentoService} from "../../../shared/services/cliente-documento.service";
import {pdfConfig} from "../../../app-config";
import {DatePipe} from "@angular/common";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {DocumentosComponent} from "../cliente-perfil-componentes/documentos/documentos.component";
import {PromocionService} from "../../../shared/services/promocion.services";
import {PdfmakeService} from "../../../shared/services/pdfmake.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-perfil-laser',
  templateUrl: './cliente-perfil-laser.component.html',
  styleUrls: ['./cliente-perfil-laser.component.scss']
})
export class ClientePerfilLaserComponent implements OnInit, OnDestroy {

  @Input() idCliente: number;

  citasResumen: any = [];
  subscriptionCitas: Subscription;
  loadingCitas = false;
  dtOptionsTableCitasPendientes: any = {};
  dtOptionsTableCitasRealizadas: any = {};
  citaSelected: CitaClass | null;

  // cita
  idCita: number = 0;

  loadingZonasAtendidas = false;
  loadingHistorialSeguimiento = false;
  zonasCorporalesHistorico: any = [];

  subscriptionHistorial: Subscription;
  subscriptionZonasAtendidas: Subscription;
  subcriptionAnularContrato: Subscription;

  historiales: any = [];

  // Documento
  sbcParametroSistemaCabeceraPagina: Subscription;
  sbcParametroSistemaPiePagina: Subscription;
  cabeceraPagina: string = null;
  piePagina: string = null;

  @ViewChild('mdlOpcionesCitas') mdlOpcionesCitas: any;

  @ViewChild('mdlOpcionesHistoria') mdlOpcionesHistoria: any;
  historiaSelected: HistoriaClinicaCliente | null;

  @ViewChild('historiaClinica') historiaClinica: HistoriaClinicaComponent;


  contratoSelected: ClienteContrato | null = null;

  // modal
  modalGenerarContratoRef: NgbModalRef;
  modalEvolucionTratamientoRef: NgbModalRef;
  modalDocumentoAnularRef: NgbModalRef;

  subcriptionBuscarContrato: Subscription;
  @ViewChild('resumenContratos') contratos: ContratosComponent;


  @ViewChild('mdlOpcionesEvolucion') mdlOpcionesEvolucion: any;

  evolucionTratamientoSelected: EvolucionTratamiento | null = null;
  clienteImportClass: ClienteImportClass = new ClienteImportClass();

  collectionCitaDetalle: CitaDetalle[] = [];
  sbcCollectionCitaDetalle: Subscription;

  @ViewChild('mdlOpcionesDocumento') modalOpcionesDocumento: any;
  documentoSelected: DocumentoCLiente = null;

  maestroPromocion: any[] = [];
  listaPromocionPrecioZonas: any[] = [];
  maestroPatologia: any[] = [];

  @ViewChild('documentosEmitidos') documentosEmitidos: DocumentosComponent;
  @ViewChild('documentosEmitidosAnulados') documentosEmitidosAnulados: DocumentosComponent;

  subscriptionRestoreDocument: Subscription;

  constructor(
    private citaService: CitaService,
    private utilService: UtilsService,
    private citaSeguimientoService: CitaSeguimientoService,
    private clienteService: ClienteService,
    private historiaClinicaService: HistoriaClinicaService,
    private ususarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private parametroSistemaService: ParametroSistemaService,
    private clienteContratoService: ClienteContratoService,
    private documentoPlantillaService: DocumentoPlantillaService,
    private evolucionTratamientoService: EvolucionTratamientoService,
    private citaDetalleService: CitaDetalleService,
    private clienteDocumentoService: ClienteDocumentoService,
    private datePipe: DatePipe,
    private promocionService: PromocionService,
    private pdfMakeService: PdfmakeService,

    private router: Router
  ) { }

  ngOnInit(): void {

    this.listarPromociones();
    this.obtenerPieyCabeceradePagina();
    this.cargarCitasPendientes();
    this.cargarCitasRealizadas();
    this.cargarHistorialSeguimiento();
    this.documentosEmitidos?.reload();
    this.documentosEmitidosAnulados?.reload();
    this.contratos?.reload();

    this.router.navigate(['/ClientePerfil', this.idCliente , 'General'], { queryParams: { idServicio: 1 } });
  }

  ngOnDestroy(): void {
    this.subscriptionCitas?.unsubscribe();
    this.subcriptionAnularContrato?.unsubscribe();
    this.subscriptionZonasAtendidas?.unsubscribe();
    this.subcriptionBuscarContrato?.unsubscribe();
    this.subscriptionRestoreDocument?.unsubscribe();

    this.modalEvolucionTratamientoRef?.close();
    this.modalGenerarContratoRef?.close();
    this.modalDocumentoAnularRef?.close();
  }

  reload(): void{
    this.obtenerPieyCabeceradePagina();
    this.cargarCitasPendientes();
    this.cargarCitasRealizadas();
    this.cargarHistorialSeguimiento();
    this.documentosEmitidos?.reload();
    this.documentosEmitidosAnulados?.reload();
    this.contratos?.reload();
  }

  /************************* Citas *****************************/
  cargarCitasPendientes(): void{

    this.dtOptionsTableCitasPendientes = {
      ajax: (dataTablesParameters: any, callback) => {
        //  Obtiene el listado de citas del cliente
        this.loadingCitas = true;

        this.subscriptionCitas = this.citaService.obtenerParaPerfilByServicio(this.idCliente, EnumServicio.Depilacion).subscribe(
          (resultado: CitaClass[]) => {

            // console.log(resultado);

            this.citasResumen = resultado;
            const data: CitaClass[] = this.citasResumen.filter(x => x.estado.nombre != 'Atendida' && x.estado.nombre != 'Pagado');
            // console.log('citas pendientes', data);
            callback({ data });
          },
          error => {
            console.log('Error al obtener el historial del cliente', error);

            callback([]);
          }, () => {
            this.loadingCitas = false;
          }
        );
      },
      serverSide: false,
      processing: false,
      pageLength: 5,
      async: true,
      autoWidth: false,
      responsive: {
        details: {
          renderer: ( api, rowIdx, columns: any[] ) => {
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
      order:[],
      "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todo"]],
      language: this.utilService.datatableIdioma,
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click',() => {
          this.citaSelected = null;
        });
        $('td:not(:eq(0))', row).on('click', () => {
          this.citaSelected = data;
          this.mostrarModalOpciones(this.mdlOpcionesCitas, data);
        });
        return row;
      },
      select: false,
      searching: false,
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
        { title: 'Id', data: 'id', width: '4%', visible: false   },
        { title: 'Cita', data: 'numeroCita', width: '100px'},
        { title: 'Fecha', data: 'fechaCita', width: '100px', render: (data) => {
            return this.utilService.formato_FechaString(data);
          }},
        { title: 'Hora', data: 'hora', width: '100px'},
        { title: 'Resumen', data: 'resumen', width: '500px', className: 'ws-normal'},
        { title: 'Tipo', data: 'tipoCita', width: 'auto', render: function(data){
            return data.nombre;
          }},
        { title: 'Servicio', data: 'servicio', width: 'auto'},
        { title: 'Estado Pago', data: 'pagado', width: '100px', render: function(data){
            return data ? 'PAGADO' : 'NO PAGADO'
          }},
        { title: 'Estado Cita', data: 'estado', width: '150px', render: function(data,type,row){
            return `<span class="rounded px-2 text-uppercase small py-1 text-white" style="background-color:${ColorEstadoCita.find(c => c.index === row.estado?.id)?.value}">${data?.nombre}</span>`;
          }},
        { title: 'Sede', data: 'sede', width: '150px', render: function(data){
            return data.nombre;
          },visible: true }
      ]
    }
  }
  cargarCitasRealizadas(): void{
    this.dtOptionsTableCitasRealizadas = {
      ajax: (dataTablesParameters: any, callback) => {
        //  Obtiene el listado de citas del cliente
        this.loadingCitas = true;

        this.subscriptionCitas = this.citaService.obtenerParaPerfilByServicio(this.idCliente, 1).subscribe(
          (resultado: CitaClass[]) => {

            this.citasResumen = resultado;
            const data: CitaClass[] = this.citasResumen.filter(x => x.estado.nombre == 'Atendida' || x.estado.nombre == 'Pagado');
            // console.log('citas atendidas', data);
            callback({ data });
          },
          error => {
            console.log('Error al obtener el historial del cliente', error);
            callback([]);
          }, () => {
            this.loadingCitas = false;
          }
        );
      },
      serverSide: false,
      processing: false,
      pageLength: 5,
      async: true,
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
      order:[],
      "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todo"]],
      language: this.utilService.datatableIdioma,
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click',() => {
          this.citaSelected = null;
        });
        $('td:not(:eq(0))', row).on('click', () => {
          this.citaSelected = data;
          this.mostrarModalOpciones(this.mdlOpcionesCitas, data);
        });
        return row;
      },
      select: false,
      searching: false,
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
        { title: 'Id', data: 'id', visible: false   },
        { title: 'Cita', data: 'numeroCita', width: '100px'},
        { title: 'Fecha', data: 'fechaCita', width: '100px', render: (data) => {
            return this.utilService.formato_FechaString(data);
          }},
        { title: 'Hora', data: 'hora', width: '100px'},
        { title: 'Resumen', data: 'resumen', width: '500px', className: 'ws-normal'},
        { title: 'Tipo', data: 'tipoCita', width: 'auto', render: function(data){
            return data.nombre;
          }},
        { title: 'Servicio', data: 'servicio', width: 'auto'},
        { title: 'Estado Pago', data: 'pagado', width: '100px', render: function(data){
            return data ? 'PAGADO' : 'NO PAGADO'
          }},
        { title: 'Estado Cita', data: 'estado', width: '150px', render: function(data,type,row){
            return `<span class="rounded px-2 text-uppercase small py-1 text-white" style="background-color:${ColorEstadoCita.find(c => c.index === row.estado.id).value}">${data.nombre}</span>`;
          }},
        { title: 'Sede', data: 'sede', width: '150px', render: function(data){
            return data.nombre;
          },visible: true }
      ]
    }
  }

  /************************* Historial Seguimiento *****************************/
  cargarHistorialSeguimiento(): void{
    //  Obtiene el historial de citas del cliente
    this.loadingHistorialSeguimiento = true;
    this.loadingZonasAtendidas = true;

    this.subscriptionHistorial = this.citaSeguimientoService.obtenerHistorialSeguimientoPorServicio(this.idCliente, 1).subscribe(
      resultado => {
        this.historiales  = resultado;
        //console.log('historiales', resultado);

        this.subscriptionZonasAtendidas = this.clienteService.obtenerTodasZonasAtendidasPorServicio(this.idCliente, 1).subscribe(
          resultado => {
            this.zonasCorporalesHistorico = resultado;
          },
          error => {
            console.log('Error al obtener las zonas del cliente', error);
            this.loadingZonasAtendidas = false;
          }, () => {
            this.loadingZonasAtendidas = false;
          }
        );

      },
      error => {
        console.log('Error al obtener el historial del cliente', error);
      }, () => {
        this.loadingHistorialSeguimiento = false;
      });
  }

  // functions
  mostrarModalOpciones(modal, cita: CitaClass): void {
    this.idCita = cita.id;
    /*    if( cita.estado.nombre === 'Atendida') {
           $('#btnCitaEditar').hide()
        } else {
           $('#btnCitaEditar').show();
        }*/
    modal.show();
  }
  irCita(estadoCita: AccionCita): void {
    window.open(`/Cita/${this.idCita}/${estadoCita}/${this.idCliente}/${this.citaSelected?.idPreferente}/${this.citaSelected?.idServicio}`, '_blank');
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



  /********************************************* Historia Clinica *******************************************/
  mostrarHistoriaClinicaOpciones(modal, historiaClinica: HistoriaClinicaCliente | null = null): void {
    if(historiaClinica){
      this.historiaSelected = historiaClinica;
    }
    modal.show();
  }
  anularHistoria(): void{
    const historia = this.historiaSelected;
    Swal.fire({
      title: 'Anular historia',
      html: `¿Desea anular historia clínica (HC-${historia.id.toString().padStart(8,'0')})?`,
      icon: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(
      result => {
        if(result.isConfirmed) {
          this.subcriptionAnularContrato = this.historiaClinicaService.anular(historia.id,this.ususarioService.UsuarioActual.idUsuario).subscribe((res) => {
            if( res instanceof ErrorSistema){
              Swal.fire({
                icon: 'error',
                title: res.message,
                showConfirmButton: false,
                timer: 1200
              });
            }else{
              Swal.fire({
                icon: 'success',
                title: 'Historia clinica anulada!!!',
                html: `La historia clinica <b>(HC-${historia.id.toString().padStart(8,'0')})</b> fue anulado !!`,
                showConfirmButton: false,
                timer: 1200
              });
              this.historiaClinica.reload();
            }
          }, err => {
            console.error(err);
            this.spinner.hide();
          }, () => {
            this.spinner.hide();
          });
        }
      }
    );
  }
  verHistoriaClinica(): void{
    let contenido: any[] = [];
    const historiaClinica = this.historiaSelected;
    let historiaDocumentoDetalle : HistoriaClinicaCliente;
    this.spinner.show();
    this.historiaClinicaService.obtenerDetallesByHistoria(historiaClinica.id).subscribe(  async (historia: HistoriaClinicaCliente | ErrorSistema) => {
      if(historia instanceof ErrorSistema){
        // console.log(historia);
        this.spinner.hide();
        Swal.fire({
          html: historia.message,
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: false
        });

        return;
      }else{

        // console.log(res);
        historiaDocumentoDetalle = await historia;
        //console.log(historia);
        await this.historiaClinicaService.generarDocumentoHistoriaClinica(historia).subscribe( (res) => {
          contenido = res;
        });

        await this.historiaClinicaService.generarDocumentoFichaCliente(historia).subscribe( (res) => {
          contenido = contenido.concat(res);
        });

        /*await this.documentoPlantillaService.find(DocumentoPlantillas.ConsentimientoInformadoAutorizacion).toPromise().
        then(res => {
          let plantilla: any = res.plantilla;

          if(plantilla.includes('@dia')){
            plantilla = plantilla.replaceAll('@dia', this.datePipe.transform( new Date(historia.fechaHistoria),'dd'));
          }

          if(plantilla.includes('@mes')){
            plantilla = plantilla.replaceAll('@mes', Meses[parseInt(this.datePipe.transform( new Date(historia.fechaHistoria), 'MM' ))]);
          }

          if(plantilla.includes('@año')){
            plantilla = plantilla.replaceAll('@año', this.datePipe.transform( new Date(historia.fechaHistoria), 'yyyy' ));
          }

          if(plantilla.includes('@cliente')){
            plantilla = plantilla.replaceAll('@cliente', historia.nombreCompleto ? historia.nombreCompleto : '');
          }

          if(plantilla.includes('@numeroDocumento')){
            plantilla = plantilla.replaceAll('@numeroDocumento', historia.documento ? historia.documento : '');
          }

          plantilla = JSON.parse( plantilla );
          plantilla[(plantilla.length-1)]['pageBreak'] = 'after';

          contenido = contenido.concat( plantilla );
        });

        await this.documentoPlantillaService.find(DocumentoPlantillas.InformacionProcesoDepilacion).toPromise().
        then(res => {
          let plantilla = JSON.parse( res.plantilla );
          plantilla[(plantilla.length-1)]['pageBreak'] = 'after';
          contenido = contenido.concat( plantilla );
        });

        await this.documentoPlantillaService.find(DocumentoPlantillas.RecomendacionesCliente).toPromise().
        then(res => {
          let plantilla = JSON.parse( res.plantilla );

          contenido = contenido.concat( plantilla );
        });*/

        this.historiaClinicaService.generarHistoriaClinicaPdf(contenido,this.cabeceraPagina,this.piePagina,[40,160,40,50], {fontSize: 10}, historiaDocumentoDetalle.idEstado ).subscribe( documentoPdf => {
          documentoPdf.getBase64((data) => {
            this.spinner.hide();
            documentoPdf.open();
          });

        },error => {
          console.log(error);
          this.spinner.hide();
        });

      }
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }
  editarFichaClinica(): void{
    const modalRef = this.modalService.open(EditarFichaAdmisionComponent,{
      backdrop : 'static',
      keyboard : false
    });
    modalRef.componentInstance.IdFichaAdmision = this.historiaSelected.id;
    modalRef.result.then((res) => {
      this.historiaClinica.reload(false);
    });
  }
  // Cliente Historia Clinica
  obtenerPieyCabeceradePagina(): void{
    this.sbcParametroSistemaCabeceraPagina = this.parametroSistemaService.obtenerById(11).subscribe((res) => {
      this.cabeceraPagina = res.response?.valor;
    });
    this.sbcParametroSistemaPiePagina = this.parametroSistemaService.obtenerById(12).subscribe((res) => {
      this.piePagina = res.response?.valor;
    });
  }


  /********************************************* Contrato *******************************************/
  mostrarContratoOpciones(modal, contrato: ClienteContrato | null = null): void {
    if(contrato){
      // console.log('Se selecciono un contrato', contrato);
      // const idDocumentos = contrato.idDocumentos.split(',').map(x => parseInt(x));
      // console.log('documentos', idDocumentos);
      this.contratoSelected = contrato;
    }
    modal.show();
  }
  generarContrato(modal): void{
    this.modalGenerarContratoRef = this.utilService.abrirModal(modal,'lg');
    this.modalGenerarContratoRef.result.then((res) => {
      if(res){
        this.contratos.reload();
      }
    });
  }
  anularContrato(): void{
    const contrato = this.contratoSelected;
    contrato.idUsuarioRegistro = this.ususarioService.UsuarioActual.idUsuario;
    Swal.fire({
      title: 'Anular resumen de contrato',
      html: `¿Desea anular el resumen d  contrato <b>(CTT-${contrato.id.toString().padStart(8,'0')})</b>?`,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(
      result => {
        if(result.isConfirmed) {
          this.spinner.show();
          this.subcriptionAnularContrato = this.clienteContratoService.anular(contrato).subscribe((res) => {
            if(res.status === 200){
              this.spinner.hide();
              Swal.fire({
                icon: 'success',
                title: 'Resumen de contrato anulado!!!',
                html: `El contrato <b>(CTT-${contrato.id.toString().padStart(8,'0')})</b> fue anulado !!`
              });
              this.contratos.reload(false);
            }
          }, err => {
            console.error(err);
            this.spinner.hide();
          });

        }
      }
    );
  }
  verContrato(): void{
    const contrato = this.contratoSelected;
    this.spinner.show();
    this.subcriptionBuscarContrato = this.clienteContratoService.buscar(contrato).subscribe((contrato) => {
      if( contrato instanceof ErrorSistema){
        this.spinner.hide();
        Swal.fire({
          icon: 'error',
          title: contrato.message,
          showConfirmButton: false,
          timer: 1000
        });
      }else{
        // console.log('contrato',contrato);
        this.documentoPlantillaService.find(DocumentoPlantillas.ResumenDocumento).subscribe((res) => {
          this.spinner.hide()
          this.clienteContratoService.generarResumenContratoPdf(res,contrato,{fontSize: 10},true).subscribe((res) => {
            res.open();
          });
        });
      }
    }, err => {
      console.error(err);
      this.spinner.hide();
    });
  }
  async enviarContrato(): Promise<void>{
    const _contrato = this.contratoSelected;

    Swal.fire({
      title: 'Enviar resumen de contrato',
      html: `¿Desea enviar el documento <b>(CTT-${_contrato.id.toString().padStart(8,'0')})</b> al cliente?`,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(
      async result => {
        if(result.isConfirmed) {
          this.spinner.show();

          const idDocumentos = this.contratoSelected?.idDocumentos.split(',').map(x => parseInt(x));

          const sbDocumentos = new BehaviorSubject<CC_DocumentosRenderizados | null>(null);
          const documentos: CC_DocumentosRenderizados[] = [];
          sbDocumentos.subscribe((res: CC_DocumentosRenderizados | null) => {
            if(res){
              documentos.push(res);
              if(documentos.length === idDocumentos.length){

                const contrato = new ClienteContrato();
                contrato.id = this.contratoSelected.id;
                contrato.idEstado = this.contratoSelected.idEstado;
                contrato.documentosRenderizados = documentos;
                contrato.idCliente = this.contratoSelected.idCliente;
                contrato.tituloContrato = this.contratoSelected.tituloContrato;
                contrato.emailEnviado = this.contratoSelected.emailEnviado;

                this.clienteContratoService.enviarContrato(contrato).subscribe((res: boolean | ErrorSistema)=> {

                    if( res instanceof ErrorSistema){
                      this.spinner.hide();
                      Swal.fire({
                        icon: 'warning',
                        title: res.message,
                        showConfirmButton: true
                      });
                    }else{
                      this.spinner.hide();
                      Swal.fire({
                        icon: 'success',
                        title: 'Resumen de contrato enviado!!!',
                        html: 'Se envió una copia del resumen del contrato ' + '<b>CTT-' + _contrato.id.toString().padStart(8,'0') + '</b> al cliente.',
                        showConfirmButton: true
                      });
                      this.contratos.reload(false);
                      //this.datatableContratos.ajax.reload();
                    }
                }, error => {
                    this.spinner.hide();
                    Swal.fire({
                      icon: 'error',
                      title: 'Ocurrio un error al intentar enviar el resumen de contrato',
                      showConfirmButton: true
                    });
                    console.log(error);
                });
              }
            }
          });


          for (const x of idDocumentos) {
            let i = idDocumentos.indexOf(x);

            await this.clienteDocumentoService.getDocumentById(x).subscribe(async (docCliente: DocumentoCLiente | ErrorSistema) => {

              if (docCliente instanceof DocumentoCLiente) {
                if (docCliente.idPromocion) {

                  await this.promocionService.obtenerDetalle(docCliente.idPromocion).toPromise().then(async (promDetalle: any[]) => {

                    docCliente.plantilla = await this.clienteDocumentoService.drawDocument(docCliente, [], this.maestroPromocion, promDetalle);

                    const docPdf = await this.pdfMakeService.create(JSON.parse(docCliente.plantilla));
                    const render = new CC_DocumentosRenderizados();
                    render.id = docCliente.id;
                    render.titulo = `D-${docCliente.id.toString().padStart(8, '0')} - ${docCliente.nombreDocumento}`;
                    docPdf.getBase64(async (data) => {
                      render.contenidoBase64 = await data;
                      sbDocumentos.next(render);
                    });
                  }, err => {
                    console.error(err);
                    // doc.loading = false;
                    // doc.error = true;
                  });
                } else {
                  docCliente.plantilla = await this.clienteDocumentoService.drawDocument(docCliente, [], this.maestroPromocion);
                  const docPdf = await this.pdfMakeService.create(JSON.parse(docCliente.plantilla));
                  const render = new CC_DocumentosRenderizados();
                  render.id = docCliente.id;
                  render.titulo = `D-${docCliente.id.toString().padStart(8, '0')} - ${docCliente.nombreDocumento}`;
                  docPdf.getBase64(async (data) => {
                    render.contenidoBase64 = await data;
                    sbDocumentos.next(render);
                  });
                }
              }

            });

          }


          // this.subcriptionBuscarContrato = this.clienteContratoService.buscar(_contrato).subscribe((contrato: ClienteContrato | ErrorSistema) => {
          //   if( contrato instanceof ErrorSistema){
          //     this.spinner.hide();
          //     Swal.fire({
          //       icon: 'error',
          //       title: contrato.message,
          //       showConfirmButton: false,
          //       timer: 1000
          //     });
          //   }else{
          //     this.documentoPlantillaService.find(DocumentoPlantillas.ResumenDocumento).subscribe((plantilla) => {
          //
          //       this.clienteContratoService.generarResumenContratoPdf(plantilla,contrato,{fontSize: 10},true).subscribe((pdf) => {
          //         pdf.getBase64((data) => {
          //           const oContrato = new ClienteContrato();
          //           oContrato.idCliente = _contrato.idCliente;
          //           oContrato.contrato = data;
          //           oContrato.idEstado = contrato.idEstado;
          //           oContrato.id = _contrato.id;
          //           oContrato.tituloContrato = "RESUMEN DE CONTRATO";
          //           this.clienteContratoService.enviarContrato(oContrato).subscribe((res)=> {
          //
          //             if( res instanceof ErrorSistema){
          //               this.spinner.hide();
          //               Swal.fire({
          //                 icon: 'warning',
          //                 title: res.message,
          //                 showConfirmButton: true
          //               });
          //             }else{
          //               this.spinner.hide();
          //               Swal.fire({
          //                 icon: 'success',
          //                 title: 'Resumen de contrato enviado!!!',
          //                 html: 'Se envió una copia del resumen del contrato ' + '<b>CTT-' + _contrato.id.toString().padStart(8,'0') + '</b> al cliente.',
          //                 showConfirmButton: true
          //               });
          //               this.contratos.reload(false);
          //               //this.datatableContratos.ajax.reload();
          //             }
          //           }, error => {
          //             this.spinner.hide();
          //             Swal.fire({
          //               icon: 'error',
          //               title: 'Ocurrio un error al intentar enviar el resumen de contrato',
          //               showConfirmButton: true
          //             });
          //             console.log(error);
          //           });
          //         });
          //
          //       });
          //     });
          //   }
          // }, err => {
          //   console.error(err);
          //   this.spinner.hide();
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Ocurrio un error al intentar enviar el resumen de contrato',
          //     showConfirmButton: true
          //   });
          // });
        }
      }
    );
  }



  /*** Evolución Tratamiento ***/
  mostrarEvolucionTratamientOpciones(modal, compEvTratamiento: EvolucionTratamiento | null = null): void {
    if(compEvTratamiento){
      this.evolucionTratamientoSelected = compEvTratamiento;
    }
    modal.show();
  }
  importarEvolucionTratamientoPdf( view: boolean = false): void{

    if(!this.evolucionTratamientoSelected){
      this.utilService.mostrarToast('Seleccionar una historia clínica','warning');
      return;
    }
    this.spinner.show();
    this.evolucionTratamientoService.obtenerEvolucionTratamientoById(this.evolucionTratamientoSelected.id).subscribe((res) => {
      this.spinner.hide();
      this.evolucionTratamientoService.exportarEvolucionTratamientoPdf(res,this.clienteImportClass,this.cabeceraPagina,this.piePagina, view);
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  editarEvolucionTratamiento(modal: any): void{

    if(!this.evolucionTratamientoSelected){
      this.utilService.mostrarToast('Seleccionar una historia clínica','warning');
      return;
    }

    this.spinner.show();
    this.evolucionTratamientoService.obtenerEvolucionTratamientoById(this.evolucionTratamientoSelected.id).subscribe((res) => {
      this.evolucionTratamientoSelected = res;

      console.log(res);

      this.sbcCollectionCitaDetalle = this.citaDetalleService.obtenerDetalleByCita( this.evolucionTratamientoSelected.idCita ).subscribe( (res) => {
        this.spinner.hide();
        this.collectionCitaDetalle = res;
        this.modalEvolucionTratamientoRef = this.utilService.abrirModal(modal, 'xl');
        this.modalEvolucionTratamientoRef.result.then((res) => {

        });
      }, error => {
        console.error(error);
        this.spinner.hide();
      });

    }, error => {
      this.spinner.hide();
      console.log(error);
    });

  }


  // Funciones Documento
  async renderDocumento( clienteDocumento: DocumentoCLiente, enviarCorreo: boolean = false ): Promise<void> {

    this.spinner.show();

    if(!clienteDocumento.plantilla){
      console.error('El documento no tiene una plantilla definida');
      this.utilService.mostrarToast('El documento no tiene una plantilla definida','warning');
      this.spinner.hide();
      return;
    }
    //console.log(clienteDocumento.nombreCliente);

    let plantilla: any = clienteDocumento.plantilla;

    if(plantilla.includes('@id')){
      plantilla = plantilla.replaceAll('@id', clienteDocumento.id);
    }

    if(plantilla.includes('@cliente')){
      plantilla = plantilla.replaceAll('@cliente', clienteDocumento.nombreCliente);
    }

    if(plantilla.includes('@tipoDocumento')){
      plantilla = plantilla.replaceAll('@tipoDocumento', clienteDocumento.tipoDocumentoIdentidad);
    }

    if(plantilla.includes('@numeroDocumento')){
      plantilla = plantilla.replaceAll('@numeroDocumento', clienteDocumento.documentoIdentidad);
    }

    if(plantilla.includes('@observacion')){
      plantilla = clienteDocumento.observacion ?  plantilla.replaceAll('@observacion', clienteDocumento.observacion.replace(/\n/g, "\\n") ) : plantilla.replaceAll('@observacion', '');
    }

    if(plantilla.includes('@zonas')){
      plantilla = plantilla.replaceAll('@zonas', clienteDocumento.zonas.map( z => {
        return z.nombre
      }).join(', ') );
    }

    if(plantilla.includes('@documentoTutor')){
      plantilla = plantilla.replaceAll('@documentoTutor', clienteDocumento.dniApoderado);
    }

    if(plantilla.includes('@nombreTutor')){
      plantilla = plantilla.replaceAll('@nombreTutor', clienteDocumento.nombreApoderado);
    }

    if(plantilla.includes('@edad')){
      plantilla = plantilla.replaceAll('@edad', clienteDocumento.fechaNacimiento ? this.utilService.calculaEdad(new Date(clienteDocumento.fechaNacimiento)).toString() : '' );
    }

    if(plantilla.includes('@diaD')){
      plantilla = plantilla.replaceAll('@diaD', this.datePipe.transform(clienteDocumento.fechaDocumento,'dd'));
    }

    if(plantilla.includes('@mesD')){
      plantilla = plantilla.replaceAll('@mesD', Meses[parseInt( this.datePipe.transform(clienteDocumento.fechaDocumento,'MM') )]);
    }

    if(plantilla.includes('@añoD')){
      plantilla = plantilla.replaceAll('@añoD', this.datePipe.transform(clienteDocumento.fechaDocumento,'yyyy'));
    }

    if(plantilla.includes('@domicilioCliente')){
      plantilla = plantilla.replaceAll('@domicilioCliente', clienteDocumento.direccion);
    }

    if(plantilla.includes('@distritoCliente')){
      plantilla = plantilla.replaceAll('@distritoCliente', clienteDocumento.distrito);
    }

    if(plantilla.includes('@retrocederNsesiones')){
      plantilla = plantilla.replaceAll('@retrocederNsesiones', clienteDocumento.numeroSesionesRetroceder.toString());
    }

    if(plantilla.includes('@terminoNsesiones')){
      plantilla = plantilla.replaceAll('@terminoNsesiones', clienteDocumento.numeroSesiones.toString());
    }

    if(plantilla.includes('@sesionesAdicionales')){
      plantilla = plantilla.replaceAll('@sesionesAdicionales', clienteDocumento.sesionesAdicionales.toString());
    }

    if(plantilla.includes('@intervaloMantenimiento')){
      plantilla = plantilla.replaceAll('@intervaloMantenimiento', clienteDocumento.intervaloMantenimiento > 1 ? clienteDocumento.intervaloMantenimiento + " meses." : clienteDocumento.intervaloMantenimiento + "mes.");
    }

    if(plantilla.includes('@consultaMantenimientoEn')){
      plantilla = plantilla.replaceAll('@consultaMantenimientoEn', clienteDocumento.consultaMantenimientoEn.toString());
    }

    if(plantilla.includes('@patologia')){
      plantilla = plantilla.replaceAll('@patologia', clienteDocumento.patologias.map(x => x.nombre).join(", ") );
    }

    if(plantilla.includes('@condiciones')){
      plantilla = plantilla.replaceAll('@condiciones', clienteDocumento.condiciones);
    }

    if( plantilla.includes('@promocion') && plantilla.includes('@tblzonas') ){
      const promocion = this.maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion)?.descripcion;
      plantilla = plantilla.replaceAll('@promocion', promocion);

      plantilla = await this.insertarTablaZonasPrecio(plantilla,clienteDocumento);
    }

    if(plantilla.includes('@promocion')){
      const promocion = this.maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion)?.descripcion;
      plantilla = plantilla.replaceAll('@promocion', promocion);
    }

    if(plantilla.includes('@dia')){
      plantilla = plantilla.replaceAll('@dia', this.datePipe.transform(clienteDocumento.fechaRegistra,'dd'));
    }

    if(plantilla.includes('@mes')){
      plantilla = plantilla.replaceAll('@mes', Meses[parseInt(this.datePipe.transform(clienteDocumento.fechaRegistra,'MM'))]);
    }

    if(plantilla.includes('@año')){
      plantilla = plantilla.replaceAll('@año', this.datePipe.transform(clienteDocumento.fechaRegistra,'yyyy'));
    }

    const dd: any = {
      info: {
        title: 'DocumentoDepilzone',
        author: 'Depilzone',
        subject: 'Sistemas',
        keywords: 'Clinic2.0'
      },
      header: {
        image: pdfConfig.cabeceraPaginaImagen,
        width: 575,
        height: 150,
        alignment: "center",
        margin: [0, 10, 0, 0]
      },
      footer: function(currentPage, pageCount, pageSize) {
        return [
          {
            image: pdfConfig.piePaginaImagen,
            width: 575,
            height: 38,
            alignment: "center",
          }
        ]
      },
      content: JSON.parse(plantilla),
      defaultStyle : {
        fontSize: 10,
        lineHeight: 1.5,
      },
      styles: {
        tableHeader: {
          fillColor: '#55aae0',
          fontSize: 9,
          bold: true,
          lineHeight: 1,
        },
        tableBody: {
          fontSize: 9,
          margin: 0,
          lineHeight: 1
        }
      },
      pageSize: "A4",
      pageMargins: [50,160,50,45]
    };
    if(!clienteDocumento.idEstado){
      dd['watermark'] = { text: 'ANULADO', color: 'red', opacity: 0.5, bold: true, italics: false };
    }
    const docPdf = pdfMake.createPdf(dd);
    //console.log('pdfgenerado', docPdf);
    if(enviarCorreo){
      docPdf.getBase64((data) => {
        const documento = {...clienteDocumento};
        documento.documento = data;
        this.clienteDocumentoService.sendDocument(documento).subscribe((res) =>{
          if(res instanceof ErrorSistema){
            this.spinner.hide();
            this.utilService.mostrarToast(res.message,'error');
          }else{
            this.spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'Documento enviado!!!',
              html: `El documento <b>(D${clienteDocumento.id.toString().padStart(6,'0')}) ${clienteDocumento.nombreDocumento}</b> fue enviado con exito !!`,
              showConfirmButton: true
            });
            this.documentosEmitidos.reload(false);
          }
        }, err => {
          this.spinner.hide();
          console.error(err);
        }, () => {});
      });

    }else{
      this.spinner.hide();
      docPdf.open();
    }

  }
  async insertarTablaZonasPrecio( plantilla: string, documentoCliente: DocumentoCLiente ): Promise<string>{
    await this.promocionService.obtenerDetalle( documentoCliente.idPromocion ).toPromise().then( (res: any[]) => {
      this.listaPromocionPrecioZonas = res;
      //console.log(res);
    }, err => {
      console.error(err)
    });

    let output = '';

    // zonas seleccionadas
    const _idZonas = documentoCliente.zonas.map( z => z.id);
    //  promoción seleccionada
    const _idPromocion = documentoCliente.idPromocion;
    // tabla a insertar
    const _tabla = {
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto'],
        headerRows: 1,
        // keepWithHeaderRows: 1,
        body: [
          [{text: 'ITEM', alignment: 'center center', style: 'tableHeader' }, {text: 'ZONA', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'}, {text: 'SESION', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'}, {text: 'PRECIO', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'}, {text: '', style: 'tableHeader'}, {text: 'SESION', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'}, {text: 'PRECIO', style: 'tableHeader', alignment: 'center'}],
        ]
      }
    };

    // Buscar los precios de las zonas segun la promocion

    _idZonas.forEach((v, i) => {

      // Buscar si se encuentra la zona en la lista de la promocion
      const zona = this.listaPromocionPrecioZonas.find(promoZona => promoZona.idZona === v);
      // Si se encuentra
      if (zona) {
        const row: any = [{text: (i+1), style: 'tableBody'}, {text:zona.zonaCorporal, style: 'tableBody'}, {text: (zona.precioBloques.length >= 1) ? zona.precioBloques[0].columnaBloque : null, alignment: 'center', style: 'tableBody'}, {text: (zona.precioBloques.length >= 1) ? zona.precioBloques[0].precioBloque.toFixed(2) + '' : null, alignment: 'right', style: 'tableBody'}, {text:'', style: 'tableBody'}, {text:zona.precioBloques.length >= 2 ? zona.precioBloques[1].columnaBloque : null, alignment: 'center', style: 'tableBody'}, { text:zona.precioBloques.length >= 2 ? zona.precioBloques[1].precioBloque.toFixed(2) : null, alignment: 'right', style: 'tableBody'}];
        _tabla.table.body.push(row);
      }
    });
    let _plantilla = JSON.parse(plantilla);
    _plantilla.forEach( (line, index) => {
      if(JSON.stringify(line).includes('@tblzonas')){
        _plantilla[index] = _tabla;
        _plantilla[(index+1)].margin[1] = 15;
      }
    });

    output = JSON.stringify(_plantilla);

    return output;
  }
  visualizarOpciones( modal, documento: DocumentoCLiente ): void{
    this.documentoSelected = documento;
    this.modalService.open(this.modalOpcionesDocumento);
  }
  visualizarDocumento(): void{
    this.spinner.show();
    this.clienteDocumentoService.getDocumentById(this.documentoSelected.id).subscribe((res) => {
      if(res instanceof ErrorSistema){
        this.spinner.hide();
        this.utilService.mostrarToast(res.message,'error');
      }else{
        //console.log(res);
        this.renderDocumento(res);
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
    //this.viewPdf.nativeElement.src = 'data:application/pdf;base64, '+ this.documentoSelected.pdf;
    //modal.show();
  }
  anularDocumento( modal ): void{
    this.modalDocumentoAnularRef = this.utilService.abrirModal(modal, 'md');
    this.modalDocumentoAnularRef.result.then((result: DocumentoCLiente) => {
      if (result){
        Swal.fire({
          icon: 'success',
          title: 'Documento anulado!!!',
          html: `El documento <b>(D${result.id.toString().padStart(6,'0')}) ${result.nombreDocumento}</b> fue anulado !!`,
        });
        this.documentosEmitidos.reload();
        this.documentosEmitidosAnulados.reload();
      }
    });
  }
  restaurarDocumento(): void{
    const id = this.documentoSelected.id;
    Swal.fire({
      title: 'Restaurar documento',
      html: `¿Desea restaurar el documento <b>(D${id.toString().padStart(6,'0')}) ${this.documentoSelected.nombreDocumento}</b>?`,
      icon: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(
      result => {
        if(result.isConfirmed) {

          this.spinner.show();

          const doc = {...this.documentoSelected};
          doc.idUsuarioModifico = this.ususarioService.UsuarioActual.idUsuario;

          this.clienteDocumentoService.getDocumentById(this.documentoSelected.id).subscribe(async (doc) => {
            if(doc instanceof ErrorSistema){
              this.utilService.mostrarToast(doc.message,'error');
            }else{

              const _plantilla = doc.plantilla;

              if(!_plantilla){
                this.spinner.hide();
                console.error('El documento no tiene una plantilla definida');
                this.utilService.mostrarToast('El documento no tiene una plantilla definida','warning');
                return;
              }

              doc.enviarCorreo = true;
              doc.idUsuarioModifico = this.ususarioService.UsuarioActual.idUsuario;

              if(doc.idPromocion){

                this.promocionService.obtenerDetalle( doc.idPromocion ).toPromise().then( async (precioZonas: any[]) => {

                  this.listaPromocionPrecioZonas = precioZonas;

                  const plantilla = await this.clienteDocumentoService.drawDocument(doc,this.maestroPatologia,this.maestroPromocion,this.listaPromocionPrecioZonas);
                  const docPdf = await this.pdfMakeService.create(JSON.parse(plantilla), 0);
                  // docPdf.open();
                  docPdf.getBase64( async (pdfBase64) => {
                    const documento = {...doc};
                    documento.documento = await pdfBase64;

                    this.subscriptionRestoreDocument = this.clienteDocumentoService.restoreDocument(id, documento).subscribe((res) => {
                      if( res instanceof ErrorSistema){
                        this.spinner.hide();
                        this.utilService.mostrarToast('Ocurrio un error','error');
                      }else{
                        this.spinner.hide();
                        Swal.fire({
                          icon: 'success',
                          title: 'Documento restaurado',
                          html: `El documento <b>(D${res.id.toString().padStart(6,'0')}) ${res.nombreDocumento}</b> fue restaurado !!`,
                        });
                      }
                    }, err => {
                      this.spinner.hide();
                      console.error(err);
                    }, () => {
                      this.documentosEmitidos.reload();
                      this.documentosEmitidosAnulados.reload();
                    });

                  });

                }, err => {
                  this.spinner.hide();
                  console.error(err)
                });

              }else{

                const plantilla = await this.clienteDocumentoService.drawDocument(doc,this.maestroPatologia,this.maestroPromocion);
                const docPdf = await this.pdfMakeService.create(JSON.parse(plantilla),0);
                //docPdf.open();
                docPdf.getBase64( async (pdfBase64) => {
                  const documento = {...doc};
                  documento.documento = await pdfBase64;

                  this.subscriptionRestoreDocument = this.clienteDocumentoService.restoreDocument(id, documento).subscribe((res) => {
                    if( res instanceof ErrorSistema){
                      this.spinner.hide();
                      this.utilService.mostrarToast('Ocurrio un error','error');
                    }else{
                      this.spinner.hide();
                      Swal.fire({
                        icon: 'success',
                        title: 'Documento restaurado',
                        html: `El documento <b>(D${res.id.toString().padStart(6,'0')}) ${res.nombreDocumento}</b> fue restaurado !!`,
                      });
                    }
                  }, err => {
                    this.spinner.hide();
                    console.error(err);
                  }, () => {
                    this.documentosEmitidos.reload();
                    this.documentosEmitidosAnulados.reload();
                  });

                });

              }
            }

          });

        }
      }
    );
  }
  enviarDocumentoCorreo(): void{
    const id = this.documentoSelected.id;
    Swal.fire({
      title: 'Enviar documento',
      html: `¿Desea enviar el documento <b>(D${id.toString().padStart(6,'0')}) ${this.documentoSelected.nombreDocumento}</b> al cliente?`,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(
      result => {
        if(result.isConfirmed) {
          this.spinner.show();

          this.clienteDocumentoService.getDocumentById(this.documentoSelected.id).subscribe((res) => {
            if(res instanceof ErrorSistema){
              this.spinner.hide();
              this.utilService.mostrarToast(res.message,'error');
            }else{
              // console.log(res);
              this.renderDocumento(res,true);
            }
          }, error => {
            this.spinner.hide();
            console.log(error);
          });

        }
      }
    );
  }

  listarPromociones(): void{
    this.promocionService.obtenerByServicio(1,0).subscribe((res) => {
      this.maestroPromocion = res;
    }, error => {
      console.log(error);
    })
  }

}
