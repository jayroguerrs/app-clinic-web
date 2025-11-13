import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, NgZone} from '@angular/core';

import {ReportesService} from '../../../shared/services/reportes-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../../shared/services/funciones/utils.service';

import '../../../../../node_modules/morris.js/morris.js';

import {DatePipe, isPlatformBrowser} from '@angular/common';
import {SedeService} from "../../../shared/services/sede.service";
import {RSede} from "../../../shared/interfaces/Response/sede";
import {CitaEstado, Sedes, VariableMedicion} from "../../../shared/enumeracion/enums";
import {DataTableDirective} from "angular-datatables";
import {RCitaMotivoGeneral, CitaEstadoColor, RCitaMotivo} from "../../../shared/interfaces/Response/cita-motivo-estado";
import {NgxSpinnerService} from "ngx-spinner";

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';


import {TipoMedicionService} from "../../../shared/services/tipo-medicion.service";
import {TipoMedicion} from "../../../shared/models/tipo-medicion";
import {CitaMedicionService} from "../../../shared/services/cita-medicion.service";
import {AlternativaMedicionService} from "../../../shared/services/alternativa-medicion.service";
import { AlternativaMedicion } from '../../../shared/models/alternativa-medicion';
import {CitaMedicionGeneral} from "../../../shared/models/CitaMedicion";
import {ClienteEncuestaService} from "../../../shared/services/cliente-encuesta.service";
import {ClienteEncuesta, ClienteEncuestaPregunta} from "../../../shared/models/cliente";
import {Subscription} from "rxjs";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  templateUrl: 'cliente-encuesta.component.html' ,
  styleUrls: ['./cliente-encuesta.component.scss'],
  providers: [DatePipe]
})
export class ClienteEncuestaComponent implements OnInit, OnDestroy, AfterViewInit{


    // Load data form
    loadingSede = false;
    loadingTipo = false;
    collectionSede: RSede[] = [];
    collectionEstado: any[] = [];
    collectionTipos: TipoMedicion[] = [];
    collectionAlternativas: AlternativaMedicion[] = [];
    collectionClienteEncuestaPregunta: ClienteEncuestaPregunta[] = [];

    // Formulario
    submitted = false;
    formGroup: FormGroup;

    today: Date;


    // Datatable
    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
    dtResponsiveOptions: any = {};
    selected = 0;
    citaEstado: RCitaMotivoGeneral = null;
    dataTable: any;

    // Collection Data
    collectionData: ClienteEncuesta[] = [];

    // Charts
    titleChart : string;
    private chart: am4charts.XYChart;

    private charts: { column: am4charts.XYChart,
      pie: am4charts.PieChart }[] = [];

    // Spinner
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';



  colores: string[] = [
    "#f3c300",
    "#875692",
    "#f38400",
    "#a1caf1",
    "#be0032",
    "#c2b280",
    "#848482",
    "#008856",
    "#e68fac",
    "#0067a5",
  ];

    sbClienteGrafico : Subscription;
    sbClienteEncuestaPregunta: Subscription;
    piesChart: any[] = [];
    idSedeG = new FormControl(0);

    // Permisos
    accTot: boolean = false;
    accExp: boolean = false;
    accExc: boolean = false;
    accExi: boolean = false;
    accExf: boolean = false;
    accImp: boolean = false;

    constructor(
      private reporteservice: ReportesService,
      private formBuilder: FormBuilder,
      private utilsService: UtilsService,
      private datePipe: DatePipe,
      private sedeService: SedeService,
      private api: CitaMedicionService,
      private spinner: NgxSpinnerService,
      private tipoMedicionService: TipoMedicionService,
      private alternativaMedicionService: AlternativaMedicionService,
      private clienteEncuestaService: ClienteEncuestaService,
      private permisoHelper: PermisoHelper,
      private usuarioService: UsuarioService,
      private auditoriaService : AuditoriaService,
      private router: Router,
      @Inject(PLATFORM_ID) private platformId,
      private zone: NgZone
    ) {

      this.today = new Date();

      this.formGroup = this.formBuilder.group({
        idSede: new FormControl('0'),
        fdesde: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        fhasta: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        //idVariable: new FormControl('0')
      });

      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
        {threshold: [1]}
      );

      this.titleChart = "Desde " + this.f.fdesde.value+ " hasta " + this.f.fhasta.value ;

    }

    ngOnInit(): void {
      this.obtenerSedes();
      this.obtenerTipoMedicion();
      this.obtenterAlternativas();
      //this.obtenerEstados();
      this.buildTable();
      this.permisoHelper.readPermiso().then((accesos) => {
        this.accTot = accesos.accTot;
        this.accExp = accesos.accExp;
        this.accExc = accesos.accExc;
        this.accExi = accesos.accExi;
        this.accExf = accesos.accExf;
        this.accImp = accesos.accImp;  
      });
    }

    ngAfterViewInit(): void {

      const _this = this;
      this.datatableElement.dtInstance.then((dtInstance: any) => {

        _this.dataTable = dtInstance;

        dtInstance.on('select', function (e, dt, type, indexes ) {
          if ( type === 'row' ) {
            _this.citaEstado = dtInstance.rows('.selected').data()[0];
          }
          _this.selected = dtInstance.rows({ selected: true }).count();
        });
        dtInstance.on('deselect', function (e, dt, type, indexes ) {
          _this.citaEstado = null;
          _this.selected = dtInstance.rows({ selected: true }).count();
        });
      });

    }

    ngOnDestroy(): void {
      if(this.sbClienteGrafico){this.sbClienteGrafico.unsubscribe()}
      if(this.sbClienteEncuestaPregunta){this.sbClienteEncuestaPregunta.unsubscribe()}

      // Clean up chart when the component is removed
      this.charts.forEach((chart) => {
        chart.column.dispose();
        chart.pie.dispose();
      });

      this.piesChart.forEach((chart) => {
        chart.dispose();
      });
    }

    get f(): any{
      return this.formGroup.controls;
    }

    // Obtener data
    obtenerSedes(): void{
      this.loadingSede = true;
      this.sedeService.obtener().subscribe((res: any[]) => {
        const collection: RSede[] = [];
        res.forEach((el) => {
          const sede: RSede = {
            id: el.idSede,
            nombre: el.nombre
          };
          collection.push(sede);
        });

        this.collectionSede = collection;
      }, error => {
        console.log(error);
      }, () => {
        this.loadingSede = false;
      });
    }

    obtenerEstados(): void {
      for(let item in CitaEstado){
        if(isNaN(Number(item))) {
          this.collectionEstado.push({ estado: item, value: CitaEstado[item]});
        }
      }
    }

    obtenterAlternativas(): void{
      this.alternativaMedicionService.obtenerAlternativasByTipo(0).subscribe((res) => {
        this.collectionAlternativas = res;
      }, error => {
        console.log(error);
      });
    }

    obtenerTipoMedicion(): void{
      this.loadingTipo = true;
      this.tipoMedicionService.collection().subscribe((res) => {
        this.collectionTipos = res;
        this.loadingTipo = false;
      }, error => {
        console.log(error);
        this.loadingTipo = false;
      }, () => {
      });
    }

    obtenerDatosGrafico(idSede: number, fechaDesde: string, fechaHasta: string): void{
      this.sbClienteEncuestaPregunta = this.clienteEncuestaService.collectionGraficoByFiltro(idSede, fechaDesde, fechaHasta).subscribe((res) => {
        this.collectionClienteEncuestaPregunta = res;
        this.renderGraficos();
      }, error => {
        console.log(error);
      })
    }


  // On Submit
  obtenerReporte(): void{

      this.submitted = true;

      if( this.formGroup.invalid ){
        this.utilsService.mostrarToast('Seleccionar rango de fechas','error');
        return;
      }

      this.dataTable.ajax.reload();

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



  buildTable(): void{
      const _this = this;
    this.dtResponsiveOptions = {
      ajax : (dataTablesParameters: any, callback) => {

        this.spinner.show();

        this.obtenerDatosGrafico(this.idSedeG.value,this.f.fdesde.value, this.f.fhasta.value);

        this.clienteEncuestaService.collectionByFiltro(this.f.idSede.value,this.f.fdesde.value, this.f.fhasta.value).subscribe( (res) => {
          callback({ data : res });
          this.collectionData = res;
          this.spinner.hide();
        }, error => {
          callback({ data : [] });
          this.collectionData = [];
          this.spinner.hide();
          this.utilsService.mostrarToast('Ocurrio un error','error');
          console.log(error);
        }, () => {
          this.titleChart = "Desde " + this.f.fdesde.value+ " hasta " + this.f.fhasta.value ;
          //this.dibujarGraficoGeneral();
          //this.dibujarGraficoGeneralBySede(Sedes.MEGA_PLAZA, 'megaPlazaEstadosChart' ,'megaPlazaMotivosChart');
          //this.dibujarGraficoGeneralBySede(Sedes.PUEBLO_LIBRE, 'puebloLibreEstadosChart' ,'puebloLibreMotivosChart');
          //this.dibujarGraficoGeneralBySede(Sedes.SAN_BORJA, 'sanBorjaEstadosChart' ,'sanBorjaMotivosChart');
        });

      },
      searching: false,
      'columnDefs': [{
        'max-width': '34px',
        'targets': 0
      }],
      columns: [
        {
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'Cliente', data: 'vcliente', className: 'align-middle'},
        { title: 'Distrito', data: 'vdistrito' , className: 'align-middle'},
        { title: 'Sede', data: 'vsede' , className: 'align-middle'},
        { title: 'Efectividad Tratatamiento', data: 'vefectividadTrat' , className: 'align-middle'},
        { title: 'Atención al cliente', data: 'vatencionCli' , className: 'align-middle'},
        { title: 'Información clara', data: 'vclaridadInfo' , className: 'align-middle'},
        { title: 'Información sobre promoción', data: 'vbrindoInfoPromo' , className: 'align-middle'},
        { title: 'Medio', data: 'vmedio' , className: 'align-middle'},
        { title: 'Especialista', data: 'vespecialista' , className: 'align-middle'},
        { title: 'Fecha creación', data: 'fechaCreacion', render: (data, type, full, meta) => {
          return this.datePipe.transform(data,'yyyy-MM-d');
        }, className: 'align-middle', width: '120px'},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: function(){
            return 'Reporte encuesta clientes '+ _this.f.fdesde.value + ' hasta ' + _this.f.fhasta.value;
          }
        }
      ],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function ( api, rowIdx, columns: any[] ) {
            const data = columns.map( x => {
              return x.hidden ?
                '<tr data-dt-row="'+x.rowIndex+'" data-dt-column="'+x.columnIndex+'">'+
                '<td><b>'+x.title+'</b></td>'+
                '<td><b>:</b></td>'+
                '<td>'+x.data+'</td>'+
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100','table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      }
    };
  }

  renderGraficos(): void{

      am4core.addLicense("ch-custom-attribution");
      am4core.useTheme(am4themes_kelly);

      if(this.piesChart.length){
        this.piesChart.forEach(x => {
          x.dispose();
        });
      }

      setTimeout(() => {

        /*if(this.piesChart.length){
          this.collectionClienteEncuestaPregunta.forEach((x, i) => {
            //Setting the new data to the graph
            this.piesChart[i].dataProvider = x.resultados;

            //Updating the graph to show the new data
            this.piesChart[i].validateData();
          });
          return;
        }*/

        this.collectionClienteEncuestaPregunta.forEach((x, i) => {

          const chart = am4core.create(
            document.getElementById("chartdiv"+x.id),
            am4charts.PieChart
          );

          chart.data = x.resultados;
          chart.radius = am4core.percent(90);
          chart.responsive.enabled = true;
          chart.fill = am4core.color("dark");

          chart.tooltip.fill = am4core.color("white");

          const pieSeries = chart.series.push(new am4charts.PieSeries());
          pieSeries.dataFields.value = "total";
          pieSeries.dataFields.category = "item";
          pieSeries.slices.template.showOnInit = true;
          pieSeries.slices.template.hiddenState.properties.shiftRadius = 1;
          pieSeries.hiddenState.transitionDuration = 1000;
          pieSeries.hiddenState.transitionEasing = am4core.ease.bounceInOut;
          // Disable ticks and labels
          //pieSeries.labels.template.disabled = true;
          pieSeries.ticks.template.disabled = true;
          pieSeries.alignLabels = false;
          pieSeries.labels.template.text = "[center][bold black]{category}[/][/]\n{value.percent.formatNumber('#.0')}%";
          pieSeries.labels.template.radius = am4core.percent(-90);
          pieSeries.labels.template.textAlign = "middle";
          pieSeries.labels.template.fill = am4core.color("white");
          pieSeries.labels.template.relativeRotation = 90;

          pieSeries.labels.template.adapter.add("text", function(text, target) {
            if (target.dataItem && target.dataItem.values.value.value === 0 ) {
              return "";
            }
            else {
              return text;
            }
          });

          pieSeries.labels.template.adapter.add("radius", function(radius, target) {
            if (target.dataItem && (target.dataItem.values.value.percent < 1)) {
              return null;
            }
            return radius;
          });
          this.piesChart.push(chart);

        });
      },500);

  }

  // Funciones
  mostrarSedeNombre(id: number): string{
      const sede = this.collectionSede.find( s => s.id === id );
      if( sede ){
        return sede.nombre;
      }else{
        return '';
      }
  }
  mostrarColorEstado(idEstado: number): string{
    const estado = CitaEstadoColor.find( e => e.idEstado === idEstado);
    if( estado ){
      return estado.color;
    }else{
      return '';
    }
  }
  cambiarSedeGrafico(): void{
    this.obtenerDatosGrafico(this.idSedeG.value,this.f.fdesde.value, this.f.fhasta.value);
  }


  /*****Amchart ****/
  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }
  // Dibujar Grafico general
  /*dibujarGraficoGeneral(): void{

    // Apply chart themes
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_kelly);
    am4core.addLicense("ch-custom-attribution");

    // Create chart instance
    this.chart = am4core.create("chartGeneral", am4charts.XYChart);

    const data: any[] = [];

    this.collectionTipos.forEach(t => {
      const medicion: any = {tipo: t.nombre};
      this.collectionAlternativas.filter( a => a.idTipoMedicion === t.id ).forEach( (a,i) => {
        medicion[a.id] = this.collectionData.filter( x => x.tipoMedicion === t.nombre && x.alternativa ===a.nombre  ).length
      });
      data.push(medicion);
    });

    // Add data
    this.chart.data = data;

    // Create axes
    const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "tipo";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.disabled = false;
    categoryAxis.title.text = "Variable medición";
    categoryAxis.renderer.cellStartLocation = 0.2;
    categoryAxis.renderer.cellEndLocation = 0.8;

    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Cantidad";
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;


    // Create series
    this.collectionAlternativas.forEach( (a,i) => {
      const columnSeries = this.chart.series.push(new am4charts.ColumnSeries());
      columnSeries.dataFields.valueY = a.id+"";
      columnSeries.dataFields.categoryX = "tipo";
      columnSeries.columns.template.tooltipText = a.nombre + ": [bold]{valueY}[/]";
      columnSeries.columns.template.strokeWidth = 0;
      columnSeries.columns.template.width = am4core.percent(95);
      columnSeries.columns.template.tooltipY = 0;
      columnSeries.columns.template.fill = am4core.color(this.colores[i]);

      const labelBullet = columnSeries.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.verticalCenter = "bottom";
      labelBullet.label.dy = -10;
      labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

      // Add legend
      //pieChart.legend = new am4charts.Legend();
      columnSeries.legendSettings.labelText = "[{stroke}]"+ a.nombre +"[/]";
    });

    this.chart.legend = new am4charts.Legend();

    //legend.data.push(this.chart.series.values);

  }*/



}



