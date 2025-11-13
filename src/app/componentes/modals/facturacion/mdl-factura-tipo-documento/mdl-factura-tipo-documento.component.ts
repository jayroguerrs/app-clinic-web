import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import {Subscription} from "rxjs";
import {Usuario} from "../../../../shared/models";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {SedeService} from "../../../../shared/services/sede.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {FacturaTipoDocumento} from "../../../../shared/models/facturacion/factura-tipo-documento";
import {FacturaTipoDocumentoService} from "../../../../shared/services/facturacion/factura-tipo-documento.service";

@Component({
    selector: 'app-mdl-factura-tipo-documento',
    templateUrl: 'mdl-factura-tipo-documento.component.html'
})
export class MdlFacturaTipoDocumentoComponent implements OnInit, OnDestroy {

    @Input() data: FacturaTipoDocumento | null = null;

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
        private api: FacturaTipoDocumentoService,
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
          longitud :  new FormControl(-1, Validators.required),
          idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      this.frmGroup.patchValue({
        nombre: this.data.nombre,
        descripcion: this.data.descripcion,
        valor: this.data.valor,
        longitud: this.data.longitud,
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
            longitud: parseInt( this.f.longitud.value, 10),
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
            html: `Desea editar los datos del tipo de documento <b>${this.data?.nombre}</b>??`,
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
                        html: `Se modifico los datos del tipo de documento!!!`,
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
                      html: `Error al intentar modificar los datos del tipo de documento`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        popup: 'popins rounded-grant shadow',
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                    console.log('Error al modificar el tipo de documento', error);
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
            title: 'Desea registrar el nuevo tipo de documento??',
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
                        text: "Se registro el tipo de documento con exito",
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
                    console.log('Error al registrar el tipo de documento', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar el tipo de documento',
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
