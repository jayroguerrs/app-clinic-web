import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as Excel from 'exceljs';
import * as fs from 'file-saver';
import { PreferenteService } from 'src/app/shared/services/preferente.service';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { Usuario } from 'src/app/shared/models';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-mdl-date-range-filter',
  templateUrl: './mdl-date-range-filter.component.html',
  styleUrls: ['./mdl-date-range-filter.component.scss']
})
export class MdlDateRangeFilterComponent implements OnInit {
  formGroup: FormGroup;
  today: Date;
  preferentes: any[] = [];
  errorMessage: string = '';
  usuarioActual: Usuario;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private preferenteService: PreferenteService,
    public utilsService: UtilsService,
    private usuarioService: UsuarioService,


  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.today = new Date();

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl(this.datePipe.transform(this.today, 'yyyy-MM-dd'), Validators.required),
      fechaHasta: new FormControl(this.datePipe.transform(this.today, 'yyyy-MM-dd'), Validators.required),
    }, {
      validators: this.dateRangeValidator
    });
  }

  dateRangeValidator(formGroup: FormGroup) {
    const fechaDesde = formGroup.get('fechaDesde').value;
    const fechaHasta = formGroup.get('fechaHasta').value;

    return fechaDesde && fechaHasta && fechaDesde > fechaHasta
      ? { dateRangeInvalid: true }
      : null;
  }

  onSubmit(): void {
    
    const fechaDesde = this.formatDate(this.formGroup.get('fechaDesde').value);
    const fechaHasta = this.formatDate(this.formGroup.get('fechaHasta').value);
    console.log(fechaDesde, fechaHasta);
    
  
    this.preferenteService.exportarPreferenteVentas(this.usuarioActual.idUsuario, fechaDesde, fechaHasta).subscribe(
      data => {
        if(data){
          console.log(data.data.length);
          
          if(data.data.length == 0){
            this.utilsService.mostrarToast('No hay datos disponibles para el rango de fechas especificado.','warning');
            this.errorMessage = 'No hay datos disponibles para el rango de fechas especificado.';
            return
          }
          if (data && data.data ) {
            this.preferentes = data.data;  
            
            this.createExcelFile().then((blob) => {
              const fileName = `Reporte de ventas de ${this.formatDate(new Date(fechaDesde))} al ${this.formatDate(new Date(fechaHasta))}.xlsx`;
              fs.saveAs(blob, fileName);
              this.utilsService.mostrarToast('Se descargo correctamente','success');
              this.activeModal.close(data);
            });
          } 
        }
      },
      error => {
        this.utilsService.mostrarToast('Ocurrió un error al intentar descargar los datos. Por favor, inténtalo nuevamente.', 'error');
        this.errorMessage = error.message;
      }
    );
  }
  
  private async createExcelFile(): Promise<Blob> {
    console.log('raaaa');
    
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('DataSheet');
  
    this.addDateRange(worksheet);
    this.addHeader(worksheet);
    this.addData(worksheet);
  
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  private addDateRange(worksheet: Excel.Worksheet): void {
    const fechaRange = `Fecha Desde: ${this.formatDate(this.formGroup.get('fechaDesde').value)} - Fecha Hasta: ${this.formatDate(this.formGroup.get('fechaHasta').value)}`;
    const startCell = worksheet.getCell('A1');
    
    worksheet.mergeCells('A1:J1'); 
    
    startCell.value = fechaRange;
    startCell.font = { bold: true };
    startCell.alignment = { horizontal: 'center' };
  }
  
  private addHeader(worksheet: Excel.Worksheet): void {
    const header = [
      "PREFERENTE", "ESTADO", "CLIENTE", "ATENCION", "VENTA", "CELULAR", 
      "ZONA", "TELEOPERADORA", "CORREO", "CONTACTO", "DISTRITO", 
      "OBSERVACION", "COMENTARIO", "USU. FACEBOOK", "USU. INSTAGRAM", 
      "UTM FUENTE", "UTM MEDIO", "UTM CAMPAÑA", "UTM ID", "UTM TERM", 
      "FEC. INGR.", "HORA INGR.", "U. REG", "FEC. ASIG.", "FEC. AGENDO.", 
      "MES", "EJECUTIVO", "SUPERVISOR"
    ];
    worksheet.addRow(header); 
  
  
    header.forEach((_, index) => {
      worksheet.getCell(2, index + 1).alignment = { horizontal: 'left' };
    });
  }
  
  private addData(worksheet: Excel.Worksheet): void {
    if (this.preferentes.length > 0) {
      console.log(this.preferentes);
      
      this.preferentes.forEach(preferente => {
        const row = [
          preferente.preferente || '',
          preferente.estado || '',
          preferente.cliente || '',
          preferente.atencion || '',
          preferente.venta || '',
          preferente.celular || '',
          preferente.zona || '',
          preferente.teleoperadora || '',
          preferente.correo || '',
          preferente.contacto || '',
          preferente.distrito || '',
          preferente.observacion || '',
          preferente.comentario || '',
          preferente.usuFacebook || '',
          preferente.usuInstagram || '',
          preferente.utmFuente || '',
          preferente.utmMedio || '',
          preferente.utmCampaña || '',
          preferente.utmId || '',
          preferente.utmTerm || '',
          preferente.fechaIngreso || '',
          preferente.horaIngreso || '',
          preferente.uReg || '',
          preferente.fechaAsignacion || '',
          preferente.fechaAgendado || '',
          preferente.mes || '',
          preferente.ejecutivo || '',
          preferente.supervisor || ''
        ];

        worksheet.addRow(row);
  
        row.forEach((_, index) => {
          worksheet.getCell(index + 1, index + 1).alignment = { horizontal: 'left' };
        });
      });
    } 

    worksheet.columns.forEach((column, index) => {
    let maxLength = 0;

    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber === 1) return; 

      const cellValue = cell.value ? cell.value.toString() : '';
      if (cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    });

    column.width = maxLength < 10 ? 10 : maxLength + 5; 
  });
  }
  
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || ''; 
  }
  
  closeModal(data: boolean = false): void {
    this.activeModal.close(data);
  }
}
