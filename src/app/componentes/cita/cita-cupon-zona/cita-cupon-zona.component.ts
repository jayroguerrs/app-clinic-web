import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {CitaImportClass} from "../../../shared/models/cita";


@Component({
  selector: 'app-cita-cupon-zona',
  templateUrl: './cita-cupon-zona.component.html',
  styleUrls: ['./cita-cupon-zona.component.scss'],
  providers: [
  ]
})

export class CitaCuponZonaComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() datosCita: CitaImportClass;
  zonasCorporalesHabilitadas: any[] = [];

  selectZonas : number[] = [];
  constructor(
  ) {

  }

  ngOnInit(): void {
    this.zonasCorporalesHabilitadas = this.datosCita.zonasCorporales.filter((zona: any) => zona.estado === true)
    if(this.datosCita.descuentoAplicaA){
      this.selectZonas = this.datosCita.descuentoAplicaA.split(",").map( x => parseInt(x));
    }
  }

  cerrarModal(): void{
    this.modal.close();
  }

  aceptarCambios(): void{

  }

  select(idZona: number): void{

    if(this.selectZonas.includes(idZona)){
      this.selectZonas = this.selectZonas.filter(x => x !== idZona);
    }else{
      this.selectZonas.push(idZona);
    }

    this.datosCita.descuentoAplicaA = this.selectZonas.join(",");
  }

}
