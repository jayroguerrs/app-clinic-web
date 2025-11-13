import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {Servicio} from "../../../../shared/models/corporal-360/servicio";
import {Usuario} from "../../../../shared/models";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {ServicioService} from "../../../../shared/services/corporal360/servicio.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";

@Component({
    selector: 'app-mdl-servicio',
    templateUrl: 'mdl-servicio.component.html'
})
export class MdlServicioComponent implements OnInit, OnDestroy {

    @Input() data: Servicio | null = null;

    frmGroup: FormGroup;
    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    maquinaDatos: any;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    loading = false;
    subscription : Subscription;

    estados: {id: number; value: string}[] = [
      {id: 0, value: 'INACTIVO'},
      {id: 1, value: 'ACTIVO'}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: ServicioService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private modal: NgbActiveModal
    ) {

    }

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.data){
          this.patchForm();
        }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({
            nombre : new FormControl(null, Validators.required),
            nombreCorto : new FormControl(null, Validators.required),
            idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      console.log(this.data);
      this.frmGroup.patchValue({
        nombre: this.data.nombre,
        nombreCorto: this.data.nombreCorto,
        idEstado: this.data.idEstado
      });
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.data ? this.data.id : 0,
            nombre: this.f.nombre.value,
            nombreCorto: this.f.nombreCorto.value,
            idEstado: parseInt(this.f.idEstado.value, 10),
            idUsuarioRegistro: this.data ? this.data.idUsuarioRegistro : this.usuarioActual.idUsuario,
            idUsuarioModifico: this.data ? this.usuarioActual.idUsuario : null,
        };
    }

    onSubmit(): void {
        this.submitted = true;
        this.loading = true;

        if (this.frmGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            this.loading = false;
            return;
        }

        if (this.data ){
            // EDITAR
          Swal.fire({
            html: `Desea editar los datos del servicio <b>${this.data.nombre}</b>??`,
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            showCancelButton: true
          }).then(
            result => {
              if(result.isConfirmed) {
                this.spinner.show();
                this.api.modificar(this.model).subscribe((res: boolean | ErrorSistema)=> {

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
                        html: `Se modifico los datos del servicio <b>${this.data.nombre}</b> con exito!!!`,
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
                      html: `Error al intentar modificar los datos del servicio <b>${this.data.nombre}</b>`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn btn-primary'
                      }
                    });
                    console.log('Error al modificar el servicio', error);
                    this.loading = false;
                    this.spinner.hide();
                  });
              }else{
                this.cerrarModal();
              }
            }
          );

        } else {
            // NUEVO
          Swal.fire({
            title: 'Desea registrar el nuevo servicio??',
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            showCancelButton: true
          }).then(
            result => {
              if(result.isConfirmed) {
                this.spinner.show();
                this.api.registrar(this.model).subscribe((res: boolean | ErrorSistema) => {
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
                        text: "Se registro el servicio con exito",
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
                    console.log('Error al registrar el servicio', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar el servicio',
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn btn-primary'
                      }
                    });
                    this.spinner.hide();
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
