export class DocumentoContable {
    constructor(
      public idCodigoTipoDocumento: number,
      public idCaja: number,
      public caja: string,
      public idFormulario: number,
      public formulario: string,
      public idDocumento: number,
      public documento: string,
      public serie: string,
      public ultimoNumero: string,
      public isFacturacionElectronica: number,
    ) {  }
  }