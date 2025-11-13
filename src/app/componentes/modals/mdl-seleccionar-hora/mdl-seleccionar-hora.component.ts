import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import Swal from 'sweetalert2';

import {GroupButtonComponent} from "../../group-button/group-button.component";
import {InputDialerComponent} from "../../input-dialer/input-dialer.component";
import {Zona} from "../../../shared/models/zonas";
import {BoxTime} from "../../../shared/models/box";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {CitaDetalle, Cita} from "../../../shared/models/corporal-360/Cita";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ZonaCorporalService} from "../../../shared/services/zona-corporal.service";
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";
import {Tecnologia} from "../../../shared/models/tecnologia";
import {TecnologiaService} from "../../../shared/services/tecnologia.service";


@Component({
  selector: 'mdl-seleccionar-hora',
  templateUrl: './mdl-seleccionar-hora.component.html',
  styleUrls: ['./mdl-seleccionar-hora.component.scss']
})

export class MdlSeleccionarHoraComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() IdGenero: number = 0;
  @Input() IdZona: number = 0;
  @Input() IdServicio: number = 0;
  @Input() IdSede: number = 0;




  @ViewChild('minutos') selectMinutos: InputDialerComponent;

  @ViewChild('gridMinutos') gridMinutos: ElementRef;

  zonasDimissed: Zona[] = [];
  zonasSelected: Zona[] = [];

  citaDetalles: CitaDetalle[] = [];
  citaDetallesSelected: CitaDetalle[] = [];

  zonasSeleccionadas: Zona[] = [];

  frmZonas = new FormControl([]);


  // form

  public submit: EventEmitter<CitaDetalle[]> = new EventEmitter();

  @ViewChild('groupMinutos') min: GroupButtonComponent;
  items: { value: number; text: string }[] = [
    {value: 10, text: '10'},
    {value: 20, text: '20'},
    {value: 30, text: '30'},
    {value: 40, text: '40'},
    {value: 50, text: '50'},
    {value: 60, text: '60'},
    {value: 70, text: '70'},
    {value: 80, text: '80'}
  ];
  minutos: number | null = 0;

  horaInicio = 480;
  horaFin = 1320;
  horaSeleccionada = 0;

  casilleros: BoxTime[] = [];
  citasRegistradas: Cita[] = [];

  horaDesde: string | null = '';
  horaHasta: string | null = '';

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  zonas: Zona[] = [];
  servicios: Servicio[] = [];
  tecnologias: Tecnologia[] = [];



  // form
  frmGroup: FormGroup;

  // loading
  ldZonas = false;
  ldServicios = false;
  ldTecnologias = false;

  constructor(
    public bsModalRef: NgbActiveModal,
    private frmBuilder: FormBuilder,
    private authService: AuthService,
    public util: UtilsService,
    private zonaService: ZonaCorporalService,
    private servicioService: ServicioService,
    private tecnologiaService: TecnologiaService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.obtenerZonas();
    this.obtenerServicios();
    this.obtenerTecnologias();

    this.initValues();

    // this.initValues();
    this.drawBoxTime();
    this.collectionCitas();
    this.drawCitas();
  }

  ngAfterViewInit(): void {
    this.min._current.subscribe(async (res: number) => {
      this.minutos = res;
      if(this.horaSeleccionada){
        const free = await this.boxFree(this.horaSeleccionada);

        if(!free){
          this.Toast.fire({
            icon: 'error',
            title: 'Seleccione un horario disponible'
          });
          this.horaSeleccionada = 0;
          this.clearSelect();
          return;
        }
        this.drawSelect(this.horaSeleccionada);
      }
    });
    this.selectMinutos.onChange().subscribe(async (res: number) => {
      this.minutos = res;
      if(this.horaSeleccionada){
        const free = await this.boxFree(this.horaSeleccionada);

        if(!free){
          this.Toast.fire({
            icon: 'error',
            title: 'Seleccione un horario disponible'
          });
          this.horaSeleccionada = 0;
          this.clearSelect();
          return;
        }
        this.drawSelect(this.horaSeleccionada);
      }
    });
  }

  ngOnDestroy(): void {
  }

  initForm(): void{
    this.frmGroup = this.frmBuilder.group({
      idServicio: new FormControl('', Validators.required),
      idZona: new FormControl('', Validators.required),
      idTecnologia: new FormControl('', Validators.required)
    });
  }
  initValues(): void{
    this.frmGroup.patchValue({
      idServicio: this.IdServicio ? this.IdServicio : '',
      idZona: this.IdZona ? this.IdZona : ''
    });
  }


  // getters

  add(): void{
    this.zonasDimissed = !this.zonasDimissed.length ? this.zonasSelected : this.zonasDimissed.concat(this.zonasSelected);
    // console.log(this.zonasDimissed, 'dddd');
    const z = this.zonas.filter( (x: Zona) => {
      if( !this.zonasSelected.map(y => y.id).includes(x.id) ){
        return x;
      }
    });
    // this.zonas = z;

    // Agregar los detalles
    this.zonasSelected.map(x => {
      const detalle = new CitaDetalle();
      //detalle.idServicio = parseInt(this.f.idServicio.value, 10); DYLAND
      detalle.servicio = this.servicios.find(x => x.id === parseInt(this.f.idServicio.value, 10))?.nombre;
      detalle.minutos = x.minutos;
      detalle.idZona = x.id;
      detalle.zona = x.nombre;
      this.citaDetalles.push(detalle);
    });

    this.zonasSelected = [];

    // console.log(this.zonasDimissed);
  }
  isDimissed(zona: Zona): boolean{
    return this.zonasDimissed.map(x => x.id).includes(zona.id);
  }


  selectDetail(detalle: CitaDetalle): void{
    if(this.citaDetallesSelected.length){
      const z = this.citaDetallesSelected.find(x => x.idZona === detalle.idZona);
      if(z){
        this.citaDetallesSelected = this.citaDetallesSelected.filter(x => x.idZona !== detalle.idZona);
      }else{
        this.citaDetallesSelected.push(detalle);
      }
    }else{
      this.citaDetallesSelected.push(detalle);
    }
    // console.log(this.zonasSelected);
  }
  detailtIsSelect(detalle: CitaDetalle): boolean{
    if(this.citaDetallesSelected.length){
      const z = this.citaDetallesSelected.find(x => x.idZona === detalle.idZona);
      return !!z;
    }else{
      return false;
    }
  }
  remove(): void{
    const details = this.zonasDimissed.filter( (x: Zona) => {
      if( this.citaDetallesSelected.map(y => y.idZona).includes(x.id) ){
        return x;
      }
    });

    // this.zonas = this.zonas.concat(details);
    this.zonasDimissed = this.zonasDimissed.filter( (x: Zona) => {
      if( !this.citaDetallesSelected.map(y => y.idZona).includes(x.id) ){
        return x;
      }
    });

    this.citaDetalles = this.citaDetalles.filter( (x: CitaDetalle) => {
      if( !this.citaDetallesSelected.map(y => y.idZona).includes(x.idZona) ){
        return x;
      }
    });
    this.citaDetallesSelected = [];
    // console.log(this.zonasDimissed);
  }





  get f(): any{
    return this.frmGroup.controls;
  }
  onSubmit(): void{
    this.submit.emit(this.citaDetalles);
    this.bsModalRef.close();
  }




  collectionCitas(): void{
    const cita1 = new Cita();
    cita1.hora = 480;
    cita1.minutos = 40;
    this.citasRegistradas.push(cita1);
    const cita2 = new Cita();
    cita2.hora = 900;
    cita2.minutos = 20;
    this.citasRegistradas.push(cita2);
    const cita3 = new Cita();
    cita3.hora = 1080;
    cita3.minutos = 60;
    this.citasRegistradas.push(cita3);
  }
  drawBoxTime(): void{
    let index = 0;
    for (let i = this.horaInicio; i < this.horaFin; i += 5) {
      const box = new BoxTime();
      box.index = index;
      box.minuto = i;
      this.casilleros.push(box);
      index++;
    }
  }
  drawCitas(): void {
    this.citasRegistradas.forEach((x: Cita) => {
      let count = 0;
      const numCasilleros = x.minutos / 5;
      const casilleroInicial = this.casilleros.find(y => y.minuto === x.hora);
      this.casilleros = this.casilleros.map( (x: BoxTime) => {
        if(count !== numCasilleros) {
          if (x.index >= casilleroInicial.index) {
            x.reservedStart = x.index === casilleroInicial.index;
            x.reservedEnd = x.index === casilleroInicial.index + numCasilleros - 1;
            x.reserved = true;
            count++;
          }
        }
        return x;
      });
    });
  }
  clearSelect(): void{
    this.casilleros = this.casilleros.map(x => {
      x.selected = false;
      x.selectedStart = false;
      x.selectedEnd = false;
      return x;
    });
  }
  async drawSelect(minuto: number): Promise<void>{
    // console.log('Hora Inicio', this.util.minutesToHour(minuto));
    // console.log('Hora Fin', this.util.minutesToHour(minuto+this.minutos));

    this.clearSelect();
    const casilleroInicial = this.casilleros.find(x => x.minuto === minuto);
    // casilleroInicial.hover = true;

    const numCasilleros = this.minutos / 5;

    let count = 0;
    this.casilleros = this.casilleros.map((x: BoxTime) => {
      if(count !== numCasilleros) {
        if (x.index >= casilleroInicial.index) {
          x.selectedStart = x.index === casilleroInicial.index;
          x.selectedEnd = x.index === casilleroInicial.index + numCasilleros - 1;
          x.selected = true;
          count++;
        }
      }
      return x;
    });
    console.log('Hora Inicio:', this.util.minutesToHour(this.horaSeleccionada));
    console.log('Hora Fin:', this.util.minutesToHour(this.horaSeleccionada + this.minutos));
  }
  onHover(minuto: number): void{
    this.casilleros = this.casilleros.map(x => { x.hover = false; return x});
    const casilleroInicial = this.casilleros.find(x => x.minuto === minuto);
    // casilleroInicial.hover = true;

    const numCasilleros = this.minutos / 5;

    let count = 0;
    this.casilleros = this.casilleros.map((x: BoxTime) => {
        if(count !== numCasilleros) {
          x.hoverStart = x.index === casilleroInicial.index;
          x.hoverEnd = x.index === casilleroInicial.index + numCasilleros - 1;
          if (x.index >= casilleroInicial.index) {
            x.hover = true;
            count++;
          }
        }
        return x;
    });
  }
  onLeave(): void{
    this.casilleros = this.casilleros.map(x => {
      if(x.hover){
        x.hover = false;
        x.hoverStart = false;
        x.hoverEnd = false;
      }
      return x;
    });
  }
  async onSelect(minuto: number): Promise<void>{
    this.horaSeleccionada = minuto;
    const free = await this.boxFree(this.horaSeleccionada);

    if(!free){
      this.Toast.fire({
        icon: 'error',
        title: 'Seleccione un horario disponible'
      });
      return;
    }
    this.drawSelect(minuto);
    this.Toast.fire({
      icon: 'success',
      title: 'Se selecciono el horario con exito'
    });
  }
  async boxFree(minuto: number): Promise<boolean>{
    const casilleroInicial = await this.casilleros.find(x => x.minuto === minuto);
    const numCasilleros = this.minutos / 5;
    let free = true;

    let count = 0;
    while( free && count !== numCasilleros ){
      // console.log(this.casilleros.length, casilleroInicial.index+count);
      if((casilleroInicial.index+count) === this.casilleros.length){
        free = false;
      }else{
        free = !this.casilleros[casilleroInicial.index+count].reserved;
        count++;
      }
    }

    return free;
  }




  // data
  obtenerZonas(): void{
    this.ldZonas = true;
    this.zonaService.zonaCorporalByGeneroByServicioListar(this.IdGenero, this.IdServicio).subscribe((res: any[]) => {
      // console.log(res);
      this.zonas = res.map(x => {
        const z = new Zona();
        z.id = x.id;
        z.nombre = x.descripcion;
        z.genero = x.genero;
        return z;
      });
      this.ldZonas = false;
    }, error => {
      console.log(error);
      this.ldZonas = false;
    });
  }

  obtenerServicios(): void{
    this.ldServicios = true;
    this.servicioService.listarByEstado(1).subscribe((res) => {
      // console.log(res);
      this.servicios = res;
      this.ldServicios = false;
    }, error => {
      console.log(error);
      this.ldServicios = false;
    });
  }

  obtenerTecnologias(): void{
    this.ldTecnologias = true;
    this.tecnologiaService.listarByServicio(this.IdServicio).subscribe((res) => {
      // console.log(res);
      this.tecnologias = res;
      this.ldTecnologias = false;
    }, error => {
      console.log(error);
      this.ldTecnologias = false;
    });
  }



}


