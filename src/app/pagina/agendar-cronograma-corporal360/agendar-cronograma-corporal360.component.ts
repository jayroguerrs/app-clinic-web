import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NavBarService} from "../../shared/services/nav-bar.service";
import {NavBarMenu} from "../../shared/models/nav-bar";
import {ClienteService} from "../../shared/services/cliente.service";
import {Cliente} from "../../shared/models/cliente";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TipoClienteService} from "../../shared/services/tipocliente.services";
import {SedeService} from "../../shared/services/sede.service";
import {TecnologiaService} from "../../shared/services/tecnologia.service";
import {Tecnologia} from "../../shared/models/tecnologia";
import {TipoCitaService} from "../../shared/services/tipo-cita.services";
import {ServicioService} from "../../shared/services/servicio.service";
import {Servicio} from "../../shared/models/servicio";
import {ZonaCorporalService} from "../../shared/services/zona-corporal.service";

import Swal from "sweetalert2";

import {DatePipe} from "@angular/common";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {TblCronogramaCorporal360Component} from "../../componentes/tables/tbl-cronograma-corporal360/tbl-cronograma-corporal360.component";
import {CronogramaCitaService} from "../../shared/services/corporal360/cronograma-cita.service";
import {Cita, CronogramaCita, CronogramaCita_Cita} from "../../shared/models/corporal-360/Cita";
import {AuthService} from "../../shared/services/auth.service";
import {ErrorSistema} from "../../shared/models/error-sistema";
import {AccionCronograma} from "../../shared/enumeracion/enums";
import {Cita360Service} from "../../shared/services/corporal360/cita360.service";
import {ParametrosCronograma} from "../../shared/models/corporal-360/Parametros";
import {CurrencyMaskInputMode} from "ngx-currency";
import {Tratamiento} from "../../shared/models/tratamiento";
import {Subscription} from "rxjs";
import {TratamientoService} from "../../shared/services/tratamiento.service";
import {CalendarComponent} from "../../componentes/widgets/calendar/calendar.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {MdlCronogramaHistorialComponent} from "../../corporal360/componente/modal/mdl-cronograma-historial/mdl-cronograma-historial.component";

@Component({
  selector: 'app-agendar-cronograma-corporal360',
  templateUrl: './agendar-cronograma-corporal360.component.html',
  styleUrls: ['./agendar-cronograma-corporal360.component.scss']
})
export class AgendarCronogramaCorporal360Component implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tabla') tabla: TblCronogramaCorporal360Component;
  @ViewChild('calendario') calendario: CalendarComponent;

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

  submitted = false;
  frmGroup: FormGroup;

  cliente: Cliente | null = null;
  tiposCliente: any[] = [];
  sedes: any[] = [];
  tecnologias: Tecnologia[] = [];
  tiposCita: any[] = [];
  servicios: Servicio[] = [];
  zonas: any[] = [];
  tratamientos: Tratamiento[] = [];

  ldCliente = true;
  ldTipoCliente = true;
  ldSede = true;
  ldTecnologia = true;
  ldTipoCita = true;
  ldServicio = true;
  ldZonas = true;
  ldTratamiento = true;

  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)['fp_incr'](10)
  };

  frmRange: FormGroup;
  submittedWeek: boolean;
  rangoFechas: Date[] = [];

  accionCronograma = AccionCronograma;
  accionActual = 0;
  cronogramaActual = 0;
  accionCronogramaP = AccionCronograma


  parametros: ParametrosCronograma = new ParametrosCronograma();
  options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }

  sbTratamientos: Subscription;
  citas: CronogramaCita_Cita[] = [];

  editable = false;
  mdlHistorialRef: NgbModalRef | undefined;



  _idPreferente = 0;
  _idCita = 0;
  _accionCita = 0;

  disabledTipoServicio: boolean;

  constructor(
    private activateRoute: ActivatedRoute,
    private navBarService: NavBarService,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private frmBuilder: FormBuilder,
    private clienteTipoService: TipoClienteService,
    private sedeService: SedeService,
    private tecnologiaService: TecnologiaService,
    private tipoCitaService: TipoCitaService,
    private servicioService: ServicioService,
    private zonaService: ZonaCorporalService,
    private datePipe: DatePipe,
    private utilService: UtilsService,
    private auth: AuthService,
    private api: CronogramaCitaService,
    private cita360Service: Cita360Service,
    private tratamientoService: TratamientoService,
    private modalService: NgbModal,
  ) {
    // this.initForm();
    // this.initFormRange();

    this.disabledTipoServicio = true;
  }

  ngOnInit(): void {
    this.getData();
    this.initForm();
    this.initFormRange();

    this.getAction();

    if (this.parametros.accionActual === AccionCronograma.VER) {
      this.obtenerCitasPorCronograma(this.parametros.id);
    }


    setTimeout(() => {
      this.obtenerCliente();
      if(this.cliente){
        this.obtenerZonasPorServicioGenero(this.cliente?.idGenero, this.frmGroup.get('idServicio')?.value);
      }
    }, 100)
    this.obtenerTipoCliente();
    this.obtenerSedes();
    this.obtenerTecnologias();
    this.obtenerTiposCita();
    this.obtenerServicios();

    this.navBarService.setShowNavBarTop(true);
    this.drawOptions();

    // this.getData();

    this.ldTratamiento = false;

  }

  ngAfterViewInit(): void {
    // console.log(this.calendario?.citas);
    // this.calendario?._citas.subscribe((res: CronogramaCita_Cita[]) => {
    //   console.log(res);
    // });
  }

  ngOnDestroy(): void {
    this.navBarService.setShowNavBarTop(false);
    this.mdlHistorialRef?.close();
  }

  obtenerTratamiento(event: any){
    const idServicio = parseInt(event.target.value, 10);
    this.obtenerTratamientoPorServicio(idServicio);
  }

  logIdServicio() {
    const valor = this.frmGroup.get('idZona')?.value;
    console.log('Valor actual de idZona:', valor);
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
      idZona: new FormControl('', Validators.required),
      idServicio: new FormControl({value: 0, disabled: false}, Validators.required),
      precio: new FormControl('0.00', Validators.required),
      idTratamiento: new FormControl('', Validators.required),
    });
    this.frmGroup.get('idServicio').valueChanges.subscribe((res) => {
      //this.frmGroup.get('idZona').patchValue('');
      if(res){

        if(this.cliente){
          this.obtenerZonasPorServicioGenero(this.cliente?.idGenero, parseInt(res, 10));

        }
      }else{
        this.tratamientos = [];
      }
    });
    this.frmGroup.get('idSede').valueChanges.subscribe((res: string | null) => {
      if(res){
        this.calendario?.obtenerDisponibles(parseInt(this.f.idServicio.value, 10), parseInt(res, 10));
        // console.log('change',res,this.calendario);
      }
    });
  }
  initFormRange(): void{
    this.frmRange = this.frmBuilder.group({
      range: new FormControl([])
    });
    this.frmRange.get('range').valueChanges.subscribe((res: Date[]) => {
      this.rangoFechas = res;
    });
  }

  asignarCita(){
    const parametro = this.activatedRoute.snapshot.params;
    // const uuid = parametro.uuid;
    const id = parseInt(parametro.id, 10);
    const idCliente = parseInt(parametro.idcliente, 10);
    this.router.navigate(['/Corporal360/Cronograma', id , AccionCronograma.ASIGNARCITAS ,idCliente, this._idPreferente, 0 , 0]);
  }

  drawOptions(): void{

    const options: NavBarMenu[] = [
//       {
//         text: '',
//         type: 'dropdown',
//         class: 'btn sbtn btn-sm btn-icon text-primary bg-primary-light h-auto w-auto px-2 my-auto no-after position-relative align-items-center justify-content-center',
//         disabled: false,
//         onClick : () => {

//         },
//         icon: 'ellipsis-vertical',
//         iconType: 'duotone',
//         visible: true,
//         pulse: true,
//         items: [
// /*          {
//             text: 'Ver',
//             type: 'button',
//             class: 'f-w-500 rounded-0 list-group-item list-group-item-action border-0 d-flex align-items-center text-primary btn-hover-primary trs',
//             disabled: false,
//             onClick : () => {
//               const parametro = this.activatedRoute.snapshot.params;
//               // const uuid = parametro.uuid;
//               const id = parseInt(parametro.id, 10);
//               const idCliente = parseInt(parametro.idcliente, 10);
//               this.router.navigate(['/Corporal360/Cronograma', id , AccionCronograma.VER ,idCliente]);
//             },
//             icon: 'eye',
//             iconType: 'light',
//             visible: true,
//             items: []
//           },*/{
//             text: 'Editar',
//             type: 'button',
//             class: 'f-w-500 rounded-0 list-group-item list-group-item-action border-0 d-flex align-items-center text-warning btn-hover-warning trs',
//             disabled: false,
//             onClick : () => {
//               this.onEdit();
//             },
//             icon: 'pen',
//             iconType: 'light',
//             visible: true,
//             items: []
//           },{
//             text: 'Asignar Citas',
//             type: 'button',
//             class: 'f-w-500 rounded-0 list-group-item list-group-item-action border-0 d-flex align-items-center text-primary btn-hover-primary trs',
//             disabled: false,
//             onClick : () => {
//               const parametro = this.activatedRoute.snapshot.params;
//               // const uuid = parametro.uuid;
//               const id = parseInt(parametro.id, 10);
//               const idCliente = parseInt(parametro.idcliente, 10);
//               this.router.navigate(['/Corporal360/Cronograma', id , AccionCronograma.ASIGNARCITAS ,idCliente, this._idPreferente, 0 , 0]);
//             },
//             icon: 'calendar-circle-plus',
//             iconType: 'light',
//             visible: true,
//             items: []
//           },{
//             text: 'Recargar',
//             type: 'button',
//             class: 'f-w-500 rounded-0 list-group-item list-group-item-action border-0 d-flex align-items-center text-secondary bg-hover-light trs',
//             disabled: false,
//             onClick : () => {
//               this.onReload();
//             },
//             icon: 'reload',
//             iconType: 'light',
//             visible: this.accionActual !== AccionCronograma.NUEVA,
//             items: []
//           }
//           ,{
//             text: 'Ver Historial',
//             type: 'button',
//             class: 'f-w-500 rounded-0 list-group-item list-group-item-action border-0 d-flex align-items-center text-muted btn-hover-muted trs',
//             disabled: false,
//             onClick : () => {
//               this.onViewHistory();
//             },
//             icon: 'clock-rotate-left',
//             iconType: 'light',
//             visible: this.accionActual !== AccionCronograma.NUEVA,
//             items: []
//           }
//         ]
//       },

    ];


    let title = 'Cronograma';
    let subtitle = '';
    let iconClass = '';
    switch (this.accionActual) {
      case AccionCronograma.NUEVA: {
        subtitle = 'Nuevo';
        iconClass = 'text-secondary'
      } break;
      case AccionCronograma.EDITAR: {
        title = `Cronograma: ${this.cronogramaActual}`;
        subtitle = 'Editar';
        iconClass = 'text-warning'
      } break;
      case AccionCronograma.VER: {
        title = `Cronograma: ${this.cronogramaActual}`;
        subtitle = 'Ver';
        iconClass = 'text-primary';
      } break;
      case AccionCronograma.ASIGNARCITAS: {
        title = `Cronograma: ${this.cronogramaActual}`;
        subtitle = 'Asignar Citas';
        iconClass = 'text-primary';
      } break;
      default: subtitle = '' ;break;
    }
    this.navBarService.setNavBarOption({
      menu: options,
      icon: {icon:'calendar-range',width: 30, height: 30, iconClass: iconClass, type: 'duotone'},
      start: true,
      title: {text:title},
      subtitle: {text:subtitle, textClass: `${iconClass} mt-2`},
    });
  }

  async onCreate(): Promise<void>{
    let title = '';
    let text = '';
    switch (this.accionActual) {
      case AccionCronograma.NUEVA:
        title = 'Agendar Cronograma';
        text = 'Desea agendar el cronograma de cita?';
        break;
      case AccionCronograma.EDITAR:
        title = 'Modificar Cronograma';
        text = 'Desea modificar el cronograma de cita?';
        break;
      case AccionCronograma.VER: break;
    }

    this.submitted = true;

    // console.log('precio', this.getPrecio());
    if( await this.validarFormulario()
      // && await this.validarFechas()
    ){
      Swal.fire({
        title: title,
        text: text,
        icon: 'question',
        buttonsStyling: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
          cancelButton: 'btn sbtn btn-light popins mr-2',
        },
        reverseButtons: true
      }).then( async (result) => {
        if (result.value) {
          switch (this.accionActual) {
            case AccionCronograma.NUEVA:
              this.create();
              break;
            case AccionCronograma.EDITAR:
              this.edit();
              break;
          }
        }
      });
    }

  }

  onEdit(): void{
    const parametro = this.activatedRoute.snapshot.params;
    // const uuid = parametro.uuid;
    const id = parseInt(parametro.id, 10);
    const idCliente = parseInt(parametro.idcliente, 10);
    this.router.navigate(['/Corporal360/Cronograma', id , AccionCronograma.EDITAR ,idCliente, this._idPreferente, 0, 0]);
  }

  onReload(): void{
    console.log('Reload');
    const parametro = this.activatedRoute.snapshot.params;
    // const uuid = parametro.uuid;
    const id = parseInt(parametro.id, 10);
    const idCliente = parseInt(parametro.idcliente, 10);
    const accion = parseInt(parametro.accion, 10);
    this.router.navigateByUrl('/Corporal360/Cronograma', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/Corporal360/Cronograma', id , accion ,idCliente, this._idPreferente, 0 ,0]);
    });
  }

  onViewHistory(): void{
    const parametro = this.activatedRoute.snapshot.params;
    // const uuid = parametro.uuid;
    const id = parseInt(parametro.id, 10);
    this.mdlHistorialRef = this.modalService.open(MdlCronogramaHistorialComponent, {size: 'md', windowClass: 'smodal fade2 round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.mdlHistorialRef.componentInstance.IdCronograma = id;
  }

  /***** DATA ***************/

  /* Obtener los datos del cliente */
  obtenerCliente(): void{
    this.ldCliente = true;
    const parametro = this.activatedRoute.snapshot.params;
    const idCliente = parseInt(parametro.idcliente, 10);
    this.clienteService.obtenerById(idCliente).subscribe((res: any) => {
      // console.log(res);
      const cliente = new Cliente();
      cliente.id = res.id;
      cliente.nombres = res.nombres;
      cliente.apellidos = res.apellidos;
      cliente.documento = res.documento;
      cliente.telefono1 = res.celular1;
      cliente.telefono2 = res.celular2;
      cliente.idGenero = res.idGenero;
      this.cliente = cliente;
      this.frmGroup.patchValue({
        cliente: `${res.id} - ${res.nombres} ${res.apellidos}`,
        documento: res.documento,
        telefono: res.celular1 + ' - ' + res.celular2,
      });

      const idGenero = res.idGenero ? res.idGenero : 0;
      this.ldCliente = false;
      this.obtenerZonasPorServicioGenero(idGenero, this.frmGroup.get('idServicio')?.value);
    }, error => {
      console.log(error);
      this.ldCliente = false;
    });
  }
  /* Obtener un listado de los tipos de cliente */
  obtenerTipoCliente(): void {
    this.ldTipoCliente = true;
    this.clienteTipoService.obtenerTipoCliente().subscribe((res: object[]) => {
      // console.log(res);
      this.tiposCliente = res;
      this.ldTipoCliente = false;
    }, error => {
      console.log(error);
      this.ldTipoCliente = false;
    });
  }
  /* Obtener un listado de las sedes */
  obtenerSedes(): void{
    this.ldSede = true;
    this.sedeService.obtener().subscribe((res: object[]) => {
      // console.log(res);
      this.sedes = res;
      this.ldSede = false;
    }, error => {
      console.log(error);
      this.ldSede = false;
    })
  }
  /* Obtener un listado de las tecnologias por servicio */
  obtenerTecnologias(): void{
    this.ldTecnologia = true;
    this.tecnologiaService.listarByServicio(3).subscribe((res: Tecnologia[]) => {
      // console.log(res);
      this.tecnologias = res;
      this.ldTecnologia = false;
    }, error => {
      console.log(error);
      this.ldTecnologia = false;
    })
  }
  /* Obtener un listado de los tipos de cita */
  obtenerTiposCita(): void{
    this.ldTipoCita = true;
    this.tipoCitaService.obtenerTipoCita().subscribe((res: object[]) => {
      // console.log(res);
      this.tiposCita = res;
      this.ldTipoCita = false;
    }, error => {
      console.log(error);
      this.ldTipoCita = false;
    });
  }
  /* Obtener un listado de los servicios */
  obtenerServicios(): void{
    this.ldServicio = true;
    this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
      // console.log(res);
      const solo360 = res.filter(x => x.id === 3);
      this.servicios = solo360;
      this.ldServicio = false;
    }, error => {
      console.log(error);
      this.ldServicio = false;
    });
  }
  /* Obtener un listado de las zonas corporales por servicio */
  obtenerZonasPorServicioGenero(idGenero: number, idServicio: number): void{
    this.ldZonas = true;
    this.zonaService.zonaCorporalByGeneroByServicioListar(idGenero, idServicio).subscribe((res: any[]) => {
      this.zonas = res;
      this.ldZonas = false;
    }, error => {
      console.log(error);
      this.ldZonas = false;
    });
  }
  /* Obtener un listado de citas por cronograma */
  obtenerCitasPorCronograma(idCronograma: number): void{
    // this.ldCitas = true;
    this.cita360Service.findByCronograma(idCronograma).subscribe((res: Cita[]) => {
      console.log(res);
    }, error => {
      console.log(error);
    });
  }
  /* Obtener un listado de los tratamientos */
  obtenerTratamientoPorServicio(idServicio: number): void{
    this.ldTratamiento = true;
    this.sbTratamientos = this.tratamientoService.listarByServicio(idServicio).subscribe((res) => {
      this.tratamientos = res;
      this.ldTratamiento = false;
    }, error => {
      console.log(error);
      this.ldTratamiento = false;
    })
  }

  // validators
  async validarFormulario(): Promise<boolean>{
    if(this.f.idSede.invalid){
      this.utilService.mostrarToast('Seleccionar sede', 'warning');
      return false;
    }
    if(this.f.idServicio.invalid){
      this.utilService.mostrarToast('Seleccionar servicio', 'warning');
      return false;
    }
    if(this.f.idZona.invalid){
      this.utilService.mostrarToast('Seleccionar zona', 'warning');
      return false;
    }
    if(this.f.idTipoCliente.invalid){
      this.utilService.mostrarToast('Seleccionar tipo de cliente', 'warning');
      return false;
    }
    if(this.f.idTratamiento.invalid){
      this.utilService.mostrarToast('Seleccionar el tratamiento', 'warning');
      return false;
    }
    // if(this.getPrecio() === 0){
    //   this.utilService.mostrarToast('Ingresar el valor del precio', 'warning');
    //   return false;
    // }
    // if(this.f.precio.invalid || parseFloat(this.f.precio.value) === 0){
    //   this.utilService.mostrarToast('Ingresar el precio', 'warning');
    //   return false;
    // }
    return true;
  }
  // async validarFechas(): Promise<boolean>{
  //   if(!this.tabla.weeks.length){
  //     this.utilService.mostrarToast('Agregar semanas al cronograma', 'warning');
  //     return false;
  //   }
  //
  //   if(this.tabla.weeks.filter(x => x.dias.filter(y => !y.cita).length === x.dias.length).length){
  //     this.utilService.mostrarToast('Existen semanas sin citas asignadas', 'warning');
  //     return false;
  //   }
  //
  //   return true;
  // }

  // getters
  get f(): any{
    return this.frmGroup.controls;
  }

  get model(): CronogramaCita{
    const parametro = this.activatedRoute.snapshot.params;
    const idCronograma = parseInt(parametro.id, 10);

    const m = new CronogramaCita();
    m.id = idCronograma;
    m.idCliente = this.cliente?.id;
    m.idSede = parseInt(this.f.idSede.value, 10);
    m.idTipoCliente = parseInt(this.f.idTipoCliente.value, 10);
    m.idServicio = parseInt(this.f.idServicio.value, 10);
    m.idZona = parseInt(this.f.idZona.value, 10);
    m.idTratamiento = parseInt(this.f.idTratamiento.value, 10);
    m.precio = this.getPrecio();
    // m.semanas = this.tabla.weeks.map( x => {
    //   const s = new CronogramaCitaSemana();
    //   s.inicio = x.dias[0].date;
    //   s.fin = x.dias[x.dias.length - 1].date;
    //   console.log(s);
    //   return s;
    // });
    m.idUsuarioRegistro = this.auth.getUser().id;
    m.idPreferente = this._idPreferente;

    return m;
  }





  // form
  create(): void{
    const parametro = this.activatedRoute.snapshot.params;
    //const uuid = parametro.uuid;
    const idCliente = parseInt(parametro.idcliente, 10);
    this._idPreferente = parseInt(parametro.idPreferente, 10);

    this.api.create(this.model).subscribe(async (res: number | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        this.utilService.mostrarToast(res.message, 'error');
      }else{
        this.router.navigate(['/Corporal360/Cronograma', res , AccionCronograma.ASIGNARCITAS ,idCliente, this._idPreferente, 0, 0]);
      }
    }, error => {
      console.log(error);
      this.utilService.mostrarToast('Ocurrio un eror al intentar registrar el cronograma', 'error');
    });
  }

  edit(): void{
    const parametro = this.activatedRoute.snapshot.params;
    //const uuid = parametro.uuid;
    const idCliente = parseInt(parametro.idcliente, 10);
    this.api.update(this.model).subscribe(async (res: boolean | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        this.utilService.mostrarToast(res.message, 'error');
      }else{
        Swal.fire({
          title: 'Se modificaron los datos del cronograma con exito',
          icon: 'question',
          buttonsStyling: false,
          confirmButtonText: 'Aceptar',
          showCancelButton: false,
          customClass: {
            confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
          },
          reverseButtons: true,
          timer: 1500
        });
        this.router.navigate(['/Corporal360/Cronograma', this.model.id , AccionCronograma.ASIGNARCITAS ,idCliente, this._idPreferente, 0, 0]);
      }
    }, error => {
      console.log(error);
      this.utilService.mostrarToast('Ocurrio un eror al intentar registrar el cronograma', 'error');
    });
  }

  listarCitas(data: CronogramaCita_Cita[]):void{
    this.citas = data;
    if(this.citas.length < 2){
      this.editable = true;
    }
  }

  /***** Getters *****/
  getPrecio(): number{
    if(this.f.precio.value){
      return parseFloat(this.f.precio.value);
    }
    return 0;
  }


  /***** Functions ******/

  /**/
  async showAvailable(): Promise<void>{
    if(await this.validarFormulario()){
      this.calendario.obtenerDisponibles(parseInt(this.f.idServicio.value, 10), parseInt(this.f.idSede.value, 10));
    }
    return;
  }

  /* Obtener el estado actual del registro */
  getAction(): void{
    const parametro = this.activatedRoute.snapshot.params;
    this.accionActual = parseInt(parametro.accion, 10);
    this.cronogramaActual = parseInt(parametro.id, 10);
    this._idPreferente = parseInt(parametro.idPreferente, 10);
    this._idCita = parseInt(parametro.idCita, 10);
    this._accionCita = parseInt(parametro.accionCita, 10);

    this.parametros.accionActual = parseInt(parametro.accion, 10);
    this.parametros.id = parseInt(parametro.id, 10);
    this.parametros.idCliente = parseInt(parametro.idcliente, 10);
    // this.parametros.uuid = parametro.uuid;
  }
  /* Obtener los datos del cronograma */
  getData(): void{
    const parametro = this.activatedRoute.snapshot.params;
    // const uuid = parametro.uuid;
    const id = parseInt(parametro.id, 10);
    if(!id){
      return;
    }
    this.api.find(id).subscribe(async (res: CronogramaCita | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        this.utilService.mostrarToast(res.message, 'error');
      }else{
        await this.frmGroup.patchValue({
          idSede: res.idSede,
          idTipoCliente: res.idTipoCliente,
          idServicio: res.idServicio,
          idTratamiento: res.idTratamiento,
          idZona: res.idZona,
          precio: res.precio,
        });
          
        const valor = this.frmGroup.get('idZona')?.value;

        this.obtenerTratamientoPorServicio(this.frmGroup.get('idServicio')?.value);

      }
    }, error => {
      this.utilService.mostrarToast('Ocurrio un error al intentar obtener el cronograma', 'error');
      console.log('');
    });

  }
  /* Ir al perfil del cliente */
  goToClient(idCliente: number): void{
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/ClientePerfil/${idCliente}`])
    );
    window.open(url, '_blank');
  }


}
