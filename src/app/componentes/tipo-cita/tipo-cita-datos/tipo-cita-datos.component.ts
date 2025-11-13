import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { TipoCitaService } from '../../../shared/services/tipo-cita.services';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import Swal from 'sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tipo-cita-datos',
  templateUrl: './tipo-cita-datos.component.html',
  styleUrls: ['./tipo-cita-datos.component.scss']
})
export class TipoCitaDatosComponent implements OnInit {

  @Input() idTipoCita: number;
  @Input() modal: NgbModalRef;
  @Output() eventCitaTipoListar: EventEmitter<boolean> = new EventEmitter<boolean>();
  frmTipoCitaDatos : FormGroup;
  usuarioActual: Usuario;
  accion = '';
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private tipoCitaService: TipoCitaService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;

    if(this.idTipoCita > 0 ) {
      this.accion = 'Editar';
      this.inicializarFormulario();
      this.tipoCitaBuscar();
    } else {
      this.inicializarFormulario();
      this.accion = 'Nuevo';
    }
  }

  get f(): any{
    return this.frmTipoCitaDatos.controls;
  }

  inicializarFormulario(): void {
    this.frmTipoCitaDatos = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      idEstado: [1]
    });
  }
  tipoCitaGrabar(): void {
    this.submitted = true;

    if(this.frmTipoCitaDatos.invalid){
      this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
      return;
    }

    if(this.idTipoCita > 0 ) {
      //EDITAR
      this.tipoCitaService.actualizar(this.tipoCita).subscribe(
        resultado => {
          Swal.fire(resultado.mensaje).then(result => this.eventCitaTipoListar.emit(true));
        });
    } else {
      //NUEVO
      this.tipoCitaService.guardar(this.tipoCita).subscribe(
        resultado => {
          Swal.fire(resultado.mensaje).then(result => this.eventCitaTipoListar.emit(true));
      })
    }
    this.cerrarModal();
  }
  cerrarModal(): void{
    this.modal.close();
  }

  get tipoCita(): any{
    const model = {
      idTipoCita : this.idTipoCita,
      nombre: this.frmTipoCitaDatos.controls.nombre.value,
      idEstado: parseInt(this.frmTipoCitaDatos.controls.idEstado.value, 10),
      usuarioEdita: this.usuarioActual.nombre,
      usuarioRegistra: this.usuarioActual.nombre,
    }
    return model;
  }

  tipoCitaBuscar(){
    this.spinner.show();
    this.tipoCitaService.obtenerById(this.idTipoCita).subscribe(
      resultado =>  {
        this.frmTipoCitaDatos.patchValue({
          nombre: resultado.nombre,
          idEstado: resultado.idEstado
        });
        this.spinner.hide();
      },
      error => {
        console.log('Error al buscar el tipo de cita!', error);
        this.spinner.hide();
      }
    );
  }
}
