import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import {SedeService} from "../../shared/services/sede.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { DatePipe } from '@angular/common';
import {IncidenciaTablaComponent} from "./incidencia-tabla/incidencia-tabla.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {IncidenciaModalComponent} from "./incidencia-modal/incidencia-modal.component";
import { ClienteIncidencia } from 'src/app/shared/models/cliente-incidencia';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.scss']
})
export class IncidenciaComponent implements OnInit, AfterViewInit, OnDestroy {

  formGroup: FormGroup;

  sedes: any[] = [];
  selected = false;

  // susbscription
  sbcSedes: Subscription;

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  @ViewChild('tabla') tabla: IncidenciaTablaComponent;
  collection: ClienteIncidencia[] = [];
  sede = 'Todos';


  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;
  constructor(
    private sedeService: SedeService,
    private formBuild: FormBuilder,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private bottomSheet: MatBottomSheet,
    private utilsService: UtilsService,
    private permisoHelper: PermisoHelper    
  ) {
    this.formGroup = this.formBuild.group({
      idSede: new FormControl(0, Validators.required),
      fechaDesde: new FormControl(this.datePipe.transform(new Date,'yyyy-MM-dd'), Validators.required),
      fechaHasta: new FormControl(this.datePipe.transform(new Date,'yyyy-MM-dd'), Validators.required)
    })
  }

  ngOnInit(): void {
    this.collectionSede();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accExf = accesos.accExf;
      this.accImp = accesos.accImp; 
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;  
    });
  }

  ngAfterViewInit(): void {
    this.tabla?.selected.subscribe((res: boolean) => {
      this.selected = res;
    });
    this.tabla?.collection.subscribe((res) =>{
        this.collection = res;
      }
    )
  }

  ngOnDestroy(): void {
    this.sbcSedes?.unsubscribe();
    this.bottomSheet?.dismiss();
  }

  // data
  collectionSede(): void{
    this.sbcSedes = this.sedeService.obtener().subscribe((res) => {
      this.sedes = res;
    }, error => {
      console.log(error);
    })
  }

  // buttons event
  buscar(): void{
    this.sede = this.f.idSede.value ? this.sedes.find(x => x.idSede === parseInt(this.f.idSede.value,10) )?.nombre : 'Todos';

    // console.log(this.sede);
    this.tabla.reload();
  }
  nuevo(): void{
    const modalRef = this.modalService.open(IncidenciaModalComponent,{
      size: 'lg'
    });
    modalRef.result.then((res: boolean) =>{
      if(res){
        this.tabla.reload();
      }
    });
  }
  exportar(): void{
    this.tabla.export();
  }
  editar(): void{

  }

  // getters
  get f(): any{
    return this.formGroup.controls;
  }

  // Bottom sheet
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }
}
