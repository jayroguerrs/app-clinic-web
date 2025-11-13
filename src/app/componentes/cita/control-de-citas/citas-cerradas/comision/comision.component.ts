import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comision',
  templateUrl: './comision.component.html',
  styleUrls: ['./comision.component.scss']
})
export class ComisionComponent implements OnInit {

  @Input() montoTotal: number = 0;
  @Input() porcentaje: number = 0;
  @Input() porcentajeSobreMontoTotal: number = 0;
  @Input() tipoDeComision: number = 0;
  titulo: string
  
  constructor() { }

  ngOnInit(): void {
    switch (this.tipoDeComision) {
      case 1:
        this.titulo = "Sesión 1"
        break;
      case 2:
        this.titulo = "Sesión 2-10"
        break;
      case 3:
        this.titulo = "Reinicios"
        break;
      default:
        this.titulo = "Monto Final"
        break;
    }
  }

}
