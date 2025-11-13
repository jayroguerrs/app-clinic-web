import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';

import Swal from 'sweetalert2';

import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ParametrosCronograma} from "../../../../shared/models/corporal-360/Parametros";
import {BehaviorSubject, Subscription} from "rxjs";
import {MaquinaSede360Service} from "../../../../shared/services/corporal360/maquina-sede360.service";
import {MaquinaSede} from "../../../../shared/models/corporal-360/MaquinaSede";
import {DatePipe} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {SedeService} from "../../../../shared/services/sede.service";
import {ServicioService} from "../../../../shared/services/corporal360/servicio.service";
import {Servicio} from "../../../../shared/models/corporal-360/servicio";
import {Sede} from "../../../../shared/models/sede";
import {ErrorSistema} from "../../../../shared/models/error-sistema";


@Component({
  selector: 'submdl-maquina-sede',
  templateUrl: './submdl-maquina-sede.component.html',
  styleUrls: ['./submdl-maquina-sede.component.scss'],
  animations: [
    trigger('slideFromBottom', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('300ms {{delay}}ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ], { params: { delay: 10 } })
    ])
  ]
})

export class SubmdlMaquinaSedeComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  parametros: ParametrosCronograma = new ParametrosCronograma();
  _parametros: BehaviorSubject<ParametrosCronograma> = new BehaviorSubject<ParametrosCronograma>(new ParametrosCronograma);

  @Input() Fecha: Date;
  @Input() IdServicio: number = 0;
  @Input() IdSede: number = 0;
  @Output() OnSelectMachine = new EventEmitter<MaquinaSede>();


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

  subscription: Subscription;
  maquinas: MaquinaSede[] = [];
  ldMaquinas = false;

  servicio: Servicio | null;
  ldServicio = false;
  sbServicio: Subscription;
  sede: Sede | null;
  ldSede = false;
  sbSede: Subscription;

  constructor(
    public bsModalRef: NgbActiveModal,
    public util: UtilsService,
    private api: MaquinaSede360Service,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private servicioService: ServicioService
  ) {
    this.ldSede = false;
  }

  ngOnInit(): void {

    // this.obtenerMaquinas();
  }

  ngAfterViewInit(): void {
    this.obtenerMaquinas();
    this.obtenerSede();
    this.obtenerServicio();
  }

  ngOnDestroy(): void {
    this.bsModalRef?.close();
    this.subscription?.unsubscribe();
    this.sbSede?.unsubscribe();
    this.sbServicio?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onClose(): void{
    this.bsModalRef.close();
  }

  // EVENTS
  seleccionarMaquina(maquina: MaquinaSede): void{
    this.OnSelectMachine.emit(maquina);
    // this.bsModalRef.close();
  }

  // DATA
  obtenerMaquinas(): void{
    this.ldMaquinas = true;
    this.subscription = this.api.listByDate(this.datePipe.transform(this.Fecha,'yyyy-MM-dd'), this.IdServicio, this.IdSede).subscribe((res: MaquinaSede[]) => {
      this.maquinas = res;
      this.ldMaquinas = false;
    }, error => {
      console.log(error);
      this.ldMaquinas = false;
    })
  }
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

}


