import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  SimpleChanges
} from '@angular/core';

import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import * as am4charts from "@amcharts/amcharts4/charts";
import {UtilsService} from "../../../../../shared/services/funciones/utils.service";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import {Promocion, PromocionZonaRanking} from 'src/app/shared/models/promocion';
import { PromocionService } from 'src/app/shared/services/promocion.services';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-promocion-zonas-ranking',
  templateUrl: './promocion-zonas-ranking.component.html',
  styleUrls: ['./promocion-zonas-ranking.component.scss']
})
export class PromocionZonasRankingComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() TitleChart: string;
  @Input() FechaInicio: string | null;
  @Input() FechaFin: string | null;
  @Input() IdSede: number = 0;
  @Input() IdPromocion: number = 0;
  @Input() Promociones: Promocion[] = [];

  // Load data form
  loading = false;
  collection: PromocionZonaRanking[] = [];
  subscription: Subscription;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  private chart: am4charts.XYChart;
  dataTable: any;

  colors = [
    '#f3c300',
    '#875692',
    '#f38400',
    '#a1caf1',
    '#be0032',
    '#c2b280',
    '#848482',
    '#008856',
    '#e68fac',
    '#0067a5'
  ];

  promocionSeleccionada: string = 'Todas';

  constructor(
    private api: PromocionService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private utilsService: UtilsService,    
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildTable();
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
    });
  }


  ngOnDestroy(): void {
    if(this.subscription){ this.subscription.unsubscribe(); }
    if( this.chart ){ this.chart.dispose(); }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.FechaInicio && this.FechaFin){
      this.reloadTable();
      this.promocionSeleccionada = !parseInt( this.IdPromocion.toString(), 10) ? 'Todas' : this.Promociones.find( p => p.id === parseInt( this.IdPromocion.toString(), 10))?.nombre;
    }
  }

  buildTable(): void{
    if(this.FechaInicio && this.FechaFin) {

      this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {

          this.loading = true;

          this.subscription = this.api.obtenerZonasRanking(this.FechaInicio, this.FechaFin, this.IdSede, 1, this.IdPromocion).subscribe((res) => {
            callback({data: res});
            this.collection = res;
            // console.log(res);
          }, error => {
            callback({data: []});
            this.collection = [];
            console.log(error);
          }, () => {
            this.TitleChart = "Desde " + this.FechaInicio + " hasta " + this.FechaFin;
            this.loading = false;
            this.buildGraph();
          });

        },
        searching: false,
        'columnDefs': [{
          'max-width': '34px',
          'targets': 0
        }],
        columns: [
          {
            "className": 'dtr-control',
            "orderable": false,
            "data": null,
            "defaultContent": '',
            width: '0px'
          },
          // { title: 'Código', data: 'id', className: 'align-middle'},
          {title: 'Zona', data: 'zona', className: 'align-middle'},
          {title: 'Cant.', data: 'cantidad', className: 'align-middle text-right',width: '50px'},
          {title: 'Total S/', data: 'total', className: 'align-middle text-right',width: '50px'}
        ],
        createdRow: ( row, data, dataIndex ) => {
          // $(row).on("mouseover", () => {
          //
          // });
          // $('td:eq(1)',row).html(`<div class="inline-block"><i class="mdi mdi-square-rounded" style="color:${this.colors[dataIndex]}"></i> ${data.zona}</div>`);
        },
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          {
            extend: 'excelHtml5',
            title: () => {
              return 'Reporte zonas ranking con relación a la promoción: ' + this.promocionSeleccionada + ' - desde ' + this.FechaInicio + ' hasta ' + this.FechaFin;
            },
            exportOptions: {
              columns: [ 1,2,3 ]
            },
            //autoFilter: true
          }
        ],
        language: this.utilsService.datatableIdioma,
        autoWidth: false,
        responsive: {
          details: {
            renderer: function (api, rowIdx, columns: any[]) {
              const data = columns.map(x => {
                return x.hidden ?
                  '<tr data-dt-row="' + x.rowIndex + '" data-dt-column="' + x.columnIndex + '">' +
                  '<td><b>' + x.title + '</b></td>' +
                  '<td><b>:</b></td>' +
                  '<td>' + x.data + '</td>' +
                  '</tr>' :
                  '';
              }).join('');
              const table = document.createElement('table');
              table.classList.add('w-100', 'table-child');
              table.innerHTML = data;
              return data ? table : false;
            }
          }
        }
      };

    }
  }

  buildGraph(): void{

    am4core.ready(() => {

      if(this.chart){
        //this.chart.dispose();
        this.chart.data = this.collection;
        return;
      }

      // Apply chart themes
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_kelly);
      am4core.addLicense("ch-custom-attribution");

      // Create chart instance
      this.chart = am4core.create("chartGeneralZonas", am4charts.XYChart);
      this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.chart.paddingBottom = -20;

      // Add data
      this.chart.data = this.collection;

      const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "zona";
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 11;
      categoryAxis.renderer.labels.template.hide();

      const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.renderer.minGridDistance = 30;

      const series = this.chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "zona";
      series.dataFields.valueY = "cantidad";
      series.columns.template.tooltipText = "[bold]Zona:[/] {categoryX}\n[bold]Cantidad:[/] {valueY.value}";
      series.columns.template.tooltipY = 0;
      series.columns.template.strokeOpacity = 0;
      series.hiddenState.transitionEasing = am4core.ease.elasticInOut;
      series.sequencedInterpolation = true
      series.showOnInit = true;


      series.columns.template.adapter.add("fill", (fill, target) => {
        return this.chart.colors.getIndex(target.dataItem.index);
      });

    }); // end am4core.ready()

  }

  reloadTable(): void{
    if(this.dataTable){
      this.dataTable.ajax.reload();
    }
  }

  exportarExcel(): void{
    
    this.promocionSeleccionada = !parseInt( this.IdPromocion.toString(), 10) ? 'todos' : this.Promociones.find( p => p.id === parseInt( this.IdPromocion.toString(), 10))?.nombre;
    const param = {
      "idusuario": this.usuarioService.UsuarioActual.idUsuario,
      "tipo_opcion": this.router.url,
      "des_operacion": "Descarga",
      "des_nombre_usuario": this.usuarioService.UsuarioActual.nombre,
      "des_nombre_maquina": window.location.hostname, 
      "des_usuario_windows": "",     
      "des_sistema": "",
      "des_usuario_sistema":""
    }
       
    this.auditoriaService.insAuditoria(param).subscribe((res)=>{
      if(res.status === 200){
        this.dataTable.button(0).trigger();
      }
      else if(res.status === 400){
        Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'info');
      }
    },    
    (error)=>{
      Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'error');
    }); 
  }

}
