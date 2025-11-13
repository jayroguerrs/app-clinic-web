import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {CitaSeguimiento360Service} from "../../../../shared/services/corporal360/cita-seguimiento360.service";
import {CitaSeguimiento} from "../../../../shared/models/corporal-360/Cita";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-cita-historial.component.html',
  styleUrls: ['./mdl-cita-historial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlCitaHistorialComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() IdCita: number = 0;

  ldCollection = false;
  subscription: Subscription;
  collection : CitaSeguimiento[] = [];

  constructor(
    public modal: NgbActiveModal,
    public api: CitaSeguimiento360Service,
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
    this.subscription = this.api.findByCita(this.IdCita).subscribe((res: CitaSeguimiento[]) => {
      this.collection = res;
      this.ldCollection = false;
      console.log(res);
    }, error => {
      console.log(error);
      this.ldCollection = false;
    })
  }
}
