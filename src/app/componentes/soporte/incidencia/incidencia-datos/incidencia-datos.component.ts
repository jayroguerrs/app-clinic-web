import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IncidenciaService } from 'src/app/shared/services/incidencia.service';

@Component({
  selector: 'app-incidencia-datos',
  templateUrl: './incidencia-datos.component.html',
  styleUrls: ['./incidencia-datos.component.scss']
})
export class IncidenciaDatosComponent implements OnInit {
  @Input() idIncidencia: number = 0;
  @Input() modal: NgbModalRef;
  submitted = false;
  frmIncidencia: FormGroup;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  accion = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private incidenciaService: IncidenciaService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    if(this.idIncidencia > 0) {
      this.incidenciaBuscar()
    }
  }
  inicializarFormulario(): void {
    this.frmIncidencia = this.formBuilder.group({
      idModulo: [0]
    });
  }
  get f(): any { 
    return this.frmIncidencia.controls; 
  }
  incidenciaGrabar(): void {

  }
  incidenciaActualizar(): void {

  }
  incidenciaBuscar(): void {

  }
  cerrarModal(): void {
    this.modal.close();
  }
}
