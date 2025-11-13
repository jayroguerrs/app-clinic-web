import {
  AfterViewInit,
  Component, EventEmitter,
  OnDestroy,
  OnInit, Output,
  ViewEncapsulation
} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {DatePipe} from "@angular/common";
import {ClienteAsignadoEstado} from "../../../shared/models/cliente";
import {ClienteAsignadoEstadoService} from "../../../shared/services/cliente-asignado-estado.service";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-cliente-asignado-estados.component.html',
  styleUrls: ['./mdl-cliente-asignado-estados.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlClienteAsignadoEstadosComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnSelect: EventEmitter<number> = new EventEmitter<number>();

  subscriptions: Subscription[] = [];
  loading: boolean;
  collection: ClienteAsignadoEstado[] = [];
  selected: ClienteAsignadoEstado | null;

  constructor(
    public modal: NgbActiveModal,
    private api: ClienteAsignadoEstadoService,
    private util: UtilsService
  ) {
    this.loading = false;
    this.selected = null;
  }


  ngOnInit(): void {
    this.obtenerEstados();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cerrarModal(): void{
    this.modal.close();
  }

  /*********************************************************************************************************
   * Data
   */
  obtenerEstados(): void{
    this.loading = false;
    const subs = this.api.obtenerListado().subscribe((res: ClienteAsignadoEstado[] | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        this.util.mostrarToast(res.message, 'error');
      }else{
        this.collection = res;
      }
      this.loading = false;
    }, error => {
      this.util.mostrarToast('No se pudo obtener los registros', 'error');
      this.loading = false;
    });
    this.subscriptions.push(subs);
  }

  /*********************************************************************************************************
   * Events
   */
  evtSelect(element: ClienteAsignadoEstado): void{
    this.selected = element;
  }

  evtSubmit(): void{
    this.OnSelect.emit(this.selected.id);
  }

  isSelect(element: ClienteAsignadoEstado): boolean{
    return element.id === this.selected?.id;
  }

}
