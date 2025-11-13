import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {especialistaCitas} from "../../../../shared/models/reportecitas";
import {DataTableDirective} from "angular-datatables";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CitaDetalleComponent} from "../CitaDetalle/cita-detalle.component";


@Component({
  selector: 'app-especialista-item',
  templateUrl: 'especialista-item.component.html' ,
  styleUrls: ['./especialista-item.component.scss'],
})
export class EspecialistaItemComponent implements OnInit, OnDestroy, AfterViewInit{

    @Input() especialista: especialistaCitas | null = null;
    @Input() idSede: number = 0;
    // Datatable
    @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
    dtResponsiveOptions: any = {};

    constructor(
      private utilsService: UtilsService,
      private modalService: NgbModal
    ) {

    }

    ngOnInit(): void {
      this.buildTable();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {

    }

    buildTable(): void{
      this.dtResponsiveOptions = {
        searching: false,
        'columnDefs': [{
          'max-width': '34px',
          'targets': 0
        }],
        serverSide: false,
        processing: false,
        filtering: false,
        async: false,
        language: this.utilsService.datatableIdioma,
        autoWidth: false,
        pageLength: 5,
        lengthMenu: [ [5,10, 25, 50, -1], [5,10, 25, 50, "All"] ],
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
        }
      };
    }

    get totalCitas(): number{
      if(this.especialista.citas.length){
        return this.especialista.citas.map(x => x.cantidad).reduce((prev, curr) => prev + curr, 0);
      }else{
        return 0;
      }
    }

    date(datestring: string): Date{
      return new Date(datestring);
    }

    verDetalles(usuario: string, idUsuario: number, fecha: Date): void{
      const modal = this.modalService.open(CitaDetalleComponent,{
        backdrop : 'static',
        keyboard : false,
        windowClass:'show',
        centered: true,
        size: 'xl'
      });
      modal.componentInstance.fecha = fecha;
      modal.componentInstance.idUsuario = idUsuario;
      modal.componentInstance.usuario = usuario;
      modal.componentInstance.idSede = this.idSede;
    }

}



