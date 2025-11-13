import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import Swal from 'sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-usuario-datos',
    templateUrl: 'usuario-datos.component.html',
    styleUrls: ['./usuario-datos.component.scss']
})
export class UsuarioDatosComponent implements OnInit, OnDestroy {
    @Output() usuarioListar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() maestroPerfiles: any;
    @Input() maestroSedes: any;
    @Input() modal: NgbModalRef;
    @Input() idUsuario: number;

    usuarioActual: Usuario;
    frmUsuarioDatos: FormGroup;
    archivoImagenAnuncio: File = null;
    rutaImagenAnuncio: any; // '../../../../assets/images/alumno.png';

    // Subscriptions
    sbcFormulario: Subscription;
    sbcUsuarioObtenerById: Subscription;

    // Formulario
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private utilsService: UtilsService,
        private spinner: NgxSpinnerService
    ){
    }

    ngOnInit() {
      this.frmUsuarioDatos = this.formBuilder.group({
        usuNombres: new FormControl(null, Validators.required),
        usuUsuario: new FormControl(null, Validators.required),
        usuClave: !!this.idUsuario ? new FormControl(null ) : new FormControl(null, Validators.required),
        usuConfirmaClave: !!this.idUsuario ? new FormControl(null ) : new FormControl(null, Validators.required),
        usuIdPerfil: new FormControl('', Validators.required),
        usuIdSede: new FormControl('', Validators.required),
        usuIdEstado: new FormControl(1),
        foto: this.rutaImagenAnuncio,
      }, { validator: this.checkPassword('usuClave', 'usuConfirmaClave') });

        this.usuarioActual = this.usuarioService.UsuarioActual;
        if ( this.idUsuario ){ this.usuarioBuscar(); }
    }

    ngOnDestroy(): void {
      // Destroy subscription
      if ( this.sbcFormulario ){ this.sbcFormulario.unsubscribe(); }
      if ( this.sbcUsuarioObtenerById ){ this.sbcUsuarioObtenerById.unsubscribe(); }

    }

  get f(): any { return this.frmUsuarioDatos.controls; }
    get usuario(): any {
        const model = {
            IdUsuario: this.idUsuario,
            Nombre: this.frmUsuarioDatos.controls.usuNombres.value,
            Usuario: this.frmUsuarioDatos.controls.usuUsuario.value,
            Clave: this.frmUsuarioDatos.controls.usuClave.value,
            IdEstado: parseInt(this.frmUsuarioDatos.controls.usuIdEstado.value, 10),
            IdPerfil: parseInt(this.frmUsuarioDatos.controls.usuIdPerfil.value, 10),
            IdSede: parseInt(this.frmUsuarioDatos.controls.usuIdSede.value, 10),
            UsuarioRegistra: this.usuarioActual.nombre,
            UsuarioEdita: this.usuarioActual.nombre,
            foto: this.rutaImagenAnuncio,
          };
        return model;
    }
    usuarioGrabar(): void {
      this.submitted = true;
        this.spinner.show();
        if (this.frmUsuarioDatos.invalid){
            console.log('formulario', this.frmUsuarioDatos);
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            this.spinner.hide();
            return;
        }
        if(this.idUsuario > 0 ){
            // EDITAR
            this.sbcFormulario = this.usuarioService.actualizar(this.usuario).subscribe(
                resultado => {
                    if(resultado.exito) {
                        Swal.fire({title: resultado.mensaje, icon: 'success'}).then(result => this.usuarioListar.emit(true));
                        this.cerrarModal();
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                    }
                },
                error => {
                    console.log("Error al actualizar el usuario", error);
                    this.spinner.hide();
                },
                () => { this.spinner.hide(); }
            );
        } else {
            //NUEVO
            this.sbcFormulario = this.usuarioService.guardar( this.usuario).subscribe(
                resultado => {
                    if(resultado.exito) {
                        Swal.fire(resultado.mensaje).then(result => this.usuarioListar.emit(true));
                        this.cerrarModal();
                    } else {
                        this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
                    }
                },
                error => {
                    console.error('Error al registrar el usuario', error);
                },
                () => { this.spinner.hide(); }
            )
        }
    }
    usuarioBuscar() {
        this.spinner.show();
        this.sbcUsuarioObtenerById = this.usuarioService.usuarioObtenerById(this.idUsuario).subscribe(
            resultado => {
                this.rutaImagenAnuncio = resultado.foto;
                this.frmUsuarioDatos.patchValue({
                    usuNombres: resultado.nombre,
                    usuUsuario: resultado.usuario,
                    usuClave: null,
                    usuIdPerfil: resultado.idPerfil,
                    usuIdSede: resultado.idSede,
                    usuIdEstado: resultado.idEstado,
                });
            },
            error => {
                console.log('Error al buscar usuario ', error);
            },
            () => { this.spinner.hide(); }
        );
      }
    cerrarModal(): void { this.modal.close(); }

  mostrarFotoAnuncio(file: FileList) {
    return;
    this.archivoImagenAnuncio = file.item(0);
    const reader = new FileReader();
    reader.onload = event => this.rutaImagenAnuncio = event.target.result;
    reader.readAsDataURL(this.archivoImagenAnuncio);
  }

  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // If has value
      if(control.value){
        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          return;
        }
      }else{
        return;
      }

    }
  }

}
