import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { MaquinaService } from '../../../shared/services/maquina.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-maquina-datos',
    templateUrl: 'maquina-datos.component.html'
})
export class MaquinaDatosComponent implements OnInit {
    @Output() eventMaquinaListar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() modal: NgbModalRef;
    @Input() idMaquina: number

    frmMaquinaDatos: FormGroup;
    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    maquinaDatos: any;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    color: string = '#000000';
    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private maquinaService: MaquinaService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;

        if(this.idMaquina > 0 ) {
            this.accion = 'Editar';
            this.inicializarFormulario();
            this.maquinaBuscar();
        } else {
            this.accion = 'Nuevo';
            this.inicializarFormulario();
        }
    }

    inicializarFormulario(): void {
        this.frmMaquinaDatos = this.formBuilder.group({
            maqDescripcion : ['', [Validators.required,Validators.maxLength(20)]],
            color : ['#000000', Validators.required],
            maqIdEstado : ['0']
        });
    }
    limpiarFormulario(): void {
    }

    get f(): any { return this.frmMaquinaDatos.controls; }
    get maquina(): any {
        const model = {
            id: this.idMaquina,
            descripcion: this.frmMaquinaDatos.controls.maqDescripcion.value,
            idEstado: Number(this.frmMaquinaDatos.controls.maqIdEstado.value),
            usuarioRegistra: this.usuarioActual.nombre,
            usuarioEdita: this.usuarioActual.nombre,
            color: this.f.color.value,
          };

        return model;
    }

    maquinaGrabar(): void {
        this.submitted = true;

        this.spinner.show();
        if (this.frmMaquinaDatos.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            this.spinner.hide();
            return;
        }

        const model = this.maquina;

        if (this.idMaquina > 0 ){
           // EDITAR
            this.maquinaService.actualizar(model).subscribe(
                resultado => {
                    if(resultado.exito) {
                        Swal.fire(resultado.mensaje).then((result) => this.eventMaquinaListar.emit(true));
                        this.spinner.hide();
                        this.cerrarModal();
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                        this.spinner.hide();
                    }
                },
                error => {
                    console.log('Error al registrar al cliente', error);
                    this.spinner.hide();
                });
        } else {
            // NUEVO
            this.maquinaService.guardar(model).subscribe(
                resultado => {
                    if(resultado.exito) {
                        Swal.fire({title: 'Máquina registrada!!!', icon: 'success'}).then((result) => this.eventMaquinaListar.emit(true));
                        this.spinner.hide();
                        this.cerrarModal();
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                        this.spinner.hide();
                    }
                },
                error => {
                    console.log('Error al registrar al maquina', error);
                    this.spinner.hide();
                }
            );
        }
    }
    maquinaBuscar(): void {
        this.spinner.show();
        this.maquinaService.obtenerById(this.idMaquina).subscribe(resultado => {
            this.maquinaDatos = resultado;

            this.frmMaquinaDatos.patchValue({
                maqDescripcion: this.maquinaDatos.descripcion,
                maqIdEstado : this.maquinaDatos.idEstado,
                color : this.maquinaDatos.color
            });
            this.color = this.maquinaDatos.color;
            this.spinner.hide();
        });
    }

    cerrarModal(): void {
        this.modal.close();
    }

  /********************************************************************************************************
   * Events
   */
  // funciones
  onChangeColor(event): void{
    this.f.color.setValue(event);
    // console.log(this.f.color.value);
  }
}
