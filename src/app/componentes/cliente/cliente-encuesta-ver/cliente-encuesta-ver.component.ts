import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormularioEncuestaOpcion, FormularioEncuestaPregunta} from "../../../shared/models/formulario-encuesta";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-cliente-encuesta-ver',
  templateUrl: './cliente-encuesta-ver.component.html',
  styleUrls: ['./cliente-encuesta-ver.component.scss']
})
export class ClienteEncuestaVerComponent implements OnInit {

  @Input() formularioPreguntas: FormularioEncuestaPregunta[] = [];
  @Input() fecha: Date | null = null;

  constructor(
    private modal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {

  }


  /**
   * Modal options
   */
  cerrarModal( result: any = null): void {
    this.modal.close(result);
  }

  obtenerSeleccionados( opciones: FormularioEncuestaOpcion[] ): string | null{
    return opciones.find(x => x.contador === 1)?.valor;
  }


}
