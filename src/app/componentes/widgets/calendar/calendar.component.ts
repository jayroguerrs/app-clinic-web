import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {Cita, CitaDetalle, CronogramaCita_Cita} from "../../../shared/models/corporal-360/Cita";
import {DatePipe} from "@angular/common";
import {ParametrosCronograma} from "../../../shared/models/corporal-360/Parametros";
import {SubmdlCronogramaCitaComponent} from "../../modals/submodals/submdl-cronograma-cita/submdl-cronograma-cita.component";
import {AccionCita, AccionCronograma, CitaEstado} from "../../../shared/enumeracion/enums";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {MaquinaSede360Service} from "../../../shared/services/corporal360/maquina-sede360.service";
import {MaquinaSede, MaquinaSedeDisponible} from "../../../shared/models/corporal-360/MaquinaSede";
import {BehaviorSubject, Subscription} from "rxjs";
import {SubmdlMaquinaSedeComponent} from "../../modals/submodals/submdl-maquina-sede/submdl-maquina-sede.component";
import {SubmdlSeleccionarHoraComponent} from "../../modals/submodals/submdl-seleccionar-hora/submdl-seleccionar-hora.component";
import {CronogramaCitaService} from "../../../shared/services/corporal360/cronograma-cita.service";
import {animate, style, transition, trigger} from '@angular/animations';

const DAY_MS = 60 * 60 * 24 * 1000;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('slideFromBottom', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('300ms {{delay}}ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ], { params: { delay: 10 } })
    ])
  ]
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @ViewChild('opciones') opciones : any;


  @Input() IdCliente: number = 0;
  @Input() IdTipoCliente: number = 0;
  @Input() IdSede: number = 0;
  @Input() IdServicio: number = 0;
  @Input() IdGenero: number = 0;
  @Input() IdZona: number = 0;
  @Input() Sedes: any[] = [];
  @Input() Parametros: ParametrosCronograma;
  @Input() IdPreferente: number = 0;
  @Input() IdTratamiento: number = 0;

  @Input() IdCita: number = 0;
  @Input() AccionCita: number = 0;

  dates: Array<CalendarDay>;
  days = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  date = new Date();
  @Output() selected = new EventEmitter();
  @Output() onSelectDate = new EventEmitter<Date>();
  @Output() onChangeMonth = new EventEmitter<any>();
  @Output() onListarCitas = new EventEmitter<CronogramaCita_Cita[]>();

  changeMonth = new BehaviorSubject<CalendarDay[]>([]);

  _citas = new BehaviorSubject<CronogramaCita_Cita[]>([]);
  citas: CronogramaCita_Cita[] = [];
  citaSelected: CronogramaCita_Cita | null;

  today = new Date();
  accionCita = AccionCita;
  accionCronograma = AccionCronograma;
  estadoCita = CitaEstado;


  ldDisponible = false;
  sbDisponible : Subscription;
  disponible: MaquinaSedeDisponible[] = [];

  ldCitas = false;
  sbCitas: Subscription;

  // modales
  mdlCitaRef: NgbModalRef;
  mdlMaquinaSedeRef: NgbModalRef;
  mdlSeleccionarHoraRef: NgbModalRef;

  ele: any;
  pos = { top: 0, left: 0, x: 0, y: 0 };
  clickActive = true;


  _openModal: boolean;

  constructor(
    public util: UtilsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private maquinaSedeService: MaquinaSede360Service,
    private api: CronogramaCitaService
  ) {
    this.dates = this.getCalendarDays(this.date);
    this._openModal = false;
  }

  ngOnInit(): void {
    this.changeMonth.subscribe((res) => {
      if(parseInt(this.IdServicio.toString(), 10) && parseInt(this.IdSede.toString(), 10)){
        this.obtenerDisponibles( parseInt(this.IdServicio.toString(), 10), parseInt(this.IdSede.toString(), 10) );
      }
    });

  }

  ngAfterViewInit(): void {
    this.obtenerCitas();
  }

  ngOnDestroy(): void {
    this.sbCitas?.unsubscribe();
    this.sbDisponible?.unsubscribe();
    this.mdlCitaRef?.close();
    this.mdlMaquinaSedeRef?.close();
    this.mdlSeleccionarHoraRef?.close();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.IdTipoCliente && changes.IdTipoCliente.currentValue) {
      this.IdTipoCliente = changes.IdTipoCliente.currentValue;
      console.log('idTipoCliente', this.IdTipoCliente);
    }
  }


  // Events
  mouseDownHandler = (e, element: HTMLElement) => {
    e.preventDefault();
    e.stopPropagation();
    this.ele = element;
    this.pos = {
      // The current scroll
      left: this.ele.scrollLeft,
      top: this.ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };
    this.ele.style.cursor = 'grabbing !important';
    this.ele.style.userSelect = 'none';

    console.info('init drag');

    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  };
  mouseMoveHandler =  (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.clickActive = false;
    // How far the mouse has been moved
    const dx = e.clientX - this.pos.x;
    const dy = e.clientY - this.pos.y;

    // Scroll the element
    this.ele.scrollTop = this.pos.top - dy;
    this.ele.scrollLeft = this.pos.left - dx;
  };
  mouseUpHandler = () => {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);

    this.ele.style.cursor = 'grab';
    this.ele.style.removeProperty('user-select');
    setTimeout(() => {
      this.clickActive = true;
    }, 10)
  };



  setMonth(inc) {
    const [year, month] = [this.date.getFullYear(), this.date.getMonth()];
    this.date = new Date(year, month + inc, 1);
    this.dates = this.getCalendarDays(this.date);
    this.onChangeMonth.emit(this.getCalendarDays(this.date));
    this.changeMonth.next(this.getCalendarDays(this.date));
  }

  isSameMonth(date) {
    return date.getMonth() === this.date.getMonth();
  }

  isToday(date: Date): boolean{
    return this.datePipe.transform(date,'dd-MM-yyyy') === this.datePipe.transform(this.today,'dd-MM-yyyy');
  }

  private getCalendarDays(date = new Date) {
    const calendarStartTime =
      this.getCalendarStartDay(date).getTime()
      + 60 * 60 * 1000; /* add 2 hours for day light saving time adjustment */
    // + 60 * 60 * 1 * 1000; /* add 2 hours for day light saving time adjustment */

    return this.range(0, 41)
      .map(num => {
        const m = new CalendarDay()
        m.fecha = new Date(calendarStartTime + DAY_MS * num);
        return m;
      });
  }

  private getCalendarStartDay(date = new Date) {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const firstDayOfMonth = new Date(year, month, 1).getTime();

    return this.range(1,7)
      .map(num => new Date(firstDayOfMonth - DAY_MS * num))
      .find(dt => dt.getDay() === 1)
  }

  private range(start, end, length = end - start + 1) {
    return Array.from({ length }, (_, i) => start + i)
  }


  // Events
  selectDate(date: Date): void{
    if(!this.isSameMonth(date)){ return; }
    this.onSelectDate.emit(date);
  }

  viewMachines(fecha: Date): void{
    if(!this.isSameMonth(fecha)){ return; }
    // console.log(fecha);

    if(!parseInt(this.IdZona.toString(), 10)){
      this.util.mostrarToast('Seleccionar la zona','warning');
      return;
    }else if(!parseInt(this.IdServicio.toString(), 10)){
      this.util.mostrarToast('Seleccionar el servicio','warning');
      return;
    }else if(!parseInt(this.IdSede.toString(), 10)){
      this.util.mostrarToast('Seleccionar la sede','warning');
      return;
    }

    this.mdlMaquinaSedeRef = this.modalService.open(SubmdlMaquinaSedeComponent, {size: 'fullscreen max-w-1000px', windowClass: 'smodal popins fullscreen modal-right', keyboard: true, backdrop: true });
    this.mdlMaquinaSedeRef.componentInstance.IdServicio = this.IdServicio;
    this.mdlMaquinaSedeRef.componentInstance.IdSede = this.IdSede;
    this.mdlMaquinaSedeRef.componentInstance.Fecha = fecha;

    this.mdlMaquinaSedeRef.componentInstance.OnSelectMachine.subscribe((res: MaquinaSede | null) => {

      const parametros = {...this.Parametros};
      parametros.citaAccionActual = this.accionCita.NUEVA;
      this.mdlSeleccionarHoraRef = this.modalService.open(SubmdlSeleccionarHoraComponent, {size: 'fullscreen max-w-1000px', windowClass: 'smodal popins fullscreen modal-right', keyboard: true, backdrop: 'static', backdropClass: 'bg-transparent' });

      this.mdlSeleccionarHoraRef.componentInstance.IdCliente = this.IdCliente;
      this.mdlSeleccionarHoraRef.componentInstance.IdServicio = this.IdServicio;
      this.mdlSeleccionarHoraRef.componentInstance.IdTratamiento = this.IdTratamiento
      // modal.componentInstance.IdGenero = this.IdGenero;
      this.mdlSeleccionarHoraRef.componentInstance.IdZona = this.IdZona;
      this.mdlSeleccionarHoraRef.componentInstance.IdSede = this.IdSede;
      this.mdlSeleccionarHoraRef.componentInstance.IdMaquina = res.idMaquina;
      // modal.componentInstance.MaquinaSede = res;
      this.mdlSeleccionarHoraRef.componentInstance.Fecha = fecha;
      // modal.componentInstance.Porcentaje = res.porcentaje;
      this.mdlSeleccionarHoraRef.componentInstance.Sedes = this.Sedes;
      this.mdlSeleccionarHoraRef.componentInstance.Parametros = parametros;
      this.mdlSeleccionarHoraRef.componentInstance.OnSelect.subscribe((res: Cita | null) => {


        this.mdlCitaRef = this.modalService.open(SubmdlCronogramaCitaComponent, {size: 'fullscreen max-w-1000px', windowClass: 'smodal popins fullscreen modal-right', keyboard: true, backdrop: 'static', backdropClass: 'bg-transparent' });
        this.mdlCitaRef.componentInstance.IdCliente = this.IdCliente;
        this.mdlCitaRef.componentInstance.IdTipoCliente = this.IdTipoCliente;
        this.mdlCitaRef.componentInstance.IdServicio = this.IdServicio;
        this.mdlCitaRef.componentInstance.IdGenero = this.IdGenero;
        this.mdlCitaRef.componentInstance.IdZona = this.IdZona;
        this.mdlCitaRef.componentInstance.IdSede = this.IdSede;
        this.mdlCitaRef.componentInstance.Fecha = fecha;
        this.mdlCitaRef.componentInstance.Sedes = this.Sedes;
        this.mdlCitaRef.componentInstance.Parametros = parametros;
        this.mdlCitaRef.componentInstance.Cita = res;
        this.mdlCitaRef.componentInstance.IdPreferente = this.IdPreferente;


        this.mdlCitaRef.componentInstance.Detalles = [...res.detalles];
        this.mdlCitaRef.componentInstance.Created.subscribe((res: Cita) => {

          this.mdlMaquinaSedeRef.close();
          this.obtenerCitas();
          if(parseInt(this.IdServicio.toString(), 10) && parseInt(this.IdSede.toString(), 10)){
            this.obtenerDisponibles( parseInt(this.IdServicio.toString(), 10), parseInt(this.IdSede.toString(), 10) );
          }

        });

      });

    });
  }

  addCita(fecha: Date): void{
    if(!this.isSameMonth(fecha)){ return; }
    // console.log(date);

    if(!parseInt(this.IdZona.toString(), 10)){
      this.util.mostrarToast('Seleccionar la zona','warning');
      return;
    }else if(!parseInt(this.IdServicio.toString(), 10)){
      this.util.mostrarToast('Seleccionar el servicio','warning');
      return;
    }else if(!parseInt(this.IdSede.toString(), 10)){
      this.util.mostrarToast('Seleccionar la sede','warning');
      return;
    }

    // if(boxDay.cita){
    //   this.modalCita = boxDay.cita.idCita.toString().padStart(6,'0');
    //   this.modalFecha = this.datePipe.transform(boxDay.date, 'dd-MM-yyyy');
    //   this.modalService.open(this.opciones, {size: ' max-w-300px mx-auto', windowClass: 'smodal round popins', keyboard: false, centered: true });
    //   return;
    // }

    const parametros = {...this.Parametros};
    parametros.citaAccionActual = this.accionCita.NUEVA;

    // const modal = this.modalService.open(MdlCronogramaCitaComponent, {size: 'fullscreen', windowClass: 'smodal  popins fullscreen', keyboard: false, });
    this.mdlMaquinaSedeRef = this.modalService.open(SubmdlMaquinaSedeComponent, {size: 'fullscreen max-w-1000px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static' });
    this.mdlMaquinaSedeRef.componentInstance.IdCliente = this.IdCliente;
    this.mdlMaquinaSedeRef.componentInstance.IdServicio = this.IdServicio;
    this.mdlMaquinaSedeRef.componentInstance.IdGenero = this.IdGenero;
    this.mdlMaquinaSedeRef.componentInstance.IdZona = this.IdZona;
    this.mdlMaquinaSedeRef.componentInstance.IdSede = this.IdSede;
    this.mdlMaquinaSedeRef.componentInstance.Fecha = fecha;
    this.mdlMaquinaSedeRef.componentInstance.Sedes = this.Sedes;
    this.mdlMaquinaSedeRef.componentInstance.Parametros = parametros;
    //
    // const detalles: CitaDetalle[] = [];
    // const detalle = new CitaDetalle();
    // detalle.idZona = parseInt(this.IdZona.toString(), 10);
    // detalle.idUsuarioAgendado = this.usuarioService.UsuarioActual.idUsuario;
    // detalle.usuarioAgendado = this.usuarioService.UsuarioActual.nombre;
    // detalles.push(detalle);
    //
    // modal.componentInstance.Detalles = detalles;
    // modal.componentInstance.Cita.subscribe((res: Cita | null) => {
    //   // boxDay.cita = res;
    //   console.log(res);
    //   this.citas.push(res);
    //
    //   this.citas.sort((a,b) => a.fechaCita.getTime() - b.fechaCita.getTime());
    // });

  }


  selectCita(cita: CronogramaCita_Cita): void{
    if(!this.clickActive){return;}
    this.citaSelected = cita;
    this.modalService.open(this.opciones, {size: ' max-w-300px mx-auto', windowClass: 'smodal round popins', keyboard: false, centered: true });
  }
  citaIsSelected(cita: CronogramaCita_Cita): boolean{
    return this.citaSelected?.id === cita.id;
  }


  // Data
  obtenerDisponibles(idServicio: number, idSede: number): void{
    if(this.Parametros.accionActual === this.accionCronograma.NUEVA){return;}
    const fechas = this.dates.filter(x => this.isSameMonth(x.fecha));
    const fechaInicio = fechas[0].fecha;
    const fechaFin = fechas[fechas.length - 1].fecha;

    this.sbDisponible?.unsubscribe();

    this.ldDisponible = true;
    this.sbDisponible = this.maquinaSedeService.searchAvailable(this.datePipe.transform(fechaInicio,'yyyy-MM-dd',''), this.datePipe.transform(fechaFin,'yyyy-MM-dd',''), idServicio, idSede).subscribe((res: MaquinaSedeDisponible[]) => {
      this.disponible = res;
      this.dates.forEach(x => {
        x.porcentaje = res.find((y: MaquinaSedeDisponible) => this.datePipe.transform(x.fecha,'yyyy-MM-dd') === this.datePipe.transform(y.fecha,'yyyy-MM-dd') )?.porcentaje;
      });
      this.ldDisponible = false;
    }, error => {
      console.log(error);
      this.ldDisponible = false;
    })
  }
  obtenerCitas(): void{
    if(this.Parametros.accionActual === AccionCronograma.NUEVA){
      this.onListarCitas.emit([]);
      return;
    }
    this.ldCitas = true;
    this.api.listCitas(this.Parametros.id).subscribe((res: CronogramaCita_Cita[]) => {
      this.citas = res;
      this.onListarCitas.emit(res);
      this._citas.next(res);
      this.ldCitas = false;


      if(this.IdCita > 0 && !this._openModal){
        this.citaSelected = res.find(c => c.id === this.IdCita);
        this.openCita(this.AccionCita);
      }


    }, error => {
      console.log(error);
      this.ldCitas = false;
    })
  }
  listarTecnologias(detalles: CitaDetalle[]): string{
    return detalles.length ? detalles.map(x => x.tecnologiaNombreCorto).join(' , ') : '';
  }
  totalMinutos(detalles: CitaDetalle[]): number{
    return detalles.length ? detalles.map(x => x.minutos).reduce((x,y) => x + y , 0) : 0;
  }

  // Events
  openCita(accion: AccionCita): void{
    const parametros = {...this.Parametros};
    parametros.citaAccionActual = accion;
    this.mdlCitaRef = this.modalService.open(SubmdlCronogramaCitaComponent, {size: 'fullscreen max-w-1000px', windowClass: 'smodal popins fullscreen modal-right', keyboard: true, backdrop: 'static' });
    this.mdlCitaRef.componentInstance.IdCliente = this.IdCliente;
    this.mdlCitaRef.componentInstance.IdServicio = this.IdServicio;
    this.mdlCitaRef.componentInstance.IdGenero = this.IdGenero;
    this.mdlCitaRef.componentInstance.IdZona = this.IdZona;
    this.mdlCitaRef.componentInstance.IdSede = this.IdSede;
    this.mdlCitaRef.componentInstance.Fecha = this.citaSelected?.fecha;
    this.mdlCitaRef.componentInstance.Sedes = this.Sedes;
    this.mdlCitaRef.componentInstance.Parametros = parametros;
    this.mdlCitaRef.componentInstance.IdCita = this.citaSelected?.id;
    this.mdlCitaRef.componentInstance.OnChangeStatus.subscribe((res: boolean) => {
      if(res){
        this.obtenerCitas();
        if(parseInt(this.IdServicio.toString(), 10) && parseInt(this.IdSede.toString(), 10)){
          this.obtenerDisponibles( parseInt(this.IdServicio.toString(), 10), parseInt(this.IdSede.toString(), 10) );
        }
      }
    });
    this.mdlCitaRef.componentInstance.OnEdited.subscribe((res: boolean) => {
      if(res){
        this.obtenerCitas();
        if(parseInt(this.IdServicio.toString(), 10) && parseInt(this.IdSede.toString(), 10)){
          this.obtenerDisponibles( parseInt(this.IdServicio.toString(), 10), parseInt(this.IdSede.toString(), 10) );
        }
      }
    });
  }

}

class CalendarDay{
  public fecha: Date | null;
  public loading: boolean;
  public porcentaje: number;
  public data: any | null;
  constructor() {
    this.porcentaje = 0;
    this.fecha = null;
    this.loading = false;
    this.data = null;
  }
}
