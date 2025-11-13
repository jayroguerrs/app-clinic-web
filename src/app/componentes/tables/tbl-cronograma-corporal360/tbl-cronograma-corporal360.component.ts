import {Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

import Swal from "sweetalert2";
import {BoxDay, BoxWeek} from "../../../shared/models/box";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {Cita, CitaDetalle, CronogramaSemana} from "../../../shared/models/corporal-360/Cita";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {ParametrosCronograma} from "../../../shared/models/corporal-360/Parametros";
import {AccionCita, AccionCronograma} from "../../../shared/enumeracion/enums";
import {Cita360Service} from "../../../shared/services/corporal360/cita360.service";
import {DatePipe} from "@angular/common";
import {CronogramaCitaService} from "../../../shared/services/corporal360/cronograma-cita.service";
import {SubmdlCronogramaCitaComponent} from "../../modals/submodals/submdl-cronograma-cita/submdl-cronograma-cita.component";
import { CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-tbl-cronograma-corporal360',
  templateUrl: './tbl-cronograma-corporal360.component.html',
  styleUrls: ['./tbl-cronograma-corporal360.component.scss']
})
export class TblCronogramaCorporal360Component implements OnInit, OnDestroy {

  @ViewChild('opciones') opciones : any;

  @Input() IdCliente: number = 0;
  @Input() IdSede: number = 0;
  @Input() IdServicio: number = 0;
  @Input() IdGenero: number = 0;
  @Input() IdZona: number = 0;
  @Input() Sedes: any[] = [];
  @Input() Parametros: ParametrosCronograma;


  /****************/
  weeks: BoxWeek[] = [];
  semanas: CronogramaSemana[] = [];
  submitted: boolean = false;
  loadingSubmitted: boolean = false;



  ldSemanas = false;


  /*** Modal ***/
  modalCita = '';
  modalFecha = '';
  citaSelected : Cita | null = null;
  diaSelected : BoxDay | null = null;

  accionCita = AccionCita;
  accionCronograma = AccionCronograma;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap',
    locale: esLocale,
    contentHeight: 400
  };

  constructor(
    private modalService: NgbModal,
    public utilService: UtilsService,
    private usuarioService: UsuarioService,
    private cita360Service: Cita360Service,
    private cronogramaCitaService: CronogramaCitaService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  async ngOnChanges(changes) {
    if (changes['Parametros']){
      if(this.Parametros.accionActual === AccionCronograma.VER){
        // await this.obtenerSemanas();
      }
    }
  }

  // form

  // data


  /*****************************/
  // addWeek(fechaDesde: Date, fechaHasta: Date): void{
  //
  //   this.submittedWeek = true;
  //   if(this.frmRange.invalid){
  //     this.Toast.fire({
  //       icon: 'error',
  //       title: 'Debe seleccionar el rango de fecha'
  //     });
  //     return;
  //   }
  //
  //   const fechaDesde = new Date(this.datePipe.transform(this.fw.fechaDesde.value,'short'));
  //   const fechaHasta = new Date(this.datePipe.transform(this.fw.fechaHasta.value,'short'));
  //
  //   if(fechaDesde.getDay() !== 1){
  //     this.Toast.fire({
  //       icon: 'error',
  //       title: 'La semana debe comenzar con un día Lunes'
  //     });
  //     return;
  //   }
  //
  //   if(fechaHasta.getDay() !== 0){
  //     this.Toast.fire({
  //       icon: 'error',
  //       title: 'La semana debe terminar con un día Domingo'
  //     });
  //     return;
  //   }
  //
  //   const lastDate = new Date(fechaDesde.setDate(fechaDesde.getDate() + 6));
  //   if( this.datePipe.transform(lastDate, 'yyyy-MM-dd') !== this.datePipe.transform(fechaHasta, 'yyyy-MM-dd') ){
  //     this.Toast.fire({
  //       icon: 'error',
  //       title: 'Los días deben ser de la misma semana'
  //     });
  //     return;
  //   }
  //
  //
  //   // Verificar si ya existe la semana seleccionada
  //   const encontrado = this.weeks.length ?  this.weeks.find((x: BoxWeek[]) => this.datePipe.transform(x[0].date, 'yyyy-MM-dd') === this.datePipe.transform(this.fw.fechaDesde.value, 'yyyy-MM-dd') ) : null;
  //   console.log(encontrado);
  //   if(encontrado){
  //     this.Toast.fire({
  //       icon: 'error',
  //       title: 'La semana ya se encuentra registrada'
  //     });
  //     return;
  //   }
  //
  //   // console.log(this.datePipe.transform(this.fw.fechaDesde.value,'full'), this.datePipe.transform(this.fw.fechaHasta.value,'full'));
  //
  //   const week : BoxWeek[] = [];
  //   let loop = new Date(this.datePipe.transform(this.fw.fechaDesde.value,'short'));
  //   while (loop <= new Date(this.datePipe.transform(this.fw.fechaHasta.value,'short'))) {
  //
  //     // console.log(loop);
  //     const day = new BoxWeek();
  //     day.date = new Date(loop);
  //     week.push(day);
  //     let newDate = loop.setDate(loop.getDate() + 1);
  //     loop = new Date(newDate);
  //
  //   }
  //   this.weeks.push(week);
  //
  //   // console.log(this.weeks);
  //
  //   dropdownWeek.hide();
  //
  // }
  pushWeek(days: BoxDay[], saved: boolean = false): void{
    this.semanas.push({inicio: days[0].date, fin: days[days.length-1].date});

    const sem = new BoxWeek();
    sem.dias = days;
    sem.saved = saved;
    this.weeks.push(sem);
    console.log(this.weeks);
    this.weeks.sort((a,b) => a.dias[0].date.getTime() - b.dias[0].date.getTime());
    console.log(this.weeks);
  }
  trashWeek(index: number): void{
    Swal.fire({
      title: `Eliminar semana #${index+1}`,
      text: 'Desea eliminar la semana seleccionada?',
      icon: 'question',
      buttonsStyling: false,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary',
      }
    }).then( (result) => {
      if (result.value) {
        this.weeks = this.weeks.filter((_, i) => i !== index);
        this.semanas = this.semanas.filter((_, i) => i !== index);
        this.weeks = this.weeks.sort((a,b) => a.dias[0].date.getTime() - b.dias[0].date.getTime());
        console.log(this.weeks, this.semanas);
      }
    });
  }
  onSelectSchedule(boxDay: BoxDay): void{

    if(!parseInt(this.IdZona.toString(), 10)){
      this.utilService.mostrarToast('Seleccionar la zona','warning');
      return;
    }else if(!parseInt(this.IdServicio.toString(), 10)){
      this.utilService.mostrarToast('Seleccionar el servicio','warning');
      return;
    }else if(!parseInt(this.IdSede.toString(), 10)){
      this.utilService.mostrarToast('Seleccionar la sede','warning');
      return;
    }

    this.citaSelected = boxDay.cita ? boxDay.cita : null;
    this.diaSelected = boxDay;

    if(boxDay.cita){
      this.modalCita = boxDay.cita.idCita.toString().padStart(6,'0');
      this.modalFecha = this.datePipe.transform(boxDay.date, 'dd-MM-yyyy');
      this.modalService.open(this.opciones, {size: ' max-w-300px mx-auto', windowClass: 'smodal round popins', keyboard: false, centered: true });
      return;
    }

    const parametros = {...this.Parametros};
    parametros.citaAccionActual = this.accionCita.NUEVA;

    // const modal = this.modalService.open(MdlCronogramaCitaComponent, {size: 'fullscreen', windowClass: 'smodal  popins fullscreen', keyboard: false, });
    const modal = this.modalService.open(SubmdlCronogramaCitaComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static' });
    modal.componentInstance.IdCliente = this.IdCliente;
    modal.componentInstance.IdServicio = this.IdServicio;
    modal.componentInstance.IdGenero = this.IdGenero;
    modal.componentInstance.IdZona = this.IdZona;
    modal.componentInstance.IdSede = this.IdSede;
    modal.componentInstance.Fecha = boxDay.date;
    modal.componentInstance.Sedes = this.Sedes;
    modal.componentInstance.Parametros = parametros;
    //
    // const detalles: CitaDetalle[] = [];
    // const detalle = new CitaDetalle();
    // detalle.idZona = parseInt(this.IdZona.toString(), 10);
    // detalle.idUsuarioAgendado = this.usuarioService.UsuarioActual.idUsuario;
    // detalle.usuarioAgendado = this.usuarioService.UsuarioActual.nombre;
    // detalles.push(detalle);
    //
    // modal.componentInstance.Detalles = detalles;
    modal.componentInstance.Cita.subscribe((res: Cita | null) => {
      boxDay.cita = res;
      console.log(this.weeks);
    });

  }

  /*** FUNCTIONS ***/

  /* Nueva Cita */
  nuevaCita(fecha: Date): void{

    if(!parseInt(this.IdZona.toString(), 10)){
      this.utilService.mostrarToast('Seleccionar la zona','warning');
      return;
    }else if(!parseInt(this.IdServicio.toString(), 10)){
      this.utilService.mostrarToast('Seleccionar el servicio','warning');
      return;
    }else if(!parseInt(this.IdSede.toString(), 10)){
      this.utilService.mostrarToast('Seleccionar la sede','warning');
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
    const modal = this.modalService.open(SubmdlCronogramaCitaComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static' });
    modal.componentInstance.IdCliente = this.IdCliente;
    modal.componentInstance.IdServicio = this.IdServicio;
    modal.componentInstance.IdGenero = this.IdGenero;
    modal.componentInstance.IdZona = this.IdZona;
    modal.componentInstance.IdSede = this.IdSede;
    modal.componentInstance.Fecha = fecha;
    modal.componentInstance.Sedes = this.Sedes;
    modal.componentInstance.Parametros = parametros;
    //
    // const detalles: CitaDetalle[] = [];
    // const detalle = new CitaDetalle();
    // detalle.idZona = parseInt(this.IdZona.toString(), 10);
    // detalle.idUsuarioAgendado = this.usuarioService.UsuarioActual.idUsuario;
    // detalle.usuarioAgendado = this.usuarioService.UsuarioActual.nombre;
    // detalles.push(detalle);
    //
    // modal.componentInstance.Detalles = detalles;
    modal.componentInstance.Cita.subscribe((res: Cita | null) => {
      // boxDay.cita = res;
      console.log(res);
      // this.calendario.addCita(res);
    });

  }

  /* Obtener los nombres cortos de las tecnologias utilizadas en la cita */
  verTecnologias(detalles: CitaDetalle[]): string{
    return detalles.map(x => x.tecnologiaNombreCorto).join(' | ');
  }

  verCita(dia: BoxDay): void{
    const modal = this.modalService.open(SubmdlCronogramaCitaComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static' });
    modal.componentInstance.IdCita = this.citaSelected?.idCita;
    modal.componentInstance.IdCliente = this.IdCliente;
    modal.componentInstance.IdServicio = this.IdServicio;
    modal.componentInstance.IdGenero = this.IdGenero;
    modal.componentInstance.IdZona = this.IdZona;
    modal.componentInstance.IdSede = this.IdSede;
    modal.componentInstance.Fecha = this.citaSelected.fechaCita;
    modal.componentInstance.Sedes = this.Sedes;
    modal.componentInstance.Parametros = this.Parametros;
    modal.componentInstance.Saved = this.diaSelected.saved;
  }

  editarCita(): void{
    const parametros = {...this.Parametros};
    parametros.citaAccionActual = this.accionCita.EDITAR;
    const modal = this.modalService.open(SubmdlCronogramaCitaComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static' });
    modal.componentInstance.IdCita = this.citaSelected?.idCita;
    modal.componentInstance.IdCliente = this.IdCliente;
    modal.componentInstance.IdServicio = this.IdServicio;
    modal.componentInstance.IdGenero = this.IdGenero;
    modal.componentInstance.IdZona = this.IdZona;
    modal.componentInstance.IdSede = this.IdSede;
    modal.componentInstance.Fecha = this.citaSelected.fechaCita;
    modal.componentInstance.Sedes = this.Sedes;
    modal.componentInstance.Parametros = parametros;
    modal.componentInstance.Saved = this.diaSelected.saved;
  }
  atenderCita(): void{
    const parametros = {...this.Parametros};
    parametros.citaAccionActual = this.accionCita.ATENDER;
    const modal = this.modalService.open(SubmdlCronogramaCitaComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static' });
    modal.componentInstance.IdCita = this.citaSelected?.idCita;
    modal.componentInstance.IdCliente = this.IdCliente;
    modal.componentInstance.IdServicio = this.IdServicio;
    modal.componentInstance.IdGenero = this.IdGenero;
    modal.componentInstance.IdZona = this.IdZona;
    modal.componentInstance.IdSede = this.IdSede;
    modal.componentInstance.Fecha = this.citaSelected.fechaCita;
    modal.componentInstance.Sedes = this.Sedes;
    modal.componentInstance.Parametros = parametros;
    modal.componentInstance.Saved = this.diaSelected.saved;
  }


  /*** DATA ***/

  /* Obtener listado de semanas por cronograma */
  /*async obtenerSemanas(): Promise<void>{
    this.cronogramaCitaService.listWeeks(this.Parametros.uuid, this.Parametros.id).subscribe(async (res: CronogramaCitaSemana[]) => {
      await res.forEach(x => {
        const week : BoxDay[] = [];
        let loop: Date = x.inicio;
        while (loop <= x.fin) {

          // console.log(loop);
          const day = new BoxDay();
          day.date = new Date(loop);
          week.push(day);
          let newDate = loop.setDate(loop.getDate() + 1);
          loop = new Date(newDate);

        }
        this.pushWeek(week, true);
      });
      this.obtenerCitas();
    }, error => {
      console.log(error);
    });
  }*/
  /* Obtener listado de citas por cronograma */
  obtenerCitas(): void{
    this.ldSemanas = true;

    this.cita360Service.findByCronograma(this.Parametros.id).subscribe(async (res: Cita[]) => {
      console.log('citas',res);

      this.weeks.forEach(x => {
        x.dias.forEach( y => {
          y.cita = res.find(z => this.datePipe.transform(z.fechaCita, 'yyyyMMdd') === this.datePipe.transform(y.date, 'yyyyMMdd') );
          y.saved = !!y.cita;
        })
        return x;
      });

      console.log('semanas', this.weeks);

      this.ldSemanas = false;
    });
  }

}
