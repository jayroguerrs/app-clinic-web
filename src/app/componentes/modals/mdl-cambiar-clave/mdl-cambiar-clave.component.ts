import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ConfirmaClave } from 'src/app/shared/validator/confirma-clave.validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { Usuario } from 'src/app/shared/models/usuario';
@Component({
  selector: 'app-mdl-cambiar-clave-admin',
  templateUrl: './mdl-cambiar-clave.component.html',
  styleUrls: ['./mdl-cambiar-clave.component.scss']
})
export class MdlCambiarClaveComponent implements OnInit {
  @Input() Usuario: Usuario;
  
  frmCambiarClave!: FormGroup;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  submitted = false;
  
  mostrarClaveNueva: boolean = false;
  mostrarConfirmarClave: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal
  ) { }


  ngOnInit(): void {
    this.inicializarFormulario();
  }
  
  inicializarFormulario(): void {
    this.frmCambiarClave = this.formBuilder.group(
      {
        claveNueva: ['', [
          Validators.required, 
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]],
        confirmarClave: ['', [Validators.required, Validators.minLength(8)]]
      }, {
        validators: ConfirmaClave('claveNueva', 'confirmarClave')
      }
    );
  }
  
  get f() { return this.frmCambiarClave.controls; }

  toggleMostrarClaveNueva(): void {
    this.mostrarClaveNueva = !this.mostrarClaveNueva;
  }

  toggleMostrarConfirmarClave(): void {
    this.mostrarConfirmarClave = !this.mostrarConfirmarClave;
  }
  
  getPasswordStrength(): string {
    const password = this.f.claveNueva.value;
    if (!password) return '';
    
    if (password.length < 8) return 'weak';
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    
    const typesCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
    
    if (password.length >= 8 && typesCount === 4) {
      return 'strong';
    } else if (password.length >= 8 && typesCount >= 3) {
      return 'medium';
    }
    
    return 'weak';
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();
    if (strength === 'weak') return 'text-danger';
    if (strength === 'medium') return 'text-warning';
    if (strength === 'strong') return 'text-success';
    return '';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength === 'weak') return 'Débil';
    if (strength === 'medium') return 'Media';
    if (strength === 'strong') return 'Fuerte';
    return '';
  }
  
  hasMinLength(): boolean {
    return this.f.claveNueva.value?.length >= 8;
  }
  
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.f.claveNueva.value || '');
  }
  
  hasLowerCase(): boolean {
    return /[a-z]/.test(this.f.claveNueva.value || '');
  }
  
  hasDigit(): boolean {
    return /[0-9]/.test(this.f.claveNueva.value || '');
  }
  
  hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.f.claveNueva.value || '');
  }
  
  btnCambiarClave(): void {
    this.submitted = true;

    if(this.frmCambiarClave.invalid) {
      return;
    }

    this.spinner.show();

    this.usuarioService.cambiarClaveGenerica(this.Usuario.idUsuario, this.frmCambiarClave.controls.claveNueva.value).subscribe(
      (resultado: any) => {
        this.spinner.hide();
        if(resultado === true) {
          // Actualizar la propiedad claveGenerica del usuario actual
          const usuarioActual = this.usuarioService.UsuarioActual;
          if(usuarioActual) {
            usuarioActual.claveGenerica = false;
            // Actualizar en localStorage
            const userKeyString = localStorage.getItem('usersKey');
            if(userKeyString) {
              const userKey = JSON.parse(userKeyString);
              userKey.claveGenerica = false;
              localStorage.setItem('usersKey', JSON.stringify(userKey));
            }
          }
          
          this.utilsService.mostrarToast('La contraseña ha sido cambiada exitosamente.', 'success');
          this.activeModal.close('success');
        } else {
          this.utilsService.mostrarToast('Error al cambiar la contraseña.', 'error');
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.log('Error al actualizar la clave');
        this.utilsService.mostrarToast('Error al actualizar la clave. Intente de nuevo.', 'error');
      }
    );
  }
  
  cerrarModal(): void {
    this.activeModal.dismiss('cancel');
  }

}
