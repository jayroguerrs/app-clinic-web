import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CitaDetalle} from "../../../../shared/models/corporal-360/Cita";
import {GroupButtonComponent} from "../../../group-button/group-button.component";
import {AuthService} from "../../../../shared/services/auth.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Servicio} from "../../../../shared/models/servicio";
import {TecnologiaService} from "../../../../shared/services/tecnologia.service";
import {Tecnologia} from "../../../../shared/models/tecnologia";
import {Subscription} from "rxjs";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import Swal from "sweetalert2";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import { ServicioService } from 'src/app/shared/services/corporal360/servicio.service';

@Component({
  selector: 'submdl-seleccionar-tecnologias',
  templateUrl: './submdl-seleccionar-tecnologias.component.html',
  styleUrls: ['./submdl-seleccionar-tecnologias.component.scss']
})


export class SubmdlSeleccionarTecnologiasComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() Servicio: Servicio | null = null;
  @Input() IdServicio: number = 0;
  @Input() IdTratamiento: number = 0;
  @Input() Fecha: Date = new Date();
  @Input() TecnologiasActived: Tecnologia[] = [];

  @Output() OnSelect: EventEmitter<Tecnologia[]> = new EventEmitter();

  /////////////////////
  @Input() TecnologiasSelected: Tecnologia[] = [];


  idServicio: FormControl;

  tecnologias: Tecnologia[] = [];
  tecnologiasSelected: Tecnologia[] = [];
  servicios: Servicio[] = [];

  servicio: Servicio | null = null;
  ldServicio = false;
  sbServicio: Subscription;


  ldTecnologias = false;
  sbTecnologias: Subscription;

  // form
  submitted = false;


  constructor(
    private frmBuilder: FormBuilder,
    private authService: AuthService,
    public bsModalRef: NgbActiveModal,
    private servicioService: ServicioService,
    private tecnologiaService: TecnologiaService,
    private util: UtilsService
  ) {
    this.idServicio = new FormControl('', Validators.required);
    this.idServicio.valueChanges.subscribe((res) => {
      this.tecnologias = [];
      if (res) {
        this.listarTecnologiasByServicio(parseInt(res, 10));
      }
    });
  }

  ngOnInit(): void {
    this.obtenerServicio();
  }

  ngAfterViewInit(): void {
    this.tecnologiasSelected = [...this.TecnologiasSelected];
    if(this.IdServicio){
      this.idServicio.patchValue(this.IdServicio);
    }
  }

  ngOnDestroy(): void {
    this.bsModalRef?.close();
  }

  // Events
  onClose(): void {
    this.bsModalRef.close();
  }
  onChangeMinutos(index: number, event: any): void{
    this.tecnologiasSelected.find((x,i) => i === index).minutos = parseInt(event.target.value, 10);
  }
  async onSubmit(): Promise<void>{
    // Swal.fire({
    //   title: `Añadir tecnologías`,
    //   text: 'Desea añadir las tecnologias seleccionadas?',
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
    //     this.submitted = true;
    //
    //     if(!this.tecnologiasSelected.length){
    //       this.util.mostrarToast('Debe seleccionar minimo una tecnología','warning');
    //       return;
    //     }
    //
    //     const res = await this.validarSeleccionados();
    //     if(res){
    //       this.OnSelect.emit(this.tecnologiasSelected);
    //       this.onClose();
    //     }
    //   }
    // });
    this.submitted = true;

    if(!this.tecnologiasSelected.length){
      this.util.mostrarToast('Debe seleccionar minimo una tecnología','warning');
      return;
    }

    const res = await this.validarSeleccionados();
    if(res){
      this.OnSelect.emit(this.tecnologiasSelected);
      this.onClose();
    }
  }


  // Data
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
  // listarServicios(): void{
  //   this.ldServicios = true;
  //   this.servicioService.listarByEstado(1).subscribe((res: Servicio[]) => {
  //     this.servicios = res;
  //     this.ldServicios = false;
  //   }, error => {
  //     console.log(error);
  //     this.ldServicios = false;
  //   });
  // }
  listarTecnologiasByServicio(idServicio: number): void{
    this.ldTecnologias = true;
    this.sbTecnologias = this.tecnologiaService.listarByServicio(idServicio).subscribe((res: Tecnologia[]) => {
      this.tecnologias = res.filter(x => this.TecnologiasActived.map(y => y.id).includes(x.id) && !this.TecnologiasSelected.map(y => y.id).includes(x.id)).map(x => {
        if(this.IdTratamiento === 5 && idServicio === 3){
          x.minutos = 50;
          return x;
        }
        x.minutos = 60; 
        return x; 
      });
      this.ldTecnologias = false;
    }, error => {
      console.log(error);
      this.ldTecnologias = false;
    });
  }

  // Functions
  drop(event: CdkDragDrop<Tecnologia[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      event.previousContainer.data.find((x, i) => i == event.previousIndex).minutos = 10;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log(event.container.data);
    }
  }
  dropSeleccionadas(event: CdkDragDrop<Tecnologia[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  async validarSeleccionados(): Promise<boolean>{
    if(this.tecnologiasSelected.filter(x => x.minutos === 0).length){
      this.util.mostrarToast('Tienes pendiente en seleccionar minuto por tecnología.','warning');
      return false;
    }
    return true;
  }


}


