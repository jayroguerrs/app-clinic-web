import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Usuario } from '../../../shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClienteService } from '../../../shared/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from "rxjs";
declare var $: any;

@Component({
  templateUrl: 'cliente-listado-numero.component.html',
  styleUrls: ['cliente-listado-numero.component.scss'],
})

export class ClienteListadoNumeroComponent implements OnInit, OnDestroy {
  idCliente = 0;
  usuarioActual: Usuario;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // datatable
  dtResponsiveOptions: any = {};

  // subcription
  sbcObtenerNumero: Subscription;

  constructor(
      private usuarioService: UsuarioService,
      private clienteService: ClienteService,
      private utilsService: UtilsService,
      private spinner: NgxSpinnerService,
      private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.buildtable();
  }

  ngOnDestroy(): void {
    // Destroy subscription
    if( this.sbcObtenerNumero ){ this.sbcObtenerNumero.unsubscribe(); }
  }

  buildtable(): void{
    //cuando se desea crear nuevo cliente desde otro componente
    let parametro = this.activatedRoute.snapshot.queryParams;

    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const mensajeError = 'Error al obtener clientes';
        this.spinner.show();
        this.sbcObtenerNumero = this.clienteService.obtenerByNumeroCelular("", parametro.numero1, "", parametro.numero2).subscribe(
          data => {
            callback({ data });
            this.spinner.hide();
          },
          error => {
            console.log(mensajeError + '' + error);
            this.spinner.hide();
          }
        );
      },
      columns: [
        { title: 'Id',                  data: 'id',               width: '4%',    visible: false   },
        { title: 'NOMBRES Y APELLIDOS', data: 'nombresCompletos', width: '20%'     },
        { title: 'DOCUMENTO',                 data: 'documento',        width: '5%'       },
        { title: 'GENERO',              data: 'genero',           width: '10%'     },
        { title: 'CELULAR 1',           data: 'celular1',         width: '5%'     },
        { title: 'CELULAR 2',           data: 'celular2',         width: '5%'     },
        { title: 'CORREO',              data: 'correo',           width: '10%'     },
        { title: 'ESTADO',              data: 'idEstado',         width: '5%',    render: (data: number) => { return (data === 1) ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>'; } },
        { title: 'NACIMIENTO',          data: 'fechaNacimiento',  width: '5%',   render: (data: any) => { return `<span>${ this.utilsService.formato_FechaString(data) }</span>`; } },
      ],
      serverSide: false,
      processing: false,
      pageLength: 20,
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
