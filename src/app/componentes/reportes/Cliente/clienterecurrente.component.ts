import { ElementRef,Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ReportesService} from '../../../shared/services/reportes-service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { GraficoslinealComponent } from '../graficos/graficolineal.component';
import Swal from 'sweetalert2';
import '../../../../../node_modules/morris.js/morris.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

declare var $: any;

@Component({
  templateUrl: 'clienterecurrente.component.html' ,providers: [DatePipe]
})
export class ClienterecurrenteComponent implements OnInit{
  @ViewChild(GraficoslinealComponent, {static: false}) graficoslinealComponent: GraficoslinealComponent;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  @ViewChild('barBasicChart') barBasicChart: ElementRef; // used barStackedChart, barHorizontalChart

  public barBasicChartData: any;
  public barBasicChartOption: any;
  public barBasicChartTag: CanvasRenderingContext2D;
  public barStackedChartOption: any;


  public barBasicMorrisData: any;
  public barBasicMorrisOption: any;
  public barStackedOption: any;


frmFiltroGrilla: FormGroup;
dtResponsiveOptions: any = {};
id = 0;

idcadena='';
cadena= [];
nombrecadena='';
clientecadena='';
citacadena='';
zonacadena='';

listaclienterecurrente: any;

// Permisos
accTot: boolean = false;
accExp: boolean = false;
accExc: boolean = false;
accExi: boolean = false;
accImp: boolean = false;
accExf: boolean = false;
constructor(
    private reporteservice: ReportesService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private permisoHelper: PermisoHelper
    ) {}

   ngOnInit(): void {
    this.graficos();
    this.inicializarFormulario();
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accImp = accesos.accImp;  
      this.accExf = accesos.accExf;
    });
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filtroFechaInicio: [new Date()],
      filtroFechaTermino: [new Date()],
      filterFacturacion: ['']
    });
    const date = new Date();
    this.frmFiltroGrilla.patchValue({
      filtroFechaInicio:  this.datePipe.transform(date, 'yyyy-MM-dd'),
      filtroFechaTermino:  this.datePipe.transform(date, 'yyyy-MM-dd')
    });
  }

  ngAfterViewInit(): void{
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance.buttons().container().appendTo( $('#hidden-btn'));

      $('#export-excel1').on('click', () => {
        dtInstance.button(0).trigger();
      });
   });
  }

  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const fecha1 = this.utilsService.formatDate( this.frmFiltroGrilla.controls.filtroFechaInicio.value);
        const fecha2 = this.utilsService.formatDate( this.frmFiltroGrilla.controls.filtroFechaTermino.value);
        const strFiltro = this.frmFiltroGrilla.controls.filterFacturacion.value;
        if (strFiltro === '')
        {
          // this.reporteservice.Obtenerclienterecurrente().subscribe( resultado => {
            this.reporteservice.Obtenerclienterecurrentefecha(fecha1, fecha2).subscribe( resultado => {

            callback({

                    data : resultado
            });
          }, error =>  {
            console.log('Error al obtener Cliente Recurrente: ' + error);
          });
        } else {
          // this.facturacionService.searchByLikeNombre(strFiltro).subscribe(resultado => {
          //   callback({
          //     data: resultado,
          //   });
          // }, error => {
          //   console.log('Error al obtener Caja por filtro: ' + error);
          // });
        }
      },
      columns: [
        { title: 'ID', data: 'id', width: '4%', visible: false },
        { title: 'Cliente', data: 'cliente', width: '20%' },
        { title: 'Cantidad de Citas', data: 'cantidadCitas', width: '20%' },
        { title: 'Cantidad de Zonas', data: 'cantidadZonas', width: '20%' },
        { title: 'Celular', data: 'celular', width: '20%' },
        { title: 'Documento', data: 'documento', width: '10%', visible: false },
      ],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
          this.id = data.id;
          this.listaclienterecurrente= data
        });
        return row;
      },
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        'excel'
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
  documentoenviar():void{

  }

  graficos(): void {
    setTimeout(() => {
      /* bar basic chart */
      const bar_basic_tag = (((<HTMLCanvasElement>this.barBasicChart.nativeElement).children));
      this.barBasicChartTag = ((bar_basic_tag['bar_basic_chart']).lastChild).getContext('2d');
      // used bar_stacked_chart, bar_horizontal_chart
      const abc = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
      abc.addColorStop(0, '#1de9b6');
      abc.addColorStop(1, '#1dc4e9');
      const def = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
      def.addColorStop(0, '#899FD4');
      def.addColorStop(1, '#A389D4');

      const fecha1 = this.utilsService.formatDate( this.frmFiltroGrilla.controls.filtroFechaInicio.value);
      const fecha2 = this.utilsService.formatDate( this.frmFiltroGrilla.controls.filtroFechaTermino.value);
      // this.reporteservice.Obtenerclienterecurrente().subscribe(resultadoclienterecu => {
        this.reporteservice.Obtenerclienterecurrentefecha(fecha1, fecha2).subscribe( resultadoclienterecu => {

      const cadenaid = resultadoclienterecu.map(x => x.id).join(',')
      this.idcadena=cadenaid

      const cadenacliente = resultadoclienterecu.map(x => x.cliente).join(",")
      this.clientecadena = cadenacliente
      const cadenacita = resultadoclienterecu.map(x => x.cantidadCitas).join(",")
      this.citacadena = cadenacita
      const cadenazonas = resultadoclienterecu.map(x => x.cantidadZonas).join(",")
      this.zonacadena = cadenazonas

      for (let i = 0, len = resultadoclienterecu.length; i < len; i += 1) {
        const o = resultadoclienterecu[i];
        const array={
          y:resultadoclienterecu[i].cliente,
          a:resultadoclienterecu[i].cantidadCitas,
          b:resultadoclienterecu[i].cantidadZonas,
        }
        this.cadena.push(array)
        const found = resultadoclienterecu.find( (e: any) => e === o );
        if (!found) {
          break;
        }
      }

       console.log('this.cadena',this.cadena)

      this.barBasicChartData = {
        labels: this.idcadena,
        datasets: [{
          label: 'Citas',
          data: this.zonacadena,
          borderColor: abc,
          backgroundColor: abc,
          hoverborderColor: abc,
          hoverBackgroundColor: abc,
        },
          {
          label: 'Zonas',
          data: this.citacadena,
          borderColor: def,
          backgroundColor: def,
          hoverborderColor: def,
          hoverBackgroundColor: def,
        }
      ]
      };
      this.barBasicChartOption = {
        barValueSpacing: 20
      };
            /* bar stacked chart */
            this.barStackedChartOption = {
              barValueSpacing: 20,
              scales: {
                xAxes: [{
                  stacked: true,
                }],
                yAxes: [{
                  stacked: true
                }]
              }
            };

            this.barBasicMorrisData = this.cadena

            this.barBasicMorrisOption = {
              xkey: 'y',
              barSizeRatio: 0.70,
              barGap: 3,
              resize: true,
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
              ykeys: ['a', 'b'],
              labels: ['Citas', 'Zonas'],
              barColors: ['0-#1de9b6-#1dc4e9', '0-#899FD4-#A389D4']
            };

           this.barStackedOption = {
              xkey: 'y',
              stacked: true,
              barSizeRatio: 0.50,
              barGap: 3,
              resize: true,
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
              ykeys: ['a', 'b'],
              labels: ['Citas', 'Zonas'],
              barColors: ['0-#1de9b6-#1dc4e9', '0-#899FD4-#A389D4']
            };
    });
 }, 500);
  }
  documentoListar(): void {
    $('.table-clienterecurrente').DataTable().ajax.reload();
    this.graficos();
  }
  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData2');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_ReporteDatosClienteRecurrente.pdf`);
    });
  }
  downloadPDFGrafico() {
    // Extraemos el
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_ReporteGraficoClienteRecurrente.pdf`);
    });
  }
  documentoimprmir(): void {
    // this.imprimirfacturacionComponent.abrirModal(this.id);
  }
  documentoEditar(): void {
    // this.imprimirfacturacionComponent.abrirModal(this.id);
  }
}
