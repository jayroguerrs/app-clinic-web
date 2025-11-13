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

import {Zona} from "../../../shared/models/zonas";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {CitaDetalle, Cita} from "../../../shared/models/corporal-360/Cita";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ZonaCorporalService} from "../../../shared/services/zona-corporal.service";
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";
import {Tecnologia} from "../../../shared/models/tecnologia";
import {TecnologiaService} from "../../../shared/services/tecnologia.service";
import {CitaMensajeAvisoComponent} from "../../widgets/cita-mensaje-aviso/cita-mensaje-aviso.component";
import {DatePipe} from "@angular/common";
import {SubmdlSeleccionarHoraComponent} from "../submodals/submdl-seleccionar-hora/submdl-seleccionar-hora.component";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {User} from "../../../corporal360/shared/model/usuario";
import {
  TblCitaDetalleCorporal360Component
} from "../../tables/tbl-cita-detalle-corporal360/tbl-cita-detalle-corporal360.component";
import {TipoCitaService} from "../../../shared/services/tipo-cita.services";
import { TipoCita } from 'src/app/corporal360/shared/model/cita';
import {CitaMensajeNotaComponent} from "../../widgets/cita-mensaje-nota/cita-mensaje-nota.component";
import {CitaMensajeDetalleComponent} from "../../widgets/cita-mensaje-detalle/cita-mensaje-detalle.component";
import {ParametrosCronograma} from "../../../shared/models/corporal-360/Parametros";


@Component({
  selector: 'mdl-cronograma-cita',
  templateUrl: './mdl-cronograma-cita.component.html',
  styleUrls: ['./mdl-cronograma-cita.component.scss']
})

export class MdlCronogramaCitaComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() IdCita: number = 0;
  @Input() IdCliente: number = 0;
  @Input() IdGenero: number = 0;
  @Input() IdZona: number = 0;
  @Input() IdServicio: number = 0;
  @Input() IdSede: number = 0;
  @Input() Sedes: any[] = [];
  @Input() Fecha: Date | null = null;
  @Input() Detalles: CitaDetalle[] = [];

  @Input() Parametros: ParametrosCronograma;



  @Output() Cita: EventEmitter<any> = new EventEmitter<any>();



  @ViewChild('tabla') tblCitaDetalle: TblCitaDetalleCorporal360Component;
  @ViewChild('citaMensajeAviso') citaMensajeAviso: CitaMensajeAvisoComponent;
  @ViewChild('citaMensajeNota') citaMensajeNota: CitaMensajeNotaComponent;
  @ViewChild('citaMensajeDetalle') citaMensajeDetalle: CitaMensajeDetalleComponent;


  zonasDimissed: Zona[] = [];
  zonasSelected: Zona[] = [];

  citaDetalles: CitaDetalle[] = [];
  citaDetallesSelected: CitaDetalle[] = [];

  zonasSeleccionadas: Zona[] = [];

  frmZonas = new FormControl([]);


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
  ldZonas = false;
  ldServicios = false;
  ldTecnologias = false;
  ldUsuarios = false;
  ldTiposCita = false;


  // submodal
  showHorario = false;
  showZona = false;

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
    private tipoCitaService: TipoCitaService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.obtenerTecnologias();
    this.obtenerUsuarios();
    this.obtenerZonas();
    this.obtenerServicios();
    this.obtenerTiposCita();

    this.initValues();

    // this.frmGroup.get('idTecnologia').valueChanges.subscribe(res => {
    //   if(res){
    //     this.tblCitaDetalle.collection.forEach(y => {
    //       y.idTecnologia = parseInt(res, 10);
    //       y.tecnologia = this.tecnologias.find(x => x.id === parseInt(res, 10)).nombre;
    //     });
    //   }else{
    //     this.tblCitaDetalle.collection.forEach(y => {
    //       y.idTecnologia = 0
    //       y.tecnologia = null;
    //     });
    //   }
    // });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    // this.bsModalRef?.close();
  }

  initForm(): void{
    this.frmGroup = this.frmBuilder.group({
      fecha: new FormControl(this.util.firstLetterUpperCase(this.datePipe.transform(this.Fecha,'MMMM d, y','','ES-es')), Validators.required),
      idServicio: new FormControl({value:this.IdServicio, disabled: true}, Validators.required),
      idMaquina: new FormControl('', Validators.required),
      // idTecnologia: new FormControl('', Validators.required),
      idTipoCita: new FormControl('', Validators.required),
      maquina: new FormControl(null, Validators.required),
      horaInicio: new FormControl(null, Validators.required),
      horaTermino: new FormControl(null, Validators.required),
      idSede: new FormControl({value:this.IdSede, disabled: true}, Validators.required)
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
      detalle.servicio = this.servicios.find(x => x.id === parseInt(this.f.idServicio.value, 10))?.nombre;
      detalle.minutos = x.minutos;
      detalle.idZona = x.id;
      detalle.zona = x.nombre;
      detalle.idUsuarioAgendado = this.authService.getUser().id;
      detalle.usuarioAgendado = this.authService.getUser().username;
      console.log(detalle);
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
    this.tblCitaDetalle.setSubmitted(true);

    if(this.frmGroup.invalid){
      console.log(this.frmGroup);
      this.util.mostrarToast('Faltan campos por rellenar','warning');
      return;
    }

    if( !this.validarCampos() ){
      return;
    }
    if(!this.tblCitaDetalle.validar()){
      return;
    }

    console.log(this.model);

    this.Cita.emit(this.model);
    this.util.mostrarToast('Se registraron los datos correctamente', 'success');
    this.onClose();
    // console.log(this.tblCitaDetalle.collection);
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

  verHorario(): void{
    const modal = this.modalService.open(SubmdlSeleccionarHoraComponent, {size: 'fullscreen max-w-800px', windowClass: 'smodal popins fullscreen modal-right', keyboard: false, backdrop: 'static' });
    modal.componentInstance.IdServicio = this.IdServicio;
    modal.componentInstance.IdGenero = this.IdGenero;
    modal.componentInstance.IdZona = this.IdZona;
    modal.componentInstance.IdSede = this.IdSede;
    modal.componentInstance.Fecha = this.Fecha;
    modal.componentInstance.Sedes = this.Sedes;
    modal.componentInstance.CitaDetallesSelected = this.tblCitaDetalle.collection;
    if(this.f.idMaquina.value){
      const m = new Cita();
      m.idMaquina = parseInt(this.f.idMaquina.value, 10);
      m.horaInicio = this.f.horaInicio.value;
      m.horaTermino = this.f.horaTermino.value;
      m.hora = this.util.horaStringToTotalDeMinutos(this.f.horaInicio.value);
      m.minutos = this.util.horaStringToTotalDeMinutos(this.f.horaTermino.value) - this.util.horaStringToTotalDeMinutos(this.f.horaInicio.value);
      console.log(this.f.idMaquina.value);
      modal.componentInstance.CitaAgendada = m;
    }

    modal.componentInstance.OnSelect.subscribe((res: Cita | null) => {
      console.log(res);
      if(res){
        this.frmGroup.patchValue({
          horaInicio: res.horaInicio,
          horaTermino: res.horaTermino,
          idMaquina: res.idMaquina,
          maquina: res.maquina,
        });
        this.minutos = res.minutos;
        this.tblCitaDetalle.setCollection(res.detalles);
      }
    });

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
    const detalles = [ ...this.tblCitaDetalle.collection ].map(item=>({...item}));
    const m = new Cita();

      m.idCita = 0;
      m.idCliente = parseInt(this.IdCliente.toString(), 10);
      m.idUsuario = this.authService.getUser().id;
      m.idTipoCliente = 0; // obtener
      m.idSede = parseInt(this.f.idSede.value, 10);
      m.idMaquina = parseInt(this.f.idMaquina.value, 10);
      m.idEstado = 0; // obtener
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

    return m;
  }

  // validaciones
  validarCampos(): boolean{
    if( this.citaMensajeAviso.hasValue ){
      this.util.mostrarToast('Tienes un aviso pendiente de confirmar','warning');
      return false;
    }
    if( this.citaMensajeDetalle.hasValue ){
      this.util.mostrarToast('Tienes un detalle pendiente de confirmar','warning');
      return false;
    }
    if( this.citaMensajeNota.hasValue ){
      this.util.mostrarToast('Tienes una nota pendiente de confirmar','warning');
      return false;
    }
    return true;
  }


}


