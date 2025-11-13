import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import {Subscription} from "rxjs";
import {FacturaToken} from "../../../../shared/models/facturacion/factura-token";
import {Usuario} from "../../../../shared/models";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {FacturaTokenService} from "../../../../shared/services/facturacion/factura-token.service";
import {SedeService} from "../../../../shared/services/sede.service";
import {Sede} from "../../../../shared/models/sede";
import {ErrorSistema} from "../../../../shared/models/error-sistema";

@Component({
    selector: 'app-mdl-factura-token',
    templateUrl: 'mdl-factura-token.component.html'
})
export class MdlFacturaTokenComponent implements OnInit, OnDestroy {

    @Input() data: FacturaToken | null = null;

    frmGroup: FormGroup;
    usuarioActual: Usuario;

    loading = false;
    submitted = false;
    subscription : Subscription;

    ldSedes = false;
    sbcSedes : Subscription | undefined;
    sedes: Sede[] = [];

    ldPatch = false;


    estados: {id: number; value: string}[] = [
      {id: 0, value: 'INACTIVO'},
      {id: 1, value: 'ACTIVO'}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: FacturaTokenService,
        private utilsService: UtilsService,
        private modal: NgbActiveModal,
        private sedeService: SedeService
    ) {

    }

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.obtenerSedes();

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
            ruta : new FormControl(null, [Validators.required, Validators.maxLength(250)]),
            token :  new FormControl(null, [Validators.required, Validators.maxLength(250)]),
            idSede : new FormControl('', Validators.required),
            idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      this.frmGroup.patchValue({
        ruta: this.data.ruta,
        token: this.data.token,
        idSede: this.data.idSede,
        idEstado: this.data.idEstado
      });
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.data ? this.data.id : 0,
            ruta: this.f.ruta.value,
            token: this.f.token.value,
            idSede: parseInt(this.f.idSede.value, 10),
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
            html: `Desea editar los datos del registro??`,
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
                        html: `Se modifico los datos del registro!!!`,
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
                      html: `Error al intentar modificar los datos del registro`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        popup: 'popins rounded-grant shadow',
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                    console.log('Error al modificar el token', error);
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
            title: 'Desea registrar el nuevo token??',
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
                        text: "Se registro el token con exito",
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
                    console.log('Error al registrar el token', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar el token',
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

    // data
    obtenerSedes(): void{
      this.ldSedes = true;
      this.sbcSedes = this.sedeService.obtener().subscribe((res: any[]) => {
        this.sedes = res.map(x => {
          const m = new Sede();
          m.nombre = x.nombre;
          m.id = x.idSede;
          return m;
        });
        this.ldSedes = false;
      }, error => {
        console.log(error);
        this.ldSedes = false;
      })
    }
}
