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
import {UtilsService} from "../../../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {SedesList} from "../../../../../shared/enumeracion/enums";
import {CitaService} from "../../../../../shared/services/cita.service";
import { Cita } from 'src/app/shared/models/cita';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4lang_es_ES from "@amcharts/amcharts4/lang/es_ES";


import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {pdfConfig} from "../../../../../app-config";
import {PromocionService} from "../../../../../shared/services/promocion.services";
import {PromocionRanking} from "../../../../../shared/models/promocion";
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-promocion-ranking',
  templateUrl: './promocion-ranking.component.html',
  styleUrls: ['./promocion-ranking.component.scss']
})
export class PromocionRankingComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() TitleChart: string;
  @Input() FechaInicio: string | null;
  @Input() FechaFin: string | null;
  @Input() IdSede: number = 0;
  @Input() IdPromocion: number = 0;

  collection: PromocionRanking[] = [];
  collectionReduce: {
    id: number;
    nombre: string;
    total: number
  }[] = [];
  subscription: Subscription;

  private piechart: am4charts.PieChart;
  private piechart2: am4charts.PieChart;
  dataTable: any;

  loading = false;


  constructor(
    private api: PromocionService,
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.FechaInicio && this.FechaFin){
      this.loadData();
    }
  }

  buildTable(): void{
    if(this.FechaInicio && this.FechaFin) {

      this.loadData();
      return;

    }
  }

  loadData(): void{
    this.loading = true;

    this.subscription = this.api.obtenerRankingVendidos(this.FechaInicio, this.FechaFin, this.IdSede, this.IdPromocion).subscribe((res) => {
      this.collection = res;
      this.collectionReduce = this.convertDatToPieChart(res);
    }, error => {
      this.collection = [];
      this.collectionReduce = [];
      console.log(error);
    }, () => {
      this.TitleChart = "Desde " + this.FechaInicio + " hasta " + this.FechaFin;
      this.loading = false;

      this.buildPieGraph();
    });
  }

  buildPieGraph(): void{

    /* Set themes */
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);
    am4core.addLicense("ch-custom-attribution");

    am4core.ready(() => {

      if (this.piechart || this.piechart2) {
        this.piechart.data = this.collectionReduce.filter(( x,i ) => i < 10  );
        this.piechart2.data = this.collectionReduce.reverse().filter(( x,i ) => i < 10  );
        return;
      }

      // Create chart instance
      this.piechart = am4core.create("promocionTop10", am4charts.PieChart);
      this.piechart.radius = am4core.percent(90);
      this.piechart.innerRadius = am4core.percent(30);
      this.piechart.responsive.enabled = true;
      this.piechart.resizable = true;

      let title = this.piechart.titles.create();
      title.text = "Top 10 promociones más solicitados";
      title.fontSize = 14;
      title.marginBottom = 10;
      title.paddingTop = 10;

      // Add data
      this.piechart.data = this.collectionReduce.filter(( x,i ) => i < 10  );

      // Add and configure Series
      const pieSeries = this.piechart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "total";
      pieSeries.dataFields.category = "nombre";

      // Let's cut a hole in our Pie chart the size of 40% the radius
      this.piechart.innerRadius = am4core.percent(30);

      // Disable ticks and labels
      pieSeries.ticks.template.disabled = true;
      pieSeries.alignLabels = false;
      pieSeries.labels.template.text = "[bold]{value.percent.formatNumber('#.0')}%[/]";
      pieSeries.labels.template.radius = am4core.percent(-40);
      pieSeries.labels.template.fill = am4core.color("white");
      pieSeries.labels.template.fontSize = 12;
      pieSeries.legendSettings.labelText = "{category}";
      pieSeries.legendSettings.valueText = "[bold]{value.value} Zonas[bold]";
      /* This creates initial animation */
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
      pieSeries.labels.template.relativeRotation = 90;

      // Disable tooltips
      //pieSeries.slices.template.tooltipText = "";
      pieSeries.slices.template.tooltipText = "{category}: {value.value}";



      const slice = pieSeries.slices.template;
      slice.states.getKey("hover").properties.scale = 1;
      slice.states.getKey("active").properties.shiftRadius = 0;

      // Add a legend
      this.piechart.legend = new am4charts.Legend();
      // this.piechart.legend.valueLabels.template.text = "{value}";

      this.piechart.legend.labels.template.maxWidth = undefined;
      this.piechart.legend.labels.template.truncate = true;
      this.piechart.legend.labels.template.fontSize = 12;
      this.piechart.legend.valueLabels.template.align = "right";


      // Pie Chart 2
      // Create chart instance
      this.piechart2 = am4core.create("promocionBottom10", am4charts.PieChart);
      this.piechart2.radius = am4core.percent(90);
      this.piechart2.innerRadius = am4core.percent(30);
      this.piechart2.responsive.enabled = true;
      this.piechart2.resizable = true;

      let title2 = this.piechart2.titles.create();
      title2.text = "Top 10 promociones menos solicitados";
      title2.fontSize = 14;
      title2.marginBottom = 10;
      title2.paddingTop = 10;

      // Add data
      this.piechart2.data = this.collectionReduce.reverse().filter(( x,i ) => i < 10  );

      // Add and configure Series
      const pieSeries2 = this.piechart2.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "total";
      pieSeries2.dataFields.category = "nombre";

      // Let's cut a hole in our Pie chart the size of 40% the radius
      this.piechart2.innerRadius = am4core.percent(30);

      // Disable ticks and labels
      pieSeries2.ticks.template.disabled = true;
      pieSeries2.alignLabels = false;
      pieSeries2.labels.template.text = "[bold]{value.percent.formatNumber('#.0')}%[/]";
      pieSeries2.labels.template.radius = am4core.percent(-40);
      pieSeries2.labels.template.fill = am4core.color("white");
      pieSeries2.labels.template.fontSize = 12;
      pieSeries2.legendSettings.labelText = "{category}";
      pieSeries2.legendSettings.valueText = "[bold]{value.value} Zonas[bold]";
      /* This creates initial animation */
      pieSeries2.hiddenState.properties.opacity = 1;
      pieSeries2.hiddenState.properties.endAngle = -90;
      pieSeries2.hiddenState.properties.startAngle = -90;
      pieSeries2.labels.template.relativeRotation = 90;

      // Disable tooltips
      //pieSeries.slices.template.tooltipText = "";
      pieSeries2.slices.template.tooltipText = "{category}: {value.value}";



      const slice2 = pieSeries2.slices.template;
      slice2.states.getKey("hover").properties.scale = 1;
      slice2.states.getKey("active").properties.shiftRadius = 0;

      // Add a legend
      this.piechart2.legend = new am4charts.Legend();
      // this.piechart.legend.valueLabels.template.text = "{value}";

      this.piechart2.legend.labels.template.maxWidth = undefined;
      this.piechart2.legend.labels.template.truncate = true;
      this.piechart2.legend.labels.template.fontSize = 12;
      this.piechart2.legend.valueLabels.template.align = "right";

    }); // end am4core.ready()

  }


  exportarPdf(): void{}

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
        const title = 'Promociones Ranking';
        const header = ["IdPromocion","Promoción", "FechaCita","NumZonas"];

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Promociones ranking');

        worksheet.autoFilter = {
          from: 'A1',
          to: 'D1',
        }

        worksheet.addRow(header);
        this.collection.forEach( d => {
          const data = [ d.idPromocion , d.promocion, this.datePipe.transform(d.fechaCita,'yyyy-MM-dd'), d.numZonas ]
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
          fs.saveAs(blob, "Promoción ranking desde " + this.FechaInicio + " hasta " + this.FechaFin + '.xlsx');
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

  convertDatToPieChart(data: PromocionRanking[]): any[]{
    const promociones: {
      id: number;
      nombre: string;
      total: number;
    }[] = [];
    data.forEach( x => {
      const promo = {
        id: x.idPromocion,
        nombre: x.promocion,
        total: 0
      };
      if(!promociones.find(p => p.id === promo.id)){
        promociones.push(promo);
      }
    });
    promociones.forEach((x) => {
      x.total = data.filter( c => c.idPromocion === x.id).map(item => item.numZonas).reduce( (previousValue, currentValue) => previousValue + currentValue, 0 );
    });

    promociones.sort(function (a, b) {
      if (a.total < b.total) {
        return 1;
      }
      if (a.total > b.total) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    return promociones;
  }
/*
  exportarPdf(): void{
    console.log(this.piechart.exporting.events);
    this.piechart.exporting.events.on("exportstarted", (ev) => {
      document.getElementById('chartCitasAgendadas').style.minHeight = '600px';
    });


    this.piechart.exporting.getSVG("svg",{minWidth: 600},false).then(imgData => {

      const dataDetalle: any[] = [
        [{text:'SEDE',fillColor: '#3f4d67',color:'#a9b7d0',bold: true}, {text:'N° CITAS',fillColor: '#3f4d67',color:'#a9b7d0',bold: true}, {text: 'FECHA',fillColor: '#3f4d67',color:'#a9b7d0',bold: true}]
      ];
      this.collection.forEach( x => {
        dataDetalle.push( [{text: x.sede}, {text: x.numCitas, alignment: 'right'}, {text: this.datePipe.transform(x.fechaCita, 'yyyy-MM-dd'), alignment: 'center'}] );
      });

      const dataTotal: any[] = [
        [{text:'SEDE',fillColor: '#3f4d67',color:'#a9b7d0',bold: true}, {text:'TOTAL CITAS',fillColor: '#3f4d67',color:'#a9b7d0',bold: true}]
      ];
      this.transformDataToPieChart().forEach( x => {
        dataTotal.push( [{text: x.sede}, {text: x.total, alignment: 'right'}] );
      });

      const content = {
        content: [
          {
            table: {
              widths: [300,'*'],
              body: [
                [{
                  svg: imgData,
                  width: 300,
                  height: 220
                },{}]
              ]
            },
            layout: {
              hLineWidth: function (i, node) {
                return 0.5;
              },
              vLineWidth: function (i, node) {
                return 0.5;
              },
              hLineColor: function(i, node) {
                return '#dee2e6';
              },
              vLineColor: function(i, node) {
                return '#dee2e6';
              },
            }
          },
          {}
          /!*{
            columns: [
              {
                width: '*',
                style: 'tableExample',
                table: {
                  widths: ['*', 45,45],
                  body: [...dataDetalle]
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return 0.5;
                  },
                  vLineWidth: function (i, node) {
                    return 0.5;
                  },
                  hLineColor: function(i, node) {
                    return '#dee2e6';
                  },
                  vLineColor: function(i, node) {
                    return '#dee2e6';
                  },
                }
              },
              {
                width: '300',
                stack: [
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', '*'],
                      body: [...dataTotal]
                    },
                    margin: [0, 0, 0, 10],
                    layout: {
                      hLineWidth: function (i, node) {
                        return 0.5;
                      },
                      vLineWidth: function (i, node) {
                        return 0.5;
                      },
                      hLineColor: function(i, node) {
                        return '#dee2e6';
                      },
                      vLineColor: function(i, node) {
                        return '#dee2e6';
                      },
                    }
                  },
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*'],
                      body: [
                        [{
                          svg: imgData,
                          width: 290
                        }]
                      ],
                    },
                    layout: {
                      hLineWidth: function (i, node) {
                        return 0.5;
                      },
                      vLineWidth: function (i, node) {
                        return 0.5;
                      },
                      hLineColor: function(i, node) {
                        return '#dee2e6';
                      },
                      vLineColor: function(i, node) {
                        return '#dee2e6';
                      }
                    }
                  }
                ]
              }
            ]
          },*!/
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            fontSize: 8,
          },
          tableHeader: {
            bold: false,
            fontSize: 10,
            color: 'black'
          }
        },
        defaultStyle: {
          columnGap: 10
        },
        pageSize: "A4",
        pageMargins: [40,40,40,40],
        pageOrientation: 'landscape'
      };
      const docPdf = pdfMake.createPdf(content);
      docPdf.open();
    });
    return;


  }*/


}
