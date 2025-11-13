export class ComprobanteAnulacion{
  id: number;
  motivo: string;

  idTipoComprobante: number;
  tipoComprobante: string;

  idSede: number;
  sede: string;

  serie: string;
  numero: number;

  codigo: number;

  idEstadoSunat: number;
  estadoSunat: string;
  estadoSunatColor: string;

  sunatAcepto: number;
  sunatTicketNumero: string;
  sunatDescripcion: string;
  sunatNota: string;
  sunatCodigoRespuesta: number;
  sunatSoapError: string;
  sunatUrlCdr: string;
  sunatUrlPdf: string;
  sunatUrlXml: string;
  idUsuarioRegistro: string;
  idUsuarioModifico: string;

  fechaRegistro: Date;
  fechaModifico: Date | null;

  // Secundario
  usuarioRegistro: string;
  usuarioModifico: string | null;
  validando: boolean;

  constructor() {
    this.validando = false;
  }

}
