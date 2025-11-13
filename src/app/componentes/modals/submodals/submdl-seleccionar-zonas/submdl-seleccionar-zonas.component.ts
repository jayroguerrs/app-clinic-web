import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Zona} from "../../../../shared/models/zonas";
import {CitaDetalle} from "../../../../shared/models/corporal-360/Cita";
import {GroupButtonComponent} from "../../../group-button/group-button.component";
import {AuthService} from "../../../../shared/services/auth.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Servicio} from "../../../../shared/models/servicio";
import {ServicioService} from "../../../../shared/services/servicio.service";
import {ZonaService} from "../../../../corporal360/shared/service/zona.service";
import {ZonaCorporalService} from "../../../../shared/services/zona-corporal.service";

@Component({
  selector: 'submdl-seleccionar-zonas',
  templateUrl: './submdl-seleccionar-zonas.component.html',
  styleUrls: ['./submdl-seleccionar-zonas.component.scss']
})


export class SubmdlSeleccionarZonasComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() IdGenero: number = 0;
  @Input() IdZona: number = 0;
  @Input() IdServicio: number = 0;
  @Input() IdSede: number = 0;
  @Input() Fecha: Date = new Date();
  @Output() OnClose: EventEmitter<any> = new EventEmitter();


  idServicio: FormControl;


  ldZonas = false;
  zonas: Zona[] = [];
  zonasDimissed: Zona[] = [];
  zonasSelected: Zona[] = [];

  citaDetalles: CitaDetalle[] = [];
  citaDetallesSelected: CitaDetalle[] = [];

  zonasSeleccionadas: Zona[] = [];

  frmZonas = new FormControl([]);

  servicios: Servicio[] = [];
  ldServicios = false;

  // form
  formGroup: FormGroup;

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

  constructor(
    private frmBuilder: FormBuilder,
    private authService: AuthService,
    public bsModalRef: NgbActiveModal,
    private servicioService: ServicioService,
    private zonaService: ZonaCorporalService
  ) {
    this.idServicio = new FormControl('', Validators.required);
    this.idServicio.valueChanges.subscribe((res) => {
      this.zonas = [];
      if (res) {
        console.log(res);
        this.listarZonasByServicioByGenero(parseInt(res, 10), parseInt(this.IdGenero.toString(), 10));
      }
    });
  }

  ngOnInit(): void {
    this.listarServicios();
    // this.initValues();

  }

  ngAfterViewInit(): void {
    // this.min._current.subscribe((res: number) => {
    //   this.minutos = res;
    // });
  }

  ngOnDestroy(): void {
  }


  // getters

  // functions
  select(zona: Zona): void {
    if (this.zonasSelected.length) {
      const z = this.zonasSelected.find(x => x.id === zona.id);
      if (z) {
        this.zonasSelected = this.zonasSelected.filter(x => x.id !== zona.id);
      } else {
        this.zonasSelected.push(zona);
      }
    } else {
      this.zonasSelected.push(zona);
    }
    // console.log(this.zonasSelected);
  }

  isSelect(zona: Zona): boolean {
    if (this.zonasSelected.length) {
      const z = this.zonasSelected.find(x => x.id === zona.id);
      return !!z;
    } else {
      return false;
    }
  }

  add(): void {
    this.zonasDimissed = !this.zonasDimissed.length ? this.zonasSelected : this.zonasDimissed.concat(this.zonasSelected);
    // console.log(this.zonasDimissed, 'dddd');
    const z = this.zonas.filter((x: Zona) => {
      if (!this.zonasSelected.map(y => y.id).includes(x.id)) {
        return x;
      }
    });
    // this.zonas = z;

    // Agregar los detalles
    this.zonasSelected.map(x => {
      const detalle = new CitaDetalle();
      // detalle.idServicio = parseInt(this.f.idServicio.value, 10);
      // detalle.servicio = this.servicios.find(x => x.id === parseInt(this.f.idServicio.value, 10))?.nombre;
      detalle.minutos = x.minutos;
      detalle.idZona = x.id;
      detalle.zona = x.descripcion;
      this.citaDetalles.push(detalle);
    });

    this.zonasSelected = [];

    // console.log(this.zonasDimissed);
  }

  isDimissed(zona: Zona): boolean {
    return this.zonasDimissed.map(x => x.id).includes(zona.id);
  }


  selectDetail(detalle: CitaDetalle): void {
    if (this.citaDetallesSelected.length) {
      const z = this.citaDetallesSelected.find(x => x.idZona === detalle.idZona);
      if (z) {
        this.citaDetallesSelected = this.citaDetallesSelected.filter(x => x.idZona !== detalle.idZona);
      } else {
        this.citaDetallesSelected.push(detalle);
      }
    } else {
      this.citaDetallesSelected.push(detalle);
    }
    // console.log(this.zonasSelected);
  }

  detailtIsSelect(detalle: CitaDetalle): boolean {
    if (this.citaDetallesSelected.length) {
      const z = this.citaDetallesSelected.find(x => x.idZona === detalle.idZona);
      return !!z;
    } else {
      return false;
    }
  }

  remove(): void {
    const details = this.zonasDimissed.filter((x: Zona) => {
      if (this.citaDetallesSelected.map(y => y.idZona).includes(x.id)) {
        return x;
      }
    });

    // this.zonas = this.zonas.concat(details);
    this.zonasDimissed = this.zonasDimissed.filter((x: Zona) => {
      if (!this.citaDetallesSelected.map(y => y.idZona).includes(x.id)) {
        return x;
      }
    });

    this.citaDetalles = this.citaDetalles.filter((x: CitaDetalle) => {
      if (!this.citaDetallesSelected.map(y => y.idZona).includes(x.idZona)) {
        return x;
      }
    });
    this.citaDetallesSelected = [];
    // console.log(this.zonasDimissed);
  }


  get f(): any {
    return this.formGroup.controls;
  }

  onSubmit(): void {

  }

  // Events
  onClose(): void {
    this.bsModalRef.close();
  }

  // Data
  listarServicios(): void{
    this.ldServicios = true;
    this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
      this.servicios = res;
      this.ldServicios = false;
    }, error => {
      console.log(error);
      this.ldServicios = false;
    });
  }
  listarZonasByServicioByGenero(idServicio: number, idGenero: number): void{
    this.ldZonas = true;
    this.zonaService.zonaCorporalByGeneroByServicioListar(idGenero, idServicio).subscribe((res: any[]) => {
      const collection: Zona[] = [];
      res.forEach(x => {
        const model = new Zona();
        model.id = x.id;
        model.descripcion = x.descripcion;
        model.descripcionLarga = x.descripcionLarga;
        model.idGenero = x.idGenero;
        model.precioBase = x.precioBase;
        model.precioDescuento = x.precioDescuento;
        model.duracion = x.duracion;
        collection.push(model);
      });
      this.zonas = collection;
      this.ldZonas = false;
    }, error => {
      console.log(error);
      this.ldZonas = false;
    });
  }

}


