import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, NgZone} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

//import '../../../../../node_modules/morris.js/morris.js';

import {DatePipe, isPlatformBrowser} from '@angular/common';
import {DataTableDirective} from "angular-datatables";
import {NgxSpinnerService} from "ngx-spinner";

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';


import { AlternativaMedicion } from 'src/app/shared/models/alternativa-medicion';
import { RSede } from 'src/app/shared/interfaces/Response/sede.js';
import { TipoMedicion } from 'src/app/shared/models/tipo-medicion.js';
import {CitaEstadoColor, RCitaMotivoGeneral} from 'src/app/shared/interfaces/Response/cita-motivo-estado.js';
import { CitaMedicionGeneral } from 'src/app/shared/models/CitaMedicion.js';
import { ReportesService } from 'src/app/shared/services/reportes-service.js';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service.js';
import { SedeService } from 'src/app/shared/services/sede.service.js';
import {CitaMedicionService} from "../../../../shared/services/cita-medicion.service";
import {AlternativaMedicionService} from "../../../../shared/services/alternativa-medicion.service";
import {TipoMedicionService} from "../../../../shared/services/tipo-medicion.service";
import {CitaEstado, Sedes} from "../../../../shared/enumeracion/enums";
import {ZonaCorporalService} from "../../../../shared/services/zona-corporal.service";
import { Zona } from 'src/app/shared/models/zonas';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'reportezonas.component.html' ,
  styleUrls: ['./zonasmasatendidas.component.scss'],
  providers: [DatePipe]
})
export class ReporteZonasMaximoComponent implements OnInit{

  // Load data form
  loadingSede = false;
  collectionSede: RSede[] = [];

  // Formulario
  submitted = false;
  formGroup: FormGroup;

  today: Date;


  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  dataTable: any;

  // Collection Data
  collectionData: Zona[] = [];

  // Charts
  titleChart : string;
  private chart: am4charts.XYChart;

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
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private api: ZonaCorporalService,
    private spinner: NgxSpinnerService,
    private permisoHelper: PermisoHelper,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone
  ) {
      this.today = new Date();

      this.formGroup = this.formBuilder.group({
        idSede: new FormControl(0),
        fdesde: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        fhasta: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
      });

      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
        {threshold: [1]}
      );

      this.titleChart = "Desde " + this.f.fdesde.value+ " hasta " + this.f.fhasta.value ;
  }

  ngOnInit(): void {
    this.obtenerSedes();
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

      // dtInstance.on('select', function (e, dt, type, indexes ) {
      //   if ( type === 'row' ) {
      //     _this.citaEstado = dtInstance.rows('.selected').data()[0];
      //   }
      //   _this.selected = dtInstance.rows({ selected: true }).count();
      // });
      // dtInstance.on('deselect', function (e, dt, type, indexes ) {
      //   _this.citaEstado = null;
      //   _this.selected = dtInstance.rows({ selected: true }).count();
      // });
    });

  }

  ngOnDestroy(): void {
    // Clean up chart when the component is removed
    this.chart.dispose();
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

        this.api.ObtenerCantidadAtendidas( this.f.fdesde.value, this.f.fhasta.value, this.f.idSede.value,0,0, 1 ).subscribe((res) => {
          callback({ data : res });
          console.log(res);

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
        // { title: 'Código', data: 'id', className: 'align-middle'},
        { title: 'Zona', data: 'nombre', className: 'align-middle'},
        { title: 'Cantidad', data: 'cantidad' , className: 'align-middle'}
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: function(){
            return 'Reporte top 10 zonas mas atendidas desde '+ _this.f.fdesde.value + ' hasta ' + _this.f.fhasta.value;
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

    am4core.ready(() => {

        // Apply chart themes
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_kelly);
        am4core.addLicense("ch-custom-attribution");

        // Create chart instance
        this.chart = am4core.create("chartGeneral", am4charts.XYChart);
        this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in


        // Add data
        this.chart.data = this.collectionData;

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



        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add("fill", (fill, target) => {
          return this.chart.colors.getIndex(target.dataItem.index);
        });

        this.chart.legend = new am4charts.Legend();

        const legendContainer = am4core.create("legendChartGeneral", am4core.Container);
        legendContainer.width = am4core.percent(100);

        this.chart.legend.parent = legendContainer;
        //this.chart.legend.position = "bottom"; // Positionning your legend to the right of the chart
        this.chart.legend.scrollable = true;

        series.events.on("ready", (ev) => {
          const legenddata = [];
          series.columns.each(function(column: any) {
            legenddata.push({
              name: column.dataItem.categoryX,
              fill: column.fill,
              columnDataItem: column.dataItem
            });
          });
          this.chart.legend.data = legenddata;
        });

        this.chart.legend.itemContainers.template.events.on("hit", function(ev: any) {
          //console.log("Clicked on ", ev.target.dataItem.className);
          if (!ev.target.isActive) {
            ev.target.dataItem.dataContext.columnDataItem.hide();
          }
          else {
            ev.target.dataItem.dataContext.columnDataItem.show();
          }
        });

        this.chart.legend.itemContainers.template.events.on("over", function(ev: any) {
          ev.target.dataItem.dataContext.columnDataItem.column.isHover = true;
          ev.target.dataItem.dataContext.columnDataItem.column.showTooltip();
        });

        this.chart.legend.itemContainers.template.events.on("out", function(ev: any) {
          ev.target.dataItem.dataContext.columnDataItem.column.isHover = false;
          ev.target.dataItem.dataContext.columnDataItem.column.hideTooltip();
        });

      }); // end am4core.ready()

  }


}
