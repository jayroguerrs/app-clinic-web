import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';


import {DatePipe} from '@angular/common';
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DataTableDirective} from "angular-datatables";
import {BehaviorSubject, Subscription} from "rxjs";
import {CitaReporte} from "../../../../shared/models/cita";
import {CitaService} from "../../../../shared/services/cita.service";

declare var $: any;

@Component({
  selector: 'tbl-cita-reporte',
  templateUrl: 'tbl-cita-reporte.component.html' ,
  styleUrls: ['./tbl-cita-reporte.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class TblCitaReporteComponent implements OnInit, OnDestroy, AfterViewInit{

    @Input() fechaInicio: string;
    @Input() fechaFin: string;
    @Input() idSede: number;
    @Input() idServicio:number;
    @Input() idEstado: number;
    @Input() idTipoCita: number;
    @Input() idZona: number;

    @Input() clienteNuevo: any;
    @Input()unirCitas: boolean = false;
    dtResponsiveOptions: any = {};
    dataTable: any;

    loading = false;
    subscription : Subscription | null = null;

    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

    _collection = new BehaviorSubject<CitaReporte[]>([]);
    _loading = new BehaviorSubject<boolean>(false);

    constructor(
      private api: CitaService,
      private datePipe: DatePipe,
      private utilsService: UtilsService
    ) {

    }

    ngOnInit(): void {
      this.render();
    }

    ngAfterViewInit(): void {
      this.datatableElement.dtInstance.then((dtInstance: any) => {
        this.dataTable = dtInstance;
      });
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    filtrarResExecl(res: any){
      const citasUnificadas = Object.values(
      res.reduce((acc, cita) => {
        const clave = `${cita.fecha}_${cita.cliente}_${cita.servicio}`;
                
        if (!acc[clave]) {
          acc[clave] = { ...cita };
          acc[clave].fechaRegistro = [
            this.datePipe.transform(cita.fechaRegistro, 'yyyy/MM/dd'),
            this.datePipe.transform(cita.fechaRegistro, 'hh:mm a')
          ];
          acc[clave].fecha = [
            this.datePipe.transform(cita.fecha, 'yyyy/MM/dd'),
            this.datePipe.transform(cita.fecha, 'hh:mm a')
          ]
        } else {
          acc[clave].idCita += ` | ${cita.idCita}`;
          acc[clave].tipoCita += ` | ${cita.tipoCita}`;
          acc[clave].zonas += ` - ${cita.zonas}`;
          acc[clave].total += cita.total;
          acc[clave].estado += ` | ${cita.estado}`;
          acc[clave].motivo += ` | ${cita.motivo}`;
          acc[clave].sede += ` | ${cita.sede}`;
          acc[clave].utmTerm += ` | ${cita.utmTerm}`;
          acc[clave].utmSource += ` | ${cita.utmSource}`;
          acc[clave].utmCampaign += ` | ${cita.utmCampaign}`;
          acc[clave].utmCont += ` | ${cita.utmCont}`;
          acc[clave].utmMedium += ` | ${cita.utmMedium}`;

          // Concatenar las fechas y horas al array
          acc[clave].fechaRegistro[0] += ` | ${this.datePipe.transform(cita.fechaRegistro, 'yyyy/MM/dd')}`;
          acc[clave].fechaRegistro[1] += ` | ${this.datePipe.transform(cita.fechaRegistro, 'hh:mm a')}`;
          acc[clave].fecha[1] += ` | ${this.datePipe.transform(cita.fecha, 'hh:mm a')}`;
        }

          return acc;
        }, {} as Record<string, any>)
      );

      return citasUnificadas;
    }

    getTitleExel(): string{
      return `Reporte_Citas del ${this.fechaInicio} al ${this.fechaFin}`;
    }

    render(): void{
      this.dtResponsiveOptions = {
        ajax: (dataTablesParameters: any, callback) => {
          this.subscription?.unsubscribe();
          this.loading = true;
          this._loading.next(true);
          this.subscription = this.api.ObtenerReporte(this.fechaInicio, this.fechaFin, this.idSede, this.idServicio, this.idEstado, this.idTipoCita, this.idZona, this.clienteNuevo).subscribe( (res: any[]) => {
            if(this.unirCitas){
              res = this.filtrarResExecl(res);
            }
            callback({
              data : res
            });
            this._collection.next(res);
            this.loading = false;
            this._loading.next(false);
          }, err =>  {
            callback({ data : [] });
            this._collection.next([]);
            this.loading = false;
            this._loading.next(false)
            console.log('Error al obtener el cronograma de citas atendidas: ', err);
          });
        },
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
          { title: 'IDCITA', data: 'idCita', visible: false},
          { title: 'CITA', data: 'idCita', render: (data: any, type, row) => {
              return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0/${row.idServicio}' target='_blank''>${ data }</a>`;
            }},
          { title: 'TIPO CITA', data: 'tipoCita'},
          { title: 'CLIENTE', data: 'cliente', visible: false},
          { title: 'GENERO', data: 'genero', visible: true},
          { title: 'ALIAS', data: 'alias', visible: true},
          { title: 'CLIENTE', data: 'cliente', render: (data: any, type, row) => {
              return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
            }},
          { title: 'N° DOCUMENTO', data: 'documentoIdentidad', visible: true},
          { title: 'TELEFONO', data: 'telefono', visible: true},
          { title: 'DISTRITO', data: 'distrito', visible: true},
          { title: 'ZONA', data: 'zonas'},
          { title: 'SERVICIO', data: 'servicio'},
          { title: 'SERVICIOS', data: 'servicio', visible: false, render: (data: any, type, row) => {
              return this._collection.value.filter(x => x.idCliente === row.idCliente).map(
                y => y.servicio
              ).filter((value, index, array) => {
                return array.indexOf(value) === index;
              }).join(' | ');
          }},
          { title: 'ESTADO', data: 'estado', visible: false},
          { title: 'TIPOCLIENTE', data: 'tipoCliente', visible: true},
          { title: 'ESTADO', data: 'estado', width: '150px' , render: (data, type, full, meta) => {
              return `<span class="text-white py-1 px-3 text-uppercase rounded small" style="background-color:${full.estadoColor}">${full.estado}</span>`;
            }},
          { title: 'MOTIVO', data: 'motivo'},
          { title: 'SEDE', data: 'sede'},
          { title: 'FECHACITA', data: 'fecha', render: (data) => {
            if(this.unirCitas){
              return data[0];
            }
            return this.datePipe.transform(data,'yyyy-MM-dd');
          }},
          { title: 'HORACITA', data: 'fecha', render: (data) => {
              if(this.unirCitas){
                return data[1];
              }
              return this.datePipe.transform(data,'hh:mm a');
           }},
          { title: 'TOTAL', data: 'total', render: (data: number) => {
              return data.toFixed(2);
            }},
          { title: 'ESPECIALISTA', data: 'atendidoPor'},
          { title: 'F. REGISTRO', data: 'fechaRegistro', render: (data: Date) => {
              if(this.unirCitas){
                return data[0];
              }
              return this.datePipe.transform(data,'yyyy-MM-dd');
            }},
          { title: 'H. REGISTRO', data: 'fechaRegistro', render: (data: Date) => {
              if(this.unirCitas){
                return data[1];
              }
              return this.datePipe.transform(data,'hh:mm a');
            }},
          { title: 'UTM TERM', data: 'utmTerm'},
          { title: 'UTM SOURCE', data: 'utmSource'},
          { title: 'UTM CAMPAIGN', data: 'utmCampaign'},
          { title: 'UTM CONT', data: 'utmCont'},
          { title: 'MEDIO CONTACTO', data: 'medioContacto'},
          { title: 'UTM MEDIUM', data: 'utmMedium'},
          { title: 'USUARIO SEGUIMIENTO', data: 'usuarioSeguimiento'}
        ],
        serverSide: false,
        processing: false,
        async: true,
        buttons: [
          {
            extend: 'excelHtml5',
            title: this.getTitleExel(),
            autoFilter: true,
            sheetName: 'Data',
            exportOptions: {
              columns: [1,3,4,5,6,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
            }
          },
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
        select: false
      };
    }

}
