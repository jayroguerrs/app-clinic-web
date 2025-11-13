import { Component, ElementRef, OnInit,Input, Output, ViewChild } from '@angular/core';;
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from '../../../shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({ selector: 'app-reportes-graficos',
templateUrl: 'graficolineal.component.html' })

export class GraficoslinealComponent implements OnInit{ 
  public barBasicChartData: any;
  public barBasicChartOption: any;
  @ViewChild('barBasicChart') barBasicChart: ElementRef; // used barStackedChart, barHorizontalChart
  public barBasicChartTag: CanvasRenderingContext2D;
  @Input() listaDocumentacion: any;
  @Input() listaUsuarioPerfil: any;
  
  @ViewChild('modalGrafico', { static: false }) modal: any;

  frmgraficos: FormGroup;  
  id = 0;

  accion = '';
  submitted = false;
  usuarioActual: Usuario;
  facturacionDatos: any;
  private modalRef: NgbModalRef;

constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    ) {
   }
   ngOnInit(){
    setTimeout(() => {
         /* bar basic chart */
         const bar_basic_tag = (((<HTMLCanvasElement>this.barBasicChart.nativeElement).children));
         this.barBasicChartTag = ((bar_basic_tag['bar_basic_chart']).lastChild).getContext('2d');
         // used bar_stacked_chart, bar_horizontal_chart
         const abc = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
         abc.addColorStop(0, '#1de9b6');
         abc.addColorStop(1, '#1dc4e9');
         const def = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
         def.addColorStop(0, '#899FD4');
         def.addColorStop(1, '#A389D4');
   
         this.barBasicChartData = {
           labels: [0, 1, 2, 3],
           datasets: [{
             label: 'Data 1',
             data: [25, 45, 74, 85],
             borderColor: abc,
             backgroundColor: abc,
             hoverborderColor: abc,
             hoverBackgroundColor: abc,
           }, {
             label: 'Data 2',
             data: [30, 52, 65, 65],
             borderColor: def,
             backgroundColor: def,
             hoverborderColor: def,
             hoverBackgroundColor: def,
           }]
         };
   
         this.barBasicChartOption = {
           barValueSpacing: 20
         };

    }, 500);
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.frmgraficos = this.formBuilder.group({
      maestroFacturacion: [''],
      maestrozonascitas: [''],
    });
}
limpiarFormulario(): void {
  this.frmgraficos.patchValue({
    maestroFacturacion: [''],
    maestrozonascitas: [''],
  });
}
cerrarModal(): void {
  this.modalRef.close();
}
abrirModal(id: number): void {
  this.id = id;
  if (this.id > 0){
      this.accion = 'Enviar';
       this.limpiarFormulario();
      
  } else {
    this.limpiarFormulario();
    this.accion = 'Nueva';
  }
  this.modalRef = this.utilsService.abrirModal(this.modal, 'xs');
  this.modalRef.result.then(result => {}, reason => {});
}

}