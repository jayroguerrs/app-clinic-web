import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preferente-tabla',
  templateUrl: './preferente-tabla.component.html',
  styleUrls: ['./preferente-tabla.component.scss']
})
export class PreferenteTablaComponent implements OnInit, ISuperColumna {
  @Input() public sColumnas: ISuperColumna[];
  @Input() public sColumnasHtml: ISuperColumnaHtml[];
  @Input() public sDatos: any = [];

  constructor() { }

  nombreColumna: string;
  anchoColumna: number;
  dataColumna: string;

  ngOnInit(): void {
    console.log(this.sColumnas);
  }

  public listar(sDatos: any[]): void {
    this.sDatos = sDatos;
  }

  public datosColumna(fila: any, columna: ISuperColumna): string {
    if (columna.tipoColumna === TipoColumna.html){
      return this.sColumnasHtml.find(x => x.dataColumna === columna.dataColumna).htmlColumna;
    }
    return fila[columna.dataColumna];
  }

  public render(dataColumna: any): string{
    return '';
  }
}

export interface ISuperColumna{
  nombreColumna: string;
  anchoColumna: number;
  dataColumna: string;
  tipoColumna?: TipoColumna | null;
  visible?: boolean;
  render?: (dataColumna: any) => string;
}
export interface ISuperColumnaHtml{
  dataColumna: string;
  htmlColumna: string;
}

export enum TipoColumna{
  text = 1,
  html = 2
}

