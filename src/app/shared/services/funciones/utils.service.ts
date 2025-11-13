import { Injectable } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  closeResult: string;

  constructor(
    private modalService: NgbModal
  ) { }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  modalOptions(size): NgbModalOptions{
    return {
      size,
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      backdropClass: 'light-blue-backdrop'
    }
  }
  abrirModal(template, size): any{
    return this.modalService.open(template, this.modalOptions(size));
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  cerrarModal(template): void{
    if(template == null) {
      this.modalService.dismissAll();
    }
  }



  mostrarToast(mensaje: string, icono: SweetAlertIcon, segundos: number = 3, showConfirmButton?: boolean): void{
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: showConfirmButton,
      timer: segundos * 1000,
      timerProgressBar: true,
      background: '#FFFFBB'
    }).fire(mensaje, '', icono);
  }

  get datatableIdioma(): any{
    return {
      select: {
        rows: '%d filas seleccionadas'
      },
      zeroRecords: 'No se encontraron datos',
      info: '<b>Total: _TOTAL_ registros</b>. <br>Página _PAGE_ de _PAGES_',
      infoEmpty: 'No hay registros',
      lengthMenu:     'Ver _MENU_ filas',
      search: 'Buscar:',
      loadingRecords: 'Cargando...',
      processing:     'Procesando...',
      infoFiltered: '(filtered from _MAX_ total records)',
      paginate: {
        first:      '<i class="fa-regular fa-chevrons-left" title="Primero"></i>',
        last:       '<i class="fa-regular fa-chevrons-right" title="Ultimo"></i>',
        next:       '<i class="fa-regular fa-chevron-right" title="Siguiente"></i>',
        previous:   '<i class="fa-regular fa-chevron-left" title="Anterior"></i>'
        },
    }
  }

  // FUNCIONES DE FECHA Y TIEMPO
  dateToDateStruct(fecha): any {
    return { day: fecha.getDate(), month: fecha.getMonth() + 1, year: fecha.getFullYear()};
  }
  objetoFechaToformatDate(fecha): string {
    //Cuando la fecha tiene el formato de objeto { mes: 01, dia: 01, año: 2021}
    return this.formatDate(new Date(fecha.year, fecha.month - 1, fecha.day));
  }
  objetoFechaToDate(fecha): Date {
    return new Date(fecha.year, fecha.month - 1, fecha.day);
  }
  formatDate(date): string {
    //Retorna una cadena con la fecha establecida
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [year, month, day].join('-');
  }

  stringDate(datePipe: DatePipe, date: string, format: string): string {
    //Retorna una cadena con la fecha establecida
    return datePipe.transform(new Date(date), format);
  }


  sumarMinutosAsDate(horaInicio: Date, minutos: number): Date {
    //Suman minutos a una fecha dada....
    return new Date(horaInicio.getTime() + minutos*60000);
  }
  sumarMinutosAsHoraString(horaInicio: Date, minutos: number): string {
    //Suman minutos a una fecha dada....
    return this.formato_hora_hms(new Date(horaInicio.getTime() + minutos*60000));
  }
  sumarDiasAsDate(fecha: string, dias){
    let parts = fecha.split('-');
    var mydate = new Date(
              parseInt(parts[0],10),
              parseInt(parts[1], 10) - 1,
              parseInt(parts[2],10));
    mydate.setDate(mydate.getDate() + dias);
    return mydate;
  }
  fechaStringToDate(fecha): Date {
    //Recibe una cadena de tipo 'yyyy-MM-dd' y devuelve un Date
    let parts = fecha.split('-');
    return new Date(
              parseInt(parts[0], 10),
              parseInt(parts[1], 10) - 1,
              parseInt(parts[2], 10));
  }

  sumarMinutosAsHoraString2(horaInicio: string, minutos: number): string {
    //Suman minutos al formato HH:mm:ss de un valor numerico
    const horaInicioDate = this.horaStringToDate(horaInicio);
    return this.formato_hora_hms(new Date(horaInicioDate.getTime() + minutos*60000));
  }
  totalMinutosAsDate(totalMinutos): Date {
    //Convierte un numero de minutos a formato hora contando desde las 00:00:00
    var horas = Math.floor(totalMinutos / 60);
    var minutos = totalMinutos % 60;
    var hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), horas, minutos, 0);
  }
  totalMinutosAsHoraString(totalMinutos): string {
    //Convierte un numero de minutos a formato hora contando desde las 00:00:00
    var horas = Math.floor(totalMinutos / 60);
    var minutos = totalMinutos % 60;
    var hoy = new Date();
    return this.formato_hora_hms(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), horas, minutos, 0));
  }
  totalDeMinutos(fechaHora: Date): number {
    //Retorna un entero con la cantidad de minutos de una fechaHora desde las 00:00:00
    var minutos = fechaHora.getMinutes();
    var horas = fechaHora.getHours() * 60;
    return minutos + horas;
  }
  horaStringToTotalDeMinutos(hora: string): number {
    // convierte una cadena de hora "HH:MM:SS" a Total de minutos
    var parts = hora.match(/(\d+)\:(\d+)\:(\d+)/),
    hours = parseInt(parts[1], 10),
    minutes = parseInt(parts[2], 10);

    return (hours * 60) + minutes;
  }
  formato_hora_hms(d): string {
    // HH:mm:ss
    const fecha = new Date(d);
    const hours = this.formato_2_digitos(fecha.getHours());
    const minutes = this.formato_2_digitos(fecha.getMinutes());
    const seconds = this.formato_2_digitos(fecha.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
  }
  formato_hora_hm(d): string {
    // HH:mm
    const fecha = new Date(d);
    const hours = this.formato_2_digitos(fecha.getHours());
    const minutes = this.formato_2_digitos(fecha.getMinutes());
    const seconds = this.formato_2_digitos(fecha.getSeconds());
    return hours + ":" + minutes;
  }
  formato_FechaString(date): string {
    // Retorna una cadena con la fecha establecida
    // dd-MM-yyyy
    const fecha = new Date(date);
    let month = '' + (fecha.getMonth() + 1);
    let day = '' + fecha.getDate();
    const year = fecha.getFullYear();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [day, month, year].join('-');
  }

  formato_FechaFullString(fecha, separadorFecha, separadorHora): string {
    // Retorna una cadena con la fecha establecida, especificando un separador de fecha y hora Ejemplo:
    // dd-MM-yyyy HH:mm  separador (-), (:)
    let month = '' + (fecha.getMonth() + 1);
    let day = '' + fecha.getDate();
    const year = fecha.getFullYear();
    const hours = this.formato_2_digitos(fecha.getHours());
    const minutes = this.formato_2_digitos(fecha.getMinutes());
    const seconds = this.formato_2_digitos(fecha.getSeconds());
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [day, month, year].join(separadorFecha) + ' ' + [hours, minutes].join(separadorHora);
  }
  formato_FechaHoraUniversalSQL(date: Date): string {
    // Retorna una cadena con la fecha y hora formato universal
    // yyyyMMdd HH:mm:ss
    const fecha = new Date(date);
    let month = '' + (fecha.getMonth() + 1);
    let day = '' + fecha.getDate();
    const year = fecha.getFullYear();
    const hours = this.formato_2_digitos(fecha.getHours());
    const minutes = this.formato_2_digitos(fecha.getMinutes());
    const seconds = this.formato_2_digitos(fecha.getSeconds());
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [year, month, day].join('') + ' ' + [hours, minutes, seconds].join(':');
  }
  formato_FechaHoraUniversalSQL2(date: Date): string {
    // Retorna una cadena con la fecha y hora formato universal
    // yyyyMMdd HH:mm:ss
    const fecha = new Date(date);
    let month = '' + (fecha.getMonth() + 1);
    let day = '' + fecha.getDate();
    const year = fecha.getFullYear();
    const hours = this.formato_2_digitos(fecha.getHours());
    const minutes = this.formato_2_digitos(fecha.getMinutes());
    const seconds = this.formato_2_digitos(fecha.getSeconds());
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [day, month, year].join('-') + ' ' + [hours, minutes, seconds].join(':');
  }
  formato_FechaUniversalSQL(date: Date): string {
    // Retorna una cadena con la fecha y hora formato universal
    // yyyyMMdd HH:mm:ss
    const fecha = new Date(date);
    let month = '' + (fecha.getMonth() + 1);
    let day = '' + fecha.getDate();
    const year = fecha.getFullYear();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [year, month, day].join('');
  }
  formato_2_digitos(n): string {
    return n < 10 ? '0' + n : n;
  }
  horaStringToDate(hora: string): Date {
    // convierte una cadena de hora "HH:MM:SS" a Date
    var d = new Date(),
    parts = hora.match(/(\d+)\:(\d+)\:(\d+)/),
    hours = parseInt(parts[1], 10),
    minutes = parseInt(parts[2], 10);

    d.setHours(hours);
    d.setMinutes(minutes);
    d.setSeconds(0);

    return d;
  }
  calculaEdad(fechaNacimiento: Date): number {
    const convertAge = new Date(fechaNacimiento);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  }

  /**
   *
   * @param base64
   * @param maxWidth
   * @param maxHeight
   * @return Promise
   */
  compressImage(base64: string, maxWidth: number, maxHeight: number): Promise<string> {
    // Redimensionar tamaño de la imagen base64
    return new Promise((res, rej) => {
      // Max size for thumbnail
      if(typeof(maxWidth) === 'undefined'){ const maxWidth = 500; }
      if(typeof(maxHeight) === 'undefined'){ const maxHeight = 500; }

      // Create and initialize two canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const canvasCopy = document.createElement("canvas");
      const copyContext = canvasCopy.getContext("2d");

      // Create original image
      const img = new Image();
      img.src = base64;

      img.onload = async () => {

        // Determine new ratio based on max size
        let ratio = 1;
        if (img.width > maxWidth)
        {
          ratio = maxWidth / img.width;
        }
        if (img.height > maxHeight)
        {
          const r = maxHeight / img.height;
          ratio = ( r < ratio ) ? r : ratio;
        }


        // Draw original image in second canvas
        canvasCopy.width = img.width;
        canvasCopy.height = img.height;
        await copyContext.drawImage(img, 0, 0);

        // Copy and resize second canvas to first canvas
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        await ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/jpeg");
        await res(data);
      }
      img.onerror = error => rej(error);
    })
  }

  // Window > 720px ?
  isLargeScreen(){
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width > 720;
  }



  /**
   *
   * @param numero
   */
  convertRoman(numero: number): string{
    let roman = "";
    switch (numero) {
      case 1: roman = "I";break;
      case 2: roman = "II";break;
      case 3: roman = "III";break;
      case 4: roman = "IV";break;
      case 5: roman = "V";break;
      case 6: roman = "VI";break;
      default: break;
    }
    return roman;
  }

  minutesToHour(minutos: number): string{
    const hour = Math.trunc(minutos / 60).toString().padStart(2,'0');
    const minutes = (minutos % 60).toString().padStart(2,'0');
    // console.log('minutos',minutos);
    return hour + ':' + minutes + ':00';
  }

  minutesToShortHour(minutos: number): string{
    const hour = Math.trunc(minutos / 60).toString().padStart(2,'0');
    const minutes = (minutos % 60).toString().padStart(2,'0');
    return hour + ':' + minutes;
  }

  get screenSmall(): boolean{
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 768;
  }

  get screenMedium(): boolean{
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return (width >= 768 && width < 992);
  }

  get screenLarge(): boolean{
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width > 992;
  }

  shortName(nombre: string): string{
    const output : string[] = nombre.split(" ");
    return output[0].charAt(0).toUpperCase() + output[1].charAt(0).toUpperCase();
  }

  firstLetterUpperCase(any: string): string{
    let output = '';
    const firstLetter = any.charAt(0).toUpperCase();
    const all = any.substring(1);
    output = firstLetter + all;

    return output;
  }
  horaStringToFormat12Hour(hora: string | null): string {
    if(!hora){return '';}
    const horas: any[] = [
      {current: '01', real: '01', format: 'AM'},
      {current: '02', real: '02', format: 'AM'},
      {current: '03', real: '03', format: 'AM'},
      {current: '04', real: '04', format: 'AM'},
      {current: '05', real: '05', format: 'AM'},
      {current: '06', real: '06', format: 'AM'},
      {current: '07', real: '07', format: 'AM'},
      {current: '08', real: '08', format: 'AM'},
      {current: '09', real: '09', format: 'AM'},
      {current: '10', real: '10', format: 'AM'},
      {current: '11', real: '11', format: 'AM'},
      {current: '12', real: '12', format: 'PM'},
      {current: '13', real: '01', format: 'PM'},
      {current: '14', real: '02', format: 'PM'},
      {current: '15', real: '03', format: 'PM'},
      {current: '16', real: '04', format: 'PM'},
      {current: '17', real: '05', format: 'PM'},
      {current: '18', real: '06', format: 'PM'},
      {current: '19', real: '07', format: 'PM'},
      {current: '20', real: '08', format: 'PM'},
      {current: '21', real: '09', format: 'PM'},
      {current: '22', real: '10', format: 'PM'},
    ]
    const h = hora.split(':');
    return hora ? horas.find(x => x.current === h[0]).real + ':' + h[1] + ' ' + horas.find(x => x.current === h[0]).format : '';
  }

  counter(i: number) {
    return new Array(i);
  }

  async getMounths(fechaDesde: Date, fechaHasta: Date): Promise<Date[]>{
    const collection: Date[] = [];
    let ini = await new Date(fechaDesde); await ini.setDate(1);
    const fin = await new Date(fechaHasta); await fin.setDate(1);

    if(ini.getTime() == fin.getTime()){
       collection.push(ini);
    }else{
      let current: Date = new Date(ini);
      while(fin.getTime() >= current.getTime()){
        collection.push(current);
        current = new Date(current.getFullYear(), current.getMonth()+1, 1);
      }
    }

    return collection;
  }

  toColumnName(num: number) {
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt(((num % b) / a).toString() ) + 65) + ret;
    }
    return ret;
  }


  LightenDarkenColor(col,amt): string {
    var usePound = false;
    if ( col[0] == "#" ) {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  }

}
