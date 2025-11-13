import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CitaMensajeDetalle} from 'src/app/shared/models/corporal-360/Cita';
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {CitaMensajeDetalleService} from "../../../shared/services/cita-mensaje-detalle.service";
import Swal from "sweetalert2";
import {ParametrosCronograma} from "../../../shared/models/corporal-360/Parametros";
import {AccionCita, CitaEstado} from "../../../shared/enumeracion/enums";

@Component({
  selector: 'app-cita-mensaje-detalle',
  templateUrl: './cita-mensaje-detalle.component.html',
  styleUrls: ['./cita-mensaje-detalle.component.scss']
})
export class CitaMensajeDetalleComponent implements OnInit, AfterViewInit, OnDestroy {
  parametros: ParametrosCronograma = new ParametrosCronograma();

  @ViewChild('scroll') scroll: ElementRef;

  @Input() IdCita: number = 0;
  @Input() IdCitaEstado: number = 0;
  @Input() MaxHeight: number = 100;
  @Input() set Parametros(val: ParametrosCronograma) {
    this.parametros = {...val};
  }


  collection: CitaMensajeDetalle[] = [];
  _collection = new BehaviorSubject<CitaMensajeDetalle[]>([]);

  subcription: Subscription;

  frmGroup: FormGroup;
  private loading = false;
  private submitted = false;

  accionCita = AccionCita;
  citaEstado = CitaEstado;


  constructor(
    private citaMensajeDetalleService : CitaMensajeDetalleService,
    private frmBuilder: FormBuilder,
    private authService: AuthService,
    public utilService: UtilsService
  ) {
    this.frmGroup = this.frmBuilder.group({
      mensaje: new FormControl(null, Validators.required),
      destacado: new FormControl(false, Validators.required),
    });
  }

  ngOnInit(): void {
    this.listarMensajes();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    this.subcription?.unsubscribe();
  }

  // data
  listarMensajes(): void{
    this.loading = true;
    this.subcription = this.citaMensajeDetalleService.obtenerByIdCita(this.IdCita).subscribe((res: CitaMensajeDetalle[]) => {
      this.collection = res;
      this._collection.next(res);
      this.loading = false;
      // console.log(res);
    }, error => {
      this.loading = false;
      console.log('No se pudo obtener el listado de mensajes de aviso', error);
    });
  }

  // getters
  get f(): any{
    return this.frmGroup.controls;
  }

  // events
  add(): void{
    if(this.frmGroup.invalid){ return; }
    const model = new CitaMensajeDetalle();
    model.id = 0;
    model.texto = this.f.mensaje.value;
    model.destacado = this.f.destacado.value;
    model.fechaRegistro = new Date();
    model.idUsuarioRegistro = this.authService.getUser().id;
    model.usuarioRegistro = this.authService.getUser().name;
    model.borrar = true;
    this.collection.push(model);
    this._collection.next(this.collection);
    this.f.mensaje.patchValue(null);
    this.f.destacado.patchValue(false);

    setTimeout(()=>{
      this.scroll.nativeElement.scrollTo(0,this.scroll.nativeElement.scrollHeight);
    }, 10)

  }

  remove(index: number): void{
    this.collection = this.collection.filter((x,i) => i !== index);
    this._collection.next(this.collection);
    setTimeout(()=>{
      this.scroll.nativeElement.scrollTo(0,this.scroll.nativeElement.scrollHeight);
    }, 10)
  }

  clear(): void{
      Swal.fire({
        title: `Eliminar contenido de detalles`,
        text: 'Desea eliminar todo el contenido de detalles?',
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
      }).then( (result) => {
        if (result.value) {
          this.collection = [];
          this._collection.next([]);
        }
      });
  }

  // getters
  get hasValue(): boolean{
    return !!this.f.mensaje.value;
  }
  get getSubmitted(): boolean{
    return this.submitted;
  }
  get getLoading(): boolean{
    return this.loading;
  }

  // setters
  setSubmitted(e: boolean): void{
    this.submitted = e;
  }

}
