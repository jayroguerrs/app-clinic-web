import {AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RSede} from "../../../shared/interfaces/Response/sede";
import {Subscription} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {SedeService} from "../../../shared/services/sede.service";
import {NgxSpinnerService} from "ngx-spinner";
import { CitaPromocion } from 'src/app/shared/models/cita';
import {DataTableDirective} from "angular-datatables";
import {CitaService} from "../../../shared/services/cita.service";
import { Promocion } from 'src/app/shared/models/promocion';
import { PromocionService } from 'src/app/shared/services/promocion.services';
import {PromocionTop10ZonasComponent} from "./VentasPromocionComponentes/promocion-top10-zonas/promocion-top10-zonas.component";
import {PromocionBottom10ZonasComponent} from "./VentasPromocionComponentes/promocion-bottom10-zonas/promocion-bottom10-zonas.component";
import {PromocionZonasRankingComponent} from "./VentasPromocionComponentes/promocion-zonas-ranking/promocion-zonas-ranking.component";
import {PromocionVentasRangoComponent} from "./VentasPromocionComponentes/promocion-ventas-rango/promocion-ventas-rango.component";

@Component({
  //selector: 'app-cita-promocion',
  templateUrl: './promocion-ranking-ventas.component.html',
  styleUrls: ['./promocion-ranking-ventas.component.scss']
})
export class PromocionRankingVentasComponent implements OnInit, AfterViewInit, OnDestroy {

  // Spinner
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  today: Date;

  // Formulario
  submitted = false;
  formGroup: FormGroup;

  loadingSede = false;
  collectionSede: RSede[] = [];
  subscripcionSede: Subscription;


  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  dataTable: any;

  collectionCitas: CitaPromocion[] = [];
  loadingCitas = false;
  subscriptionCitas : Subscription;

  collectionPromocion: Promocion[] = [];
  loadingPromocion = false;
  subscriptionPromocion: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private promocionService: PromocionService,
    private spinner: NgxSpinnerService,
    private citaService: CitaService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone
  ) {
    this.today = new Date();

    this.formGroup = this.formBuilder.group({
      idSede: new FormControl(0),
      idPromocion: new FormControl(0),
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
    this.obtenerPromociones();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
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
  obtenerPromociones(): void{
    this.loadingPromocion = true;
    this.subscripcionSede = this.promocionService.obtener(1).subscribe((res: any[]) => {
      // console.log(res);
      const collection: Promocion[] = [];
      res.forEach((el) => {
        const promo = new Promocion();
        promo.id = el.idPromocion;
        promo.nombre = el.descripcion;
        promo.idEstado = el.activo;
        promo.fechaInicio = el.fechaInicio;
        promo.fechaFin = el.fechaFin;

        collection.push(promo);
      });

      this.collectionPromocion = collection;
      // console.log(collection);
      this.loadingPromocion = false;
    }, error => {
      console.log(error);
      this.loadingPromocion = false;
    }, () => {
      this.loadingPromocion = false;
    });
  }

  // On Submit
  obtenerReporte(): void{

    this.submitted = true;

    if( this.formGroup.invalid ){
      this.utilsService.mostrarToast('Seleccionar rango de fechas','error');
      return;
    }

    // this.dataTable.ajax.reload();
    // console.log('reload');

  }

  reload(ventasRango: PromocionVentasRangoComponent,promocionTop10Zonas: PromocionTop10ZonasComponent,promocionBottom10Zonas: PromocionBottom10ZonasComponent,promocionZonasRanking: PromocionZonasRankingComponent): void{
    this.submitted = true;

    if( this.formGroup.invalid ){
      this.utilsService.mostrarToast('Seleccionar rango de fechas','error');
      return;
    }

    ventasRango.reloadTable();
    promocionTop10Zonas.reloadTable();
    promocionBottom10Zonas.reloadTable();
    promocionZonasRanking.reloadTable();
  }

}
