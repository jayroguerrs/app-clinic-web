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

import { Zona } from 'src/app/shared/models/zonas';
import {ZonaCorporalService} from "../../../../../shared/services/zona-corporal.service";
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import * as am4charts from "@amcharts/amcharts4/charts";
import {UtilsService} from "../../../../../shared/services/funciones/utils.service";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import {FormControl} from "@angular/forms";
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top10-zonas-pack-atendidas',
  templateUrl: './top10-zonas-pack-atendidas.component.html',
  styleUrls: ['./top10-zonas-pack-atendidas.component.scss']
})
export class Top10ZonasPackAtendidasComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() TitleChart: string;
  @Input() FechaInicio: string | null;
  @Input() FechaFin: string | null;
  @Input() IdSede: number = 0;
  @Input() Sede: string = 'Todos';
  @Input() IdGenero: number = 0;
  @Input() Genero: string = 'Todos';

  numeroSesion = new FormControl(0);

  // Load data form
  loading = false;
  collection: Zona[] = [];
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

  constructor(
    private api: ZonaCorporalService,
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
    }
  }

  buildTable(): void{
    if(this.FechaInicio && this.FechaFin) {

      this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {

          this.loading = true;

          this.subscription = this.api.ObtenerTop10Atendidas(this.FechaInicio, this.FechaFin, this.IdSede, this.IdGenero, this.numeroSesion.value, 2).subscribe((res) => {
            callback({data: res});
            this.collection = res;
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
          {title: 'Pack', data: 'nombre', className: 'align-middle'},
          {title: 'Genero', data: 'genero', className: 'align-middle'},
          {title: 'Cant.', data: 'cantidad', className: 'align-middle',width: '50px'}
        ],
        createdRow: ( row, data, dataIndex ) => {
          $(row).on("mouseover", () => {

          });
          $('td:eq(1)',row).html(`<div class="inline-block"><i class="mdi mdi-square-rounded" style="color:${this.colors[dataIndex]}"></i> ${data.nombre}</div>`);
        },
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          {
            extend: 'excelHtml5',
            title: () => {
              return this.getExportFileName();
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
        this.chart = am4core.create("chartGeneralPacks", am4charts.XYChart);
        this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        this.chart.paddingBottom = -20;

        // Add data
        this.chart.data = this.collection;

        const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "nombre";
        categoryAxis.renderer.minGridDistance = 40;
        categoryAxis.fontSize = 11;
        categoryAxis.renderer.labels.template.hide();

        const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.renderer.minGridDistance = 30;

        const series = this.chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryX = "nombre";
        series.dataFields.valueY = "cantidad";
        series.columns.template.tooltipText = "[bold]Zona:[/] {categoryX}\n[bold]Cantidad:[/] {valueY.value}";
        series.columns.template.tooltipY = 0;
        series.columns.template.strokeOpacity = 0;
        series.hiddenState.transitionEasing = am4core.ease.elasticInOut;
        series.sequencedInterpolation = true
        series.showOnInit = true;


        series.columns.template.adapter.add("fill", (fill, target) => {
            return am4core.color(this.colors[target.dataItem.index]);
        });

    }); // end am4core.ready()

  }

  reloadTable(): void{
    if(this.dataTable){
      this.dataTable.ajax.reload();
    }
  }

  exportarExcel(): void{
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

  getExportFileName(): string{
    return `Reporte top 10 packs mas atendidas desde ${this.FechaInicio} hasta ${this.FechaFin} (Sede - ${this.Sede}) (Genero - ${this.Genero}) (N° Sesión - ${parseInt(this.numeroSesion.value) ? this.numeroSesion.value : 'Todos' }))`;
  }

}
