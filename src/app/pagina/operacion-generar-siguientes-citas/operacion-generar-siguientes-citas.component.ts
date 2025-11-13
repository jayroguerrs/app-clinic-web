import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Usuario} from "../../shared/models";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../shared/services/auth.service";
import {UsuarioService} from "../../shared/services/usuario.service";

import Swal from 'sweetalert2';
import {CitaSinSiguienteCita} from "../../shared/models/cita";
import {CitaService} from "../../shared/services/cita.service";
import {Subscription} from "rxjs";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {ErrorSistema} from "../../shared/models/error-sistema";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {ServicioService} from "../../shared/services/servicio.service";
import {Servicio} from "../../shared/models/servicio";

@Component({
  selector: 'app-operacion-generar-siguientes-citas',
  templateUrl: './operacion-generar-siguientes-citas.component.html',
  styleUrls: ['./operacion-generar-siguientes-citas.component.scss']
})
export class OperacionGenerarSiguientesCitasComponent implements OnInit, OnDestroy, AfterViewInit {


  usuarioActual: Usuario;

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  dataTable: any;


  ldSubmit = false;
  subscription: Subscription | undefined;


  formGroup: FormGroup;
  sbcCollection: Subscription | undefined;
  collection: CitaSinSiguienteCita[] =[];
  ldCollection: boolean;

  submittedSiguienteCita = false;
  formGroupSiguienteCita: FormGroup;
  sbcSiguienteCita: Subscription | undefined;
  ldSiguienteCita: boolean


  ldServicios: boolean;
  sbcServicios: Subscription | undefined;
  servicios: Servicio[] = [];

  idTipo = 1;

  constructor(
    private auth: AuthService,
    private api: CitaService,
    private usuarioService: UsuarioService,
    public utilsService: UtilsService,
    private datePipe: DatePipe,

    private formBuilder: FormBuilder,
    private servicioService: ServicioService
  ) {
    this.ldCollection = false;
    this.ldSiguienteCita = false;
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;

    const today = new Date();


    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl( null, Validators.required ),
      fechaHasta: new FormControl( null, Validators.required ),
      idServicio: new FormControl(0, Validators.required),
    });

    this.formGroupSiguienteCita = this.formBuilder.group({
      idTipo: new FormControl(1, Validators.required),
      fecha: new FormControl(null, Validators.required),
      numeroMeses: new FormControl(2)
    });

    this.formGroupSiguienteCita.get('idTipo').valueChanges.subscribe((res) => {
      this.idTipo = parseInt(res, 10);
      if(this.idTipo === 1){
        this.f2.fecha.setValidators(Validators.required);
        this.f2.numeroMeses.clearValidators();
        this.f2.numeroMeses.patchValue(2)
      }else{
        this.f2.numeroMeses.setValidators(Validators.required);
        this.f2.fecha.clearValidators();
        this.f2.fecha.patchValue(null)

      }
      this.f2.numeroMeses.updateValueAndValidity();
      this.f2.fecha.updateValueAndValidity();
    });

    this.buildtable();
  }

  ngOnDestroy(): void {
    this.sbcCollection?.unsubscribe();
  }

  ngAfterViewInit(): void {

    this.obtenerServicios();

    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

    });

  }

  /**************************************************************************************
   * Getters
   */
  get f(): any{
    return this.formGroup.controls;
  }
  get f2(): any{
    return this.formGroupSiguienteCita.controls;
  }
  get porcentaje(): number{
    return this.collection.length ? Math.round(this.collection.filter(x => x.realizado != null).length * 100 / this.collection.length) : 0;
  }
  get completados(): boolean{
    return this.collection.length ? (this.collection.filter(x => x.realizado !== null).length === this.collection.length) : true;
  }


  onSubmit(): void{
    if(this.formGroup.invalid){
      this.utilsService.mostrarToast('Debe seleccionar un rango de fecha', 'warning');
      console.log(this.formGroup);
      return;
    }

    if( this.f.fechaDesde.value.getTime() > this.f.fechaHasta.value.getTime() ){
      this.utilsService.mostrarToast('La fecha inicial debe ser menor', 'warning');
      return;
    }

    this.onReloadTable();
  }


  onSubmitSiguienteCita(): void{
    if(this.formGroupSiguienteCita.invalid){
      console.log(this.formGroup);
      this.utilsService.mostrarToast('Debe ingresar el número de meses para la siguiente cita', 'warning');
      return;
    }


    Swal.fire({
      html: this.idTipo === 1 ? `Desea generar las siguientes citas del listado para el ${this.datePipe.transform(this.f2.fecha.value,'d MMMM y','','es-PE')} ??`  : `Desea generar las siguientes citas del listado dentro de <b>${this.f2.numeroMeses.value} meses</b> de su fecha ??`,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      buttonsStyling: false,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      customClass: {
        popup: 'popins rounded-grant shadow',
        confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
        cancelButton: 'btn sbtn btn-light popins mr-2',
      },
      reverseButtons: true
    }).then(
      async result => {
        if(result.isConfirmed) {
          this.submittedSiguienteCita = true;
          this.ldSiguienteCita = true;

          await this.crearSiguientesCitas();

        }
      });
  }


  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        this.sbcCollection?.unsubscribe();
        this.collection = [];

        if(this.formGroup.invalid){
          callback({ data: [] });
        }else{
          this.ldCollection = true;
          const fechaDesde = this.datePipe.transform(this.f.fechaDesde.value,'yyyy-MM-dd');
          const fechaHasta = this.datePipe.transform(this.f.fechaHasta.value,'yyyy-MM-dd');
          const idServicio = parseInt(this.f.idServicio.value, 10);

          this.sbcCollection = this.api.obtenerCitasAtendidasSinSiguienteCita(fechaDesde, fechaHasta, idServicio, this.usuarioActual.idUsuario).subscribe((res: CitaSinSiguienteCita[] | ErrorSistema) => {
            if(res instanceof ErrorSistema){
              this.utilsService.mostrarToast(res.message, 'error');
              callback({ data: [] });
            }else{
              // console.log(res);
              this.collection = res;
              callback({ data: this.collection });
            }
            this.ldCollection = false;
          }, error => {
            console.log(error);
            callback({ data: [] });
            this.ldCollection = false;
          });
        }


      },
      select: {
        selector: 'td:not(:first-child)'
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
        { title: '', data: 'realizado', render: (data, type, row) => {
            let output = '';
            switch (data){
              case 'hecho': output = '<span class="rounded-md text-white px-2 py-2px small bg-success">Hecho</span>';break;
              case 'error': output = `<span class="rounded-md text-white px-2 py-2px small bg-danger" title="${row.title}">Error</span>`;break;
              default: output = '';break;
            }
            return output;
          }},
        { title: 'N° Cita', data: 'idCita', render: (data: any, type, row) => {
            return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0' target='_blank''>CI-${ data }</a>`;
        }},
        { title: 'CLIENTE', data: 'cliente', render: (data: any, type, row) => {
            return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
        }},
        { title: 'TELÉFONO', data: 'telefonoCliente'},
        { title: 'SEDE', data: 'sede'},
        { title: 'SERVICIO', data: 'servicio', render: (data: any, type, row) => {
            return  `<span class="rounded-md text-white px-2 py-2px small" style="background-color: ${row.colorServicio}">${ data }</span>`;
          }},
        { title: 'FECHA', data: 'fechaCita',  render: (data: Date) => {
            return this.datePipe.transform(data,'dd/MM/yyyy');
          }},
        { title: 'ESTADO', data: 'estadoCita', render: (data: any, type, row) => {
            return  `<span class="rounded-md text-white px-2 py-2px small" style="background-color: ${row.colorEstadoCita}">${ data }</span>`;
        }},
        { title: 'PAGADO', data: 'pagado', render: (data: boolean) => {
            return  data ? `<span class="rounded-md text-white px-2 py-2px small bg-success">Pagado</span>` : `<span class="rounded-md text-white px-2 py-2px small bg-danger">No Pagado</span>`;
          }},
      ],
      serverSide: false,
      processing: false,
      pageLength: 10,
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
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todo"]]
    };
  }

  onReloadTable(): void{
    this.dataTable?.ajax.reload();
  }

  obtenerServicios(): void{
    this.sbcServicios?.unsubscribe();
    this.ldServicios = true;
    this.sbcServicios = this.servicioService.listar().subscribe((res: Servicio[]) => {
      this.servicios = res;
      this.ldServicios = false;
    }, error => {
      console.log(error);
      this.utilsService.mostrarToast('Ocurrio un error al intentar obtener los servicios', 'error');
      this.ldServicios = false;
    });

  }

  /*********************************************************************************************************
   * Events
   */
  evtGenerarSiguienteCita(): void{

  }

  async crearSiguientesCitas(): Promise<void> {

    return new Promise(async (resolve, reject) => {

      for (const [i, item] of this.collection.entries()) {

        console.log(i, this.collection.length);

        if( item.realizado === null || item.realizado === 'error' ){
          await this.api.AgendarSiguienteCitaManual({
            idTipo: this.idTipo,
            fecha: this.idTipo === 1 ? this.f2.fecha.value : null,
            idCita: item.idCita,
            numeroMeses: parseFloat(this.f2.numeroMeses.value),
            idUsuarioRegistro: this.usuarioActual.idUsuario
          }).toPromise().then(  (e: number | ErrorSistema) => {

            if(e instanceof ErrorSistema){
              console.log('error');
              this.collection.find(x => x.idCita === item.idCita).realizado = 'error';
              this.collection.find(x => x.idCita === item.idCita).title = e.message;
            }else{
              this.collection.find(x => x.idCita === item.idCita).realizado = 'hecho';
            }
            this.dataTable.clear().rows.add(this.collection).draw();

          });
        }

        if ( i === (this.collection.length - 1) ) {

          this.ldSiguienteCita = false;
          await resolve();
        }

      }
    });
  }

}
