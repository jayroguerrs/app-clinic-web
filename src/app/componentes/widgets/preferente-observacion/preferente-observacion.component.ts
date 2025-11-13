import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import Swal from "sweetalert2";
import {ParametrosCronograma} from "../../../shared/models/corporal-360/Parametros";
import {PreferenteObservacion} from "../../../shared/models/preferente.model";

@Component({
  selector: 'app-preferente-observacion',
  templateUrl: './preferente-observacion.component.html',
  styleUrls: ['./preferente-observacion.component.scss']
})
export class PreferenteObservacionComponent implements OnInit, AfterViewInit, OnDestroy {
  parametros: ParametrosCronograma = new ParametrosCronograma();

  @ViewChild('scroll') scroll: ElementRef;

  @Input() IdPreferente: number = 0;
  @Input() MaxHeight: number = 100;


  collection: PreferenteObservacion[] = [];
  _collection = new BehaviorSubject<PreferenteObservacion[]>([]);

  subcription: Subscription;

  frmGroup: FormGroup;
  private loading = false;
  private submitted = false;


  constructor(
    private frmBuilder: FormBuilder,
    private authService: AuthService,
    public utilService: UtilsService
  ) {
    this.frmGroup = this.frmBuilder.group({
      observacion: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    this.subcription?.unsubscribe();
  }


  // getters
  get f(): any{
    return this.frmGroup.controls;
  }

  // events
  add(): void{
    if(this.frmGroup.invalid){ return; }
    const model = new PreferenteObservacion();
    model.id = 0;
    model.idPreferente = this.IdPreferente;
    model.observacion = this.f.observacion.value;
    model.fechaRegistro = new Date();
    model.idUsuarioRegistro = this.authService.getUser().id;
    model.usuarioRegistro = this.authService.getUser().name;
    this.collection.push(model);
    this._collection.next(this.collection);
    this.f.observacion.patchValue(null);

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
        title: `Eliminar contenido de observaciones`,
        text: 'Desea eliminar todo el contenido de observaciones?',
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
    return !!this.f.observacion.value;
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
