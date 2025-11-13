import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from 'src/app/shared/services/funciones/utils.service';
import {DocumentoService} from 'src/app/shared/services/documento.service';
import {PromocionService} from 'src/app/shared/services/promocion.services';
import {PatologiaService} from 'src/app/shared/services/patologia.service';
import {Meses, TiposDocumento} from 'src/app/shared/enumeracion/enums';
import Swal from 'sweetalert2';
import {Usuario} from 'src/app/shared/models/usuario';
import {UsuarioService} from 'src/app/shared/services/usuario.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {DocumentoIdentidadTipoService} from "../../../../shared/services/documento-identidad-tipo.service";
import {DocumentoTipoIdentidad} from "../../../../shared/models/documento-tipo-identidad";
import {Cliente} from 'src/app/shared/models/cliente';
import {ClienteDocumentoService} from "../../../../shared/services/cliente-documento.service";
import {ErrorSistema} from 'src/app/shared/models/error-sistema';
import {DocumentoCLiente} from "../../../../shared/models/documento";
import {DatePipe} from "@angular/common";
import {PdfmakeService} from "../../../../shared/services/pdfmake.service";
import {ServicioService} from "../../../../shared/services/servicio.service";
import {Servicio} from "../../../../shared/models/servicio";
import {DocumentoTipoService} from "../../../../shared/services/documento-tipo.service";
// import pdfFonts from 'src/app/shared/fonts/build/custom-fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-documento-datos',
  templateUrl: './documento-datos.component.html',
  styleUrls: ['./documento-datos.component.scss']
})
export class DocumentoDatosComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() cliente: Cliente = null;
  @Input() modal: NgbModalRef;
  @Output() eventoDocumentoListar: EventEmitter<boolean> = new EventEmitter<boolean>();


  maestroDocumentoTipo: any[] = [];
  maestroDocumentoTipoNgSelect: Array<{id: string, text: string}> = [];

  maestroPromocion: any[] = [];
  maestroPromocionNgSelect: Array<{id: string, text: string}> = [];
  maestroPatologia: any[] = [];
  frmDocumento: FormGroup;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  submitted = false;
  idGeneroCliente: number = 0;
  idCliente: number = 0;
  listaZonasSeleccionadas: any[] = [];
  usuarioActual: Usuario;
  idsZonasConcatenadas: string = '';
  listaPromocionPrecioZonas: any[] = [];

  mostrarPromocion: boolean = false;
  mostrarZonas: boolean = false;
  mostrarDatosApoderados: boolean = false;
  mostrarPatologia: boolean = false;
  mostrarDoctora: boolean = false;
  mostrarDescripcionComentario: boolean = false;
  mostrarSesionAdicional: boolean = false;
  mostrarIntervaloMantenimiento: boolean = false;
  mostrarConsultaMantenimientoEn: boolean = false;
  mostrarOpcionesRetSes: boolean = false;
  mostrarFecha = false;
  mostrarCondiciones = false

  // Subscription
  sbcFormulario: Subscription;
  sbcCollectionTipoDocumento: Subscription;
  sbcCollectionPromocion: Subscription;
  sbcCollectionPatologia: Subscription;
  sbcObtenerDocumentoPlantilla: Subscription;
  sbcPromocionPreciosZonas: Subscription;

  // Modals
  modalClienteListadoRef: NgbModalRef;
  modalZonasSeleccionRef: NgbModalRef;

  // Collections
  colDocumentoTipoIdentidad: DocumentoTipoIdentidad[] = [];

  // Loadings
  ldDocumentoTipoIdentidad = false;

  // Promoción seleccionada
  idPromocion : number = null;

  // Servicio seleccionado
  idServicio: number = 0;

  // Documentos select2
  public patologias: Array<{id: string, text: string}> = [];
  public options: any;

  intervaloMesesMantenimiento  = [{'value':0},{'value':1},{'value':1.5},{'value':2},{'value':3}]

  servicios: Servicio[] = [];
  sbcServicios: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private documentoService: DocumentoService,
    private documentoTipoService: DocumentoTipoService,
    private clienteDocumentoService: ClienteDocumentoService,
    private promocionService: PromocionService,
    private usuarioService: UsuarioService,
    private patologiaService: PatologiaService,
    private spinner: NgxSpinnerService,
    private documentoIdentidadService: DocumentoIdentidadTipoService,
    private datePipe: DatePipe,
    private pdfMakeService: PdfmakeService,
    private servicioService: ServicioService
  ) {
    this.inicializarFormulario();
    this.patologias = [];
    this.options = {
      multiple: true
    }
  }

  ngOnInit(): void {
    this.frmDocumento.get('idServicio').valueChanges.subscribe(res => {
      // 
      this.maestroDocumentoTipo = [];
      this.maestroDocumentoTipoNgSelect = [];
      this.maestroPromocion = [];
      this.maestroPromocionNgSelect= [];
      this.f.idDocumentoTipo.patchValue('');
      this.f.idDocumentoTipo.updateValueAndValidity();
      this.ocultarOpciones();
      this.limpiar();
      if(res){
        this.tipoDocumentoListarByServicio(parseInt(res, 10));
        this.promocionListar(parseInt(res, 10));
        this.idServicio = parseInt(res, 10);
      }
    });


    this.listarServicios();
    this.usuarioActual = this.usuarioService.UsuarioActual;
    // this.tipoDocumentoListar();
    // this.promocionListar();
    this.patologiaListar();

    if (this.cliente){
      this.setValues(this.cliente);
    }
    this.listarDocumentoTipoIdentidad();
  }

  ngOnDestroy(): void {
    // Destroy Subscription
    if( this.sbcFormulario ){ this.sbcFormulario.unsubscribe(); }
    if( this.sbcCollectionTipoDocumento ){ this.sbcCollectionTipoDocumento.unsubscribe(); }
    if( this.sbcCollectionPromocion ){ this.sbcCollectionPromocion.unsubscribe(); }
    if( this.sbcCollectionPatologia ){ this.sbcCollectionPatologia.unsubscribe(); }
    if( this.sbcObtenerDocumentoPlantilla ){ this.sbcObtenerDocumentoPlantilla.unsubscribe(); }
    // Destroy Modals
    if( this.modalZonasSeleccionRef ){ this.modalZonasSeleccionRef.close(); }
    if( this.modalClienteListadoRef ){ this.modalClienteListadoRef.close(); }
  }

  ngAfterViewInit(): void {
    // Evento Change Controls
    this.frmDocumento.controls.idPromocion.valueChanges.subscribe(value => {
      this.frmDocumento.controls.zonasSeleccionadas.setValue('');
      this.idsZonasConcatenadas = '';
      this.listaZonasSeleccionadas = [];
    });
  }

  setValues(cliente: Cliente): void{
    this.frmDocumento.patchValue({
      cliente: cliente.nombres + " " + cliente.apellidos,
      numeroDocumento: cliente.documentoIdentidad?.documento,
      idTipoDocumentoIdentidad: cliente.documentoIdentidad?.tipoDocumento,
    });
    this.idGeneroCliente = cliente.idGenero == null ? 0 : cliente.idGenero;
    this.idCliente = cliente.id;
  }

  tipoDocumentoListarByServicio(idServicio: number): void {
    this.sbcCollectionTipoDocumento = this.documentoTipoService.obtenerListadoByServicio(idServicio).subscribe(
      resultado => {

        this.maestroDocumentoTipo = resultado;
        this.maestroDocumentoTipoNgSelect = resultado.map( (dt) => {
          return {
            id: dt.id,
            text: `${dt.nombre}${dt.tipoEmisor == null ? '' : (dt.tipoEmisor == 1 ? ' - Especialista' : ' - Doctora') }`
          };
        });
      },
      error => {
        
      }
    );
  }
  promocionListar(idServicio: number = 1): void {
    this.sbcCollectionPromocion = this.promocionService.obtenerByServicio(1, idServicio).subscribe(
      resultado => {
        this.maestroPromocion = resultado;
        this.maestroPromocionNgSelect = resultado.map( (p: any) => {
          return {
            id: p.idPromocion,
            text: p.descripcion
          };
        });
      },
      error => {
        
      }
    );
  }
  patologiaListar(): void {
    this.sbcCollectionPatologia = this.patologiaService.obtenerListado().subscribe(
      (resultado: any[]) => {
        this.maestroPatologia = resultado;

        //

        const patologias: Array<{id: string, text: string}> = [];
        resultado.forEach((p: any) => {
          const patologia = {
            id: p.id,
            text: p.nombre
          };
          patologias.push(patologia);
          patologias.sort(function (a, b) {
            if (a.text > b.text) {
              return 1;
            }
            if (a.text < b.text) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
        });
        this.patologias = patologias;

      },
      error => {
        
      }
    );
  }
  inicializarFormulario(): void {
    this.frmDocumento = this.formBuilder.group({
      cliente: new FormControl('', Validators.required),
      doctora: [{value: '', disabled: true}],
      idTipoDocumentoIdentidad: new FormControl('', Validators.required),
      numeroDocumento: new FormControl('', Validators.required),
      idDocumentoTipo: new FormControl( '', Validators.required ),
      idServicio: new FormControl('', Validators.required),
      idPromocion: new FormControl(''),
      idPatologia: new FormControl([]),
      sesionAdicional: [0],
      intervaloMantenimiento:['1'],
      consultaMantenimientoEn: [0],
      descripcionComentario: new FormControl(null),
      zonasSeleccionadas: new FormControl(''),
      numSesiones: new FormControl(0),
      numSesionesRetroceder: new FormControl(0),
      enviarCorreo: new FormControl(0, Validators.required),
      dniApoderado: new FormControl(null),
      nombreApoderado: new FormControl(null),
      fechaDocumento: new FormControl(this.datePipe.transform(new Date(),'yyyy-MM-dd')),
      observacion: new FormControl(null),
      condiciones: new FormControl(null)
    });
  }

  limpiar(): void {
    this.frmDocumento.patchValue({
      doctora: [{value: '', disabled: true}],
      idDocumentoTipo: '',
      idPromocion: '',
      idPatologia: [],
      sesionAdicional: 0,
      intervaloMantenimiento:'1',
      consultaMantenimientoEn: 0,
      descripcionComentario: null,
      zonasSeleccionadas: '',
      numSesiones: 0,
      numSesionesRetroceder: 0,
      enviarCorreo: 0,
      dniApoderado:null,
      nombreApoderado: null,
      observacion: null,
      condiciones: null
    });
    this.idsZonasConcatenadas = '';
    this.listaZonasSeleccionadas = [];
  }

  public get meses(): typeof Meses {
    return Meses;
  }
  preguntaGenerarDocumento(): void {

    this.submitted = true;

    //
    //return;

    /*if( this.frmDocumento.valid ){
      
    }else{
      
    }*/

    if( !this.frmDocumento.valid ){
      this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
      return;
    }


    const nombreDocumento = this.maestroDocumentoTipo.find(x => x.id == parseInt(this.frmDocumento.controls.idDocumentoTipo.value))?.titulo;
    // 
    Swal.fire({
      title: 'Emitir documento',
      html: '¿Desea emitir el documento <b>' + nombreDocumento + '</b>?',
      icon: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(
      result => {
        if(result.isConfirmed) { this.generarDocumento(); }
      }
    );
  }

  generarDocumento(): void {

    this.spinner.show();

    const tipoDocumento = parseInt(this.frmDocumento.controls.idDocumentoTipo.value, 10);
    const documento: DocumentoCLiente = new DocumentoCLiente();
    documento.idDocumentoTipo = tipoDocumento;

    this.sbcObtenerDocumentoPlantilla = this.documentoService.obtenerDocumentoPlantilla(tipoDocumento).subscribe(
      async resultado => {

        try {
          if(!resultado.plantilla){
            console.error('El documento no tiene una plantilla definida');
            this.utilsService.mostrarToast('El documento no tiene una plantilla definida','warning');
            this.spinner.hide();
            return;
          }

          documento.plantilla = resultado.plantilla;
          documento.nombreCliente = this.f.cliente.value;
          documento.distrito = this.cliente.distrito;
          documento.direccion = this.cliente.direccion;
          documento.documentoIdentidad = this.f.numeroDocumento.value;
          documento.idZonas =  this.f.zonasSeleccionadas.value || null;
          documento.zonas = this.listaZonasSeleccionadas.map( z => {
            return {
              id: z.idZonaCorporal,
              nombre: z.descripcion
            }
          }) || [];
          documento.dniApoderado = this.f.dniApoderado.validator ? this.f.dniApoderado.value : null;
          documento.nombreApoderado = this.f.nombreApoderado.validator ? this.f.nombreApoderado.value : null;
          documento.fechaNacimiento = this.cliente.fechaNacimiento;
          documento.idPromocion = this.f.idPromocion.valid ? parseInt( this.f.idPromocion.value, 10) : null;
          documento.numeroSesionesRetroceder = this.f.numSesionesRetroceder.validator ? parseInt( this.f.numSesionesRetroceder.value, 10) : null;
          documento.numeroSesiones = this.f.numSesiones.validator ? parseInt( this.f.numSesiones.value, 10) : null;
          documento.sesionesAdicionales = this.f.sesionAdicional.validator ? parseInt(this.f.sesionAdicional.value) : null;
          documento.intervaloMantenimiento = this.f.intervaloMantenimiento.validator ? parseInt(this.f.intervaloMantenimiento.value) : null;
          documento.consultaMantenimientoEn = this.f.consultaMantenimientoEn.validator ? parseInt( this.f.consultaMantenimientoEn.value ) : null;
          documento.idPatologia = this.f.idPatologia.validator ? this.f.idPatologia.value.join(",") : null;
          documento.patologias = [];
          documento.observacion = this.f.observacion.value;
          documento.condiciones = this.f.condiciones.validator ? this.f.condiciones.value : null;
          documento.fechaRegistra = new Date();
          documento.fechaDocumento = this.f.fechaDocumento.validator ? new Date(this.f.fechaDocumento.value+'T00:00:00') : null;

          const _plantillaInsertada = await this.clienteDocumentoService.drawDocument(documento,this.maestroPatologia,this.maestroPromocion,this.listaPromocionPrecioZonas);

          const docPdf = await this.pdfMakeService.create(JSON.parse(_plantillaInsertada));
          docPdf.getBase64((pdfBase64) => {
            this.grabarDocumento(pdfBase64);
          });
        }catch (e) {
          
        }

      },error => {
        this.spinner.hide();
        this.utilsService.mostrarToast('Ocurrio un error','warning');
        
      });
 }



  grabarDocumento( pdfBase64: string ): void {
    
    this.sbcFormulario = this.clienteDocumentoService.createDocument(this.documento(pdfBase64)).subscribe(
      async (resultado) => {

        if(resultado instanceof ErrorSistema){
          await this.spinner.hide();
          this.cerrarModal(false);
          this.utilsService.mostrarToast(resultado.message, 'error');
        }else{
          await this.spinner.hide();
          // 
          Swal.fire({
            title: 'Documento emitido!!!',
            html: `El documento <b>(D${resultado.id.toString().padStart(6,'0')}) ${resultado.nombreDocumento}</b> se emitio correctamente!!!` + (resultado.mensajeAviso ? `<br>${resultado.mensajeAviso}` : ''),
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            cancelButtonText: 'Ver Documento'
          }).then( async (result) => {
            if (!result.isConfirmed) {
              //
              await this.spinner.show();

              const _plantillaInsertada = await this.clienteDocumentoService.drawDocument({...resultado},this.maestroPatologia,this.maestroPromocion,this.listaPromocionPrecioZonas);
              const docPdf = await this.pdfMakeService.create(JSON.parse(_plantillaInsertada));
              // const docPdf = await this.pdfMakeService.create(JSON.parse(_plantillaInsertada.replace(/\s+/g,"")));
              docPdf.open();
              await this.spinner.hide();
            }
          });
          await this.spinner.hide();
          this.eventoDocumentoListar.emit();
          this.cerrarModal(true);
        }

      },
      error => {
        
        Swal.fire({title: 'Error', html: 'Error al registrar documento', icon: 'error'});
        this.spinner.hide();
      }, () => {}
    );
  }

  documento(pdfBase64: string = ''): any {
    // 
    let idPatologia: string = null;
    let idPromocion: number = null;
    let numeroSesiones: number = 0;
    let numeroSesionesRetroceder: number = 0;
    let sesionesAdicionales: number = 0;
    let intervaloMantenimiento: number = 0;
    let consultaMantenimientoEn: number = 0;
    let descripcionComentario: string = null;
    let idDoctora: number = null;
    let condiciones: string = null;
    let documento = pdfBase64;
    let dniApoderado: string = null;
    let nombreApoderado: string = null;

    let fechaDocumento: string = null;
    let plantilla: string = null;

    const idTipoDocumento = parseInt(this.frmDocumento.controls.idDocumentoTipo.value, 10);

    /*if( [
      TiposDocumento.CONS_INFO_EMPR_DOCT
    ].includes(idTipoDocumento) ){
      descripcionComentario = this.frmDocumento.controls.descripcionComentario.value;
    }*/

    if( [
      TiposDocumento.TRAN_EXTR
    ].includes(idTipoDocumento) ){
      fechaDocumento = this.frmDocumento.controls.fechaDocumento.value;
    }

    if( [
      TiposDocumento.CONS_INFO_MENO_EDAD_DOCT,
      TiposDocumento.CONS_INFO_MENO_EDAD_ACLARA
    ].includes(idTipoDocumento) ){
      dniApoderado = this.f.dniApoderado.value;
      nombreApoderado = this.f.nombreApoderado.value;
    }

    if( [
      TiposDocumento.EXEC_RESPONSABILIDAD
    ].includes(idTipoDocumento) ){
      condiciones = this.f.condiciones.value;
    }

    switch(parseInt(this.frmDocumento.controls.idDocumentoTipo.value, 10)){


      // Contrato sin garantia
      case TiposDocumento.CONT_SIN_GARAN_DOCT:{
        break;
      }

      // Consentimiento informado menor de edad especialista
      case TiposDocumento.CONS_INFO_MENO_EDAD_ESPE:
      case  TiposDocumento.CONS_INFO_MENO_EDAD_ACLARA:{
        dniApoderado = this.f.dniApoderado.value;
        nombreApoderado = this.f.nombreApoderado.value;
        break;
      }

      // Contrato servicio de depilación
      case TiposDocumento.CONT_SERV_DEPI:
      case TiposDocumento.CONT_SERV_ACLARA:
      case TiposDocumento.CONT_MATCH_ACLARA_DEPIL:
      case TiposDocumento.CONT_SERV_DEPIV2:
      case TiposDocumento.CONT_SERV_DEPIV3:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL1:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL2:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL3:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL4:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL5:
      case TiposDocumento.CONT_SERV_CORP360:
      case TiposDocumento.CONT_SERV_DEPIV3_2025:{
        idPromocion = parseInt( this.frmDocumento.controls.idPromocion.value, 10);
        break;
      }
      // Contrato servicio de depilación ( retroceso de sesion )
      /*case TiposDocumento.CONT_RETR_SESI_ESPE:{
        sesionesAdicionales = this.frmDocumento.controls.sesionAdicional.value;
        break;
      }*/

      // Contrato servicio de depilación ( retroceso de sesion )
      case TiposDocumento.CONT_RETR_SESI_DOCT:{
        numeroSesiones = this.frmDocumento.controls.numSesiones.value;
        numeroSesionesRetroceder = this.frmDocumento.controls.numSesionesRetroceder.value;
        break;
      }

      // Constancia de mantenimiento de especialista
      case TiposDocumento.CONS_MANT_ESPE:{
        sesionesAdicionales = this.frmDocumento.controls.sesionAdicional.value;
        intervaloMantenimiento = parseInt(this.frmDocumento.controls.intervaloMantenimiento.value, 10);
        consultaMantenimientoEn = this.frmDocumento.controls.consultaMantenimientoEn.value;
        break;
      }
      // Constancia de retoque de especialista
      /*case TiposDocumento.CONS_RETO_ESPE:{
        descripcionComentario = this.frmDocumento.controls.descripcionComentario.value;
        break;
      }*/
      // Constancia de mantenimiento doctora
      case TiposDocumento.CONS_MANT_DOCT:{
        sesionesAdicionales = this.frmDocumento.controls.sesionAdicional.value;
        intervaloMantenimiento = parseInt(this.frmDocumento.controls.intervaloMantenimiento.value, 10);
        consultaMantenimientoEn = this.frmDocumento.controls.consultaMantenimientoEn.value;
        idDoctora = this.usuarioActual.idUsuario;
        break;
      }
      // Constancia retoque doctora
      case TiposDocumento.CONS_RETO_DOCT:{
        //descripcionComentario = this.frmDocumento.controls.descripcionComentario.value;
        idDoctora = this.usuarioActual.idUsuario;
        break;
      }
      // Consentimiento informado empresa patologia doctora
      case TiposDocumento.CONS_INFO_EMPR_DOCT:{
        idPatologia = this.frmDocumento.controls.idPatologia.value.join(',');
        break;
      }
      // Consentimiento informado general especialista
      case TiposDocumento.CONT_INFO_GENE_ACLARA:
      case TiposDocumento.CONS_INFO_GENE_ESPE:{
        idPatologia = this.frmDocumento.controls.idPatologia.value.join(',');
        //descripcionComentario = this.frmDocumento.controls.descripcionComentario.value;
        idDoctora = this.usuarioActual.idUsuario;
        break;
      }
      // Constancia de alta media especialista
      case TiposDocumento.CONS_ALTA_MEDI_ESPE:{
        break;
      }
      // Constancia de alta media doctora
      case TiposDocumento.CONS_ALTA_MEDI_DOCT:{
        idDoctora = this.usuarioActual.idUsuario;
        break;
      }
      default: break;
    }
    // 
    //   'form data',
    //   this.maestroDocumentoTipo,
    //   this.frmDocumento.controls.idDocumentoTipo.value,
    //   this.maestroDocumentoTipo.find( dt => dt.id === parseInt(this.frmDocumento.controls.idDocumentoTipo.value, 10) )?.version
    // );
    return {
      idCliente: this.idCliente,
      idDocumentoTipo: parseInt(this.frmDocumento.controls.idDocumentoTipo.value, 10),
      numeroDocumento: this.frmDocumento.controls.numeroDocumento.value,
      idPromocion,
      idsZonas: this.idsZonasConcatenadas,
      idPatologia,
      numeroSesiones,
      sesionesAdicionales,
      intervaloMantenimiento,
      consultaMantenimientoEn,
      descripcionComentario,
      numeroSesionesRetroceder,
      idDoctora,
      documento,
      idEstado: 1,
      observacion: this.f.observacion.value,
      enviarCorreo: !! parseInt(this.f.enviarCorreo.value, 10),
      version: this.maestroDocumentoTipo.find( dt => dt.id === parseInt(this.frmDocumento.controls.idDocumentoTipo.value, 10) )?.version,
      dniApoderado,
      nombreApoderado,
      fechaDocumento,
      condiciones,
      plantilla,
      idUsuarioRegistro: this.usuarioActual.idUsuario
    };
  }
  get f() {
    return this.frmDocumento.controls;
  }
  cerrarModal( output: boolean = false ): void {
    this.modal.close( output );
  }
  abrirClienteLista(modalx: NgbModalRef): void {
    this.modalClienteListadoRef = this.utilsService.abrirModal(modalx, 'lg');
  }
  abrirZonaSeleccion(modalx: NgbModalRef): void {
    this.modalZonasSeleccionRef = this.utilsService.abrirModal(modalx, 'md');
  }
  eventoClienteSeleccionado(cliente): void {

    // Verificar si genero seleccionado era igual al anterior
    if( this.idGeneroCliente ){
      if(this.idGeneroCliente !== cliente.idGenero){
        this.frmDocumento.controls.zonasSeleccionadas.setValue('');
        this.idsZonasConcatenadas = '';
        this.listaZonasSeleccionadas = [];
      }
    }

    //

    this.frmDocumento.patchValue({
     cliente: cliente.nombresCompletos,
     numeroDocumento: cliente.documento,
     idTipoDocumentoIdentidad: cliente.tipoDocumento
    });
    this.idGeneroCliente = cliente.idGenero == null ? 0 : cliente.idGenero;
    this.idCliente = cliente.id;

  }
  eventoZonasSeleccionadas(zonas): void {
    if (Array.isArray(zonas)) {
      this.listaZonasSeleccionadas = [...zonas]; // Crear copia para evitar problemas de referencia
    } else {
      this.listaZonasSeleccionadas = [];
    }
  }
  eventoZonasConcatenadas(zonasConcatenadas): void {
    // Asignar valor al control del formulario
    this.frmDocumento.patchValue({
      zonasSeleccionadas: zonasConcatenadas
    });
    
    // Forzar la actualización del formulario
    this.frmDocumento.controls['zonasSeleccionadas'].markAsDirty();
    this.frmDocumento.updateValueAndValidity();
    
    // Detectar cambios manualmente (usando setTimeout para asegurar que se ejecute después del ciclo de detección)
    setTimeout(() => {
      console.log('Valor actual del campo zonasSeleccionadas:', this.frmDocumento.get('zonasSeleccionadas').value);
    }, 0);
  }
  eventoIdsZonasConcatenadas(idsZonasConcatenadas): void {
    this.idsZonasConcatenadas = idsZonasConcatenadas;
  }
  mostrarOpcionPorTipoDocumentoFormato(event): void {
    
    this.submitted = false;
    this.ocultarOpciones();

    // const idTipoDocumento = parseInt(event.target.value, 10);
    const idTipoDocumento = parseInt(event);


    if( [
      TiposDocumento.CONT_REIN_TRAT_ESPE,
      TiposDocumento.CONT_RETR_SESI_ESPE,
      TiposDocumento.CONS_INFO_MENO_EDAD_DOCT,
      TiposDocumento.CONS_INFO_MENO_EDAD_ACLARA,
      TiposDocumento.CONT_REIN_TRAT_DOCT,
      TiposDocumento.CONT_RETR_SESI_DOCT,
      TiposDocumento.CONT_INFO_GENE_ACLARA
    ].includes(idTipoDocumento) ){
      this.mostrarZonas = true;
    }

    if( [
      TiposDocumento.EXEC_RESPONSABILIDAD
    ].includes(idTipoDocumento) ){
      
      this.mostrarCondiciones = true;
    }

    if( [
      TiposDocumento.CONS_INFO_MENO_EDAD_DOCT,
      TiposDocumento.CONS_INFO_MENO_EDAD_ACLARA,
    ].includes(idTipoDocumento) ){
      this.mostrarDatosApoderados = true;
    }

    if([
      TiposDocumento.TRAN_EXTR
    ].includes(idTipoDocumento)){
      this.mostrarFecha = true;
    }

    if([
      TiposDocumento.CONT_RETR_SESI_DOCT
    ].includes(idTipoDocumento)){
      this.mostrarOpcionesRetSes = true;
    }

    //switch(parseInt(event.target.value, 10)) {
    switch(parseInt(event)) {

      // Contrato sin garantia
      case TiposDocumento.CONT_SIN_GARAN_DOCT: {
        // this.mostrarPromocion = true;
        this.mostrarZonas = true;
        break;
      }

      // Consentimiento hiperpigmentacion
      case TiposDocumento.CONS_INFO_HIPER: {
        // this.mostrarPromocion = true;
        this.mostrarZonas = true;
        break;
      }

      // Consentimiento hiperpigmentacion
      case TiposDocumento.CONS_INFO_OVAR_POLI: {
        // this.mostrarPromocion = true;
        this.mostrarZonas = true;
        break;
      }

      // Transacción extrajudicial
      case TiposDocumento.TRAN_EXTR: {
        // this.mostrarPromocion = true;
        this.mostrarZonas = true;
        break;
      }

      // Contrato de consentimiento informado menor edad especialista
      case TiposDocumento.CONS_INFO_MENO_EDAD_ESPE:
      case TiposDocumento.CONS_INFO_MENO_EDAD_ACLARA:{
        // this.mostrarPromocion = true;
        this.mostrarZonas = true;
        this.mostrarDatosApoderados = true;
        break;
      }

      // Contrato de servicio sin garantia especialistas
      case TiposDocumento.CONT_SIN_GARAN_ESPE: {
        // this.mostrarPromocion = true;
        this.mostrarZonas = true;
        //this.mostrarDatosApoderados = true;
        break;
      }


      // Contrato de servicio de depilación
      case TiposDocumento.CONT_SERV_DEPI:
      case TiposDocumento.CONT_SERV_ACLARA:
      case TiposDocumento.CONT_MATCH_ACLARA_DEPIL:
      case TiposDocumento.CONT_SERV_DEPIV3:
      case TiposDocumento.CONT_SERV_DEPIV2:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL1:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL2:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL3:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL4:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL5:
      case TiposDocumento.CONT_SERV_TRAT_FACIAL:
      case TiposDocumento.CONT_SERV_DEPIV3_2025: {
        this.mostrarPromocion = true;
        this.mostrarZonas = true;
        break;
      }

      case TiposDocumento.CONT_SERV_HOLLYWOOD_PEEL: {
        this.mostrarPromocion = true;
        this.mostrarZonas = true;
        break;
      }

      case TiposDocumento.CONT_SERV_CORP360: {
        this.mostrarPromocion = true;
        this.mostrarZonas = true;
        break;
      }
      // Contrato de servicio de depilación ( retroceso de sesiones )
      case TiposDocumento.CONT_RETR_SESI_ESPE: {
        //this.mostrarOpcionesRetSes = true;
        this.mostrarZonas = true;
        break;
      }
      // Constancia de mantenimiento especialista
      case TiposDocumento.CONS_MANT_ESPE: {
        this.mostrarSesionAdicional = true;
        this.mostrarZonas = true;
        this.mostrarIntervaloMantenimiento = true;
        this.mostrarConsultaMantenimientoEn = true;
        break;
      }
      // Constancia de retoque especialista
      case TiposDocumento.CONS_RETO_ESPE: {
        //this.mostrarDescripcionComentario = true;
        this.mostrarZonas = true;
        break;
      }
      // Constancia de mantenimiento doctora
      case TiposDocumento.CONS_MANT_DOCT: {
        this.mostrarSesionAdicional = true;
        this.mostrarZonas = true;
        this.mostrarIntervaloMantenimiento = true;
        this.mostrarConsultaMantenimientoEn = true;
        break;
      }
      // Constancia de retoque doctora
      case TiposDocumento.CONS_RETO_DOCT: {
        //this.mostrarDescripcionComentario = true;
        this.mostrarZonas = true;
        break;
      }
      // Consentimiento informado general empresa patologia
      case TiposDocumento.CONS_INFO_EMPR_DOCT: {
        this.mostrarZonas = true;
        this.mostrarPatologia = true;
        break;
      }
      // Consentimiento informado general especialista
      case TiposDocumento.CONT_INFO_GENE_ACLARA:
      case TiposDocumento.CONS_INFO_GENE_ESPE : {
        this.mostrarPatologia = true;
        // this.mostrarDescripcionComentario = true;
        this.mostrarZonas = true;
        break;
      }
      // Constancia de alta media especialista
      case TiposDocumento.CONS_ALTA_MEDI_ESPE: {
        this.mostrarZonas = true;
        break;
      }
      // Constancia de alta medica doctora
      case TiposDocumento.CONS_ALTA_MEDI_DOCT: {
        // if(this.usuarioActual.idperfil == TipoPerfil.DOCTORA){
          this.mostrarDoctora = true;
          this.mostrarZonas = true;
          this.frmDocumento.patchValue({
            doctora: this.usuarioActual.nombre
          });
        /*} else {
          this.utilsService.mostrarToast('No es perfil DOCTORA', 'warning');
          this.frmDocumento.patchValue({
            idDocumentoTipo: 0
          });
        }*/
        break;
      }

    }

    const value = parseInt( event );

    // Activar Promociones
    if( [1].includes(value) ){
      this.frmDocumento.get('idPromocion').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('idPromocion').clearValidators();
      this.frmDocumento.get('idPromocion').setErrors(null);
    }

    // Activar la fecha documento
    if([
      TiposDocumento.TRAN_EXTR
    ].includes(idTipoDocumento)){
      this.frmDocumento.get('fechaDocumento').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('fechaDocumento').clearValidators();
      this.frmDocumento.get('fechaDocumento').setErrors(null);
    }

    // Activar las condiciones
    if([
      TiposDocumento.EXEC_RESPONSABILIDAD
    ].includes(idTipoDocumento)){
      this.frmDocumento.get('condiciones').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('condiciones').clearValidators();
      this.frmDocumento.get('condiciones').setErrors(null);
    }

    // Activar datos apoderados
    if( value === TiposDocumento.CONS_INFO_MENO_EDAD_ESPE || value === TiposDocumento.CONS_INFO_MENO_EDAD_DOCT || value === TiposDocumento.CONS_INFO_MENO_EDAD_ACLARA ){
      this.frmDocumento.get('dniApoderado').setValidators(Validators.required);
      this.frmDocumento.get('nombreApoderado').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('dniApoderado').clearValidators();
      this.frmDocumento.get('dniApoderado').setErrors(null);
      this.frmDocumento.get('nombreApoderado').clearValidators();
      this.frmDocumento.get('nombreApoderado').setErrors(null);
    }

    // Activar zonas seleccionadas
    if([
      26,1,2,3,4,5,10,12,13,14,15,
      TiposDocumento.CONT_SIN_GARAN_DOCT,
      TiposDocumento.CONS_INFO_MENO_EDAD_ESPE,
      TiposDocumento.CONS_INFO_MENO_EDAD_ACLARA,
      TiposDocumento.CONS_INFO_HIPER,
      TiposDocumento.CONS_INFO_OVAR_POLI,
      TiposDocumento.TRAN_EXTR,
      TiposDocumento.CONS_INFO_GENE_ESPE,
      TiposDocumento.CONT_SIN_GARAN_ESPE,
      TiposDocumento.CONS_MANT_ESPE,
      TiposDocumento.CONT_REIN_TRAT_ESPE,
      TiposDocumento.CONS_RETO_ESPE,
      TiposDocumento.CONT_RETR_SESI_ESPE,
      TiposDocumento.CONT_REIN_TRAT_DOCT,
      TiposDocumento.CONT_RETR_SESI_DOCT,
      TiposDocumento.CONT_INFO_GENE_ACLARA
    ].includes(value) ){
      this.frmDocumento.get('zonasSeleccionadas').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('zonasSeleccionadas').clearValidators();
      this.frmDocumento.get('zonasSeleccionadas').setErrors(null);
    }

    // Activar descripcion retoque
    /*if( [3,5,13
    ].includes(value) ){
      this.frmDocumento.get('descripcionComentario').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('descripcionComentario').clearValidators();
      this.frmDocumento.get('descripcionComentario').setErrors(null);
    }*/

    // Activar patologia
    if( [12,13,
      TiposDocumento.CONS_INFO_GENE_ESPE,
      TiposDocumento.CONS_INFO_EMPR_DOCT,
      TiposDocumento.CONT_INFO_GENE_ACLARA
    ].includes(value) ){
      this.frmDocumento.get('idPatologia').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('idPatologia').clearValidators();
      this.frmDocumento.get('idPatologia').setErrors(null);
    }

    // Activar opciones retroceso de sesiones
    if( [
      10,
      TiposDocumento.CONT_RETR_SESI_DOCT
    ].includes(value) ){
      this.frmDocumento.get('numSesiones').setValidators(Validators.required);
      this.frmDocumento.get('numSesionesRetroceder').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('numSesiones').clearValidators();
      this.frmDocumento.get('numSesiones').setErrors(null);
      this.frmDocumento.get('numSesionesRetroceder').clearValidators();
      this.frmDocumento.get('numSesionesRetroceder').setErrors(null);
    }

    // Activar sesion adicional, intervalo mantenimiento, consulta mantenimiento en
    if( [TiposDocumento.CONS_MANT_DOCT,TiposDocumento.CONS_MANT_ESPE].includes(value) ){
      this.frmDocumento.get('sesionAdicional').setValidators(Validators.required);
      this.frmDocumento.get('intervaloMantenimiento').setValidators(Validators.required);
      this.frmDocumento.get('consultaMantenimientoEn').setValidators(Validators.required);
    }else{
      this.frmDocumento.get('sesionAdicional').clearValidators();
      this.frmDocumento.get('sesionAdicional').setErrors(null);

      this.frmDocumento.get('intervaloMantenimiento').clearValidators();
      this.frmDocumento.get('intervaloMantenimiento').setErrors(null);

      this.frmDocumento.get('consultaMantenimientoEn').clearValidators();
      this.frmDocumento.get('consultaMantenimientoEn').setErrors(null);
    }


    this.frmDocumento.patchValue({
      idPromocion: '',
      zonasSeleccionadas: ''
    })


    //this.frmDocumento.updateValueAndValidity();

  }
  ocultarOpciones(): void {
    this.mostrarPromocion = false;
    this.mostrarZonas = false;
    this.mostrarPatologia = false;
    this.mostrarDoctora = false;
    this.mostrarDescripcionComentario = false;
    this.mostrarSesionAdicional = false;
    this.mostrarIntervaloMantenimiento = false;
    this.mostrarConsultaMantenimientoEn = false;
    this.mostrarOpcionesRetSes = false;
    this.mostrarDatosApoderados = false;
    this.mostrarFecha = false;
    this.mostrarCondiciones = false;

    this.idPromocion = null;
  }

  obtenerPromocionDetalle( evt ): void
  {
    if(evt){
      this.idPromocion = parseInt(evt, 10);
      this.sbcPromocionPreciosZonas = this.promocionService.obtenerDetalle( evt ).subscribe((res: any[]) => {
        this.listaPromocionPrecioZonas = res;
        // 
      }, err => {
        console.error(err)
      }, () => {});
    }else{
      this.idPromocion = null;
    }
  }


  listarDocumentoTipoIdentidad(): void{
    // Obtener el listado de tipos de documento de identidad
    this.ldDocumentoTipoIdentidad = true;
    this.documentoIdentidadService.obtener().subscribe((res: any[]) => {
      const collection: DocumentoTipoIdentidad[] = [];
      res.forEach((dt) => {
        const ODocIdTipo = new DocumentoTipoIdentidad();
        ODocIdTipo.id = dt.id;
        ODocIdTipo.descripcion = dt.descripcion;
        ODocIdTipo.longitud = dt.longitud;
        ODocIdTipo.abreviatura = dt.abreviatura;
        collection.push( ODocIdTipo );
      });
      this.colDocumentoTipoIdentidad = collection;
    }, err => {
      console.error(err);
    }, () => {
      this.ldDocumentoTipoIdentidad = false;
    });
  }

  // Form events
  async previsualizarDocumento(): Promise<void>{
    this.submitted = true;

    if( !this.frmDocumento.valid ){
      this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
      return;
    }

    // 

    const tipoDocumento = parseInt(this.frmDocumento.controls.idDocumentoTipo.value, 10);
    const documento: DocumentoCLiente = new DocumentoCLiente();
    documento.idDocumentoTipo = tipoDocumento;

    this.spinner.show();
    this.sbcObtenerDocumentoPlantilla = this.documentoService.obtenerDocumentoPlantilla(tipoDocumento).subscribe(
      async resultado => {
        if(!resultado.plantilla){
          console.error('El documento no tiene una plantilla definida');
          this.utilsService.mostrarToast('El documento no tiene una plantilla definida','warning');
          this.spinner.hide();
          return;
        }

        // 

        documento.plantilla = resultado.plantilla;
        documento.nombreCliente = this.f.cliente.value;
        documento.distrito = this.cliente.distrito;
        documento.direccion = this.cliente.direccion;
        documento.documentoIdentidad = this.f.numeroDocumento.value;
        documento.idZonas = this.f.zonasSeleccionadas.value || null;
        documento.zonas = this.listaZonasSeleccionadas.map( z => {
          return {
            id: z.idZonaCorporal,
            nombre: z.descripcion
          }
        }) || [];
        documento.dniApoderado = this.f.dniApoderado.validator ? this.f.dniApoderado.value : null;
        documento.nombreApoderado = this.f.nombreApoderado.validator ? this.f.nombreApoderado.value : null;
        documento.fechaNacimiento = this.cliente.fechaNacimiento;
        documento.idPromocion = this.f.idPromocion.valid ? parseInt( this.f.idPromocion.value, 10) : null;
        documento.numeroSesionesRetroceder = this.f.numSesionesRetroceder.validator ? parseInt( this.f.numSesionesRetroceder.value, 10) : null;
        documento.numeroSesiones = this.f.numSesiones.validator ? parseInt( this.f.numSesiones.value, 10) : null;
        documento.sesionesAdicionales = this.f.sesionAdicional.validator ? parseInt(this.f.sesionAdicional.value) : null;
        documento.intervaloMantenimiento = this.f.intervaloMantenimiento.validator ? parseInt(this.f.intervaloMantenimiento.value) : null;
        documento.consultaMantenimientoEn = this.f.consultaMantenimientoEn.validator ? parseInt( this.f.consultaMantenimientoEn.value ) : null;
        documento.idPatologia = this.f.idPatologia.validator ? this.f.idPatologia.value.join(",") : null;
        documento.observacion = this.f.observacion.value;
        documento.condiciones = this.f.condiciones.validator ? this.f.condiciones.value : null;
        documento.fechaRegistra = new Date();
        documento.fechaDocumento = this.f.fechaDocumento.validator ? new Date(this.f.fechaDocumento.value+'T00:00:00') : null;


        const _plantillaInsertada = await this.clienteDocumentoService.drawDocument(documento,this.maestroPatologia,this.maestroPromocion,this.listaPromocionPrecioZonas, this.listaZonasSeleccionadas);
        const docPdf = await this.pdfMakeService.create(JSON.parse(_plantillaInsertada),1);
        this.spinner.hide();
        docPdf.open();
      });

  }

  // data
  listarServicios(): void{
    this.sbcServicios = this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
      this.servicios = res;
    }, error => {
      
    })
  }


}



