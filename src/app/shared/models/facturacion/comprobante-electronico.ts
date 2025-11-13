import {ComprobanteDatosCitaDetalle} from "./factura-datos-cita";

export class ComprobanteElectronico{
  id: number;
  idVenta: number;

  idSede: number;
  sede: string;

  serie: string;
  numero: number;

  idTipoComprobante: number;
  tipoComprobante: string;

  idTipoNotaCredito: number;
  tipoNotaCredito: string;

  idTipoComprobanteModifica: number;
  tipoComprobanteModifica: string;
  serieComprobanteModifica: string;
  numeroComprobanteModifica: string;

  observaciones: string;

  fechaEmision: Date;
  usuarioRegistro: string;

  sunatAnulado: boolean;
  sunatEstado: string;

  idEstadoSunat: number;
  estadoSunat: string;
  estadoSunatColor: string;

  validando: boolean;


  constructor() {
    this.validando = false;
  }
}






export class ComprobanteElectronicoDatos{
  idVenta: number;

  idCliente: number;
  idCita: number;
  idSede: number;

  idAtendidoPor: number;
  numeroBox: number;
  idMaquinaMarca: number;
  siguienteCita: boolean;

  idTipoComprobante: number;
  tipoComprobante: string;
  idSerieComprobante: number;
  serieComprobante: string;
  numeroComprobante: string;

  idPorcentajeIgv: number;
  porcentajeIgv: string;

  idSunatTransaccion: number;
  sunatTransaccion: string;
  sunatTransaccionValor: string;

  idTipoMoneda: number;
  tipoMoneda: string;
  tipoMonedaSimbolo: string;
  tipoMonedaValor: string;

  tipoCambio: number;
  idTipoPago: number;
  tipoPago: string;
  idEntidadTipoPago: number;
  entidadTipoPago: string;


  subTotal: number;
  descuento: number;

  descuentoGlobal: number;
  totalDescuento: number;

  totalAnticipo: number;

  totalIgv: number;
  totalGratuita: number;
  totalInafecta: number;
  totalExonerada: number;
  totalOtros: number;
  totalIsc: number;
  total: number;
  recibido: number;
  vuelto: number;
  detalles: ComprobanteDatosCitaDetalle[] = [];

  idUsuarioRegistro: number;
  usuarioRegistro: string;
  usuarioRegistroNombre: string;

  // secondary
  cliente: string;
  clienteDocumento: string;

  sede: string;
  emisorRazonSocial: string;
  emisorTelefonos: string;
  emisorDireccion: string;
  emisorRuc: string;
  emisorDescripcion: string;

  fechaEmision: Date;
  fechaVencimiento: Date | null;

  // datos de cliente para el comprobante
  idClienteComprobante: number | null;
  clienteDocumentoComprobante: string | null;
  clienteDenominacionComprobante: string | null;
  clienteDireccionComprobante: string | null;
  tipoDocumentoClienteValor: string | null;



  // datos del comprobante electronico
  sunatKey: string | null;
  sunatHash: string | null;
  suantUrlCdr: string | null;
  sunatUrlPdf: string | null;
  sunatUrlXml: string | null;
  sunatCadenaBarra: string | null;
  sunatCadenaQR: string | null;
  sunatZipPdfBase64: string | null;

  boletaPdfBase64: string | null;

  idSiguienteCita: number | null;

  comprobanteCliente: ComprobanteElectronicoCliente | undefined;


  // notas de credito o debito
  idTipoComprobanteModifica: number | null;
  tipoComprobanteModificaValor: string | null;
  serieComprobanteModifica: string | null;
  numeroComprobanteModifica: string | null;
  idTipoNotaCredito: number | null;
  tipoNotaCreditoValor: string | null;
  idTipoNotaDebito: number | null;
  tipoNotaDebitoValor: string | null;

  idComprobanteModifica: number | null;

  observaciones: string | null;


  constructor() {
  }
}

export class ComprobanteElectronicoCliente{
  id: number;
  nombre: string;
  direccion: string;
  numeroDocumento: string;
  idTipoDocumento: number;
  tipoDocumento: string;
  tipoDocumentoValor: string;
  constructor() {
  }
}

export class ComprobanteElectronicoAnulado{
  public id: number;
  public idVenta: number;
  public motivo: string;

  public idUsuarioRegistro: number;
  public usuarioRegistro: string;
  public fechaRegistro: Date;
  constructor() {
  }
}


export class ComprobanteElectronicoValidar{
  public idTipoComprobante: number;
  public numero: number;
  public serie: string;
  public idEstadoSunat: number;
  public estadoSunat: string;
  public estadoSunatColor: string;

  constructor() {
  }
}


export class ComprobanteElectronicoReporte{
  public  id: number;
  public  idEstado: number;
  public  idCita: number;
  public  serie: string;
  public  numero: string;
  public  idCliente: number
  public  cliente: string;
  public  idTipoComprobante: number
  public  tipoComprobante: string;
  public  idSede: number;
  public  sede: string;
  public  total: number
  public  usuarioRegistro: string;
  public  fechaRegistro: Date | null;
  public  fechaPago: Date;
  public  fechaEmision: Date;
  public  usuarioModifico: string | null;
  public  fechaModifico: Date  |null

  public idEstadoSunat: number;
  public estadoSunat: string | null = null;
  public estadoSunatColor: string;

  public anuladoSunat: boolean = false;
  public validado: boolean = false;
  public validando: boolean = false;

  constructor() {
  }
}



export class FacturacionReporteVenta{
  public  id: number;
  public  fecha: Date;
  public  local: string;
  public  tipo: string;
  public  serie: string;
  public  numero: number;
  public  codigo: string;
  public  nombre: string;
  public  m: string;
  public  baseImp: number;
  public  exonera: string;
  public  isc: string;
  public  impuesto: number;
  public  total: number;
  public  ivap: string;
  public  percepc: string;
  public  servicio: string;
  public  detraccion: string;
  public  icbper: string;
  public  tc: string;

  constructor() {
    this.exonera = '-';
    this.isc = '-';
    this.ivap = '-';
    this.percepc = '-';
    this.servicio = '-';
    this.detraccion = '-';
    this.icbper = '-';
    this.tc = '-';
  }
}

export class FacturacionReporteVentaCliente{
  public  idVenta: number;
  public  idVentaDetalle: number;
  public  idCliente: number;
  public  cliente: string;
  public  documentoCliente: string;
  public  nombreCliente: string;
  public  apellidoCliente: string;
  public  idProducto: number;
  public  producto: string;
  public  unidad: string;
  public  factor: number;
  public  cantidad: number;
  public  total : number;
  public  costo : number;
  public  ganancia : number;
  public  moneda : string;

  constructor() {
  }
}

export class FacturacionReporteVentaProducto{
  public idVenta: number;
  public idVentaDetalle: number;
  public idProducto: number;
  public producto: string;
  public idTipoComprobante: number;
  public serieComprobante: string;
  public numeroComprobante: number;
  public idCliente: number;
  public documentoCliente: string;
  public nombreCliente: string;
  public apellidoCliente: string;
  public fecha: Date;
  public unidadMedida: string | null;
  public factor: number;
  public cantidad: number;
  public precio: number;
  public total: number;
  public moneda: string;
  public usuario: string;
  public caja: string;
  public turno: number;
  public estado: string;
  public tipoIgv: string;
  public comision: number;
  public totalComision: number;

  constructor() {
  }
}


export class FacturacionReportePago{
  public  id: number;
  public  tipo: string;
  public  serie: string;
  public  numero: number;
  public  fecha: Date;
  public  m: string;
  public  tc: string;
  public  dias: number;
  public  propina: number;
  public  total: number;
  public  idTipoPago: number;
  public  tipoPago: string;
  public  numeroOperacion: string;
  public  e: number;
  public  observacionFormaPago: string;
  public  documentoCliente: number;
  public  nombreCliente: string;
  public  usuario: string;
  public  caja: string;
  public  turno: number;
  public  observacionComprobante: number;


  constructor() {
  }
}


export class ComprobanteElectronicoMedioPago{
  public idCita: number;
  public idVenta: number;
  public idComprobanteElectronico: number | null;
  public idTipoPago: number | null;
  public tipoPago: string | null;
  public idEntidadTipoPago: number | null;
  public entidadTipoPago: string | null;
  public importe: number;
  public numeroPedido: string | null = null;
  public nota: string | null = null;
  public entidad: boolean;
  public numOperacion: boolean;
  constructor() {
    this.idCita = 0;
    this.idVenta = 0;
    this.idComprobanteElectronico = 0;
    this.entidad = false;
    this.numOperacion = false;
    this.importe = 0;
  }
}
