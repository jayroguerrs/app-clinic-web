import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit, TemplateRef} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { ClienteFirmaComponent } from '../cliente-firma/cliente-firma.component';
import {Subject, Subscription} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteImportClass } from 'src/app/shared/models/cliente';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { CitaImportClass } from '../../../shared/models/cita';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccionCita } from 'src/app/shared/enumeracion/enums';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {MdlAgendarCitaComponent} from "../../modals/mdl-agendar-cita/mdl-agendar-cita.component";
import {Usuario} from "../../../shared/models";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  templateUrl: 'cliente-listado.component.html',
  styleUrls: ['cliente-listado.component.scss'],
})
export class ClienteListadoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modalClienteDatos', {static: false}) modalClienteDatos: NgbModalRef;
  @ViewChild(ClienteFirmaComponent, {static: false}) clienteFirmaComponentModal: ClienteFirmaComponent;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChild('sPad', {static: true}) signaturePadElement; //: ElementRef<HTMLCanvasElement>;
  signaturePad: any;
  @ViewChild('exampleFirma', {static: false}) exampleFirmaModal : any;
  modalClienteDatosRef: NgbModalRef;
  modalClienteFirmaRef: NgbModalRef;
  idCliente = 0;
  clienteDataExport: ClienteImportClass;
  citaDataExport: CitaImportClass;
  nombresCompletos = '';
  celular1 = '';
  celular2 = '';
  numeroDocumento = '';
  dtResponsiveOptions: any = {};
  frmFiltroGrilla: FormGroup;
  maestroDepartamento: any[];
  maestroGenero: any[];
  maestroDocumentoIdentidadTipo: any[];
  maestroMedioContacto: any[];
  dtTrigger: Subject<any> = new Subject();
  serieFirma: any;
  mostrarOpcionesPorSeleccion: boolean;
  usuarioActual: Usuario;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  numClientes = 0;
  buscado = false;

  // Subscription
  subscriptionUpdateFirm: Subscription;
  collectionSubscription: Subscription;
  datosMaestroSubscription: Subscription;

  // Datatable
  dataTable: any;
  selected = 0;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;
  @ViewChild('modalClienteDatos') modalCrearCliente: any; 

  // Permisos
  accTot: boolean = false;  
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;

  clienteNuevoNumero: string = '';
  constructor(
      private usuarioService: UsuarioService,
      private clienteService: ClienteService,
      private formBuilder: FormBuilder,
      private utilsService: UtilsService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private spinner: NgxSpinnerService,
      private bottomSheet: MatBottomSheet,
      private modalService: NgbModal,
      private permisoHelper: PermisoHelper
  ) {}
  actualizarImagen(): void {
    if (this.signaturePad.isEmpty()) {
      this.utilsService.mostrarToast('Ingrese una firma', 'warning');
    } else {
      const model= {
        id : this.idCliente,
        SerieFirma:  this.signaturePad.toDataURL(),
        SerieHuella:  '0',
      };
      this.subscriptionUpdateFirm = this.clienteService.actualizarFirma(model).subscribe(resultado => {
        this.clienteListarBoton();
        this.utilsService.mostrarToast('Cliente actualizado', 'success');
        this.exampleFirmaModal.hide()
      });
    }
  }
  limpiarCanvas(): void {
    this.signaturePadElement.nativeElement.getContext('2d').clearRect(0, 0, this.signaturePadElement.nativeElement.width, this.signaturePadElement.nativeElement.height);
  }
  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.cargarDatosMaestros();
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;      
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;  
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();

    // Destroy subscription
    if( this.collectionSubscription ){this.collectionSubscription.unsubscribe();}
    if( this.datosMaestroSubscription ){this.datosMaestroSubscription.unsubscribe();}
    if( this.subscriptionUpdateFirm ){this.subscriptionUpdateFirm.unsubscribe();}

    // Destroy modals
    if( this.modalClienteDatosRef ){ this.modalClienteDatosRef.close(); }
    if( this.modalClienteFirmaRef ){ this.modalClienteFirmaRef.close(); }

    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }

    // Destroy datatable
    if(this.dataTable){ this.dataTable.destroy(true);}

    this.spinner.hide();
  }
  ngAfterViewInit(): void{
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes ) {
        _this.selected = dtInstance.rows( { selected: true } ).count() ;
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];

          _this.idCliente = data.id;
          _this.serieFirma = data.serieFirma;
          _this.clienteDataExport = new ClienteImportClass();
          _this.clienteDataExport.id = _this.idCliente;
          _this.clienteDataExport.nombres = data.nombres;
          _this.clienteDataExport.apellidos = data.apellidos;
          _this.clienteDataExport.nombresCompletos = data.nombresCompletos;
          _this.clienteDataExport.numerosCelulares = data.celular1 + ' - ' + data.celular2;
          _this.clienteDataExport.celular1 = data.celular1;
          _this.clienteDataExport.celular2 = data.celular2;
          _this.clienteDataExport.documento = data.documento;
          _this.citaDataExport = new CitaImportClass();
          _this.citaDataExport.cliente = _this.clienteDataExport;
          _this.citaDataExport.accionCita =  AccionCita.NUEVA;

          _this.verOpciones();
        }
      });

      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.idCliente = 0;
        _this.selected = dtInstance.rows( { selected: true } ).count() ;
      });
    });

    //cuando se desea crear nuevo cliente desde otro componente
    let parametro = this.activatedRoute.snapshot.params.id;
    parametro = (parametro != undefined) ? parseInt(parametro, 10) : parametro;
    if (parametro === 0) {
      this.clienteNuevo(this.modalClienteDatos);
    } else if (parametro > 1) {
      this.idCliente = parametro
      this.clienteEditar(this.modalClienteDatos);
    } else if(parametro === undefined) { }

    this.abrirModalCcvoxCrearCliente();
  }

  abrirModalCcvoxCrearCliente(){
    this.activatedRoute.queryParams.subscribe(params => {
      const newClient = params['newClient']; 
      const clientNumber = params['clientNumber']; 

      if (newClient === 'true') {
        this.clienteNuevoNumero = clientNumber ;
        this.clienteNuevo(this.modalCrearCliente);

        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {},
        });
      }
    });
  }

  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        if(this.frmFiltroGrilla.controls.filterCliente.value != '') {
          this.spinner.show();
          this.collectionSubscription?.unsubscribe();
          this.collectionSubscription = this.clienteService.obtenerPorFiltro(this.frmFiltroGrilla.controls.filterCliente.value).subscribe(
            data => {
              this.buscado = true
              this.numClientes = data.length;
              callback({ data });
              this.spinner.hide();
            },
            error => {
              console.log('Error al obtener clientes', error);
              this.spinner.hide();
            }
          );
        } else {
          callback({ data: [] });
        }
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
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'Id',                  data: 'id',               width: '4%',    visible: false   },
        { title: 'NOMBRES Y APELLIDOS', data: 'nombresCompletos', width: '20%'     },
        { title: 'H.C.',                data: 'idHistoriaClinica', width: '10%'     },
        { title: 'DOCUMENTO',           data: 'documento',        width: '5%'       },
        { title: 'SEUDONIMO',           data: 'seudonimo',        width: '10%'     },
        { title: 'GENERO',              data: 'genero',           width: '10%'     },
        { title: 'CELULAR 1',           data: 'celular1',         width: '5%'     },
        { title: 'CELULAR 2',           data: 'celular2',         width: '5%'     },
        { title: 'CORREO',              data: 'correo',           width: '10%'     },
        { title: 'MEDIO DE CONTACTO',   data: 'medioContacto',    width: '10%'     },
        { title: 'ESTADO',              data: 'idEstado',         width: '5%',    render: (data: number) => { return (data === 1) ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>'; } },
        { title: 'NACIMIENTO',          data: 'fechaNacimiento',  width: '5%',   render: (data: any) => { return (data != null) ? `<span>${ this.utilsService.formato_FechaString(data) }</span>`: ''; } },
        { title: 'PUBLICIDAD',          data: 'publicidad',       width: '10%',  visible: false      },
        { title: 'UBICACION',           data: 'idUbicacion',      width: '5%',  visible: false     },
        { title: 'FECHA REGISTRO',      data: 'fechaRegistra',      visible: true,  render: (data: any) => { return `<span>${ this.utilsService.formato_FechaHoraUniversalSQL2(data) }</span>`; }     },
        { title: 'REGISTRADO POR',      data: 'usuarioRegistra',    visible: true     },
      ],
      serverSide: false,
      processing: false,
      pageLength: 10,
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
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todo"]]
    };
  }
  cargarDatosMaestros(): void {
    this.datosMaestroSubscription = this.clienteService.obtenerDatosMaestros().subscribe(
      resultado => {
        this.maestroGenero = resultado.maestroGenero;
        this.maestroDocumentoIdentidadTipo = resultado.maestroDocumentoIdentidadTipo;
        this.maestroMedioContacto = resultado.maestroMedioContacto;
        this.maestroDepartamento = resultado.maestroDepartamento;
      }
    ),
    error => console.log('Error al obtener los datos maestros de cliente', error)
  }
  inicializarFormulario(): void{
    this.frmFiltroGrilla = this.formBuilder.group({ filterCliente: [''] });
  }
  clienteListar( event: KeyboardEvent = null ): void{
    if(event){
      if(event.keyCode === 13) {
        this.dataTable.ajax.reload();
      }
    }else{
      this.dataTable.ajax.reload();
    }
  }
  clienteListarBoton(): void{
      this.selected = 0;
      this.dataTable.ajax.reload();
  }
  clienteNuevo(modal: any, numeroCliente: string = ''): void{
    this.idCliente = 0;
    this.modalClienteDatosRef = this.utilsService.abrirModal(modal, 'xl');
    this.modalClienteDatosRef.result.then(result => this.clienteListarBoton());
  }
  clienteEditar(modal: any): void{
    if(!this.selected){
      this.utilsService.mostrarToast('Seleccione un cliente','warning');
      return;
    }

    this.modalClienteDatosRef = this.utilsService.abrirModal(modal, 'xl');
    this.modalClienteDatosRef.result.then(result => this.clienteListarBoton());
  }

  citaNueva(): void {

    if(!this.selected){
      this.utilsService.mostrarToast('Seleccione un cliente','warning');
      return;
    }

    const modalRef = this.modalService.open(MdlAgendarCitaComponent,{size: 'lg', windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false,  animation: true, backdrop: "static" });
    modalRef.componentInstance.idCliente = this.idCliente;
    modalRef.result.then((res: boolean) => {});

    //const citaNueva = 0;
    //this.router.navigate([]).then(result => {  window.open(`Cita/${citaNueva}/${AccionCita.NUEVA}/${this.idCliente}`, '_blank'); });
    //this.router.navigate([]).then(result => {  window.open(`Cliente/${this.idCliente}/AgendarCita`, '_blank'); });
  }
  clientePerfil(): void {
    // this.router.navigate(['ClientePerfil'], { queryParams: { id: this.clienteDataExport.id } }).then(() => { });
    // this.router.navigate(['ClientePerfil/' + this.clienteDataExport.id]).then();
    if(!this.selected){
      this.utilsService.mostrarToast('Seleccione un cliente','warning');
      return;
    }
    this.router.navigate([]).then(result => {  window.open('ClientePerfil/' + this.clienteDataExport.id, '_blank'); });
  }
  clienteFirma(modal: any): void {
    this.modalClienteFirmaRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalClienteDatosRef.result.then(result => this.clienteListarBoton());
  }

  setIdCliente( id: number ): void{
    this.idCliente = id;
  }

  // Menu Mobile
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }
}
