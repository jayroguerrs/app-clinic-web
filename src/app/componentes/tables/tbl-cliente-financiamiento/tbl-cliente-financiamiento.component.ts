import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {Subscription} from "rxjs";
import {ClienteService} from "../../../shared/services/cliente.service";
import {Cliente, ClienteFinanciamiento} from "../../../shared/models/cliente";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-tbl-cliente-financiamiento',
  templateUrl: './tbl-cliente-financiamiento.component.html',
  styleUrls: ['./tbl-cliente-financiamiento.component.scss']
})
export class TblClienteFinanciamientoComponent implements OnInit, OnDestroy, AfterViewInit{

  @Input() IdCliente: number = 0;
  dtOptionsTable: any = {};
  loading = false;
  subscription: Subscription | undefined;
  collection: ClienteFinanciamiento[] = [];

  cliente: Cliente | null = null;
  sbcCliente: Subscription;

  constructor(
    private utilService: UtilsService,
    private api: ClienteService,
    private datePipe: DatePipe,
    private clienteService: ClienteService
  ) {
  }

  ngOnInit(): void {
    this.build();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  build(): void{

    this.dtOptionsTable = {
      ajax: (dataTablesParameters: any, callback) => {
        //  Obtiene el listado de citas del cliente
        this.loading = true;


        this.sbcCliente = this.clienteService.findById(this.IdCliente).subscribe((res: Cliente) => {

          this.subscription = this.api.obtenerFinanciamiento(res.documento).subscribe(
            (res: ClienteFinanciamiento[]) => {
              console.log(res);

              this.collection = res;
              callback( { data:  res} );
              this.loading = false;
            },
            error => {
              console.log('Error al obtener el financiamiento del cliente', error);
              callback([]);
              this.loading = false;
            }, () => {
              this.loading = false;
            }
          );



        }, error => {
          callback([]);
          console.log(error);
          this.loading = true;
        })
      },
      serverSide: false,
      processing: false,
      pageLength: 5,
      async: true,
      autoWidth: false,
      responsive: {
        details: {
          renderer: ( api, rowIdx, columns: any[] ) => {
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
      order:[],
      "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todo"]],
      language: this.utilService.datatableIdioma,
      // rowCallback: (row: Node, data: any | object, index: number) => {
      //   $('td:not(:eq(0))', row).off('click',() => {
      //     this.citaSelected = null;
      //   });
      //   $('td:not(:eq(0))', row).on('click', () => {
      //     this.citaSelected = data;
      //     this.mostrarModalOpciones(this.mdlOpcionesCitas, data);
      //   });
      //   return row;
      // },
      select: false,
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
        { title: 'CÓDIGO | SUBSCRIPCIÓN', data: 'idOrden',  render: function(data,type,row){
            return `#${row.idOrden} | #${row.idSubscripcion} - ${row.nombreProducto}`;
        }},
        { title: 'CUOTA', data: 'cuota', width: '100px', class: 'text-center'},
        { title: 'F. REGISTRO', data: 'fechaRegistro', width: '100px', class: 'text-right' , render: (data: Date) => {
            return this.datePipe.transform(data,'dd/MM/yyyy');
        }},
        { title: 'F. PAGO', data: 'fechaPago', width: '100px' , class: 'text-right' , render: (data: Date | null) => {
            return data ? this.datePipe.transform(data,'dd/MM/yyyy') : null;
        }},
        { title: 'TOTAL', data: 'total', width: '100px', class: 'text-right', render: (data: number) => {
            return `S/ ${data.toFixed(2)}`;
        }},
        { title: 'Próximo Pago', data: 'proximaFacturacion', width: '100px' , class: 'text-right' , render: (data: Date | null) => {
            return data ? this.datePipe.transform(data,'dd/MM/yyyy') : null;
        }},
        { title: 'Estado', data: 'estado', render: (data: string) => {
            switch (data){
              case 'active':
                return `<span class="bg-success text-white px-2 py-1 rounded small">ACTIVO</span>`;
              default: return data;
            }
        }},
      ]
    }
  }



}
