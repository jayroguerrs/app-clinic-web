import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {CronogramaSeguimiento} from "../../../../shared/models/corporal-360/Cita";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {CronogramaSeguimientoService} from "../../../../shared/services/corporal360/cronograma-seguimiento.service";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-cronograma-historial.component.html',
  styleUrls: ['./mdl-cronograma-historial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlCronogramaHistorialComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() IdCronograma: number = 0;

  ldCollection = false;
  subscription: Subscription;
  collection : CronogramaSeguimiento[] = [];

  constructor(
    public modal: NgbActiveModal,
    public api: CronogramaSeguimientoService,
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
    this.subscription = this.api.findByCronograma(this.IdCronograma).subscribe((res: CronogramaSeguimiento[]) => {
      this.collection = res;
      this.ldCollection = false;
      console.log(res);
    }, error => {
      console.log(error);
      this.ldCollection = false;
    })
  }
}
