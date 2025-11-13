import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ConfirmaClave } from 'src/app/shared/validator/confirma-clave.validator';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-usuario-cambiar-clave',
  templateUrl: './usuario-cambiar-clave.component.html',
  styleUrls: ['./usuario-cambiar-clave.component.scss']
})
export class UsuarioCambiarClaveComponent implements OnInit {
  frmCambiarClave!: FormGroup;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  submitted = false;
  
  mostrarClaveActual: boolean = false;
  mostrarClaveNueva: boolean = false;
  mostrarConfirmarClave: boolean = false;
  
  claveUsuarioActual: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }  ngOnInit(): void {
    this.inicializarFormulario();
  }
  
  inicializarFormulario(): void {
    this.frmCambiarClave = this.formBuilder.group(
      {
        claveActual: ['', Validators.required],
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
  
  toggleMostrarClaveActual(): void {
    this.mostrarClaveActual = !this.mostrarClaveActual;
  }

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
    
    const model = {
      idUsuario: this.usuarioService.UsuarioActual.idUsuario,
      claveActual: this.frmCambiarClave.controls.claveActual.value,
      claveNueva: this.frmCambiarClave.controls.claveNueva.value,
    };

    this.usuarioService.cambiarClave(model).subscribe(
      (resultado: any) => {
        this.spinner.hide();
        if(resultado.exito) {
          this.utilsService.mostrarToast(resultado.mensaje, 'success');
          this.router.navigate(['Inicio']);
        } else {
          this.utilsService.mostrarToast(resultado.mensaje, 'error');
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.log('Error al actualizar la clave');
        this.utilsService.mostrarToast('Error al actualizar la clave. Intente de nuevo.', 'error');
      }
    );
  }
}
