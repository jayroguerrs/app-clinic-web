export class TipoComprobante{
  public id: number;
  public descripcion: string;
  public abreviatura: string;
  public idEstado: number;
  public usuarioRegistra: string;
  public fechaRegistra: Date;
  public usuarioEdita: string | null;
  public fechaEdita: Date | null;
  public valor: string;
  public puntoVenta: boolean;

  constructor() {
  }
}
