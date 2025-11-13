import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ControlDeCitasService } from '../../../../shared/services/control-de-citas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';

interface ZonaNode{
  abonado: boolean;
  celular: string;
  clienteNuevo: string;
  estado: string;
  fechaCita: string;
  fechaPagado: string;
  id: number;
  idCita: number;
  idCliente: number;
  idPreferente: number;
  idServicio: number;
  medioDeContacto: string;
  nombreSede: string;
  paciente: string;
  pagoFinal?: number;
  total?: number;
  tachado?: boolean;
  children?: ZonaNode[];
}
interface ExampleInterfaceDos{
  expandable: boolean;
  level: number;
  abonado: boolean;
  celular: string;
  clienteNuevo: string;
  estado: string;
  fechaCita: string;
  fechaPagado: string;
  id: number;
  idCita: number;
  idCliente: number;
  idPreferente: number;
  idServicio: number;
  medioDeContacto: string;
  nombreSede: string;
  paciente: string;
  pagoFinal: number;
  total: number;
  tachado?: boolean;
}

@Component({
  selector: 'app-citas-cerradas',
  templateUrl: './citas-cerradas.component.html',
  styleUrls: ['./citas-cerradas.component.scss', '../control-de-citas.component.scss']
})
export class CitasCerradasComponent implements OnInit {
  public palabraBusqueda : string;
  public fechaFiltro: any;
  public fechaFiltroFinal: any;
  private busqueda: boolean = false;
  public totalControlDecitas: number = 0;
  public pagina: number= 1;
  public rowsPerPage: number = 10;
  public fechaInicio : any
  public fechaFin : string
  public pagados: string = "Pagado"
  montoTotal: number = 0;
  public porcentajeSobreMontoTotal: number = 0;


  public montoTotalPrimeraComision: number = 0;
  public porcentajeSobrePrimerMontoTotal: number = 0;
  public montoTotalSegundaComision: number = 0;
  public porcentajeSobreSegundoMontoTotal: number = 0;
  public montoTotalTerceraComision: number = 0;
  public porcentajeSobreTercerMontoTotal: number = 0;

  mesActual: string;
  isChecked: boolean = false;

  elementos_por_pagina: number = 10;
  idUsuario: any;
  mostrarPagadosMensual: any = 1;

  mostrarAbonados: boolean = false;


  //PROPIEDADES DE EL TACHO DE BASURA 
  citasParaElTacho: any
  //////////////////////////
  displayedColumns: string[] = ['idCita', 'nombre', 'celular', 'sede', 'nuevo', 'origen', 'monto', 'fecha_pagado', 'fecha_de_cita', 'estado', 'acciones'];
  
  private transformer = (node: ZonaNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,

      abonado: node.abonado ,
      celular : node.celular,
      clienteNuevo : node.clienteNuevo,
      estado : node.estado,
      fechaCita : node.fechaCita,
      fechaPagado : node.fechaPagado,
      id : node.id,
      idCita : node.idCita,
      idCliente : node.idCliente,
      idPreferente : node.idPreferente,
      idServicio : node.idServicio,
      medioDeContacto : node.medioDeContacto,
      nombreSede : node.nombreSede,
      paciente : node.paciente,
      pagoFinal : node.pagoFinal,
      total : node.total,
      children: node.children,
      tachado: node.tachado
    };
  }

  treeControl = new FlatTreeControl<ExampleInterfaceDos>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this.transformer, node => node.level, 
      node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private spinner: NgxSpinnerService,
    private controlDeCitasService: ControlDeCitasService,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) {}

  hasChild = (_: number, node: ExampleInterfaceDos) => node.expandable;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.idUsuario = this.localStorageService.getUser()?.id ;
    this.obtenerControlDeCitas();

    const fechaActual = new Date();
    this.mesActual = this.datePipe.transform(fechaActual, 'MMMM') || "";  

    if(this.mostrarAbonados){
      this.displayedColumnsControl.push('abonado');
    }
  }

  displayedColumnsControl: string[] = ['idCita', 'nombre', 'celular', 'sede', 'nuevo', 'origen', 'monto', 'fecha_pagado', 'fecha_de_cita', 'estado', 'acciones'];
  //displayedColumnsControl: string[] = ['nombre', 'celular', 'sede', 'nuevo', 'origen', 'monto', 'fecha_de_cita', 'estado'];

  dataSourceControl = new MatTableDataSource<any>([]);

  ngAfterViewInit() {
      this.dataSourceControl.paginator = this.paginator;
  }

  applyFilterBusqueda(filterValue: string): void {

    if(!filterValue){
      this.palabraBusqueda = "";
      this.pagina = 1;
      this.paginator.pageIndex = 0;
      this.mostrarPagadosMensual = 1;
      this.obtenerControlDeCitas();
      this.dataSourceControl.filter = this.palabraBusqueda.trim().toLowerCase();
    }
  }
  
  obtenerControlDeCitas(){
    this.spinner.show();

    this.controlDeCitasService.getCitasByUser(this.idUsuario, this.pagina, this.rowsPerPage, this.fechaInicio, this.fechaFin, this.palabraBusqueda, this.pagados, null, this.mostrarPagadosMensual, this.mostrarAbonados ? 1 : null ).subscribe((resp: any) => {
      this.citasParaElTacho = resp;
      this.totalControlDecitas = resp.total;
      this.verificarCitasAbonadas(resp)
      this.dataSourceControl.sort = this.sort;

    })
  }

  //filtro de busqueda boton
  applyFilterButton(): void {
    this.isChecked = false;
    this.mostrarPagadosMensual = null;
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    this.obtenerControlDeCitas();
    this.dataSourceControl.filter = this.palabraBusqueda.trim().toLowerCase();
  }

  mostrarTodasLasCitas(event: any): void {
    if (event.checked) {
      this.mostrarPagadosMensual = null;
      this.pagina = 1;
      this.paginator.pageIndex = 0;
      this.palabraBusqueda = "";
      this.fechaFiltro = null;
      this.fechaInicio = null;
      this.fechaFiltroFinal = null;
      this.fechaFin = "";
      this.obtenerControlDeCitas();
    } else {
      this.limpiarFiltroBusqueda();
    }

  }

  limpiarFiltroBusqueda(){
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    this.mostrarPagadosMensual = 1;
    this.palabraBusqueda = "";
    this.isChecked = false;
    this.fechaFiltro = null;
    this.fechaInicio = null;
    this.fechaFiltroFinal = null;
    this.fechaFin = "";
    this.obtenerControlDeCitas();
  }

  limpiarLocalStorageCitas(){
    localStorage.removeItem('citasAbonadas');
  }
  
  mostrarControlDeCitaFechaIncio(){
    this.mostrarPagadosMensual = null;
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    this.isChecked = false;
    this.fechaInicio = this.datePipe.transform(this.fechaFiltro, 'yyyy-MM-dd') || "";
    this.obtenerControlDeCitas();
  }

  mostrarControlDeCitaFechaFinal(){
    if(this.fechaInicio){
      this.mostrarPagadosMensual = null;
      this.pagina = 1;
      this.paginator.pageIndex = 0;
      this.isChecked = false;
      this.fechaFin = this.datePipe.transform(this.fechaFiltroFinal, 'yyyy-MM-dd') || "";
      this.obtenerControlDeCitas();
    }
  }


  onPageChange(event: any) { 
    this.pagina = event.pageIndex + 1;
    this.obtenerControlDeCitas();
    if(!this.busqueda){
      // *this.obtenerControlDeCitas();
    } else {
      // *this.buscarControlDeCitas();
    }
  }

  exportarExcel(){
    
  }
  
  buscarControlDeCitas(){

  }

  mostrarCitaDetalle(element: any){
    const url = `/Cita/${element.idCita}/${1}/${element.idCliente}/${element.idPreferente}/${element.idServicio}`;
    window.open(url, '_blank');
  }

  mostrarClienteDetalle(id: number){
    const url = `/ClientePerfil/${id}`;
    window.open(url, '_blank');
  }

  quitarCitasAbonadasDelPadre(element: any, tieneTodosChildrenTachado: number){
    if(tieneTodosChildrenTachado){

      element.children.forEach((children: any) => {
        this.quitarCitasAbonadas(children);
      })

      this.obtenerControlDeCitas();
    } else{

      element.children.forEach((children: any) => {
        if(!children.tachado){
          this.quitarCitasAbonadas(children);
        }
      })

      this.obtenerControlDeCitas();
    }
  }

  verificarTodosTachados(children: any[]): boolean {
    return children?.every(child => child.tachado) ?? false;
  }

  //FUNCIONES PARA EL TACHO DE BASURA
  quitarCitasAbonadas(element: any){

    const citasAbonadasExistente = localStorage.getItem("citasAbonadas");
    let citasAbonadasArray: any[] = [];
  

    if(citasAbonadasExistente){
      citasAbonadasArray = JSON.parse(citasAbonadasExistente); 

      if(citasAbonadasArray.find((c: any) => c.id === element.id)){
        const index = citasAbonadasArray.findIndex((c: any) => c.id === element.id);
        citasAbonadasArray.splice(index, 1);

        localStorage.setItem("citasAbonadas", JSON.stringify(citasAbonadasArray));
        return this.verificarCitasAbonadas(this.citasParaElTacho);

      }
      let cita = {
        monto: element.pagoFinal,
        id: element.id
      }

      citasAbonadasArray.push(cita);
      localStorage.setItem("citasAbonadas", JSON.stringify(citasAbonadasArray));
      return this.verificarCitasAbonadas(this.citasParaElTacho);
    } else{
      const citasAbonadas: any[] = [];
      let cita = {
        monto: element.pagoFinal,
        id: element.id
      }
      citasAbonadas.push(cita);
      localStorage.setItem("citasAbonadas", JSON.stringify(citasAbonadas))
      return this.verificarCitasAbonadas(this.citasParaElTacho);
    }
  }

  verificarCitasAbonadas(citas: any){
    const citasAbonadas = localStorage.getItem("citasAbonadas");
    let citasAbonadasArray: any[] = [];


    if(citasAbonadas){
      citasAbonadasArray = JSON.parse(citasAbonadas || "");
      const citasFiltradas = citas.citas.map((cita: any) => {

        if (cita.children && cita.children.length > 0) {
          // Procesar nodos con children
          const childrenActualizados = cita.children.map((child: any) => {
            const encontrada = citasAbonadasArray?.find((c: any) => c.id === child.id);
            return { ...child, tachado: !!encontrada };
          });
      
          const actualizarPagoFinalDelPadre = childrenActualizados.reduce((acc: number, child: any) => {
            return !child.tachado ? acc + child.pagoFinal : acc;
          }, 0);
      
          return {
            ...cita,
            children: childrenActualizados,
            pagoFinal: actualizarPagoFinalDelPadre,
          };
        } else {
          //Procesar nodos sin children
          const encontrada = citasAbonadasArray?.find((c: any) => c.id === cita.id);
          const tachado = !!encontrada;
          const pagoFinal = tachado ? 0 : cita.pagoFinal;
      
          return {
            ...cita,
            tachado,
            pagoFinal,
          };
        }
      });


      this.obtenerTotalYSubtotal(citasAbonadasArray);

      this.dataSourceControl = new MatTableDataSource<any>(citasFiltradas);
      this.dataSource.data = citasFiltradas;
      return this.spinner.hide();
    } else {
      this.montoTotal = citas.montoTotal;
      // this.porcentajeSobreMontoTotal = citas.porcentajeSobreMontoTotal;
  
      this.montoTotalPrimeraComision = citas.montoPrimeraComisionTotal;
      this.porcentajeSobrePrimerMontoTotal = citas.porcentajeSobreMontoPrimeraComisionTotal;
      this.montoTotalSegundaComision = citas.montoSegundaComisionTotal;
      this.porcentajeSobreSegundoMontoTotal = citas.porcentajeSobreMontoSegundaComisionTotal;
      this.montoTotalTerceraComision = citas.montoTercerComisionTotal;
      this.porcentajeSobreTercerMontoTotal = citas.porcentajeSobreMontoTercerComisionTotal;

      const comisionTotal = this.porcentajeSobrePrimerMontoTotal + this.porcentajeSobreSegundoMontoTotal + this.porcentajeSobreTercerMontoTotal;
      this.porcentajeSobreMontoTotal = comisionTotal;

      
      this.dataSourceControl = new MatTableDataSource<any>(citas.citas);
      this.dataSource.data = citas.citas;
      return this.spinner.hide();
    }
  }

  obtenerTotalYSubtotal(citasAbonadasArray: any) {
    

    let montoARestar = 0;
    let montoARestarPrimeraComision = 0;
    let montoARestarSegundaComision = 0;
    let montoARestarTerceraComision = 0;
    const ultimaPagina = Math.ceil(this.totalControlDecitas / this.rowsPerPage);

    if (ultimaPagina === 0) {
      this.montoTotal = 0;
      this.porcentajeSobreMontoTotal = 0;

      this.montoTotalPrimeraComision = 0;
      this.porcentajeSobrePrimerMontoTotal = 0;
      this.montoTotalSegundaComision = 0;
      this.porcentajeSobreSegundoMontoTotal = 0;
      this.montoTotalTerceraComision = 0;
      this.porcentajeSobreTercerMontoTotal = 0;

      return;
    }
  
    const peticiones: Observable<{ montoTotal: any; totalRestar: any; }>[] = [];
    for (let i = 0; i < ultimaPagina; i++) {
      const request = this.controlDeCitasService.getCitasByUser(
        this.idUsuario,
        i + 1,
        this.rowsPerPage,
        this.fechaInicio,
        this.fechaFin,
        this.palabraBusqueda,
        this.pagados,
        null,
        this.mostrarPagadosMensual,
        this.mostrarAbonados ? 1 : null
      ).pipe(
        map((resp: any) => {

          const citasAbonadas = resp.citas.filter((cita: any) => 
            citasAbonadasArray.some((c: any) => c.id === cita.id)
          );

          const childrenAbonados = resp.citas.flatMap((cita: any) => {
            if (cita.children && cita.children.length > 0) {
              // Si tiene children, procesar los hijos
              return cita.children.filter((child: any) =>
                citasAbonadasArray.some((c: any) => c.id === child.id)
              );
            } else {
              // Si no tiene children, procesar el id del padre
              return citasAbonadasArray.some((c: any) => c.id === cita.id) ? [cita] : [];
            }
          });

          //============================================================================
          // const totalRestarPrimeraComision = 0;
          // const totalSegundaPrimeraComision = 0;
          // const totalTerceraPrimeraComision = 0;
          // //console.log("childrenAbonados***********************************************", childrenAbonados)
          // const totalRestar = childrenAbonados.reduce((acc: number, cita: any) => acc + cita.pagoFinal, 0);
          //============================================================================

          let totalRestar = 0;
          let totalRestarComisiones = {
            primera: 0,
            segunda: 0,
            tercera: 0
          };

          childrenAbonados.forEach((cita: any) => {
            totalRestar += cita.pagoFinal;

            if (cita.sesionInicial === 1 && cita.idTipoComision !== 3) {
              totalRestarComisiones.primera += cita.pagoFinal / cita.sesionFinal;
              totalRestarComisiones.segunda += (cita.pagoFinal / cita.sesionFinal) * (cita.sesionFinal - 1);
            } else if (cita.sesionInicial > 1 && cita.idTipoComision !== 3) {
              totalRestarComisiones.segunda += (cita.pagoFinal / cita.sesionFinal) * (cita.sesionFinal - 1);
            } else if (cita.idTipoComision === 3) {
              totalRestarComisiones.tercera += cita.pagoFinal;
            }
          });



          return {
            montoTotal: resp.montoTotal,
            montoTotalPrimeraComsion: resp.montoPrimeraComisionTotal,
            montoTotalSegundaComsion: resp.montoSegundaComisionTotal,
            montoTotalTerceraComsion: resp.montoTercerComisionTotal,
            totalRestar,
            totalRestarComisiones
          };
        })
      );
      peticiones.push(request);
    }
  
    // Usar forkJoin para esperar a que todas las peticiones se completen  |||||  quiero que me reste
    forkJoin(peticiones).subscribe((respuestas: any[]) => {
    //============================================================================
      // montoARestar = respuestas.reduce((acc: number, respuesta: any) => acc + respuesta.totalRestar, 0);

      // montoARestarPrimeraComision = respuestas.reduce((acc: number, respuesta: any) => acc + respuesta.totalRestarComisiones.primera, 0);
      // montoARestarSegundaComision = respuestas.reduce((acc: number, respuesta: any) => acc + respuesta.totalRestarComisiones.segunda, 0);
      // montoARestarTerceraComision = respuestas.reduce((acc: number, respuesta: any) => acc + respuesta.totalRestarComisiones.tercera, 0);
    //============================================================================
      respuestas.forEach((respuesta: any) => {
        montoARestar += respuesta.totalRestar;
        montoARestarPrimeraComision += respuesta.totalRestarComisiones.primera;
        montoARestarSegundaComision += respuesta.totalRestarComisiones.segunda;
        montoARestarTerceraComision += respuesta.totalRestarComisiones.tercera;
      });

      const montoTotalFinal = respuestas[0].montoTotal - montoARestar;

      const montoPrimeraTotalFinal = respuestas[0].montoTotalPrimeraComsion - montoARestarPrimeraComision;
      const montoSegundaTotalFinal = respuestas[0].montoTotalSegundaComsion - montoARestarSegundaComision;
      const montoTerceraTotalFinal = respuestas[0].montoTotalTerceraComsion - montoARestarTerceraComision;
      
      const comision = montoTotalFinal * 0.04;
      
      const primeraComision = montoPrimeraTotalFinal * 0.04;
      const segundaComision = montoSegundaTotalFinal * 0.015;
      const terceraComision = montoTerceraTotalFinal * 0.03;
      const comisionTotal = primeraComision + segundaComision + terceraComision;
      
      this.montoTotal = montoTotalFinal;
      //this.porcentajeSobreMontoTotal = parseFloat(comision.toFixed(1));
      this.porcentajeSobreMontoTotal = parseFloat(comisionTotal.toFixed(1));

      this.montoTotalPrimeraComision = montoPrimeraTotalFinal;
      this.porcentajeSobrePrimerMontoTotal = parseFloat(primeraComision.toFixed(1));;
      this.montoTotalSegundaComision = montoSegundaTotalFinal;
      this.porcentajeSobreSegundoMontoTotal = parseFloat(segundaComision.toFixed(1));;
      this.montoTotalTerceraComision = montoTerceraTotalFinal;
      this.porcentajeSobreTercerMontoTotal = parseFloat(terceraComision.toFixed(1));;
    });
  }
  
  abrirModalEditarPagoFinal(idZona: any, idCita: any, pagoFinal: any){
        const dialogRef = this.dialog.open(EditarPagoFinalDialog, {
          width: '430px',
          data: {
            idZona,
            idCita,
            pagoFinal,
          },
        });
    
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result !== undefined && result >= 0) {
    
            this.controlDeCitasService
              .updateZonaPayment(idZona, result, idCita)
              .subscribe((res: any) => {
                if (res.status !== 200) return;

                this.obtenerControlDeCitas();
              });
          }
        });
  }
  
}
//? MODAL PARA EDITAR PAGO FINAL [mat-dialog-close]="enabled ? montoFinal : data.cita.montoInicial"

@Component({
  selector: 'editar-pago-final-dialog',
  styleUrls: ['../../cita-listado/cita-item-listado/cita-item-listado.component.scss'],
  template: `
    <h1 mat-dialog-title class="text-center m-0">
      EDITAR PAGO FINAL DE CITA
    </h1>
    <h6 class="custom-text">
      Código de Cita {{ idCita }}
    </h6>

    <span class="mySubtitle mb-3">
      <h6>Pago Final Inical</h6>
      <h3>S/. {{ pagoFinalIncial }}</h3></span
    >

    <mat-dialog-content class="mat-typography">
      <section class="content-dialog m-0">
        <mat-form-field appearance="fill">
          <mat-label>Pago Final S/.</mat-label>
          <input matInput [(ngModel)]="pagoFinalEditado" />
          <mat-hint align="start">¿Desea cambiar el pago final? </mat-hint>
        </mat-form-field>

      </section>
    </mat-dialog-content>

    <mat-dialog-actions class="mt-3" align="end">
      <button mat-button (click)=cerrarModal()>Cancelar</button>
      <button
        class="bg-primary"
        mat-button
        [mat-dialog-close]="pagoFinalEditado"
        cdkFocusInitial
      >
        Editar Pago Final
      </button>
    </mat-dialog-actions>
  `,
})
export class EditarPagoFinalDialog {
  pagoFinalIncial: number;
  paciente: string;
  enabled = false;
  idCita: number;
  pagoFinalEditado: number

  constructor(
    public dialogRef: MatDialogRef<EditarPagoFinalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pagoFinalIncial = data.pagoFinal // Valor inicial del monto
    this.paciente = 'data.paciente';
    this.idCita = data.idCita;
  }

  cerrarModal(){
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
