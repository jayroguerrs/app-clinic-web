import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subscription } from 'rxjs';
import {Cliente} from "../../../shared/models/cliente";
import {DatePipe} from "@angular/common";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {Documento, DocumentoCLiente, DocumentoPlantilla} from "../../../shared/models/documento";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {DocumentoPlantillaService} from "../../../shared/services/documento-plantilla.service";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ParametroSistemaService} from "../../../shared/services/parametro-sistema.service";
import {ClienteContratoService} from "../../../shared/services/cliente-contrato.service";
import {DocumentoPlantillas, Meses} from "../../../shared/enumeracion/enums";
import {CC_DocumentosRenderizados, ClienteContrato} from "../../../shared/models/cliente-contrato";
import { HistoriaClinicaService } from 'src/app/shared/services/historia-clinica.service';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {ClienteDocumentoService} from "../../../shared/services/cliente-documento.service";
import {pdfConfig} from "../../../app-config";
import {PromocionService} from "../../../shared/services/promocion.services";
import {PdfmakeService} from "../../../shared/services/pdfmake.service";
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";
// import pdfFonts from 'src/app/shared/fonts/build/custom-fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;




export class documentoContrato{
  id: number;
  loading: boolean;
  nombreDocumento: string;
  plantilla: string;
  subscription: Subscription | null;
  error: boolean;
}

export class documentoRenderizado{
  titulo: string;
  contenidoBase64: string;
}


@Component({
    selector: 'app-cliente-contrato',
    templateUrl: 'cliente-contrato.component.html',
    styleUrls: ['cliente-contrato.component.scss']
})
export class ClienteContratoComponent implements OnInit, OnDestroy {

    @Input() modal: NgbModalRef;
    @Input() cliente: Cliente | null = null;

    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    // Subscripciones
    subscriptionForm : Subscription;

    formGroup: FormGroup;
    submitted = false;
    documentosEncontrados: DocumentoCLiente[];
    documentosSeleccionados: DocumentoCLiente[];
    documentosContrato: documentoContrato[];
    documentosRenderizados: CC_DocumentosRenderizados[] = [];

    documentoPlantilla: DocumentoPlantilla | null = null;
    sbcDocumentoPlantilla: Subscription;

    cabeceraPagina: string = '';
    piePagina: string = '';
    sbcParametroSistemaPiePagina: Subscription;
    sbcParametroSistemaCabeceraPagina: Subscription;

    documentos: DocumentoCLiente[] = [];
    promocionCollection: any[] = [];
    sbcCollectionPromocion: Subscription;
    sbcCollectionDocumentos: Subscription;

    servicios: Servicio[] = [];
    sbcServicios: Subscription;

    maestroPromocion: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private utilsService: UtilsService,
        private usuarioService: UsuarioService,
        private documentoPlantillaService: DocumentoPlantillaService,
        private parametroSistemaService: ParametroSistemaService,
        private clienteContratoService: ClienteContratoService,
        private clienteDocumentoService: ClienteDocumentoService,
        private historiaClinicaService: HistoriaClinicaService,
        private promocionService: PromocionService,
        private pdfMakeService: PdfmakeService,
        private servicioService: ServicioService
    ) {

      this.documentosEncontrados = [];
      this.documentosSeleccionados = [];
      this.documentosContrato = [];
      this.formGroup = this.formBuilder.group({
        idServicio: new FormControl(1, Validators.required),
        fecha: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'),Validators.required),
        //enviarCorreo: new FormControl('0', Validators.required),
        idDocumentos: new FormControl('', Validators.required),
        observacion: new FormControl('') ,
        documentos: []
      });
    }

    ngOnInit(): void {
      this.listarPromociones();
      this.listarServicios();
      this.promocionListar();
      this.documentosListar();
      this.getDocumentoPlantilla();
      this.obtenerPieyCabeceradePagina();
      this.searchDocument();
    }

    ngOnDestroy(): void{
      // Destroy subscription
      if ( this.subscriptionForm ){ this.subscriptionForm.unsubscribe() }
      if ( this.sbcDocumentoPlantilla ){ this.sbcDocumentoPlantilla.unsubscribe() }
      if ( this.sbcCollectionPromocion ){ this.sbcCollectionPromocion.unsubscribe() }
      if ( this.sbcCollectionDocumentos ){ this.sbcCollectionDocumentos.unsubscribe() }

      if ( this.sbcParametroSistemaCabeceraPagina ){ this.sbcParametroSistemaCabeceraPagina.unsubscribe() }
      if ( this.sbcParametroSistemaPiePagina ){ this.sbcParametroSistemaPiePagina.unsubscribe() }
      this.sbcServicios?.unsubscribe();
    }

    /**
     * Getters
     */
    get f(): any {
        return this.formGroup.controls;
    }

    get dataForm(): ClienteContrato{
      // this.documentosContrato.forEach(async (x: documentoContrato) => {
      //   const docPdf = await this.pdfMakeService.create(JSON.parse(x.plantilla));
      //   const render = new CC_DocumentosRenderizados();
      //   render.titulo = `D-${x.id.toString().padStart(8,'0')} - ${x.nombreDocumento}`;
      //   docPdf.getBase64((data) => {
      //     render.contenidoBase64 = data;
      //   });
      //   this.documentosRenderizados.push(render);
      // });

      const contrato = new ClienteContrato();

      contrato.idCliente = this.cliente.id;
      contrato.fecha = this.f.fecha.value;
      contrato.idDocumentos = this.f.idDocumentos.value;
      //contrato.enviarCorreo = !!parseInt(this.f.enviarCorreo.value);
      contrato.idUsuarioRegistro = this.usuarioService.UsuarioActual.idUsuario;
      contrato.idPlantilla = DocumentoPlantillas.ResumenDocumento;
      contrato.observacion = this.f.observacion.value;
      contrato.idServicio = parseInt(this.f.idServicio.value, 10);
      contrato.documentosRenderizados = this.documentosRenderizados;

      return contrato;
    }

    /**
     * Form Options
     */
    async onSubmit(): Promise<void>{

      this.submitted = true;

      if(this.formGroup.invalid){
        this.utilsService.mostrarToast('Ingresar todos los datos','warning');
        return;
      }

      Swal.fire({
        title: 'Emitir resumen de contrato',
        html: '¿Desea emitir el resumen de contrato?',
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

            await this.spinner.show();
            this.clienteContratoService.grabarContrato(this.dataForm, '').subscribe((res) => {
              const { response } = res.data;
              //========================ENVIO DE CORREO==================================
    
              const idDocumentos = response.idDocumentos.split(',').map(x => parseInt(x));
    
              const sbDocumentos = new BehaviorSubject<CC_DocumentosRenderizados | null>(null);
              const documentos: CC_DocumentosRenderizados[] = [];
              sbDocumentos.subscribe((res: CC_DocumentosRenderizados | null) => {
                if(res){
                  documentos.push(res);
                  if(documentos.length === idDocumentos.length){
    
                    const contrato = new ClienteContrato();
                    contrato.id = response.id;
                    contrato.idEstado = response.idEstado;
                    contrato.documentosRenderizados = documentos;
                    contrato.idCliente = response.idCliente;
                    contrato.tituloContrato = response.tituloContrato;
                    contrato.emailEnviado = response.emailEnviado;
    
                    this.clienteContratoService.enviarContrato(contrato).subscribe((res: boolean | ErrorSistema)=> {
    
                      
                        if( res instanceof ErrorSistema){
                          this.spinner.hide();
                          Swal.fire({
                            icon: 'warning',
                            title: res.message,
                            showConfirmButton: true
                          });
                        }else{
                          return;
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
    
                this.clienteDocumentoService.getDocumentById(x).subscribe(async (docCliente: DocumentoCLiente | ErrorSistema) => {
    
                  if (docCliente instanceof DocumentoCLiente) {
                    if (docCliente.idPromocion) {
    
                      await this.promocionService.obtenerDetalle(docCliente.idPromocion).toPromise().then(async (promDetalle: any[]) => {
    
                        const parametros = await this.clienteDocumentoService.drawDocumentNest(docCliente, [], this.maestroPromocion, promDetalle);
    
                        docCliente.plantilla = await this.clienteDocumentoService.drawDocument(docCliente, [], this.maestroPromocion, promDetalle);
                        const docPdf = await this.pdfMakeService.create(JSON.parse(docCliente.plantilla));
                        const render = new CC_DocumentosRenderizados();
                        render.id = docCliente.id;
                        render.titulo = `D-${docCliente.id.toString().padStart(8, '0')} - ${docCliente.nombreDocumento}`;
                        docPdf.getBase64(async (data) => {
                          render.contenidoBase64 = await data;
                          sbDocumentos.next(render);
                        });
                        render.parametros = parametros;
    
                      }, err => {
                        console.error(err);
                      });
                    } else {
                      const parametros = await this.clienteDocumentoService.drawDocumentNest(docCliente, [], this.maestroPromocion);
    
                      docCliente.plantilla = await this.clienteDocumentoService.drawDocument(docCliente, [], this.maestroPromocion);
                      const docPdf = await this.pdfMakeService.create(JSON.parse(docCliente.plantilla));
                      const render = new CC_DocumentosRenderizados();
                      render.id = docCliente.id;
                      render.titulo = `D-${docCliente.id.toString().padStart(8, '0')} - ${docCliente.nombreDocumento}`;
                      docPdf.getBase64(async (data) => {
                        render.contenidoBase64 = await data;
                        sbDocumentos.next(render);
                      });
                      render.parametros = parametros;
                    }
                  }
    
                });
    
              }
    
              //=====================================================================================
              this.modal.close(res);
              Swal.fire({
                title: 'Contrato emitido!!!',
                html: `Se emitio el contrato <b>CTT-${res.data.response.id.toString().padStart(8,'0')}</b> con exito!!! <br>y enviado a su correo electrónico.`,
                icon: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                cancelButtonText: 'Ver Documento'
              }).then((result) => {
                if (result.isConfirmed) {
                  // documentoPdf.open();
                }else{
                  this.spinner.show();
                  const contrato = new ClienteContrato();
                  contrato.id = res.data.response.id;
                  this.clienteContratoService.buscar(contrato).subscribe((contrato: ClienteContrato | ErrorSistema) => {
                    if( contrato instanceof ErrorSistema){
                      this.spinner.hide();
                      Swal.fire({
                        icon: 'error',
                        title: contrato.message,
                        showConfirmButton: false,
                        timer: 1000
                      });
                    }else{
                      // console.log(contrato);
                      this.documentoPlantillaService.find(DocumentoPlantillas.ResumenDocumento).subscribe((res: DocumentoPlantilla) => {
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
              });
              this.spinner.hide();
            },error => {
              console.log(error);
              this.spinner.hide();
            })

          }
        }
      );

    }

    searchDocument(): void{
      if(!this.f.fecha.value){
        this.utilsService.mostrarToast('Seleccionar una fecha','warning');
        return;
      }

      const fecha = new Date(this.f.fecha.value+'T00:00:00');
      this.documentosListar(fecha);
    }

    async selectDocument(evt, document: DocumentoCLiente): Promise<void>{
      if(evt.target.checked) {

        // Agregar a documentos seleccionados
        if ( !this.documentosSeleccionados.includes(document) ) {
          this.documentosSeleccionados.push(document);
        }

        // console.log(document);
        const encontrado = !!this.documentosContrato.find( d => d.id === document.id);
        if(!encontrado){


          this.documentosContrato.push({id: document.id, loading: true, subscription: null, nombreDocumento: document.nombreDocumento, error: false, plantilla: ''});
          const doc = this.documentosContrato.find( d => d.id === document.id);
          doc.subscription = this.clienteDocumentoService.getDocumentById(document.id).subscribe(async (docCliente: DocumentoCLiente | ErrorSistema) => {

            if(docCliente instanceof ErrorSistema){
              this.utilsService.mostrarToast(docCliente.message,'error');
              doc.loading = false;
              doc.error = true;
            }else{

              // console.log('documentos', this.documentosContrato);

              if(docCliente.idPromocion){
                await this.promocionService.obtenerDetalle( docCliente.idPromocion ).toPromise().then(  async (promDetalle: any[]) => {
                  doc.plantilla = await this.clienteDocumentoService.drawDocument(docCliente,[],this.promocionCollection,promDetalle);
                  doc.loading = false;

                  const docPdf = await this.pdfMakeService.create(JSON.parse(doc.plantilla));
                  const render = new CC_DocumentosRenderizados();
                  render.id = doc.id;
                  render.titulo = `D-${doc.id.toString().padStart(8,'0')} - ${doc.nombreDocumento}`;
                  docPdf.getBase64((data) => {
                    render.contenidoBase64 = data;
                  });
                  this.documentosRenderizados.push(render);

                }, err => {
                  console.error(err);
                  doc.loading = false;
                  doc.error = true;
                });
              }else{
                doc.plantilla = await this.clienteDocumentoService.drawDocument(docCliente,[],this.promocionCollection);
                const docPdf = await this.pdfMakeService.create(JSON.parse(doc.plantilla));
                const render = new CC_DocumentosRenderizados();
                render.id = doc.id;
                render.titulo = `D-${doc.id.toString().padStart(8,'0')} - ${doc.nombreDocumento}`;
                docPdf.getBase64((data) => {
                  render.contenidoBase64 = data;
                });
                this.documentosRenderizados.push(render);

                doc.loading = false;
              }

            }
          }, error => {
            console.log(error);
            doc.loading = false;
            doc.error = true;
          });
        }

      }else{
        this.documentosSeleccionados = this.documentosSeleccionados.filter( d => d.id !== document.id );
        this.documentosContrato = this.documentosContrato.filter( d => d.id !== document.id );
        this.documentosRenderizados = this.documentosRenderizados.filter( d => d.id !== document.id );
      }

      this.formGroup.patchValue({
        idDocumentos: this.documentosSeleccionados.length ? this.documentosSeleccionados.map(d =>{ return d.id }).join(',') : ''
      });
    }
    isSelect(document: DocumentoCLiente): boolean{
      return this.documentosSeleccionados.includes(document);
    }

    /**
     * Modal options
     */
    cerrarModal( result: any = null): void {
        this.modal.close(result);
    }

    /**
     *  Init values
     */
    getDocumentoPlantilla(): void{
      this.sbcDocumentoPlantilla = this.documentoPlantillaService.find(DocumentoPlantillas.ResumenDocumento).subscribe((res) => {
        this.documentoPlantilla = res;
      }, error => {
        console.log(error);
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


    /**
     * Functions
     */
    generarDocumento(): void{

      let _plantilla: any = this.documentoPlantilla.plantilla;

      _plantilla = _plantilla.replaceAll('@cliente', this.cliente.nombres + " " + this.cliente.apellidos );
      _plantilla = _plantilla.replaceAll('@tipoDocumento', this.cliente.documentoIdentidad?.tipoDocumento );
      _plantilla = _plantilla.replaceAll('@documento', this.cliente.documentoIdentidad?.documento );

      _plantilla = _plantilla.replaceAll('@dia', this.datePipe.transform(new Date,'dd'));
      _plantilla = _plantilla.replaceAll('@mes', Meses[parseInt(this.datePipe.transform(new Date,'MM'))]);
      _plantilla = _plantilla.replaceAll('@año', this.datePipe.transform(new Date,'yyyy'));

      this.documentoPlantilla.plantilla = this.insertarTablaDocumentos(_plantilla);
    }

    insertarTablaDocumentos( plantilla: string ): string {
      let output = '';

      // tabla a insertar
      const _tabla = {
        table: {
          widths: [60, '*'],
          // keepWithHeaderRows: 1,
          body: []
        }
      };

      this.documentosSeleccionados.forEach((d, i) => {
        _tabla.table.body.push([{text: 'D-' + d.id.toString().padStart(8,'0'), border:[false,false,false,false]},{text: d.titulo, border:[false,false,false,false]}])
      });

      let _plantilla = JSON.parse(plantilla);
      _plantilla.forEach( (line, index) => {
        if(JSON.stringify(line).includes('@documentos')){
          _plantilla[index] = _tabla;
          _plantilla[(index+1)].margin[1] = 15;
        }
      });

      output = JSON.stringify(_plantilla);

      return output;
    }


    async previsualizarContrato(): Promise<void>{

      this.submitted = true;
      if(this.formGroup.invalid){
        this.utilsService.mostrarToast('Ingresar todos los datos','warning');
        return;
      }

      const docPdf = await this.pdfMakeService.create(this.documentosContrato.map((x,i) => {
        const p = JSON.parse(x.plantilla);
        if( i < this.documentosContrato.length - 1){
          p[(p.length - 1)]['pageBreak'] = 'after';
        }
        return p;
      }), 1);
      docPdf.open();
      // console.log(this.documentosRenderizados);
    }


    // Values init
    documentosListar( fecha: Date = new Date() ): void{
      this.documentosContrato.forEach( x => {
        x.subscription.unsubscribe();
      });

      this.documentosContrato = [];
      this.documentosSeleccionados = [];
      this.documentosContrato = [];

      this.sbcCollectionDocumentos = this.clienteDocumentoService.collectionByClientByFechaPorServicio(this.cliente.id, this.datePipe.transform(fecha, 'yyyy-MM-dd'), parseInt(this.f.idServicio.value, 10)).subscribe((res) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else {
          this.documentos = res;
          this.documentosEncontrados = res;
        }
      }, error => {
        console.log('Error al obtener documentos');
      });
    }
    promocionListar(): void {
      this.sbcCollectionPromocion = this.promocionService.obtener(1).subscribe(
        resultado => {
          this.promocionCollection = resultado;
        },
        error => {
          console.log('Error al obtener promociones', error);
        }
      );
    }
    listarServicios(): void{
      this.sbcServicios = this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
        this.servicios = res;
      }, error => {
        console.log(error);
      })
    }

    listarPromociones(): void{
      this.promocionService.obtenerByServicio(1,0).subscribe((res) => {
        this.maestroPromocion = res;
      }, error => {
        console.log(error);
      })
    }

}
