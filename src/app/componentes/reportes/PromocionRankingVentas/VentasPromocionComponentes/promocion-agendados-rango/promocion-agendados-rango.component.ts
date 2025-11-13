import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID, SimpleChanges,
  ViewChild
} from '@angular/core';
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import * as am4charts from "@amcharts/amcharts4/charts";
import {UtilsService} from "../../../../../shared/services/funciones/utils.service";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4lang_es_ES from "@amcharts/amcharts4/lang/es_ES";
import {DatePipe} from "@angular/common";
import {SedesList} from "../../../../../shared/enumeracion/enums";
import { PromocionRanking, Promocion } from 'src/app/shared/models/promocion';
import {PromocionService} from "../../../../../shared/services/promocion.services";
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-promocion-agendados-rango',
  templateUrl: './promocion-agendados-rango.component.html',
  styleUrls: ['./promocion-agendados-rango.component.scss']
})

export class PromocionAgendadosRangoComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() TitleChart: string;
  @Input() FechaInicio: string | null;
  @Input() FechaFin: string | null;
  @Input() IdSede: number = 0;
  @Input() IdPromocion: number = 0;
  @Input() Promociones: Promocion[];

  collection: PromocionRanking[] = [];
  subscription: Subscription;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  private chart: am4charts.XYChart;
  private piechart: am4charts.PieChart;
  dataTable: any;

  loading = false;

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
    private datePipe: DatePipe,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) {
    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
      {threshold: [1]}
    );
  }

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
    if(this.piechart){ this.piechart.dispose(); }
    if(this.chart){ this.chart.dispose(); }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.FechaInicio && this.FechaFin){
      this.reloadTable();
      this.promocionSeleccionada = !parseInt( this.IdPromocion.toString(), 10) ? 'Todas' : this.Promociones.find( p => p.id === parseInt( this.IdPromocion.toString(), 10))?.nombre;
      // if(this.piechart){ this.piechart.titles.getIndex(0).text = "Promoción: [bold]" + this.promocionSeleccionada + "[/]"; }
    }
  }

  buildTable(): void{
    if(this.FechaInicio && this.FechaFin) {

      this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {

          this.loading = true;

          this.subscription = this.api.obtenerRankingAgendado(this.FechaInicio, this.FechaFin, this.IdSede, this.IdPromocion).subscribe((res) => {
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
            this.buildPieGraph();
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
          {title: 'Sede', data: 'sede', className: 'align-middle'},
          {title: 'Promoción', data: 'promocion', className: 'align-middle'},
          {title: 'Total', data: 'total', className: 'align-middle text-right',width: '50px', render: (data) => {
            return  data.toFixed(2);
          }},
          {title: 'Fecha', data: 'fechaCita', className: 'align-middle',width: '50px', render: (data) => {
            return this.datePipe.transform(data,'yyyy-MM-dd');
          }}
        ],
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          {
            extend: 'excelHtml5',
            title: () => {
              return 'Reporte promoción ranking agendados por sede, promoción: ' + this.promocionSeleccionada + ' - desde ' + this.FechaInicio + ' hasta ' + this.FechaFin;
            },
            exportOptions: {
              columns: [ 1,2,3 ]
            },
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

      // Apply chart themes
      am4core.useTheme(am4themes_animated);
      am4core.addLicense("ch-custom-attribution");

      if(this.chart){
        this.chart.dispose();
      }

      setTimeout( () => {

        // Create chart instance
        this.chart = am4core.create("chartPromocionRankingTotal", am4charts.XYChart);

        // Increase contrast by taking evey second color
        this.chart.colors.step = 2;

        this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        //this.chart.paddingBottom = -20;
        this.chart.language.locale = am4lang_es_ES;

        // Add data
        this.chart.data = this.transformDataToChart();

        // Create axes
        const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;

        const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;

        // Create series
        const createSeries = (field, name, index) => {
          const series = this.chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = field;
          series.dataFields.dateX = "date";
          series.name = name;
          series.tooltipText = "[bold]{name}[/]: S/. {valueY}";

          series.yAxis = valueAxis;
          //series.sequencedInterpolation = true;
          //series.fillOpacity = 0.3;
          series.defaultState.transitionDuration = 200;
          series.showOnInit = true;
          series.strokeWidth = 2;
          //series.tensionX = 0.8;
          series.stroke = am4core.color(this.colors[index]);

          series.propertyFields.stroke = "lineColor";
          series.propertyFields.fill = "lineColor";

          return series;
        }

        SedesList.forEach((x, i) => {
          createSeries(x.index.toString(), x.value, i);
        });


        this.chart.legend = new am4charts.Legend();
        this.chart.cursor = new am4charts.XYCursor();
      },10);

    }); // end am4core.ready()

  }

  buildPieGraph(): void{
    /* Set themes */
    am4core.useTheme(am4themes_animated);

    am4core.ready(() => {


      if (this.piechart) {
        this.piechart.data = this.transformDataToPieChart();
        // this.piechart.titles.getIndex(1).text = "Promoción: [bold]" + this.promocionSeleccionada + "[/]";
        // this.piechart.titles.getIndex(1).maxWidth = 200;
        this.piechart.titles.getIndex(0).text = "Total: [bold]S/. " + this.collection.map( x => x.total).reduce((prev, curr) => prev + curr, 0).toLocaleString('en-US', {maximumFractionDigits:2}) + "[/]";
        this.piechart.titles.template.invalidate();
        return;
      }

      // Create chart instance
      this.piechart = am4core.create("chartPromocionRankingTotalSede", am4charts.PieChart);
      this.piechart.radius = am4core.percent(90);
      this.piechart.innerRadius = am4core.percent(30);

      let title = this.piechart.titles.create();
      title.text = "Total: [bold]S/. " + this.collection.map( x => x.total).reduce((prev, curr) => prev + curr, 0).toLocaleString('en-US', {maximumFractionDigits:2}) + "[/]";
      title.fontSize = 14;
      title.marginBottom = 10;
      title.paddingTop = 10;

      // let titlePromo = this.piechart.titles.create();
      // titlePromo.text = "Promoción: [bold]" + this.promocionSeleccionada + "[/]";
      // titlePromo.fontSize = 14;
      // titlePromo.marginBottom = 0;
      // titlePromo.paddingTop = 10;
      // titlePromo.id = "title"
      // titlePromo.align = "center";
      // titlePromo.width = am4core.percent(50);

      // Add data
      this.piechart.data = this.transformDataToPieChart();

      // Add and configure Series
      const pieSeries = this.piechart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "total";
      pieSeries.dataFields.category = "sede";

      // Let's cut a hole in our Pie chart the size of 40% the radius
      this.piechart.innerRadius = am4core.percent(30);

      // Disable ticks and labels
      pieSeries.ticks.template.disabled = true;
      pieSeries.alignLabels = false;
      pieSeries.labels.template.text = "[bold]{value.percent.formatNumber('#.0')}%[/]";
      pieSeries.labels.template.radius = am4core.percent(-30);
      pieSeries.labels.template.fill = am4core.color("white");
      pieSeries.legendSettings.labelText = "{category}";
      pieSeries.legendSettings.valueText = "[bold]S/. {value.value}[bold]";
      /* This creates initial animation */
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;

      // Disable tooltips
      //pieSeries.slices.template.tooltipText = "";
      pieSeries.slices.template.tooltipText = "{category}: {value.value}";

      pieSeries.slices.template.adapter.add("fill", (fill, target) => {
        return am4core.color(this.colors[target.dataItem.index]);
      });

      const slice = pieSeries.slices.template;
      slice.states.getKey("hover").properties.scale = 1;
      slice.states.getKey("active").properties.shiftRadius = 0;

      // Add a legend
      this.piechart.legend = new am4charts.Legend();
      this.piechart.legend.labels.template.maxWidth = undefined;
      this.piechart.legend.labels.template.truncate = true;
      this.piechart.legend.valueLabels.template.align = "right";

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

  transformDataToChart(): any[]{
    const realData = [...this.collection];
    const data: any[] = [];

    const dateList: { date: Date, dateString: string }[] = [];
    realData.forEach( d => {
      const a = dateList.find( dt => dt.dateString === this.datePipe.transform( d.fechaCita, 'yyyy-MM-dd' ));
      if(!a){
        dateList.push( {date: d.fechaCita, dateString: this.datePipe.transform( d.fechaCita, 'yyyy-MM-dd' )} );
      }
    });

    dateList.forEach( d => {
      const obj = new Object({});
      obj['date'] = d.date;
      SedesList.forEach(s => {
        const e = realData.find( (x) => this.datePipe.transform(x.fechaCita, 'yyyy-MM-dd') === d.dateString && x.idSede === s.index);
        obj[s.index.toString()] = e ? e.total : 0;
      });
      data.push(obj);
    });

    return data;
  }

  transformDataToPieChart(): any[]{
    const realData = [...this.collection];
    const data: any[] = [];

    SedesList.forEach( s => {
      data.push({
        'sede': s.value,
        'total': realData.filter(item => item.idSede === s.index ).map( x => x.total).reduce((prev, curr) => prev + curr, 0)
      });
    });

    return data;
  }

}
