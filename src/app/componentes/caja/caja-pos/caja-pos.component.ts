import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import { RSede } from 'src/app/shared/interfaces/Response/sede';
import { CajaService } from 'src/app/shared/services/caja.service';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { SedeService } from 'src/app/shared/services/sede.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-caja-pos',
  templateUrl: './caja-pos.component.html',
  styleUrls: ['./caja-pos.component.scss']
})
export class CajaPosComponent implements OnInit, AfterViewInit  {
// FormGroup
frmPos: FormGroup;

// ViewChilds
@ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
@ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;

// Data
data: any[][] | null = null;
headers: string[] = [];
headersCab :any[] = [];
loadingSede = false;
collectionSede: RSede[] = [];
lstTipRepo: any[] = [];
file: File;
isCorrectCabFile:Boolean = true;
rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
totColumns: number = 0;

// Datatable
dtResponsiveOptions: any = {};
idReg = 0;
selected = 0;
dataTable: any;
regSeleccionado: any = null;

// Subscriptions
sbcCollection: Subscription;

// Constructor
constructor(
  private formBuilder: FormBuilder,
  private utilsService: UtilsService,  
  private cajaService: CajaService,
  private sedeService: SedeService,
  private usuarioservice:UsuarioService,  
) { }

  ngOnInit(): void {
    this.frmPos = this.formBuilder.group({      
      idSede: ['',Validators.required],
      tpRepo: ['',Validators.required]
    });  
    this.dtSedes();   
    this.dtTipRepo(); 
  }

  ngAfterViewInit(): void {    
    if (this.fileInput) {
      console.log('File input initialized:', this.fileInput.nativeElement);
    }
  }
  
  // Action Click  
  onProcesar():void {       
    if(this.file === null || this.file === undefined){
      this.utilsService.mostrarToast("Debe adjuntar un archivo !!!",'info');
      return;
    }

    Swal.fire({
      html: 'Desea importar los datos del archivo <b>' + this.file.name + '</b>?',
      icon: 'info',
      focusConfirm: true,
      allowOutsideClick: false,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then( async (result) => {
      if(result.isConfirmed){

        if(this.isCorrectCabFile){
          const param = {
            "IdSede": this.frmPos.get('idSede')?.value,
            "IdUser": this.usuarioservice.UsuarioActual.idUsuario,
            "TipRep": this.frmPos.get('tpRepo')?.value
          }    
          this.cajaService.updFilePos(param,this.file).subscribe(res => {            
            if(res.status === 200){
              this.utilsService.mostrarToast("Archivo procesado correctamente",'success');
              this.data = null; 
              this.file = null;
              this.frmPos.get('tpRepo')?.setValue('');
              this.frmPos.get('idSede')?.setValue('')
              this.fileInput.nativeElement.value = '';
            }
            else{
              this.utilsService.mostrarToast("Error en proceso",'error');
            }      
          }, error => {      
            this.utilsService.mostrarToast(error.error.error,'error');
          });
        }
        else{
          Swal.fire({
            title: "Alerta",
            text: "Verifique las cabeceras del archivo o esta cargando un archivo incorrecto",
            icon: "info"
          });               
        }        
      }  
      else{
        return;
      }    
    });    
  }
  // ActionChange
  onTipRepoChange(event: Event):void {          
    this.headers = [];
    this.data = null;
    this.file = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    let TipRepo = this.frmPos.get('tpRepo')?.value;
        
    this.lstTipRepo.map((x)=> {      
      if(x.CodRepo.trim() === TipRepo.trim()){        
        this.headersCab = JSON.parse(x.ColRepo.replace(/'/g, '"'));                
      }
    });        
  }
  onSedeChange(event: Event):void{    
    if(this.frmPos.get('idSede')?.value === '' || this.frmPos.get('idSede')?.value === null){
      this.frmPos.get('tpRepo')?.setValue('');
      this.headers = [];
      this.data = null;
      this.file = null;
    }
  }
  onFileSelected(event: any, fileInput: HTMLInputElement): void {        
    this.file = event.target.files[0];
      this.headers = [];
      this.data = [];
      this.totColumns = 0;

      if(!this.isExcelFile(this.file)){
        this.utilsService.mostrarToast("Solo esta permitido archivos excel !!!",'error');
        this.data=null;            
        this.file=null;
        fileInput.value = '';
        return;
      }

      const table = $('#dtDataPos').DataTable();
      table.destroy();
      $('#dtDataPos').empty(); 

      if (this.file) {
        const reader = new FileReader();
      
        reader.onload = (e: any) => {          
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];          
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
                
          if (json.length > 0) {
            this.headers = json[0] as string[];
            
            let msgErrors = "";                        

            if(this.frmPos.get('tpRepo')?.value === 'RI'){              
                this.totColumns = this.headersCab.length;
            }
            else if(this.frmPos.get('tpRepo')?.value === 'RV'){                              
                this.totColumns = this.headersCab.length;
            }

            if(this.frmPos.get('tpRepo')?.value === 'RI'){
              this.headersCab.map((x) => {
                if(!this.headers.includes(x)){
                  msgErrors+=x+'-';
                }              
              });

              if(msgErrors !== ""){
                this.isCorrectCabFile = false;
                Swal.fire({
                  title: "Alerta",
                  text: "Existe un error en las cabeceras del archivo",
                  icon: "info"
                });
                this.data = null;
                return;                
              }
              else{
                this.isCorrectCabFile = true;
              }

              this.data = [];
              for (let i = 1; i < json.length; i++) {
                const row = json[i];
                // Convertir objeto a array
                const rowArray = Object.values(row);
                let isEmpty = true;            
                // Verificar si alguna celda en la fila tiene un valor significativo
                for (const cell of rowArray) {
                  if (cell !== null && cell !== undefined && cell !== '') {
                    isEmpty = false;
                    break; // Salir del bucle tan pronto como encontramos un valor
                  }
                }            
                // Si la fila no está vacía, agregarla a this.data
                if (!isEmpty) {
                  this.data.push(rowArray);
                }
              }
            }
            else if(this.frmPos.get('tpRepo')?.value === 'RV'){
              if(this.headersCab.length !== this.headers.length){
                msgErrors = 'Existe un error en las cabeceras del archivo';
              }

              if(msgErrors !== ""){
                this.isCorrectCabFile = false;
                Swal.fire({
                  title: "Alerta",
                  text: msgErrors,
                  icon: "info"
                });  
                this.data = null;
                return;              
              }
              else{
                this.isCorrectCabFile = true;
              }

              this.data = [];
              for (let i = 2; i < json.length; i++) {
                const row = json[i];
                // Convertir objeto a array
                const rowArray = Object.values(row);
                let isEmpty = true;            
                // Verificar si alguna celda en la fila tiene un valor significativo
                for (const cell of rowArray) {
                  if (cell !== null && cell !== undefined && cell !== '') {
                    isEmpty = false;
                    break; // Salir del bucle tan pronto como encontramos un valor
                  }
                }            
                // Si la fila no está vacía, agregarla a this.data
                if (!isEmpty) {
                  this.data.push(rowArray);
                }
              }
            }
                                    
            // Convertir objetos a arrays
            
          } else {
            this.headers = [];
            this.data = [];
          }        
          this.buildTable();                        
        };
        reader.readAsArrayBuffer(this.file);
      }                
  }
  // Load Controls
  buildTable(): void {    
    const numColumns = this.headers.length;         
    const preparedData = this.data.map(row => {      
      const filledRow = Array(numColumns).fill('-');
      row.forEach((cell, index) => {
        filledRow[index] = cell === '' || cell === undefined || cell === null ? '-' : cell;
      });
      return filledRow;
    });

    $('#dtDataPos tbody').find('.dtr-control').removeClass('dtr-control');

    $('#dtDataPos').DataTable({
      data: preparedData,
      language: {
        "sEmptyTable": "No hay datos disponibles en la tabla",
        "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
        "sInfoEmpty": "Mostrando 0 a 0 de 0 entradas",
        "sInfoFiltered": "(filtrado de _MAX_ entradas totales)",
        "sInfoPostFix": "",
        "sInfoThousands": ",",
        "sLengthMenu": "Mostrar _MENU_ entradas",
        "sLoadingRecords": "Cargando...",
        "sProcessing": "Procesando...",
        "sSearch": "Buscar:",
        "sZeroRecords": "No se encontraron resultados",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": activar para ordenar la columna de manera descendente"
        }
    },
      columns: this.headersCab.map((header, index) => ({
        title: header,
        data: index,
        render: (data) => data === '' || data === undefined || data === null ? '-' : data
      })),
      searching: true,
      paging: true,
      info: true,
      ordering: true,
      responsive: true,
      buttons: ['excel'],
      pageLength: 25 
    });
  }
  dtSedes(): void{
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

      this.collectionSede = collection;
    }, error => {
      console.log(error);
    }, () => {
      this.loadingSede = false;
    });
  }
  dtTipRepo(): void{
    this.cajaService.selTipRepo().subscribe((x,i)=> {      
      this.lstTipRepo = x.data;
    });
  }
  // Helpers
  isExcelFile = (file: File): boolean => {    
    const fileExtension = this.getFileExtension(file);        
    return fileExtension === 'xlsx' || fileExtension === 'xls';
  };  
  getFileExtension = (file: File): string => {    
    const fileName = file.name;    
    const dotIndex = fileName.lastIndexOf('.');    
    if (dotIndex !== -1) {
      return fileName.substring(dotIndex + 1).toLowerCase();
    }    
    return '';
  }; 
}
