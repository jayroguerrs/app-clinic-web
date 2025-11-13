import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteService } from '../../../shared/services/reporte.service';
import { DatePipe } from '@angular/common';
import { SedeService } from 'src/app/shared/services/sede.service';

@Component({
  selector: 'app-evolucion-cita-mensual',
  templateUrl: './evolucion-cita-mensual.component.html',
  styleUrls: ['./evolucion-cita-mensual.component.scss'],
  providers: [DatePipe]
})
export class EvolucionCitaMensualComponent implements OnInit {

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  frmFiltroGrilla: FormGroup;
  datos: any = [];
  maestroSede = [];

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private reporteService: ReporteService,
    private datePipe: DatePipe,
    private sedeService: SedeService,
  ) { }

  ngOnInit(): void {
    this.obtenerSedes();
    this.inicializarFormulario();
    this.consultar();
  }
  obtenerSedes(): void {
    this.sedeService.obtener().subscribe(
      resultado => this.maestroSede = resultado,
      error => console.log("Error al obtener las sedes: ", error)
    );
  }
  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filtroFecha: [new Date()],
      filtroSede: [0]
    });

    this.frmFiltroGrilla.patchValue({
      filtroFecha:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
  }
  consultar(): void {
    this.spinner.show();
    const fecha = this.frmFiltroGrilla.controls.filtroFecha.value;
    const idSede = parseInt(this.frmFiltroGrilla.controls.filtroSede.value, 10);
    this.reporteService.obtenerRptEvolucionCita(fecha, idSede).subscribe(
      data => { 
        this.datos = data;
        this.spinner.hide();
      }, 
      error => {
        console.log('Error al consultar', error);
        this.spinner.hide();
      }
    );
  }
  consultarPorSede(): void {
    this.consultar();
  }

}
