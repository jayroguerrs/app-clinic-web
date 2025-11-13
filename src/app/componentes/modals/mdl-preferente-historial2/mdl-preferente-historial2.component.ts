import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {PreferenteHistorial} from "../../../shared/models/preferente.model";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {PreferenteHistorialService} from "../../../shared/services/preferente-historial.service";
import {EnumEstadoPreferenteHistorial} from "../../../shared/enumeracion/enums";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-preferente-historial2.component.html',
  styleUrls: ['./mdl-preferente-historial2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlPreferenteHistorial2Component implements OnInit, OnDestroy, AfterViewInit {
  @Input() IdPreferente: number = 0;

  ldCollection = false;
  subscription: Subscription;
  collection : PreferenteHistorial[] = [];

  enumEstadoPreferenteHistorial = EnumEstadoPreferenteHistorial;

  constructor(
    public modal: NgbActiveModal,
    public api: PreferenteHistorialService,
    public utilsService: UtilsService
  ) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.obtenerHistorial();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  cerrarModal( result: boolean = false ): void {
    this.modal.close(result);
  }

  obtenerHistorial(): void{
    this.ldCollection = true;
    this.subscription = this.api.obtenerHistorial(this.IdPreferente).subscribe((res: PreferenteHistorial[]) => {

      console.log(res);
      this.collection = res;
      this.ldCollection = false;
      console.log(res);
    }, error => {
      console.log(error);
      this.ldCollection = false;
    })
  }
}
