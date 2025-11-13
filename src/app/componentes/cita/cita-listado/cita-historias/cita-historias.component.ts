import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import { DataTableDirective } from 'angular-datatables';
import {Estado} from "../../../../shared/interfaces/estado";
import {EstadoService} from "../../../../shared/services/estado.service";
import { Subscription } from 'rxjs';
import {DatePipe} from "@angular/common";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
declare var $: any;

@Component({
  selector: 'app-cita-historias',
  templateUrl: './cita-historias.component.html',
  styleUrls: ['./cita-historias.component.scss']
})
export class CitaHistoriasComponent implements OnInit, AfterViewInit, OnDestroy {


  @Input() modal: NgbModalRef;
  @Input() citas: any[] = [];
  @Input() fecha: string | null = null;

  @Input() esListadoDeInicio: boolean = false;

  estados: Estado[] = [];

  // Datatable
  dtResponsiveOptions: any = {};
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;

  // Subscription
  sbcCollectionEstados: Subscription;

  dataTable: any | undefined;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accImp: boolean = false;
  constructor(
    private utilsService: UtilsService,
    private estadoService: EstadoService,
    private datePipe: DatePipe,
    private permisoHelper: PermisoHelper
  ) {

  }

  ngOnInit(): void {

    this.obtenerListaEstados();
    // this.citas = this.citas.filter((c => c.numeroHistoria.trim() !=='' ));
    const buttonCommon = {
      exportOptions: {
        format: {
          body: function ( data, row, column, node ) {
            // Strip $ from salary column to make it numeric
            return data;
          }
        }
      }
    };


    this.dtResponsiveOptions = {
      data: this.citas,
      pageLength: 10,
      autoWidth: false,
      // Declare the use of the extension in the dom parameter
      // dom: '<"mb-3 d-flex"B><"mb-3 d-flex"l>r<t>ip',
      select: false,
      searching: true,
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
        {
          data: 'horaInicio', title: 'Hora', render: (data) => {
            return this.datePipe.transform(new Date(data),'hh:mm a');
        }},{
          data: 'idCliente', title: 'Id Cliente'},
        {
          data: 'nombres', title: 'Cliente', render: (data,xhr,full) => {
            //? ACA CONDICIONAL
            if(this.esListadoDeInicio === true){
              return full.nombreCliente
            }
            return `${full.nombres}  ${full.apellidos}`;
        }},
        { title: 'CITA', data: 'idCita',
          render: (data: any, type, row) => {
              //return `https://google.com.pe`;
              //return '==HYPERLINK("http://example.microsoft.com/report/budget report.xlsx", "Click for report")';
              return `${ document.location.protocol }//${ document.location.host }/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0`;
          }
        },{
          data: 'seudonimoPaciente', title: 'Alias',
        },{
          data: 'numerosCelulares', title: 'Celular',
        },{
          data: 'idFichaAdmision', title: 'Ficha', render: (data) => {
            if(this.esListadoDeInicio === true){
              return ''
            }
            return data ? 'SI' : 'NO';
        }},{
          data: 'nuevoCliente', title: 'N.Cliente', render: (data: boolean,xhr,full) => {
          if(this.esListadoDeInicio === true){
            return full.clienteNuevo
          }

          return data ? 'SI' : 'NO';
        }}
      ],
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
      language: this.utilsService.datatableIdioma,
      buttons: {
        buttons: [
          {
            extend: 'excelHtml5',
            autoFilter: true,
            text: 'Excel',
            title: 'Historial Cita',
            exportOptions: {
              //stripHtml: false,
              columns: [1,2,3,5,6,7,8]
            },
            init: function (api, node, config) {
              $(node).attr('id', 'btnExcel'); // Asigna el id al botón
            }
            /*exportOptions: {
              modifier: {
                page: 'all'
              },
              format: {
                header: function (data, columnIdx) {
                  const headers: string[] = ['','Historia','Cliente','Estado']
                  return headers[columnIdx];
                }
              }
            }*/
          }, {
            extend: 'excelHtml5',
            customize: function( xlsx ) {

              var sheet = xlsx.xl.worksheets['sheet1.xml'];

              // Loop over all cells in sheet
              $('row c', sheet).each( function () {

                // if cell starts with http
                if ( $('is t', this).text().indexOf("http") === 0 ) {

                  // (2.) change the type to `str` which is a formula
                  $(this).attr('t', 'str');
                  //append the formula
                  $(this).append('<f>' + 'HYPERLINK("'+$('is t', this).text()+'","'+$('is t', this).text()+'")'+ '</f>');
                  //remove the inlineStr
                  $('is', this).remove();
                  // (3.) underline
                  $(this).attr( 's', '4' );
                }
              });
            },
            autoFilter: true,
            text: 'Excel Encuesta',
            title: this.titleExcel(),
            exportOptions: {
              //stripHtml: false,
              columns: [1,2,3,4,5,6,7,8]
            },
            init: function (api, node, config) {
              $(node).attr('id', 'btnEncuestaExcel'); // Asigna el id al botón
            }
            /*exportOptions: {
              modifier: {
                page: 'all'
              },
              format: {
                header: function (data, columnIdx) {
                  const headers: string[] = ['','Historia','Cliente','Estado']
                  return headers[columnIdx];
                }
              }
            }*/
          }],
        dom: {
          button: { className: "btn btn-sm btn-primary"},
          buttonLiner: { tag: null }
        }
      },
      "dom": '<"d-flex mb-2"B>lfrtip'
    };

    this.permisoHelper.readPermiso().then((accesos) => {
      console.log(accesos);
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accImp = accesos.accImp;  
    });
  }

  ngOnDestroy(): void {
    if( this.sbcCollectionEstados ){ this.sbcCollectionEstados.unsubscribe(); }
  }

  ngAfterViewInit(): void {

    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.columns().every(function () {
        const that = this;

        $('input', this.header()).on('keyup change clear', function () {
          if (that.search() !== this['value']) {
            that
              .search(this['value'])
              .draw();
          }
        });

        $('select', this.header()).on('change', function () {
          if (that.search() !== this['value']) {
            that
              .search(this['value'])
              .draw();
          }
        });

      });



      /*         $('select', this.header()).on('change', function () {
          if (that.search() !== this['value']) {
            that
              .search(this['value'])
              .draw();
          }
        }); */
    });

    setTimeout(() => {      
      if(this.accTot || this.accExc){
        $('#btnExcel').show(); 
        $('#btnEncuestaExcel').show(); 
      }
      else{
        $('#btnExcel').hide(); 
        $('#btnEncuestaExcel').hide();
      }
      
    }, 200);
  }

  obtenerListaEstados(): void{
    this.sbcCollectionEstados = this.estadoService.obtenerEstadoByEntidad('Cita').subscribe((res)=>{
      res.map( (e) => {
        this.estados.push({
          id: e.id,
          name: e.descripcion
        })
      });
    });
  }

  titleExcel(): string{
    return `Historial para encuesta de citas del ${this.fecha}`
  }

  cerrarModal(): void {
    this.modal.close();
  }

}
