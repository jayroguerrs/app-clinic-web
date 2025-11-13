import { Component, EventEmitter, OnInit,Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { CajaService } from '../../../shared/services/caja.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SedeService } from '../../../shared/services/sede.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-caja-datos',
    styleUrls: ['./caja-datos.components.scss'],
    templateUrl: 'caja-datos.component.html'
})
export class CajaDatosComponent implements OnInit {
    @Input() idCaja: number = 0;
    @Output() eventoCajaListar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() modal: NgbModalRef;

    maestroSedes = [];
    maestroResponsables = [];

    frmCajaDatos: FormGroup;
    accion = '';
    idSede: number;
    idSedecaptura:number;
    fregistro=null;
    descripcion=null;
    sede: string;
    submitted = false;
    usuarioActual: Usuario;
    cajaDatos: any;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
    modalUsuarioSeleccionRef: NgbModalRef;
    idPerfilBuscarUsuario: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private cajaService: CajaService,
        private utilsService: UtilsService,
        private sedeservice:SedeService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.obtenerSedes();

        if(this.idCaja > 0){
            this.accion = 'Editar';
            this.inicializarFormulario();
            this.cajaBuscar();
        } else {
            this.accion = 'Nuevo';
            this.inicializarFormulario();
        }
    }

    inicializarFormulario(): void {
        this.frmCajaDatos = this.formBuilder.group({
            cajDescripcion : new FormControl(null, Validators.required),
            cajIdSede : new FormControl('', Validators.required),
            cajaIdResponsable: new FormControl('', Validators.required)
        });
    }
    limpiarFormulario(): void {
        this.frmCajaDatos.patchValue({
            cajDescripcion : [''],
            cajIdSede : [''],
            cajaIdResponsable: new FormControl('', Validators.required)
        });
    }

    obtenerSedes(): void {
        this.sedeservice.obtener().subscribe(
            resultado => {
                this.maestroSedes = resultado;
            },
            error => {
                console.log('Error al obtener las sedes', error);
            }
        );
    }
    abrirSelecionarUsuario(modal: NgbModalRef): void {
        this.idPerfilBuscarUsuario = '4, 9';
        this.modalUsuarioSeleccionRef = this.utilsService.abrirModal(modal, 'md');
    }

    eventUsuarioSeleccionado(event): void {
        this.frmCajaDatos.patchValue({
          cajaIdResponsable : event.nombre
        })
        $('[name=cajaIdResponsable]').val(event.nombre);
        $('[name=cajaIdResponsable]').attr('responsable-idUsuario', event.idUsuario);
    }


    get f(): any {
        return this.frmCajaDatos.controls;
    }
    get caja(): any {
        if (this.frmCajaDatos.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            return;
        }

        this.idSedecaptura = Number(this.frmCajaDatos.controls.cajIdSede.value);
        this.descripcion = this.frmCajaDatos.controls.cajDescripcion.value;
        if(this.idSedecaptura===0){
            this.utilsService.mostrarToast('Seleccione una Sede , para Continuar!!!', 'info');
            return null;
        }
        if(this.descripcion===null){
            this.utilsService.mostrarToast('Ingrese la Descripción de la Caja para continuar!!!', 'info');
            return null;
        }

        const model = {
            id: this.idCaja,
            descripcion: this.frmCajaDatos.controls.cajDescripcion.value,
            idSede:Number(this.frmCajaDatos.controls.cajIdSede.value),
            idEstado:1,
            usuarioRegistra: this.usuarioActual.nombre,
            usuarioEdita: this.usuarioActual.nombre,
            fechaRegistra: new Date(),
            fechaEdita: new Date(),
            idUsuarioResponsable: parseInt($('[name=cajaIdResponsable]').attr('responsable-idUsuario'), 10)
        };
        return model;
    }

    cajaGrabar(): void {
        this.spinner.show();
        this.submitted = true;

        if (this.idCaja > 0 ){
           // EDITAR
           this.cajaService.actualizar(this.caja).subscribe(
                resultado => {
                   if(resultado.exito) {
                        Swal.fire(resultado.mensaje).then((result) => this.eventoCajaListar.emit(true));
                        this.cerrarModal();
                        this.spinner.hide();
                   } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                        this.spinner.hide();
                   }
                },
                error => {
                    console.log('Error al actualizar la caja', error);
                    this.spinner.hide();
                });
        } else {
            // NUEVO
            this.cajaService.guardar(this.caja).subscribe(
                resultado => {
                    if(resultado.exito) {
                        Swal.fire(resultado.mensaje).then((result) => this.eventoCajaListar.emit(true));
                        this.cerrarModal();
                        this.spinner.hide();
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                        this.spinner.hide();
                    }
                },
                error => {
                    console.log('Error al registrar la caja', error);
                    this.spinner.hide();
                }
            );
        }
    }
    cajaBuscar(): void {
        this.spinner.show();
        this.cajaService.obtenerByIdCaja(this.idCaja).subscribe(
            resultado => {
                this.cajaDatos = resultado;
                this.frmCajaDatos.patchValue({
                    cajDescripcion: this.cajaDatos.descripcion,
                    cajIdSede : this.cajaDatos.idSede
                    }
                );
                console.log(this.cajaDatos);

                $('[name=cajaIdResponsable]').val(this.cajaDatos.usuarioResponsable);
                $('[name=cajaIdResponsable]').attr('responsable-idUsuario', this.cajaDatos.idUsuarioResponsable);
                this.spinner.hide();
            },
            error => {
                console.log('Error al buscar los datos de la caja', error);
                this.spinner.hide();
            }
        );
    }
    cerrarModal(): void {
        this.modal.close();
    }
}
