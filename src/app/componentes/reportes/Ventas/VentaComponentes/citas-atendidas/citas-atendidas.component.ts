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
import {CitaService} from "../../../../../shared/services/cita.service";
import { Cita } from 'src/app/shared/models/cita';

import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
import { FormControl } from '@angular/forms';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-citas-atendidas',
  templateUrl: './citas-atendidas.component.html',
  styleUrls: ['./citas-atendidas.component.scss']
})
export class CitasAtendidasComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() TitleChart: string;
  @Input() FechaInicio: string | null;
  @Input() FechaFin: string | null;
  @Input() IdSede: number = 0;
  @Input() IdGenero: number = 0;
  @Input() Genero: string = 'Todos';

  collection: Cita[] = [];
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
  constructor(
    private api: CitaService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildTable();
  }

  ngAfterViewInit(): void {
    /*this.datatableElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
    });*/
  }

  ngOnDestroy(): void {
    if(this.subscription){ this.subscription.unsubscribe(); }
    if(this.piechart){ this.piechart.dispose(); }
    if(this.chart){ this.chart.dispose(); }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.FechaInicio && this.FechaFin){
      this.reloadTable();
    }
  }

  buildTable(): void{
    if(this.FechaInicio && this.FechaFin) {

      this.loadData();
      return;

      /*this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {

          this.loading = true;

          this.subscription = this.api.ObtenerAgendadasRangoFechaVenta(this.FechaInicio, this.FechaFin, this.IdSede, this.IdGenero).subscribe((res) => {
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
          {title: 'N° Citas', data: 'numCitas', className: 'align-middle text-center',width: '50px'},
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
              return 'Reporte citas agendadas por sede desde ' + this.FechaInicio + ' hasta ' + this.FechaFin;
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
      };*/

    }
  }

  loadData(): void{
    this.loading = true;

    this.subscription = this.api.ObtenerAtendidasRangoFechaVenta(this.FechaInicio, this.FechaFin, this.IdSede, this.IdGenero).subscribe((res) => {
      this.collection = res;
    }, error => {
      this.collection = [];
      console.log(error);
    }, () => {
      this.TitleChart = "Desde " + this.FechaInicio + " hasta " + this.FechaFin;
      this.loading = false;
      this.buildGraph();
      this.buildPieGraph();
    });
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
        this.chart = am4core.create("chartCitasAtendidasTotal", am4charts.XYChart);

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
          series.tooltipText = "[bold]{name}[/]: {valueY} Citas";

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
        this.piechart.titles.getIndex(0).text = "Total: [bold]" + this.collection.map( x => x.numCitas).reduce((prev, curr) => prev + curr, 0).toLocaleString('en-US', {maximumFractionDigits:2}) + " Citas[/]";
        return;
      }

      // Create chart instance
      this.piechart = am4core.create("chartCitasAtendidas", am4charts.PieChart);
      this.piechart.radius = am4core.percent(90);
      this.piechart.innerRadius = am4core.percent(30)

      let title = this.piechart.titles.create();
      title.text = "Total: [bold]" + this.collection.map( x => x.numCitas).reduce((prev, curr) => prev + curr, 0).toLocaleString('en-US', {maximumFractionDigits:2}) + " Citas[/]";
      title.fontSize = 14;
      title.marginBottom = 10;
      title.paddingTop = 10;

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
      pieSeries.legendSettings.valueText = "[bold]{value.value} Citas[bold]";
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
    this.loadData();
    return;
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
        const title = 'Citas atendidas';
        const header = ["Sede", "N° Citas", "Fecha"];

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Citas atendidas');

        // Set an auto filter from A1 to C1
        worksheet.autoFilter = {
          from: 'A1',
          to: 'C1',
        }

        worksheet.addRow(header);
        this.collection.forEach( d => {
          const data = [ d.sede , d.numCitas, this.datePipe.transform(d.fechaCita,'yyyy-MM-dd') ]
          worksheet.addRow(data);
        });

        worksheet.columns.forEach(function(column){
          var dataMax = 0;
          column.eachCell({ includeEmpty: true }, function(cell){
            var columnLength = cell.value.length;
            if (columnLength > dataMax) {
              dataMax = columnLength;
            }
          })
          column.width = dataMax < 10 ? 10 : dataMax;
        });

        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, this.getExportFileName() + '.xlsx');
        });
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
        obj[s.index.toString()] = e ? e.numCitas : 0;
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
        'total': realData.filter(item => item.idSede === s.index ).map( x => x.numCitas).reduce((prev, curr) => prev + curr, 0)
      });
    });

    return data;
  }

  getExportFileName(): string{
    return `Citas atendidas por sede desde ${this.FechaInicio} hasta ${this.FechaFin} (Genero - ${this.Genero})`;
  }

}
