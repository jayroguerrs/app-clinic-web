import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormularioEncuestaPregunta} from "../../../../shared/models/formulario-encuesta";
import {DataTableDirective} from "angular-datatables";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";

@Component({
  selector: 'app-respuesta-tabla',
  templateUrl: './respuesta-tabla.component.html',
  styleUrls: ['./respuesta-tabla.component.scss']
})
export class RespuestaTablaComponent implements OnInit, OnDestroy {

  @Input() pregunta: FormularioEncuestaPregunta = null;

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  dataTable: any;

  respuestas: string[] = [];

  constructor(
    private utilsService: UtilsService
  ) {

  }

  ngOnInit(): void {
    this.respuestas = this.pregunta.respuestas.filter(x =>  x != null);
    this.buildTable();
    // console.log(this.pregunta);
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

}
