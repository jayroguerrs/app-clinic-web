import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from "rxjs";
import {CitaService} from "../../../shared/services/cita.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import { CitaCliente } from 'src/app/shared/models/cita';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {DataTableDirective} from "angular-datatables";
import {DatePipe} from "@angular/common";
import {AccionCronograma} from "../../../shared/enumeracion/enums";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-ver-citas-cliente-asignado.component.html',
  styleUrls: ['./mdl-ver-citas-cliente-asignado.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlVerCitasClienteAsignadoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  @Input() Id: number;
  @Input() IdCliente: number;
  @Input() Fecha: string;

  subscriptions: Subscription[] = [];
  loading: boolean;
  collection: CitaCliente[] = [];

  optionsDtPreferentes = {};

  constructor(
    public modal: NgbActiveModal,
    private api: CitaService,
    private util: UtilsService,
    private datePipe: DatePipe
  ) {
    this.loading = false;
  }


  ngOnInit(): void {
    this.renderTable();
  }

  ngAfterViewInit(): void {
    this.renderTable();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cerrarModal(): void{
    this.modal.close();
  }

  renderTable(): void{
    this.optionsDtPreferentes = {
      ajax: (dataTablesParameters: any, callback) => {

        this.loading = false;
        const subs = this.api.obtenerCitasClienteAsignado(this.Id).subscribe((res: CitaCliente[] | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.util.mostrarToast(res.message,"error");
            callback({ data: [] });
          }else{
            this.collection = res;
            callback({ data : res });
          }
          this.loading = false;
        }, error => {
          this.util.mostrarToast('No se pudo obtener las citas', 'error');
          console.log(error);
          this.loading = false;
          callback({ data: [] });
        });
        this.subscriptions.push(subs);

      },
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
        { title: 'ID', data: 'id', render: (data, xhr, row) => {
            if(!row.idCronograma){
              return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0/${row.idServicio}' target='_blank''>${ data }</a>`;
            }else{
              return `<a href='/Corporal360/Cronograma/${row.idCronograma}/${AccionCronograma.VER}/${row.idCliente}/0/${data}/1' target='_blank'>${ data }</a>`;
            }
        }},
        { title: 'CLIENTE', data: 'cliente' },
        { title: 'FECHA', data: 'fecha', render: (data: Date) => {
            return this.datePipe.transform(data, 'dd/MM/yyyy');
        }},
        { title: 'HORA', data: 'fecha', render: (data: Date) => {
            return this.datePipe.transform(data, 'hh:mm:ss a');
        }},
        { title: 'CELULAR', data: 'telefono' },
        { title: 'SERVICIO', data: 'servicio', width: '200px', className: 'c_servicio' , render: (data, xhr, row) => {
            return `<span class="rounded-md px-3 text-white" style="background-color: ${row.servicioColor}">${row.servicio}</span>`
        }},
        { title: 'SEDE', data: 'sede' },
        { title: 'ESTADO', data: 'estado', width: '150px', className: 'c_estado', render: (data, xhr, row) => {
          return `<span class="rounded-md px-3 text-white" style="background-color: ${row.estadoColor}">${row.estado}</span>`
        }}
      ],
      serverSide: false,
      processing: false,
      async: true,
      language: this.util.datatableIdioma,
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
      order: []
    };
  }


}
