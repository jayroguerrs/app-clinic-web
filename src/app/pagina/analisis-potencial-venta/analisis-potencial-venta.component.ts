import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ServicioService} from "../../shared/services/servicio.service";
import {Servicio} from "../../shared/models/servicio";
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Sede} from "../../shared/models/sede";
import {SedeService} from "../../corporal360/shared/service/sede.service";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {VentaService} from "../../shared/services/venta.service";
import { VentaPotencial, VentaPotencial_Citas} from "../../shared/models/venta";

import Swal from 'sweetalert2';
import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analisis-potencial-venta',
  templateUrl: './analisis-potencial-venta.component.html',
  styleUrls: ['./analisis-potencial-venta.component.scss']
})
export class AnalisisPotencialVentaComponent implements OnInit, AfterViewInit, OnDestroy {

  servicios: Servicio[] = [];
  ldServicios = false;
  sbcServicios: Subscription | undefined;

  sedes: Sede[] = [];
  ldSedes = false;
  sbcSedes: Subscription | undefined;

  frmGroup: FormGroup;

  ldSubmit = false;
  submitted = false;

  collection: VentaPotencial[] = [];
  ldCollection = false;
  sbcCollection: Subscription | undefined;



  constructor(
    private servicioService: ServicioService,
    public sedeService: SedeService,
    private formBuild: FormBuilder,
    private utils: UtilsService,
    private datePipe: DatePipe,
    private ventaService: VentaService,
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) {
    const today = new Date();

    this.frmGroup = this.formBuild.group({
      fechaDesde: new FormControl( this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required ),
      fechaHasta: new FormControl(this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required),
      idSede: new FormControl(0, Validators.required),
      idServicio: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
    this.listarServicios();
    this.listarSedes();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.sbcServicios?.unsubscribe();
  }

  listarServicios(): void{
    this.ldServicios = true;
    this.sbcServicios = this.servicioService.listar().subscribe((res: Servicio[]) => {
      this.servicios = res;
      this.ldServicios = false;
    }, error => {
      console.log(error);
      this.ldServicios = false;
    })
  }

  listarSedes(): void{
    this.ldSedes = true;
    this.sbcSedes = this.sedeService.listar().subscribe((res: Sede[]) => {
      this.sedes = res;
      this.ldSedes = false;
    }, error => {
      console.log(error);
      this.ldSedes = false;
    });
  }


  get f(): any{
    return this.frmGroup.controls;
  }

  onSubmit(): void{
    this.submitted = true;
    if(this.frmGroup.invalid){
      this.utils.mostrarToast('Debe seleccionar un rango de fecha','warning');
      console.log(this.frmGroup);
      return;
    }

    const fechaInicio = this.f.fechaDesde.value ? this.datePipe.transform(this.f.fechaDesde.value, 'yyyy-MM-dd') : null;
    const fechaFin = this.f.fechaHasta.value ? this.datePipe.transform(this.f.fechaHasta.value, 'yyyy-MM-dd') : null;
    const idSede = parseInt( this.f.idSede.value, 10);
    const idServicio = parseInt( this.f.idServicio.value, 10);

    this.sbcCollection?.unsubscribe();
    this.ldCollection = true;
    this.ventaService.ReportePotencialVenta(fechaInicio, fechaFin, idSede, idServicio).subscribe((res: VentaPotencial[]) => {
      this.collection = res;
      this.exportarExcel(this.f.fechaDesde.value, this.f.fechaHasta.value, res);
      this.submitted = false;
    }, error => {
      this.ldCollection = false;
      this.submitted = false;
    });
  }

  async exportarExcel(fechaDesde: Date, fechaHasta: Date,collection: VentaPotencial[]): Promise<void>{

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
       
    this.auditoriaService.insAuditoria(param).subscribe(async (res)=>{
      if(res.status === 200){
        const title = 'Citas atendidas';
        const header = ["N°", "Cliente", "Canal", "Sede", "Cliente Activo", "Especialista que atendio", "Servicio que compró"];

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Citas atendidas');




        const dates: Date[] = await this.utils.getMounths(fechaDesde, fechaHasta);
        const ventas: string[] = header.map(x => {return ""});
        const anios: string[] = header.map(x => {return ""});
        await dates.forEach(x => {
          ventas.push("Venta");
          anios.push(x.getFullYear().toString());
          header.push(this.datePipe.transform(x,'MMM','','Es-pe')[0].toUpperCase() + this.datePipe.transform(x,'MMM','','Es-pe').slice(1));
        })
        header.push('TOTAL');

        worksheet.addRow(["Análisis de Potencial de Venta"]);
        worksheet.addRow([`Del ${this.datePipe.transform(fechaDesde, 'dd-MM-yyyy')} hasta ${this.datePipe.transform(fechaHasta, 'dd-MM-yyyy')}`]);
        worksheet.addRow(ventas);
        worksheet.addRow(anios);
        worksheet.addRow(header);
        this.collection.forEach( (v: VentaPotencial, i) => {

          const data = [
            (i+1),
            v.cliente ,
            v.medioContacto,
            v.sede,
            v.clienteActivo,
            v.citas.map(x => x.atendidoPor).filter((value, index, array) => array.indexOf(value) === index).join(" - "),
            v.servicio
          ];

          // Agregar los totales
          dates.forEach(x => {
            let citas = v.citas.filter( c => this.datePipe.transform(c.fechaCita, 'yyyyMM')  === this.datePipe.transform(x, 'yyyyMM'));
            data.push( citas.length ? citas.map( cc => { return cc.total }).reduce((a,b) => a + b , 0) : 0 );
          });

          data.push( v.citas.map( cc => { return cc.total }).reduce((a,b) => a + b , 0) );

          worksheet.addRow(data);

        });

        worksheet.columns.forEach(function(column, indexColumn){
          let dataMax = 0;
          column.eachCell( function(cell,i){
            let columnLength = cell.value ? (cell.value.length + 6) : 0;
            if (columnLength > dataMax) {
              dataMax = columnLength;
            }
          })
          column.width = dataMax < 10 ? 10 : dataMax;
          if(indexColumn > 6){
            column.numFmt =  '"S/" #,##0.00;[Red]\-"S/" #,##0.00';
          }
        });


        worksheet.eachRow(function (row, _rowNumber) {
          row.eachCell({ includeEmpty: true }, function (cell, _colNumber) {
            // console.log(cell.address); // <- to see I actullay go into the cells
            cell.border = {
              top: { style: 'thin', color: {argb:'FFFFFFFF'} },
              left: { style: 'thin', color: {argb:'FFFFFFFF'} },
              bottom: { style: 'thin', color: {argb:'FFFFFFFF'} },
              right: { style: 'thin', color: {argb:'FFFFFFFF'} }
            };
          });
        });


        worksheet.eachRow(function(row, rowNumber) {
          if(rowNumber >= 5 ){
            worksheet.getRow(rowNumber).eachCell({ includeEmpty: true },function(cell, index) {
                worksheet.getCell(cell.address) .border = {
                  top: {style:'thin', color: {argb:'00000000'}},
                  left: {style:'thin', color: {argb:'00000000'}},
                  bottom: {style:'thin', color: {argb:'00000000'}},
                  right: {style:'thin', color: {argb:'00000000'}}
                };

              worksheet.getCell(cell.address).alignment = {
                vertical: 'middle'
              }

                if([3,4,5].includes(index)){
                  worksheet.getCell(cell.address).alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                  }
                }

                if(index > 7){
                  worksheet.getCell(cell.address).alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                  }
                }

            });
          }
        });

        worksheet.getRow(3).eachCell(function(cell, index) {
          worksheet.getCell(cell.address).alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }
          worksheet.getCell(cell.address).font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: true
          }
        });
        worksheet.getRow(4).eachCell(function(cell, index) {
          worksheet.getCell(cell.address).alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }
          worksheet.getCell(cell.address).font = {
            name: 'Calibri',
            family: 4,
            size: 11
          }
        });
        worksheet.getColumn(1).width = 10;
        worksheet.getColumn(6).width = 50;
        worksheet.getColumn(6).alignment = {wrapText:true};
        worksheet.getColumn(1).eachCell(function(cell, index) {
          worksheet.getCell(cell.address).alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }
        });
        worksheet.getRow(5).height = 63.75;
        worksheet.getRow(5).eachCell({ includeEmpty: false }, function(cell, index) {
          worksheet.getCell(cell.address).alignment = {
            vertical: 'middle',
            horizontal: 'center'
          }
          if(index <= 4){
            worksheet.getCell(cell.address).font = {
              name: 'Calibri',
              family: 4,
              size: 14,
              bold: true,
              color: { argb: 'ff203764'}
            }
          }else{
            worksheet.getCell(cell.address).font = {
              name: 'Calibri',
              family: 4,
              size: 10,
              bold: true,
              color: { argb: 'ffffffff'}
            }
            worksheet.getCell(cell.address).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: 'ff203764' },
              bgColor: { argb: 'ff203764' }
            }
          }

        })

        worksheet.getRow(1).font = {
          name: 'Calibri',
          family: 4,
          size: 15,
          bold: true
        }
        worksheet.getRow(2).font = {
          name: 'Calibri',
          family: 4,
          size: 15,
          bold: true
        }
        worksheet.getColumn(header.length).width = 24;
        worksheet.mergeCells(1,1,1,header.length);
        worksheet.mergeCells(2,1,2,header.length);
        let columname = this.utils.toColumnName(header.length);
        let citas: VentaPotencial_Citas[] = [];
        collection.forEach( c => {
          c.citas.forEach( ct => {
            citas.push(ct);
          });
        });
        // console.log(citas);
        worksheet.getCell(4, header.length).value = {
          formula: `SUM(${columname}6:${columname}${collection.length + 5})`,
          result: citas.map( c => c.total).reduce((a,b) => a + b , 0)
        };

        workbook.xlsx.writeBuffer().then((data) => {
          this.ldCollection = false;
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, `Analisis de Potencial de Venta - Del ${this.datePipe.transform(fechaDesde, 'dd-MM-yyyy')} hasta ${this.datePipe.transform(fechaHasta, 'dd-MM-yyyy')}.xlsx`);
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
