import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {CitaDetalle} from "../../../shared/models/corporal-360/Cita";

@Component({
  selector: 'app-cita-detalle',
  templateUrl: './cita-detalle.component.html',
  styleUrls: ['./cita-detalle.component.scss']
})
export class CitaDetalleComponent implements OnInit, AfterViewInit {

  subcription: Subscription;

  collection: CitaDetalle[] = [];
  _collection = new BehaviorSubject<CitaDetalle[]>([]);

  constructor(
    private authService: AuthService,
    public utilService: UtilsService
  ) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  clear(index: number): void{
    this.collection = this.collection.filter((x,i) => index !== i);
    this._collection.next(this.collection);
  }

  validators(): void{
    const x = this.collection.find(x=> x.idPromocion = 0);
    if(x) {
      this.utilService.mostrarToast(`Debe elegir una promoción para la zona ${x.zona}`,'warning');
      return;
    }
  }

}
