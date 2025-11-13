import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GeneroService} from "../../../shared/services/genero.service";
import {Genero} from "../../../corporal360/shared/model/genero";
import {Subscription} from "rxjs";
import {Cliente, ClienteAcceso} from "../../../shared/models/cliente";
import {ClienteService} from "../../../shared/services/cliente.service";

import Swal from 'sweetalert2';
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {DocumentoIdentidadTipoService} from "../../../shared/services/documento-identidad-tipo.service";
import {DocumentoTipoIdentidad} from "../../../shared/models/documento-tipo-identidad";
import {MedioContactoService} from "../../../shared/services/medio-contacto.service";
import {MedioContacto} from "../../preferente/preferente.models";
import {AuthService} from "../../../shared/services/auth.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MdlUbicacionComponent} from "../../modals/mdl-ubicacion/mdl-ubicacion.component";
import {ClienteAccesoService} from "../../../shared/services/cliente-acceso.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {CustomValidators} from "../../../shared/validator/CustomValidators";

@Component({
  selector: 'app-cliente-perfil-ajustes',
  templateUrl: './cliente-perfil-ajustes.component.html',
  styleUrls: ['./cliente-perfil-ajustes.component.scss']
})
export class ClientePerfilAjustesComponent implements OnInit, OnDestroy {

  @Input() idCliente: number;

  frmAjustes: FormGroup;
  submittedAjustes = false;
  sbcAjustes: Subscription;

  bnotfoundDNI=false;
  bnotfoundRUC=false;
  generos: Genero[] = [];
  sbcGeneros: Subscription;

  tiposDocumentoIdentidad: DocumentoTipoIdentidad[] = [];
  sbcTipoDocumentoIdentidad: Subscription;

  mediosDeContacto: MedioContacto[] = [];
  sbcMediosContacto: Subscription;

  cliente: Cliente;
  loadingCliente = false;

  paises: any = [
    {id: 51, pais: 'Perú'},
    {id: 54, pais: 'Argentina'},
    {id: 591, pais: 'Bolivia'},
    {id: 55, pais: 'Brasil'},
    {id: 56, pais: 'Chile'},
    {id: 57, pais: 'Colombia'},
    {id: 506, pais: 'Costa Rica'},
    {id: 53, pais: 'Cuba'},
    {id: 593, pais: 'Ecuador'},
    {id: 34, pais: 'España'},
    {id: 52, pais: 'Maxico'},
    {id: 595, pais: 'Paraguay'},
    {id: 598, pais: 'Uruguay'},
    {id: 58, pais: 'Venezuela'},
    {id: 1, pais: 'EEUU'},
    {id: 49, pais: 'Alemania'},
    {id: 123, pais: 'Otro País'}
  ];

  // Metodo de inicio de sesión
  clienteAcceso: ClienteAcceso = new ClienteAcceso();
  frmGroupUpdateEmail: FormGroup;
  frmGroupUpdatePassword: FormGroup;
  sbcChangeEmail: Subscription;
  sbcChangePassword: Subscription;
  changeEmail = false;
  changePassword = false;
  submittedChangeEmail = false;
  submittedChangePassword = false;
  showPassword = false;
  sbcGetCredentials: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private generoService: GeneroService,
    private clienteService: ClienteService,
    private utilService: UtilsService,
    private datePipe: DatePipe,
    private documentoIdentidadTipoService: DocumentoIdentidadTipoService,
    private medioContactoService: MedioContactoService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private clienteAccesoService: ClienteAccesoService
  ) {
    this.frmAjustes = this.formBuilder.group({
      nombres: new FormControl({
        value: null,
        disabled: true
      }, Validators.required),
      apellidos: new FormControl(null, Validators.required),
      idGenero: new FormControl('', Validators.required),
      seudonimo: new FormControl(''),
      correo: new FormControl(null, [Validators.maxLength(100), Validators.email]),
      paisTelefono1: new FormControl(51),
      telefono1: new FormControl(null, Validators.required),
      paisTelefono2: new FormControl(51),
      telefono2: new FormControl(''),
      fechaNacimiento: new FormControl(null),
      edad: new FormControl(null),
      idTipoDocumentoIdentidad: new FormControl(''),
      documentoIdentidad: new FormControl({ value: '', disabled: true}, Validators.maxLength(20)),
      idMedioContacto: new FormControl(0),
      otroMedioContacto: new FormControl(null),
      idUbicacion: new FormControl(null),
      direccion: new FormControl(''),
      direccionCompleta: new FormControl(''),
      ruc: new FormControl('',[Validators.maxLength(11),Validators.minLength(11)]),
      razonSocial: new FormControl(''),
    });
    this.frmGroupUpdateEmail = this.formBuilder.group({
      correo: new FormControl('', [Validators.required, Validators.email])
    });
    this.frmGroupUpdatePassword = this.formBuilder.group({
      clave: new FormControl(null, Validators.required),
      claveRepetir: new FormControl(null, Validators.required)
    },{validators: CustomValidators.mustMatch('clave', 'claveRepetir')});
  }

  ngOnInit(): void {

    this.generoCollection();
    this.tipoDocumentoCollection();
    this.medioContactoCollection();
    this.obtenerDatos();
    this.obtenerCredenciales();

    this.frmAjustes.get('idTipoDocumentoIdentidad').valueChanges.subscribe((res) => {
      if(res){
        this.fAjuste.documentoIdentidad.enable();
        this.fAjuste.documentoIdentidad.setValidators(Validators.required);
      }else{
        this.fAjuste.documentoIdentidad.disable();
        this.fAjuste.documentoIdentidad.clearValidators();
      }
    });
    this.frmAjustes.get('idMedioContacto').valueChanges.subscribe((res) => {
      // console.log(res);
      if(res === '5'){
        this.fAjuste.otroMedioContacto.enable();
        this.fAjuste.otroMedioContacto.setValidators(Validators.required);
      }else{
        this.fAjuste.otroMedioContacto.disable();
        this.fAjuste.otroMedioContacto.clearValidators();
      }
    });
    this.frmAjustes.get('fechaNacimiento').valueChanges.subscribe((res) => {
      if(res){
        const [year,month,day] = res.split('-').map(x => parseInt(x));
        this.fAjuste.edad.patchValue( this.utilService.calculaEdad(new Date(`${month}/${day}/${year}`)) + ' años' );
      }else{
        this.fAjuste.edad.patchValue('0 años');
      }
    });
  }

  ngOnDestroy(): void {
    this.sbcGeneros?.unsubscribe();
    this.sbcTipoDocumentoIdentidad?.unsubscribe();
    this.sbcMediosContacto?.unsubscribe();
    this.sbcChangeEmail?.unsubscribe();
    this.sbcChangePassword?.unsubscribe();
  }

  // data
  generoCollection(): void{
    this.sbcGeneros = this.generoService.obtenerTodos().subscribe((res) => {
      this.generos = res.map((x: any) => {
        const gen = new Genero();
        gen.id = x.id;
        gen.nombre = x.descripcion;
        gen.activo = !!x.activo;
        return gen;
      })
    }, error => {
      console.log(error);
    });
  }

  tipoDocumentoCollection(): void{
    this.sbcTipoDocumentoIdentidad = this.documentoIdentidadTipoService.obtener().subscribe((res: any) => {
      this.tiposDocumentoIdentidad = res.map(x => {
        const tipo = new DocumentoTipoIdentidad();
        tipo.id = x.id;
        tipo.descripcion = x.descripcion;
        return tipo;
      });
    }, error => {
      console.log(error);
    });
  }

  medioContactoCollection(): void{
    this.sbcMediosContacto = this.medioContactoService.obtenerMedioContacto().subscribe((res: MedioContacto[]) => {
      this.mediosDeContacto = res;
    }, error => {
      console.log(error);
    })
  }

  obtenerDatos(): void{
    this.loadingCliente = true;
    this.clienteService.findById(this.idCliente).subscribe((res: Cliente) => {
      this.cliente = res;
      this.patchFrmAjustes();
      this.loadingCliente = false;
    }, error => {
      this.loadingCliente = false;
      console.log(error);
    });
  }

  obtenerCredenciales(): void{
    this.sbcGetCredentials = this.clienteAccesoService.getCredentials(this.idCliente).subscribe((res: ClienteAcceso | ErrorSistema) => {
      if(res instanceof  ClienteAcceso){
        this.clienteAcceso = res;
        if(this.clienteAcceso.registrado){
          this.fUpdateStatus.correo.patchValue(this.clienteAcceso.correo);
        }
      }else{
        console.log(res.message);
      }
    }, error => {
      console.log(error);
    });
  }

  patchFrmAjustes(): void{
    const cliente = this.cliente;
    this.frmAjustes.patchValue({
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      correo: cliente.correo,
      idGenero: cliente.idGenero,
      seudonimo: cliente.seudonimo,
      telefono1: cliente.telefono1,
      telefono2: cliente.telefono2,
      fechaNacimiento: cliente.fechaNacimiento ? this.datePipe.transform(cliente.fechaNacimiento,'yyyy-MM-dd') : null,
      documentoIdentidad: cliente.documento,
      idTipoDocumentoIdentidad: cliente.idTipoDocumentoIdentidad ? cliente.idTipoDocumentoIdentidad : '',
      idMedioContacto: cliente.idMedioContacto ? cliente.idMedioContacto : 0,
      paisTelefono1: cliente.paisCelular1,
      paisTelefono2: cliente.paisCelular2 ? cliente.paisCelular2 : 51,
      direccionCompleta: cliente.departamento + ' - ' + cliente.direccion + ', ' + cliente.provincia + '-' + cliente.distrito,
      direccion: cliente.direccion,
      idUbicacion: cliente.idUbicacion,
      ruc:cliente.ruc,
      razonSocial:cliente.razonSocial

    });
  }


  // submits
  onSubmitAjustes(): void{

    Swal.fire({
      html: `Desea editar los datos del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b>??`,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
      buttonsStyling: false,
      reverseButtons: true,
      customClass: {
        confirmButton: "popins sbtn btn btn-primary w-100px",
        cancelButton: "popins sbtn btn btn-light w-100px mr-2",
      }
    }).then(result => {
      if(result.isConfirmed) {

        this.submittedAjustes = true;
        if(!this.validarFrmAjustes()) { return; }

        this.spinner.show();
        this.sbcAjustes = this.clienteService.actualizar(this.modelAjustes).subscribe(
          resultado => {
            if(resultado.exito){
              this.spinner.hide();
              Swal.fire({
                html: `Se modifico los datos los datos del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b> con exito!!!`,
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Aceptar",
                customClass: {
                  confirmButton: "popins sbtn btn btn-primary w-100px"
                }
              });
              this.reload();
            } else {
              this.spinner.hide();
              this.utilService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
            }
          },
          error => {
            console.log('Error al actualizar al cliente', error);
            this.spinner.hide();
          }
        );
      }
    });
  }

  onSubmitUpdateEmail(): void{
    Swal.fire({
      html: `Desea editar el correo de acceso del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b>??`,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
      buttonsStyling: false,
      reverseButtons: true,
      customClass: {
        confirmButton: "popins sbtn btn btn-primary w-100px",
        cancelButton: "popins sbtn btn btn-light w-100px mr-2",
      }
    }).then(result => {
      if(result.isConfirmed) {
          this.submittedChangeEmail = true;
          if(this.frmGroupUpdateEmail.invalid){
            this.utilService.mostrarToast('Ingresar el correo eléctronico de acceso!!', 'info');
            return;
          }
          this.spinner.show();
          this.sbcChangeEmail = this.clienteAccesoService.changeEmail(this.modelChangeStatus).subscribe((res: boolean | ErrorSistema) => {
            this.spinner.hide();
            if( res instanceof  ErrorSistema){
              Swal.fire({
                title: 'Error',
                html: res.message,
                icon: 'error',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Ok',
                buttonsStyling: false,
                reverseButtons: true,
                customClass: {
                  confirmButton: "popins sbtn btn btn-primary w-100px",
                }
              });
            }else{
              Swal.fire({
                html: `Se modifico con exito el correo de acceso del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b>!!!`,
                icon: 'success',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Ok',
                buttonsStyling: false,
                reverseButtons: true,
                customClass: {
                  confirmButton: "popins sbtn btn btn-primary w-100px",
                }
              });
              this.obtenerCredenciales();
              this.toggleChangeEmail();
            }
          }, error => {
            this.spinner.hide();
            console.log(error);
            Swal.fire({
              html: `Ocurrio un error al intentar modificar el correo de acceso del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b>!!!`,
              icon: 'error',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              buttonsStyling: false,
              reverseButtons: true,
              customClass: {
                confirmButton: "popins sbtn btn btn-primary w-100px",
              }
            });
          });
      }
    });
  }

  onSubmitUpdatePassword(): void{
    Swal.fire({
      html: `Desea editar la contraseña del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b>??`,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
      buttonsStyling: false,
      reverseButtons: true,
      customClass: {
        confirmButton: "popins sbtn btn btn-primary w-100px",
        cancelButton: "popins sbtn btn btn-light w-100px mr-2",
      }
    }).then(result => {
      if(result.isConfirmed) {
        this.submittedChangePassword = true;
        console.log(this.frmGroupUpdatePassword);
        if(this.frmGroupUpdatePassword.invalid){
          this.utilService.mostrarToast('Ingresar la nueva contraseña!!', 'info');
          return;
        }
        this.spinner.show();
        this.sbcChangePassword = this.clienteAccesoService.changePassword(this.modelChangePassword).subscribe((res: boolean | ErrorSistema) => {
          this.spinner.hide();
          if( res instanceof  ErrorSistema){
            Swal.fire({
              title: 'Error',
              html: res.message,
              icon: 'error',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              buttonsStyling: false,
              reverseButtons: true,
              customClass: {
                confirmButton: "popins sbtn btn btn-primary w-100px",
              }
            });
          }else{
            Swal.fire({
              html: `Se modifico con exito la contraseña del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b>!!!`,
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonText: 'Ok',
              buttonsStyling: false,
              reverseButtons: true,
              customClass: {
                confirmButton: "popins sbtn btn btn-primary w-100px",
              }
            });
            this.obtenerCredenciales();
            this.toggleChangePassword();
          }
        }, error => {
          this.spinner.hide();
          console.log(error);
          Swal.fire({
            html: `Ocurrio un error al intentar modificar la contraseña de acceso del cliente <b>${this.cliente.nombres} ${this.cliente.apellidos}</b>!!!`,
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
            buttonsStyling: false,
            reverseButtons: true,
            customClass: {
              confirmButton: "popins sbtn btn btn-primary w-100px",
            }
          });
        });
      }
    });
  }

  // validations
  validarFrmAjustes(): boolean{
    if( this.frmAjustes.invalid){
      this.utilService.mostrarToast('Datos incompletos!!!', 'info');
      return false;
    }
    if( this.fAjuste.telefono1.value.trim().length != 9){
      this.utilService.mostrarToast('Número de celular principal incorrecto!!!', 'error');
      return false;
    }
    if(this.fAjuste.telefono2.value.length > 0 && this.fAjuste.telefono2.value.length < 9){
      this.utilService.mostrarToast('Número de celular secundario incorrecto!!!', 'error');
      return  false;
    }

    let ruc= this.fAjuste.ruc.value;
        let razonSocial= this.fAjuste.razonSocial.value;
        if (razonSocial!=undefined && razonSocial!="" ){
          if (ruc?.length!=11 && ruc?.length>0){
              this.utilService.mostrarToast('Ingrese el número de Ruc asociado a la razón social', 'error');
              return null;
          }
      }


    return true;
  }

  // getters
  get fAjuste(): any{
    return this.frmAjustes.controls;
  }
  get fUpdateStatus(): any{
    return this.frmGroupUpdateEmail.controls;
  }
  get fUpdatePassword(): any{
    return this.frmGroupUpdatePassword.controls;
  }

  get modelAjustes(): any{
    return {
      id: this.idCliente,
      nombres: this.fAjuste.nombres.value.trim().replace('\t','').replace('\r','').replace('\n',''),
      apellidos: this.fAjuste.apellidos.value.trim().replace('\t','').replace('\r','').replace('\n',''),
      seudonimo: this.fAjuste.seudonimo.value.trim().replace('\t','').replace('\r','').replace('\n',''),
      idGenero: parseInt(this.fAjuste.idGenero.value, 10),
      celular1: this.fAjuste.telefono1.value.trim().replace(' ','').replace('\t','').replace('\r','').replace('\n',''),
      paisCelular1: parseInt(this.fAjuste.paisTelefono1.value, 10),
      celular2: this.fAjuste.telefono2.value ? this.fAjuste.telefono2.value.trim().replace(' ','').replace('\t','').replace('\r','').replace('\n','') : '',
      paisCelular2: parseInt(this.fAjuste.paisTelefono2.value, 10),
      correo: this.fAjuste.correo.value ? this.fAjuste.correo.value.trim().replace('\t','').replace('\r','').replace('\n','').replace(' ','') : '',
      idMedioContacto: parseInt(this.fAjuste.idMedioContacto.value, 10),
      otroMedioContacto: this.fAjuste.otroMedioContacto.value ? this.fAjuste.otroMedioContacto.value.trim() : '',
      publicidad: '',
      fechaNacimiento: this.fAjuste.fechaNacimiento.value ? this.fAjuste.fechaNacimiento.value :null,
      usuarioRegistra: this.authService.getUser().name,
      usuarioEdita: this.authService.getUser().name,
      serieFirma: '0',
      serieHuella: '0',
      documento: this.fAjuste.documentoIdentidad.value ? this.fAjuste.documentoIdentidad.value.trim().replace('\t','').replace('\r','').replace('\n','').replace(' ','') : '',
      idDocumentoIdentidadTipo: parseInt(this.fAjuste.idTipoDocumentoIdentidad.value, 10),
      idEstado: 1,
      idUbicacion: this.fAjuste.idUbicacion.value,
      direccion: this.fAjuste.direccion.value,
      foto: '',
      idHistoriaClinica: '',
      ruc: (this.fAjuste.razonSocial.value==undefined || this.fAjuste.razonSocial.value=="" ||  this.fAjuste.ruc.value=="")?null:   this.fAjuste.ruc.value,
      razonSocial:  (this.fAjuste.ruc.value==undefined || this.fAjuste.ruc.value=="" )?null : this.fAjuste.razonSocial.value
    }
  }

  get modelChangeStatus(): any{
    return {
      idCliente: this.cliente.id,
      correo: this.fUpdateStatus.correo.value
    }
  }

  get modelChangePassword(): any{
    return {
      idCliente: this.cliente.id,
      clave: this.fUpdatePassword.clave.value
    }
  }
  // functions
  restoreFrmAjustes(): void{
    this.patchFrmAjustes();
    this.submittedAjustes = false;
  }

  onShowAddress(): void{
    const modalRef = this.modalService.open(MdlUbicacionComponent,{size: 'md'});
    modalRef.componentInstance.data = {
      idUbicacion: this.fAjuste.idUbicacion.value,
      direccion: this.fAjuste.direccion.value,
    };
    modalRef.componentInstance.ubigeo.subscribe((res: any) => {
      this.fAjuste.direccion.patchValue(res.direccion);
      this.fAjuste.idUbicacion.patchValue(res.idUbicacion);
      this.fAjuste.direccionCompleta.patchValue(`${ res.idUbicacion ? res.departamento + ' - ' : ''}${res.direccion}${ res.idUbicacion ? ', ' + res.ciudad + '-' +res.distrito : ''}`);
    });
  }
  reload(): void{
    this.generoCollection();
    this.tipoDocumentoCollection();
    this.medioContactoCollection();
    this.obtenerDatos();
  }

  toggleChangeEmail(): void{
    this.changeEmail = !this.changeEmail;
  }
  toggleShowPassword(): void{
    this.showPassword = !this.showPassword;
  }
  toggleChangePassword(): void{
    this.showPassword = false;
    this.submittedChangePassword = false;
    this.changePassword = !this.changePassword;
    this.frmGroupUpdatePassword.reset();
  }

  buscarRuc(): void {
    // var model=this.f;
    if (this.fAjuste.ruc.value != undefined && this.fAjuste.ruc.value != "") {
      this.bnotfoundRUC = false;
      this.spinner.show();
      this.clienteService.obtenerRuc(this.fAjuste.ruc.value).subscribe(result => {
        if (result != null) {
          this.fAjuste.razonSocial.setValue(result.razonSocial);
          this.fAjuste.ruc.setValue(result.ruc);

        } else {
          this.bnotfoundRUC = true;
          this.fAjuste.razonSocial.setValue("");
        }

      }, error => {
        console.log('Error al obtener ruc', error);


      });
      this.spinner.hide();
    }
  }

  buscarDNI(): void {
    // var model=this.f;
    if (this.fAjuste.documentoIdentidad.value != undefined && this.fAjuste.documentoIdentidad.value != "" && this.fAjuste.idTipoDocumentoIdentidad.value==1) {

        this.spinner.show();
        this.bnotfoundDNI = false;
        this.clienteService.obtenerDatosDNI(this.fAjuste.documentoIdentidad.value).subscribe(result => {
            if (result != null) {
                this.bnotfoundDNI = false;
                this.fAjuste.nombres.setValue(result.nombres);
                this.fAjuste.apellidos.setValue(result.apellidoPaterno + ' '+ result.apellidoMaterno);

            } else {
                this.fAjuste.nombres.setValue("");
                this.fAjuste.apellidos.setValue("");
                this.bnotfoundDNI = true;
            }

        }, error => {
            console.log('Error al obtener DNI', error);


        });
        this.spinner.hide();
    }
}



}
