import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {UsuarioService} from "../../shared/services/usuario.service";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {PlantillaService} from "../../shared/services/plantilla.service";
import {Plantilla} from "../../shared/models/plantilla";
import {animate, style, transition, trigger} from "@angular/animations";
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-modulo-plantilla',
  templateUrl: './modulo-plantilla.component.html',
  styleUrls: ['./modulo-plantilla.component.scss'],
  animations: [
    trigger('slideFromBottom', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('300ms {{delay}}ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ], { params: { delay: 10 } })
    ])
  ]
})
export class ModuloPlantillaComponent implements OnInit, OnDestroy, AfterViewInit {

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  plantillas: Plantilla[] = [];
  sbcPlantillas: Subscription | undefined;
  ldPlantillas = false;

  constructor(
    private api: PlantillaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private clipboard: Clipboard
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.sbcPlantillas?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.listarPlantillas();
  }

  onReload(): void{
    this.listarPlantillas();
  }

  listarPlantillas(): void{
    this.ldPlantillas = true;
    this.spinner.show();
    this.sbcPlantillas = this.api.listarActivos().subscribe((res: Plantilla[]) => {
      this.plantillas = res;
      this.ldPlantillas = false;
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.utilsService.mostrarToast('Ocurrio un error al obtener las plantillas', 'error');
      this.ldPlantillas = false;
      this.spinner.hide();
    })
  }

  copiarPlantilla(e: Plantilla): void{
    this.clipboard.copy(e.plantilla);
    this.utilsService.mostrarToast(`Se copio la plantilla ${e.nombre}`, 'success');
  }


}
