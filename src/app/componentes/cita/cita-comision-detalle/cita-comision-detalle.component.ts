import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CitaService } from '../../../shared/services/cita.service';
import {Subscription} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {DataTableDirective} from "angular-datatables";
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita-comision-detalle',
  templateUrl: './cita-comision-detalle.component.html',
  styleUrls: ['./cita-comision-detalle.component.scss']
})
export class CitaComisionDetalleComponent implements OnInit, OnDestroy, AfterViewInit {

  frmCitaComisionDetalle: FormGroup;
  @Input() fechaInicio: Date;
  @Input() fechaTermino: Date;
  @Input() idUsuario: number;
  @Input() modal: NgbModalRef;
  @Input() operador: string;
  listaCitaComisionDetalle: any[] = [];

  // Subscripciones
  subscripcion : Subscription;

  // Datatable Options
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dataTable: any;
  dtOptionsTableDetalle: any = {};

  loading = false;

  constructor(
    private citaService: CitaService,
    private formBuilder: FormBuilder,
    private utilService: UtilsService,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildTable();
    this.obtenerComisionDetalle();
    this.inicializarFormulario();
  }
  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }
  ngAfterViewInit(): void {
    const self = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      self.dataTable = dtInstance;
    });
  }

  inicializarFormulario(): void {
    this.frmCitaComisionDetalle = this.formBuilder.group({

    });
  }

  obtenerComisionDetalle(){
    this.loading = true;
    this.subscripcion = this.citaService.obtenerComisionesDetalle(this.fechaInicio, this.fechaTermino, this.idUsuario).subscribe(
      (resultado) => {
        this.dtOptionsTableDetalle.data = resultado;
      }, error => {
        console.log('Error al obtener el detalle de las comisiones', error);
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  calcularIgv( monto: number ): number {
    return monto * 0.18;
  }

  cerrarModal(): void { this.modal.close(); }

  totalMonto(): number {
    return this.listaCitaComisionDetalle.map(t => t.precio).reduce((acc, value) => acc + value, 0)
  }

  totalComision(): number {
    return this.listaCitaComisionDetalle.map(t => t.comision).reduce((acc, value) => acc + value, 0)
  }

  buildTable(): void{
    this.dtOptionsTableDetalle = {
      ajax: (dataTablesParameters: any, callback) => {

        this.loading = true;
        this.subscripcion = this.citaService.obtenerComisionesDetalle(this.fechaInicio, this.fechaTermino, this.idUsuario).subscribe(
          (resultado) => {
            callback({
              data : resultado
            });
          }, error => {
            console.log('Error al obtener el detalle de las comisiones', error);
            this.loading = false;
          }, () => {
            this.loading = false;
          });

      },
      columns: [
        { title: 'Id Cita',  data: 'idCita',  width: "4%", className: 'align-middle'},
        { title: 'Cliente', data: 'cliente', className: 'align-middle'},
        { title: 'Fecha', width: '100px',data: 'fechaCita', className: 'align-middle text-center',render: (val) => { return this.utilService.formato_FechaString(val)  } },
        { title: 'Zona Corporal', data: 'zonaCorporal', className: 'align-middle'},
        { title: 'Monto S/', data: 'precio', className: 'align-middle'},
        { title: 'Comision %', data: 'porcentajeComision', className: 'align-middle'},
        { title: 'Comision S/', data: 'comision', className: 'align-middle'},
        { title: 'Comision S/ - I.G.V', data: 'comision', className: 'align-middle', render: (data, type, row, meta) =>{

          return (data - this.calcularIgv( data )).toFixed(2);
        }},
      ],
      language: this.utilService.datatableIdioma,
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
      select: false,
      buttons: [
        {
          extend: 'excelHtml5',
          title: this.operador + "_" + this.utilService.formato_FechaString(this.fechaInicio) + "_" + this.utilService.formato_FechaString(this.fechaTermino)
        }
      ],
      lengthMenu: [ 5, 10, 25, 50, 75, 100 ],
      pageLength: 5,
    };
  }

  exportarExcel(): void {
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

}
