import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CitaSeguimientoService } from '../../../shared/services/cita-seguimiento.service';

@Component({
  selector: 'app-cita-historial',
  templateUrl: './cita-historial.component.html',
  styleUrls: ['./cita-historial.component.scss']
})
export class CitaHistorialComponent implements OnInit {
  frmCitaHistorial: FormGroup;
  listaHistorialSeguimiento = [];
  @Input() idCita: number;
  @Input() modal: NgbModalRef;

  constructor(
    private citaSeguimientoService: CitaSeguimientoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.obtenerCitaSeguimiento();
    this.inicializarFormulario();
  }
  inicializarFormulario(): void {
    this.frmCitaHistorial = this.formBuilder.group({

    });
  }
  obtenerCitaSeguimiento(){
    this.citaSeguimientoService.obtenerCitaSeguimiento(this.idCita).subscribe( 
      (resultado) => this.listaHistorialSeguimiento = resultado,
      error => console.log("POST call in error", error),
      );
  }

  cerrarModal(): void { this.modal.close(); }
}