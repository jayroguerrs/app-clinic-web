import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { EgresoService } from '../../../shared/services/egreso.service';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CajaService } from '../../../shared/services/caja.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { TipoPerfil } from '../../../shared/enumeracion/enums';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caja-egreso',
  templateUrl: './caja-egreso.component.html',
  styleUrls: ['./caja-egreso.component.scss'],
  providers: [DatePipe]
})
export class CajaEgresoComponent implements OnInit, AfterViewInit {

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  frmFiltroGrilla: FormGroup;
  dtResponsiveOptions: any = {};
  modalEgresoDatosRef: NgbModalRef;
  idEgreso = 0;
  idCaja: number = 0;

  idCajaRegistro = 0;
  fechaRegistro: any;

  maestroCaja: any = [];
  esSupervisora: boolean = false;
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  usuarioActual: Usuario;

  constructor(
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private egresoService: EgresoService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private cajaService: CajaService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.cajaListado();
    this.inicializarFormulario();
    this.buildtable();
  }

  cajaListado(): void {
    this.cajaService.obtener().subscribe(
      resultado => {
        //EVALUAR SI ES SUPERVISORA O ESPECIALISTA RESPONSABLE DE CAJA O SOLO ESPECIALISTA
        this.esSupervisora = (this.usuarioActual.idperfil == TipoPerfil.SUPERVISOR);
        if(this.esSupervisora) {
          this.maestroCaja = resultado;
        } else {
          let esResponsableCaja = false;
          const cajaAsignada = resultado.filter(x => x.idUsuarioResponsable == this.usuarioActual.idUsuario);
          if(cajaAsignada.length > 0) {
            esResponsableCaja = true;
            this.maestroCaja = resultado.filter(x => x.id == cajaAsignada[0].id);
          } else {
            esResponsableCaja = false;
            this.maestroCaja = resultado.filter(x => x.idSede == this.usuarioActual.idSede);
          }
        }
      },
      error => {
        console.log('Error al obtener las cajas', error);
      }
    );
  }
  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filtroFechaInicio: [new Date()],
      filtroFechaTermino: [new Date()],
      idCaja: [0]
    });
    const date = new Date();
    this.frmFiltroGrilla.patchValue({
      filtroFechaInicio:  this.datePipe.transform(date, 'yyyy-MM-dd'),
      filtroFechaTermino:  this.datePipe.transform(date, 'yyyy-MM-dd')
    });
  }

  egresoListar(): void {
    $('.table-egreso').DataTable().ajax.reload();
  }

  egresoAnular(): void {
    this.cajaService.verificarEstadoCaja(this.idCajaRegistro, this.fechaRegistro).subscribe(
      resultado => {
        if(resultado == 1) {
         this.egresoAnularPreguntar();
        } else {
          this.utilsService.mostrarToast('Caja se encuentra cerrada, imposible realizar egreso', 'warning');
        }
      },
      error => {
        console.log('Error al consulta el estado de la caja', error);
      }
    );
  }
  egresoAnularPreguntar(): void {
    Swal.fire({
      title: 'Cita, ¿Desea anular este egreso?',
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true
    }).then(
      result => {
        if(result.isConfirmed) {
          this.egresoAnularEjecutar();
        } else {
          return;
        }
      }
    );
  }
  egresoAnularEjecutar(): void {
    const model = {
      id: this.idEgreso
    };

    this.egresoService.anularEgreso(model).subscribe(
      resultado => {
        if(resultado) {
          this.utilsService.mostrarToast('Egreso anulado satisfactoriamente!', 'success');
          this.egresoListar();
        } else {
          this.utilsService.mostrarToast('Error al anular el Egreso!', 'error');
        }
      },
      error => {
        console.log('Error al anular el egreso!', error);
      }
    );
  }

  egresoRegistrar(modal: NgbModalRef): void {
    this.idEgreso = 0;

    this.idCaja = parseInt($('[name=idCaja]').val().toString(), 10);
    const fechaEgreso = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.cajaService.verificarEstadoCaja(this.idCaja, fechaEgreso).subscribe(
      resultado => {
        if(resultado == 1) {
          this.modalEgresoDatosRef = this.utilsService.abrirModal(modal, 'md');
          this.modalEgresoDatosRef.result.then(result => this.egresoListar());
        } else {
          this.utilsService.mostrarToast('Caja se encuentra cerrada, imposible realizar egreso', 'warning');
        }
      },
      error => {
        console.log('Error al consulta el estado de la caja', error);
      }
    );
  }

  ngAfterViewInit(): void{
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance.buttons().container().appendTo( $('#hidden-btn'));
      $('#export-excel1').on('click', () => dtInstance.button(0).trigger());

      dtInstance.on('select', function (e, dt, type, indexes ) {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          this.idEgreso = data.id;
          this.idCajaRegistro = data.idCaja;
          this.fechaRegistro = data.fecha;


          if(data.idEstado == 1) {
            $('#btnAnular1, #btnAnular2').show();
          }
        }

      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        this.idEgreso = 0;
        this.idCajaRegistro = 0;
        this.fechaRegistro = '';
        $('#btnAnular1, #btnAnular2').hide();
      });
    });
  }
  buildtable(): void{
    this.spinner.show();
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

          const mensajeError = 'Error al obtener la lista de Egresos.';
          const fecha1 = this.frmFiltroGrilla.controls.filtroFechaInicio.value;
          const fecha2 = this.frmFiltroGrilla.controls.filtroFechaTermino.value;
          this.egresoService.obtenerEgresos(fecha1, fecha2).subscribe(
            data => {
              callback({ data });
              this.spinner.hide();
            },
            error => {
              console.log(mensajeError + '' + error);
              this.spinner.hide();
            }
          );
          $('#btnAnular1, #btnAnular2').hide();
      },
      columns: [
      { title: 'ID',            data: 'id',               width: '0%',  visible: false   },
      { title: 'CAJA',          data: 'caja',             width: '5%',  },
      { title: 'FECHA HORA',    data: 'fechaStr',         width: '10%'  },
      { title: 'ENTREGADO POR', data: 'responsableCaja',  width: '5%'   },
      { title: 'BENEFICIARIO',  data: 'beneficiario',     width: '10%'  },
      { title: 'SEDE',          data: 'sede',             width: '10%'  },
      { title: 'CONCEPTO',      data: 'concepto',         width: '5%'   },
      { title: 'MONTO',         data: 'montoStr',         width: '5%' ,className: 'dt-body-right'  },
      { title: 'ESTADO',        data: 'idEstado',         width: '5%',    render: (data) => { return (data == 1) ? '<span class="label theme-bg text-white f-12">ACTIVO</span>' : '<span class="label theme-bg2 text-white f-12">ANULADO</span>'; } },
      ],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
          this.idEgreso = data.id;
          this.idCajaRegistro = data.idCaja;
          this.fechaRegistro = data.fecha;
        });
        return row;
      },
      serverSide: false,
      processing: false,
      async: true,
      buttons: [ 'excel' ],
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

}
