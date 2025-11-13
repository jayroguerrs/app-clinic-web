import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HistoriaClinicaService } from '../../../shared/services/historia-clinica.service';

@Component({
  selector: 'app-historia-clinica-datos',
  templateUrl: './historia-clinica-datos.component.html',
  styleUrls: ['./historia-clinica-datos.component.scss']
})
export class HistoriaClinicaDatosComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() idCliente: number;
  accion: string;
  frmHistoriaClinica: FormGroup;
  zonasTratamiento: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private historiaClinicaService: HistoriaClinicaService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.frmHistoriaClinica = this.formBuilder.group({
      fechaHistoria: [new Date()],
      zonaTratamiento: [0],
      fluencia: [''],
      kjcm: [''],
      idCita: [0],
      sesion: ['']
    });
  }
  get historiaClinica() : any {
    const historiaClinicaDetalle = {
      idHistoriaClinica : '',
      idCita: parseInt(this.frmHistoriaClinica.controls.idCita.value, 10),
      idZonaTratamiento: parseInt(this.frmHistoriaClinica.controls.zonaTratamiento.value, 10),
      Fluencia: this.frmHistoriaClinica.controls.fluencia.value,
      ValorKJ: this.frmHistoriaClinica.controls.kjcm.value,
      NumSesion: this.frmHistoriaClinica.controls.sesion.value,
      Comentario: ''
    }

    return historiaClinicaDetalle;
  }
  historiaClinicaGrabar(): void {

  }
  cerrarModal(): void {
    this.modal.close();
  }

}
