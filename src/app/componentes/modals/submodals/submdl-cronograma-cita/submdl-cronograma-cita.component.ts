import {
  AfterViewInit,
  Component,
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
import {AuthService} from "../../../../shared/services/auth.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {Cita, CitaDetalle} from "../../../../shared/models/corporal-360/Cita";
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ZonaCorporalService} from "../../../../shared/services/zona-corporal.service";
import {ServicioService} from "../../../../shared/services/servicio.service";
import {Servicio} from "../../../../shared/models/servicio";
import {Tecnologia} from "../../../../shared/models/tecnologia";
import {TecnologiaService} from "../../../../shared/services/tecnologia.service";
import {CitaMensajeAvisoComponent} from "../../../widgets/cita-mensaje-aviso/cita-mensaje-aviso.component";
import {DatePipe} from "@angular/common";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {User} from "../../../../corporal360/shared/model/usuario";
import {TblCitaDetalleCorporal360Component} from "../../../tables/tbl-cita-detalle-corporal360/tbl-cita-detalle-corporal360.component";
import {TipoCitaService} from "../../../../shared/services/tipo-cita.services";
import {CitaMensajeNotaComponent} from "../../../widgets/cita-mensaje-nota/cita-mensaje-nota.component";
import {CitaMensajeDetalleComponent} from "../../../widgets/cita-mensaje-detalle/cita-mensaje-detalle.component";
import {ParametrosCronograma} from "../../../../shared/models/corporal-360/Parametros";
import {TipoCita} from "../../../../corporal360/shared/model/cita";
import {AccionCita, AccionCronograma, CitaEstado} from "../../../../shared/enumeracion/enums";
import {Cita360Service} from "../../../../shared/services/corporal360/cita360.service";
import {CitaDetalle360Service} from "../../../../shared/services/corporal360/cita-detalle360.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {MdlCitaEstadoComponent} from "../../../../corporal360/componente/modal/mdl-cita-estado/mdl-cita-estado.component";
import {MdlCitaHistorialComponent} from "../../../../corporal360/componente/modal/mdl-cita-historial/mdl-cita-historial.component";
import {SubmdlSeleccionarHoraComponent} from "../submdl-seleccionar-hora/submdl-seleccionar-hora.component";
import {UsuarioSeleccionComponent} from "../../../usuario/usuario-seleccion/usuario-seleccion.component";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {MaquinaSede} from "../../../../shared/models/corporal-360/MaquinaSede";
import {CardCitaDetalleCorporal360Component} from "../../../../corporal360/componente/cards/card-cita-detalle-corporal360/card-cita-detalle-corporal360.component";
import {MaquinaMarcaService} from "../../../../shared/services/maquina-marca.service";
import {MaquinaMarca} from "../../../../shared/models/maquina-marca";


@Component({
  selector: 'submdl-cronograma-cita',
  templateUrl: './submdl-cronograma-cita.component.html',
  styleUrls: ['./submdl-cronograma-cita.component.scss']
})

export class SubmdlCronogramaCitaComponent implements OnInit, AfterViewInit, OnDestroy {

  parametros: ParametrosCronograma = new ParametrosCronograma();
  _parametros: BehaviorSubject<ParametrosCronograma> = new BehaviorSubject<ParametrosCronograma>(new ParametrosCronograma);

  @Input() IdCita: number = 0;
  @Input() IdCliente: number = 0;
  @Input() IdTipoCliente: number = 0;
  @Input() IdGenero: number = 0;
  @Input() IdZona: number = 0;
  @Input() IdServicio: number = 0;
  @Input() IdSede: number = 0;
  @Input() Sedes: any[] = [];
  @Input() Fecha: Date | null = null;
  @Input() Detalles: CitaDetalle[] = [];
  @Input() Cita: Cita | null = null;
  @Input() IdPreferente: number = 0;
  @Input() set Parametros(val: ParametrosCronograma) {
    this._parametros.next({...val});
    // console.log(val);
  }
  @Input() Saved: boolean = false;
  @Output() Created = new EventEmitter<Cita>();
  @Output() OnChangeStatus = new EventEmitter<boolean>();
  @Output() OnEdited = new EventEmitter<boolean>();

  // Alter
  @Input() Maquina: MaquinaSede | null = null;



  @ViewChild('cardDetalle') cardDetalle: CardCitaDetalleCorporal360Component;
  @ViewChild('citaMensajeAviso') citaMensajeAviso: CitaMensajeAvisoComponent;
  @ViewChild('citaMensajeNota') citaMensajeNota: CitaMensajeNotaComponent;
  @ViewChild('citaMensajeDetalle') citaMensajeDetalle: CitaMensajeDetalleComponent;


  zonasDimissed: Zona[] = [];
  zonasSelected: Zona[] = [];

  citaDetalles: CitaDetalle[] = [];
  citaDetallesSelected: CitaDetalle[] = [];

  zonasSeleccionadas: Zona[] = [];

  frmZonas = new FormControl([]);

  bgHeader = 'bg-primary';
  textHeader = 'text-white';


  // form

  public submit: EventEmitter<CitaDetalle[]> = new EventEmitter();

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



  minutos = 0;
  zonas: Zona[] = [];
  servicios: Servicio[] = [];
  tecnologias: Tecnologia[] = [];
  usuarios: User[] = [];
  tiposCita: TipoCita[] = [];

  // form
  frmGroup: FormGroup;
  submitted = false;

  // loading
  ldZonas: boolean;
  ldServicios: boolean;
  ldTecnologias: boolean;
  ldUsuarios: boolean;
  ldTiposCita: boolean;
  ldDetalles: boolean;
  ldCita: boolean;
  ldSubmit: boolean;


  // modals
  mdlSeleccionarHoraRef: NgbModalRef;
  mdlSeleccionarUsuarioRef: NgbModalRef;
  mdlHistorialRef: NgbModalRef;
  mdlCitaEstadoRef: NgbModalRef;

  // submodal
  showHorario = false;
  showZona = false;


  title = 'Cita';
  subtitle = '';
  iconClass = '';

  accionCronograma = AccionCronograma;
  accionCita = AccionCita;

  _cita: Cita | null = null;
  citaEstado = CitaEstado;

  ldMaquinaMarca = false;
  sbcMaquinaMarca: Subscription | undefined;
  maquinaMarcas: MaquinaMarca[] = [];

  constructor(
    public bsModalRef: NgbActiveModal,
    private frmBuilder: FormBuilder,
    private authService: AuthService,
    public util: UtilsService,
    private zonaService: ZonaCorporalService,
    private servicioService: ServicioService,
    private tecnologiaService: TecnologiaService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private usuarioService: UsuarioService,
    private tipoCitaService: TipoCitaService,
    private citaService: Cita360Service,
    private citaDetalleService: CitaDetalle360Service,
    private maquinaMarcaService: MaquinaMarcaService
  ) {
    this.ldZonas = false;
    this.ldServicios = false;
    this.ldTecnologias = false;
    this.ldUsuarios = false;
    this.ldTiposCita = false;
    this.ldDetalles = false;
    this.ldCita = false;
    this.ldSubmit = false;
  }

  ngOnInit(): void {
    this.ldCita = false;

    this.updateCitaAccion();

    this.initForm();
    this.obtenerTecnologias();
    this.obtenerUsuarios();
    this.obtenerZonas();
    this.obtenerServicios();
    this.obtenerTiposCita();
    this.obtenerMaquinaMarcas();

    this.initValues();


    // this.frmGroup.get('idTecnologia').valueChanges.subscribe(res => {
    //   if(res){
    //     this.cardDetalle.collection.forEach(y => {
    //       y.idTecnologia = parseInt(res, 10);
    //       y.tecnologia = this.tecnologias.find(x => x.id === parseInt(res, 10)).nombre;
    //     });
    //   }else{
    //     this.cardDetalle.collection.forEach(y => {
    //       y.idTecnologia = 0
    //       y.tecnologia = null;
    //     });
    //   }
    // });
  }

  ngAfterViewInit(): void {

    if(this.IdCita){
      this.obtenerCita();
      this.obtenerDetalles();
    }

    if(this.Cita){
      this._cita = this.Cita;
    }

    if(this.Detalles){
      this.citaDetalles = [...this.Detalles];
      // console.log('detalles', this.citaDetalles);
    }

  }

  ngOnDestroy(): void {
    this.bsModalRef?.close();
    this.mdlSeleccionarHoraRef?.close();
    this.mdlSeleccionarUsuarioRef?.close();
    this.mdlHistorialRef?.close();
    this.mdlCitaEstadoRef?.close();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  // }

  initForm(): void{
    this.frmGroup = this.frmBuilder.group({
      fecha: new FormControl(this.util.firstLetterUpperCase(this.datePipe.transform(this.Fecha,'d MMMM, y','','ES-es')), Validators.required),
      idServicio: new FormControl({value:this.IdServicio, disabled: true}, Validators.required),
      idMaquina: new FormControl('', Validators.required),
      // idTecnologia: new FormControl('', Validators.required),
      idTipoCita: new FormControl('', Validators.required),
      maquina: new FormControl(null, Validators.required),
      horaInicio: new FormControl(null, Validators.required),
      horaTermino: new FormControl(null, Validators.required),
      idSede: new FormControl({value:this.IdSede, disabled: true}, Validators.required),
      idUsuarioAtendio: new FormControl(null),
      usuarioAtendio: new FormControl(null),
      numeroBox: new FormControl(0),
      idMaquinaMarca: new FormControl('')
    });
  }

  initValues(): void{
    this.frmGroup.patchValue({
      idServicio: this.IdServicio ? this.IdServicio : '',
      idZona: this.IdZona ? this.IdZona : ''
    });
    if(this.parametros.citaAccionActual === this.accionCita.ATENDER){
      this.f.idUsuarioAtendio.setValidators(Validators.required);
      this.f.idUsuarioAtendio.updateValueAndValidity();
      this.f.numeroBox.setValidators(Validators.required);
      this.f.numeroBox.updateValueAndValidity();
      this.f.idMaquinaMarca.setValidators(Validators.required);
      this.f.idMaquinaMarca.updateValueAndValidity();
    }
    if(this.Cita){
      this.frmGroup.patchValue({
        horaInicio: this.Cita.horaInicio,
        horaTermino: this.Cita.horaTermino,
        idMaquina: this.Cita.idMaquina,
        maquina: this.Cita.maquina,
        numeroBox: this.Cita.numeroBox,
        idMaquinaMarca: this.Cita.idMaquinaMarca ? this.Cita.idMaquinaMarca : ''
      })
    }
  }
  changeStatus(): void{
    // switch (this.parametros.citaAccionActual){
    //   case AccionCita.VER: {
        switch (this._cita?.idEstado) {
          case CitaEstado.CANCELADA: {this.bgHeader = 'bg-black'; this.textHeader = 'text-white';break;}
          case CitaEstado.REGISTRADA: {this.bgHeader = 'bg-primary'; this.textHeader = 'text-white';break;}
          case CitaEstado.ANULADA: {this.bgHeader = 'bg-danger'; this.textHeader = 'text-white';break;}
          case CitaEstado.ATENDIDA: {this.bgHeader = 'bg-success'; this.textHeader = 'text-white';break;}
          case CitaEstado.CONFIRMADA: {this.bgHeader = 'bg-success-light'; this.textHeader = 'text-white';break;}
          case CitaEstado.ASISTENCIACONFIRMADA: {this.bgHeader = 'bg-dark-primary'; this.textHeader = 'text-white';break;}
          case CitaEstado.GENERADOPORSISTEMA: {this.bgHeader = 'bg-generado'; this.textHeader = 'text-white';break;}
          case CitaEstado.PENDIENTE: {this.bgHeader = 'bg-purple'; this.textHeader = 'text-white';break;}
          case CitaEstado.NOLLAMAR: {this.bgHeader = 'bg-brown'; this.textHeader = 'text-white';break;}
          case CitaEstado.REPROGRAMADA: break;
          default: this.bgHeader = 'bg-white'; break;
        }
    //     break;
    //   }
    // }
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
      detalle.idUsuarioAgendado = this.authService.getUser().id;
      detalle.usuarioAgendado = this.authService.getUser().username;
      // console.log(detalle);
      this.citaDetalles.push(detalle);
    });

    this.zonasSelected = [];

    // console.log(this.zonasDimissed);
  }
  isDimissed(zona: Zona): boolean{
    return this.zonasDimissed.map(x => x.id).includes(zona.id);
  }

  onSubmit(): void{

    this.submitted = true;
    this.citaMensajeAviso.setSubmitted(true);
    this.citaMensajeDetalle.setSubmitted(true);
    this.citaMensajeNota.setSubmitted(true);
    this.cardDetalle.setSubmitted(true);

    if(this.frmGroup.invalid){
      console.log(this.frmGroup);
      this.util.mostrarToast('Faltan campos por rellenar','warning');
      return;
    }

    if( !this.validarCampos() ){
      console.log('validar campos');
      return;
    }
    if(!this.cardDetalle.validar()){
      console.log('validar detalle');
      return;
    }

    // console.log(this.model);

    if(this.parametros?.citaAccionActual === this.accionCita.ATENDER){
      if(parseInt(this.f.numeroBox.value, 10) === 0){
        this.util.mostrarToast('Seleccionar el número del box','warning');
        return;
      }

      if(!this.f.idMaquinaMarca.value){
        this.util.mostrarToast('Seleccionar el nombre de la maquina','warning');
        return;
      }

      this.citaService.attend(this.model).subscribe((res: boolean | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.util.mostrarToast(res.message, 'error');
        }else{
          this.util.mostrarToast('Se actualizó es estado de la cita a atendida!!!','success');
          this.parametros.citaAccionActual = this.accionCita.VER;
          this.obtenerCita();
          this.obtenerMensajes();
          this.OnChangeStatus.emit(true);
        }
      }, error => {
        this.util.mostrarToast('Ocurrio un error al intentar actualizar el estado de la cita a atendida!!!', 'error');
        console.log(error);
      })
      return;
    }

    if(this.parametros?.citaAccionActual === this.accionCita.NUEVA){
      this.ldSubmit = true;
      // console.log(this.model);return;
      this.citaService.create(this.model).subscribe((res: boolean) => {
        console.log(this.model);
        if(res){
          this.util.mostrarToast('Se registro la cita correctamente', 'success');
          this.onClose();
          this.Created.emit(this.model);
        }else{
          this.util.mostrarToast('Ocurrio un error al intentar registrar la cita', 'error');
        }
        this.ldSubmit = false;
      }, error => {
        console.log(error);
        this.ldSubmit = false;
        this.util.mostrarToast('Ocurrio un error al intentar registrar la cita', 'error');
      });
      return;
    }

    if(this.parametros?.citaAccionActual === this.accionCita.EDITAR){
      this.ldSubmit = true;
      this.citaService.update(this.model).subscribe((res: boolean) => {
        console.log(this.model);
        if(res){
          this.util.mostrarToast('Se actualizo la cita correctamente', 'success');
          this.onClose();
          this.OnEdited.emit(res);
        }else{
          this.util.mostrarToast('Ocurrio un error al intentar actualizar la cita', 'error');
        }
        this.ldSubmit = false;
      }, error => {
        console.log(error);
        this.ldSubmit = false;
        this.util.mostrarToast('Ocurrio un error al intentar actualizar la cita', 'error');
      });
      return;
    }



    // console.log(this.cardDetalle.collection);
  }
  onClose(): void{
    this.bsModalRef.close();
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
      this.obtenerNombresZonas();
      this.ldZonas = false;
    }, error => {
      console.log(error);
      this.ldZonas = false;
    });
  }
  obtenerNombreZona(idZona: number): string{
    // console.log(idZona, this.zonas, this.zonas.find((x: Zona) => x.id === idZona)?.nombre);
    return this.zonas.length ? this.zonas.find((x: Zona) => x.id === idZona)?.nombre : '';
  }
  obtenerNombresZonas(): void{
    this.Detalles = this.Detalles.length ? this.Detalles.map((x: CitaDetalle) => {
      // console.log(this.zonas);
      x.zona = this.zonas.length ? this.zonas.find((y: Zona) => y.id === x.idZona)?.nombre : '';
      return x;
    }) : [];
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
    this.tecnologiaService.listarByServicio(this.IdServicio).subscribe((res: Tecnologia[]) => {
      this.tecnologias = res;
      this.ldTecnologias = false;
      // console.log('tecnologias',this.tecnologias);
    }, error => {
      console.log(error);
      this.ldTecnologias = false;
    });
  }
  obtenerUsuarios(): void{
    this.ldUsuarios = true;
    this.usuarioService.collectionByEstado(1).subscribe((res: User[]) => {
      this.usuarios = res;
      this.ldUsuarios = false;
      // console.log('usuarios', this.usuarios);
    }, error => {
      console.log(error);
      this.ldUsuarios = false;
    });
  }
  obtenerTiposCita(): void{
    this.ldTiposCita = true;
    this.tipoCitaService.obtenerTipoCita().subscribe((res: any[]) => {
      this.tiposCita = res.map(x => {
        const model = new TipoCita();
        model.id = x.idTipoCita;
        model.nombre = x.nombre;
        return model;
      });
      this.ldTiposCita = false;
    }, error => {
      console.log(error);
      this.ldTiposCita = false;
    })
  }
  obtenerCita(): void{
    this.ldCita = true;
    this.citaService.findById(this.IdCita).subscribe((res: Cita) => {
      this._cita = res;
      // console.log('Cita', this._cita);
      this.frmGroup.patchValue({
        idTipoCita: res.idTipoCita,
        idServicio: res.idServicio,
        horaInicio: res.horaInicio,
        horaTermino: res.horaTermino,
        maquina: res.maquina,
        idMaquina: res.idMaquina
      });
      this.ldCita = false;
      this.changeStatus();
    }, error => {
      console.log(error);
      this.ldCita = false;
    });
  }
  obtenerDetalles(): void{
    if(!this.Saved){return;}
    this.ldDetalles = true;
    this.citaDetalleService.findByCita(this.IdCita).subscribe((res: CitaDetalle[]) => {
      this.citaDetalles = res;
      this.ldDetalles = false;
    }, error => {
      console.log(error);
      this.ldDetalles = false;
    })
  }
  obtenerMaquinaMarcas(): void{
    this.ldMaquinaMarca = true;
    this.maquinaMarcaService.listarByServicio(this.IdServicio).subscribe((res: MaquinaMarca[]) => {
      // console.log(res);
      this.maquinaMarcas = res;
      this.ldMaquinaMarca = false;
    }, error => {
      console.log(error);
      this.ldMaquinaMarca = false;
    })
  }
  obtenerMensajes(): void{
    this.citaMensajeNota.listarMensajes();
    this.citaMensajeDetalle.listarMensajes();
    this.citaMensajeAviso.listarMensajes();
  }


  // events & herence
  clearCitaMensajeAviso(): void{
    this.citaMensajeAviso.clear();
  }
  clearCitaMensajeNota(): void{
    this.citaMensajeNota.clear();
  }
  clearCitaMensajeDetalle(): void{
    this.citaMensajeDetalle.clear();
  }


  // subscriptions
  updateCitaAccion(): void{
    this._parametros.subscribe((res: ParametrosCronograma) => {
      this.parametros = {...res};
      // console.log('estadoactualizado', this.parametros);
      this.title = `Cita:`;
      switch (res.citaAccionActual) {
        case AccionCita.NUEVA: {
          this.bgHeader = 'bg-gradient';
          this.subtitle = 'Nueva';
          this.iconClass = 'text-white';
        } break;
        case AccionCita.EDITAR: {
          this.subtitle = 'Editar';
          this.iconClass = 'text-warning';
        } break;
        case AccionCita.VER: {
          this.subtitle = 'Ver';
          this.iconClass = 'text-primary';
        } break;
        case AccionCita.ATENDER: {
          this.subtitle = 'Atender';
          this.iconClass = 'text-primary';
        } break;
        default: this.subtitle = '' ;break;
      }
    });
  }


  // getters
  get f(): any{
    return this.frmGroup.controls;
  }
  get horaInicio(): string{
    return this.util.horaStringToFormat12Hour(this.f.horaInicio.value);
  }
  get horaTermino(): string{
    return this.util.horaStringToFormat12Hour(this.f.horaTermino.value);
  }
  get model(): Cita{
    let detalles = [ ...this.cardDetalle.collection ].map(item=>({...item}));
    detalles = detalles.map(x => {
      x.idMedioContactoOrigen = x.idMedioContactoOrigen ? x.idMedioContactoOrigen : null;
      return x;
    })
    const m = new Cita();

    switch (this.parametros.citaAccionActual) {
      case AccionCita.NUEVA: {
        m.idCronograma = this.parametros.id;
        m.idCita = 0;
        m.idCliente = parseInt(this.IdCliente.toString(), 10);
        m.idUsuario = this.authService.getUser().id;
        m.idTipoCliente = parseInt(this.IdTipoCliente.toString(), 10);
        m.idSede = parseInt(this.f.idSede.value, 10);
        m.idMaquina = parseInt(this.f.idMaquina.value, 10);
        m.idEstado = CitaEstado.REGISTRADA;
        m.idUsuarioAtendidoPor = null; // null
        //m.numeroBox = parseInt(this.f.numeroBox.value, 10);
        m.fechaCita = this.Fecha;
        m.idTipoCita = parseInt(this.f.idTipoCita.value, 10);
        m.horaInicio = this.f.horaInicio.value;
        m.horaTermino = this.f.horaTermino.value;
        m.total = 0;
        // m.pagado = 0;
        m.usuarioRegistra = this.authService.getUser().name;
        m.usuarioEdita = this.authService.getUser().name;
        //m.idTipoComprobante = null;
        //m.idTipoPago = null;
        //m.numeroComprobante = null;
        //m.siguienteCita = null;
        //m.citaAnterior = null;
        //m.idEstadoPendiente = null;
        m.idMedioContacto = 0;
        //m.otroMedioContacto = null;
        m.idDescuento = 0;
        m.descuentoAplicaA = null;
        m.cuponDescuento = null;
        m.idServicio = parseInt(this.IdServicio.toString(), 10);
        // idTecnologia: 0,

        m.detalles = detalles.map(x => {x.promocionZona = []; return x;});
        m.mensajeAvisos  = this.citaMensajeAviso.collection;
        m.mensajeDetalles  = this.citaMensajeDetalle.collection;
        m.mensajeNotas  = this.citaMensajeNota.collection;
        m.minutos = this.minutos;
        m.hora = 0;
        m.maquina = '';
        m.servicio = this.servicios.find(x => x.id === parseInt(this.IdServicio.toString(), 10)).nombre;
        m.servicioNombreCorto = this.servicios.find(x => x.id === parseInt(this.IdServicio.toString(), 10)).nombreCorto;
        m.servicioColor = this.servicios.find(x => x.id === parseInt(this.IdServicio.toString(), 10)).color;
        m.idPreferente = this.IdPreferente;
        // tecnologia: this.tecnologias.find(x => x.id === parseInt(this.f.idTecnologia.value, 10)).nombre,
        // tecnologiaNombreCorto: this.tecnologias.find(x => x.id === parseInt(this.f.idTecnologia.value, 10)).nombreCorto,
        break;
      }
      case AccionCita.ATENDER: {
        m.idCita = this._cita?.idCita;
        m.idUsuarioAtendidoPor = parseInt(this.f.idUsuarioAtendio.value, 10);
        m.numeroBox = parseInt(this.f.numeroBox.value, 10);
        m.idMaquinaMarca = parseInt(this.f.idMaquinaMarca.value, 10);
        m.idUsuario = this.authService.getUser().id;
        m.idEstado = CitaEstado.ATENDIDA;
        break;
      }
      case AccionCita.EDITAR: {
        m.idCronograma = this.parametros.id;
        m.idCita = this._cita?.idCita;
        m.idCliente = parseInt(this.IdCliente.toString(), 10);
        m.idUsuario = this.authService.getUser().id;
        m.idTipoCliente = parseInt(this.IdTipoCliente.toString(), 10);
        m.idSede = parseInt(this.f.idSede.value, 10);
        m.idMaquina = parseInt(this.f.idMaquina.value, 10);
        m.idEstado = CitaEstado.REPROGRAMADA;
        m.idUsuarioAtendidoPor = null; // null
        m.fechaCita = this.Fecha;
        m.idTipoCita = parseInt(this.f.idTipoCita.value, 10);
        m.horaInicio = this.f.horaInicio.value;
        m.horaTermino = this.f.horaTermino.value;
        m.total = 0;
        // m.pagado = 0;
        m.usuarioRegistra = this.authService.getUser().name;
        m.usuarioEdita = this.authService.getUser().name;
        //m.idTipoComprobante = null;
        //m.idTipoPago = null;
        //m.numeroComprobante = null;
        //m.siguienteCita = null;
        //m.citaAnterior = null;
        //m.idEstadoPendiente = null;
        m.idMedioContacto = 0;
        //m.otroMedioContacto = null;
        m.idDescuento = 0;
        m.descuentoAplicaA = null;
        m.cuponDescuento = null;
        m.idServicio = parseInt(this.IdServicio.toString(), 10);
        // idTecnologia: 0,

        m.detalles = detalles.map(x => {x.promocionZona = []; return x;});
        m.mensajeAvisos  = this.citaMensajeAviso.collection;
        m.mensajeDetalles  = this.citaMensajeDetalle.collection;
        m.mensajeNotas  = this.citaMensajeNota.collection;
        m.minutos = this.minutos;
        m.hora = 0;
        m.maquina = '';
        m.servicio = this.servicios.find(x => x.id === parseInt(this.IdServicio.toString(), 10)).nombre;
        m.servicioNombreCorto = this.servicios.find(x => x.id === parseInt(this.IdServicio.toString(), 10)).nombreCorto;
        m.servicioColor = this.servicios.find(x => x.id === parseInt(this.IdServicio.toString(), 10)).color;
        // tecnologia: this.tecnologias.find(x => x.id === parseInt(this.f.idTecnologia.value, 10)).nombre,
        // tecnologiaNombreCorto: this.tecnologias.find(x => x.id === parseInt(this.f.idTecnologia.value, 10)).nombreCorto,
        break;
      }
    }



    return m;
  }

  // validaciones
  validarCampos(): boolean{
    if( this.citaMensajeAviso.hasValue ){
      // this.citaMensajeAviso.setSubmitted(true);
      this.util.mostrarToast('Tienes un aviso pendiente de confirmar','warning');
      return false;
    }
    if( this.citaMensajeDetalle.hasValue ){
      // this.citaMensajeDetalle.setSubmitted(true);
      this.util.mostrarToast('Tienes un detalle pendiente de confirmar','warning');
      return false;
    }
    if( this.citaMensajeNota.hasValue ){
      // this.citaMensajeNota.setSubmitted(true);
      this.util.mostrarToast('Tienes una nota pendiente de confirmar','warning');
      return false;
    }
    return true;
  }



  // Dropdown Events
  evtEstado(accion: CitaEstado): void{
    if(!this.validarCampos()){return;}
    this.mdlCitaEstadoRef = this.modalService.open(MdlCitaEstadoComponent, {size: ' max-w-500px mx-auto', windowClass: 'smodal fade2 round popins bg-dark-30', keyboard: false, centered: true, backdrop: false, scrollable: true, animation: true });
    this._cita.mensajeAvisos = this.citaMensajeAviso.collection;
    this._cita.mensajeDetalles = this.citaMensajeDetalle.collection;
    this._cita.mensajeNotas = this.citaMensajeNota.collection;
    this._cita.idUsuario = this.authService.getUser().id;
    this.mdlCitaEstadoRef.componentInstance.cita = this._cita;
    this.mdlCitaEstadoRef.componentInstance.citaEstado = accion;
    this.mdlCitaEstadoRef.componentInstance.eventoCondicionCambiada.subscribe((res: boolean) => {
      if(res){
        this.obtenerCita();
        this.obtenerMensajes();
        this.OnChangeStatus.emit(true);
      }
    });
  }
  evtEditar(): void{
    if(!this.validarCampos()){return;}
    const a = this.parametros;
    a.citaAccionActual = this.accionCita.EDITAR;
    this._parametros.next(a);
  }
  evtAtender(): void{
    this.onSubmit();
  }
  evtHistorial(): void{
    this.mdlHistorialRef = this.modalService.open(MdlCitaHistorialComponent, {size: 'md', windowClass: 'smodal fade2 round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.mdlHistorialRef.componentInstance.IdCita = this._cita.idCita;
  }
  evtHorario(): void{
      this.mdlSeleccionarHoraRef = this.modalService.open(SubmdlSeleccionarHoraComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static', backdropClass: 'bg-transparent' });
      this.mdlSeleccionarHoraRef.componentInstance.IdServicio = this.IdServicio;
      this.mdlSeleccionarHoraRef.componentInstance.IdGenero = this.IdGenero;
      this.mdlSeleccionarHoraRef.componentInstance.IdZona = this.IdZona;
      this.mdlSeleccionarHoraRef.componentInstance.IdSede = this.IdSede;
      this.mdlSeleccionarHoraRef.componentInstance.Fecha = this.Fecha;
      this.mdlSeleccionarHoraRef.componentInstance.Sedes = this.Sedes;
      this.mdlSeleccionarHoraRef.componentInstance.CitaDetallesSelected = this.cardDetalle.collection;

      // console.log('citaDetalle', this.citaDetalles);

      const maquinaSede = new MaquinaSede();
      maquinaSede.idMaquina = this._cita.idMaquina;
      maquinaSede.maquina = this._cita.maquina;
      this.mdlSeleccionarHoraRef.componentInstance.MaquinaSede = maquinaSede;

      if(this.f.idMaquina.value){
        const m = new Cita();
        m.idMaquina = parseInt(this.f.idMaquina.value, 10);
        m.horaInicio = this.f.horaInicio.value;
        m.horaTermino = this.f.horaTermino.value;
        m.hora = this.util.horaStringToTotalDeMinutos(this.f.horaInicio.value);
        m.minutos = this.util.horaStringToTotalDeMinutos(this.f.horaTermino.value) - this.util.horaStringToTotalDeMinutos(this.f.horaInicio.value);
        // console.log(this.f.idMaquina.value);
        this.mdlSeleccionarHoraRef.componentInstance.CitaAgendada = m;
      }

    this.mdlSeleccionarHoraRef.componentInstance.OnSelect.subscribe((res: Cita | null) => {
      console.log('cita horario', res);
      if(res){
        this.frmGroup.patchValue({
          fecha: this.util.firstLetterUpperCase(this.datePipe.transform(res.fechaCita,'d MMMM, y','','ES-es')),
          horaInicio: res.horaInicio,
          horaTermino: res.horaTermino,
          idMaquina: res.idMaquina,
          maquina: res.maquina,
        });
        this.minutos = res.minutos;
        this.Fecha = res.fechaCita;
        // console.log(res.detalles);
        this.cardDetalle.setCollection(res.detalles);
      }
    });

  }

  selectUser(): void{
    this.mdlSeleccionarUsuarioRef = this.modalService.open(UsuarioSeleccionComponent,{size:'md'});
    this.mdlSeleccionarUsuarioRef.componentInstance.idPerfil = this.usuarioService.UsuarioActual.idperfil;
    this.mdlSeleccionarUsuarioRef.componentInstance.modal = this.mdlSeleccionarUsuarioRef;
    this.mdlSeleccionarUsuarioRef.componentInstance.eventUsuarioSeleccionado.subscribe((res:any) => {
      this.f.idUsuarioAtendio.patchValue(res.idUsuario);
      this.f.usuarioAtendio.patchValue(res.nombre.trim());
    });
  }

  // gett data
  get getTotal(): number{
    return this.cardDetalle ? this.cardDetalle.collection.map(d => d.precio).reduce((acc, cur) =>  acc + cur, 0) : 0;
  }

}


