import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, NgZone} from '@angular/core';

import {ReportesService} from '../../../shared/services/reportes-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../../shared/services/funciones/utils.service';

import {NgxSpinnerService} from "ngx-spinner";
import { DatePipe } from '@angular/common';
import {SedeService} from "../../../shared/services/sede.service";
import {Subscription} from "rxjs";
import {RSede} from "../../../shared/interfaces/Response/sede";

import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
import {UsuarioService} from "../../../shared/services/usuario.service";
import {TblCronogramaCitasAtendidasComponent} from "./TblCronogramaCitasAtendidas/tbl-cronograma-citas-atendidas.component";
import { CronogramaCitasAtendidas } from 'src/app/shared/models/reportecitas';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'citas-atendidas.component.html' ,
  styleUrls: ['./citas-atendidas.component.scss'],
  providers: [DatePipe]
})
export class CitasAtendidasComponent implements OnInit, OnDestroy, AfterViewInit{

    today: Date;
    formGroup: FormGroup;

    sbcCollectionSede!: Subscription;
    loadingSede = false;
    collectionSede: RSede[] = [];

    collectionData: CronogramaCitasAtendidas[] = [];
    submitted = false;

    // Spinner
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
    @ViewChild('tabla') tabla : TblCronogramaCitasAtendidasComponent;

    hasValues = false;

    // Permisos
    accTot: boolean = false;
    accExp: boolean = false;
    accExc: boolean = false;
    accExi: boolean = false;
    accExf: boolean = false;
    accImp: boolean = false;
    constructor(
      private reporteservice: ReportesService,
      private formBuilder: FormBuilder,
      private utilsService: UtilsService,
      private datePipe: DatePipe,
      private spinner: NgxSpinnerService,
      private sedeService: SedeService,
      private usuarioService: UsuarioService,
      private permisoHelper: PermisoHelper,      
      private auditoriaService : AuditoriaService,
      private router: Router,
    ) {

      this.today = new Date();

      this.formGroup = this.formBuilder.group({
        idSede: new FormControl(0),
        fdesde: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        fhasta: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required)
      });

      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
        {threshold: [1]}
      );

    }

    ngOnInit(): void {
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
      this.tabla._collection.subscribe((res: CronogramaCitasAtendidas[]) => {
        this.collectionData = res;
        this.hasValues = !!res.length;
      });
    }

    ngOnDestroy(): void {
      if(this.sbcCollectionSede){ this.sbcCollectionSede.unsubscribe(); }
    }

    get f(): any{
      return this.formGroup.controls;
    }

    // Obtener data
    obtenerSedes(): void{
      this.loadingSede = true;
      this.sbcCollectionSede = this.sedeService.obtener().subscribe((res: any[]) => {
        const collection: RSede[] = [];
        res.forEach((el) => {
          const sede: RSede = {
            id: el.idSede,
            nombre: el.nombre
          };
          collection.push(sede);
        });

        this.collectionSede = collection;
      }, error => {
        console.log(error);
      }, () => {
        this.loadingSede = false;
      });
    }


    // On Submit
    obtenerReporte(event: string | null = null): void{

      this.submitted = false;

      if( this.formGroup.invalid ){
        this.utilsService.mostrarToast('Seleccionar rango de fechas','error');
        return;
      }

      this.tabla.dataTable.ajax.reload();
    }

    // Funciones
    mostrarSedeNombre(id: number): string{
        const sede = this.collectionSede.find( s => s.id === id );
        if( sede ){
          return sede.nombre;
        }else{
          return '';
        }
    }

    exportar(): void{
      this.tabla.dataTable.button(0).trigger();
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
            const title = 'Citas atendidas';
            const header = [
              "Sede",
              "Fecha",
              "Año",
              'Mes',
              'Dia',
              'Número',
              '08:00 AM',
              '09:00 AM',
              '10:00 AM',
              '11:00 AM',
              '12:00 PM',
              '01:00 PM',
              '02:00 PM',
              '03:00 PM',
              '04:00 PM',
              '05:00 PM',
              '06:00 PM',
              '07:00 PM',
              '08:00 PM',
              '09:00 PM'
            ];

            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Cronograma citas atendidas');

            worksheet.autoFilter = {
              from: 'A1',
              to: 'T1',
            }

            const headerRow = worksheet.addRow(header);
            headerRow.eachCell((cell, number) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4167B8' },
                bgColor: { argb: '' }
              }
              cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12
              }
            });
            this.collectionData.forEach( (e) => {
              const data = [
                e.sede ,
                this.datePipe.transform(e.fecha,'yyyy-MM-dd'),
                this.datePipe.transform(e.fecha,'yyyy'),
                this.datePipe.transform(e.fecha,'MMMM','','es-ES').toUpperCase(),
                this.datePipe.transform(e.fecha,'EEEE','','es-ES').toUpperCase(),
                this.datePipe.transform(e.fecha,'dd'),
                e.h8,
                e.h9,
                e.h10,
                e.h11,
                e.h12,
                e.h13,
                e.h14,
                e.h15,
                e.h16,
                e.h17,
                e.h18,
                e.h19,
                e.h20,
                e.h21
              ]
              worksheet.addRow(data);
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

            worksheet.addConditionalFormatting({
              ref: 'G2:T'+(this.collectionData.length+1),
              rules: [
                {
                  type: 'cellIs',
                  operator: 'lessThan',
                  formulae: [6],
                  result: true,
                  style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'F1416C'}}},
                },
                {
                  type: 'cellIs',
                  operator: 'between',
                  formulae: [6,10],
                  result: true,
                  style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FFC700'}}},
                },
                {
                  type: 'cellIs',
                  operator: 'greaterThan',
                  formulae: [10],
                  result: true,
                  style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: '04C8C8'}}},
                }
              ]
            });

            workbook.xlsx.writeBuffer().then((data) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, `Cronograma citas atendidas del ${this.f.fdesde.value} al ${this.f.fhasta.value}.xlsx`);
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
}



