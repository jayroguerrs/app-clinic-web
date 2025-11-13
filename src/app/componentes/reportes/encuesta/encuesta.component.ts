import {AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {RSede} from "../../../shared/interfaces/Response/sede";
import {
  FormularioEncuesta,
  FormularioEncuestaOpcion,
  FormularioEncuestaPregunta
} from "../../../shared/models/formulario-encuesta";
import {SedeService} from "../../../shared/services/sede.service";
import {FormularioEncuestaService} from "../../../shared/services/formulario-encuesta.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';

import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
import {EncuestaClientesComponent} from "./encuesta-clientes/encuesta-clientes.component";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { Router } from '@angular/router';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  // selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit, AfterViewInit, OnDestroy {

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Load data form
  loadingSede = false;
  sbcSedeCollection: Subscription;
  sedes: RSede[] = [];

  loadingFormularios = false;
  sbcFormularioCollection: Subscription;
  formularios: FormularioEncuesta[] = [];

  loadingReporte = true;
  sbcReporte: Subscription;
  reporte: FormularioEncuestaPregunta[] = [];

  // Formulario
  submitted = false;
  formGroup: FormGroup;
  today: Date;

  @ViewChild('clientes') tblClientes: EncuestaClientesComponent;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  constructor(
    private sedeService: SedeService,
    private formularioService: FormularioEncuestaService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private utilService: UtilsService,
    private permisoHelper: PermisoHelper,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone
  ) {
    this.today = new Date();

    this.formGroup = this.formBuilder.group({
      idSede: new FormControl(0),
      idFormulario: new FormControl(0),
      fdesde: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
      fhasta: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
      //idVariable: new FormControl('0')
    });

    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
      {threshold: [1]}
    );
  }

  ngOnInit(): void {
    this.obtenerFormulario();
    this.obtenerSedes();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accExf = accesos.accExf;
      this.accImp = accesos.accImp;  
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    if( this.sbcSedeCollection ){ this.sbcSedeCollection.unsubscribe() }
    if( this.sbcFormularioCollection ){ this.sbcFormularioCollection.unsubscribe() }
  }

  // get collections
  obtenerSedes(): void{
    this.loadingSede = true;
    this.sedeService.obtener().subscribe((res: any[]) => {
      const collection: RSede[] = [];
      res.forEach((el) => {
        const sede: RSede = {
          id: el.idSede,
          nombre: el.nombre
        };
        collection.push(sede);
      });

      this.sedes = collection;

    }, error => {
      console.log(error);
      this.loadingSede = false;
    }, () => {
      this.loadingSede = false;
    });
  }

  obtenerFormulario(): void{
    this.loadingFormularios = true;
    this.formularioService.obtenerListado(0).subscribe((res) => {
      this.formularios = res;
    }, error => {
      console.log(error);
      this.loadingFormularios = false;
    }, () => {
      this.loadingFormularios = false;
    });
  }

  // getters
  get f(): any{
    return this.formGroup.controls;
  }

  // functions
  obtenerReporte(): void{
    this.submitted = true;
    if( this.formGroup.invalid ){
      this.utilService.mostrarToast('Seleccionar rango de fecha','warning');
      return;
    }
    if( !parseInt(this.f.idFormulario.value, 10) ){
      this.utilService.mostrarToast('Seleccionar formulario','warning');
      return;
    }

    this.tblClientes.reload();

    this.loadingReporte = true;
    this.sbcReporte = this.formularioService.obtenerReporte(this.f.idSede.value, this.f.idFormulario.value, this.f.fdesde.value, this.f.fhasta.value).subscribe((res) => {
      this.reporte = res;
      // console.log( res );
    }, e => {
      console.log(e);
      this.loadingReporte = false;
    }, () => {
      this.loadingReporte = false;
    });
  }

  exportarExcel(): void{

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
        const title = 'Encuesta';
        const header = ["Pregunta", "Opción", "Cantidad", "Porcentaje"];

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Para marcar');
        const worksheet2 = workbook.addWorksheet('Para responder');

        worksheet.autoFilter = {
          from: 'A1',
          to: 'D1'
        }

        worksheet.addRow(header);

        ['A1', 'B1', 'C1', 'D1'].map(key => {
          worksheet.getCell(key).fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'305496'},
          };
          worksheet.getCell(key).font = {
            color: { argb: 'ffffff' },
            bold: true
          };
        });

        this.reporte.forEach( p => {
          if(p.tipoRespuesta === 'radio' || p.tipoRespuesta === 'select' || p.tipoRespuesta === 'checkbox'){
            p.opciones.forEach(o => {
              const data = [ p.texto , o.valor, o.contador, this.obtenerPorcentaje(p.opciones, o.contador) ]
              worksheet.addRow(data);
            });
          }
        });

        worksheet.columns.forEach(function(column){
          var dataMax = 0;
          column.eachCell({ includeEmpty: true }, function(cell){
            var columnLength = cell.value.length;
            if (columnLength > dataMax) {
              dataMax = columnLength;
            }
          })
          column.width = dataMax < 10 ? 10 : dataMax;
        });

        //// Hoja 2

        worksheet2.autoFilter = {
          from: 'A1',
          to: 'B1'
        }

        worksheet2.addRow(['Pregunta','Respuesta']);

        ['A1', 'B1'].map(key => {
          worksheet2.getCell(key).fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'305496'},
          };
          worksheet2.getCell(key).font = {
            color: { argb: 'ffffff' },
            bold: true
          };
        });

        this.reporte.forEach( p => {
          if(p.tipoRespuesta === 'textarea'){
            console.log(p.respuestas);
            p.respuestas.forEach(r => {
              if(r){
                const data = [ p.texto , r ]
                worksheet2.addRow(data);
              }
            });
          }
        });

        worksheet2.columns.forEach(function(column){
          var dataMax = 0;
          column.eachCell({ includeEmpty: true }, function(cell){
            var columnLength = cell.value.length;
            if (columnLength > dataMax) {
              dataMax = columnLength;
            }
          })
          column.width = dataMax < 10 ? 10 : dataMax;
        });

        workbook.xlsx.writeBuffer().then((data) => {
          const titulo = this.formularios.find( x => x.id === parseInt(this.f.idFormulario.value,10) ).nombre;
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, `Encuesta (${titulo}) desde ${this.f.fdesde.value} hasta ${this.f.fhasta.value}.xlsx`);
        });
      }
      else if(res.status === 400){
        Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'info');
      }
    },    
    (error)=>{
      Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'error');
    });     
  }

  obtenerPorcentaje(opciones: FormularioEncuestaOpcion[], valor): string{
    const porcentaje = '';
    const total = opciones.map(o => o.contador).reduce(function(a, b){ return a + b; });
    return `${valor*100/total}%`;
  }
}
