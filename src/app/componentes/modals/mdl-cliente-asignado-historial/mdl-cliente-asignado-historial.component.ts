import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {ClienteAsignadoService} from "../../../shared/services/cliente-asignado.service";
import { ClienteAsignadoHistorial } from 'src/app/shared/models/cliente';
import {ErrorSistema} from "../../../shared/models/error-sistema";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-cliente-asignado-historial.component.html',
  styleUrls: ['./mdl-cliente-asignado-historial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlClienteAsignadoHistorialComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() IdClientAsignado: number = 0;

  ldCollection = false;
  subscription: Subscription;
  collection : ClienteAsignadoHistorial[] = [];

  constructor(
    public modal: NgbActiveModal,
    public api: ClienteAsignadoService,
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
    this.subscription = this.api.obtenerHistorial(this.IdClientAsignado).subscribe((res: ClienteAsignadoHistorial[] | ErrorSistema) => {

      if(res instanceof ErrorSistema){
        this.utilsService.mostrarToast(res.message, "error");
      }else{
        this.collection = res;
      }

      this.ldCollection = false;
      console.log(res);
    }, error => {
      console.log(error);
      this.ldCollection = false;
    })
  }
}
