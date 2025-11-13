import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {Cliente} from "../../../shared/models/cliente";
import {DatePipe} from "@angular/common";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DocumentoPlantilla} from "../../../shared/models/documento";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {DocumentoPlantillaService} from "../../../shared/services/documento-plantilla.service";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ParametroSistemaService} from "../../../shared/services/parametro-sistema.service";
import {Meses, DocumentoPlantillas} from "../../../shared/enumeracion/enums";
import {HistoriaClinicaService} from "../../../shared/services/historia-clinica.service";
import {HistoriaClinica, HistoriaClinicaCliente} from "../../../shared/models/historia-clinica";
import {ErrorSistema} from "../../../shared/models/error-sistema";
// import pdfFonts from 'src/app/shared/fonts/build/custom-fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-cliente-historia-clinica',
    templateUrl: 'cliente-historia-clinica.component.html',
    styleUrls: ['cliente-historia-clinica.component.scss']
})
export class ClienteHistoriaClinicaComponent implements OnInit, OnDestroy {

    @Input() modal: NgbModalRef;
    @Input() cliente: Cliente | null = null;

    // Subscripciones
    subscriptionForm : Subscription;

    formGroup: FormGroup;

    documentoPlantilla: DocumentoPlantilla | null = null;
    sbcDocumentoPlantilla: Subscription;

    cabeceraPagina: string = '';
    piePagina: string = '';
    sbcParametroSistemaPiePagina: Subscription;
    sbcParametroSistemaCabeceraPagina: Subscription;
    sbcObtenerDetallesCliente: Subscription;
    sbcGenerarDocumentoHistoriaClinica: Subscription;

    historiaClinicaCliente: HistoriaClinicaCliente;
    today: Date;

    constructor(
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        public datePipe: DatePipe,
        private utilsService: UtilsService,
        private usuarioService: UsuarioService,
        private documentoPlantillaService: DocumentoPlantillaService,
        private parametroSistemaService: ParametroSistemaService,
        private historiaClinicaService: HistoriaClinicaService
    ) {
      this.today = new Date();
      this.formGroup = this.formBuilder.group({
        fecha: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'),Validators.required)
      });
    }

    ngOnInit(): void {
      this.getDocumentoPlantilla();
      this.obtenerPieyCabeceradePagina();
    }

    ngOnDestroy(): void{
      // Destroy subscription
      if ( this.subscriptionForm ){ this.subscriptionForm.unsubscribe() }
      if ( this.sbcDocumentoPlantilla ){ this.sbcDocumentoPlantilla.unsubscribe() }

      if ( this.sbcParametroSistemaCabeceraPagina ){ this.sbcParametroSistemaCabeceraPagina.unsubscribe() }
      if ( this.sbcParametroSistemaPiePagina ){ this.sbcParametroSistemaPiePagina.unsubscribe() }
      if ( this.sbcObtenerDetallesCliente ){ this.sbcObtenerDetallesCliente.unsubscribe() }
      if ( this.sbcGenerarDocumentoHistoriaClinica ){ this.sbcGenerarDocumentoHistoriaClinica.unsubscribe() }
    }

    /**
     * Getters
     */
    get f(): any {
        return this.formGroup.controls;
    }

    get dataForm(): HistoriaClinicaCliente{
      const historiaClinica = new HistoriaClinicaCliente();

      historiaClinica.idCliente = this.cliente.id;
      historiaClinica.fecha = this.f.fecha.value;

      return historiaClinica;
    }

    /**
     * Form Options
     */
    async onSubmit(): Promise<void>{

      let contenido: any[] = [];
      if(this.formGroup.invalid){
        this.utilsService.mostrarToast('Seleccionar la fecha','warning');
        return;
      }

      await this.spinner.show();
      //this.generarDocumento();

      const historia = new HistoriaClinicaCliente();
      historia.fechaHistoria = await this.f.fecha.value;
      historia.fecha = await this.f.fecha.value;
      historia.idUsuarioRegistro = this.usuarioService.UsuarioActual.idUsuario;
      historia.idCliente = this.cliente.id;

      await this.historiaClinicaService.grabarHistoria(historia).subscribe(async (res) => {
        if( res instanceof HistoriaClinicaCliente ) {
          const historiaClinica = res;

          this.modal.close(res);
          await this.spinner.hide();
          // console.log(res);
          await Swal.fire({
            title: 'Se generó la historia clinica',
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Ver documento',
          }).then(
            result => {
              if (!result.isConfirmed) {
                this.spinner.show();
                this.sbcObtenerDetallesCliente = this.historiaClinicaService.obtenerDetallesByHistoria(historiaClinica.id).subscribe(async (historia: HistoriaClinicaCliente | ErrorSistema) => {
                  if (historia instanceof ErrorSistema) {
                    console.log(res);
                    this.spinner.hide();
                    Swal.fire({
                      html: historia.message,
                      icon: 'error',
                      allowOutsideClick: false,
                      allowEscapeKey: false,
                      showCancelButton: false
                    });

                    return;
                  } else {
                    // console.log(res);

                    this.sbcGenerarDocumentoHistoriaClinica = await this.historiaClinicaService.generarDocumentoHistoriaClinica(historia).subscribe((res) => {
                      contenido = res;
                    });

                    await this.historiaClinicaService.generarDocumentoFichaCliente(historia).subscribe((res) => {
                      contenido = contenido.concat(res);
                    });

                    await this.documentoPlantillaService.find(DocumentoPlantillas.ConsentimientoInformadoAutorizacion).toPromise().then(res => {
                      let plantilla: any = res.plantilla;
                      if(plantilla.includes('@dia')){
                        plantilla = plantilla.replaceAll('@dia', this.datePipe.transform( new Date(historia.fechaHistoria),'dd'));
                      }

                      if(plantilla.includes('@mes')){
                        plantilla = plantilla.replaceAll('@mes', Meses[this.datePipe.transform( new Date(historia.fechaHistoria), 'MM' )]);
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

                      plantilla = JSON.parse(plantilla);
                      plantilla[(plantilla.length - 1)]['pageBreak'] = 'after';

                      contenido = contenido.concat(plantilla);
                    });

                    await this.documentoPlantillaService.find(DocumentoPlantillas.InformacionProcesoDepilacion).toPromise().
                    then(res => {
                      let plantilla = JSON.parse( res.plantilla );
                      plantilla[(plantilla.length-1)]['pageBreak'] = 'after';
                      contenido = contenido.concat( plantilla );
                    });

                    await this.documentoPlantillaService.find(DocumentoPlantillas.RecomendacionesCliente).toPromise().then(res => {
                      let plantilla = JSON.parse(res.plantilla);

                      contenido = contenido.concat(plantilla);
                    });

                    this.historiaClinicaService.generarHistoriaClinicaPdf(contenido, this.cabeceraPagina, this.piePagina, [40, 160, 40, 50], {fontSize: 10}).subscribe(documentoPdf => {
                      documentoPdf.getBase64((data) => {

                        //this.modal.close(true);
                        this.spinner.hide();

                        documentoPdf.open();

                      });

                    }, error => {
                      console.log(error);
                      this.spinner.hide();
                    });

                  }
                }, error => {
                  console.log(error);
                  this.spinner.hide();
                });

              }
            }
          );

        }else{
          console.log(res);
          this.spinner.hide();
          await Swal.fire({
            title: res.message,
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 1000
          })
        }

      }, error => {
        this.spinner.hide();
        console.log(error);
      });

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

      let _plantilla = this.documentoPlantilla.plantilla;

      _plantilla = _plantilla.replace('@cliente', this.cliente.nombres + " " + this.cliente.apellidos );
      _plantilla = _plantilla.replace('@tipoDocumento', this.cliente.documentoIdentidad?.tipoDocumento );
      _plantilla = _plantilla.replace('@documento', this.cliente.documentoIdentidad?.documento );

      _plantilla = _plantilla.replace('@dia', this.datePipe.transform(new Date,'dd'));
      _plantilla = _plantilla.replace('@mes', Meses[this.datePipe.transform(new Date,'MM')]);
      _plantilla = _plantilla.replace('@año', this.datePipe.transform(new Date,'yyyy'));

    }


}
