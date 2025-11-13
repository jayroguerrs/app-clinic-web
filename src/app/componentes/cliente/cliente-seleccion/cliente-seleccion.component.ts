import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Cliente} from "../../../shared/models/cliente";
import {ClienteService} from "../../../shared/services/cliente.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {FormControl, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-cliente-seleccion',
  templateUrl: './cliente-seleccion.component.html',
  styleUrls: ['./cliente-seleccion.component.scss']
})
export class ClienteSeleccionComponent implements OnInit {
  @Output() onSelect = new EventEmitter<Cliente>();
  @Input() selected: Cliente | null = null;

  _selected = new BehaviorSubject<Cliente | null>(null);
  _collection = new BehaviorSubject<Cliente[]>([]);

  search = new FormControl('', Validators.required);
  loading = false;

  constructor(
    private api: ClienteService,
    private utilsService: UtilsService,
    private activeModal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {
    /*this.buildtable();*/
  }
  cerrarModal(): void {
    this.activeModal.close();
  }

  /*buildtable(): void{
    const mensajeError = 'Error al obtener usuario';
    this.spinner.show();
    this.usuarioService.obtenerByIdPerfil(this.idPerfil, this.idSede).subscribe(
      data => {
        this.userList = data;
        this.userListTemp = data;
        this.spinner.hide();
      },
      error => {
        console.log(mensajeError, error);
        this.spinner.hide();
      }
    );
  }*/
  seleccionarCliente(cliente: Cliente): void {
    this._selected.next(cliente);
  }
  buscarCliente(): void {
    const parametros = this.search.value;
    if (parametros){
      this.loading = true;
      this.api.buscarPorParametros(parametros).subscribe((res: Cliente[]) => {
        this._collection.next(res);
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
      })
    }
  }
  devolverCliente(cliente: Cliente): void{
    this.onSelect.emit(cliente);
    this.cerrarModal();
  }
  limpiar(): void{
    this.search.setValue(null);
  }


}
