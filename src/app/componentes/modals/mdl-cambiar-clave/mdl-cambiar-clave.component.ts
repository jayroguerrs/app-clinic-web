import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthService} from "../../../shared/services/auth.service";
import {AccionCita} from "../../../shared/enumeracion/enums";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import { Usuario } from 'src/app/shared/models';
import {UsuarioService} from "../../../shared/services/usuario.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-cambiar-clave.component.html',
  styleUrls: ['./mdl-cambiar-clave.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlCambiarClaveComponent implements OnInit, AfterViewInit {
  @Input() Usuario: Usuario;
  subscription: Subscription | undefined;
  ldSubmit = false;
  submitted = false;

  frmGroup: FormGroup;
  accionCita = AccionCita;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modal: NgbActiveModal,
    public auth: AuthService,
    private api: UsuarioService,
    private util: UtilsService
  ) {
    this.frmGroup = this.formBuilder.group({
      clave: new FormControl(null, Validators.required),
      repetirClave: new FormControl(null, Validators.required),
    },{

      validator: this.ConfirmedValidator('clave', 'repetirClave')

    });
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  cerrarModal(): void{
    this.modal.close();
  }

  onSubmit(): void{
    Swal.fire({
      title: 'Agendar siguiente cita',
      html: `¿Desea cambiar la clave del usuario <b>${this.Usuario.usuario}</b>?`,
      icon: 'question',
      buttonsStyling: false,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
        cancelButton: 'btn sbtn btn-light popins mr-2',
      },
      reverseButtons: true
    }).then( async (result) => {
      if (result.value) {

        this.submitted = true;

        if(this.frmGroup.invalid){
          this.util.mostrarToast('Debe ingresar todos los datos', 'warning');
          return;
        }

        this.ldSubmit = true;

        this.subscription = this.api.CambiarClave(this.Usuario.idUsuario, this.f.clave.value).subscribe((res: boolean | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            Swal.fire({
              title: 'Error',
              text: `${res.message}`,
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Aceptar',
              showCancelButton: false,
              customClass: {
                confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
                cancelButton: 'btn sbtn btn-light popins mr-2',
              },
              reverseButtons: true
            });
          }else{

            Swal.fire({
              text: `Se cambio con exito la contraseña`,
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Aceptar',
              showCancelButton: false,
              customClass: {
                confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
                cancelButton: 'btn sbtn btn-light popins mr-2',
              },
              reverseButtons: true
            }).then( async (result) => {
            });

            this.cerrarModal();
          }
          this.ldSubmit = false;
        }, (error: any) => {
          console.log(error);
          this.ldSubmit = false;
        });

      }
    });
  }

  get f(): any{
    return this.frmGroup.controls;
  }

  // validator
  ConfirmedValidator(controlName: string, matchingControlName: string){

    return (formGroup: FormGroup) => {

      const control = formGroup.controls[controlName];

      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {

        return;

      }

      if (control.value !== matchingControl.value) {

        matchingControl.setErrors({ confirmedValidator: true });

      } else {

        matchingControl.setErrors(null);

      }

    }

  }

}
