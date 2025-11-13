import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {Usuario} from "../../../shared/models";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {FacturaSerie} from "../../../shared/models/factura-serie";
import {FacturaSerieService} from "../../../shared/services/factura-serie.service";
import {Sede} from "../../../shared/models/sede";
import {SedeService} from "../../../shared/services/sede.service";

@Component({
    selector: 'app-mdl-factura-serie',
    templateUrl: 'mdl-factura-serie.component.html'
})
export class MdlFacturaSerieComponent implements OnInit, OnDestroy {

    @Input() data: FacturaSerie | null = null;

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



    ldSedes = false;
    sedes: Sede[] = [];
    sbcSedes: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: FacturaSerieService,
        private sedeService: SedeService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private modal: NgbActiveModal
    ) {

    }

    ngOnInit(): void {
      this.obtenerSedes();
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
            serie : new FormControl(null, Validators.required),
            idSede : new FormControl('', Validators.required),
            idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      // console.log(this.data);
      this.frmGroup.patchValue({
        serie: this.data.serie,
        idSede: this.data.idSede,
        idEstado: this.data.idEstado
      });
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.data ? this.data.id : 0,
            serie: this.f.serie.value,
            idSede: parseInt( this.f.idSede.value, 10),
            idEstado: parseInt(this.f.idEstado.value, 10),
            idUsuarioRegistro: this.data ? this.data.idUsuarioRegistro : this.usuarioActual.idUsuario,
            idUsuarioModifico: this.data ? this.usuarioActual.idUsuario : null,
        };
    }

    obtenerSedes(): void{
      this.ldSedes = true;
      this.sbcSedes = this.sedeService.obtener().subscribe((res: object[]) => {
        this.sedes = res.map((x: any) => {
          const sede = new Sede();
          sede.id = x.idSede;
          sede.nombre =x.nombre;
          return sede;
        });
        this.ldSedes = false;
      }, error => {
       console.log(error);
       this.ldSedes = false;
      });
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
            html: `Desea editar la serie ?`,
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
                          popup: 'popins rounded-grant shadow',
                          confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                        }
                      });

                      this.spinner.hide();
                      this.loading = false;
                    }else{
                      Swal.fire({
                        html: `Se modifico la serie con exito!!!`,
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          popup: 'popins rounded-grant shadow',
                          confirmButton: "btn sbtn btn-primary btn-active-primary popins"
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
                      html: `Error al intentar modificar la serie`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        popup: 'popins rounded-grant shadow',
                        confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                      }
                    });
                    console.log('Error al modificar la serie', error);
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
            title: 'Desea registrar la nueva serie?',
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
                this.spinner.show();
                this.api.registrar(this.model).subscribe((res: boolean | ErrorSistema) => {
                    if (res instanceof ErrorSistema){

                      Swal.fire({
                        title: 'Error',
                        text: res.message,
                        icon: 'error',
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          popup: 'popins rounded-grant shadow',
                          confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                        }
                      });

                      this.spinner.hide();
                      this.loading = false;
                    }else{
                      Swal.fire({
                        text: "Se registro la serie de facturación con exito",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          popup: 'popins rounded-grant shadow',
                          confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                        }
                      });
                      this.spinner.hide();
                      this.loading = false;
                      this.cerrarModal(true);
                    }
                  },
                  error => {
                    this.loading = false;
                    console.log('Error al registrar la serie de facturación', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar la serie de facturación',
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: "Aceptar",
                      customClass: {
                        popup: 'popins rounded-grant shadow',
                        confirmButton: "btn sbtn btn-primary btn-active-primary popins"
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
