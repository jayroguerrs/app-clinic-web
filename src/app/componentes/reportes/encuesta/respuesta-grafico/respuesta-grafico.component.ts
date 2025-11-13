import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormularioEncuestaOpcion, FormularioEncuestaPregunta} from "../../../../shared/models/formulario-encuesta";

import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";

export class ChartLegend{
  public active: boolean = false;
  public text: string;
  public value: string;
  public fill: string;
  public column: any;
  public index: number;
}

@Component({
  selector: 'app-respuesta-grafico',
  templateUrl: './respuesta-grafico.component.html',
  styleUrls: ['./respuesta-grafico.component.scss']
})
export class RespuestaGraficoComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() pregunta: FormularioEncuestaPregunta = null;
  @Input() zeroValues: boolean = true;
  private chart: am4charts.XYChart;
  private piechart: am4charts.PieChart;

  @ViewChild('chartBar') element: ElementRef;
  @ViewChild('charPie') elementPie: ElementRef;
  legends: ChartLegend[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone
  ) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // console.log(this.pregunta.opciones);
    this.buildGraph();
    this.buildPieGraph();
  }

  ngOnDestroy(): void {
    this.chart.dispose();
    this.piechart.dispose();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.pregunta){
      //if(this.chart){ this.chart.dispose(); }
    }
    this.buildGraph();
    this.buildPieGraph();
  }

  buildGraph(): void{

    // console.log(this.element.nativeElement);

    if(this.pregunta){
      am4core.ready(() => {

        // Apply chart themes
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_kelly);
        am4core.addLicense("ch-custom-attribution");

        if(this.chart){
          if(this.zeroValues){
            this.chart.data = this.pregunta.opciones;
          }else{
            let datta: FormularioEncuestaOpcion[] = [...this.pregunta.opciones];
            datta = datta.filter( d => d.contador );
            this.chart.data = datta;
          }

          this.chart.resizable = true;

          return;
        }

        if(this.element) {
          // Create chart instance
          this.chart = am4core.create(this.element.nativeElement, am4charts.XYChart);
          this.chart.responsive.enabled = true;
          this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
          this.chart.paddingBottom = -30;

          // Add data
          if(this.zeroValues){
            this.chart.data = this.pregunta.opciones;
          }else{
            let datta: FormularioEncuestaOpcion[] = [...this.pregunta.opciones];
            datta = datta.filter( d => d.contador );
            this.chart.data = datta;
          }

          const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "valor";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 30;
          categoryAxis.tooltip.disabled = true;

          const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

          // Create series
          const series = this.chart.series.push(new am4charts.ColumnSeries());
          series.sequencedInterpolation = true;
          series.dataFields.valueY = "contador";
          series.dataFields.categoryX = "valor";
          series.columns.template.strokeWidth = 0;

          series.columns.template.tooltipText = "[bold]Opción[/] : {categoryX}\n[bold]Cantidad[/] : {valueY}";
          series.columns.template.tooltipY = 0;



          // // series.tooltip.pointerOrientation = "vertical";

          series.columns.template.adapter.add("fill", (fill, target) => {
            return this.chart.colors.getIndex(target.dataItem.index);
          })

          // const legend = new am4charts.Legend();
          // legend.parent = this.chart.chartContainer;
          // //legend.itemContainers.template.togglable = false;
          // legend.marginTop = 20;
          // legend.scrollable = true;

          series.events.on("ready", (ev) => {
            const legenddata = [];
            this.legends = [];
            series.columns.each((column: any, index) => {
              this.legends.push({
                active: false,
                text: column.dataItem.categoryX,
                value: column.dataItem.valueY,
                fill: column.fill,
                column: column,
                index: index
              });
              // legenddata.push({
              //   name: column.dataItem.categoryX,
              //   fill: column.fill,
              //   columnDataItem: column.dataItem
              // });
            });
            // legend.data = legenddata;
          });



          // legend.itemContainers.template.events.on("over", (ev: any) => {
          //   ev.target.dataItem.dataContext.columnDataItem.column.isHover = true;
          //   ev.target.dataItem.dataContext.columnDataItem.column.showTooltip();
          // });
          //
          // legend.itemContainers.template.events.on("out", (ev: any) => {
          //   ev.target.dataItem.dataContext.columnDataItem.column.isHover = false;
          //   ev.target.dataItem.dataContext.columnDataItem.column.hideTooltip();
          // });

          // series.legendSettings.labelText = "{categoryX}";
          // series.legendSettings.valueText = "ddd";
        }

      }); // end am4core.ready()
    }

  }

  buildPieGraph(): void{
    /* Set themes */
    am4core.useTheme(am4themes_animated);

    am4core.ready(() => {

      if(this.piechart){
        if(this.zeroValues){
          this.piechart.data = this.pregunta.opciones;
        }else{
          let datta: FormularioEncuestaOpcion[] = [...this.pregunta.opciones];
          datta = datta.filter( d => d.contador );
          this.piechart.data = datta;
        }
        this.piechart.reinit();

        return;
      }

      if(this.elementPie){
        // Create chart instance
        this.piechart = am4core.create( this.elementPie.nativeElement, am4charts.PieChart );
        this.piechart.radius = am4core.percent(90);
        this.piechart.innerRadius = am4core.percent(30);
        this.piechart.resizable = true;

        // Add data
        if(this.zeroValues){
          this.piechart.data = this.pregunta.opciones;
        }else{
          let datta: FormularioEncuestaOpcion[] = [...this.pregunta.opciones];
          datta = datta.filter( d => d.contador );
          this.piechart.data = datta;
        }

        // Add and configure Series
        const pieSeries = this.piechart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "contador";
        pieSeries.dataFields.category = "valor";

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

        const slice = pieSeries.slices.template;
        slice.states.getKey("hover").properties.scale = 1;
        slice.states.getKey("active").properties.shiftRadius = 0;

      }

    }); // end am4core.ready()

  }

  toggleActive(index: number): void{
    if(!this.legends.find( l => l.index === index).active){
      this.chart.series.getIndex(0).dataItems.values[index].hide();
      this.piechart.series.getIndex(0).dataItems.values[index].hide();
    }else{
      this.chart.series.getIndex(0).dataItems.values[index].show();
      this.piechart.series.getIndex(0).dataItems.values[index].show();
    }
    this.legends.find( l => l.index === index).active = !this.legends.find( l => l.index === index).active;
    //legend.column.column.dataItem.dataContext.columnDataItem.hide();
  }
}
