import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImportExportDataService } from '../../../shared/services/import-export-data.service';
import { HistoriaClinicaService } from '../../../shared/services/historia-clinica.service';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent implements OnInit {
  frmHistoriaClinica: FormGroup;
  dtResponsiveOptions: any = {};
  modalClienteListadoRef: NgbModalRef;
  modalHistoriaClinicaDatosRef: NgbModalRef;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    private importExportDataService: ImportExportDataService,
    private historiaClinicaService: HistoriaClinicaService,
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
      this.accImp = accesos.accImp;  
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete; 
    });
  }
  inicializarFormulario(): void {
    this.frmHistoriaClinica = this.formBuilder.group({
      idCliente: [0],
      nombrePaciente : [''],
      numerosTelefonicos: [''],
      edadPaciente: [0],
      fotoTipoPiel: ['']
    });
  }
  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        // this.historiaClinicaService.obtener(this.frmHistoriaClinica.controls.idCliente.value).subscribe(
        //   data => callback({ data }),
        //   error => console.log('Error al obtener la historia clinica', error))
      },
      columns: [
      { title: 'FECHA',               data: 'id',               width: '4%',     },
      { title: 'ZONA DE TRATAMIENTO', data: 'nombresCompletos', width: '20%'     },
      { title: 'FLUENCIA',            data: 'seudonimo',        width: '10%'     },
      { title: 'KJ/150MC2',           data: 'genero',           width: '10%'     },
      { title: 'SESION',              data: 'celular1',         width: '10%'     },
      { title: 'COMENTARIOS',         data: 'celular2',         width: '10%'     },
      ],
      rowCallback: (row: Node, data: any | object, index: number) => {
        $('td:not(:eq(0))', row).off('click');
        $('td:not(:eq(0))', row).on('click', () => {

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
  mostrarListaCliente(modal: any): void {
    this.modalClienteListadoRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalClienteListadoRef.result.then(
      result => {
        const cliente = this.importExportDataService.ClienteImport();
        this.frmHistoriaClinica.patchValue({
          idCliente: cliente.id,
          nombrePaciente: cliente.nombresCompletos,
          numerosTelefonicos: cliente.celular1 + ' - ' + cliente.celular2,
          edadPaciente: cliente.edad
        });

        $('.table-historia-clinica').DataTable().ajax.reload();

      });
  }
  agregarHistorial(modal: any): void {
    this.modalHistoriaClinicaDatosRef = this.utilsService.abrirModal(modal, 'lg');
  }
}
