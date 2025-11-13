import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  notificacion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
  ) {
  }

  setNotificacion(value: boolean): void{
    this.notificacion.next(value);
  }
  getNotificacion(): boolean{
    return this.notificacion.getValue();
  }

}
