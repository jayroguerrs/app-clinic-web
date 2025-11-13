import {Component, Input, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {Usuario} from "../../../shared/models";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {MaquinaMarcaService} from "../../../shared/services/maquina-marca.service";
import {MaquinaMarca} from "../../../shared/models/maquina-marca";
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";

@Component({
    selector: 'app-mdl-maquina-marca',
    templateUrl: 'mdl-maquina-marca.component.html'
})
export class MdlMaquinaMarcaComponent implements OnInit, OnDestroy {

    @Input() data: MaquinaMarca | null = null;
    @Output() OnCreated : EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() OnUpdated : EventEmitter<boolean> = new EventEmitter<boolean>();

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

    color: string = '#000000';

    subscripctions: Subscription[] = [];
    ldServicios: boolean;
    servicios: Servicio[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: MaquinaMarcaService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private modal: NgbActiveModal,
        private servicioService: ServicioService
    ) {

    }

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.data) {
          this.patchForm();
        }
        this.obtenerServicios();
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
      this.subscripctions.forEach(s => {
        s.unsubscribe();
      });
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({
            nombre : new FormControl(null, Validators.required),
            nombreCorto : new FormControl(null, Validators.required),
            // color : new FormControl('#000000', Validators.required),
            idServicios: new FormControl([]),
            idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      // console.log(this.data);
      this.frmGroup.patchValue({
        nombre: this.data.nombre,
        nombreCorto: this.data.nombreCorto,
        idServicios: this.data.idServicios,
        idEstado: this.data.idEstado
      });
    }

    get f(): any { return this.frmGroup.controls; }
    get model(): any {
        return {
            id: this.data ? this.data.id : 0,
            nombre: this.f.nombre.value,
            nombreCorto: this.f.nombreCorto.value,
            idServicios: this.f.idServicios.value,
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
            html: `Desea editar los datos de la marca <b>${this.data.nombre}</b>??`,
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
                        html: `Se modifico los datos de la marca <b>${this.data.nombre}</b> con exito!!!`,
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          confirmButton: "btn btn-primary"
                        }
                      });
                      this.spinner.hide();
                      this.loading = false;
                      this.OnUpdated.emit(true);
                      this.cerrarModal(true);
                    }

                  },
                  error => {
                    Swal.fire({
                      title: 'Error',
                      html: `Error al intentar modificar los datos de la marca <b>${this.data.nombre}</b>`,
                      icon: 'error',
                      buttonsStyling: false,
                      confirmButtonText: 'Aceptar',
                      customClass: {
                        confirmButton: 'btn btn-primary'
                      }
                    });
                    console.log('Error al modificar el MaquinaMarca', error);
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
            title: 'Desea registrar la nueva marca de maquina??',
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
                        text: "Se registro la nueva marca de maquina con exito",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Aceptar",
                        customClass: {
                          confirmButton: "btn btn-primary"
                        }
                      });
                      this.spinner.hide();
                      this.loading = false;
                      this.OnCreated.emit(true);
                      this.cerrarModal(true);
                    }
                  },
                  error => {
                    this.loading = false;
                    console.log('Error al registrar la marca de maquina', error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Error al registrar el MaquinaMarca',
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

    // funciones
    onChangeColor(event): void{
      this.f.color.setValue(event);
      // console.log(this.f.color.value);
    }


    /**
     * Data
     */
    obtenerServicios(): void{
      this.ldServicios = true;
      const subs = this.servicioService.listar().subscribe((res: Servicio[]) => {
        this.servicios = res;
        this.ldServicios = false;
      }, error => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error al obtener los servicios', 'error');
        this.ldServicios = false;
      });
    }
}
