import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Documento, DocumentoCLiente} from "../../../../shared/models/documento";
import {ClienteDocumentoService} from "../../../../shared/services/cliente-documento.service";
import { Subscription } from 'rxjs';
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {PatologiaService} from "../../../../shared/services/patologia.service";
import {PromocionService} from "../../../../shared/services/promocion.services";
import {PdfmakeService} from "../../../../shared/services/pdfmake.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UsuarioService} from "../../../../shared/services/usuario.service";

@Component({
  selector: 'app-documento-anulacion',
  templateUrl: './documento-anulacion.component.html',
  styleUrls: ['./documento-anulacion.component.scss']
})
export class DocumentoAnulacionComponent implements OnInit, OnDestroy {
  @Input() modal: NgbModalRef;
  @Output() eventoDocumentoListar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() documento: DocumentoCLiente;

  formGroup: FormGroup;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  submitted = false;

  // Subscripciones
  subscriptionForm: Subscription;
  subscriptionDocumento: Subscription;
  sbcCollectionPatologia: Subscription;
  sbcCollectionPromocion: Subscription;

  maestroPatologia: any[] = [];
  maestroPromocion: any[] = [];
  listaPromocionPrecioZonas: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteDocumentoService: ClienteDocumentoService,
    private utilService: UtilsService,
    private patologiaService: PatologiaService,
    private promocionService: PromocionService,
    private pdfMakeService: PdfmakeService,
    private spinner: NgxSpinnerService,
    private usuarioService: UsuarioService
  ) {

    this.formGroup = this.formBuilder.group({
      motivo: new FormControl('', Validators.required),
      otro: new FormControl(null),
      enviarCorreo: new FormControl('1', Validators.required)
    },{ validators: this.checkOther });

  }
  ngOnInit(): void {
    this.patologiaListar();
    this.promocionListar();
  }

  ngOnDestroy(): void {
    if( this.subscriptionForm ){ this.subscriptionForm.unsubscribe(); }
    if( this.subscriptionDocumento ){ this.subscriptionDocumento.unsubscribe(); }
  }

  get f(): any{
    return this.formGroup.controls;
  }

  onSubmit(): void{
    this.submitted = true;
    if( this.formGroup.valid ){
      this.formGroup.disable();

      const id = this.documento.id;
      const motivo = this.f.motivo.value === 'Otro' ? this.f.otro.value : this.f.motivo.value;

      Swal.fire({
        title: 'Anular documento',
        html: `¿Desea anular el documento <b>(D${id.toString().padStart(6,'0')}) ${this.documento.nombreDocumento}</b>?`,
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

            this.clienteDocumentoService.getDocumentById(this.documento.id).subscribe(async (doc) => {
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

                doc.motivoAnulacion = motivo;
                doc.enviarCorreo = !! parseInt(this.f.enviarCorreo.value, 10);
                doc.idUsuarioModifico = this.usuarioService.UsuarioActual.idUsuario;

                if(doc.idPromocion){

                  this.promocionService.obtenerDetalle( doc.idPromocion ).toPromise().then( async (precioZonas: any[]) => {

                    this.listaPromocionPrecioZonas = precioZonas;

                    const plantilla = await this.clienteDocumentoService.drawDocument(doc,this.maestroPatologia,this.maestroPromocion,this.listaPromocionPrecioZonas);
                    const docPdf = await this.pdfMakeService.create(JSON.parse(plantilla), 2);
                    // docPdf.open();
                    docPdf.getBase64( async (pdfBase64) => {
                      const documento = {...doc};
                      documento.documento = await pdfBase64;

                      this.subscriptionForm = this.clienteDocumentoService.cancelDocument(id, documento).subscribe((res) => {
                        //console.log(res);
                        this.spinner.hide();
                        this.modal.close(res);
                      }, err => {
                        this.spinner.hide();
                        console.error(err);
                        this.modal.close(false);
                      });
                    });

                  }, err => {
                    this.spinner.hide();
                    console.error(err)
                  });
                }else{

                  //console.log('No tiene idPromocion');

                  const plantilla = await this.clienteDocumentoService.drawDocument(doc,this.maestroPatologia,this.maestroPromocion);
                  const docPdf = await this.pdfMakeService.create(JSON.parse(plantilla),2);
                  //docPdf.open();
                  docPdf.getBase64( async (pdfBase64) => {
                    const documento = {...doc};
                    documento.documento = await pdfBase64;
                    this.subscriptionForm = this.clienteDocumentoService.cancelDocument(id, documento).subscribe((res) => {
                      //console.log(res);
                      this.spinner.hide();
                      this.modal.close(res);
                    }, err => {
                      this.spinner.hide();
                      console.error(err);
                      this.modal.close(false);
                    });
                  });

                }

              }
            }, error => {
              this.spinner.hide();
              console.log(error);
            });

          }else{
            this.modal.close(false);
          }

        }
      );

    }
  }

  cerrarModal(): void {
    this.modal.close(false);
  }


  checkOther: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let motivo = group.get('motivo').value;
    let otro = group.get('otro').value;

    if( motivo !== 'Otro' ){ return null; }
    if( motivo === 'Otro' ){
      if(otro){
        return null;
      }else{
        return { requiredOtherValue: true };
      }
    }
  }

  // Init data
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

}
