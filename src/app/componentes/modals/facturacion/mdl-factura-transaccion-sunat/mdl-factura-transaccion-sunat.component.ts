import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import {Subscription} from "rxjs";
import {Usuario} from "../../../../shared/models";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {FacturaTransaccionSunat} from "../../../../shared/models/facturacion/factura-transaccion-sunat";
import {FacturaTransaccionSunatService} from "../../../../shared/services/facturacion/factura-transaccion-sunat.service";

@Component({
    selector: 'app-mdl-factura-transaccion-sunat',
    templateUrl: 'mdl-factura-transaccion-sunat.component.html'
})
export class MdlFacturaTransaccionSunatComponent implements OnInit, OnDestroy {

    @Input() data: FacturaTransaccionSunat | null = null;

    frmGroup: FormGroup;
    usuarioActual: Usuario;

    loading = false;
    submitted = false;
    subscription : Subscription;

    ldPatch = false;


    estados: {id: number; value: string}[] = [
      {id: 0, value: 'INACTIVO'},
      {id: 1, value: 'ACTIVO'}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: FacturaTransaccionSunatService,
        private utilsService: UtilsService,
        private modal: NgbActiveModal
    ) {

    }

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.data) {
          this.patchForm();
        }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({
          nombre : new FormControl(null, [Validators.required, Validators.maxLength(75)]),
          descripcion : new FormControl(null, [Validators.maxLength(150)]),
          valor :  new FormControl(null, [Validators.required, Validators.maxLength(5)]),
          idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      this.frmGroup.patchValue({
        nombre: this.data.nombre,
        descripcion: this.data.descripcion,
        valor: this.data.valor,
        idEstado: this.data.idEstado
      });
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.data ? this.data.id : 0,
            nombre: this.f.nombre.value,
            descripcion: this.f.descripcion.value,
            valor: this.f.valor.value,
            idEstado: parseInt(this.f.idEstado.value, 10),
            idUsuarioRegistro: this.data ? this.data.idUsuarioRegistro : this.usuarioActual.idUsuario,
            idUsuarioModifico: this.data ? this.usuarioActual.idUsuario : null,
        };
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.frmGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            return;
        }

        if (this.data ){
            // EDITAR
          Swal.fire({
            html: `Desea editar los datos del tipo de transacción <b>${this.data?.nombre}</b>??`,
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            customClass: {
              popup: 'popins rounded-grant shadow',
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
              cancelButton: 'btn sbtn btn-light popins mr-2',
            },
            reverseButtons: true
          }).then(
            result => {
              if(result.isConfirmed) {

                this.loading = true;
                this.api.modificar(this.model).subscribe((res: boolean | ErrorSistema)=> {

                    if (res instanceof ErrorSistema){

                      Swal.fire({
                        title: 'Error',
                        text: res.message,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                          popup: 'popins rounded-grant shadow',
                          confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                        }
                      });

                      this.loading = false;
                    }else{
                      Swal.fire({
                        html: `Se modifico los datos del tipo de transacción!!!`,
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                          popup: 'popins rounded-grant shadow',
                          confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                        }
                      });
                      this.loading = false;
                      this.cerrarModal(true);
                    }

                  },
                  error => {
                    Swal.fire({
                      title: 'Error',
                      html: `Error al intentar modificar los datos del tipo de transacción`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        popup: 'popins rounded-grant shadow',
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                    console.log('Error al modificar el tipo de transacción', error);
                    this.loading = false;
                  });
              }else{
                this.cerrarModal();
              }
            }
          );

        } else {
            // NUEVO
          Swal.fire({
            title: 'Desea registrar el nuevo tipo de transacción??',
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            customClass: {
              popup: 'popins rounded-grant shadow',
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
              cancelButton: 'btn sbtn btn-light popins mr-2',
            },
            reverseButtons: true
          }).then(
            result => {
              if(result.isConfirmed) {
                this.loading = true;

                this.api.registrar(this.model).subscribe((res: boolean | ErrorSistema) => {
                    if (res instanceof ErrorSistema){

                      Swal.fire({
                        title: 'Error',
                        text: res.message,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                          popup: 'popins rounded-grant shadow',
                          confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                        }
                      });
                      this.loading = false;
                    }else{
                      Swal.fire({
                        text: "Se registro el tipo de transacción con exito",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: 'Aceptar',
                        customClass: {
                          popup: 'popins rounded-grant shadow',
                          confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                        }
                      });
                      this.loading = false;
                      this.cerrarModal(true);
                    }
                  },
                  error => {
                    this.loading = false;
                    console.log('Error al registrar el tipo de transacción', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar el tipo de transacción',
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        popup: 'popins rounded-grant shadow',
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                  });
              }
            }
          );
        }
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

}
