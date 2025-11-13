import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportarService {

  constructor() { }

exportToExcel(jsonData: any[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    // Ajustar el ancho de las columnas de manera automática
    const columnWidths = this.getAutoColumnWidths(jsonData);
    worksheet['!cols'] = columnWidths;

    const workbook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private getAutoColumnWidths(jsonData: any[]): any[] {
    const columnWidths: any[] = [];
    const columns = Object.keys(jsonData[0]);

    // Iterar sobre cada columna y calcular el ancho máximo
    columns.forEach((col, index) => {
      let maxLength = col.length; // Iniciar con la longitud del nombre de la columna

      // Buscar el valor máximo en cada columna
      jsonData.forEach((row) => {
        if (row[col] && row[col].toString().length > maxLength) {
          maxLength = row[col].toString().length;
        }
      });

      // El ancho de la columna debería ser un poco mayor que el valor máximo
      columnWidths.push({ wpx: (maxLength + 2) * 8 }); // Ajustar el multiplicador para más o menos espacio
    });

    return columnWidths;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
