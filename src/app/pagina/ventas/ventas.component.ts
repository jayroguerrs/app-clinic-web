import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MaestroPreferente, MedioContacto } from 'src/app/componentes/preferente/preferente.models';
import { TipoPerfil } from 'src/app/shared/enumeracion/enums';
import { RSede } from 'src/app/shared/interfaces/Response/sede';
import { MedioContactoService } from 'src/app/shared/services/medio-contacto.service';
import { SedeService } from 'src/app/shared/services/sede.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormularioService } from 'src/app/shared/services/formulario-ventas.service';
import { TipoClienteDTO } from 'src/app/shared/interfaces/tipoClienteDTO';
import { Usuario } from 'src/app/shared/models';
import { PromocionFormDTO } from 'src/app/shared/interfaces/promocionFormDTO';
import { ServicioPromocionDTO } from 'src/app/shared/interfaces/servicioPromocionDTO';
import { VentaFormDTO } from 'src/app/shared/interfaces/ventaFormDTO';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import * as Excel from 'exceljs';
import * as fs from 'file-saver';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  listaMaestra = new MaestroPreferente();
  formulario: FormGroup;
  filter: FormGroup;
  sbcCollectionTeleoperador: Subscription;
  sbcMedioContacto: Subscription;
  sbcServicios: Subscription;
  sbcSedes: Subscription;
  sbcServiciosPorPromocion: Subscription;
  sbcTipoClientes: Subscription;
  sbcPromociones: Subscription;
  loadingSede = false;
  usuarioActual: Usuario;
  idPromocion = 0;

  listSedes: RSede[] = [];
  listPromociones: PromocionFormDTO[] = [];
  listTipoCliente: TipoClienteDTO[] = [];
  listServiciosPorPromocion: ServicioPromocionDTO[] = [];

  numDocMax: number = 8;
  isLoading: Boolean = false;
  nameMonth: string = "";

  lstReporte : any[];

  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accImp: boolean = false;
  accLstI: boolean = false;
  accLstG: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;
  accFrmV: boolean = false;

  flagFilTel: boolean = false;  

  constructor(private usuarioService: UsuarioService, 
    private fb: FormBuilder,     
    private medioContactoService: MedioContactoService,
    private sedeService: SedeService,
    private formularioService: FormularioService,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private clienteService: ClienteService,
    private permisoHelper: PermisoHelper
  ) {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.nameMonth = "Registro de Ventas " + this.datePipe.transform(new Date(), 'MMMM', undefined, 'es').toUpperCase();
  }

  ngOnInit(): void {
    this.teleoperadorListar();
    this.listarMedioContacto();
    this.listarSedes();
    this.listarTipoClientes();
    this.listarPromociones();

    this.formulario = this.fb.group({
      idTeleoperadora: [null, Validators.required],      
      tipDoc: ['1', Validators.required],
      docCliente: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      fechaCita: ['', Validators.required],
      idTipoCliente: [null, Validators.required],
      idOrigen: [null, Validators.required],
      idServiciosPorPromocion: [null, Validators.required],
      idPromocion: [null, Validators.required],
      idSede: [null, Validators.required],
      numeroOrigen: ['', Validators.required],
      observaciones: ['']
    });

    this.filter = this.fb.group({
      fechaDesde: [null, Validators.required],      
      fechaHasta: [null, Validators.required],      
      idTeleoperadora: [null],
      idSede: [null]
    });    
    
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accImp = accesos.accImp;
      this.accLstI = accesos.accLstI;
      this.accLstG = accesos.accLstG;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;
      this.accFrmV = accesos.accFrmV;  
            
      if(this.usuarioActual.idperfil === 9){
        this.flagFilTel = true;
      }
      else{
        this.flagFilTel = false;
      }
    });    
  }
  teleoperadorListar(): void {
    this.sbcCollectionTeleoperador = this.usuarioService.obtenerByIdPerfil(TipoPerfil.OPERADOR.toString(), 0).subscribe(
      resultado => {
        this.listaMaestra.teleoperadores = resultado
        if(this.listaMaestra.teleoperadores.length > 0){
          this.filter.controls.idTeleoperadora.setValue(this.usuarioActual.idUsuario);
          this.formulario.controls.idTeleoperadora.setValue(this.usuarioActual.idUsuario);     
        }
      }        
    );
  }
  listarMedioContacto(): void {
    this.sbcMedioContacto = this.medioContactoService.obtenerMedioContacto()
      .subscribe((resultado: MedioContacto[]) => {
        this.listaMaestra.mediosContactos = resultado;
      });
  }
  onPromocionChange(event: any) {
    const idPromocion = event.idPromocion;        
    this.listarServiciosPorPromocion(idPromocion);
  }
  onTipDocChange(){
    let TipDoc =this.formulario.get('tipDoc').value;
    if(TipDoc === '1'){
      this.numDocMax = 8;
      this.formulario.get('docCliente').setValue('');
      this.formulario.get('nombreCliente').setValue('');
    }
    else{
      this.numDocMax = 11;
      this.formulario.get('docCliente').setValue('');
      this.formulario.get('nombreCliente').setValue('');
    }    
  }
  listarSedes(): void {
    this.loadingSede = true;
    this.sedeService.obtener().subscribe((resultado: any[]) => {

        this.listSedes = resultado.map(el => ({
            id: el.idSede,
            nombre: el.nombre
        }));

        if(this.listSedes.length > 0){
          this.filter.controls.idSede.setValue(this.usuarioActual.idSede);
          this.formulario.controls.idSede.setValue(this.usuarioActual.idSede);
        } 

        this.loadingSede = false; 
    }, error => {
        console.error("Error al obtener sedes", error);
        this.loadingSede = false; 
    });
  }
  listarTipoClientes(): void {
    this.sbcTipoClientes = this.formularioService.obtenerTipoCliente(this.usuarioActual.idUsuario)
      .subscribe(
        (resultado: TipoClienteDTO[]) => {
          this.listTipoCliente = resultado; 
        },
        error => {
          console.error("Error al obtener tipos de cliente", error);
        }
      );
  }  
  listarPromociones(): void {
    this.sbcPromociones = this.formularioService.obtenerPromociones(this.usuarioActual.idUsuario)
      .subscribe(
        (resultado: PromocionFormDTO[]) => {
          this.listPromociones = resultado; 
        },
        error => {
          console.error("Error al obtener promociones", error);
        }
      );
  }
  listarServiciosPorPromocion(idPromocion: number): void {    
    
    this.formularioService.obtenerServiciosPorPromocion(idPromocion, this.usuarioActual.idUsuario).subscribe(res => {             
      if(res.status === 200){
        this.listServiciosPorPromocion = res.data;
        this.formulario.get('idServiciosPorPromocion').setValidators(Validators.required);
      }          
      else{        
        this.formulario.get('idServiciosPorPromocion').setValue(null);
        this.listServiciosPorPromocion = [];
        this.formulario.get('idServiciosPorPromocion').clearValidators();
      }         

      this.formulario.get('idServiciosPorPromocion').updateValueAndValidity();

    }, error => {        
      console.error("Error al obtener servicios por promociones", error);      
    });           
  }
  onRegistrar(): void {       
    if (this.formulario.valid) {            
      const formData: VentaFormDTO = {
        idTeleoperadora: this.formulario.value.idTeleoperadora,
        nombreCliente: this.formulario.value.nombreCliente,
        docCliente: this.formulario.value.docCliente,
        fechaCita: this.datePipe.transform(this.formulario.value.fechaCita, 'yyyy-MM-dd'),
        idTipoCliente: this.formulario.value.idTipoCliente,
        idOrigen: this.formulario.value.idOrigen,
        idServiciosPorPromocion: this.formulario.value.idServiciosPorPromocion,
        idPromociones: this.formulario.value.idPromocion,
        idSede: this.formulario.value.idSede,
        nroOrigen: this.formulario.value.numeroOrigen,
        observaciones: this.formulario.value.observaciones,
        idUsuario: this.usuarioActual.idUsuario 
      };
      this.formularioService.registrarVenta(formData).subscribe(
        response => {
          this.utilsService.mostrarToast('Venta registrada:', 'success');
          this.formulario.reset(); 
          this.formulario.controls.tipDoc.setValue('1');
          this.formulario.controls.idSede.setValue(this.usuarioActual.idSede);
          this.formulario.controls.idTeleoperadora.setValue(this.usuarioActual.idUsuario);
        },
        error => {
          console.error("Error al registrar la venta", error);
        }
      );
    } else {
      console.error("El formulario no es válido");
    }
  }
  onDescarga(): void {
    if(this.filter.valid){

      if (!this.dateRangeValidator()) {
        return;
      }

      const param = {
        "FechaDesde":this.filter.controls.fechaDesde.value,
        "FechaHasta":this.filter.controls.fechaHasta.value,
        "IdTeleoperadora": this.filter.controls.idTeleoperadora.value,
        "IdSede": this.filter.controls.idSede.value,
        "IdUsuario": this.usuarioService.UsuarioActual.idUsuario
      }

      this.formularioService.reporteFormularioVenta(param).subscribe(
        response => {                              
          if(response.data.length > 0){
            this.lstReporte = response.data;
            this.createExcelFile().then((blob) => {
              const fileName = `Reporte de Formulario de Ventas de ${this.filter.controls.fechaDesde.value} al ${this.filter.controls.fechaHasta.value}.xlsx`;
              fs.saveAs(blob, fileName);
              this.utilsService.mostrarToast('Se descargó correctamente', 'success');
            });
          }
          else{
            this.utilsService.mostrarToast('No hay datos disponibles para el rango de fechas especificado.', 'warning');
          }         
        },
        error => {
          this.utilsService.mostrarToast('Ocurrió un error al intentar descargar los datos. Por favor, inténtalo nuevamente.', 'error');
        }
      )
    }
  }
  onBuscarCliente():void{
    let tipDoc = this.formulario.get('tipDoc').value;
    
    if(this.formulario.controls.docCliente.value === '' || this.formulario.controls.docCliente.value === null){
      this.utilsService.mostrarToast('Debe ingresar un numero de documento', 'error');
      return;
    }

    this.isLoading = true;

    if(tipDoc === '1'){
      this.clienteService.obtenerDatosDNI(this.formulario.controls.docCliente.value).subscribe(result => {
          if (result != null) {            
            this.formulario.controls.nombreCliente.setValue(result.nombresCompleto);
            this.formulario.controls.docCliente.setValue(result.dni);                  
            this.isLoading = false;
          } else {
            this.formulario.controls.nombreCliente.setValue('');
            this.isLoading = false;
          }
        }, error => {
          console.log('Error al obtener ruc', error);
          this.isLoading = false;
        });
    }
    else if(tipDoc === '2'){
      this.clienteService.obtenerRuc(this.formulario.controls.docCliente.value).subscribe(result => {        
        if (result != null) {
          this.formulario.controls.nombreCliente.setValue(result.razonSocial);
          this.formulario.controls.docCliente.setValue(result.ruc);  
          this.isLoading = false;                
        } else {
          this.formulario.controls.nombreCliente.setValue('');
          this.isLoading = false;
        }
      }, error => {
        console.log('Error al obtener ruc', error);
        this.isLoading = false;
      });
    }    
  }
  restrictInput(event: KeyboardEvent) {
    const charCode = event.charCode;
    // Permitir solo números y el backspace
    if (charCode !== 0 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
  // Reporte
  private async createExcelFile(): Promise<Blob> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('DataSheet');

    const header = [      
      "IdTeleoperadora", "Teleoperadora", "Nombre_Cliente", "Dnicliente", "Fechacita", "Tipocliente", 
      "Origen", "Servicio", "Promociones", "Sede", "Nroorigen", 
      "Observaciones", "Dff", "Mes", "IdUsuario", 
      "Fecha", "FechaRegistro"
    ];

    this.addDateRange(worksheet,'A1:Q1');
    this.addHeader(worksheet,header);
    this.addData(worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  private addDateRange(worksheet: Excel.Worksheet, CellMerge: string): void {
    const fechaRange = `Fecha Desde: ${this.filter.controls.fechaDesde.value} - Fecha Hasta: ${this.filter.controls.fechaHasta.value}`;
    worksheet.mergeCells(CellMerge);
    const startCell = worksheet.getCell('A1');
    startCell.value = fechaRange;
    startCell.font = { bold: true };
    startCell.alignment = { horizontal: 'center' };
  }

  private addHeader(worksheet: Excel.Worksheet, headers: string[]): void {      
    // Agrega las cabeceras
    const headerRow = worksheet.addRow(headers);    
    // Aplica negrita a las cabeceras
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { ...cell.font, bold: true };
    });
  }

  private addData(worksheet: Excel.Worksheet): void {
    this.lstReporte.forEach(rep => {
      const row = [
        rep.IdTeleoperadora || '', rep.Teleoperadora  || '', rep.Nombre_Cliente || '', rep.Dnicliente || '',
        rep.Fechacita || '', rep.Tipocliente || '', rep.Origen || '', rep.Servicio || '', rep.Promociones || '', 
        rep.Sede || '', rep.Nroorigen || '', rep.Observaciones || '', rep.Dff || '', rep.Mes || '',
        rep.IdUsuario || '',  rep.Fecha || '', rep.FechaRegistro || ''
      ];
      worksheet.addRow(row);    
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber === 1) return;
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength < 10 ? 10 : maxLength + 3;
    });
  }
  dateRangeValidator(): boolean {
    const fechaDesde = this.filter.controls.fechaDesde.value;
    const fechaHasta = this.filter.controls.fechaHasta.value; 
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      this.utilsService.mostrarToast('La fecha "Desde" no puede ser mayor que la fecha "Hasta".', 'error');
      return false; 
    }
    return true; 
  }
}
