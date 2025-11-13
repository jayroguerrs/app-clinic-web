import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Usuario } from '../../../shared/models/usuario';
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {RAlternativaMedicion} from "../../../shared/interfaces/Response/medicion/alternativa-medicion";
import {AlternativaMedicionService} from "../../../shared/services/alternativa-medicion.service";
import {CitaMedicionService} from "../../../shared/services/cita-medicion.service";
import {CitaMedicion} from "../../../shared/models/CitaMedicion";

@Component({
  selector: 'app-cita-medicion-estado',
  templateUrl: './cita-medicion-estado.component.html',
  styleUrls: ['./cita-medicion-estado.component.scss']
})
export class CitaMedicionEstadoComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() idCita: number;
  @Input() tipoMedicion: number;
  @Input() citaMedicion: CitaMedicion | null;

  usuarioActual: Usuario;
  estadoString: string;



  // Motivos
  loadingAlternativas = false;
  sbcCollectionAlternativas: Subscription;
  alternativas: RAlternativaMedicion[] = [];


  formGroup: FormGroup;
  submitted = false;

  constructor(
    private usuarioService: UsuarioService,
    public utilsService: UtilsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alternativaMedicionService: AlternativaMedicionService,
    private citaMedicionService: CitaMedicionService
  ) {
    this.formGroup = this.formBuilder.group({
      alternativa : new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.obtenerAlternativas();

    this.initValues();
  }

  get f(): any{
    return this.formGroup.controls;
  }

  get data(): any {
    const output = {
      idCita : this.idCita,
      idTipoMedicion : this.tipoMedicion,
      idAlternativaMedicion : parseInt( this.f.alternativa.value, 10),
      idUsuarioRegistro : this.usuarioActual.idUsuario
    };
    return output;
  };

  guardarAlternativa(): void{

    if(this.formGroup.invalid){
      this.utilsService.mostrarToast('Seleccione una opción','warning');
      return;
    }

    this.submitted = true;
    this.formGroup.disable();

    this.spinner.show();
    this.citaMedicionService.guardarMedicion(this.data).subscribe((res) => {
      this.spinner.hide();
      this.formGroup.enable();
      Swal.fire({title: "La encuesta se registro correctamente !!!",icon: 'success',timer: 900, showConfirmButton: false});
      this.modal.close();
    }, (error) => {
      console.log(error);
      this.spinner.hide();
      this.formGroup.enable();
      this.utilsService.mostrarToast('Ocurrio un error','error');
    });

  }
  cerrarModal( result: boolean = false ): void {
    this.modal.close(result);
  }

  // get data
  obtenerAlternativas(): void{

    this.loadingAlternativas = true;
    this.sbcCollectionAlternativas = this.alternativaMedicionService.obtenerAlternativasByTipo( this.tipoMedicion ).subscribe((res) => {
      this.alternativas = res;
    }, error => {
      console.log(error);
    }, () => {
      this.loadingAlternativas = false;
    });
  }

  findAlternativa(idAlternativa: number): RAlternativaMedicion{
    // console.log(this.alternativas);
    return this.alternativas.find( x => x.id === idAlternativa );
  }

  initValues(): void{
    if(this.citaMedicion){
      this.formGroup.patchValue({
        alternativa: this.citaMedicion.idAlternativaMedicion
      })
    }
  }
}
