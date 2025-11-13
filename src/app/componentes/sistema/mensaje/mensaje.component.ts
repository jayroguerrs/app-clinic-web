import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalConstants } from 'src/commons/global-constants';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss']
})
export class MensajeComponent implements OnInit {

  rutaImageSpinner = GlobalConstants.gIconoSpinner;
  frmFiltroGrilla: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      txtMensaje: ['¡CLINIC 2.0 se actualizará en 5 minutos!']
    });
  }
  enviarMensajeGeneral(): void {
    GlobalConstants.gSignalService.enviarMensajeGeneral(this.frmFiltroGrilla.controls.txtMensaje.value).subscribe(
      resultado =>
      {
        //console.log(resultado);
      }
    );
  }
}
