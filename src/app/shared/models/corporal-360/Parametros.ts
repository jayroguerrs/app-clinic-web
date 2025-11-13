import {AccionCita, AccionCronograma} from "../../enumeracion/enums";

export class ParametrosCronograma{
  accionActual: AccionCronograma;
  citaAccionActual: AccionCita | 0;
  id: number;
  uuid: string;
  idCliente: number;
  constructor() {
    this.accionActual = 1;
    this.citaAccionActual = 0;
    this.id = 0;
    this.uuid = '';
    this.idCliente = 0;
    this.citaAccionActual = AccionCita.VER;
  }
}
