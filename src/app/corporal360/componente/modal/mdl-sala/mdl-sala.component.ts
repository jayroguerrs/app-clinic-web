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
import {SalaService} from "../../../shared/service/sala.service";
import {Sala} from "../../../shared/model/sala";
import {ServicioService} from "../../../../shared/services/corporal360/servicio.service";
import {Servicio} from "../../../../shared/models/corporal-360/servicio";
import {Sede} from "../../../../shared/models/sede";
import {SedeService} from "../../../shared/service/sede.service";

@Component({
    selector: 'app-mdl-box',
    templateUrl: 'mdl-sala.component.html'
})
export class MdlSalaComponent implements OnInit, OnDestroy {

    @Input() data: Sala | null = null;

    frmGroup: FormGroup;
    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    loading = false;
    subscription : Subscription;

    estados: {id: number; value: string}[] = [
      {id: 0, value: 'INACTIVO'},
      {id: 1, value: 'ACTIVO'}
    ];

    sedes: Sede[] = [];
    sbcSedes: Subscription;

    // Select2
    sbcServicios: Subscription;
    public servicios: Array<{id: string, text: string}> = [];
    public options: any;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: SalaService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private modal: NgbActiveModal,
        private servicioService: ServicioService,
        private sedeService: SedeService
    ) {
      this.options = {
        multiple: true,
        theme: "classic",
      }
    }

    ngOnInit(): void {
        this.sedeCollection();
        this.servicioCollection();
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.data){
          this.patchForm();
        }
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
      this.sbcServicios?.unsubscribe();
      this.sbcSedes?.unsubscribe();
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({
            nombre : new FormControl(null, Validators.required),
            idSede : new FormControl('', Validators.required),
            servicios : new FormControl([], Validators.required),
            idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      // console.log(this.data);
      this.frmGroup.patchValue({
        nombre: this.data.nombre,
        idSede: this.data.idSede,
        servicios: this.data.servicios.map(x => x.id.toString()),
        idEstado: this.data.idEstado
      });
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.data ? this.data.id : 0,
            nombre: this.f.nombre.value,
            idEstado: parseInt(this.f.idEstado.value, 10),
            idSede: parseInt(this.f.idSede.value, 10),
            idUsuarioRegistro: this.data ? this.data.idUsuarioRegistro : this.usuarioActual.idUsuario,
            idUsuarioModifico: this.data ? this.usuarioActual.idUsuario : null,
            idServicios: this.f.servicios.value.map(x => parseInt(x))
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

        // console.log(this.model);
        // return;

        if (this.data ){
          // EDITAR
          Swal.fire({
            html: `Desea editar los datos de la sala <b>${this.data.nombre}</b>??`,
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
                        html: `Se modifico los datos de la sala <b>${this.data.nombre}</b> con exito`,
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
                      html: `Error al modificar los datos de la sala <b>${this.data.nombre}</b>`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn btn-primary'
                      }
                    });
                    console.log('Error al modificar los datos de la sala', error);
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
            title: 'Desea registrar la nueva sala??',
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
                        text: "Se registro la sala con exito",
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
                    console.log('Error al registrar la sala', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar la sala',
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
      this.sbcServicios = this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
        const servicios: Array<{id: string, text: string}> = [];
        res.forEach((p: any) => {
          const servicio = {
            id: p.id,
            text: p.nombre
          };
          servicios.push(servicio);
        });

        this.servicios = servicios;
      }, error => {
        console.error(error);
      });
    }
    sedeCollection(): void{
      this.sbcSedes = this.sedeService.listar().subscribe((res: Sede[]) => {
        // console.log(res);
        this.sedes = res;
      }, error => {
        console.error(error);
      });
    }
}
