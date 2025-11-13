export class FacturaDatosCita {
  public idCita: number;
  public idSede: number;
  public idServicio: number;
  public fechaCita: Date;
  public numeroBox: number;
  public idMaquinaMarca: number | null;
  public maquinaMarca: string | null;
  public idAtendidoPor: number | null;
  public atendidoPor: string | null;

  public idCliente: number;
  public nombreCliente: string;
  public idTipoDocumentoCliente: string | null;
  public tipoDocumentoCliente: string | null;
  public documentoCliente: string | null;

}


export class ComprobanteDatosCitaDetalle {
  public id: number;
  public idCita: number;
  public idVenta: number;
  public idCitaDetalle: number;
  public cantidad: number;
  public sesion: number;
  public precio: number;

  public importe: number;
  public idZona: number;
  public zona: string;
  public selectComprobante: boolean;

  public idUnidadMedida: number | null;
  public unidadMedida: string | null;
  public unidadMedidaValor: string | null;
  public descripcionUnidadMedida: string | null;
  public usuarioRegistro: string;
  public fechaRegistro: Date;


  public detalle: string | null;
  public valorUnitario: number;
  public subTotal: number;
  public igv: number;
  public total: number;
  public idTipoIgv: number;
  public tipoIgvValor: string;
  public impBolsa: boolean;
  public impBolsaTotal: number;


  public aplicaIgv: boolean;
  public gratuita: boolean;
  public inafecta: boolean;
  public exonerada: boolean;

  public gratuitaTotal: number;
  public inafectaTotal: number;
  public exoneradaTotal: number;



  public precioCosto: number;
  public precioReal: number;

  constructor() {
    this.selectComprobante = true;
    this.cantidad = 1;

    this.detalle = null;
    this.valorUnitario = 0.00;
    this.subTotal = 0.00;
    this.igv = 0.00;
    this.total = 0.00;
    this.idTipoIgv = 1;
    this.impBolsa = false;
    this.impBolsaTotal = 0.00;

    this.gratuitaTotal = 0.00;
    this.inafectaTotal = 0.00;
    this.exoneradaTotal = 0.00;

    this.aplicaIgv = true;
    this.gratuita = false;
    this.inafecta = false;
    this.exonerada = false;

    this.precioCosto = 30.00;
  }
}


export class CitaNuevoItem{
  idCita: number;
  idSede: number;
  idServicio: number;
  idZona: number;
  zona: string;
  idTecnologia: number;
  tecnologia: string;
  idPromocionPrecio: number;
  promocion: string;
  sesion: number;
  precio: number;
  duracion: number;
  idAgendadoPor: number;
  agendadoPor: string;
  idOrigenMedio: number;
  origenMedio: string;
  retoque: boolean;
  retroceso: boolean;
  pagoWeb: boolean;
  idUsuarioModifico: number;
  constructor() {
  }
}

