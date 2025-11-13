import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit, ViewChild,
  ViewEncapsulation,
  Output, EventEmitter
} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from "rxjs";
import {CitaService} from "../../../shared/services/cita.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import { CitaCliente } from 'src/app/shared/models/cita';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {DataTableDirective} from "angular-datatables";
import {DatePipe} from "@angular/common";
import {AccionCronograma, CitaEstado} from "../../../shared/enumeracion/enums";
import {EstadoService} from "../../../shared/services/estado.service";
import {MdlClienteAsignadoEstadosComponent} from "../mdl-cliente-asignado-estados/mdl-cliente-asignado-estados.component";
import {AuthService} from "../../../shared/services/auth.service";
import {ClienteAsignadoService} from "../../../shared/services/cliente-asignado.service";

@Component({
  // selector: 'app-mdl-cita-estado',
  templateUrl: './mdl-ver-citas-cliente-asignado-trabajar.component.html',
  styleUrls: ['./mdl-ver-citas-cliente-asignado-trabajar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlVerCitasClienteAsignadoTrabajarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;


  @Input() Cliente: any;
  @Input() Id: number;
  @Input() IdCliente: number;
  @Input() Fecha: string;

  @Output() OnSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  subscriptions: Subscription[] = [];
  loading: boolean;
  collection: CitaCliente[] = [];

  optionsDtPreferentes = {};
  estados: any[] = [];
  ldEstados: boolean;

  estadoCollection: any[] = [
    {id: 6, nombre: 'Cita Confirmada'},
    {id: 8, nombre: 'Cancelada'},
    {id: 10, nombre: 'Reprogramada'},
    {id: 34, nombre: 'Asistencia Confirmada'},
    {id: 49, nombre: 'No llamar'}
  ];

  modalRef: NgbModalRef;
  ldTrabajo: boolean;

  reloadBD: boolean;

  constructor(
    public modal: NgbActiveModal,
    private api: CitaService,
    private util: UtilsService,
    private datePipe: DatePipe,
    private citaEstadoService: EstadoService,
    private modalService: NgbModal,
    private auth: AuthService,
    private clienteAsignadoService: ClienteAsignadoService
  ) {
    this.loading = false;
    this.ldEstados = false;
    this.ldTrabajo = false;
    this.reloadBD = true;
  }


  ngOnInit(): void {
    this.obtenerEstados();
    this.renderTable();


    console.log(this.Cliente);
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

  get model(): any{
    return {
      id: this.Id,
      idCliente: this.IdCliente,
      fechaCita: this.Fecha,
      idEstadoCliente: 0,
      col : this.collection,
      citas: this.collection.filter(x => x.idEstadoInicial !== x.idEstado).map(c =>{
        return {idCita: c.id, idEstado: c.idEstado, detalle: c.detalle}
      }),
      idUsuarioRegistro: this.auth.getUser().id
    }
  }

  renderTable(): void{
    this.optionsDtPreferentes = {
      ajax: (dataTablesParameters: any, callback) => {

        if(this.reloadBD) {

            this.loading = true;
            const subs = this.api.obtenerCitasClienteAsignado(this.Id).subscribe((res: CitaCliente[] | ErrorSistema) => {
              if (res instanceof ErrorSistema) {
                this.util.mostrarToast(res.message, "error");
                callback({data: []});
              } else {
                this.collection = res;
                callback({data: res});
              }
              this.loading = false;
            }, error => {
              this.util.mostrarToast('No se pudo obtener las citas', 'error');
              console.log(error);
              this.loading = false;
              callback({data: []});
            });
            this.subscriptions.push(subs);

        }else{
          callback({ data: this.collection });
        }

      },
      select: false,
      searching: true,
      'columnDefs': [{
        'max-width': '34px',
        'targets': 0
      }],
      columns: [
        // {
        //   "className":      'dtr-control',
        //   "orderable":      false,
        //   "data":           null,
        //   "defaultContent": '',
        //   width: '0px'
        // },
        { title: 'CITA', data: 'id', width: '100px', render: (data, xhr, row) => {
            if(!row.idCronograma){
              return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0/${row.idServicio}' target='_blank''>${ data }</a>`;
            }else{
              return `<a href='/Corporal360/Cronograma/${row.idCronograma}/${AccionCronograma.VER}/${row.idCliente}/0/${data}/1' target='_blank'>${ data }</a>`;
            }
        }},
        // { title: 'CLIENTE', data: 'cliente', width: '175px' },
        { title: 'FECHA', width: '100px', data: 'fecha', render: (data: Date) => {
            return this.datePipe.transform(data, 'dd/MM/yyyy');
        }},
        { title: 'HORA', width: '100px', data: 'fecha', render: (data: Date) => {
            return this.datePipe.transform(data, 'hh:mm:ss a');
        }},
        { title: 'CELULAR', width: '100px', data: 'telefono' },
        { title: 'SERVICIO', data: 'servicio', width: '200px', className: 'c_servicio' , render: (data, xhr, row) => {
            return `<span class="rounded-md px-3 py-1 text-white" style="background-color: ${row.servicioColor}">${row.servicio}</span>`
        }},
        { title: 'SEDE', data: 'sede', width: '150px'},
        { title: 'ESTADO', data: 'estado', width: '240px', className: 'min-w-240px', render: (data, xhr, row) => {
          const select = document.createElement('select');
          this.estados.forEach(e => {
            let option = document.createElement('option');
            option.text = e.descripcion;
            option.value = e.id;
            select.add(option);
          });
          select.classList.add('custom-select','select-estado','rounded-10px','border-2px', 'cursor-pointer', 'fw-bold');
          const color: string = this.estados.find(e => e.id === row.idEstado).color;
            // select.style.backgroundColor = this.util.LightenDarkenColor(color,90);
          select.style.backgroundColor = color;
          select.style.borderColor = color;
          select.style.color = color ? '#ffffff' : null;

          return select.outerHTML;
        }},
        { title: 'DETALLE', data: 'detalle', width: '250px', className: 'min-w-250px', render: (data) => {
            return `<textarea class="form-control form-control-sm h-80px detalle rounded-10px border-2px" rows="1">${data ? data : ''}</textarea>`
        }}
      ],
      serverSide: false,
      processing: false,
      async: true,
      language: this.util.datatableIdioma,
      autoWidth: false,
      responsive: false,
      // responsive: {
      //   details: {
      //     renderer: function ( api, rowIdx, columns: any[] ) {
      //       const data = columns.map( x => {
      //         return x.hidden ?
      //           '<tr data-dt-row="'+x.rowIndex+'" data-dt-column="'+x.columnIndex+'">'+
      //           '<td><b>'+x.title+'</b></td>'+
      //           '<td><b>:</b></td>'+
      //           '<td>'+x.data+'</td>'+
      //           '</tr>' :
      //           '';
      //       }).join('');
      //       const table = document.createElement('table');
      //       table.classList.add('w-100','table-child');
      //       table.innerHTML = data;
      //       return data ? table : false;
      //     }
      //   }
      // },
      order: [],
      createdRow: (row, data, dataIndex) => {

        const item = this.collection.find(c => c.id === data.id);
        const select = row.querySelector('select');
        select.value = data.idEstado;
        select.addEventListener('change', (evt) => {
          item.idEstado = parseInt(evt.target.value, 10);
          item.estado = this.estados.find(e => e.id === parseInt(evt.target.value, 10)).descripcion;
          this.reloadBD = false;
          $('.table-cita').DataTable().ajax.reload();
        });

        const txt = row.querySelector('textarea');
        txt.addEventListener('keyup', (evt)=> {
            item.detalle = evt.target.value ? evt.target.value : null;
           // console.log(this.collection);
        });

      },
      dom: 'lr<"table-responsive"t>ip'
    };
  }

  /***********************************************************************************************************
   * Data
   */
  obtenerEstados(): void{

    this.ldEstados = true;
    const subs = this.citaEstadoService.obtenerEstadoByEntidad('cita').subscribe((res) => {
      console.log(res);
      this.estados = res;
      this.ldEstados = false;
    }, error => {
      console.log(error);
      this.util.mostrarToast('No se pudo obtener los estados', 'error');
      this.ldEstados = false;
    });
    this.subscriptions.push(subs);

  }




  /***********************************************************************************************************
   * Events
   */
  evtOnSaved(): void{

    this.modalRef = this.modalService.open(MdlClienteAsignadoEstadosComponent, {size: "md", windowClass: 'smodal round popins bg-dark-30', keyboard: false, centered: false,  animation: true, backdrop: "static"});
    this.modalRef.componentInstance.OnSelect.subscribe((res: number) => {
      this.modalRef.close();

      // console.log('estado seleccionado', res);

      const data = this.model;
      data.idEstadoCliente = res;

      this.ldTrabajo = true;
      const subs = this.clienteAsignadoService.trabajarAsignado(data).subscribe((er: boolean | ErrorSistema) => {
        if(er instanceof ErrorSistema){
          this.util.mostrarToast(er.message, 'error');
        }else{
          this.util.mostrarToast('Citas trabajadas con exito', 'success');
          this.OnSaved.emit(true);
          this.modal.close();
        }
        this.ldTrabajo = true;
      }, error => {
        this.util.mostrarToast('No se pudo trabajar las citas', 'error');
        this.ldTrabajo = true;
      });
      this.subscriptions.push(subs);

    });

  }

  evtReload(): void{
    this.reloadBD = true;
    $('.table-cita').DataTable().ajax.reload();
  }

}
