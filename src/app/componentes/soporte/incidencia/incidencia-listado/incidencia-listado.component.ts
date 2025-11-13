import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { IncidenciaService } from '../../../../shared/services/incidencia.service'
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-incidencia-listado',
  templateUrl: './incidencia-listado.component.html',
  styleUrls: ['./incidencia-listado.component.scss']
})
export class IncidenciaListadoComponent implements OnInit {
  frmIncidencia: FormGroup;
  dtResponsiveOptions: any = {};
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  idIncidencia = 0;

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
    private incidenciaService: IncidenciaService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private permisoHelper: PermisoHelper
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
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
  inicializarFormulario(): void {
      this.frmIncidencia = this.formBuilder.group({
        filtroEstado: [0]
      });
  }
  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        this.spinner.show();
        this.incidenciaService.obtener(this.frmIncidencia.controls.filtroEstado.value).subscribe(
          data => {
            callback({data});
            this.spinner.hide();
        }, error =>  {
          console.log('Error al obtener las incidencias: ' + error);
          this.spinner.hide();
        });
      },
      columns: [
        { title: 'ID', data: 'id', width: '4%', visible: false },
        { title: 'MÓDULO', data: 'modulo', width: '15%', visible: false },
        { title: 'DESCRIPCIÓN', data: 'descripcion', width: '20%' },
        { title: 'ESTADO', width: '10%', data: 'estado' },
        { title: 'USUARIO', width: '25%', data: 'usuario' },
        { title: 'PRIORIDAD', width: '10%', data: 'prioridad' },
        { title: 'FECHA REGISTRO', width: '10%', data: 'fechaRegistro' },
        { title: 'FECHA PUBLICACIÓN', width: '10%', data: 'fechaPublicacion' },

      ],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {
          this.idIncidencia = data.id;
        });
        return row;
      },
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        'excel'
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
      select: true
    };
  }
  incidenciaListar(): void {

  }
  incidenciaNuevo(model: NgbModalRef): void {

  }
  incidenciaEditar(model: NgbModalRef): void {

  }
}
