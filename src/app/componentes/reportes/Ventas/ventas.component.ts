import {AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {SedeService} from "../../../shared/services/sede.service";
import {ZonaCorporalService} from "../../../shared/services/zona-corporal.service";
import {NgxSpinnerService} from "ngx-spinner";
import {RSede} from "../../../shared/interfaces/Response/sede";
import {Subscription} from "rxjs";
import {GeneroService} from "../../../shared/services/genero.service";

@Component({
  //selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
  providers: [DatePipe]
})
export class VentasComponent implements OnInit, AfterViewInit, OnDestroy {

  // Spinner
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  today: Date;

  // Formulario
  submitted = false;
  formGroup: FormGroup;

  loadingSede = false;
  collectionSede: RSede[] = [];
  subscripcionSede: Subscription;

  loadingGenero = false;
  generos: any[] = [];
  generoDescripcion: string = 'Todos';
  sede: string = 'Todos';

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private api: ZonaCorporalService,
    private spinner: NgxSpinnerService,
    private generoService: GeneroService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone
  ) {
    this.today = new Date();

    this.formGroup = this.formBuilder.group({
      idSede: new FormControl(0),
      idGenero: new FormControl(0),
      fdesde: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
      fhasta: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
    });

    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
      {threshold: [1]}
    );
  }

  ngOnInit(): void {
    this.obtenerSedes();
    this.listarGeneros();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscripcionSede){ this.subscripcionSede.unsubscribe(); }
  }

  // Getters
  get f(): any{
    return this.formGroup.controls;
  }

  // Obtener data
  obtenerSedes(): void{
    this.loadingSede = true;
    this.subscripcionSede = this.sedeService.obtener().subscribe((res: any[]) => {
      const collection: RSede[] = [];
      res.forEach((el) => {
        const sede: RSede = {
          id: el.idSede,
          nombre: el.nombre
        };
        collection.push(sede);
      });

      this.collectionSede = collection;
      // console.log(collection);
      this.loadingSede = false;
    }, error => {
      console.log(error);
      this.loadingSede = false;
    }, () => {
      this.loadingSede = false;
    });
  }

  listarGeneros(): void{
    this.loadingGenero = true;
    this.generoService.obtenerTodos().subscribe((res) => {
      this.generos = res;
      this.loadingGenero = false;
    }, error => {
      this.loadingGenero = false;
      console.log(error);
    });
  }


  // On Submit
  obtenerReporte(): void{

    this.submitted = true;

    if( this.formGroup.invalid ){
      this.utilsService.mostrarToast('Seleccionar rango de fechas','error');
      return;
    }
    this.generoDescripcion = this.f.idGenero.value ? this.generos.find(x => x.id === parseInt(this.f.idGenero.value,10) )?.descripcion : 'Todos';
    this.sede = this.f.idSede.value ? this.collectionSede.find(x => x.id === parseInt(this.f.idSede.value,10) )?.nombre : 'Todos';

    // this.dataTable.ajax.reload();

  }

}
