import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {Usuario} from "../../../../shared/models";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {Categoria} from "../../../shared/model/categoria";
import {CategoriaService} from "../../../shared/service/categoria.service";
import {Servicio} from "../../../../shared/models/corporal-360/servicio";
import {ServicioService} from "../../../../shared/services/corporal360/servicio.service";

@Component({
    selector: 'app-mdl-categoria',
    templateUrl: 'mdl-categoria.component.html'
})
export class MdlCategoriaComponent implements OnInit, OnDestroy {

    @Input() data: Categoria | null = null;

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

    servicios: Servicio[] = [];
    sbcServicio: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: CategoriaService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private modal: NgbActiveModal,
        private servicioService: ServicioService
    ) {

    }

    ngOnInit(): void {
        this.servicioCollection();
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.data){
          this.patchForm();
        }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
      this.sbcServicio?.unsubscribe();
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({
            nombre : new FormControl(null, Validators.required),
            idServicio : new FormControl('', Validators.required),
            idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      // console.log(this.data);
      this.frmGroup.patchValue({
        nombre: this.data.nombre,
        idServicio: this.data.idServicio,
        idEstado: this.data.idEstado
      });
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.data ? this.data.id : 0,
            nombre: this.f.nombre.value,
            idServicio: parseInt(this.f.idServicio.value, 10),
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
            html: `Desea editar los datos de la categoria <b>${this.data.nombre}</b>??`,
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
                        html: `Se modifico los datos de la categoria <b>${this.data.nombre}</b> con exito`,
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
                      html: `Error al intentar modificar los datos de la categoria <b>${this.data.nombre}</b>`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn btn-primary'
                      }
                    });
                    console.log('Error al modificar la categoria', error);
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
            title: 'Desea registrar la nueva categoria??',
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
                    console.log('Error al registrar la categoria', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar la categoria',
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

    // data
    servicioCollection(): void{
      this.sbcServicio = this.servicioService.listarByEstado(1).subscribe((res) => {
        this.servicios = res;
      }, error => {
        console.error(error);
      })
    }
}
