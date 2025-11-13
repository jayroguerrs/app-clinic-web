import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { MdlClienteAplicativoSettingsModalComponent } from '../../../modals/mdl-cliente-aplicativo-settings-modal/mdl-cliente-aplicativo-settings-modal.component';
import { UtilsService } from '../../../../shared/services/funciones/utils.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { PreferenteService } from '../../../../shared/services/preferente.service';

@Component({
  selector: 'app-preferente-mobile-listado',
  templateUrl: './preferente-mobile-listado.component.html',
  styleUrls: ['./preferente-mobile-listado.component.scss']
})
export class PreferenteMobileListadoComponent implements OnInit, OnDestroy, AfterViewInit {
  modalRef: NgbModalRef | undefined;

  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;
  
  datosMobilePreferente: any[];
  dtResponsiveOptionsMobilePreferente = {};
  dataTable: any;

  constructor(
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private preferenteService: PreferenteService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    (window as any).handleOptionClick = (idCita: number) => {
      this.ngZone.run(() => {
        this.abrirModalOpcionesMobilePreferentes(idCita);
      });
    };

    this.buildtableMobilePreferenteBotonTest();
  }

  ngOnDestroy(): void {
    delete (window as any).handleOptionClick;
  }

  ngAfterViewInit(): void {
    const _this = this;

    this.datatableElement.dtInstance.then((dtInstance: any) => {
      _this.dataTable = dtInstance;
    });
  }

  abrirModalOpcionesMobilePreferentes(idCita: number) {
    this.modalRef = this.modalService.open(MdlClienteAplicativoSettingsModalComponent, { size: 'md', windowClass: 'smodal fade2 round popins bg-dark-30', keyboard: false, centered: true, backdrop: 'static', backdropClass: 'bg-transparent', scrollable: true, animation: true });
    this.modalRef.componentInstance.idCita = idCita;

    this.modalRef.componentInstance.eventListarCitas.subscribe((data: any) => {
      this.prefListarMobile();
    });
  }

  prefListarMobile(){
    this.dataTable.ajax.reload();
  }

  buildtableMobilePreferenteBotonTest(): void {
    this.dtResponsiveOptionsMobilePreferente = {
      ajax: (dataTablesParameters: any, callback) => {
        this.spinner.show();

        this.preferenteService.preferenteMobileObtener().subscribe((data: any) => {
          this.datosMobilePreferente = data;

          callback({ data });
          this.spinner.hide();
        })

        $('#btnEditar1, #btnEditar2, #btnAsignar1, #btnAsignar2, #btnAtender1, #btnAtender2').hide();
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
        { title: '', data: null, defaultContent: '',           
          render: (data, type, row) => {
            // El botón llama a una función global y le pasa el id
            return `<button class="option-btn" style="border-radius: 100%;padding: 3px;color: #04a9f5; border: 2px solid #04a9f5; background-color: white; margin-left: 0.3rem;" onclick="event.stopPropagation();window.handleOptionClick(${row.idCita})">
                      <i style="font-size: 12px;" class="mdi mdi-dots-vertical d-flex"></i>
                    </button>`;
          } 
        },
        { title: 'CLIENTE', data: 'nombre' },
        { title: 'CELULAR', data: 'celular1' },
        { title: 'SERVICIO', data: 'servicio' },
        { title: 'TRATAMIENTO', data: 'nombreTratamiento' },
        { title: 'DNI', data: 'dni' },
        { title: 'ESTADO', data: 'estado' },
        { title: 'FECHA DE CITA', data: 'fechaCita' },
        {
          title: 'HORA DE CITA', data: 'horaInicio', render: (data: string) => {
            return this.datePipe.transform(new Date(data), 'hh:mm a');
          }
        },
        { title: 'PAGO REALIZADO', data: 'pagoRealizado', render: (data) => data ? 'SI' : 'NO' },

      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [{
        extend: 'excelHtml5',
        // title: this.getTitle,
        text: 'Preferentes',
        className: 'btn btn-sm btn-secondary',
        exportOptions: {
          columns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        }
      }],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function (api, rowIdx, columns: any[]) {
            const data = columns.map(x => {
              return x.hidden ?
                '<tr data-dt-row="' + x.rowIndex + '" data-dt-column="' + x.columnIndex + '">' +
                '<td><b>' + x.title + '</b></td>' +
                '<td><b>:</b></td>' +
                '<td>' + x.data + '</td>' +
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100', 'table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      },
      order: []
    };
  }
}
