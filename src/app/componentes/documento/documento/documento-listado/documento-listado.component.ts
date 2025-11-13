import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NgbModalRef, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentoService } from 'src/app/shared/services/documento.service';
import { UtilsService } from '../../../../shared/services/funciones/utils.service';
import Api = DataTables.Api;
import {DataTableDirective} from "angular-datatables";
import Swal from "sweetalert2";
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {ClienteDocumentoService} from "../../../../shared/services/cliente-documento.service";
import {DC_Zona, DocumentoCLiente} from "../../../../shared/models/documento";
import {Meses, TiposDocumento} from "../../../../shared/enumeracion/enums";
import { DatePipe } from '@angular/common';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {PromocionService} from "../../../../shared/services/promocion.services";
import {PatologiaService} from "../../../../shared/services/patologia.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
// import pdfFonts from 'src/app/shared/fonts/build/custom-fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-documento-listado',
  templateUrl: './documento-listado.component.html',
  styleUrls: ['./documento-listado.component.scss']
})
export class DocumentoListadoComponent implements OnInit, AfterViewInit, OnDestroy {

  maestroPromocion: any[] = [];
  maestroPatologia: any[] = [];
  listaPromocionPrecioZonas: any[] = [];


  @ViewChild('modalVistaPrevia') modalPdf: ElementRef;
  dragPosition = {x: 0, y: 0};


  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  maestroDocumentos: any = [];
  idClienteDocumento: number = 0;


  @ViewChild('viewPdf') viewPdf: ElementRef;

  // Subscriptions
  sbcCollection: Subscription;
  sbcObtenerDocumentoPlantilla: Subscription;
  sbcCollectionPromocion: Subscription;
  sbcCollectionPatologia: Subscription;

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  datatable: Api;
  documentSelected: any = null;


  // Modals
  modalDocumentoDatosRef: NgbModalRef;
  modalDocumentoAnularRef: NgbModalRef;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  constructor(
    private utilsService: UtilsService,
    private documentoService: DocumentoService,
    private clienteDocumentoService: ClienteDocumentoService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private datePipe: DatePipe,
    private promocionService: PromocionService,
    private patologiaService: PatologiaService
  ) {

  }

  ngOnInit(): void {
    this.buildtable();
    this.promocionListar();
    this.patologiaListar();
  }

  ngOnDestroy(): void {
    // Destroy Modals
    if( this.modalDocumentoAnularRef ){ this.modalDocumentoAnularRef.close(); }
    if( this.modalDocumentoDatosRef ){ this.modalDocumentoDatosRef.close(); }
    // Destroy Subscriptions
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    if( this.sbcObtenerDocumentoPlantilla ){ this.sbcObtenerDocumentoPlantilla.unsubscribe(); }
    if( this.sbcCollectionPromocion ){ this.sbcCollectionPromocion.unsubscribe(); }
    if( this.sbcCollectionPatologia ){ this.sbcCollectionPatologia.unsubscribe(); }
    // Destroy datatable
    if( this.datatable ){ this.datatable.destroy(true); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance) => {

      _this.datatable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        _this.selected = dtInstance.rows('.selected').count();
        if ( type === 'row' ) {
          _this.idClienteDocumento = dtInstance.rows('.selected').data()[0].id;
          _this.documentSelected = dtInstance.rows('.selected').data()[0];
          _this.selectDocument();
          _this.verOpciones();
        }
      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.selected = dtInstance.rows('.selected').count();
        _this.idClienteDocumento = 0;
        _this.documentSelected = null;
      });

    });
  }

  documentoListar( resetPaging: boolean = true ): void {
    this.datatable.ajax.reload( null, resetPaging );
  }
  anularDocumento(modal): void{
    if(!this.selected ){
      this.utilsService.mostrarToast('Seleccionar documento','warning');
      return;
    }
    if(!this.documentSelected?.idEstado){
      this.utilsService.mostrarToast('El documento ya se encuentra anulado','warning');
      return;
    }
    this.modalDocumentoAnularRef = this.utilsService.abrirModal(modal, 'md');
    this.modalDocumentoAnularRef.result.then(result => {
      if (result){
        Swal.fire({
          title: 'El documento fue anulado !!',
          icon: 'success'
        });
        this.documentoListar( false );
        this.documentSelected = null;
        this.selected = 0;
      }
    });
  }
  buildtable(): void{
    this.dtResponsiveOptions = {
      dom: 'lr<"table-responsive"t>ip',
      ajax: (dataTablesParameters: any, callback) => {
        this.spinner.show();
          this.sbcCollection = this.clienteDocumentoService.getCollection().subscribe(
            (resultado) => {
            callback({
              data : resultado
            });
            this.spinner.hide();
          },
          error =>  {
            console.log('Error al obtener maquinas: ' + error);
            this.spinner.hide();
          });
      },
      columns: [
        { title: '#', data: 'id', width: '4%', render: (data) => {
            return 'D' + data.toString().padStart(6,'0');
        }, className: 'align-middle'},
        { title: 'IDCLIENTE', data: 'idCliente', visible: false, className: 'align-middle' },
        { title: 'CLIENTE', data: 'nombreCliente', className: 'align-middle all' },
        { title: 'DOCUMENTO', data: 'nombreDocumento', className: 'align-middle' },
        { title: 'PROMOCIÓN', data: 'promocion', className: 'align-middle' },
        { title: 'ZONAS', data: 'zonas', width: '30%', className: 'align-middle ws-normal', render: function(data: DC_Zona[]){
            return data.map(z => z.nombre).join(', ');
          }},
        { title: 'ESTADO', data: 'idEstado', width: '20%', className: 'align-middle', render: function(data){
            return !data ? '<span class="small theme-bg2 text-white p-1 estado " >ANULADO</span>' :'<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' ;
          }},
        { title: 'FECHA REGISTRA', data: 'fechaRegistra', width: '20%',  render: (data: any) => `<span>${ this.utilsService.formato_FechaString(data) }</span>` , className: 'align-middle'},
        { title: 'USUARIO REGISTRA', data: 'usuarioRegistra', width: '20%', className: 'align-middle' },
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        'excel'
      ],
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
      select: true
    };
  }

  documentoNuevo(modal): void {
    this.modalDocumentoDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalDocumentoDatosRef.result.then(result => {
      // this.documentoListar(true)
    });
  }

  selectDocument(): void{
    if(!this.documentSelected){
      this.closePreviewPdf();
    }
    if( this.modalPdf.nativeElement.classList.contains('md-show')){
      this.drawPdf();
    }
  }

  drawPdf(){
    if(this.documentSelected){
      this.renderDocumento(this.documentSelected);
        // const newBlob = new Blob([this.documentSelected.pdf64], {type: 'application/pdf'});
        // this.viewPdf.nativeElement.src = 'data:application/pdf;base64, '+ this.documentSelected.pdf64;
    }
  }

  onViewPdf(): void {
    if(!this.selected){
      this.utilsService.mostrarToast('Seleccionar documento','warning');
      return;
    }
    this.drawPdf();
    /*if( !this.modalPdf.nativeElement.classList.contains('md-show')){
      this.modalPdf.nativeElement.classList.add('md-show');
    }*/
  }

  closePreviewPdf(): void{
    if( this.modalPdf.nativeElement.classList.contains('md-show')){
      this.modalPdf.nativeElement.classList.remove('md-show');
      setTimeout( () =>{
        this.modalPdf.nativeElement.removeAttribute("style");
        this.dragPosition = {x: 0, y: 0};
      }, 1000)
    }
  }

  async renderDocumento( clienteDocumento: DocumentoCLiente): Promise<void> {

    this.spinner.show();

    this.sbcObtenerDocumentoPlantilla = this.documentoService.obtenerDocumentoPlantilla(clienteDocumento.idDocumentoTipo).subscribe(
      async resultado => {

        console.log(resultado);

        if(!resultado.plantilla){
          console.error('El documento no tiene una plantilla definida');
          this.utilsService.mostrarToast('El documento no tiene una plantilla definida','warning');
          this.spinner.hide();
          return;
        }
        //console.log(clienteDocumento.nombreCliente);

        let plantilla = resultado.plantilla;
        plantilla = plantilla.replace('@cliente', clienteDocumento.nombreCliente);
        plantilla = plantilla.replace('@tipoDocumento', clienteDocumento.tipoDocumentoIdentidad);
        plantilla = plantilla.replace('@numeroDocumento', clienteDocumento.documentoIdentidad);


        if(plantilla.includes('@id')){
          plantilla = plantilla.replaceAll('@id', clienteDocumento.id);
        }

        if([
          TiposDocumento.CONS_INFO_EMPR_DOCT
        ].includes(clienteDocumento.idDocumentoTipo)){
          plantilla = plantilla.replace('@descripcionComentario', clienteDocumento.descripcionComentario);
        }

        if([
          TiposDocumento.CONS_INFO_MENO_EDAD_DOCT,
          TiposDocumento.CONT_REIN_TRAT_DOCT
        ].includes(clienteDocumento.idDocumentoTipo)){
          plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
            return z.nombre
          }).join(', ') );
        }

        if([
          TiposDocumento.CONS_INFO_MENO_EDAD_DOCT
        ].includes(clienteDocumento.idDocumentoTipo)){
          plantilla = plantilla.replace('@documentoTutor', clienteDocumento.dniApoderado);
          plantilla = plantilla.replace('@nombreTutor', clienteDocumento.nombreApoderado);
          plantilla = plantilla.replace('@edad', clienteDocumento.fechaNacimiento ? this.utilsService.calculaEdad(new Date(clienteDocumento.fechaNacimiento)) : '' );
        }

        if([
          TiposDocumento.TRAN_EXTR
        ].includes(clienteDocumento.idDocumentoTipo)){
          plantilla = plantilla.replaceAll('@dia1', this.datePipe.transform(clienteDocumento.fechaDocumento,'dd'));
          plantilla = plantilla.replaceAll('@mes1', Meses[this.datePipe.transform(clienteDocumento.fechaDocumento,'MM')]);
          plantilla = plantilla.replaceAll('@año1', this.datePipe.transform(clienteDocumento.fechaDocumento,'yyyy'));
        }


        switch(clienteDocumento.idDocumentoTipo)
        {

          // Consentimiento SIN GARANTIA
          case TiposDocumento.CONT_SIN_GARAN_DOCT: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', ') );
            break;
          }

          // Consentimiento hiperpigmentacion
          case TiposDocumento.CONS_INFO_HIPER: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', ') );
            break;
          }

          // Consentimiento ovarios poliquisticos
          case TiposDocumento.CONS_INFO_OVAR_POLI: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', ') );
            break;
          }

          // Transacción extrajudicial
          case TiposDocumento.TRAN_EXTR: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', ') );
            plantilla = plantilla.replace('@domicilioCliente', clienteDocumento.direccion);
            plantilla = plantilla.replace('@distritoCliente', clienteDocumento.distrito);

            break;
          }

          // Contrato servicio de depilación retroceso doctoras
          case TiposDocumento.CONT_RETR_SESI_DOCT: {
            // const promocion = this.maestroPromocion.find(x => x.idPromocion == this.frmDocumento.controls.idPromocion.value).descripcion;
            plantilla = plantilla.replace('@retrocederNsesiones', clienteDocumento.numeroSesionesRetroceder);
            plantilla = plantilla.replace('@terminoNsesiones', clienteDocumento.numeroSesiones);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }

          // Consentimiento informado menor de edad especialista
          case TiposDocumento.CONS_INFO_MENO_EDAD_ESPE: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            plantilla = plantilla.replace('@documentoTutor', clienteDocumento.dniApoderado);
            plantilla = plantilla.replace('@nombreTutor', clienteDocumento.nombreApoderado);
            plantilla = plantilla.replace('@edad', clienteDocumento.fechaNacimiento ? this.utilsService.calculaEdad(new Date(clienteDocumento.fechaNacimiento)) : '' );
            break;
          }

          // Contrato sin garantia especialista
          case TiposDocumento.CONT_SIN_GARAN_ESPE: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }

          // Contrato sin garantia especialista
          case TiposDocumento.CONT_REIN_TRAT_ESPE: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }

          // Contrato sin garantia especialista
          case TiposDocumento.CONT_RETR_SESI_ESPE: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }

          // Contrato servicio de depilación
          case TiposDocumento.CONT_SERV_ACLARA:
          case TiposDocumento.CONT_MATCH_ACLARA_DEPIL:
          case TiposDocumento.CONT_SERV_TRAT_FACIAL1:
          case TiposDocumento.CONT_SERV_TRAT_FACIAL2:
          case TiposDocumento.CONT_SERV_TRAT_FACIAL3:
          case TiposDocumento.CONT_SERV_TRAT_FACIAL4:
          case TiposDocumento.CONT_SERV_TRAT_FACIAL5:
          case TiposDocumento.CONT_SERV_DEPI:{
            // console.log('promociones', this.maestroPromocion);
            const promocion = this.maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion).descripcion;
            plantilla = plantilla.replace('@promocion', promocion);
            // plantilla = plantilla.replace('@zonas', this.frmDocumento.controls.zonasSeleccionadas.value);

            plantilla = await this.insertarTablaZonasPrecio(plantilla,clienteDocumento);
            break;
          }
          case TiposDocumento.CONT_SERV_CORP360:{
            console.log('promociones', this.maestroPromocion);
            const promocion = this.maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion).descripcion;
            plantilla = plantilla.replace('@promocion', promocion);
            break;
          }
          // Constancia mantenimiento especialista
          case TiposDocumento.CONS_MANT_ESPE: {
            plantilla = plantilla.replace('@sesionesAdicionales', clienteDocumento.sesionesAdicionales);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            plantilla = plantilla.replace('@intervaloMantenimiento', clienteDocumento.intervaloMantenimiento > 1 ? clienteDocumento.intervaloMantenimiento + " meses." : clienteDocumento.intervaloMantenimiento + "mes.");
            plantilla = plantilla.replace('@consultaMantenimientoEn', clienteDocumento.consultaMantenimientoEn);
            break;
          }
          // Constancia retoque respecialista
          case TiposDocumento.CONS_RETO_ESPE: {
            plantilla = plantilla.replace('@descripcionComentario', clienteDocumento.descripcionComentario);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }
          // Constancia mantenimiento doctora
          case TiposDocumento.CONS_MANT_DOCT: {
            plantilla = plantilla.replace('@sesionesAdicionales', clienteDocumento.sesionesAdicionales);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            plantilla = plantilla.replace('@intervaloMantenimiento', clienteDocumento.intervaloMantenimiento > 1 ? clienteDocumento.intervaloMantenimiento + " meses." : clienteDocumento.intervaloMantenimiento + "mes.");
            plantilla = plantilla.replace('@consultaMantenimientoEn', clienteDocumento.consultaMantenimientoEn);
            break;
          }
          // Constancia retoque doctora
          case TiposDocumento.CONS_RETO_DOCT: {
            plantilla = plantilla.replace('@descripcionComentario', clienteDocumento.descripcionComentario);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }
          // Consentimiento empresa patología
          case TiposDocumento.CONS_INFO_EMPR_DOCT: {
            const patologia = this.maestroPatologia.find(x => x.id == clienteDocumento.idPatologia).nombre;
            plantilla = plantilla.replace('@patologia', patologia);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }
          // Consentimiento informado general especialista
          case TiposDocumento.CONS_INFO_GENE_ESPE: {
            const patologia = this.maestroPatologia.find(x => x.id == clienteDocumento.idPatologia).nombre;
            plantilla = plantilla.replace('@patologia', patologia);
            plantilla = plantilla.replace('@descripcionComentario', clienteDocumento.descripcionComentario);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }
          // Constancia de alta media especialistas
          case TiposDocumento.CONS_ALTA_MEDI_ESPE: {
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }
          // Constancia de alta medica doctoras
          case TiposDocumento.CONS_ALTA_MEDI_DOCT: {
            plantilla = plantilla.replace('@doctora', clienteDocumento.nombreDoctora);
            plantilla = plantilla.replace('@zonas', clienteDocumento.zonas.map( z => {
              return z.nombre
            }).join(', '));
            break;
          }
        }

        plantilla = plantilla.replaceAll('@dia', this.datePipe.transform(clienteDocumento.fechaRegistra,'dd'));
        plantilla = plantilla.replaceAll('@mes', Meses[this.datePipe.transform(clienteDocumento.fechaRegistra,'MM')]);
        plantilla = plantilla.replaceAll('@año', this.datePipe.transform(clienteDocumento.fechaRegistra,'yyyy'));


        // console.log('Imagen cabecera', resultado.imagenCabeceraDocumento);

        const dd: any = {
          info: {
            title: 'DocumentoDepilzone',
            author: 'Depilzone',
            subject: 'Sistemas',
            keywords: 'Clinic2.0'
          },
          header: {
            image: resultado.imagenCabeceraDocumento,
            width: 595,
            height: 160,
            alignment: "center",
          },
          footer: function(currentPage, pageCount, pageSize) {
            return [
              {
                image: resultado.imagenPieDocumento,
                width: 595,
                height: 35,
                alignment: "center",
                margin: [0, 15, 0, 0]
              }
            ]
          },
          content: JSON.parse(plantilla),
          defaultStyle : {
            fontSize: 10,
            lineHeight: 1,
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
          pageMargins: JSON.parse(resultado.margin),
        };
        if(!clienteDocumento.idEstado){
          dd['watermark'] = { text: 'ANULADO', color: 'red', opacity: 0.5, bold: true, italics: false };
        }
        const docPdf = pdfMake.createPdf(dd);
        this.spinner.hide();
        docPdf.open();
      },
      error => {
        console.log('Error al obtener la plantilla de Documento', error);
        this.spinner.hide();
      }
    );
  }

  async insertarTablaZonasPrecio( plantilla: string, documentoCliente: DocumentoCLiente ): Promise<string>{
    await this.promocionService.obtenerDetalle( documentoCliente.idPromocion ).toPromise().then( (res: any[]) => {
      this.listaPromocionPrecioZonas = res;
      console.log('zonas precio', res);
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
  promocionListar(): void {
    this.sbcCollectionPromocion = this.promocionService.obtener(1).subscribe(
      resultado => {
        this.maestroPromocion = resultado;
      },
      error => {
        console.log('Error al obtener promociones', error);
      }
    );
  }
  patologiaListar(): void {
    this.sbcCollectionPatologia = this.patologiaService.obtenerListado().subscribe(
      (resultado: any[]) => {
        this.maestroPatologia = resultado;
      },
      error => {
        console.log('Error al obtener patologias', error);
      }
    );
  }
}

