import {Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, TemplateRef, AfterViewInit} from '@angular/core';
import {NgbCalendar, NgbDateParserFormatter, NgbDropdown, NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { CitaService } from '../../../shared/services/cita.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { CitaImportClass } from 'src/app/shared/models/cita';
import { AccionCita } from 'src/app/shared/enumeracion/enums';
import {DatePipe} from "@angular/common";
import {MaquinaService} from "../../../shared/services/maquina.service";
import {MaquinaMinutos} from "../../../shared/models/maquina";
import {FormControl, Validators} from "@angular/forms";
import {Servicio} from "../../../shared/models/servicio";
import {Subscription} from "rxjs";
import {ServicioService} from "../../../shared/services/servicio.service";
import {MaquinaSedeService} from "../../../shared/services/maquinasede.service";
import {MaquinaSede} from "../../../shared/models/maquinasede";
import {CitaCambiarHorarioComponent} from "../cita-cambiar-horario/cita-cambiar-horario.component";
import { EditarZonaService } from '../cita-registro/editar-zona.service';


@Component({
  selector: 'app-cita-horarios',
  templateUrl: './cita-horario.component.html',
  styleUrls: ['./cita-horario.component.scss'],
  providers: [
  ]
})

export class CitaHorarioComponent implements OnInit, OnDestroy, AfterViewInit {
  dropdownConfig: NgbDropdownConfig;
  maquinasSedePorSede = [];

  horarioNoDisponibles = [];

  fechaCita: FormControl;
  idServicio: FormControl;
  horaTermino: Date;
  errorHorario = false;
  titulo: string;
  usuarioActual: Usuario;
  tipoCita: any;

  modalCitaZonasRef: NgbModalRef;
  formatoFecha = 'dd-MM-yyyy';
  formatoFechaPuntual = 'HH';
  formatoFechaDetalle = 'mm';

  horaInicioEmpresa = 480; //tiempo expresado en minutos (08:00 am) desde las 0 horas
  horaFinEmpresa = 1320; //tiempo expresado en minutos desde las 0 horas por ejemplo: [20 horas (08:00pm) X 60]

  tiempos = [];
  borderRadius = '10px';
  colorCitaGrabadaOtro = '#42bef7';
  colorCitaGrabadaMio = '#4233f7';
  colorCitaReservaPropia = '#59dee1';
  colorCitaReservaOtros = '#f5814a';
  colorCitaDisponible = 'white';
  parametrosParaObtenerAgenda: any;

  maquinasMinutos: MaquinaMinutos[] = [];
  loadingMaquinasMinutos: boolean = false;

  servicios: Servicio[] = [];
  sbcServicios: Subscription;
  loadingMaquinas = false;


  modalCitaCambiarHorarioRef: NgbModalRef;
  idCitaSelected: number | undefined;

  maquinaSelected: any | undefined;
  
  @Input() modal: NgbModalRef;
  @Input() maestroSedes: any;
  @Input() maestroMaquinaSedes: any;
  @Input() datosCita: CitaImportClass;
  @Input() maestroZonasCorporales: any;
  @Input() calcularTotales: Function;

  @Input() public editarZona;
  @ViewChild('modalCitaZona') modalCitaZona!: NgbModalRef;

  //enviar evento a componente padre para calcular el total
  @Output() eventoCalcularTotalHijo = new EventEmitter<void>();
  @Output() eventoOrdenarCitasDetalles = new EventEmitter<void>();

  
  @Output() desahibilitarZonaPorCruceDeHorario = new EventEmitter<{ index: number; idZona: number }>();

  @ViewChild('dropdown') dropdown: ElementRef;

  public get estadoCita(): typeof AccionCita {
    return AccionCita;
  }

  constructor(
    private utilsService: UtilsService,
    private citaService: CitaService,
    private router: Router,
    public parserFormatter: NgbDateParserFormatter,
    public calendar: NgbCalendar,
    private usuarioService: UsuarioService,
    private datePipe: DatePipe,
    private maquinaService: MaquinaService,
    private route: ActivatedRoute,
    private servicioService: ServicioService,
    private maquinaSedeService: MaquinaSedeService,

    private editarZonaService: EditarZonaService
  ) {
    this.fechaCita = new FormControl(null, Validators.required);
    this.idServicio = new FormControl('', Validators.required);

    // this.dropdownConfig.
  }

  ngOnInit(): void {
    // console.log('dato cita', this.datosCita);

    // console.log(this.maestroMaquinaSedes);
    //
    this.listarServicios();
    this.crearAgenda();
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.obtenerDatosPrevios();
    // console.log( this.route.snapshot.paramMap.keys );
    // preseleccionar el servicio
    this.idServicio.patchValue(this.datosCita.idServicio);

    this.editarZona = this.editarZonaService.editarZona;
  }

  ngOnDestroy(): void {
    this.sbcServicios?.unsubscribe();
    this.modalCitaCambiarHorarioRef?.close();
  }

  ngAfterViewInit(){

    if(this.editarZona){
      this.cambiarZona(this.modalCitaZona)
    }

    if(this.editarZonaService.verificarHorarioZonaActivada){
      this.eventPintarReservando(this.editarZonaService.pintarAgendaPorSeleccionZC);
    }
  }

  async obtenerDatosPrevios(): Promise<void>{
    if (this.datosCita != null) {
      this.limpiarAgenda();

      if ((this.datosCita.idCita > 0)) {
        this.fechaCita.setValue(this.datePipe.transform(this.datosCita.fecha, 'yyyy-MM-dd'));
      } else {
        if (this.datosCita.fecha !== undefined) {
          this.fechaCita.setValue(this.datePipe.transform(this.datosCita.fecha, 'yyyy-MM-dd'));
        }
      }

      //this.datosCita.horaInicio = this.datosCita.horaInicio;
      this.horaTermino = this.datosCita.horaTermino;

      if (this.datosCita.idSede > 0) {
        if (this.fechaCita.toString() != '') {
          $('[name=sede]').prop('disabled', false);
        }

        this.datosCita.sede = this.maestroSedes.find(x => x.idSede == this.datosCita.idSede).nombre;
        //this.maquinasSedePorSede = this.maestroMaquinaSedes.filter(ms => ms.idSede == this.datosCita.idSede);

        if( this.datosCita.idServicio !== 0 && this.datosCita.idSede !== 0){
          this.loadingMaquinas = true;
          await this.maquinaSedeService.obtenerBySedeByServicio(this.usuarioService.UsuarioActual.idUsuario, this.datosCita.idSede, this.datosCita.idServicio).subscribe( async(res: MaquinaSede[]) => {
            await console.log(res);
            this.loadingMaquinas = false;
            this.maquinasSedePorSede = res.map(x => {
              x.descripcion = x.descripcion.substring(3).replace('AQ', '').replace('ICT', '');
              return x;
            }).sort((a, b) => a.descripcion.localeCompare(b.descripcion));


            //cuando se edita
            switch (this.datosCita.accionCita) {
              case AccionCita.SIGUIENTE : {
                // console.log(22);
                if (this.datosCita.zonasCorporales != null) {
                  const maquinaSede = this.maquinasSedePorSede.filter(m => m.idSede == this.datosCita.idSede);
                  if (maquinaSede.length > 0) {
                    this.obtenerHorarioCitas(maquinaSede[0]);
                  }
                }
                break;
              }
              default : {
                // console.log(33);
                if (this.datosCita.zonasCorporales != null && this.datosCita.idMaquina > 0) {
                  const maquinaSede = this.maquinasSedePorSede.filter(m => m.idMaquina == this.datosCita.idMaquina && m.idSede == this.datosCita.idSede);
                  // console.log(maquinaSede);
                  if (maquinaSede.length > 0) {
                    // console.log(maquinaSede[0]);
                    this.obtenerHorarioCitas(maquinaSede[0]);
                  }
                }
                break;
              }
            }

            // console.log(res);
          }, error => {
            this.loadingMaquinas = false;
            console.log(error);
          });
        }


      }
      this.estadoFormulario(this.datosCita.accionCita);

    } else {
      Swal.fire('No ha seleccionado o referido al cliente!!!',).then(result => {
        this.router.navigate(['Cliente']).then(() => {
        });
      });
    }
  }

  obtenerMaquinasXSedeCallback(): void{
    const idSede = this.datosCita.idSede;

    if (this.datosCita.idSede == 0 && this.datosCita.idServicio == 0) {
      this.maquinasSedePorSede = [];
      return;
    }

    if(this.datosCita.idServicio !== 0 && idSede !== 0){
      this.loadingMaquinas = true;
      this.maquinaSedeService.obtenerBySedeByServicio(this.usuarioService.UsuarioActual.idUsuario, idSede, this.datosCita.idServicio).subscribe((res: MaquinaSede[]) => {
        this.loadingMaquinas = false;
        this.maquinasSedePorSede = res.map(x => {
          x.descripcion = x.descripcion.substring(3).replace('AQ', '').replace('ICT', '');
          return x;
        }).sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        // console.log(res);
      }, error => {
        this.loadingMaquinas = false;
        console.log(error);
      });
    }


    this.datosCita.idSede = parseInt(idSede.toString(), 0);
    this.datosCita.sede = this.datosCita.idSede ? this.maestroSedes.find(x => x.idSede == this.datosCita.idSede).nombre : '';
    this.limpiarAgenda();

    this.maquinasSedePorSede = this.maestroMaquinaSedes.filter(ms => ms.idSede == this.datosCita.idSede);

    //cuando se edita
    switch (this.datosCita.accionCita) {
      case AccionCita.SIGUIENTE : {
        if (this.datosCita.zonasCorporales != null) {
          const maquinaSede = this.maquinasSedePorSede.filter(m => m.idSede == this.datosCita.idSede);
          if (maquinaSede.length > 0) {
            this.obtenerHorarioCitas(maquinaSede[0]);
          }
        }
        break;
      }
      default : {
        if (this.datosCita.zonasCorporales != null && this.datosCita.idMaquina > 0) {
          const maquinaSede = this.maquinasSedePorSede.filter(m => m.idMaquina == this.datosCita.idMaquina && m.idSede == this.datosCita.idSede);
          if (maquinaSede.length > 0) {
            this.obtenerHorarioCitas(maquinaSede[0]);
          }
        }
        break;
      }
    }

  }

  obtenerMinutosMaquinas(): void {

    if (this.datosCita.idServicio === 0  || this.fechaCita.invalid || this.datosCita.idSede === 0) {
      console.log('invalid');
      this.maquinasSedePorSede = [];
      return;
    }

    this.loadingMaquinasMinutos = true;
    this.maquinaService.obtenerMinutos(this.datosCita.idSede, this.fechaCita.value).subscribe((res) => {
      this.maquinasMinutos = res;
      this.loadingMaquinasMinutos = false;
    }, error => {
      console.log(error);
      this.loadingMaquinasMinutos = false;
    });
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

  limpiarMiReserva(): void {
    const datosReservadosPorMi = $('[datareservada][dataidusuario=' + this.usuarioActual.idUsuario + ']');
    datosReservadosPorMi.css({"background-color": this.colorCitaDisponible, "color": "black"});

    datosReservadosPorMi.removeAttr('dataocupada');
    datosReservadosPorMi.attr('dataidusuario', 0)
    for (var i = 0; i < datosReservadosPorMi.length; i++) {
      datosReservadosPorMi[i].style.borderRadius = '0';
    }
  }

  obtenerHorarioCitas(maquinaSede): void {
    this.maquinaSelected = maquinaSede;

    if (this.fechaCita.invalid) {
      this.utilsService.mostrarToast('Seleccionar una fecha', 'warning');
      return;
    }

    $('[btn-id]').removeClass('selected');
    $('[horanumero]').removeClass('ocupado');
    $('[horanumero]').removeAttr('style');
    $('[btn-id= ' + maquinaSede.idMaquina + ']').addClass('selected');

    this.datosCita.idMaquina = maquinaSede.idMaquina;
    this.datosCita.maquina.descripcion = this.maquinasSedePorSede.length ? this.maquinasSedePorSede.find(x => x.idMaquina == maquinaSede.idMaquina).maquina : '';
    this.datosCita.maquina.id = maquinaSede.idMaquina;

    this.citaService.obtenerHorariosNoDisponible(this.fechaCita.value,
      maquinaSede.idMaquina,
      maquinaSede.idSede,
      this.usuarioActual.idUsuario,
      this.datosCita.accionCita,
      this.datosCita.idCita
    ).subscribe(
      (resultado: any) => {

        this.obtenerMinutosMaquinas();

        // console.log(resultado);
        const deshabilitaHover = this.datosCita.accionCita == AccionCita.VER;
        this.pintarDatos(resultado, deshabilitaHover);

        if (this.datosCita.modificado) {
          const minutoInicio = this.datosCita.horaInicio ? this.utilsService.totalDeMinutos(this.datosCita.horaInicio) : 0;
          if(minutoInicio){
            this.pintarReprogramacionOConfirmar(minutoInicio);
          }
        }

      },
      (error: any) => console.log('Error al obtener los horarios no disponibles', error)
    );
  }

  estadoFormulario(accionCita: AccionCita): void {
    accionCita = Number(accionCita);
    this.titulo = "CITA: ";
    switch (accionCita) {
      case AccionCita.ATENDER: {
        this.titulo += "ATENDER";
        break;
      }
      case AccionCita.EDITAR: {
        this.titulo += "EDITAR";
        break;
      }
      case AccionCita.SIGUIENTE: {
        this.titulo += "SIGUIENTE";
        break;
      }
      case AccionCita.CONFIRMAR: {
        this.titulo += "CONFIRMAR";
        break;
      }
      case AccionCita.NUEVA: {
        this.titulo += "NUEVA";
        break;
      }
      case AccionCita.VER: {
        this.titulo += "VER";
        $('#iconCalendar').prop("disabled", true);
        $('#inputCalendar').prop("disabled", true);
        $('[name=sede]').prop("disabled", true);
        $('#btnZonas').hide();
        break;
      }
    }
  }

  pintarDatos(horariosNoDisponibles, deshabilitaHover): void {
    if (deshabilitaHover) {
      $('.col-1').removeClass('con-hover');
    }
    this.limpiarAgenda();

    horariosNoDisponibles.forEach(hnd => {
      const datosParaPintar = $('[horaNumero]').filter(function () {
        var Id = $(this).attr('horaNumero');
        return (Id >= hnd.minutoInicio && Id < hnd.minutoTermino);
      });

      if (datosParaPintar.length > 0) {

        if (this.datosCita.accionCita == AccionCita.VER) {
          datosParaPintar.css({"background-color": hnd.colorFondo, "color": hnd.colorTexto});
          datosParaPintar.attr('dataocupada', '1');
          datosParaPintar.attr('idcita', hnd.idCita);
          // datosParaPintar.attr('dd', 'dd');
          if(hnd.idCita !== this.datosCita.idCita){
            datosParaPintar.addClass('ocupado');
          }
        }
        if (this.datosCita.accionCita == AccionCita.EDITAR) {
          datosParaPintar.css({"background-color": hnd.colorFondo, "color": hnd.colorTexto});
          datosParaPintar.attr('dataocupada', '1');
          datosParaPintar.attr('idcita', hnd.idCita);
          if(hnd.idCita !== this.datosCita.idCita){
            datosParaPintar.addClass('ocupado');
          }
        }
        if (this.datosCita.accionCita == AccionCita.ATENDER) {
          datosParaPintar.css({"background-color": hnd.colorFondo, "color": hnd.colorTexto});
          datosParaPintar.attr('dataocupada', '1');
          datosParaPintar.attr('idcita', hnd.idCita);
          if(hnd.idCita !== this.datosCita.idCita){
            datosParaPintar.addClass('ocupado');
          }
        }
        if (this.datosCita.accionCita == AccionCita.NUEVA) {
          datosParaPintar.css({"background-color": hnd.colorFondo, "color": hnd.colorTexto});
          datosParaPintar.attr('dataocupada', '1');
          datosParaPintar.attr('idcita', hnd.idCita);
          if(hnd.idCita !== this.datosCita.idCita){
            datosParaPintar.addClass('ocupado');
          }
        }
        if (this.datosCita.accionCita == AccionCita.SIGUIENTE) {
          datosParaPintar.css({"background-color": hnd.colorFondo, "color": hnd.colorTexto});
          datosParaPintar.attr('dataocupada', '1');
          datosParaPintar.attr('idcita', hnd.idCita);
          if(hnd.idCita !== this.datosCita.idCita){
            datosParaPintar.addClass('ocupado');
          }
        }
        datosParaPintar[0].style.borderTopLeftRadius = this.borderRadius;
        datosParaPintar[0].style.borderBottomLeftRadius = this.borderRadius;
        datosParaPintar[datosParaPintar.length - 1].style.borderTopRightRadius = this.borderRadius;
        datosParaPintar[datosParaPintar.length - 1].style.borderBottomRightRadius = this.borderRadius;
        datosParaPintar.attr('dataidusuario', hnd.idUsuario)
      }
    });
  }

  eventPintarReservando(datosReserva): void {
    this.limpiarDataOcupada(datosReserva.idCita);

    //Obtener el rango que se va a pintar
    const datosParaPintar = $('[horaNumero]').filter(function () {
      var Id = $(this).attr('horaNumero');
      return (Id >= datosReserva.minutoInicio && Id < datosReserva.minutoTermino);
    });

    //Evaluar el cruce con citas grabadas
    this.errorHorario = false;
    for (var i = 0; i < datosParaPintar.length; i++) {
      if (datosParaPintar[i].hasAttribute('dataocupada')) {
        this.errorHorario = true;
        this.utilsService.mostrarToast('No se puede elegir este horario, ya que existe citas registrada', 'warning');
        return;
      }
    }

    //Si no hay cruce
    if (this.errorHorario == false) {
      //Asignar estilos
      datosParaPintar.css({"background-color": this.colorCitaReservaPropia, "color": "black"});
      //poner border radius
      datosParaPintar[0].style.borderTopLeftRadius = this.borderRadius;
      datosParaPintar[0].style.borderBottomLeftRadius = this.borderRadius;
      datosParaPintar[datosParaPintar.length - 1].style.borderTopRightRadius = this.borderRadius;
      datosParaPintar[datosParaPintar.length - 1].style.borderBottomRightRadius = this.borderRadius;
      //poner atributo
      // datosParaPintar.attr('dd', 'dd');
      datosParaPintar.attr('datareservada', '1');
      datosParaPintar.attr('dataidusuario', datosReserva.idUsuario.toString());
    }
  }

  limpiarAgenda(): void {
    const datosLimpiar = $('[horaNumero][dataocupada]');
    // datosLimpiar.css({"background-color": this.colorCitaDisponible, "color": "black"});
    datosLimpiar.removeAttr('dataocupada');
    datosLimpiar.removeAttr('style');
    datosLimpiar.attr('dataidusuario', '0');
  }

  limpiarDataReservada(idUsuario): void {
    const datosLimpiar = $('[horaNumero][datareservada][dataidusuario=' + idUsuario + ']');
    if (datosLimpiar.length > 0) {
      // datosLimpiar.css({"background-color": this.colorCitaDisponible, "color": "black"});
      datosLimpiar.removeAttr('datareservada');
      datosLimpiar.removeAttr('style');
      datosLimpiar.attr('dataidusuario', '0');
      for (var i = 0; i < datosLimpiar.length; i++) {
        datosLimpiar[i].style.borderRadius = '0';
      }
    }
  }

  limpiarDataOcupada(idCita): void {
    const datosLimpiar = $('[horaNumero][dataocupada][idcita=' + this.datosCita.idCita + ']');
    if (datosLimpiar.length > 0) {
      //datosLimpiar.css({"background-color": this.colorCitaDisponible, "color": "black"});
      datosLimpiar.removeAttr('datareservada');
      datosLimpiar.removeAttr('dataocupada');
      datosLimpiar.removeAttr('style');
      datosLimpiar.attr('dataidusuario', '0');
      for (var i = 0; i < datosLimpiar.length; i++) {
        datosLimpiar[i].style.borderRadius = '0';
      }
    }
  }

  async validarDisponibilidad(minutoHoraInicio): Promise<boolean> {
    const tiempoTotal = this.datosCita.duracion;
    const div = this.datosCita.duracion / 5;
    let item: any | undefined;
    let ocupado = false;
    let minutoInicio = minutoHoraInicio;

    item = $(`[horaNumero='${minutoHoraInicio}']`);
    if(!item){
      return false;
    }
    ocupado = item.hasClass('ocupado');
    if(ocupado){
      return false;
    }

    let cont = 1;
    console.log('bloques', div);
    while(
      item &&
      !ocupado &&
      (cont <= div))
    {

        item = await $(`[horaNumero='${minutoInicio}']`);
        ocupado = item.hasClass('ocupado');

      // await console.log(minutoInicio, ocupado);

        cont++;
        minutoInicio += 5;
        // item = $(`[horaNumero='${minutoInicio}']`);
        // ocupado = item.hasClass('ocupado');
        // console.log(minutoHoraInicio, item, ocupado);
    }

    return !ocupado

    //
    // let minutoInicio = minutoHoraInicio;
    // let itemArray: any | undefined = $(`[horaNumero='${minutoInicio}']`);
    // ocupado = $(`[horaNumero='${minutoInicio}']`).hasClass('ocupado');
    // do{
    //   minutoInicio += 5;
    //   cont ++;
    //   itemArray = $(`[horaNumero='${minutoInicio}']`);
    //   ocupado = $(`[horaNumero='${minutoInicio}']`).hasClass('ocupado');
    //   console.log(ocupado);
    // }while (!ocupado && itemArray && (cont < div))
    // return !ocupado;
    //
    // }


  }

  async abrirCitaZonaCorporal(modal: NgbModalRef, minutoHoraInicio): Promise<void> {

    /////////////// VER \\\\\\\\\\\\\\\\\
    if (this.datosCita.accionCita == AccionCita.VER) {
      return;
    }

    const valido = await this.validarDisponibilidad(minutoHoraInicio);

    console.log('valido:' + valido);
    console.log('clickd');

    if( !valido ){
      this.utilsService.mostrarToast('No se puede elegir este horario, ya que existe citas registrada o hay cruce de horarios', 'error');
      return;
    }

    this.datosCita.horaInicio = this.utilsService.totalMinutosAsDate(minutoHoraInicio);

    // console.log(this.datosCita.horaInicio);

    //VALIDAR QUE SE HAYA SELECCIONADO FECHA, SEDE Y MAQUINA
    if (this.fechaCita.toString() == '') {
      this.utilsService.mostrarToast('Seleccione una fecha para agendar', 'info');
      return;
    }
    if (this.datosCita.idSede == 0) {
      this.utilsService.mostrarToast('Seleccione una sede para agendar', 'info');
      return;
    }
    if (this.datosCita.idMaquina == 0) {
      this.utilsService.mostrarToast('Seleccione una maquina para agendar', 'info');
      return;
    }

    /////////////// REPROGRAMAR - CONFIRMAR \\\\\\\\\\\\\\\\\
    if (this.datosCita.accionCita == AccionCita.EDITAR || this.datosCita.accionCita == AccionCita.CONFIRMAR || this.datosCita.accionCita == AccionCita.ATENDER) {
      $('[name=sede]').prop('disabled', false);
      this.pintarReprogramacionOConfirmar(minutoHoraInicio);
    }

    /////////////// SIGUIENTE \\\\\\\\\\\\\\\\\
    if (this.datosCita.accionCita == AccionCita.SIGUIENTE) {
      //LIMPIAR RANGO ANTERIOR SI HE SELECCIONADO OTRA FECHA
      const datosLimpiar = $('[horaNumero][datareservada][siguientecita]');
      if (datosLimpiar.length > 0) {
        // datosLimpiar.css({"background-color": this.colorCitaDisponible, "color": "black"});
        datosLimpiar.removeAttr('datareservada');
        datosLimpiar.removeAttr('siguientecita');
        datosLimpiar.removeAttr('style');
        datosLimpiar.attr('dataidusuario', '0');
        for (var i = 0; i < datosLimpiar.length; i++) {
          datosLimpiar[i].style.borderRadius = '0';
        }
      }

      //OBTENER EL RANGO PARA PINTAR
      const duracion = this.datosCita.duracion;
      const datosParaPintar = $('[horaNumero]').filter(function () {
        const horaNumero = $(this).attr('horaNumero');
        return (horaNumero >= minutoHoraInicio && horaNumero < minutoHoraInicio + duracion);
      });
      //EVALUAR SI ESTA OCUPADO
      let existeCruce = false;
      for (var i = 0; i < datosParaPintar.length; i++) {
        if (datosParaPintar[i].hasAttribute('dataocupada')) {
          existeCruce = true;
          const resultado = this.utilsService.mostrarToast('No se puede elegir este horario, ya que existe citas registrada', 'warning');
          return;
        }
      }
      //PINTAR SELECCION
      if (!existeCruce) {
        if (this.usuarioActual.idUsuario == this.datosCita.idUsuario)
          datosParaPintar.css({"background-color": this.colorCitaReservaPropia, "color": "black"});
        else
          datosParaPintar.css({"background-color": this.colorCitaReservaOtros, "color": "black"});

        datosParaPintar[0].style.borderTopLeftRadius = this.borderRadius;
        datosParaPintar[0].style.borderBottomLeftRadius = this.borderRadius;
        datosParaPintar[datosParaPintar.length - 1].style.borderTopRightRadius = this.borderRadius;
        datosParaPintar[datosParaPintar.length - 1].style.borderBottomRightRadius = this.borderRadius;
        datosParaPintar.attr('datareservada', '1');
        datosParaPintar.attr('dataidusuario', this.usuarioActual.idUsuario.toString());
        datosParaPintar.attr('siguientecita', 1);
      }
    }

    /////////////// NUEVO \\\\\\\\\\\\\\\\\
    if (this.datosCita.accionCita == AccionCita.NUEVA) {
      if (this.datosCita.zonasCorporales == null) {
        //Nuevo primera vez en esta ventana

        if (!this.evaluarPuntoOcupado(minutoHoraInicio)) {
          this.modalCitaZonasRef = this.utilsService.abrirModal(modal, 'lg');
          this.modalCitaZonasRef.result.then(resultado => {
            // console.log('zz', this.datosCita.zonasCorporales );
          }/*console.log('ok')*/);
        } else {
          this.utilsService.mostrarToast('No se puede elegir este horario, ya que existe citas registrada', 'warning');
        }

      } else {
        //Nuevo entra por segunda vez o mas
        this.pintarReprogramacionOConfirmar(minutoHoraInicio);
        this.datosCita.horaInicio = this.utilsService.totalMinutosAsDate(minutoHoraInicio);
        this.datosCita.horaTermino = this.utilsService.totalMinutosAsDate(minutoHoraInicio + this.datosCita.duracion);
      }
    }

    // Limpiar stylos los espacios libres
    $('[horanumero]').not('[dataocupada]').removeAttr('style');

  }

  evaluarOcupado(datosParaPintar): boolean {
    //EVALUAR SI ESTA OCUPADO
    let existeCruce = false;
    for (var i = 0; i < datosParaPintar.length; i++) {

      let idCitaPintar = datosParaPintar[i].getAttribute('idcita');
      if (idCitaPintar != undefined) idCitaPintar = parseInt(idCitaPintar, 10); else idCitaPintar = 0;
      const idCita = this.datosCita.idCita;

      const esOcupada = datosParaPintar[i].hasAttribute('dataocupada')
      if (esOcupada && idCitaPintar != idCita) {
        existeCruce = true;
      }
    }

    if (existeCruce && !this.editarZonaService.verificarHorarioZonaActivada) {
      this.utilsService.mostrarToast('No se puede elegir este horario, ya que existe citas registrada', 'warning');
    } 

    if (existeCruce && this.editarZonaService.verificarHorarioZonaActivada) {
      this.utilsService.mostrarToast('No se puede habilitar esta zona, ya que existe cruce de horario', 'warning');

      
      if(this.editarZonaService.verificarHorarioZonaActivada){

        //envia un evento para desactivar la zona por error de horario
        this.desahibilitarZonaPorCruceDeHorario.emit({
          index: this.editarZonaService.indexZonaHorarioZonaActivada,
          idZona: this.editarZonaService.idZonaHorarioZonaActivada,
        });
        this.editarZonaService.verificarHorarioZonaActivada = false;
        this.modal.close();
      }
    }

    if(!existeCruce && this.editarZonaService.verificarHorarioZonaActivada){
      this.editarZonaService.verificarHorarioZonaActivada = false;
      this.modal.close();
    }

    return existeCruce;
  }

  evaluarPuntoOcupado(minutoHoraInicio): boolean {
    return $('[horaNumero= ' + minutoHoraInicio + ']')[0].hasAttribute('dataocupada');
  }

  pintarReprogramacionOConfirmar(minutoInicio): boolean {

    //OBTENER EL RANGO PARA PINTAR
    const duracion = this.datosCita.duracion;
    const datosParaPintar = $('[horaNumero]').filter(function () {
      const horaNumero = $(this).attr('horaNumero');
      return (horaNumero >= minutoInicio && horaNumero < minutoInicio + duracion);
    });

    //PINTAR SELECCION
    if (!this.evaluarOcupado(datosParaPintar)) {

      //LIMPIAR RANGO ANTERIOR SI HE SELECCIONADO OTRA FECHA

      const datosLimpiar = $('[horaNumero][dataocupada][idcita=' + this.datosCita.idCita + ']');
      // console.log(datosLimpiar);

      if (datosLimpiar.length > 0) {
        datosLimpiar.css({"background-color": this.colorCitaDisponible, "color": "black"});
        datosLimpiar.removeAttr('dataocupada');
        datosLimpiar.removeAttr('idcita');
        datosLimpiar.attr('dataidusuario', '0');
        for (var i = 0; i < datosLimpiar.length; i++) {
          datosLimpiar[i].style.borderRadius = '0';
        }
      }

      if (this.usuarioActual.idUsuario == this.datosCita.idUsuario)
        datosParaPintar.css({"background-color": this.colorCitaReservaPropia, "color": "black"});
      else
        datosParaPintar.css({"background-color": this.colorCitaReservaOtros, "color": "black"});

      datosParaPintar[0].style.borderTopLeftRadius = this.borderRadius;
      datosParaPintar[0].style.borderBottomLeftRadius = this.borderRadius;
      datosParaPintar[datosParaPintar.length - 1].style.borderTopRightRadius = this.borderRadius;
      datosParaPintar[datosParaPintar.length - 1].style.borderBottomRightRadius = this.borderRadius;
      datosParaPintar.attr('dataocupada', '1');
      datosParaPintar.attr('dataidusuario', this.usuarioActual.idUsuario.toString());
      datosParaPintar.attr('idcita', this.datosCita.idCita);
      // datosParaPintar.attr('dd', 'dd');
      //datosParaPintar.addClass('ocupado');
      return true;
    }else{
      return false;
    }
  }

  crearAgenda(): void {
    this.tiempos = [];
    for (var i = this.horaInicioEmpresa; i < this.horaFinEmpresa; i += 5) {
      this.tiempos.push({
        inicio: this.utilsService.totalMinutosAsDate(i),
        fin: this.utilsService.totalMinutosAsDate(i + 5),
        esHoraPunto: (this.utilsService.totalMinutosAsDate(i).getMinutes() == 0) ? true : false,
        horaNumero: i
      });
    }
  }

  habilitarSede(event): void {

    if(this.fechaCita.value){
      //Captura la fecha
      this.datosCita.fecha = new Date(this.fechaCita.value + 'T00:00:00');
      //EVENTO - PERMITE HABILITAR EL COMBO DE SEDE SI SOLO SE HA SELECCIONADO LA FECHA DE CITA
      if (event) {
        $('[name=sede]').prop('disabled', false);
      } else {
        $('[name=sede]').prop('disabled', true);
      }

      if (this.datosCita.idSede > 0 && this.datosCita.idMaquina > 0) {
        this.obtenerHorarioCitas({
          idMaquina: this.datosCita.idMaquina,
          idSede: this.datosCita.idSede
        });
      }
    }

  }

  onChangeService(): void{
    this.datosCita.servicio = this.datosCita.idServicio ?  this.servicios.find(x => x.id === parseInt(this.datosCita.idServicio.toString()))?.nombre : '';
    if(this.datosCita.idCita === 0){
      this.datosCita.duracion = 0
      if(this.datosCita.hasOwnProperty('horaInicio')) { delete this.datosCita['horaInicio']; }
      if(this.datosCita.hasOwnProperty('horaTermino')) { delete this.datosCita['horaTermino']; }
      this.datosCita.idMaquina = 0

      this.datosCita.maquina.id = 0
      this.datosCita.maquina.descripcion = ""
      this.datosCita.modificado = false
      this.datosCita.zonasCorporales = null;
    }else{
      // this.datosCita.duracion = 0
      // if(this.datosCita.hasOwnProperty('horaInicio')) { delete this.datosCita['horaInicio']; }
      // if(this.datosCita.hasOwnProperty('horaTermino')) { delete this.datosCita['horaTermino']; }
      this.datosCita.idMaquina = 0
      this.datosCita.maquina.id = 0
      this.datosCita.maquina.descripcion = ""
    }
    this.crearAgenda();
  }

  aceptarCambios(): void {
    if (this.datosCita.accionCita == AccionCita.EDITAR) {
      this.aceptarCambiosReprogramacion();
    }
    if (this.datosCita.accionCita == AccionCita.ATENDER) {
      this.aceptarCambiosReprogramacion();
    }
    if (this.datosCita.accionCita == AccionCita.SIGUIENTE) {
      this.aceptarCambiosSiguienteCita();
    }
    if (this.datosCita.accionCita == AccionCita.VER) {
      this.router.navigate(['Cita']);
    }
    if (this.datosCita.accionCita == AccionCita.NUEVA) {
      this.aceptarCambiosNuevo();
    }
  }

  cambiarZona(modal: NgbModalRef): void {
    //VALIDAR QUE SE HAYA SELECCIONADO FECHA, SEDE Y MAQUINA
    if (this.fechaCita.toString() == '') {
      this.utilsService.mostrarToast('Seleccione una fecha', 'info');
      return;
    }

    if (this.datosCita.horaInicio == undefined) {
      this.utilsService.mostrarToast('Seleccione una hora de inicio', 'info');
      return;
    }
    this.modalCitaZonasRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalCitaZonasRef.result.then((res) => {

      // this.datosCita.zonasCorporales.forEach((x) =>{
      //   console.log(x.retroTratam);
      // });

    });
  }

  aceptarCambiosReprogramacion(): void {
    const reprogramacionOcupada = $('[horaNumero][dataocupada][idcita=' + this.datosCita.idCita + ']');
    const reprogramacionReservada = $('[horaNumero][datareservada][idcita=' + this.datosCita.idCita + ']');

    const datosReprogramacion = reprogramacionOcupada.length ? reprogramacionOcupada : reprogramacionReservada;
    const horaNumeroInicio = parseInt(datosReprogramacion[0].getAttribute('horanumero'), 10);
    const horaNumeroTermino = horaNumeroInicio + this.datosCita.duracion;
    this.datosCita.horaInicio = this.utilsService.totalMinutosAsDate(horaNumeroInicio);
    this.datosCita.horaTermino = this.utilsService.totalMinutosAsDate(horaNumeroTermino);
    this.datosCita.modificado = true;
    this.cerrarModal();
  }

  aceptarCambiosNuevo(): void {
    this.cerrarModal();
  }

  aceptarCambiosSiguienteCita(): void {
    const datosSiguienteCita = $('[horaNumero][datareservada][siguientecita]');
    const horaNumeroInicio = parseInt(datosSiguienteCita[0].getAttribute('horanumero'), 10);
    const horaNumeroTermino = horaNumeroInicio + this.datosCita.duracion;
    this.datosCita.idCita = 0;
    this.datosCita.accionCita = AccionCita.SIGUIENTE;
    this.datosCita.horaInicio = this.utilsService.totalMinutosAsDate(horaNumeroInicio);
    this.datosCita.horaTermino = this.utilsService.totalMinutosAsDate(horaNumeroTermino);
    for (var i = 0; i < this.datosCita.zonasCorporales.length; i++) {
      this.datosCita.zonasCorporales[i].sesion = this.datosCita.zonasCorporales[i].sesion + 1;
    }
    this.datosCita.esEditadoSigCita = true;
    this.cerrarModal();
  }

  mostrarPerfil(): void {
    this.router.navigate([]).then(result => {
      window.open('ClientePerfil/' + this.datosCita.cliente.id, '_blank');
    });
  }

  cerrarModal(): void {
    this.editarZonaService.editarZona = false;
    this.modal.close();
  }

  convertMinutesToTimeFormat(nMinutes: number): string {
    // Convierte numero de minutos a formato HH:mm
    const hours = Math.floor(nMinutes / 60);
    const minutes = nMinutes % 60;
    if (minutes) {
      return ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2);
    }
    return ('0' + hours).slice(-2) + ":00";
  }

  // data
  listarServicios(): void{
    this.sbcServicios = this.servicioService.listarByEstado(1).subscribe((res) => {
      this.servicios = res;
    }, error => {
      console.log(error);
    });
  }


  /*******************************************************************************************************
   * Events
   */
  evtMoverCita(): void{
    console.log('mover cita');
    this.modalCitaCambiarHorarioRef = this.utilsService.abrirModal(CitaCambiarHorarioComponent, 'xl');
    this.modalCitaCambiarHorarioRef.componentInstance.IdCita = this.idCitaSelected;
    this.modalCitaCambiarHorarioRef.componentInstance.OnSuccess.subscribe((res) => {
      this.obtenerHorarioCitas(this.maquinaSelected);
    });
    // this.dropdown.toggle();
  }
  evtShowMenu(event, element: HTMLElement): void{
    event.preventDefault();
    const idCita = element.getAttribute('idcita');
    if(idCita){
      this.idCitaSelected = parseInt(idCita, 10);
      // console.log(idCita, event.clientX, event.clientY);
      // console.log(this.dropdown);
      this.dropdown.nativeElement.style.position = "fixed";
      this.dropdown.nativeElement.style.display = "block";
      this.dropdown.nativeElement.style.left = `${event.clientX}px`;
      this.dropdown.nativeElement.style.top = `${event.clientY}px`;
    }else{
      this.idCitaSelected = undefined;
      this.evtCloseMenu();
    }
  }
  evtCloseMenu(){
    this.dropdown.nativeElement.style.display = "none";
    this.dropdown.nativeElement.style.left = `0px`;
    this.dropdown.nativeElement.style.top = `0px`;
  }

  //funcion para calcularTotal

  enviarEventoAlPadreParaCalcularTotal(){
    this.eventoCalcularTotalHijo.emit();
  }

  enviarEventoAlPadreParaOrdenar(){
    this.eventoOrdenarCitasDetalles.emit();
  }
}
