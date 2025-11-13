import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, NgZone} from '@angular/core';

import {ReportesService} from '../../../shared/services/reportes-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../../shared/services/funciones/utils.service';

import {NgxSpinnerService} from "ngx-spinner";
import { DatePipe } from '@angular/common';
import {SedeService} from "../../../shared/services/sede.service";
import {Subscription} from "rxjs";
import {RSede} from "../../../shared/interfaces/Response/sede";
import {ReporteService} from "../../../shared/services/reporte.service";

import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
import { especialistaCitas } from 'src/app/shared/models/reportecitas';
import {UsuarioService} from "../../../shared/services/usuario.service";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'especialista-atendidos.component.html' ,
  styleUrls: ['./especialista-atendidos.component.scss'],
  providers: [DatePipe]
})
export class EspecialistaAtendidosComponent implements OnInit, OnDestroy, AfterViewInit{

    today: Date;
    formGroup: FormGroup;
    sbcCollectionSede!: Subscription;
    loadingSede = false;
    collectionSede: RSede[] = [];
    collectionData: especialistaCitas[] = [];
    submitted = false;

    // Spinner
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
    dataUsuarios: Array<{id: string, text: string}> = [];
    maestroUsuarios: any = [];
    //subscription
    sbcCollectionUsuarios: Subscription;

    // Permisos
    accTot: boolean = false;
    accExp: boolean = false;
    accExc: boolean = false;
    accExi: boolean = false;
    accImp: boolean = false;

    constructor(
      private reporteservice: ReportesService,
      private formBuilder: FormBuilder,
      private utilsService: UtilsService,
      private datePipe: DatePipe,
      private spinner: NgxSpinnerService,
      private sedeService: SedeService,
      private reporteService: ReporteService,
      private usuarioService: UsuarioService,
      private permisoHelper: PermisoHelper,      
      private auditoriaService : AuditoriaService,
      private router: Router,
    ) {

      this.today = new Date();

      this.formGroup = this.formBuilder.group({
        idSede: new FormControl(0),
        fdesde: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        fhasta: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        atendidoPor: new FormControl(0, Validators.required)
      });

      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
        {threshold: [1]}
      );

    }

    ngOnInit(): void {
      this.obtenerSedes();
      this.usuarioListar();
      this.permisoHelper.readPermiso().then((accesos) => {
        this.accTot = accesos.accTot;
        this.accExp = accesos.accExp;
        this.accExc = accesos.accExc;
        this.accExi = accesos.accExi;
        this.accImp = accesos.accImp;  
      });
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
      if(this.sbcCollectionSede){ this.sbcCollectionSede.unsubscribe(); }
      if ( this.sbcCollectionUsuarios ){ this.sbcCollectionUsuarios.unsubscribe(); }
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
    usuarioListar(): void {
      this.sbcCollectionUsuarios = this.usuarioService.obtenerUsuarios(true).subscribe(
        resultado => {
          this.maestroUsuarios = resultado;
          this.dataUsuarios = this.maestroUsuarios.map((x) => {
            return {
              id: x.idUsuario,
              text:x.nombre
            };
          });
          this.dataUsuarios.unshift({ id: '0', text: '...TODOS...' });
          // this.dataUsuarios.forEach(u => {
          //   const data = {
          //     id: u.idUsuario,
          //     text:u.nombre
          //   }
          // });
          // console.log(this.dataUsuarios);
        },
        error => console.log('Error al obtener los usuario', error)
      );
    }

    // On Submit
    obtenerReporte(event: string | null = null): void{

      this.submitted = false;

      if( this.formGroup.invalid ){
        this.utilsService.mostrarToast('Seleccionar rango de fechas','error');
        return;
      }
      this.spinner.show();
      this.reporteService.obtenerEspecialistasCitasAtendidas(this.f.fdesde.value, this.f.fhasta.value, this.f.idSede.value, event ? event : 0).subscribe((res)=>{
        // console.log(res);
        this.collectionData = res;
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
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
          const header = ["Especialista", "N° Citas Atendidas", "Sede"];

          const workbook = new Excel.Workbook();
          const worksheet = workbook.addWorksheet('Citas atendidas');

          worksheet.autoFilter = {
            from: 'A1',
            to: 'B1',
          }

          worksheet.addRow(header);

          console.log(this.collectionData);
          

          this.collectionData.forEach( (e) => {  
            console.log(e);          
            const data = [ e.nombre , e.citas.map(x => x.cantidad).reduce((prev, curr) => prev + curr, 0), this.collectionSede.find(x => x.id === this.f.idSede.value).nombre ]
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

          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, "Citas atendidas por especialista del " + this.f.fdesde.value + " al " + this.f.fhasta.value + '.xlsx');
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

    // getter
    totalCitasAtendidas(): number{
      const _e = this.collectionData.map(x => x.citas.map(y => y.cantidad).reduce((a, b) => a + b,0));
      return _e.reduce((a,b) => a+b,0);
    }

}



