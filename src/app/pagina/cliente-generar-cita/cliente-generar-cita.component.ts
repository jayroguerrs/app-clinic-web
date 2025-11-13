import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {ClienteService} from "../../shared/services/cliente.service";
import {Cliente} from "../../shared/models/cliente";
import {ActivatedRoute} from "@angular/router";
import { AccionCita } from 'src/app/shared/enumeracion/enums';

@Component({
  selector: 'app-cliente-generar-cita',
  templateUrl: './cliente-generar-cita.component.html',
  styleUrls: ['./cliente-generar-cita.component.scss']
})
export class ClienteGenerarCitaComponent implements OnInit {

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  client: Cliente;
  AccionCita = AccionCita;

  constructor(
    private auth: AuthService,
    private clientService: ClienteService,
    private activatedRoute: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.getClient();
  }

  getClient(): void{
    const parametro = this.activatedRoute.snapshot.params;
    this.clientService.obtenerById(parametro.id).subscribe((res: any) => {
      const cliente = new Cliente();
      cliente.id = res.id;
      cliente.nombres = res.nombres;
      cliente.apellidos = res.apellidos;
      this.client = cliente;
    });
  }

}
