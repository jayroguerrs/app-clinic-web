import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {PreferenteHistoria} from "../../../shared/models/preferente.model";
import {PreferenteService} from "../../../shared/services/preferente.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-preferente-historial.component.html',
  styleUrls: ['./mdl-preferente-historial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlPreferenteHistorialComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() IdPreferente: number = 0;

  ldCollection = false;
  subscription: Subscription;
  collection : PreferenteHistoria[] = [];

  constructor(
    public modal: NgbActiveModal,
    public api: PreferenteService,
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
    this.subscription = this.api.obtenerHistorial(this.IdPreferente).subscribe((res: PreferenteHistoria[]) => {
      this.collection = res;
      this.ldCollection = false;
      console.log(res);
    }, error => {
      console.log(error);
      this.ldCollection = false;
    })
  }
}
