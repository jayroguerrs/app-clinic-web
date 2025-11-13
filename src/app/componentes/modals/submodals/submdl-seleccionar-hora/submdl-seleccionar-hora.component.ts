import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import Swal from 'sweetalert2';
import {Zona} from "../../../../shared/models/zonas";
import {Cita, CitaDetalle} from "../../../../shared/models/corporal-360/Cita";
import {BoxTime} from "../../../../shared/models/box";
import {Servicio} from "../../../../shared/models/servicio";
import {Tecnologia} from "../../../../shared/models/tecnologia";
import {AuthService} from "../../../../shared/services/auth.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {ZonaCorporalService} from "../../../../shared/services/zona-corporal.service";
import {DatePipe} from "@angular/common";
import { SedeService } from 'src/app/shared/services/sede.service';
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {MaquinaService} from "../../../../shared/services/maquina.service";
import {CitaService} from "../../../../shared/services/cita.service";
import {AccionCita} from "../../../../shared/enumeracion/enums";
import {MaquinaMinutos} from "../../../../shared/models/maquina";
import {SubmdlSeleccionarTecnologiasComponent} from "../submdl-seleccionar-tecnologias/submdl-seleccionar-tecnologias.component";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {Sede} from "../../../../shared/models/sede";
import {Subscription} from "rxjs";
import { ServicioService } from 'src/app/shared/services/corporal360/servicio.service';
import {Maquina, MaquinaSede, MaquinaSedeDisponible} from 'src/app/shared/models/corporal-360/MaquinaSede';
import {MaquinaSede360Service} from "../../../../shared/services/corporal360/maquina-sede360.service";


@Component({
  selector: 'submdl-seleccionar-hora',
  templateUrl: './submdl-seleccionar-hora.component.html',
  styleUrls: ['./submdl-seleccionar-hora.component.scss']
})

export class SubmdlSeleccionarHoraComponent implements OnInit, AfterViewInit, OnDestroy {
  // Inputs
  @Input() IdZona: number = 0;
  @Input() IdServicio: number = 0;
  @Input() IdSede: number = 0;
  @Input() IdMaquina: number = 0;
  @Input() IdTratamiento: number = 0;
  @Input() Fecha: Date = new Date();
  @Input() CitaAgendada: Cita | null = null;
  @Input() CitaDetallesSelected: CitaDetalle[] = [];
  // Outputs
  @Output() OnSelect: EventEmitter<Cita> = new EventEmitter();


  zonasDimissed: Zona[] = [];
  zonasSelected: Zona[] = [];

  citaDetalles: CitaDetalle[] = [];
  citaDetallesSelected: CitaDetalle[] = [];

  zonasSeleccionadas: Zona[] = [];


  frmZonas = new FormControl([]);


  // form

  public submit: EventEmitter<CitaDetalle[]> = new EventEmitter();

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
  sedes: any[] = [];
  maquinas: MaquinaSede[] = [];
  maquinasMinutos: MaquinaMinutos[] = [];



  citaAgendada: Cita | null = null;
  maquinaSelected: number | null = null;



  // form
  frmGroup: FormGroup;

  // loading
  ldZonas = false;
  ldServicios = false;
  ldTecnologias = false;
  ldSedes = false;
  ldMaquinasMinutos = false;

  accionCita = AccionCita;



  servicio: Servicio | null;
  ldServicio = false;
  sbServicio: Subscription;
  sede: Sede | null;
  ldSede = false;
  sbSede: Subscription;
  maquina: Maquina | null;
  ldMaquina = false;
  sbMaquina: Subscription;
  zona: Zona | null;
  ldZona = false;
  sbZona: Subscription;

  // Selected data
  tecnologiaSelected: Tecnologia[] = [];

  ldMaquinaSede = false;
  maquinaSede: MaquinaSede | null = null;

  mdlSeleccionarTecnologia: NgbModalRef;


  inlineDatePicker = new Date();

  constructor(
    public bsModalRef: NgbActiveModal,
    private frmBuilder: FormBuilder,
    private authService: AuthService,
    public util: UtilsService,
    private zonaService: ZonaCorporalService,
    private servicioService: ServicioService,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private maquinaService: MaquinaService,
    private apiMaquinaService: MaquinaSede360Service,
    private citaService: CitaService,
    private modalService: NgbModal
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    console.log('cita', this.CitaAgendada);
  }

  ngAfterViewInit(): void {

    this.obtenerMaquinaSede();
    this.obtenerSede();
    this.obtenerServicio();
    this.obtenerZona();

    this.citaDetallesSelected = [...this.CitaDetallesSelected];
    if(this.citaDetallesSelected.length){
      this.tecnologiaSelected = this.citaDetallesSelected.map(x => {
        const t = new Tecnologia();
        t.id = x.idTecnologia;
        t.nombre = x.tecnologia;
        t.nombreCorto = x.tecnologiaNombreCorto;
        t.minutos = x.minutos;
        return t;
      })
    }

    this.initValues();
    this.drawBoxTime();
    this.drawCitas();


    if(this.CitaAgendada){
      this.maquinaSelected = this.CitaAgendada.idMaquina;
      this.minutos = this.CitaAgendada.minutos;
      this.horaSeleccionada = this.CitaAgendada.hora;
      this.citaService.obtenerHorariosNoDisponible(this.datePipe.transform(this.Fecha,'yyyy-MM-dd'),this.maquinaSelected, this.IdSede, this.authService.getUser().id,this.accionCita.NUEVA, 0 ).subscribe((res: any[]) => {
        this.citasRegistradas = [];
        this.clearBox();
        res.forEach( (x,i) => {

          if(x.minutoInicio >= this.horaInicio){
            const c = new Cita();
            c.hora = x.minutoInicio;
            c.minutos = x.minutoTermino - x.minutoInicio;
            this.citasRegistradas.push(c);
          }

          if((res.length-1) === i){
            // console.log(this.citasRegistradas);
            this.drawCitas();
            this.drawSelect(this.horaSeleccionada);
          }
        });
      });
    }


  }

  ngOnDestroy(): void {
    this.bsModalRef?.close();
    this.sbMaquina?.unsubscribe();
    this.sbSede?.unsubscribe();
    this.sbServicio?.unsubscribe();
  }

  initForm(): void{
    this.frmGroup = this.frmBuilder.group({
      idServicio: new FormControl({value: '', disabled: true}, Validators.required),
      idSede: new FormControl({value: '', disabled: true}, Validators.required),
      // idTecnologia: new FormControl(this.IdTecnologia, Validators.required),
      fecha: new FormControl(null, Validators.required),
    });
  }
  initValues(): void{
    this.frmGroup.patchValue({
      idServicio: parseInt(this.IdServicio.toString(), 10) ? parseInt(this.IdServicio.toString(), 10) : '',
      idSede: parseInt(this.IdSede.toString(), 10) ? parseInt(this.IdSede.toString(), 10) : '',
      fecha: this.datePipe.transform(this.Fecha,'yyyy-MM-dd'),
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


  // selectDetail(detalle: CitaDetalle): void{
  //   if(this.citaDetallesSelected.length){
  //     const z = this.citaDetallesSelected.find(x => x.idZona === detalle.idZona);
  //     if(z){
  //       this.citaDetallesSelected = this.citaDetallesSelected.filter(x => x.idZona !== detalle.idZona);
  //     }else{
  //       this.citaDetallesSelected.push(detalle);
  //     }
  //   }else{
  //     this.citaDetallesSelected.push(detalle);
  //   }
  //   // console.log(this.zonasSelected);
  // }
  // detailtIsSelect(detalle: CitaDetalle): boolean{
  //   if(this.citaDetallesSelected.length){
  //     const z = this.citaDetallesSelected.find(x => x.idZona === detalle.idZona);
  //     return !!z;
  //   }else{
  //     return false;
  //   }
  // }
  // remove(): void{
  //   const details = this.zonasDimissed.filter( (x: Zona) => {
  //     if( this.citaDetallesSelected.map(y => y.idZona).includes(x.id) ){
  //       return x;
  //     }
  //   });
  //
  //   // this.zonas = this.zonas.concat(details);
  //   this.zonasDimissed = this.zonasDimissed.filter( (x: Zona) => {
  //     if( !this.citaDetallesSelected.map(y => y.idZona).includes(x.id) ){
  //       return x;
  //     }
  //   });
  //
  //   this.citaDetalles = this.citaDetalles.filter( (x: CitaDetalle) => {
  //     if( !this.citaDetallesSelected.map(y => y.idZona).includes(x.idZona) ){
  //       return x;
  //     }
  //   });
  //   this.citaDetallesSelected = [];
  //   // console.log(this.zonasDimissed);
  // }





  get f(): any{
    return this.frmGroup.controls;
  }
  async onSubmit(): Promise<void>{
    // Swal.fire({
    //   title: `Confirmar horario`,
    //   text: 'Confirma el horario seleccionado?',
    //   icon: 'question',
    //   buttonsStyling: false,
    //   confirmButtonText: 'Aceptar',
    //   cancelButtonText: 'Cancelar',
    //   showCancelButton: true,
    //   customClass: {
    //     confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
    //     cancelButton: 'btn sbtn btn-light popins mr-2',
    //   },
    //   reverseButtons: true
    // }).then( async (result) => {
    //   if (result.value) {
        // this.submitted = true;
        const val = await this.validar();
        const cita = await this.citaAgendada;
        if(val){
          // console.log('horaseleccionada', cita);
          this.OnSelect.emit(cita);
          this.bsModalRef.close();
        }
    //   }
    // });
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
    // console.log(this.citasRegistradas);
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
  async drawSelect(minuto: number): Promise<void>{
    // console.log('Hora Inicio', this.util.minutesToHour(minuto));
    //  console.log('Hora Fin', this.util.minutesToHour(minuto+this.minutos));

    this.clearSelect();
    const casilleroInicial = this.casilleros.find(x => x.minuto === minuto);
    // casilleroInicial.hover = true;

    const numCasilleros = this.minutos / 5;

    // console.log('casilleors', numCasilleros, this.minutos);

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
    if(!this.minutos){
      this.verTecnologias();
    }

    // console.log('Hora Inicio:', this.util.minutesToHour(this.horaSeleccionada));
    // console.log('Hora Fin:', this.util.minutesToHour(this.horaSeleccionada + this.minutos));

    const c = await new Cita();
    c.horaInicio = this.util.minutesToHour(this.horaSeleccionada);
    c.horaTermino = this.util.minutesToHour(this.horaSeleccionada + this.minutos);
    c.idMaquina = this.maquinaSelected;
    c.minutos = this.minutos;
    c.maquina = this.maquinaSede?.maquina;
    c.fechaCita = this.Fecha;
    c.sede = this.sede?.nombre;
    c.idSede = this.sede?.id;
    c.servicio = this.servicio?.nombre;
    c.idServicio = this.servicio?.id;
    c.detalles = await this.tecnologiaSelected.map((x: Tecnologia) => {
      const m = new CitaDetalle();
      m.idTecnologia = x.id;
      m.tecnologia = x.nombre;
      m.tecnologiaNombreCorto = x.nombreCorto;
      m.minutos = x.minutos;
      m.zona = this.zona?.nombre;
      m.idZona = this.zona?.id;
      m.edited = x.edited;
      m.idUsuarioAgendado = this.authService.getUser().id;
      m.usuarioAgendado = this.authService.getUser().name;
      return m;
    });
    this.citaAgendada = c;

  }
  onHover(minuto: number): void{
    this.casilleros = this.casilleros.map(x => { x.hover = false; return x});
    const casilleroInicial = this.casilleros.find(x => x.minuto === minuto);
    casilleroInicial.hover = true;

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
      this.citaAgendada = null;
      return;
    }
    await this.drawSelect(minuto);
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
  // obtenerZonas(): void{
  //   this.ldZonas = true;
  //   this.zonaService.zonaCorporalByGeneroByServicioListar(this.IdGenero, this.IdServicio).subscribe((res: any[]) => {
  //     // console.log(res);
  //     this.zonas = res.map(x => {
  //       const z = new Zona();
  //       z.id = x.id;
  //       z.nombre = x.descripcion;
  //       z.genero = x.genero;
  //       return z;
  //     });
  //     this.ldZonas = false;
  //   }, error => {
  //     console.log(error);
  //     this.ldZonas = false;
  //   });
  // }
  //
  // obtenerServicios(): void{
  //   this.ldServicios = true;
  //   this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
  //     // console.log(res);
  //     this.servicios = res;
  //     this.ldServicios = false;
  //   }, error => {
  //     console.log(error);
  //     this.ldServicios = false;
  //   });
  // }
  // obtenerSedes(): void{
  //   this.ldSedes = true;
  //   this.sedeService.obtener().subscribe((res: any[]) => {
  //     this.sedes = res;
  //     this.ldSedes = false;
  //   }, error => {
  //     console.log(error);
  //     this.ldSedes = false;
  //   });
  // }
  // obtenerMaquinas(): void{
  //   this.maquinaSedeService.obtenerBySedeByServicio(this.IdSede, this.IdServicio).subscribe((res: MaquinaSede[]) => {
  //     this.maquinas = res;
  //   }, error => {
  //     console.log(error);
  //   });
  // }
  obtenerMinutosMaquina(): void{
    this.ldMaquinasMinutos = true;
    this.maquinaService.obtenerMinutos(this.IdSede, this.datePipe.transform(this.Fecha,'yyyy-MM-dd')).subscribe((res: MaquinaMinutos[]) => {
      this.maquinasMinutos = res;
      this.ldMaquinasMinutos = false;
    }, error => {
      console.log(error);
      this.ldMaquinasMinutos = false;
    });
  }
  obtenerCitasRegistradas(): void{
    this.citaService.obtenerHorariosNoDisponible(this.datePipe.transform(this.Fecha,'yyyy-MM-dd'),this.maquinaSelected, this.IdSede, this.authService.getUser().id,this.accionCita.NUEVA, 0 ).subscribe((res: any[]) => {
      this.citasRegistradas = [];
      this.clearBox();
      res.forEach( (x,i) => {

        if(x.minutoInicio >= this.horaInicio){
          const c = new Cita();
          c.hora = x.minutoInicio;
          c.minutos = x.minutoTermino - x.minutoInicio;
          this.citasRegistradas.push(c);
        }

        if((res.length-1) === i){
          // console.log(this.citasRegistradas);
          this.drawCitas();
        }
      });
    });
  }

  // functions
  clearSelect(): void{
    this.casilleros = this.casilleros.map(x => {
      x.selected = false;
      x.selectedStart = false;
      x.selectedEnd = false;
      return x;
    });
  }
  clearBox(): void{
    this.casilleros = this.casilleros.map(x => {
      x.selected = false;
      x.selectedStart = false;
      x.selectedEnd = false;
      x.reserved = false;
      x.reservedStart = false;
      x.reservedEnd = false;
      return x;
    });
  }
  async validar(): Promise<boolean>{
    if(!this.tecnologiaSelected.length){
      this.util.mostrarToast('Debe seleccionar minimo una tecnología', 'warning');
      return false;
    }
      return true;
  }



  // Events
  onClose(): void {
    this.bsModalRef.close();
  }
  onSelectMaquina(idMaquina: number): void{
    this.maquinaSelected = idMaquina;
    this.citaAgendada = null;
    this.obtenerCitasRegistradas();
  }
  maquinaIsSelect(idMaquina): boolean{
    return this.maquinaSelected === idMaquina;
  }
  obtenerPorcentaje(idMaquina: number): number {
    if (!this.maquinasMinutos.length) {
      return 0;
    }
    const maqMinutos = this.maquinasMinutos.find(m => m.idMaquina === idMaquina);
    if (maqMinutos) {
      return maqMinutos.porcentaje;
    } else {
      return 0;
    }
  }
  verTecnologias(): void{
    this.mdlSeleccionarTecnologia = this.modalService.open(SubmdlSeleccionarTecnologiasComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static', backdropClass: 'bg-transparent' });
    this.mdlSeleccionarTecnologia.componentInstance.IdServicio = parseInt(this.IdServicio.toString(),10);
    this.mdlSeleccionarTecnologia.componentInstance.IdTratamiento = this.IdTratamiento;
    this.mdlSeleccionarTecnologia.componentInstance.TecnologiasSelected = this.tecnologiaSelected;
    this.mdlSeleccionarTecnologia.componentInstance.TecnologiasActived = this.maquinaSede?.tecnologias;
    this.mdlSeleccionarTecnologia.componentInstance.OnSelect.subscribe(async (x: Tecnologia[]) => {

      this.tecnologiaSelected = x;
      this.minutos = await this.tecnologiaSelected.map(item => item.minutos).reduce((prev, curr) => prev + curr, 0);

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
        this.util.mostrarToast('Se actualizo el horario con exito','success');
      }
    });
  }

  // DATA
  obtenerServicio(): void{
    this.ldServicio = true;
    this.sbServicio = this.servicioService.buscarById(this.IdServicio).subscribe((res: Servicio | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        this.util.mostrarToast(res.message,'error');
      }else{
        this.servicio = res;
      }
      this.ldServicio = false;
    }, error => {
      console.log(error);
      this.util.mostrarToast('Ocurrio un error al intentar obtener el servicio','error');
      this.ldServicio = false;
    })
  }

  obtenerSede(): void{
    this.ldSede = true;
    this.sbSede = this.sedeService.obtenerById(this.IdSede).subscribe((res: any) => {
      if(res){
        const m = new Sede();
        m.id = res.idSede;
        m.nombre = res.nombre;
        this.sede = m;
      }
      this.ldSede = false;
    }, error => {
      console.log(error);
      this.util.mostrarToast('Ocurrio un error al intentar obtener la sede','error');
      this.ldSede = false;
    })
  }

  obtenerMaquina(): void{
    this.ldMaquina = true;
    this.sbMaquina = this.maquinaService.obtenerById(this.maquinaSede?.idMaquina).subscribe((res: any) => {
      if(res){
        const m = new Maquina();
        m.id = res.id;
        m.nombre = res.descripcion;
        m.idEstado = res.idEstado;
        this.maquina = m;
      }
      this.ldMaquina = false;
    }, error => {
      console.log(error);
      this.util.mostrarToast('Ocurrio un error al intentar obtener la sede','error');
      this.ldMaquina = false;
    })
  }

  obtenerZona(): void{
    this.ldZona = true;
    this.sbZona = this.zonaService.obtenerById(this.IdZona).subscribe((res: any) => {
      // console.log('zona', res);
      if(res){
        const m = new Zona();
        m.id = res.id;
        m.nombre = res.descripcion;
        this.zona = m;
      }
      this.ldZona = false;
    }, error => {
      console.log(error);
      this.util.mostrarToast('Ocurrio un error al intentar obtener la zona','error');
      this.ldZona = false;
    })
  }

  obtenerMaquinaSede(): void{
    const idMaquina = this.CitaAgendada ? this.CitaAgendada.idMaquina : this.IdMaquina;

    this.ldMaquinaSede = true;
    this.apiMaquinaService.searchByIdMaquina(idMaquina, this.datePipe.transform(this.Fecha,'yyyy-MM-dd'), this.IdServicio, this.IdSede).subscribe((res: MaquinaSede) => {
      this.maquinaSede = res;
      // this.tecnologiaSelected = res.tecnologias;
      this.onSelectMaquina(this.maquinaSede?.idMaquina);
      this.ldMaquinaSede = false;
    }, error => {
      console.log(error);
      this.ldMaquinaSede = false;
    })
  }


}


