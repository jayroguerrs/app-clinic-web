import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, NgZone} from '@angular/core';

import {ReportesService} from '../../../shared/services/reportes-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../../shared/services/funciones/utils.service';

import '../../../../../node_modules/morris.js/morris.js';

import {DatePipe, isPlatformBrowser} from '@angular/common';
import {SedeService} from "../../../shared/services/sede.service";
import {RSede} from "../../../shared/interfaces/Response/sede";
import {CitaEstado, Sedes} from "../../../shared/enumeracion/enums";
import {CitaMotivoEstadoService} from "../../../shared/services/cita-motivo-estado.service";
import {DataTableDirective} from "angular-datatables";
import {RCitaMotivoGeneral, CitaEstadoColor, RCitaMotivo} from "../../../shared/interfaces/Response/cita-motivo-estado";
import {NgxSpinnerService} from "ngx-spinner";

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';

import {CitaMotivoService} from "../../../shared/services/cita-motivo.service";
import {EstadoService} from "../../../shared/services/estado.service";
import {Estado} from "../../../shared/interfaces/estado";
import {Subscription} from "rxjs";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'reportecitaestado.component.html' ,
  styleUrls: ['./reportecitaestado.component.scss'],
  providers: [DatePipe]
})
export class ReportecitaestadoComponent implements OnInit, OnDestroy, AfterViewInit{


    // Sede
    loadingSede = false;
    collectionSede: RSede[] = [];
    collectionEstado: any[] = [];
    collectionMotivos: RCitaMotivo[] = [];

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

    // Subscription
    sbcCollectionEstado: Subscription;

    // Collection Data
    collectionData: RCitaMotivoGeneral[] = [];

    // Charts
    titleChart : string;
    private chart: am4charts.XYChart;

    private charts: { column: am4charts.XYChart,
      pie: am4charts.PieChart }[] = [];

    // Spinner
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

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
      private estadoService: EstadoService,
      private api: CitaMotivoEstadoService,
      private spinner: NgxSpinnerService,
      private citaMotivoService: CitaMotivoService,
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
        idEstado: new FormControl('0')
      });

      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
        {threshold: [1]}
      );

      this.titleChart = "Desde " + this.f.fdesde.value+ " hasta " + this.f.fhasta.value ;

    }

    ngOnInit(): void {
      this.obtenerMotivos();
      this.obtenerSedes();
      this.obtenerEstados();
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

      if(this.sbcCollectionEstado){ this.sbcCollectionEstado.unsubscribe(); }
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
      this.sbcCollectionEstado = this.estadoService.obtenerEstadoByEntidad('cita').subscribe((res) => {
        this.collectionEstado = res;
      }, error => {
        console.log(error);
      })
    }

  obtenerMotivos(): void{
    this.citaMotivoService.collection().subscribe((res) => {
      this.collectionMotivos = res;
    }, error => {
      console.log(error);
    }, () => {
    });
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

        this.api.reporteGeneral( this.f.idSede.value, this.f.fdesde.value, this.f.fhasta.value, this.f.idEstado.value ).subscribe((res) => {
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
          return `<span class="text-white py-1 d-inline-block text-center estado rounded small text-uppercase" style="background-color:${full.estadoColor}">${full.estado}</span>`;
        }, className: 'align-middle', width: '120px'},
        { title: 'Genero', data: 'genero' , className: 'align-middle', width: '100px'},
        { title: 'Motivo', data: 'motivo', className: 'align-middle'},
        { title: 'Sede', data: 'idSede', className: 'align-middle', render: (data) => {
            return this.mostrarSedeNombre(data);
        }},
        { title: 'Fecha Registro', data: 'fechaRegistro', render: (data: Date) => {
          return this.utilsService.formato_FechaString(data);
        }, className: 'align-middle', width: '100px'},
        { title: 'Hora Registro', data: 'fechaRegistro', render: (data: Date) => {
            return this.datePipe.transform(data,'hh:mm:ss');
          }, className: 'align-middle', width: '100px'},
        { title: 'Usuario Registro', data: 'usuarioRegistro', className: 'align-middle'},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: function(){
            return 'Reporte estado cita '+ _this.f.fdesde.value + ' hasta ' + _this.f.fhasta.value;
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
      },
      select: true
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

    const charColors: any[] = []
    charColors.push(am4core.color(this.mostrarColorEstado(CitaEstado.CANCELADA)));
    charColors.push(am4core.color(this.mostrarColorEstado(CitaEstado.ANULADA)));
    charColors.push(am4core.color(this.mostrarColorEstado(CitaEstado.PENDIENTE)));

    // Apply chart themes
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_kelly);
    am4core.addLicense("ch-custom-attribution");

    // Create chart instance
    this.chart = am4core.create("chartGeneral", am4charts.XYChart);

    const data: any[] = [];

    data.push({ estado: "Cancelada", total: this.collectionData.filter( c => c.estado === 'Cancelada' ).length });
    data.push({ estado: "Anulada", total: this.collectionData.filter( c => c.estado === 'Anulada' ).length });
    data.push({ estado: "Pendiente", total: this.collectionData.filter( c => c.estado === 'Pendiente' ).length });

    // Add data
    this.chart.data = data;

    // Create axes
    const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "estado";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.disabled = false;
    categoryAxis.title.text = "Cita estados";

    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Cantidad";
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;

    // Create series
    const columnSeries = this.chart.series.push(new am4charts.ColumnSeries());
    columnSeries.dataFields.valueY = "total";
    columnSeries.dataFields.categoryX = "estado";
    columnSeries.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    columnSeries.columns.template.strokeWidth = 0;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    columnSeries.columns.template.adapter.add("fill", function (fill, target) {
      return charColors[target.dataItem.index];
    });

    const labelBullet = columnSeries.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";




  }

  // Dibujar grafico general por motivo pendiente
  dibujarGraficoGeneralBySede(idSede: number , elementByColumnChart: string, elementByPieChart: string): void{

    const data: any[] = this.filtrarData(idSede);
    let currentActive: any = null;
    const charColors: any[] = []
    charColors.push(am4core.color(this.mostrarColorEstado(CitaEstado.CANCELADA)));
    charColors.push(am4core.color(this.mostrarColorEstado(CitaEstado.ANULADA)));
    charColors.push(am4core.color(this.mostrarColorEstado(CitaEstado.PENDIENTE)));

    /**
     * COLUMN CHART
     **/
    // Apply chart themes
    am4core.useTheme(am4themes_animated);
    am4core.addLicense("ch-custom-attribution");

    const columnChart = am4core.create(elementByColumnChart, am4charts.XYChart);
    //columnChart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    columnChart.data = data;

    // Create axes
    const categoryAxis = columnChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "estado";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.disabled = false;
    categoryAxis.title.text = "Cita estados";

    const valueAxis = columnChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Cantidad";
    valueAxis.min = 0;
    valueAxis.maxPrecision = 0;

    // Create series
    const columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
    columnSeries.dataFields.valueY = "total";
    columnSeries.dataFields.categoryX = "estado";
    columnSeries.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    columnSeries.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    columnSeries.columns.template.stroke = am4core.color("#fff");

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    columnSeries.columns.template.adapter.add("fill", function (fill, target) {
      return charColors[target.dataItem.index];
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
    const pieChart = am4core.create(elementByPieChart, am4charts.PieChart);
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
    const pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "total";
    pieSeries.dataFields.category = "motivo";
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
    label.text = pieChart.data.length === 1 ? "Seleccionar un estado" : "";
    label.opacity = .5;

    // Column events
    columnSeries.columns.template.events.on("hit", function(ev: any) {

      if (currentActive) {
        currentActive.isActive = false;
      }
      currentActive = ev.target;
      currentActive.isActive = true;

      pieChart.data = ev.target.dataItem.dataContext.motivos;
      title.text = "Estado : " + ev.target.dataItem.dataContext.estado;
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
    const estados: any[] = [
      {id: CitaEstado.CANCELADA,value:"Cancelado"},{id: CitaEstado.ANULADA,value:"Anulado"},{id: CitaEstado.PENDIENTE,value:"Pendiente"}
    ];
    const output : any[] = [];
    const sedeCitas = this.collectionData.filter( c => c.idSede === idSede );

    estados.forEach( e => {
      const arrMotivos = this.collectionMotivos.filter( m => m.idCitaEstado === e.id );
      const estados: any = {
        estado: e.value,
        total: sedeCitas.filter( s => s.idEstado === e.id ).length,
        motivos: []
      };
      arrMotivos.forEach( m => {
        estados.motivos.push({
          motivo: m.motivo,
          total: sedeCitas.filter( s => s.motivo === m.motivo ).length
        })
      });
      output.push(estados)
    });

    // console.log(output);

    return output;
  }
}



