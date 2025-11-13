import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UbicacionService } from '../../../shared/services/ubicacion.service';
import { SedeService } from '../../../shared/services/sede.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { sede } from '../../../shared/models/sede';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sede-datos',
  templateUrl: './sede-datos.component.html',
  styleUrls: ['./sede-datos.component.scss']
})
export class SedeDatosComponent implements OnInit {

  @Output() eventoSedeListar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() idSede: number;
  @Input() modal: NgbModalRef;
  frmSedeDatos: FormGroup;
  usuarioActual: Usuario;
  departamento: any[] = [];
  distrito: any[] = [];
  ciudad: any[] = [];
  accion = '';
  _sede: sede;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  submitted = false;

  constructor(
    private usuarioService: UsuarioService,
    private ubicacionService: UbicacionService,
    private sedeService: SedeService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._sede = new sede(0, '', 0, '', '', '', '', '', '', '', '', '','','');

    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.obtenerDepartamento();
    if(this.idSede > 0 )
    {
      this.accion = 'Editar';
      this.inicializarFormulario();
      this.sedeBuscar();
    } else {
      this.inicializarFormulario();
      this.accion = 'Nuevo';
    }
  }

  inicializarFormulario(): void{
    this.frmSedeDatos = this.formBuilder.group({
      sede: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      estado: [1, Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.frmSedeDatos.controls; }



  cerrarModal(): void {
    this.modal.close();
  }
  get sede(): any{
    const modal = {
      idSede: this.idSede,
      nombre: this.frmSedeDatos.controls.sede.value,
      estado: parseInt(this.frmSedeDatos.controls.estado.value, 10),
      direccion: this.frmSedeDatos.controls.direccion.value,
      idUbicacion: this.frmSedeDatos.controls.distrito.value,
      horaInicio: this.frmSedeDatos.controls.horaInicio.value,
      horaFin:this.frmSedeDatos.controls.horaFin.value,
      usuarioRegistra: this.usuarioActual.nombre,
      usuarioEdita: this.usuarioActual.nombre
    };
    return modal;
  }

  obtenerDepartamento() {
    this.ubicacionService.obtenerDepartamento().subscribe(resultado => this.departamento = resultado );
  }
  obtenerCiudad() {
    this.ubicacionService.obtenerCiudadByToDepartamento(this._sede.iddepartamento).subscribe(resultado => this.ciudad = resultado);
  }
  obtenerDistrito() {
    this.ubicacionService.obtenerDistritoByToCiudadByToDepartamento(this._sede.idciudad, this._sede.iddepartamento).subscribe(resp => this.distrito = resp);
  }
  onchangeDepart(departamento){
    this._sede.iddepartamento = departamento.value;
    this.distrito = [];
    this.obtenerCiudad();
  }
  onchangeProv(provincia){
    this._sede.idciudad = provincia.value;
    this.distrito = [];
    this.obtenerDistrito();
  }
  sedeBuscar() {
    this.spinner.show();
    this.sedeService.obtenerById(this.idSede).subscribe(
      datos => {

        var strubicacion = datos.idUbicacion.toString();
        const iddepartamento = strubicacion.substring(0, 2);
        const idciudad = strubicacion.substring(2, 4);
        this._sede.idsede = datos.idSede;
        this._sede.nombre=  datos.nombre;
        this._sede.estado = datos.estado;
        this._sede.idubicacion = strubicacion;
        this._sede.iddepartamento = iddepartamento;
        this._sede.idciudad = idciudad;
        this._sede.direccion = datos.direccion;
        this._sede.horaInicio = datos.horaInicio;
        this._sede.horaFin=datos.horaFin

        this.frmSedeDatos.patchValue({
          sede: datos.nombre,
          departamento: this._sede.iddepartamento,
          provincia: this._sede.idciudad,
          distrito: this._sede.idubicacion,
          direccion: datos.direccion,
          estado: datos.estado,
          horaInicio : datos.horaInicio,
          horaFin : datos.horaFin
        });

        this.obtenerCiudad();
        this.obtenerDistrito();
        this.spinner.hide();
      },
      error => {
        console.log('Error al botener la sede ' + error);
        this.spinner.hide();
      }
    );
  }
  sedeGrabar(){
    this.submitted = true;
    this.spinner.show();
    if(this.frmSedeDatos.invalid){
      this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
      this.spinner.hide();
      return;
    }

    if(this.idSede > 0 ){
      // EDITAR
      this.sedeService.actualizar(this.sede).subscribe(
        resultado => {
          if(resultado.exito){
            Swal.fire(resultado.mensaje).then(result => this.eventoSedeListar.emit(true));
            this.spinner.hide();
            this.cerrarModal();
          } else {
            this.utilsService.mostrarToast(resultado.mensaje + ':' + resultado.errorDetalle, 'error');
            this.spinner.hide();
          }
        },
        error => {
          console.log('Error al actualizar la sede', error);
          this.spinner.hide();
        });
    } else {
      // NUEVO
      this.sedeService.guardar(this.sede).subscribe(
        resultado => {
          if(resultado.exito) {
            Swal.fire(resultado.mensaje).then(result => this.eventoSedeListar.emit(true));
            this.spinner.hide();
            this.cerrarModal();
          } else {
            this.utilsService.mostrarToast(resultado.mensaje + ':' + resultado.errorDetalle, 'error');
            this.spinner.hide();
          }
        },
        error => {
          console.log('Error al registrar la sede', error);
          this.spinner.hide();
        }
      );
    }
  }
}
