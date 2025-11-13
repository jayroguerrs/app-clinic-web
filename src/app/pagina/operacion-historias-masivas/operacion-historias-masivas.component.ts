import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Usuario} from "../../shared/models";
import {DataTableDirective} from "angular-datatables";
import {AuthService} from "../../shared/services/auth.service";
import {UsuarioService} from "../../shared/services/usuario.service";
import {NgxSpinnerService} from "ngx-spinner";

import { Workbook } from 'exceljs';
import Swal from 'sweetalert2';
import {CitaHistoriaMasiva, HistoriaCita} from "../../shared/models/cita";
import {CitaService} from "../../shared/services/cita.service";
import {Subscription} from "rxjs";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {HistorialOperacionesService} from "../../shared/services/historial-operaciones.service";
import { HistorialEnvioMasivoMensajeCita } from 'src/app/shared/models/historial-operaciones';
import {DatePipe} from "@angular/common";
import {ErrorSistema} from "../../shared/models/error-sistema";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-operacion-historias-masivas',
  templateUrl: './operacion-historias-masivas.component.html',
  styleUrls: ['./operacion-historias-masivas.component.scss']
})
export class OperacionHistoriasMasivasComponent implements OnInit, OnDestroy, AfterViewInit {


  usuarioActual: Usuario;

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  dataTable: any;

  headers: string[] = ["IDCITA","HISTORIA_NOTA","HISTORIA_AVISO","HISTORIA_DETALLE"];
  registros: HistoriaCita[] = [];


  ldSubmit = false;
  subscription: Subscription | undefined;
  error = false;
  mensajeError = null;

  file: File | null = null;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;
  constructor(
    private auth: AuthService,
    private api: CitaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private historialService: HistorialOperacionesService,
    private datePipe: DatePipe,
    private permisoHelper: PermisoHelper
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accExf = accesos.accExf;
      this.accImp = accesos.accImp;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;  
    });

  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {

    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;
      //
      // dtInstance.on('select', (e, dt, type, indexes ) => {
      //   //this.selected = dtInstance.rows( { selected: true } ).count() ;
      //   if ( type === 'row' ) {
      //     const data = dtInstance.rows('.selected').data()[0];
      //   }
      // })
      //
      // dtInstance.on('deselect', function (e, dt, type, indexes ) {
      //   _this.idCliente = 0;
      //   _this.selected = dtInstance.rows( { selected: true } ).count() ;
      // });
    });

  }

  async onChangeFile($event): Promise<void> {
    this.registros = [];
    let headers = [];

    const wb = new Workbook();
    this.file = $event.target.files[0];
    const reader = new FileReader()
    reader.readAsArrayBuffer(this.file)

    reader.onload = async () => {
      const buffer = reader.result;
      await wb.xlsx.load(<Buffer>buffer).then(workbook => {


        workbook.eachSheet(async (sheet, id) => {
          sheet.eachRow(async (row, rowIndex) => {

            if(rowIndex === 1) {
              row.eachCell({includeEmpty: false}, (c, n) => {
                headers.push(c.value.toString());
              });
            }

            if(!await this.validarCabeceras(headers)){
              Swal.fire({
                title: 'Error en el formato de las cabeceras',
                icon: 'warning'
              });
            }

            if(rowIndex > 1) {

              const model = new HistoriaCita();
              row.eachCell({includeEmpty: true}, (c, n: number) => {
                //r.push({headers[n-1].toString(): ''});
                switch(headers[n-1]) {
                  case 'IDCITA':
                    if(  !c.value || (!this.error && !parseInt(c.value.toString(), 10))){
                      this.error = true;
                      this.mensajeError = 'El id de la cita no tiene un formato númerico';
                      Swal.fire({
                        title: 'Se encontraron errores en el registro.',
                        icon: 'error'
                      });
                    }
                    model.idCita = c.value ? parseInt(c.value.toString(), 10) : null;
                    break;
                  case 'HISTORIA_NOTA':
                    model.historiaNota = c.value ? c.value.toString() : null;
                    break;
                  case 'HISTORIA_AVISO':
                    model.historiaAviso = c.value ? c.value.toString() : null;
                    break;
                  case 'HISTORIA_DETALLE':
                    model.historiaDetalle = c.value ? c.value.toString() : null;
                    break;
                  default:
                    break;
                }
              });
              this.registros.push(model);

            }

          })
        })
      });

    }


    //console.log(this.registros);
    //console.log(!parseInt('adsfads',10));

  }

  onRemoveFile(): void{
    this.file = null;
  }

  async validarCabeceras(cabeceras: string[]): Promise<boolean>{
    let output = true;

    if(cabeceras.length < this.headers.length){
      return false;
    }

    await this.headers.forEach(x => {
      if(!cabeceras.includes(x)){
        //break;
        output =  false;
        return;
      }
    });
    return output;
  }


  onSubmit(): void{

    const model = new CitaHistoriaMasiva();
    model.registros = this.registros;
    model.numeroRegistros = this.registros.length;
    model.nombreArchivo = this.file.name;
    model.idUsuarioRegistro = this.auth.getUser().id;

    this.ldSubmit = true;
    this.subscription = this.api.HistoriaEnvioMasivo(model).subscribe((res: boolean | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        Swal.fire({
          title: res.message,
          icon: 'error'
        });
      }else{
        Swal.fire({
          title: 'Se registraron las historias con exito',
          icon: 'success'
        });
        this.dataTable?.ajax.reload();
      }
      this.ldSubmit = false;
      this.file = null;
      this.registros = [];
    }, error => {
      Swal.fire({
        title: 'Ocurrio un error al intentar registrar las historias',
        icon: 'error'
      });
      console.log(error);
      this.ldSubmit = false;
    })
  }


  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        this.historialService.listarHistorialEnvioMasivoMensaje().subscribe((res: HistorialEnvioMasivoMensajeCita[]) => {
          callback({ data: res });
        }, error => {
          console.log(error);
          callback({ data: [] });
        });

      },
      select: {
        selector: 'td:not(:first-child)'
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
        { title: 'ARCHIVO',             data: 'nombreArchivo',      visible: true},
        { title: 'N° REGISTROS',        data: 'numeroRegistros'},
        { title: 'F. REGISTRO',      data: 'fechaRegistro',      visible: true, render: (data: Date) => {
          return this.datePipe.transform(data,'yyyy-MM-dd');
        }},
        { title: 'H. REGISTRO',      data: 'fechaRegistro',      visible: true, render: (data: Date) => {
            return this.datePipe.transform(data,'hh:mm a');
        }},
        { title: 'REGISTRADO POR',      data: 'usuarioRegistro',    visible: true},
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

}
