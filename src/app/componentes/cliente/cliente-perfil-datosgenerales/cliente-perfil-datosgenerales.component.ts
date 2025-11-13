import {Component, Input, OnInit} from '@angular/core';
import {ClienteService} from "../../../shared/services/cliente.service";
import {Cliente} from "../../../shared/models/cliente";

@Component({
  selector: 'app-cliente-perfil-datosgenerales',
  templateUrl: './cliente-perfil-datosgenerales.component.html',
  styleUrls: ['./cliente-perfil-datosgenerales.component.scss']
})
export class ClientePerfilDatosgeneralesComponent implements OnInit {

  @Input() idCliente: number;
  cliente: Cliente;
  loadingCliente = false;
  constructor(
    private clienteService: ClienteService, 
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  reload(): void{
    this.obtenerDatos();
  }

  obtenerDatos(): void{
    this.loadingCliente = true;
    this.clienteService.findById(this.idCliente).subscribe((res) => {
      this.cliente = res;
      this.loadingCliente = false;
    }, error => {
      this.loadingCliente = false;
      console.log(error);
    });
  }

}
