import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MaquinaSedeService } from 'src/app/shared/services/maquinasede.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-maquina-datos',
    templateUrl: 'maquina-sede-datos.component.html'
})
export class MaquinaSedeDatosComponent implements OnInit, OnDestroy {
    @Input() listaSedes: any;
    @Input() listaMaquinas: any;
    @Input() modal: NgbModalRef;
    @Input() idMaquinaSede: number;
    @Output() eventMaquinaListar: EventEmitter<boolean> = new EventEmitter<boolean>();

    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
    frmMaquinaSedeDatos: FormGroup;
    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    maquinaDatos: any;

    servicios: Servicio[] = [];
    sbcServicios: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private maquinaSedeService: MaquinaSedeService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService,
        private servicioService: ServicioService
    ) {}

    ngOnInit(): void {
        this.listarServicios();

        this.usuarioActual = this.usuarioService.UsuarioActual;

        if (this.idMaquinaSede > 0 ) {
            this.accion = 'Editar';
            this.inicializarFormulario();
            this.maquinaSedeBuscar();
        } else {
            this.accion = 'Nuevo';
            this.inicializarFormulario();
        }
    }

    ngOnDestroy(): void {
      this.sbcServicios?.unsubscribe();
    }

    inicializarFormulario(): void {
        this.frmMaquinaSedeDatos = this.formBuilder.group({
            maqSedeDescripcion : [''],
            idEstado : [1, Validators.required],
            idFicticio : [0, Validators.required],
            cboSede: ['', Validators.required],
            cboMaquina: ['', Validators.required],
            maqSedeHoraInicio: ['', Validators.required],
            maqSedeHoraTermino: ['', Validators.required],
            idServicio: new FormControl('', Validators.required)
        });
    }
    limpiarFormulario(): void {
        this.frmMaquinaSedeDatos = this.formBuilder.group({
            maqSedeDescripcion : [''],
            idEstado : [1],
            idFicticio : [0],
            cboSede: [''],
            cboMaquina: [''],
            maqSedeHoraInicio: [''],
            maqSedeHoraTermino: [''],
            idServicio: ['']
        });
    }

    get f(): any { return this.frmMaquinaSedeDatos.controls; }
    get maquina(): any {
        const model = {
            id: this.idMaquinaSede,
            descripcion: this.frmMaquinaSedeDatos.controls.maqSedeDescripcion.value,
            idFicticio: parseInt(this.frmMaquinaSedeDatos.controls.idFicticio.value, 10),
            idEstado: parseInt(this.frmMaquinaSedeDatos.controls.idEstado.value, 10),
            idMaquina: parseInt(this.frmMaquinaSedeDatos.controls.cboMaquina.value, 10),
            idSede: parseInt(this.frmMaquinaSedeDatos.controls.cboSede.value, 10),
            horaInicio : this.frmMaquinaSedeDatos.controls.maqSedeHoraInicio.value,
            horaFin : this.frmMaquinaSedeDatos.controls.maqSedeHoraTermino.value,
            usuarioRegistra: this.usuarioActual.nombre,
            usuarioEdita: this.usuarioActual.nombre,
            idServicio: parseInt(this.frmMaquinaSedeDatos.controls.idServicio.value, 10)
          };

        return model;
    }

    maquinaSedeGrabar(): void {

        this.submitted = true;
        this.spinner.show();
        if (this.frmMaquinaSedeDatos.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            this.spinner.hide();
            return;
        }

        const model = this.maquina;

        if (this.idMaquinaSede > 0 ){
            // EDITAR
            this.maquinaSedeService.actualizar(model).subscribe(
                resultado => {
                    if(resultado.exito){
                        Swal.fire(resultado.mensaje).then((result) => this.eventMaquinaListar.emit(true));
                        this.spinner.hide();
                        this.cerrarModal();
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                        this.spinner.hide();
                    }
                },
                error => {
                    console.log('Error al actualizar Maquina-Sede', error);
                    this.spinner.hide();
                }
            );
        } else {
            // NUEVO
            this.maquinaSedeService.guardar(model).subscribe(
                resultado => {
                    if(resultado.exito) {
                        Swal.fire(resultado.mensaje).then((result) => this.eventMaquinaListar.emit(true) );
                        this.spinner.hide();
                        this.cerrarModal();
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                        this.spinner.hide();
                    }
                },
                error => {
                    console.log('Error al registrar Maquina-Sede', error);
                    this.spinner.hide();
                }
            );
        }
    }
    maquinaSedeBuscar(): void {
        this.spinner.show();
        this.maquinaSedeService.obtenerById(this.idMaquinaSede).subscribe(
            resultado => {
                this.maquinaDatos = resultado;

                this.frmMaquinaSedeDatos.patchValue({
                    maqSedeDescripcion: this.maquinaDatos.descripcion,
                    idFicticio : this.maquinaDatos.idFicticio,
                    idEstado : this.maquinaDatos.idEstado,
                    cboMaquina: this.maquinaDatos.idMaquina,
                    cboSede: this.maquinaDatos.idSede,
                    maqSedeHoraInicio: this.maquinaDatos.horaInicio,
                    maqSedeHoraTermino: this.maquinaDatos.horaFin,
                    idServicio: this.maquinaDatos.idServicio ? this.maquinaDatos.idServicio : '',
                });

                this.spinner.hide();
            },
            error => {
                console.log('Error al obtener las maquina-sede!', error);
                this.spinner.hide();
            }
        );
    }

    listarServicios(): void{
      this.sbcServicios = this.servicioService.listar().subscribe((res) => {
        this.servicios = res;
      }, error => {
        console.log(error);
      })
    }

    cerrarModal(): void {
        this.modal.close();
    }

}
