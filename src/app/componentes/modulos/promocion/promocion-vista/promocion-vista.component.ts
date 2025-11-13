import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from 'src/app/shared/services/funciones/utils.service';
import {PromocionService} from 'src/app/shared/services/promocion.services';
import {PriceBlock, PromotionDetail, PromotionTemplate} from "../../../../shared/interfaces/promotion";
import {Observable} from "rxjs/Observable";
import {FormControl} from '@angular/forms';
import {map, startWith} from "rxjs/operators";
import {Subscription} from "rxjs";
import {PromocionCategoriaService} from "../../../../shared/services/promocion-categoria.service";
import { ServicioService } from 'src/app/shared/services/servicio.service';
import {Servicio} from "../../../../shared/models/servicio";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-promocion-vista',
  templateUrl: './promocion-vista.component.html',
  styleUrls: ['./promocion-vista.component.scss'],
  animations: [
    trigger('slideFromBottom', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(15px)' }),
        animate('300ms {{delay}}ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ], { params: { delay: 10 } })
    ]),
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class PromocionVistaComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ViewChild('acc') acc !: NgbAccordion;

  active = 0;
  promociones = [];
  ldPromociones = false;
  ldDetalles = false;

  promocionDetalles = [];
  promocionDetallesHombre = [];
  promocionDetallesMujer = [];

  promocionPlantillas = [];
  promocionCondicionado: any;

  columnasPrecioBloque = [];

  // Interfaces
  filtrarZona = new FormControl();

  _promocioneDetalles: PromotionDetail[] = [];
  _promocioneDetallesHombre: PromotionDetail[] = [];
  _promocionesDetallesMujer: PromotionDetail[] = [];

  _promocionDetallesHombreFilter: Observable<PromotionDetail[]>;
  _promocionDetallesMujerFilter: Observable<PromotionDetail[]>;

  _promocionPlantillas: PromotionTemplate[];

  // Subscripciones
  subscriptionPromociones: Subscription;
  subscriptionCondicionado: Subscription;
  subscriptionPlantilla: Subscription;
  subscriptionObtenerDetalle: Subscription;

  // Loadings
  loadingCondicionado = true;

  categoria = new FormControl(null);
  options = {
    width: '100%',
    theme: "classic",
    placeholder: '--Seleccionar--',
    containerCssClass: "form-control", // For Select2 v4.0
    selectionCssClass: "select2--small", // For Select2 v4.1
    // dropdownCssClass: "select2--small",
  }


  servicios: Servicio[] = [];
  ldServicios = false;
  sbcServicios: Subscription | undefined;
  servicioSelected: Servicio | null = null;
  promocionSelected: any | null =null;
  collapsed = true;

  constructor(
    private promocionService: PromocionService,
    private utilsService: UtilsService,
    private promocionCategoriaService: PromocionCategoriaService,
    private servicioService: ServicioService
  ) {
    this._promocionPlantillas = [];
  }

  ngOnInit(): void {

    //this.obtenerPromociones();
    // this.obtenerCategorias();

    this._promocionDetallesHombreFilter = this.filtrarZona.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDetallesHombre(value))
    );

    this._promocionDetallesMujerFilter = this.filtrarZona.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDetallesMujer(value))
    );

    this.categoria.valueChanges.subscribe((res) => {
      this.obtenerPromocionesPorCategoria(parseInt(res, 10));
    });

    //console.log('mobile', this.isMobile());
  }

  ngAfterViewInit(): void {
    this.obtenerServicios();
  }

  ngOnDestroy(): void {
    if (this.subscriptionPromociones){ this.subscriptionPromociones.unsubscribe(); }
    if (this.subscriptionCondicionado){ this.subscriptionCondicionado.unsubscribe(); }
    if (this.subscriptionPlantilla){ this.subscriptionPlantilla.unsubscribe(); }
    this.sbcServicios?.unsubscribe();
  }

  /*****************************************************************************************************
   * Getters
   */
  servicioIsSelected(element: Servicio): boolean{
    return this.servicioSelected ? (element.id === this.servicioSelected.id) : false;
  }
  promocionIsSelected(element: any): boolean{
    return this.promocionSelected ? (element.idPromocion === this.promocionSelected.idPromocion) : false;
  }

  obtenerPromocionesPorServicio(idServicio: number): void {
    this.subscriptionPromociones?.unsubscribe();
    this.ldPromociones = true;
    this.subscriptionPromociones = this.promocionService.obtenerParaModuloByServicio(1, idServicio).subscribe(
      resultado => {
        this.promociones = resultado;
        this.ldPromociones = false;
        // if(this.promociones.length > 0) {
        //   this.obtenerPromocionDetalle(this.promociones[0].idPromocion);
        //   // this.acc?.collapseAll();
        // }
      },error => {
        this.utilsService.mostrarToast('Ocurrio un error al intentar obtener las promociones', 'error');
        this.ldPromociones = false;
      }
    );
  }

  obtenerPromocionesPorCategoria(idCategoria: number): void {
    this.subscriptionPromociones = this.promocionService.obtenerByCategoria(idCategoria).subscribe(
      (resultado: any[]) => {
        this.promociones = resultado;
        if(this.promociones.length > 0) {
          this.obtenerPromocionDetalle(this.promociones[0].idPromocion);
          // this.acc?.collapseAll();
        }else{
          this.obtenerPromocionDetalle(0);
        }
      }
    );
  }

  obtenerPromocionDetalle(promocion: any): void {

    this.collapse();
    this.promocionSelected = promocion;

    const idPromocion = promocion.idPromocion;

    this.filtrarZona.setValue('');

    this.subscriptionObtenerDetalle?.unsubscribe();
    this.ldDetalles = true;
    this.subscriptionObtenerDetalle = this.promocionService.obtenerDetalle(idPromocion).subscribe(
      (resultado: any[]) => {

        console.log('resultado',resultado);

        if(resultado.length > 0) {
          this.promocionDetalles = resultado;
          this.promocionDetallesHombre = this.promocionDetalles.filter(x => x.idGenero == 1);
          this.promocionDetallesMujer = this.promocionDetalles.filter(x => x.idGenero == 2);
          this.columnasPrecioBloque = this.promocionDetalles[0].precioBloques;

          this._promocioneDetallesHombre = this.filtrarPorGenero( this.promocionDetalles, 1 );
          this._promocionesDetallesMujer = this.filtrarPorGenero( this.promocionDetalles, 2 );

          this.filtrarZona.setValue('');

        } else {
          this.utilsService.mostrarToast('No hay datos para mostrar', 'warning');
          this.promocionDetalles = [];
          this.promocionDetallesHombre = [];
          this.promocionDetallesMujer = [];
          this.columnasPrecioBloque = [];
          this.promocionCondicionado = null;
          this._promocioneDetallesHombre = this.filtrarPorGenero( this.promocionDetalles, 1 );
          this._promocionesDetallesMujer = this.filtrarPorGenero( this.promocionDetalles, 2 );
          this.filtrarZona.setValue('');
        }

        this.ldDetalles = false;

      }, error => {
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error al intentar obtener las plantillas', 'error');
        this.ldDetalles = false;
      }
    );

    this.loadingCondicionado = true;
    this.subscriptionCondicionado = this.promocionService.obtenerCondicionado(idPromocion).subscribe(
      resultado => {
        this.promocionCondicionado = resultado;

      }, err => { }, () => {
        this.loadingCondicionado = false;
      }
    );

    this.subscriptionPlantilla = this.promocionService.obtenerPlantilla(idPromocion).subscribe(
      (resultado) => {
        this.promocionPlantillas = resultado;

        resultado.forEach((item) => {
          const plantilla: PromotionTemplate = {
            idPromotionPrice: item['idPromocionPrecio'],
            idPromotionZone: item['idPromocionZona'],
            idPromotionBlock: item['idPromocionBloque'],
            price: item['precio'],
            template: item['plantilla'],
            descriptionBlock: item['descripcionBloque']
          }
          this._promocionPlantillas.push(plantilla);
        });
        // console.log(this._promocionPlantillas);
      }, err => {}, () => { /* console.log('plantillas', this._promocionPlantillas); */ }
    );

  }

  copyToClipboard(texto: string): void{
    const el = document.createElement('textarea');
    el.value = texto;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.utilsService.mostrarToast('plantilla copiada', 'success');
  };

  clickPlantilla(event: any, idPromocionZona: number): void {

    const indexCell = event.target.parentElement.cellIndex;
    const headerBloque = event.target.parentElement.offsetParent.tHead.firstElementChild.cells[indexCell].textContent;
    const plantilla = this._promocionPlantillas.find(x => x.idPromotionZone == idPromocionZona && x.descriptionBlock == headerBloque);

    this.copyToClipboard(plantilla.template == '' ? ' ' : plantilla.template);
  }

  getHeader(event: any): string{
    const indexCell = event.target.parentElement.cellIndex;
    return event.target.parentElement.offsetParent.tHead.firstElementChild.cells[indexCell].textContent;
  }

  onClickTemplate($event: any, idPromocionZona: number): void {
    const header = this.getHeader($event);
    const plantilla = this._promocionPlantillas.find(x => x.idPromotionZone === idPromocionZona && x.descriptionBlock === header);
    if(plantilla){
      this.copyToClipboard(plantilla.template == '' ? ' ' : plantilla.template);
      // console.log(plantilla.template)
    }
  }


  filtrarPorGenero( detalles: any[], typeGender: number  ): PromotionDetail[] {
    const collection: PromotionDetail[] = [];

    detalles.forEach( (detalle: object) => {


        if( detalle['idGenero'] === typeGender ){
          // console.log(detalle,typeGender);

          const priceBlocks = detalle['precioBloques'];
          const priceBlockCollection: PriceBlock[] = [];

          priceBlocks.forEach((p) => {
            const price: PriceBlock = {
              columName: p['columnaBloque'],
              price: p['precioBloque']
            }
            priceBlockCollection.push( price );
          });

          const d: PromotionDetail ={
            idPromotion: detalle['idPromocionZona'],
            idGender: detalle['idGenero'],
            price: detalle['precioBase'],
            zone: detalle['zonaCorporal'],
            priceBlocks: priceBlockCollection
          };
          collection.push( d );

        }

    });

    return collection;
  }

  private _filterDetallesHombre(value: string): PromotionDetail[] {
    const filterValue = value.toLowerCase();

    return this._promocioneDetallesHombre.filter( detail => detail.zone.toLowerCase().includes(filterValue));
  }

  private _filterDetallesMujer(value: string): PromotionDetail[] {
    const filterValue = value.toLowerCase();

    return this._promocionesDetallesMujer.filter( detail => detail.zone.toLowerCase().includes(filterValue));
  }

  isMobile(): boolean {
    return window.innerWidth < 768 ;
  }


  obtenerServicios(): void{
    this.ldServicios = true;
    this.sbcServicios = this.servicioService.listar().subscribe((res) => {
      this.servicios = res;
      this.ldServicios = false;
    }, error => {
      console.log(error);
      this.utilsService.mostrarToast('Ocurrio un error al obtener los servicios', 'error');
      this.ldServicios = false;
    })
  }


  /*****************************************************************************************************************
   * Events
   */
  evtSeleccionarServicio(element: Servicio): void{
    if(!this.servicioSelected){
      this.obtenerPromocionesPorServicio(element.id);
    }
    this.servicioSelected = this.servicioSelected ? null : element;
    this.collapsed = !this.servicioSelected;
  }

  /*****************************************************************************************************************
   * Functions
   */
  toggle() {
    this.collapsed = !this.collapsed;
  }
  expand() {
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }

}
