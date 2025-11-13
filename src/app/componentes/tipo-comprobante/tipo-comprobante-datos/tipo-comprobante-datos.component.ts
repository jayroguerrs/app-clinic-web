import {Component, EventEmitter, OnInit, Input, Output, OnDestroy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Usuario } from '../../../shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TipoComprobanteService } from 'src/app/shared/services/tipo-comprobante.service';
import { Subscription } from 'rxjs';
import {NgxSpinnerService} from "ngx-spinner";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
    selector: 'app-tipo-comprobante-datos',
    templateUrl: 'tipo-comprobante-datos.component.html'
})
export class TipoComprobanteDatosComponent implements OnInit, OnDestroy {
    @Input() modal: NgbModalRef;
    @Input() idTipoComprobante: number = 0;
    @Output() eventTipoComprobanteListar: EventEmitter<boolean> = new EventEmitter<boolean>();
    frmTipoComprobante: FormGroup;
    accion = '';
    usuarioActual: Usuario;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    // Suscriptions
    sbcFormulario: Subscription;
    sbcFind: Subscription;

    // Formulario
    submitted;

    // Permisos
    accTot: boolean = false;
    accExp: boolean = false;
    accExc: boolean = false;
    accExi: boolean = false;
    accExf: boolean = false;
    accImp: boolean = false;
    accCrud: boolean = false;
    accCreate: boolean = false;
    accRead: boolean = false;
    accUpdate: boolean = false;
    accDelete: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private utilsService: UtilsService,
        private tipoComprobanteService: TipoComprobanteService,
        private spinner: NgxSpinnerService,
        private permisoHelper: PermisoHelper
    ) {

      this.frmTipoComprobante = this.formBuilder.group({
        descripcion : new FormControl('', Validators.required),
        abreviatura : new FormControl('', Validators.required),
        idEstado : new FormControl(1)
      });

    }

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        if(this.idTipoComprobante > 0 ){
            this.accion = 'Editar';
            this.tipoComprobanteBuscar();
        } else {
            this.accion = 'Nuevo';
        }
        this.permisoHelper.readPermiso().then((accesos) => {
            this.accTot = accesos.accTot;
            this.accExp = accesos.accExp;
            this.accExc = accesos.accExc;
            this.accExi = accesos.accExi;
            this.accExf = accesos.accExf;
            this.accImp = accesos.accImp;
            this.accCrud = accesos.accCrud;
            this.accCreate = accesos.accCreate;
            this.accRead = accesos.accRead;
            this.accUpdate = accesos.accUpdate;
            this.accDelete = accesos.accDelete;  
          });
      
    }

    ngOnDestroy(): void {
      // Destroy subscriptions
      if ( this.sbcFormulario ){ this.sbcFormulario.unsubscribe(); }
      if ( this.sbcFind ){ this.sbcFind.unsubscribe(); }
    }


    limpiarFormulario(): void {
        this.frmTipoComprobante.patchValue({
            descripcion : [''],
            abreviatura : [''],
            idEstado : [1],
        });
    }
    tipoComprobanteBuscar(): void {
        this.sbcFind = this.tipoComprobanteService.obtenerById(this.idTipoComprobante).subscribe(
            resultado => {
                this.frmTipoComprobante.patchValue({
                    descripcion : resultado.descripcion,
                    abreviatura: resultado.abreviatura,
                    idEstado: resultado.idEstado
                });
            }
        );
    }

    get f(): any { return this.frmTipoComprobante.controls; }
    get tipoComprobante(): any {
        const model = {
            id: this.idTipoComprobante,
            descripcion: this.frmTipoComprobante.controls.descripcion.value,
            abreviatura: this.frmTipoComprobante.controls.abreviatura.value,
            usuarioRegistra: this.usuarioActual.nombre,
            usuarioEdita: this.usuarioActual.nombre,
            idEstado: parseInt(this.frmTipoComprobante.controls.idEstado.value, 10)
          };
        return model;
    }

    tipoComprobanteGrabar(): void {
        this.submitted = true;
        if (this.frmTipoComprobante.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            return;
        }

        this.spinner.show();
        if (this.idTipoComprobante > 0 ){
           // EDITAR
           this.sbcFormulario = this.tipoComprobanteService.actualizar(this.tipoComprobante).subscribe(
               resultado => {
                   if(resultado.exito){
                    Swal.fire(resultado.mensaje).then(result => this.eventTipoComprobanteListar.emit(true));
                   } else {
                       this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                   }
               },
               error => {
                 console.log('Error al actualizar el tipo de comprobante', error);
                 this.spinner.hide();
               },
               () => { this.cerrarModal(); this.spinner.hide(); }
            );
        } else {
            // NUEVO

            this.sbcFormulario = this.tipoComprobanteService.grabar(this.tipoComprobante).subscribe(
                resultado => {
                    // console.log(resultado);
                    if(resultado.exito) {
                        Swal.fire({title:'Documento Contable registrado!!!', icon: 'success'});
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                    }
                },
                error => {
                  console.log('Error al registrar el tipo de comprobante', error);
                  this.spinner.hide();
                },
                () => { this.cerrarModal(); this.spinner.hide(); }
            );
        }
    }
    cerrarModal(): void {
        this.modal.close();
    }
}
