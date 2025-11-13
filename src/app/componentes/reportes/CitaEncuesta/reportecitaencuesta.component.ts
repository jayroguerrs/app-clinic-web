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
import { CitaMedicionGeneral } from 'src/app/shared/models/CitaMedicion';
import {AlternativaMedicionService} from "../../../shared/services/alternativa-medicion.service";
import { AlternativaMedicion } from 'src/app/shared/models/alternativa-medicion';
import { TotalCitasEncuestadas } from 'src/app/shared/models/reportecitas';
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";
import {Subscription} from "rxjs";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'reportecitaencuesta.component.html' ,
  styleUrls: ['./reportecitaencuesta.component.scss'],
  providers: [DatePipe]
})
export class ReportecitaencuestaComponent implements OnInit, OnDestroy, AfterViewInit{

    citasAtendidas: number = 0;
    citasSatisfaccion: number = 0;
    citasEfectividad: number = 0;
    citasPagadas: number = 0;


    // Load data form
    loadingSede = false;
    loadingTipo = false;
    collectionSede: RSede[] = [];
    collectionEstado: any[] = [];
    collectionTipos: TipoMedicion[] = [];
    collectionAlternativas: AlternativaMedicion[] = [];

    // Formulario
    submitted = false;
    formGroup: FormGroup;
    subscription: Subscription | undefined;
    sbcTotalCitasAtendidas: Subscription | undefined;

    today: Date;


    // Datatable
    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
    dtResponsiveOptions: any = {};
    selected = 0;
    citaEstado: RCitaMotivoGeneral = null;
    dataTable: any;

    // Collection Data
    collectionData: CitaMedicionGeneral[] = [];

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

    loadingServicios = false;
    servicios: Servicio[] = [];

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
      private citaMedicionService: CitaMedicionService,
      private servicioService: ServicioService,
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
        idVariable: new FormControl('0'),
        idServicio: new FormControl('0')
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
      this.obtenerServicios();
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
      // Clean up chart when the component is removed
      this.charts.forEach((chart) => {
        chart.column.dispose();
        chart.pie.dispose();
      });
      this.subscription?.unsubscribe();
      this.sbcTotalCitasAtendidas?.unsubscribe();
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

    obtenerServicios(): void{
      this.loadingServicios = true;
      this.servicioService.listar().subscribe((res: Servicio[]) => {
        this.loadingServicios = false;
        this.servicios = res;
      }, error => {
        this.loadingServicios = false;
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
      this.sbcTotalCitasAtendidas?.unsubscribe();
      this.sbcTotalCitasAtendidas = this.citaMedicionService.obtenerTotalCitasAtendidas(this.f.fdesde.value, this.f.fhasta.value, parseInt(this.f.idSede.value)).subscribe((res: TotalCitasEncuestadas) => {
        this.citasAtendidas = res.totalCitas;
        this.citasPagadas = res.totalCitasPagadas;
        this.citasEfectividad = res.totalEfectividad;
        this.citasSatisfaccion = res.totalSatisfaccion;
      }, error => {
        console.log(error)
      });

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
        this.subscription?.unsubscribe();


        this.subscription = this.api.reporteGeneral( this.f.idSede.value, this.f.fdesde.value, this.f.fhasta.value, this.f.idVariable.value, this.f.idServicio.value ).subscribe((res: CitaMedicionGeneral[]) => {
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
          this.dibujarGraficoGeneral();
          this.dibujarGraficoGeneralBySede(Sedes.MEGA_PLAZA, 'megaPlazaEstadosChart' ,'megaPlazaMotivosChart');
          this.dibujarGraficoGeneralBySede(Sedes.PUEBLO_LIBRE, 'puebloLibreEstadosChart' ,'puebloLibreMotivosChart');
          this.dibujarGraficoGeneralBySede(Sedes.SAN_BORJA, 'sanBorjaEstadosChart' ,'sanBorjaMotivosChart');
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
        { title: 'Cita', data: 'idCita', className: 'align-middle', render: (data: any, type, row) => {
            return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0' target='_blank''>${ data }</a>`;
        }},
        { title: 'Cliente', data: 'cliente' , className: 'align-middle', render: (data: any, type, row) => {
            return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
        }},
        { title: 'Estado', data: 'estado', render: (data, type, full, meta) => {
          return `<span class="text-white py-1 text-uppercase estado rounded small" style="background-color:${full.estadoColor}">${full.estado}</span>`;
        }, className: 'align-middle', width: '120px'},
        { title: 'Atendio', data: 'usuarioAtendio' , className: 'align-middle', width: '100px'},
        { title: 'Genero', data: 'genero' , className: 'align-middle', width: '100px'},
        { title: 'Sede', data: 'idSede', className: 'align-middle', render: (data) => {
            return this.mostrarSedeNombre(data);
          }},
        { title: 'Variable Medición', data: 'tipoMedicion', className: 'align-middle'},
        { title: 'Alternativa', data: 'alternativa', className: 'align-middle'},
        { title: 'Servicio', data: 'servicio', className: 'align-middle', render: (data, type, full, meta) => {
            return `<span class="rounded px-2 py-1 d-block small text-white" style="background-color:${full.servicioColor}">${data}</span>`;
          }},
        { title: 'Fecha Registro', data: 'fechaRegistro', render: (data: Date) => {
          return this.utilsService.formato_FechaString(data);
        }, className: 'align-middle', width: '100px'},
        { title: 'Hora Registro', data: 'fechaRegistro', render: (data: Date) => {
            return this.datePipe.transform(data,'hh:mm:ss');
          }, className: 'align-middle', width: '100px'},
        { title: 'Usuario Registro', data: 'usuarioRegistro', className: 'align-middle'},
        { title: 'Sgte. Cita', data: 'siguienteCita', className: 'align-middle'},
      ],
      serverSide: false,
      processing: false,
      async: true,
      cache: false,
      buttons: [
        {
          extend: 'excelHtml5',
          title: function(){
            return 'Reporte encuesta cita '+ _this.f.fdesde.value + ' hasta ' + _this.f.fhasta.value;
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
                '<tr data-dt-row="' + x.rowIndex + '" data-dt-column="'+x.columnIndex+'">' +
                '<td><b>' + x.title + '</b></td>' +
                '<td><b>:</b></td>' +
                '<td>' + x.data + '</td>' +
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
  dibujarGraficoGeneral(): void{

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

  }

  // Dibujar grafico general por motivo pendiente
  dibujarGraficoGeneralBySede(idSede: number , elementByColumnChart: string, elementByPieChart: string): void{

    const data: any[] = this.filtrarData(idSede);
    let currentActive: any = null;

    /**
     * COLUMN CHART
     **/
    // Apply chart themes
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_kelly);
    am4core.addLicense("ch-custom-attribution");

    const columnChart = am4core.create(elementByColumnChart, am4charts.XYChart);
    //columnChart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    columnChart.data = data;

    // Create axes
    const categoryAxis = columnChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "variable";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.disabled = false;
    categoryAxis.title.text = "Variables de medición";

    const valueAxis = columnChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Cantidad";
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;

    // Create series
    const columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
    columnSeries.dataFields.valueY = "total";
    columnSeries.dataFields.categoryX = "variable";
    columnSeries.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    columnSeries.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    columnSeries.columns.template.stroke = am4core.color("#fff");

    columnSeries.columns.template.adapter.add("fill", (fill, target) => {
      return columnChart.colors.getIndex(10+columnSeries.columns.indexOf(target));
    });


    const labelBullet = columnSeries.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

    const columnTemplate = columnSeries.columns.template;
    columnTemplate.strokeWidth = 3;
    columnTemplate.strokeOpacity = 1;

    const activeState = columnSeries.columns.template.states.create("active");
    activeState.properties.stroke = am4core.color('black');


    /**
     * Pie chart
     */

    // Create chart instance
    const pieChart: any = am4core.create(elementByPieChart, am4charts.PieChart);
    pieChart.data = [{
      total: 1000,
      motivo: "ddd",
      "disabled": true,
      "color": am4core.color("#dadada"),
      "opacity": 0.3,
      "strokeDasharray": "4,4",
      "tooltip": ""
    }];
    pieChart.innerRadius = am4core.percent(50);

    const title = pieChart.titles.create();
    title.text = "";
    title.fontSize = 13;
    title.marginBottom = 0;
    title.opacity = .5;

    // Add and configure Series
    const pieSeries: any = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "opcion";
    pieSeries.dataFields.hiddenInLegend = "disabled";

    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    pieSeries.labels.template.propertyFields.disabled = "disabled";
    pieSeries.ticks.template.propertyFields.disabled = "disabled";


    /* Set tup slice appearance */
    const slice = pieSeries.slices.template;
    slice.propertyFields.fill = "color";
    slice.propertyFields.fillOpacity = "opacity";
    slice.propertyFields.stroke = "color";
    slice.propertyFields.strokeDasharray = "strokeDasharray";
    slice.propertyFields.tooltipText = "tooltip";


    // Add legend
    pieChart.legend = new am4charts.Legend();
    //pieChart.legend.position = "right"


    const label = pieChart.seriesContainer.createChild(am4core.Label);
    label.textAlign = "middle";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.text = pieChart.data.length === 1 ? "Seleccionar una variable de medición" : "";
    label.opacity = .5;

    // Column events
    columnSeries.columns.template.events.on("hit",  function(ev: any) {

      if (currentActive) {
        currentActive.isActive = false;
      }
      currentActive = ev.target;
      currentActive.isActive = true;

      const data = ev.target.dataItem.dataContext.alternativas;

      if( data.find(x => x.opcion === "1") ){
        pieSeries.colors.list = this.colores.filter( (x,i) => (i > 4) ).map( x => am4core.color(x) );
      }else{
        pieSeries.colors.list = this.colores.filter( (x,i) => (i < 5) ).map( x => am4core.color(x) );
      }

      pieChart.data = data;

      title.text = "Variable : " + ev.target.dataItem.dataContext.variable;
      if( pieChart.data.length < 2 ){
        label.opacity = .5;
      }else{
        label.opacity = 0;
      }

      pieSeries.hide(0);
      pieSeries.show();

    }, this);

    this.charts.push({ column: columnChart, pie: pieChart });

  }

  filtrarData( idSede: number = Sedes.SAN_BORJA ): any[]{
    const variables: any[] = [];
    this.collectionTipos.forEach( t => {
      variables.push({id:t.id,value:t.nombre});
    });

    const output : any[] = [];
    const sedeCitas = this.collectionData.filter( c => c.idSede === idSede );

    variables.forEach( e => {
      const variables: any = {
        variable: e.value,
        total: sedeCitas.filter( s => s.tipoMedicion === e.value ).length,
        alternativas: []
      };
      this.collectionAlternativas.filter( a => a.idTipoMedicion === e.id ).forEach( a => {
        variables.alternativas.push({
          opcion: a.nombre,
          total: sedeCitas.filter( s => s.alternativa === a.nombre && s.tipoMedicion === e.value).length
        })
      });
      output.push(variables);
    });

    //console.log(output);

    return output;
  }
}



