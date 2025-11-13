import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {PromocionCategoria} from "../../../shared/models/promocion";
import {PromocionCategoriaService} from "../../../shared/services/promocion-categoria.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {Usuario} from "../../../shared/models";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-mdl-promocion-categoria',
    templateUrl: 'mdl-promocion-categoria.component.html'
})
export class MdlPromocionCategoriaComponent implements OnInit, OnDestroy {

    @Input() categoria: PromocionCategoria | null = null;

    frmGroup: FormGroup;
    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    maquinaDatos: any;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    loading = false;
    subscription : Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: PromocionCategoriaService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private modal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.categoria){
          this.patchForm();
        }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

  initForm(): void {
        this.frmGroup = this.formBuilder.group({
            nombre : new FormControl(null, Validators.required),
            idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      this.frmGroup.patchValue({
        nombre: this.categoria.nombre,
        idEstado: this.categoria.idEstado
      })
    }


    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.categoria ? this.categoria.id : 0,
            nombre: this.f.nombre.value,
            idEstado: parseInt(this.f.idEstado.value, 10),
            idUsuarioRegistro: this.categoria ? this.categoria.idUsuarioRegistro : this.usuarioActual.idUsuario,
            idUsuarioModifico: this.categoria ? this.usuarioActual.idUsuario : null,
        };
    }

    onSubmit(): void {
        this.submitted = true;
        this.loading = true;

        this.spinner.show();
        if (this.frmGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            this.spinner.hide();
            this.loading = false;
            return;
        }

        if (this.categoria ){
           // EDITAR
            this.api.modificar(this.model).subscribe((res)=> {

              if (res instanceof ErrorSistema){

                Swal.fire({
                  title: 'Error',
                  text: res.message,
                  icon: 'error',
                  buttonsStyling: false,
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'btn btn-primary'
                  }
                });

                this.spinner.hide();
                this.loading = false;
              }else{
                Swal.fire({
                  text: "Se registro la categoria con exito",
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Aceptar",
                  customClass: {
                    confirmButton: "btn btn-primary"
                  }
                });
                this.spinner.hide();
                this.loading = false;
                this.cerrarModal(true);
              }

            },
            error => {
                Swal.fire({
                  title: 'Error',
                  text: 'Ocurrio un error',
                  icon: 'error',
                  buttonsStyling: false,
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'btn btn-primary'
                  }
                });
                console.log('Error al registrar al cliente', error);
              this.loading = false;
                this.spinner.hide();
            });
        } else {
            // NUEVO
            this.api.registrar(this.model).subscribe((res) => {
                if (res instanceof ErrorSistema){

                  Swal.fire({
                    title: 'Error',
                    text: res.message,
                    icon: 'error',
                    buttonsStyling: false,
                    confirmButtonText: 'Aceptar',
                    customClass: {
                      confirmButton: 'btn btn-primary'
                    }
                  });

                  this.spinner.hide();
                  this.loading = false;
                }else{
                  Swal.fire({
                    text: "Se registro la categoria con exito",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Aceptar",
                    customClass: {
                      confirmButton: "btn btn-primary"
                    }
                  });
                  this.spinner.hide();
                  this.loading = false;
                  this.cerrarModal(true);
                }
            },
            error => {
                this.loading = false;
                console.log('Error al registrar al maquina', error);
                this.spinner.hide();
            });
        }
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }
}
