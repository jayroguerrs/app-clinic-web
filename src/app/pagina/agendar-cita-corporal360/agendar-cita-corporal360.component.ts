import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavBarService} from "../../shared/services/nav-bar.service";
import {NavBarMenu, NavBarOption} from "../../shared/models/nav-bar";
import {ClienteService} from "../../shared/services/cliente.service";
import {Cliente} from "../../shared/models/cliente";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TipoClienteService} from "../../shared/services/tipocliente.services";
import {SedeService} from "../../shared/services/sede.service";
import {TecnologiaService} from "../../shared/services/tecnologia.service";
import {Tecnologia} from "../../shared/models/tecnologia";
import {TipoCitaService} from "../../shared/services/tipo-cita.services";

@Component({
  selector: 'app-agendar-cita-corporal360',
  templateUrl: './agendar-cita-corporal360.component.html',
  styleUrls: ['./agendar-cita-corporal360.component.scss']
})
export class AgendarCitaCorporal360Component implements OnInit, OnDestroy {

  cliente: Cliente | null = null;

  frmGroup: FormGroup;


  tiposCliente: any[] = [];
  sedes: any[] = [];
  tecnologias: Tecnologia[] = [];
  tiposCita: any[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private navBarService: NavBarService,
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private frmBuilder: FormBuilder,
    private clienteTipoService: TipoClienteService,
    private sedeService: SedeService,
    private tecnologiaService: TecnologiaService,
    private tipoCitaService: TipoCitaService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.obtenerCliente();
    this.obtenerTipoCliente();
    this.obtenerSedes();
    this.obtenerTecnologias();
    this.obtenerTiposCita();

    this.navBarService.setShowNavBarTop(true);
    this.drawOptions();
  }

  ngOnDestroy(): void {
    this.navBarService.setShowNavBarTop(false);
  }

  // form
  initForm(): void{
    this.frmGroup = this.frmBuilder.group({
      cliente: new FormControl(null, Validators.required),
      documento: new FormControl(null),
      telefono: new FormControl(null),
      idTipoCliente: new FormControl('', Validators.required),
      idSede: new FormControl('', Validators.required),
      idTecnologia: new FormControl('', Validators.required),
      idTipoCita: new FormControl('', Validators.required),
    });
  }

  drawOptions(): void{
    const options: NavBarMenu[] = [
      {
        text: 'Registrar',
        type: 'button',
        class: 'btn sbtn btn-primary mr-2 d-flex',
        disabled: false,
        onClick : this.fff,
        icon: 'floppy-disk',
        iconType: 'light',
        visible: true,
        items: []
      },
      {
        text: 'Editar',
        type: 'button',
        class: 'btn sbtn btn-warning text-white mr-2 d-flex',
        disabled: false,
        onClick : () => {
          alert('Editar');
        },
        icon: 'calendar-pen',
        iconType: 'light',
        visible: true,
        items: []
      },
      {
        text: 'Horario',
        type: 'button',
        class: 'btn sbtn btn-primary text-white d-flex mr-2',
        disabled: false,
        onClick : () => {
          alert('Editar');
        },
        icon: 'calendar-clock',
        iconType: 'light',
        visible: true,
        items: []
      },
      {
        text: 'Estado',
        type: 'dropdown',
        class: 'btn sbtn btn-primary text-white d-flex',
        disabled: false,
        onClick : () => {

        },
        icon: 'calendar-star',
        iconType: 'light',
        visible: true,
        items: [
          {
            text: 'Confirmar',
            type: 'button',
            class: 'btn sbtn btn-primary text-white d-flex mr-2',
            disabled: false,
            onClick : () => {
              alert('Editar');
            },
            icon: 'calendar-clock',
            iconType: 'light',
            visible: true,
            items: []
          },{
            text: 'Atender',
            type: 'button',
            class: 'btn sbtn btn-primary text-white d-flex mr-2',
            disabled: false,
            onClick : () => {
              alert('Editar');
            },
            icon: 'calendar-clock',
            iconType: 'light',
            visible: true,
            items: []
          },{
            text: 'Cancelar',
            type: 'button',
            class: 'btn sbtn btn-primary text-white d-flex mr-2',
            disabled: false,
            onClick : () => {
              alert('Editar');
            },
            icon: 'calendar-clock',
            iconType: 'light',
            visible: true,
            items: []
          },{
            text: 'Anular',
            type: 'button',
            class: 'btn sbtn btn-primary text-white d-flex mr-2',
            disabled: false,
            onClick : () => {
              alert('Editar');
            },
            icon: 'calendar-clock',
            iconType: 'light',
            visible: true,
            items: []
          },{
            text: 'Pendiente',
            type: 'button',
            class: 'btn sbtn btn-primary text-white d-flex mr-2',
            disabled: false,
            onClick : () => {
              alert('Editar');
            },
            icon: 'calendar-clock',
            iconType: 'light',
            visible: true,
            items: []
          }
        ]
      },
    ];

    this.navBarService.setNavBarOption({menu:options});
  }

  fff(): void{
    console.log('asdfadsf');
  }

  // data

  obtenerCliente(): void{
    const parametro = this.activatedRoute.snapshot.params;
    const idCliente = parseInt(parametro.idcliente, 10);
    this.clienteService.obtenerById(idCliente).subscribe((res: any) => {
      const cliente = new Cliente();
      cliente.id = res.id;
      cliente.nombres = res.nombres;
      cliente.apellidos = res.apellidos;
      cliente.documento = res.documento;
      cliente.telefono1 = res.celular1;
      cliente.telefono2 = res.celular2;
      this.cliente = cliente;
      this.frmGroup.patchValue({
        cliente: res.nombres + ' ' + res.apellidos,
        documento: res.documento,
        telefono: res.celular1 + ' - ' + res.celular2,
      });
    });
  }

  obtenerTipoCliente(): void {
    this.clienteTipoService.obtenerTipoCliente().subscribe((res) => {
      this.tiposCliente = res;
    }, error => {
      console.log(error);
    });
  }

  obtenerSedes(): void{
    this.sedeService.obtener().subscribe((res) => {
      this.sedes = res;
    }, error => {
      console.log(error);
    })
  }

  obtenerTecnologias(): void{
    this.tecnologiaService.listarByEstado(1).subscribe((res: Tecnologia[]) => {
      console.log(res);
      this.tecnologias = res;
    }, error => {
      console.log(error);
    })
  }

  obtenerTiposCita(): void{
    this.tipoCitaService.obtenerTipoCita().subscribe((res) => {
      this.tiposCita = res;
    }, error => {
      console.log(error);
    });
  }

  // getters
  get f(): any{
    return this.frmGroup.controls;
  }

}
