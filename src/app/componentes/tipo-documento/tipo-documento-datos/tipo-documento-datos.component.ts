import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Usuario} from '../../../shared/models/usuario';
import {UsuarioService} from '../../../shared/services/usuario.service';
import {UtilsService} from '../../../shared/services/funciones/utils.service';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {DocumentoTipoService} from "../../../shared/services/documento-tipo.service";
import {DocumentoTipo} from "../../../shared/models/documento";
import { Subscription } from 'rxjs';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";

@Component({
    selector: 'app-tipo-documento-datos',
    templateUrl: 'tipo-documento-datos.component.html'
})
export class TipoDocumentoDatosComponent implements OnInit, OnDestroy {

    @Input() id: number | null = 0;
    @Output() eventListar: EventEmitter<boolean> = new EventEmitter<boolean>();

    formGroup: FormGroup;
    usuarioActual: Usuario;

    submitted = false;

    // Subscription
    subscriptionForm : Subscription;
    subscriptionFind: Subscription;

    servicios: Servicio[] = [];
    sbcServicios: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private utilsService: UtilsService,
        private documentoTipoService: DocumentoTipoService,
        private servicioService: ServicioService,
        private modal: NgbActiveModal
    ) {
      this.formGroup = this.formBuilder.group({
        nombre : new FormControl('', [Validators.required, Validators.maxLength(100)]),
        titulo : new FormControl('', [Validators.required, Validators.maxLength(150)]),
        idServicio : new FormControl('', [Validators.required]),

        blPromocion : new FormControl(false, [Validators.required]),
        blZona : new FormControl(false, [Validators.required]),
        blPatologia : new FormControl(false, [Validators.required]),
        blApoderado : new FormControl(false, [Validators.required]),
        blMantenimiento : new FormControl(false, [Validators.required]),
        blRetroceso : new FormControl(false, [Validators.required]),
        // perfiles : new FormControl(null)
      });
    }

    ngOnInit(): void {
        this.listarServicios();
        this.usuarioActual = this.usuarioService.UsuarioActual;
        if(this.id){
            this.buscarDocumentoTipo();
        }
        // console.log(this.id);
    }

    ngOnDestroy(): void {
      // Destroy subscription
      if(this.subscriptionForm){ this.subscriptionForm.unsubscribe() }
      if(this.subscriptionFind){ this.subscriptionFind.unsubscribe() }
    }
    limpiarFormulario(): void {
        this.formGroup.setValue({
          nombre: '',
          titulo: '',
          idServicio: ''
        });
    }
    buscarDocumentoTipo(): void {
        this.subscriptionFind = this.documentoTipoService.find(this.id).subscribe(
          (res: DocumentoTipo | ErrorSistema) => {

            if(res instanceof ErrorSistema){
              this.utilsService.mostrarToast(res.message, 'error');
            }else{
              // console.log(res);
              this.formGroup.setValue({
                nombre : res.nombre,
                titulo: res.titulo,
                idServicio: res.idServicio ? res.idServicio : '',

                blPromocion : res.blPromocion,
                blZona : res.blZona,
                blPatologia : res.blPatologia,
                blApoderado : res.blApoderado,
                blMantenimiento : res.blMantenimiento,
                blRetroceso : res.blRetroceso
              });
            }
          });
    }

    get f(): any { return this.formGroup.controls; }

    get documentoTipo(): any {
      return {
        id : this.id ? this.id : 0,
        nombre : this.f.nombre.value.trim(),
        titulo : this.f.titulo.value.trim(),
        idServicio : parseInt(this.f.idServicio.value, 10),
        perfiles : [],
        idUsuarioRegistro: this.usuarioActual.idUsuario,
        idUsuarioModifico: this.id ? this.usuarioActual.idUsuario : null,

        blPromocion : this.f.blPromocion.value,
        blZona : this.f.blZona.value,
        blPatologia : this.f.blPatologia.value,
        blApoderado : this.f.blApoderado.value,
        blMantenimiento : this.f.blMantenimiento.value,
        blRetroceso : this.f.blRetroceso.value
      };
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.formGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            return;
        }

        if (this.id ){
           // EDITAR
           this.subscriptionForm = this.documentoTipoService.update(this.documentoTipo).subscribe(
             (res: boolean | ErrorSistema) => {
                 if(res instanceof ErrorSistema){
                   this.utilsService.mostrarToast(res.message, 'error');
                 }else{
                   // console.log(resultado);
                   Swal.fire({text: 'Se actualizaron los datos del tipo de documento con exito!!!', icon: 'success'});
                   this.cerrarModal(true);
                 }
               },
               error => {
                 console.log('Error al actualizar el tipo de documento', error);
                 this.utilsService.mostrarToast(error.error.message + ': ' + error.error.code, 'error');
               }
            );
        } else {
            // NUEVO
            this.subscriptionForm = this.documentoTipoService.create(this.documentoTipo).subscribe(
              (res: boolean | ErrorSistema) => {
                    if(res instanceof ErrorSistema){
                      this.utilsService.mostrarToast(res.message, 'error');
                    }else{
                      // console.log(resultado);
                      Swal.fire({text: 'Se registro el nuevo tipo de documento con exito!!!', icon: 'success'});
                      this.cerrarModal(true);
                    }
                },
              (error: any) => {
                  console.error('Error al registrar el tipo de documento', error);
                  this.utilsService.mostrarToast('Ocurrio un error al intentar registrar el tipo de documento', 'error');
                },
              () => {}
            );
        }
        // this.cerrarModal();
    }
    cerrarModal(result: any | null = null): void {
        this.modal.close(result);
    }

    // data
    listarServicios(): void{
        this.sbcServicios = this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
          this.servicios = res;
        }, error => {
          console.log(error);
        });
    }
}
