import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from '../../../shared/services/cliente.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserSettingsService } from '../../../shared/services/user-settings.service';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { PersonalizarClinic, Usuario, UsuarioActualizarDatos } from '../../../shared/models';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Router } from '@angular/router';
import { paths } from '../../../../commons/routes';

@Component({
  selector: 'app-mdl-actualizar-datos-user',
  templateUrl: './mdl-actualizar-datos-user.component.html',
  styleUrls: ['./mdl-actualizar-datos-user.component.scss']
})
export class MdlActualizarDatosUserComponent implements OnInit {

  @Input() modal!: NgbModalRef;
  @Input() actualizarDatos: boolean = false;
  
  esDni: boolean = true;
  frmUserDatos!: FormGroup;
  submitted: boolean = false;
  bnotfoundDNI: boolean = false;

  usuario!: Usuario;

  colorSeleccionado: string | null = '#007bff';
  colorTextoSeleccionado: string | null = '#FFFFFF'; 
  
  documento: string = 'DNI'
  esExtranjero: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private spinner: NgxSpinnerService,
    private userSettingsService: UserSettingsService,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.UsuarioActual;
    this.claveActualUsuario();
    this.inicializarFormulario();

    this.establecerFechaMaxima();
    this.setDatosPersonalizar();
  }

  get celular(): string {
    let re = /[^\d]/g;
    return this.frmUserDatos.controls.usrCelular.value.replace(re, '').trim();
  }

  inicializarFormulario(): void {
      this.frmUserDatos = this.formBuilder.group({
        usrDni: new FormControl('', [Validators.required]),
        usrNombres: new FormControl('', Validators.required),
        usrApellidos: new FormControl('', Validators.required),
        usrCelular: new FormControl('', Validators.required),
        usrCorreo: new FormControl('', [Validators.maxLength(100), Validators.email]),
        usrFechaNacimiento: new FormControl('', [this.mayorDeEdadValidator()]),
        usrClaveActual: new FormControl('', Validators.required),
        usrClaveNueva: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]),
        backgroundUrl: new FormControl('')
      });

      this.f.usrApellidos.disable();
      this.f.usrNombres.disable();
  }

  private mayorDeEdadValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Si no hay valor, no validar (usa required si es obligatorio)
      }

      const fechaNacimiento = new Date(control.value);
      const hoy = new Date();
      
      // Calcular la edad
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();
      
      // Ajustar si aún no ha cumplido años este año
      if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }

      if (edad < 18) {
        return { menorDeEdad: { edadActual: edad, edadMinima: 18 } };
      }

      return null; // Válido
    };
  }

  claveActualUsuario(){
    this.usuarioService.obtenerClaveUsuario(this.usuario.idUsuario).subscribe(clave => {
      this.f.usrClaveActual.setValue(clave.clave);
    });
  }

  setDatosPersonalizar(){
    this.colorSeleccionado = this.userSettingsService.colorFondoActual;
    this.colorTextoSeleccionado = this.userSettingsService.colorTextoActual;

    if(this.userSettingsService.fondoPantallaActual !== "assets/images/bg-images/bg_clinic.jpg"){
      this.f.backgroundUrl.setValue(this.userSettingsService.fondoPantallaActual);
      this.urlValida = true;
      this.probarUrl();
    }
  }

  updateSubmit(){
    if(this.actualizarDatos){
      this.userActualizar();
    } else{
      this.personalizarClinic();
    }
  }

  fechaMaxima!: string;

  private establecerFechaMaxima(): void {
    const hoy = new Date();
    const anoLimite = hoy.getFullYear() - 18;
    const fechaMaxima = new Date(anoLimite, hoy.getMonth(), hoy.getDate());
    this.fechaMaxima = fechaMaxima.toISOString().split('T')[0];    
  }

  personalizarClinic(){
    this.probarUrl();

    // Validación del formulario de personalización
    if(!this.urlValida && this.f.backgroundUrl.value) {
      // Marcar el campo de URL como inválido
      this.f.backgroundUrl.markAsTouched();
      this.f.backgroundUrl.setErrors({'urlInvalida': true});
      setTimeout(() => {
        this.utilsService.mostrarToast('Imagen de fondo no válida!', 'error');
      }, 0);
      return;
    }

    const model = {
      idUsuario: this.usuario.idUsuario,
      colorSidebarDeFondo: this.colorSeleccionado || '#3f4d67',
      colorSidebarDeTexto: this.colorTextoSeleccionado || '#A9B7D0',
      imagenFondo: this.f.backgroundUrl.value
    }

    this.userSettingsService.personalizarClinic(model).subscribe((resp : PersonalizarClinic) => {
      this.utilsService.mostrarToast('Datos actualizados correctamente', 'success');
      this.cerrarModal();
      
      // Recargar página y redirigir al home
      setTimeout(() => {
        window.location.href = '/' + paths.home.origin;
      }, 300);
    })
  }

  userActualizar(){
    // Limpiar errores anteriores
    this.frmUserDatos.markAsPristine();
    
    // Validación campo por campo
    if (!this.f.usrDni.value?.trim()) {
      return this.marcarCampoInvalido('usrDni', `Por favor, ingrese su ${this.esExtranjero ? 'documento' : 'DNI'}`);
    }
    
    if (!this.f.usrNombres.value?.trim()) {
      return this.marcarCampoInvalido('usrNombres', 'Por favor, ingrese sus nombres');
    }
    
    if (!this.f.usrApellidos.value?.trim()) {
      return this.marcarCampoInvalido('usrApellidos', 'Por favor, ingrese sus apellidos');
    }
    
    if (!this.f.usrCelular.value?.trim()) {
      return this.marcarCampoInvalido('usrCelular', 'Por favor, ingrese su número de celular');
    }
    
    if (!this.f.usrCorreo.value?.trim()) {
      return this.marcarCampoInvalido('usrCorreo', 'Por favor, ingrese su correo electrónico');
    } else if (this.f.usrCorreo.invalid) {
      return this.marcarCampoInvalido('usrCorreo', 'El formato del correo electrónico es incorrecto');
    }
    
    if (!this.f.usrFechaNacimiento.value) {
      return this.marcarCampoInvalido('usrFechaNacimiento', 'Por favor, ingrese su fecha de nacimiento');
    } else if (this.f.usrFechaNacimiento.invalid) {
      return this.marcarCampoInvalido('usrFechaNacimiento', 'Debe ser mayor de 18 años');
    }

    if (!this.f.usrClaveNueva.value?.trim()) {
      return this.marcarCampoInvalido('usrClaveNueva', 'Por favor, ingrese su nueva contraseña');
    }

    if (this.f.usrClaveNueva.invalid) {
      return this.marcarCampoInvalido('usrClaveNueva', 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales');
    }

    let celularUser = this.celular;
    if(celularUser.length > 0 && celularUser.length < 9){
        return this.marcarCampoInvalido('usrCelular', 'Número de celular incorrecto!!!');
    }
    
    const model = {
      idUsuario: this.usuario.idUsuario,
      dni: this.f.usrDni.value,
      nombres: this.f.usrNombres.value + " " + this.f.usrApellidos.value,
      celular: this.f.usrCelular.value,
      correo: this.f.usrCorreo.value,
      fechaNacimiento: this.f.usrFechaNacimiento.value,
      nuevaClave: this.f.usrClaveNueva.value,
      colorSidebarDeFondo: this.colorSeleccionado,
      colorSidebarDeTexto: this.colorTextoSeleccionado,
      imagenFondo: this.f.backgroundUrl.value
    }

    this.usuarioService.actualizarDatosUsuario(model).subscribe((resp: UsuarioActualizarDatos) => {
      if(resp){
        const userKeyStr = localStorage.getItem('usersKey');
        const _uStr = localStorage.getItem('_u');
        
        const userKey = userKeyStr ? JSON.parse(userKeyStr) : null;
        const _u = _uStr ? JSON.parse(_uStr) : null;

        if (userKey && _u) {
          userKey.datosActualizados = resp.datosActualizados;
          _u.datosActualizados = resp.datosActualizados;

          localStorage.setItem('_u', JSON.stringify(_u));
          localStorage.setItem('usersKey', JSON.stringify(userKey));

          this.usuarioService.actualizarUsuarioActual(_u);
        }

        this.utilsService.mostrarToast('Datos actualizados correctamente', 'success');
        this.cerrarModal();

        // Recargar página y redirigir al home
        setTimeout(() => {
          window.location.href = '/' + paths.home.origin;
        }, 300);
      }
    })
  }

  cerrarModal(): void {
      this.modal.close();
  }

  get f(): any {
      return this.frmUserDatos.controls;
  }

  // Método para marcar un campo como inválido y mostrar mensaje de error
  marcarCampoInvalido(nombreCampo: string, mensaje: string): null {
    const control = this.frmUserDatos.get(nombreCampo);
    if (control) {
      control.markAsTouched();
      control.setErrors({'custom': true});
      // Forzamos detección de cambios para que la UI se actualice inmediatamente
      setTimeout(() => {
        this.utilsService.mostrarToast(mensaje, 'info');
      }, 0);
    }
    return null;
  }

   mostrarClaveActual: boolean = false;
   mostrarClaveNueva: boolean = false;

  toggleMostrarClaveActual(): void {
    this.mostrarClaveActual = !this.mostrarClaveActual;
  }

  toggleMostrarClaveNueva(): void {
    this.mostrarClaveNueva = !this.mostrarClaveNueva;
  }

  getPasswordStrength(): string {
    const password = this.f.usrClaveNueva.value;
    if (!password) return '';
    
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        return 'strong';
    }
    return 'medium';
  }

  getPasswordStrengthTextClass(): string {
      const strength = this.getPasswordStrength();
      switch(strength) {
          case 'weak': return 'text-danger';
          case 'medium': return 'text-warning';
          case 'strong': return 'text-success';
          default: return 'text-muted';
      }
  }

  getPasswordStrengthText(): string {
      const strength = this.getPasswordStrength();
      switch(strength) {
          case 'weak': return 'Débil';
          case 'medium': return 'Media';
          case 'strong': return 'Fuerte';
          default: return '';
      }
  }

  buscarDNI(): void {
    if (this.f.usrDni.value != undefined && this.f.usrDni.value != "") {
        this.bnotfoundDNI = true;
        this.spinner.show();

        this.clienteService.obtenerDatosDNI(this.f.usrDni.value).subscribe(
            result => {
                if (result != null) {
                    this.bnotfoundDNI = true;
                    this.f.usrNombres.setValue(result.nombres);
                    this.f.usrApellidos.setValue(result.apellidoPaterno + ' ' + result.apellidoMaterno);
                    this.f.usrDni.setErrors(null); // Clear errors if data is valid
                } else {
                    this.f.usrNombres.setValue("");
                    this.f.usrApellidos.setValue("");
                    this.bnotfoundDNI = false;
                    this.f.usrDni.setErrors({ 'errors': true }); // Mark as invalid
                }
            },
            error => {
                this.bnotfoundDNI = false;
                console.error('Error al obtener DNI', error);
                this.f.usrDni.setErrors({ 'errors': true }); // Mark as invalid
            }
        );

        this.spinner.hide();
    }
  }

  agregarFoto(){

  }

  resetearEstilos(){
    this.userSettingsService.actualizarColorFondo("#3f4d67");
    this.userSettingsService.actualizarColorTexto("#A9B7D0");
    this.userSettingsService.actualizarFondoPantalla('assets/images/bg-images/bg_clinic.jpg');
    this.f.backgroundUrl.setValue("");
    this.colorSeleccionado = "#3f4d67";
    this.colorTextoSeleccionado = "#A9B7D0";
    this.urlValida = false;
    this.fondoPreview = null;
  }

  onColorChange(event: any): void {
    this.colorSeleccionado = event.target.value;
    this.userSettingsService.actualizarColorFondo(this.colorSeleccionado || '#3f4d67');
  }

  onColorTextoChange(event: any): void {
    this.colorTextoSeleccionado = event.target.value;
    this.userSettingsService.actualizarColorTexto(this.colorTextoSeleccionado || '#A9B7D0');
  }

    tipoFondo: 'url' | 'upload' = 'url';
    imagenSeleccionada: File | null = null;
    previewUrl: string | null = null;
    fondoPreview: string | null = null;
    isDragOver: boolean = false;
    isUploading: boolean = false;
    uploadProgress: number = 0;
    urlInvalida: boolean = false;
    urlValida: boolean = false;
    
    validarUrl(): void {
        const url = this.f.backgroundUrl?.value;
        if (url) {
            const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i;
            this.urlInvalida = !urlPattern.test(url);
            this.urlValida = !this.urlInvalida;
        }
    }
    
    probarUrl(): void {
      
        const url = this.f.backgroundUrl?.value;
        if (url && this.urlValida) {
            this.fondoPreview = url;

            this.userSettingsService.actualizarFondoPantalla(url);
        }
    }
    
    eliminarImagen(event: Event): void {
        event.stopPropagation();
        this.imagenSeleccionada = null;
        this.previewUrl = null;
        this.fondoPreview = null;
    }

    onExtranjeroChange(event: any): void {
      this.esExtranjero = event.target.checked;

      if (this.esExtranjero) {
        this.documento = 'Documento';
        this.esDni = false;
        this.bnotfoundDNI = true;
        this.f.usrDni.setValue('');
        this.f.usrNombres.setValue('');
        this.f.usrApellidos.setValue('');
        this.f.usrApellidos.enable();
        this.f.usrNombres.enable();
      } else {
        this.documento = 'DNI';
        this.esDni = true;
        this.bnotfoundDNI = false;
        this.f.usrDni.setValue('');
        this.f.usrNombres.setValue('');
        this.f.usrApellidos.setValue('');
        this.f.usrApellidos.disable();
        this.f.usrNombres.disable();
      }
    }
}
