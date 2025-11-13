import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {DataTableDirective} from "angular-datatables";
import {ReporteClienteService} from "../../shared/services/reporte-cliente.service";
import {DatePipe} from "@angular/common";
import {ReporteClienteCumpleanio} from "../../shared/models/reporte-cliente";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preferentes-estado',
  templateUrl: './preferentes-estado.component.html',
  styleUrls: ['./preferentes-estado.component.scss']
})
export class PreferenteEstadoComponent implements OnInit, AfterViewInit, OnDestroy {

  formGroup: FormGroup;

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};

  fechaHasta: Date = new Date();

  estadoAtendidos: any[] = [
    {id: 0, text: 'Todos'},
    {id: 1, text: 'Atendido'},
    {id: 2, text: 'No Atendido'}
  ];

  subscription: Subscription | undefined;
  dataTable: any;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  accLstI: boolean = false;  
  accLstG: boolean = false;    

  constructor(
    private formBuilder: FormBuilder,
    private api: ReporteClienteService,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private permisoHelper: PermisoHelper,    
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) {

    const today = new Date();

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl( this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required),
      fechaHasta: new FormControl( this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required),
      idEstadoAtendido: new FormControl(0, Validators.required)
    });


  }

  // getters
  get f(): any{
    return this.formGroup.controls;
  }

  ngOnInit(): void {
    this.buildTable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accExf = accesos.accExf;
      this.accImp = accesos.accImp;  
      this.accLstI = accesos.accLstI;
      this.accLstG = accesos.accLstG;      
    });
  }

  ngAfterViewInit(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // Funciones
  buildTable(): void{
    this.dtResponsiveOptions = {
      ajax : (dataTablesParameters: any, callback) => {

        this.spinner.show();

        this.subscription = this.api.reporteClienteCumpleanio( this.datePipe.transform(this.f.fechaDesde.value, 'yyyy-MM-dd'),  this.datePipe.transform(this.f.fechaHasta.value, 'yyyy-MM-dd'), this.f.idEstadoAtendido.value ).subscribe((res: ReporteClienteCumpleanio[]) => {
          callback({ data : res });
          // this.collectionData = res;
          this.spinner.hide();
        }, error => {
          callback({ data : [] });
          // this.collectionData = [];
          this.spinner.hide();
          this.utilsService.mostrarToast('Ocurrio un error','error');
          console.log(error);
        }, () => {
          // this.titleChart = "Desde " + this.f.fdesde.value+ " hasta " + this.f.fhasta.value ;
          // this.dibujarGraficoGeneral();
          // this.dibujarGraficoGeneralBySede(Sedes.MEGA_PLAZA, 'megaPlazaEstadosChart' ,'megaPlazaMotivosChart');
          // this.dibujarGraficoGeneralBySede(Sedes.PUEBLO_LIBRE, 'puebloLibreEstadosChart' ,'puebloLibreMotivosChart');
          // this.dibujarGraficoGeneralBySede(Sedes.SAN_BORJA, 'sanBorjaEstadosChart' ,'sanBorjaMotivosChart');
        });

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
        { title: 'Código', data: 'idCliente', className: 'align-middle', width: '100px'},
        { title: 'Cliente', data: 'nombre' , className: 'align-middle', render: (data: any, type, row) => {
            return `<a href='/ClientePerfil/${row.idCliente}' target='_blank'>${ row.nombre }</a>`;
        }},
        { title: 'Edad', data: 'edad'},
        { title: 'Ultima Cita', data: 'ultimaCita' , render: (data: Date | null, type, row) => {
            return data ? `<a href='/Cita/${row.idUltimaCita}/1/${row.idCliente}/0' target='_blank'><span class="px-2 py-1 rounded text-white" style="background-color:${row.ultimaCitaColor}">${ this.datePipe.transform(data, 'dd/MM/yyyy') }</span></a>` : null;
        }},
        { title: 'Próxima Cita', data: 'proximaCita' , render: (data: Date | null, type, row) => {
            return data ? `<a href='/Cita/${row.idProximaCita}/1/${row.idCliente}/0' target='_blank'><span class="px-2 py-1 rounded text-white" style="background-color:${row.proximaCitaColor}">${ this.datePipe.transform(data, 'dd/MM/yyyy') }</span></a>` : null;
        }},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: () => {
            return 'Reporte Cliente Cumpleaños - '+ this.datePipe.transform(this.f.fechaDesde.value, 'yyyy-MM-dd') + ' hasta ' + this.datePipe.transform(this.f.fechaHasta.value, 'yyyy-MM-dd');
          }
        }
      ],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function ( api, rowIdx, columns: any[] ) {
            const data = columns.map( x => {
              return x.hidden ?
                '<tr data-dt-row="' + x.rowIndex + '" data-dt-column="'+x.columnIndex+'">' +
                '<td><b>' + x.title + '</b></td>' +
                '<td><b>:</b></td>' +
                '<td>' + x.data + '</td>' +
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100','table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      }
    };
  }

  search(): void{
    this.dataTable.ajax.reload();
  }

  export(): void{    
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
